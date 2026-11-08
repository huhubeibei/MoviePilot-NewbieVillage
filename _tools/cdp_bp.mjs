/**
 * CDP 断点定位：在 axios 适配器的 XHR.open 处下断点，命中空 URL 时 dump 完整同步调用链。
 */
import { spawn } from "node:child_process";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const MP = "http://172.16.1.113:3000";
const PORT = 9335;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const profile = mkdtempSync(join(tmpdir(), "nv-bp-"));
const proc = spawn(CHROME, [
  "--headless=new", `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`,
  "--no-first-run", "--disable-gpu", "--window-size=1600,1000", "about:blank",
], { stdio: "ignore" });
process.on("exit", () => { try { proc.kill(); } catch {} });

let targetWs = null;
for (let i = 0; i < 30; i++) {
  try {
    const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
    const page = (await res.json()).find((t) => t.type === "page");
    if (page) { targetWs = page.webSocketDebuggerUrl; break; }
  } catch { await sleep(500); }
}
let ws = new WebSocket(targetWs);
let msgId = 0;
const pending = new Map();
let pausedResolve = null;
ws.addEventListener("message", (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
  } else if (msg.method === "Debugger.paused") {
    pausedResolve?.(msg.params);
  }
});
await new Promise((r) => ws.addEventListener("open", r));
function send(method, params = {}) {
  const id = ++msgId;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });
}
async function evalJs(expression) {
  const r = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || "eval error");
  return r.result?.value;
}

await send("Page.enable");
await send("Runtime.enable");
await send("Debugger.enable");
await send("Network.enable");

console.log("== 打开 MP 并登录 ==");
await send("Page.navigate", { url: MP });
await sleep(4000);
await evalJs(`(() => {
  const set = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
  const u = [...document.querySelectorAll("input")].find(i => i.type !== "password");
  set.call(u, "nvtest"); u.dispatchEvent(new Event("input", { bubbles: true }));
  const p = [...document.querySelectorAll("input")].find(i => i.type === "password");
  set.call(p, "NvTest#2026"); p.dispatchEvent(new Event("input", { bubbles: true }));
  [...document.querySelectorAll("button")].find(b => /登\\s*录|login/i.test(b.textContent))?.click();
  return true;
})()`);
await sleep(4500);
console.log("登录后:", await evalJs("location.href"));

// 登录完成后再下断点（避免页面早期请求触发暂停死锁）
await send("Debugger.setBreakpointByUrl", {
  lineNumber: 3, columnNumber: 441082,
  urlRegex: "main-DOKUfmln\\.js",
});
console.log("断点已挂载");

console.log("== 进入插件页，等待断点命中 ==");
await evalJs(`(() => {
  const link = [...document.querySelectorAll("a")].find(a => a.textContent.includes("影音新手村"));
  link ? link.click() : (location.hash = "#/plugin-app/NewbieVillage/main");
  return true;
})()`);

// 等断点，最多等 30 秒，命中时检查 XHR url
let found = false;
for (let i = 0; i < 30 && !found; i++) {
  const params = await Promise.race([
    new Promise((r) => { pausedResolve = r; }),
    sleep(1000).then(() => null),
  ]);
  if (!params) continue;
  const top = params.callFrames[0];
  let url = "";
  try {
    const r = await send("Debugger.evaluateOnCallFrame", {
      callFrameId: top.callFrameId, expression: "typeof t === 'string' ? t : JSON.stringify(t)", returnByValue: true,
    });
    url = String(r.result?.value ?? "");
  } catch { url = "?"; }
  if (url === "api/v1" || url === "" || url === "null" || url === "undefined") {
    found = true;
    console.log("\\n★★ 命中空 URL 请求，完整同步调用链：");
    for (const [idx, f] of params.callFrames.slice(0, 16).entries()) {
      console.log(`  #${idx} ${f.functionName || "(anon)"}  ${f.url.split("/").pop()}:${f.location.lineNumber}:${f.location.columnNumber}`);
    }
  }
  await send("Debugger.resume");
}
if (!found) console.log("未命中空 URL 断点");
console.log("\\nDONE");
ws.close();
proc.kill();
process.exit(0);
