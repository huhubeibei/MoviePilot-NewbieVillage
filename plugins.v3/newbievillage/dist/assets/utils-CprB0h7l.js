/**
 * 公共工具：响应解包、领域名映射、轻量 markdown 渲染。
 */

/** 解包 MP 插件 API 响应：{success, message, data} → data。 */
function unwrapResponse(response) {
  if (response && Object.prototype.hasOwnProperty.call(response, 'success')) {
    if (response.success === false) throw new Error(response.message || '操作失败')
    return response.data
  }
  return response?.data ?? response
}

/**
 * 解析宿主注入的 api prop，兼容多种形态：
 * 1. axios 实例（有 get/post 方法）→ 直接用；
 * 2. ref/computed（带 .value）→ 解包；
 * 3. 函数形态一律【不调用】——宿主不同 surface 传过绑定后的请求函数，
 *    盲目调用会触发未知副作用（曾打出裸 GET /api/v1/ 的 404 toast）；
 * 4. 都不可用时回退到宿主全局 window.MoviePilotAPI（宿主保证暴露 pluginApi 实例）。
 */
function unwrapApiCandidate(candidate, depth = 0) {
  if (!candidate || depth > 3) return null
  if (typeof candidate === 'function') {
    return null
  }
  if (
    typeof candidate === 'object' &&
    typeof candidate.get !== 'function' &&
    'value' in candidate
  ) {
    return unwrapApiCandidate(candidate.value, depth + 1)
  }
  return candidate
}

function resolveApi(api) {
  const candidate = unwrapApiCandidate(api);
  if (candidate && typeof candidate.get === 'function' && typeof candidate.post === 'function') {
    return candidate
  }
  const globalApi = typeof window !== 'undefined' ? window.MoviePilotAPI : null;
  if (globalApi && typeof globalApi.get === 'function' && typeof globalApi.post === 'function') {
    return globalApi
  }
  return null
}

const DOMAIN_TITLES = {
  video: '影视命名',
  music: '音乐命名',
  pt: 'PT 行为',
  moviepilot: 'MP 概念',
  general: '综合',
};

function domainTitle(domain) {
  return DOMAIN_TITLES[domain] || domain || '综合'
}

function escapeHtml(text) {
  return String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function inline(text) {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code class="text-caption px-1 bg-grey-lighten-3 rounded">\$1</code>')
}

/**
 * 案例正文轻量渲染：仅支持案例用到的子集（h1/h2/列表/段落/粗体/代码），
 * 不引入 markdown 依赖，输出交给 v-html。
 */
function renderCaseMarkdown(md) {
  const lines = String(md ?? '').split(/\r?\n/);
  const out = [];
  let inList = false;
  const closeList = () => {
    if (inList) {
      out.push('</ul>');
      inList = false;
    }
  };
  for (const raw of lines) {
    const line = raw.trimEnd();
    if (/^##\s+/.test(line)) {
      closeList();
      out.push(`<div class="text-subtitle-1 font-weight-bold mt-4 mb-1">${inline(line.slice(3))}</div>`);
    } else if (/^#\s+/.test(line)) {
      closeList();
      out.push(`<div class="text-h6 font-weight-bold mb-2">${inline(line.slice(2))}</div>`);
    } else if (/^[-*]\s+/.test(line)) {
      if (!inList) {
        out.push('<ul class="pl-6 mb-2">');
        inList = true;
      }
      out.push(`<li class="mb-1">${inline(line.slice(2))}</li>`);
    } else if (/^\d+\.\s+/.test(line)) {
      if (!inList) {
        out.push('<ul class="pl-6 mb-2">');
        inList = true;
      }
      out.push(`<li class="mb-1">${inline(line.replace(/^\d+\.\s+/, ''))}</li>`);
    } else if (!line.trim()) {
      closeList();
    } else {
      closeList();
      out.push(`<div class="mb-2 body-2 text-medium-emphasis" style="line-height:1.7">${inline(line)}</div>`);
    }
  }
  closeList();
  return out.join('')
}

export { renderCaseMarkdown as a, domainTitle as d, resolveApi as r, unwrapResponse as u };
