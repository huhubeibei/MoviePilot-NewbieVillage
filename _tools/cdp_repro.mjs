/**
 * CDP 复现脚本：登录 MP → 进入插件页 → 捕获 /api/v1/ 404 的 initiator。
 * 用法：node cdp_repro.mjs
 */
import { spawn } from "node:child_process";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const MP = "http://172.16.1.113:3000";
const USER = "nvtest";
const PASS = "NvTest#2026";
const PORT = 9333;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------- 启动浏览器 ----------
const profile = mkdtempSync(join(tmpdir(), "nv-cdp-"));
const proc = spawn(CHROME, [
  "--headless=new",
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${profile}`,
  "--no-first-run",
  "--disable-gpu",
  "--window-size=1600,1000",
  "about:blank",
], { stdio: "ignore" });

process.on("exit", () => { try { proc.kill(); } catch {} });

// ---------- 等待调试端口 ----------
let targetWs = null;
for (let i = 0; i < 30; i++) {
  try {
    const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
    const targets = await res.json();
    const page = targets.find((t) => t.type === "page");
    if (page) { targetWs = page.webSocketDebuggerUrl; break; }
  } catch { await sleep(500); }
}
if (!targetWs) { console.error("FATAL: 调试端口未就绪"); process.exit(1); }

// ---------- CDP 客户端 ----------
let ws = new WebSocket(targetWs);
let msgId = 0;
const pending = new Map();
const events = [];
ws.addEventListener("message", (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
  } else if (msg.method) {
    events.push(msg);
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
async function evalJs(expression, awaitPromise = false) {
  const r = await send("Runtime.evaluate", { expression, awaitPromise, returnByValue: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || "page eval error");
  return r.result?.value;
}

// ---------- 会话 ----------
await send("Page.enable");
await send("Runtime.enable");
await send("Network.enable");

const netLog = [];
const respLog = new Map();
const consoleLog = [];
events.push = function (msg) {
  if (msg.method === "Network.requestWillBeSent") {
    const r = msg.params.request;
    netLog.push({
      url: r.url,
      method: r.method,
      initiator: msg.params.initiator,
      ts: msg.params.timestamp,
      id: msg.params.requestId,
    });
  } else if (msg.method === "Network.responseReceived") {
    respLog.set(msg.params.requestId, msg.params.response.status);
  } else if (msg.method === "Runtime.consoleAPICalled") {
    const text = (msg.params.args || []).map((a) => a.value ?? a.description ?? "").join(" ");
    if (text.includes("NV-DEBUG")) consoleLog.push(text);
  }
  Array.prototype.push.call(events, msg);
};

console.log("== 打开 MP 登录页 ==");
await send("Page.navigate", { url: MP });
await sleep(4000);

console.log("== 登录 ==");
await evalJs(`(() => {
  const inputs = [...document.querySelectorAll("input")].map(i => ({type: i.type, placeholder: i.placeholder, name: i.name}));
  window.__inputs = inputs;
  return inputs.length;
})()`);
const inputs = await evalJs("window.__inputs");
console.log("inputs:", JSON.stringify(inputs));
const userSel = await evalJs(`(() => {
  const i = [...document.querySelectorAll("input")].find(i => i.type !== "password");
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
  setter.call(i, "${USER}");
  i.dispatchEvent(new Event("input", { bubbles: true }));
  return true;
})()`);
await evalJs(`(() => {
  const i = [...document.querySelectorAll("input")].find(i => i.type === "password");
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
  setter.call(i, "${PASS}");
  i.dispatchEvent(new Event("input", { bubbles: true }));
  return true;
})()`);
await evalJs(`(() => {
  const btn = [...document.querySelectorAll("button")].find(b => /登\s*录|login/i.test(b.textContent)) || document.querySelector("button[type=submit]");
  btn.click();
  return btn.textContent.trim();
})()`);
await sleep(4000);
console.log("登录后 URL:", await evalJs("location.href"));

// ---------- 首页测试：登录后立刻挂钩，停留观察（不进插件页） ----------
await evalJs(`(() => {
  window.__hooked = [];
  const oo = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (m, u) {
    if (String(u) === "api/v1/" || String(u) === "/api/v1/" || String(u) === "api/v1") {
      window.__hooked.push({ kind: "xhr", url: String(u), at: new Date().toISOString().slice(11, 19), stack: (new Error().stack || "").split("\\n").slice(1, 10).join(" | ") });
    }
    return oo.apply(this, arguments);
  };
  return "hook installed";
})()`);

// ---------- 在首页停留，让仪表盘组件挂载并开始轮询 ----------
await sleep(20000);
console.log("首页停留 20s 完成");
const homeHits = await evalJs("window.__hooked").catch(() => []);
console.log("首页裸请求命中:", JSON.stringify(homeHits));

// ---------- 安装请求钩子（带堆栈） ----------
await evalJs(`(() => {
  window.__hooked = [];
  const of = window.fetch;
  window.fetch = function (...args) {
    const url = typeof args[0] === "string" ? args[0] : (args[0] && args[0].url) || "";
    window.__hooked.push({ kind: "fetch", url: String(url), stack: (new Error().stack || "").split("\\n").slice(1, 18).join(" | ") });
    return of.apply(this, args);
  };
  const oo = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (m, u) {
    window.__hooked.push({ kind: "xhr", method: m, url: String(u), stack: (new Error().stack || "").split("\\n").slice(1, 18).join(" | ") });
    return oo.apply(this, arguments);
  };
  // 同步挂钩宿主 pluginApi 实例：空 URL 的调用在发起瞬间抓完整同步堆栈
  const api = window.MoviePilotAPI;
  if (api && api.request && !api.__nvPatched) {
    api.__nvPatched = true;
    const origRequest = api.request.bind(api);
    api.request = function (config, ...rest) {
      const url = config && (config.url ?? null);
      if (url === null || url === undefined || url === "") {
        window.__hooked.push({
          kind: "axios-bare",
          config: JSON.stringify(config)?.slice(0, 400),
          stack: (new Error().stack || "").split("\\n").slice(1, 20).join(" | "),
        });
      }
      return origRequest(config, ...rest);
    };
  }
  return true;
})()`);

// ---------- 进入插件页 ----------
console.log("== 进入插件页（hash 路由） ==");
await evalJs(`(() => {
  const link = [...document.querySelectorAll("a")].find(a => a.textContent.includes("影音新手村"));
  if (link) { link.click(); return "sidebar-link clicked"; }
  location.hash = "#/plugin/NewbieVillage/main";
  return "hash navigation fallback";
})()`);
await sleep(12000);
console.log("插件页 URL:", await evalJs("location.href"));

// ---------- 顺便点一次天梯 ----------
await evalJs(`(() => {
  const btn = [...document.querySelectorAll("button")].find(b => b.textContent.includes("天梯"));
  if (btn) { btn.click(); return "ladder clicked"; }
  return "ladder btn not found";
})()`);
await sleep(3000);

// ---------- 汇总 ----------
console.log("\\n== 页面内钩子捕获（fetch/XHR） ==");
const hooked = await evalJs("window.__hooked").catch(() => []);
for (const h of hooked || []) {
  if (String(h.url).includes("progress")) continue;
  console.log(`[${h.kind}] ${h.url}`);
  if (String(h.url) === "/api/v1/" || String(h.url).endsWith("/api/v1/") || String(h.url).endsWith("api/v1/")) {
    console.log("  ★ STACK:", h.stack);
  }
}

console.log("\\n== NV-DEBUG console 捕获 ==");
for (const c of consoleLog) console.log(c.slice(0, 320));

console.log("\\n== CDP 网络日志（404/401/5xx + 非静态） ==");
for (const n of netLog) {
  const u = n.url.replace("http://172.16.1.113:3000", "");
  if (u.includes("progress") || /\.(png|ico|woff2?|css)(\?|$)/.test(u)) continue;
  const status = respLog.get(n.id) ?? "?";
  if (status === 200 || status === 307 || status === "?") continue;
  console.log(`HTTP ${status} ${u}`);
  if (status === 404 || status === 401) {
    console.log(`  initiator: ${JSON.stringify(n.initiator)}`);
  }
}
console.log("\\nDONE");
ws.close();
proc.kill();
process.exit(0);
