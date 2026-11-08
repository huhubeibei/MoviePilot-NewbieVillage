/**
 * 公共工具：响应解包、领域名映射、轻量 markdown 渲染、解析共享逻辑。
 */

/** 解包 MP 插件 API 响应：{success, message, data} → data。 */
function unwrapResponse(response) {
  if (response && Object.prototype.hasOwnProperty.call(response, 'success')) {
    if (response.success === false) throw new Error(response.message || '操作失败')
    return response.data
  }
  return response?.data ?? response
}

// ---------- 解析共享逻辑（与后端 parse_engine.DIM_* 保持一致） ----------

const DIM_COLORS = {
  episode: 'indigo',
  resolution: 'green',
  source: 'blue',
  vcodec: 'teal',
  audio: 'orange',
  edition: 'deep-purple',
  format: 'green',
  quality: 'teal',
  release_type: 'deep-orange',
  year: 'brown',
  group: 'pink',
};

const DIM_TITLES = {
  episode: '季集',
  resolution: '分辨率',
  source: '来源',
  vcodec: '视频编码',
  audio: '音轨',
  edition: '制式/HDR',
  format: '格式',
  quality: '规格',
  release_type: '发行类型',
  year: '年份',
  group: '发布组',
};

const DIM_ORDER = ['episode', 'resolution', 'source', 'vcodec', 'audio', 'edition', 'format', 'quality', 'release_type', 'year', 'group'];

function dimValues(parsed, dim) {
  return (parsed?.dims?.[dim] || []).map(e => String(e.value))
}

/** 画质档位徽章（影视命名专用）。 */
function tierOf(parsed) {
  if (!parsed || parsed.kind !== 'video') return null
  if ((parsed.warnings || []).length) {
    return { icon: 'mdi-alert-octagon', color: 'error', text: '应急枪版' }
  }
  parsed.dims || {};
  const res = dimValues(parsed, 'resolution').join('|');
  const src = dimValues(parsed, 'source').join('|');
  const is2160 = /2160|4K|UHD/i.test(res);
  const is1080 = /1080/.test(res);
  const highSrc = /REMUX|BDMV/i.test(src);
  const midSrc = /WEB-DL|BluRay|Blu-Ray/i.test(src);
  if (is2160 && highSrc) return { icon: 'mdi-crown-outline', color: 'amber-darken-2', text: '顶配收藏级' }
  if ((is2160 && midSrc) || (is1080 && (midSrc || highSrc))) {
    return { icon: 'mdi-star-outline', color: 'primary', text: '优选主流' }
  }
  if (res || src) return { icon: 'mdi-thumb-up-outline', color: 'success', text: '够用先行' }
  return null
}

/** 体积估算（分辨率 × 来源 查矩阵），返回 {gb, combo} 或 null。 */
function estimateSizeGb(sizeMatrix, parsed) {
  if (!parsed || parsed.kind !== 'video' || !sizeMatrix?.rows || !sizeMatrix?.columns) return null
  parsed.dims || {};
  const res = dimValues(parsed, 'resolution').join(' ');
  const rowKey = /2160|4K|UHD/i.test(res) ? '2160p'
    : /1080/.test(res) ? '1080p'
    : /720/.test(res) ? '720p'
    : /[45]76|480/.test(res) ? '480p'
    : null;
  const srcVals = dimValues(parsed, 'source').join(' ');
  let col = null;
  if (/枪版|CAM|TeleSync/i.test(srcVals)) col = '枪版';
  else if (/REMUX/i.test(srcVals)) col = 'REMUX';
  else if (/BDMV|原盘/i.test(srcVals)) col = 'BDMV 原盘';
  else if (/HDTV/i.test(srcVals)) col = 'HDTV';
  else if (/BluRay|Blu-Ray|蓝光/i.test(srcVals)) col = 'BluRay 转码';
  else if (/WEB-DL|WEBRip|流媒体/i.test(srcVals)) col = 'WEB-DL';
  if (!rowKey || !col || !sizeMatrix.columns.includes(col)) return null
  const val = sizeMatrix.rows?.[rowKey]?.[sizeMatrix.columns.indexOf(col)];
  return val != null ? { gb: val, combo: `${rowKey} × ${col}` } : null
}

/** 重命名预览（推断展示，非 MP 实际模板）。 */
function renamePreviewOf(parsed) {
  if (!parsed || parsed.kind !== 'video') return null
  const dims = parsed.dims || {};
  const title = parsed.title_hint || '';
  const year = dims.year?.[0]?.value || '';
  if (!title) return null
  const quality = dimValues(parsed, 'resolution')[0] || '';
  const episodeHit = dims.episode?.[0]?.value || '';
  const seasonMatch = episodeHit.match(/S(\d{1,2})/);
  const epMatch = episodeHit.match(/E(\d{1,3})/);
  const name = quality ? `${title} - ${quality}` : title;
  if (episodeHit && epMatch) {
    const season = seasonMatch ? seasonMatch[1].padStart(2, '0') : '01';
    const ep = epMatch[1].padStart(2, '0');
    return `${title}${year ? ` (${year})` : ''}/Season ${season}/${name} - S${season}E${ep}.mkv`
  }
  return `${title}${year ? ` (${year})` : ''}/${name}${year ? ` (${year})` : ''}.mkv`
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

export { DIM_TITLES as D, DIM_ORDER as a, DIM_COLORS as b, renamePreviewOf as c, domainTitle as d, estimateSizeGb as e, renderCaseMarkdown as f, resolveApi as r, tierOf as t, unwrapResponse as u };
