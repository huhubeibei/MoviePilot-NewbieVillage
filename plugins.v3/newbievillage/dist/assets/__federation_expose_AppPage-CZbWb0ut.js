import { importShared } from './__federation_fn_import-JrT3xvdd.js';
import { r as resolveApi, d as domainTitle, u as unwrapResponse, a as renderCaseMarkdown } from './utils-CZzYmT1-.js';

const {createTextVNode:_createTextVNode$5,resolveComponent:_resolveComponent$5,withCtx:_withCtx$5,createVNode:_createVNode$5,renderList:_renderList$5,Fragment:_Fragment$5,openBlock:_openBlock$5,createElementBlock:_createElementBlock$5,toDisplayString:_toDisplayString$5,normalizeClass:_normalizeClass$1,createElementVNode:_createElementVNode$4,normalizeStyle:_normalizeStyle,createBlock:_createBlock$5,unref:_unref$3,createCommentVNode:_createCommentVNode$3} = await importShared('vue');


const _hoisted_1$4 = ["onClick"];
const _hoisted_2$3 = {
  class: "text-caption text-medium-emphasis",
  style: {"line-height":"1.4"}
};
const _hoisted_3$3 = { class: "font-weight-medium" };
const _hoisted_4$3 = {
  key: 1,
  class: "text-disabled"
};


const _sfc_main$5 = {
  __name: 'LadderView',
  props: {
  ladders: { type: Object, default: () => ({}) },
  sizeMatrix: { type: Object, default: () => ({}) },
},
  emits: ['open-term'],
  setup(__props, { emit: __emit }) {

// 画质/规格天梯视图：双天梯 + 音乐规格梯 + 体积参考矩阵。
// 数据来自词典服务的 ladders/size_matrix（远端可更新）。
const props = __props;

const ladderOrder = ['video_resolution', 'video_source', 'music_quality'];
const ladderMeta = {
  video_resolution: { icon: 'mdi-wallpaper', color: 'green' },
  video_source: { icon: 'mdi-source-branch', color: 'blue' },
  music_quality: { icon: 'mdi-music-note', color: 'teal' },
};

function ladderList(key) {
  return props.ladders?.[key]?.items || []
}

function shade(index, total) {
  // 越往后（越高档）背景越实：返回 vuetify 色深后缀
  const steps = ['lighten-5', 'lighten-4', 'lighten-3', 'lighten-2', 'lighten-1', ''];
  return steps[Math.min(steps.length - 1, Math.floor((index / Math.max(1, total - 1)) * (steps.length - 1)))]
}

const matrixRows = computed(() => {
  const m = props.sizeMatrix;
  if (!m?.rows || !m?.columns) return []
  return Object.entries(m.rows).map(([res, values]) => ({
    res,
    cells: (m.columns || []).map((_, i) => values?.[i] ?? null),
  }))
});

return (_ctx, _cache) => {
  const _component_VAlert = _resolveComponent$5("VAlert");
  const _component_VIcon = _resolveComponent$5("VIcon");
  const _component_VCardTitle = _resolveComponent$5("VCardTitle");
  const _component_VCardItem = _resolveComponent$5("VCardItem");
  const _component_VCardText = _resolveComponent$5("VCardText");
  const _component_VCard = _resolveComponent$5("VCard");
  const _component_VCol = _resolveComponent$5("VCol");
  const _component_VRow = _resolveComponent$5("VRow");
  const _component_VTable = _resolveComponent$5("VTable");

  return (_openBlock$5(), _createElementBlock$5("div", null, [
    _createVNode$5(_component_VAlert, {
      type: "info",
      variant: "tonal",
      density: "compact",
      class: "mb-4"
    }, {
      default: _withCtx$5(() => [...(_cache[0] || (_cache[0] = [
        _createTextVNode$5(" 天梯只讲「维度内」的高低——分辨率和来源是两回事：2160p 的 WEB-DL 未必比 1080p 的 REMUX 好。 点击天梯项可查看对应词条。 ", -1)
      ]))]),
      _: 1
    }),
    (_openBlock$5(), _createElementBlock$5(_Fragment$5, null, _renderList$5(ladderOrder, (key) => {
      return _createVNode$5(_component_VRow, { key: key }, {
        default: _withCtx$5(() => [
          _createVNode$5(_component_VCol, { cols: "12" }, {
            default: _withCtx$5(() => [
              _createVNode$5(_component_VCard, { variant: "outlined" }, {
                default: _withCtx$5(() => [
                  _createVNode$5(_component_VCardItem, { class: "pb-1" }, {
                    prepend: _withCtx$5(() => [
                      _createVNode$5(_component_VIcon, {
                        icon: ladderMeta[key]?.icon || 'mdi-stairs',
                        color: "primary"
                      }, null, 8, ["icon"])
                    ]),
                    default: _withCtx$5(() => [
                      _createVNode$5(_component_VCardTitle, { class: "text-subtitle-1 font-weight-bold" }, {
                        default: _withCtx$5(() => [
                          _createTextVNode$5(_toDisplayString$5(__props.ladders[key]?.title || key), 1)
                        ]),
                        _: 2
                      }, 1024)
                    ]),
                    _: 2
                  }, 1024),
                  _createVNode$5(_component_VCardText, { class: "text-caption text-medium-emphasis pb-2" }, {
                    default: _withCtx$5(() => [
                      _createTextVNode$5(_toDisplayString$5(__props.ladders[key]?.note), 1)
                    ]),
                    _: 2
                  }, 1024),
                  _createVNode$5(_component_VCardText, { class: "pt-0" }, {
                    default: _withCtx$5(() => [
                      (_openBlock$5(true), _createElementBlock$5(_Fragment$5, null, _renderList$5(ladderList(key), (item, i) => {
                        return (_openBlock$5(), _createBlock$5(_component_VRow, {
                          key: item.label,
                          dense: "",
                          align: "center"
                        }, {
                          default: _withCtx$5(() => [
                            _createVNode$5(_component_VCol, { cols: "12" }, {
                              default: _withCtx$5(() => [
                                _createVNode$5(_component_VCard, {
                                  color: ladderMeta[key]?.color,
                                  variant: i === ladderList(key).length - 1 ? 'tonal' : 'flat',
                                  class: _normalizeClass$1(['py-1', 'px-3', 'd-flex', 'align-center', i === ladderList(key).length - 1 ? '' : 'bg-' + (ladderMeta[key]?.color || 'grey') + '-' + shade(i, ladderList(key).length)]),
                                  style: _normalizeStyle(i === ladderList(key).length - 1 ? 'border: 1px solid currentColor' : ''),
                                  flat: ""
                                }, {
                                  default: _withCtx$5(() => [
                                    _createVNode$5(_component_VIcon, {
                                      size: "small",
                                      icon: i === ladderList(key).length - 1 ? 'mdi-crown-outline' : 'mdi-stairs-up',
                                      class: "mr-2 flex-shrink-0"
                                    }, null, 8, ["icon"]),
                                    _createElementVNode$4("span", {
                                      class: _normalizeClass$1(["font-weight-medium mr-2", { 'cursor-pointer text-decoration-underline': item.ref }]),
                                      style: {"white-space":"nowrap"},
                                      onClick: $event => (item.ref && _ctx.$emit('open-term', item.ref))
                                    }, _toDisplayString$5(item.label), 11, _hoisted_1$4),
                                    _createElementVNode$4("span", _hoisted_2$3, _toDisplayString$5(item.desc), 1)
                                  ]),
                                  _: 2
                                }, 1032, ["color", "variant", "class", "style"])
                              ]),
                              _: 2
                            }, 1024)
                          ]),
                          _: 2
                        }, 1024))
                      }), 128))
                    ]),
                    _: 2
                  }, 1024)
                ]),
                _: 2
              }, 1024)
            ]),
            _: 2
          }, 1024)
        ]),
        _: 2
      }, 1024)
    }), 64)),
    (__props.sizeMatrix?.rows)
      ? (_openBlock$5(), _createBlock$5(_component_VCard, {
          key: 0,
          variant: "outlined"
        }, {
          default: _withCtx$5(() => [
            _createVNode$5(_component_VCardItem, { class: "pb-1" }, {
              prepend: _withCtx$5(() => [
                _createVNode$5(_component_VIcon, {
                  icon: "mdi-database-outline",
                  color: "orange"
                })
              ]),
              default: _withCtx$5(() => [
                _createVNode$5(_component_VCardTitle, { class: "text-subtitle-1 font-weight-bold" }, {
                  default: _withCtx$5(() => [...(_cache[1] || (_cache[1] = [
                    _createTextVNode$5("单部电影典型体积参考（估算）", -1)
                  ]))]),
                  _: 1
                })
              ]),
              _: 1
            }),
            _createVNode$5(_component_VCardText, { class: "text-caption text-medium-emphasis pb-2" }, {
              default: _withCtx$5(() => [
                _createTextVNode$5(_toDisplayString$5(__props.sizeMatrix?.note), 1)
              ]),
              _: 1
            }),
            _createVNode$5(_component_VCardText, { class: "pt-0 overflow-x-auto" }, {
              default: _withCtx$5(() => [
                _createVNode$5(_component_VTable, { density: "compact" }, {
                  default: _withCtx$5(() => [
                    _createElementVNode$4("thead", null, [
                      _createElementVNode$4("tr", null, [
                        _cache[2] || (_cache[2] = _createElementVNode$4("th", { class: "text-left" }, "分辨率 \\ 来源", -1)),
                        (_openBlock$5(true), _createElementBlock$5(_Fragment$5, null, _renderList$5(__props.sizeMatrix.columns, (col) => {
                          return (_openBlock$5(), _createElementBlock$5("th", {
                            key: col,
                            class: "text-left"
                          }, _toDisplayString$5(col), 1))
                        }), 128))
                      ])
                    ]),
                    _createElementVNode$4("tbody", null, [
                      (_openBlock$5(true), _createElementBlock$5(_Fragment$5, null, _renderList$5(_unref$3(matrixRows), (row) => {
                        return (_openBlock$5(), _createElementBlock$5("tr", {
                          key: row.res
                        }, [
                          _createElementVNode$4("td", _hoisted_3$3, _toDisplayString$5(row.res), 1),
                          (_openBlock$5(true), _createElementBlock$5(_Fragment$5, null, _renderList$5(row.cells, (cell, i) => {
                            return (_openBlock$5(), _createElementBlock$5("td", { key: i }, [
                              (cell !== null)
                                ? (_openBlock$5(), _createElementBlock$5(_Fragment$5, { key: 0 }, [
                                    _createTextVNode$5(_toDisplayString$5(cell) + " " + _toDisplayString$5(__props.sizeMatrix.unit), 1)
                                  ], 64))
                                : (_openBlock$5(), _createElementBlock$5("span", _hoisted_4$3, "—"))
                            ]))
                          }), 128))
                        ]))
                      }), 128))
                    ])
                  ]),
                  _: 1
                })
              ]),
              _: 1
            })
          ]),
          _: 1
        }))
      : _createCommentVNode$3("", true)
  ]))
}
}

};

const {toDisplayString:_toDisplayString$4,createTextVNode:_createTextVNode$4,resolveComponent:_resolveComponent$4,withCtx:_withCtx$4,createVNode:_createVNode$4,openBlock:_openBlock$4,createBlock:_createBlock$4,createCommentVNode:_createCommentVNode$2,renderList:_renderList$4,Fragment:_Fragment$4,createElementBlock:_createElementBlock$4,unref:_unref$2,createElementVNode:_createElementVNode$3} = await importShared('vue');


const _hoisted_1$3 = ["onClick"];
const _hoisted_2$2 = { class: "mt-1 d-flex ga-1 flex-wrap" };
const _hoisted_3$2 = { class: "d-flex align-center flex-wrap ga-2" };
const _hoisted_4$2 = { class: "text-h6 font-weight-bold" };
const _hoisted_5$1 = {
  key: 0,
  class: "text-caption text-medium-emphasis mt-1"
};
const _hoisted_6$1 = {
  class: "text-body-1 mb-4",
  style: {"line-height":"1.8"}
};
const _hoisted_7$1 = {
  class: "text-body-2",
  style: {"line-height":"1.9","white-space":"pre-wrap"}
};
const _hoisted_8$1 = { class: "font-weight-medium" };
const _hoisted_9$1 = {
  key: 0,
  class: "text-medium-emphasis"
};

const {computed: computed$3,onMounted: onMounted$2,ref: ref$3} = await importShared('vue');

const EXPANDED_KEY = 'nv_dict_expanded_groups';


const _sfc_main$4 = {
  __name: 'DictView',
  props: {
  api: { type: Object, default: () => ({}) },
  pluginId: { type: String, default: 'NewbieVillage' },
},
  setup(__props) {

const props = __props;

const loading = ref$3(false);
const error = ref$3('');
const q = ref$3('');
const domain = ref$3('');
const view = ref$3('terms');
const data = ref$3({ terms: [], version: 0, source: '', count: 0, ladders: {}, size_matrix: {} });
const selected = ref$3(null);

const domains = [
  { key: '', title: '全部' },
  { key: 'video', title: '影视命名' },
  { key: 'music', title: '音乐命名' },
  { key: 'pt', title: 'PT 行为' },
  { key: 'moviepilot', title: 'MP 概念' },
];

// 分组折叠状态：默认全部收起（用户选择），localStorage 记忆展开过的组
function loadExpandedGroups() {
  try {
    return new Set(JSON.parse(localStorage.getItem(EXPANDED_KEY) || '[]'))
  } catch {
    return new Set()
  }
}

const expandedGroups = ref$3(loadExpandedGroups());

const GROUP_ORDER = ['分辨率', '来源', '视频编码', '音轨', 'HDR/制式', '版本', '字幕', '季集与识别', '封装与识别', '格式', '规格', '发行形态', '来源', '工具与概念'];
const GROUP_ICONS = {
  分辨率: 'mdi-wallpaper',
  来源: 'mdi-source-branch',
  视频编码: 'mdi-chip',
  音轨: 'mdi-speaker',
  'HDR/制式': 'mdi-brightness-6',
  版本: 'mdi-tag-multiple',
  字幕: 'mdi-subtitles-outline',
  季集与识别: 'mdi-television-classic',
  封装与识别: 'mdi-package-variant',
  格式: 'mdi-file-music-outline',
  规格: 'mdi-tune-variant',
  发行形态: 'mdi-album',
  工具与概念: 'mdi-tools',
};

const pluginBase = computed$3(() => `plugin/${props.pluginId}`);
const apiClient = computed$3(() => resolveApi(props.api));

const filtered = computed$3(() => {
  const kw = q.value.trim().toLowerCase();
  return data.value.terms.filter(t => {
    if (domain.value && t.domain !== domain.value) return false
    if (!kw) return true
    const hay = [t.term, ...(t.aliases || []), t.one_line, ...(t.tags || [])]
      .join(' ')
      .toLowerCase();
    return hay.includes(kw)
  })
});

// 分组分节：有 group 的词条按组聚合（组序按 GROUP_ORDER），无组的归入「其他」
const grouped = computed$3(() => {
  const groups = new Map();
  for (const term of filtered.value) {
    const key = term.group || '';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(term);
  }
  const keys = [...groups.keys()].sort((a, b) => {
    if (!a) return 1
    if (!b) return -1
    return GROUP_ORDER.indexOf(a) - GROUP_ORDER.indexOf(b)
  });
  return keys.map(key => ({
    name: key || '其他',
    icon: GROUP_ICONS[key] || 'mdi-bookmark-outline',
    terms: groups.get(key),
  }))
});

const hasGrouping = computed$3(() => filtered.value.some(t => t.group));

const searching = computed$3(() => q.value.trim().length > 0);

function isGroupExpanded(name) {
  // 搜索时强制全部展开，避免命中结果被折叠
  if (searching.value) return true
  return expandedGroups.value.has(name)
}

function toggleGroup(name) {
  const next = new Set(expandedGroups.value);
  if (next.has(name)) {
    next.delete(name);
  } else {
    next.add(name);
  }
  expandedGroups.value = next;
  try {
    localStorage.setItem(EXPANDED_KEY, JSON.stringify([...next]));
  } catch {
    /* localStorage 不可用时折叠状态仅本次会话生效 */
  }
}

const termByRef = computed$3(() => {
  const map = {};
  for (const t of data.value.terms) {
    map[t.term] = t;
    for (const a of t.aliases || []) {
      if (!(a in map)) map[a] = t;
    }
  }
  return map
});

async function load() {
  loading.value = true;
  error.value = '';
  try {
    const client = apiClient.value;
    if (!client) throw new Error('宿主 API 客户端不可用，请刷新页面重试')
    data.value = unwrapResponse(await client.get(`${pluginBase.value}/dict`)) || { terms: [] };
  } catch (err) {
    error.value = err.message || String(err);
  } finally {
    loading.value = false;
  }
}

function openTerm(term) {
  selected.value = term;
}

function openByRef(refName) {
  if (refName && termByRef.value[refName]) {
    selected.value = termByRef.value[refName];
  }
}

function closeTerm() {
  selected.value = null;
}

onMounted$2(load);

return (_ctx, _cache) => {
  const _component_VBtn = _resolveComponent$4("VBtn");
  const _component_VAlert = _resolveComponent$4("VAlert");
  const _component_VTextField = _resolveComponent$4("VTextField");
  const _component_VChip = _resolveComponent$4("VChip");
  const _component_VChipGroup = _resolveComponent$4("VChipGroup");
  const _component_VSpacer = _resolveComponent$4("VSpacer");
  const _component_VIcon = _resolveComponent$4("VIcon");
  const _component_VBtnToggle = _resolveComponent$4("VBtnToggle");
  const _component_VRow = _resolveComponent$4("VRow");
  const _component_VProgressLinear = _resolveComponent$4("VProgressLinear");
  const _component_VEmptyState = _resolveComponent$4("VEmptyState");
  const _component_VDivider = _resolveComponent$4("VDivider");
  const _component_VCardTitle = _resolveComponent$4("VCardTitle");
  const _component_VCardItem = _resolveComponent$4("VCardItem");
  const _component_VCardText = _resolveComponent$4("VCardText");
  const _component_VCard = _resolveComponent$4("VCard");
  const _component_VCol = _resolveComponent$4("VCol");
  const _component_VCode = _resolveComponent$4("VCode");
  const _component_VCardActions = _resolveComponent$4("VCardActions");
  const _component_VDialog = _resolveComponent$4("VDialog");

  return (_openBlock$4(), _createElementBlock$4("div", null, [
    (error.value)
      ? (_openBlock$4(), _createBlock$4(_component_VAlert, {
          key: 0,
          type: "error",
          variant: "tonal",
          class: "mb-4",
          density: "compact"
        }, {
          default: _withCtx$4(() => [
            _createTextVNode$4(_toDisplayString$4(error.value) + " ", 1),
            _createVNode$4(_component_VBtn, {
              size: "small",
              variant: "text",
              color: "white",
              class: "ml-2",
              onClick: load
            }, {
              default: _withCtx$4(() => [...(_cache[3] || (_cache[3] = [
                _createTextVNode$4("重试", -1)
              ]))]),
              _: 1
            })
          ]),
          _: 1
        }))
      : _createCommentVNode$2("", true),
    _createVNode$4(_component_VRow, {
      class: "mb-2",
      align: "center",
      "no-gutters": ""
    }, {
      default: _withCtx$4(() => [
        (view.value === 'terms')
          ? (_openBlock$4(), _createBlock$4(_component_VTextField, {
              key: 0,
              modelValue: q.value,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => ((q).value = $event)),
              "prepend-inner-icon": "mdi-magnify",
              placeholder: "搜索术语、别名、释义关键词（英文术语直接输，如 flac）…",
              variant: "outlined",
              density: "comfortable",
              "hide-details": "",
              clearable: "",
              class: "mr-4",
              "max-width": "26rem"
            }, null, 8, ["modelValue"]))
          : _createCommentVNode$2("", true),
        (view.value === 'terms')
          ? (_openBlock$4(), _createBlock$4(_component_VChipGroup, {
              key: 1,
              modelValue: domain.value,
              "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => ((domain).value = $event)),
              mandatory: "",
              column: ""
            }, {
              default: _withCtx$4(() => [
                (_openBlock$4(), _createElementBlock$4(_Fragment$4, null, _renderList$4(domains, (d) => {
                  return _createVNode$4(_component_VChip, {
                    key: d.key,
                    value: d.key,
                    filter: "",
                    variant: "outlined",
                    color: "primary",
                    class: "mr-2"
                  }, {
                    default: _withCtx$4(() => [
                      _createTextVNode$4(_toDisplayString$4(d.title), 1)
                    ]),
                    _: 2
                  }, 1032, ["value"])
                }), 64))
              ]),
              _: 1
            }, 8, ["modelValue"]))
          : _createCommentVNode$2("", true),
        _createVNode$4(_component_VSpacer),
        _createVNode$4(_component_VBtnToggle, {
          modelValue: view.value,
          "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => ((view).value = $event)),
          mandatory: "",
          density: "comfortable",
          variant: "outlined",
          color: "primary"
        }, {
          default: _withCtx$4(() => [
            _createVNode$4(_component_VBtn, {
              value: "terms",
              size: "small"
            }, {
              default: _withCtx$4(() => [
                _createVNode$4(_component_VIcon, {
                  start: "",
                  size: "small",
                  icon: "mdi-book-open-variant"
                }),
                _cache[4] || (_cache[4] = _createTextVNode$4(" 词条 ", -1))
              ]),
              _: 1
            }),
            _createVNode$4(_component_VBtn, {
              value: "ladder",
              size: "small"
            }, {
              default: _withCtx$4(() => [
                _createVNode$4(_component_VIcon, {
                  start: "",
                  size: "small",
                  icon: "mdi-stairs"
                }),
                _cache[5] || (_cache[5] = _createTextVNode$4(" 天梯 ", -1))
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["modelValue"])
      ]),
      _: 1
    }),
    (loading.value)
      ? (_openBlock$4(), _createBlock$4(_component_VProgressLinear, {
          key: 1,
          indeterminate: "",
          color: "primary",
          class: "mb-2"
        }))
      : _createCommentVNode$2("", true),
    (view.value === 'ladder' && !loading.value)
      ? (_openBlock$4(), _createBlock$4(_sfc_main$5, {
          key: 2,
          ladders: data.value.ladders,
          "size-matrix": data.value.size_matrix,
          onOpenTerm: openByRef
        }, null, 8, ["ladders", "size-matrix"]))
      : (view.value === 'terms' && !loading.value)
        ? (_openBlock$4(), _createElementBlock$4(_Fragment$4, { key: 3 }, [
            (!filtered.value.length)
              ? (_openBlock$4(), _createBlock$4(_component_VEmptyState, {
                  key: 0,
                  icon: "mdi-book-search-outline",
                  headline: "没有找到匹配的词条",
                  text: "换个关键词，或切换领域筛选再试试"
                }))
              : _createCommentVNode$2("", true),
            (_openBlock$4(true), _createElementBlock$4(_Fragment$4, null, _renderList$4(grouped.value, (group) => {
              return (_openBlock$4(), _createElementBlock$4("div", {
                key: group.name,
                class: "mb-4"
              }, [
                (group.name !== '其他' && hasGrouping.value)
                  ? (_openBlock$4(), _createElementBlock$4("div", {
                      key: 0,
                      class: "text-subtitle-2 font-weight-bold mb-2 d-flex align-center cursor-pointer",
                      style: {"user-select":"none"},
                      onClick: $event => (toggleGroup(group.name))
                    }, [
                      _createVNode$4(_component_VIcon, {
                        size: "small",
                        icon: isGroupExpanded(group.name) ? 'mdi-chevron-down' : 'mdi-chevron-right',
                        class: "mr-1"
                      }, null, 8, ["icon"]),
                      _createVNode$4(_component_VIcon, {
                        size: "small",
                        icon: group.icon,
                        color: "primary",
                        class: "mr-1"
                      }, null, 8, ["icon"]),
                      _createTextVNode$4(" " + _toDisplayString$4(group.name) + " ", 1),
                      _createVNode$4(_component_VChip, {
                        size: "x-small",
                        variant: "tonal",
                        class: "ml-2"
                      }, {
                        default: _withCtx$4(() => [
                          _createTextVNode$4(_toDisplayString$4(group.terms.length), 1)
                        ]),
                        _: 2
                      }, 1024),
                      _createVNode$4(_component_VDivider, {
                        class: "ml-3",
                        style: {"flex":"1"}
                      })
                    ], 8, _hoisted_1$3))
                  : _createCommentVNode$2("", true),
                (group.name === '其他' || !hasGrouping.value || isGroupExpanded(group.name))
                  ? (_openBlock$4(), _createBlock$4(_component_VRow, { key: 1 }, {
                      default: _withCtx$4(() => [
                        (_openBlock$4(true), _createElementBlock$4(_Fragment$4, null, _renderList$4(group.terms, (term) => {
                          return (_openBlock$4(), _createBlock$4(_component_VCol, {
                            key: term.term + term.domain,
                            cols: "12",
                            sm: "6",
                            md: "4"
                          }, {
                            default: _withCtx$4(() => [
                              _createVNode$4(_component_VCard, {
                                variant: "outlined",
                                hover: "",
                                class: "h-100 d-flex flex-column",
                                onClick: $event => (openTerm(term))
                              }, {
                                default: _withCtx$4(() => [
                                  _createVNode$4(_component_VCardItem, null, {
                                    default: _withCtx$4(() => [
                                      _createVNode$4(_component_VCardTitle, { class: "text-body-1 font-weight-bold" }, {
                                        default: _withCtx$4(() => [
                                          _createTextVNode$4(_toDisplayString$4(term.term), 1)
                                        ]),
                                        _: 2
                                      }, 1024),
                                      _createElementVNode$3("div", _hoisted_2$2, [
                                        _createVNode$4(_component_VChip, {
                                          text: _unref$2(domainTitle)(term.domain),
                                          size: "x-small",
                                          color: "primary",
                                          variant: "tonal"
                                        }, null, 8, ["text"]),
                                        (term.group)
                                          ? (_openBlock$4(), _createBlock$4(_component_VChip, {
                                              key: 0,
                                              text: term.group,
                                              size: "x-small",
                                              variant: "outlined"
                                            }, null, 8, ["text"]))
                                          : _createCommentVNode$2("", true)
                                      ])
                                    ]),
                                    _: 2
                                  }, 1024),
                                  _createVNode$4(_component_VCardText, { class: "text-body-2 text-medium-emphasis pb-3" }, {
                                    default: _withCtx$4(() => [
                                      _createTextVNode$4(_toDisplayString$4(term.one_line), 1)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ]),
                                _: 2
                              }, 1032, ["onClick"])
                            ]),
                            _: 2
                          }, 1024))
                        }), 128))
                      ]),
                      _: 2
                    }, 1024))
                  : _createCommentVNode$2("", true)
              ]))
            }), 128))
          ], 64))
        : _createCommentVNode$2("", true),
    _createVNode$4(_component_VDialog, {
      "model-value": !!selected.value,
      "max-width": "46rem",
      scrollable: "",
      "onUpdate:modelValue": closeTerm
    }, {
      default: _withCtx$4(() => [
        (selected.value)
          ? (_openBlock$4(), _createBlock$4(_component_VCard, { key: 0 }, {
              default: _withCtx$4(() => [
                _createVNode$4(_component_VCardItem, null, {
                  default: _withCtx$4(() => [
                    _createElementVNode$3("div", _hoisted_3$2, [
                      _createElementVNode$3("span", _hoisted_4$2, _toDisplayString$4(selected.value.term), 1),
                      _createVNode$4(_component_VChip, {
                        size: "small",
                        color: "primary",
                        variant: "tonal"
                      }, {
                        default: _withCtx$4(() => [
                          _createTextVNode$4(_toDisplayString$4(_unref$2(domainTitle)(selected.value.domain)), 1)
                        ]),
                        _: 1
                      }),
                      (selected.value.group)
                        ? (_openBlock$4(), _createBlock$4(_component_VChip, {
                            key: 0,
                            size: "small",
                            variant: "outlined"
                          }, {
                            default: _withCtx$4(() => [
                              _createTextVNode$4(_toDisplayString$4(selected.value.group), 1)
                            ]),
                            _: 1
                          }))
                        : _createCommentVNode$2("", true),
                      (_openBlock$4(true), _createElementBlock$4(_Fragment$4, null, _renderList$4(selected.value.tags || [], (tag) => {
                        return (_openBlock$4(), _createBlock$4(_component_VChip, {
                          key: tag,
                          size: "small",
                          variant: "outlined"
                        }, {
                          default: _withCtx$4(() => [
                            _createTextVNode$4(_toDisplayString$4(tag), 1)
                          ]),
                          _: 2
                        }, 1024))
                      }), 128))
                    ]),
                    ((selected.value.aliases || []).length)
                      ? (_openBlock$4(), _createElementBlock$4("div", _hoisted_5$1, " 别名：" + _toDisplayString$4(selected.value.aliases.join(' / ')), 1))
                      : _createCommentVNode$2("", true)
                  ]),
                  _: 1
                }),
                _createVNode$4(_component_VDivider),
                _createVNode$4(_component_VCardText, { style: {"max-height":"60vh"} }, {
                  default: _withCtx$4(() => [
                    _createElementVNode$3("div", _hoisted_6$1, _toDisplayString$4(selected.value.one_line), 1),
                    _createElementVNode$3("div", _hoisted_7$1, _toDisplayString$4(selected.value.detail), 1),
                    ((selected.value.examples || []).length)
                      ? (_openBlock$4(), _createElementBlock$4(_Fragment$4, { key: 0 }, [
                          _cache[6] || (_cache[6] = _createElementVNode$3("div", { class: "text-subtitle-2 font-weight-bold mt-4 mb-2" }, "命名示例", -1)),
                          (_openBlock$4(true), _createElementBlock$4(_Fragment$4, null, _renderList$4(selected.value.examples, (ex) => {
                            return (_openBlock$4(), _createBlock$4(_component_VCode, {
                              key: ex,
                              class: "d-block pa-2 mb-2 text-caption",
                              style: {"white-space":"pre-wrap","word-break":"break-all"}
                            }, {
                              default: _withCtx$4(() => [
                                _createTextVNode$4(_toDisplayString$4(ex), 1)
                              ]),
                              _: 2
                            }, 1024))
                          }), 128))
                        ], 64))
                      : _createCommentVNode$2("", true),
                    ((selected.value.related_mp_settings || []).length)
                      ? (_openBlock$4(), _createElementBlock$4(_Fragment$4, { key: 1 }, [
                          _cache[7] || (_cache[7] = _createElementVNode$3("div", { class: "text-subtitle-2 font-weight-bold mt-4 mb-2" }, "在 MoviePilot 中的相关设置", -1)),
                          (_openBlock$4(true), _createElementBlock$4(_Fragment$4, null, _renderList$4(selected.value.related_mp_settings, (s) => {
                            return (_openBlock$4(), _createElementBlock$4("div", {
                              key: s.label,
                              class: "mb-2 text-body-2"
                            }, [
                              _createVNode$4(_component_VIcon, {
                                size: "small",
                                icon: "mdi-cog-outline",
                                class: "mr-1"
                              }),
                              _createElementVNode$3("span", _hoisted_8$1, _toDisplayString$4(s.label), 1),
                              (s.hint)
                                ? (_openBlock$4(), _createElementBlock$4("span", _hoisted_9$1, " — " + _toDisplayString$4(s.hint), 1))
                                : _createCommentVNode$2("", true)
                            ]))
                          }), 128))
                        ], 64))
                      : _createCommentVNode$2("", true)
                  ]),
                  _: 1
                }),
                _createVNode$4(_component_VCardActions, null, {
                  default: _withCtx$4(() => [
                    _createVNode$4(_component_VSpacer),
                    _createVNode$4(_component_VBtn, {
                      variant: "text",
                      onClick: closeTerm
                    }, {
                      default: _withCtx$4(() => [...(_cache[8] || (_cache[8] = [
                        _createTextVNode$4("关闭", -1)
                      ]))]),
                      _: 1
                    })
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }))
          : _createCommentVNode$2("", true)
      ]),
      _: 1
    }, 8, ["model-value"])
  ]))
}
}

};

const {resolveComponent:_resolveComponent$3,createVNode:_createVNode$3,withKeys:_withKeys,createTextVNode:_createTextVNode$3,withCtx:_withCtx$3,openBlock:_openBlock$3,createBlock:_createBlock$3,createCommentVNode:_createCommentVNode$1,renderList:_renderList$3,Fragment:_Fragment$3,createElementBlock:_createElementBlock$3,toDisplayString:_toDisplayString$3,createElementVNode:_createElementVNode$2,normalizeClass:_normalizeClass,unref:_unref$1} = await importShared('vue');


const _hoisted_1$2 = { class: "text-caption text-medium-emphasis mt-2" };
const _hoisted_2$1 = ["onClick"];
const _hoisted_3$1 = { class: "d-flex align-center flex-wrap ga-2" };
const _hoisted_4$1 = {
  class: "parse-segments mb-4",
  style: {"line-height":"2.4"}
};
const _hoisted_5 = {
  key: 1,
  class: "text-body-2 mr-1 text-high-emphasis"
};
const _hoisted_6 = ["onClick"];
const _hoisted_7 = { class: "text-caption text-medium-emphasis mt-3 mb-1" };
const _hoisted_8 = { class: "text-caption text-medium-emphasis" };
const _hoisted_9 = {
  key: 0,
  class: "text-body-2 mt-2",
  style: {"line-height":"1.7"}
};
const _hoisted_10 = { class: "d-flex align-center flex-wrap ga-2" };
const _hoisted_11 = { class: "text-caption text-medium-emphasis" };
const _hoisted_12 = { class: "text-body-2 mb-2" };
const _hoisted_13 = { class: "text-medium-emphasis" };
const _hoisted_14 = {
  key: 1,
  class: "text-body-2 mb-1"
};
const _hoisted_15 = {
  key: 2,
  class: "text-caption text-medium-emphasis mb-2"
};
const _hoisted_16 = { class: "text-caption text-disabled" };
const _hoisted_17 = { class: "d-flex align-center flex-wrap ga-2" };
const _hoisted_18 = { class: "text-h6 font-weight-bold" };
const _hoisted_19 = {
  key: 0,
  class: "text-caption text-medium-emphasis mt-1"
};
const _hoisted_20 = {
  class: "text-body-1 mb-3",
  style: {"line-height":"1.8"}
};
const _hoisted_21 = {
  class: "text-body-2",
  style: {"line-height":"1.9","white-space":"pre-wrap"}
};

const {computed: computed$2,onMounted: onMounted$1,ref: ref$2} = await importShared('vue');


const _sfc_main$3 = {
  __name: 'ParseView',
  props: {
  api: { type: Object, default: () => ({}) },
  pluginId: { type: String, default: 'NewbieVillage' },
},
  setup(__props) {

const props = __props;

const pluginBase = computed$2(() => `plugin/${props.pluginId}`);
const apiClient = computed$2(() => resolveApi(props.api));

// 与后端 parse_engine.DIM_COLORS 保持一致
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

const input = ref$2('');
const kind = ref$2('auto');
const kindOptions = [
  { title: '自动识别', value: 'auto' },
  { title: '影视', value: 'video' },
  { title: '音乐', value: 'music' },
];
const loading = ref$2(false);
const error = ref$2('');
const parsed = ref$2(null);
const preview = ref$2(null);
const dictTerms = ref$2([]);
const dictLadders = ref$2({});
const dictSizeMatrix = ref$2({});
const llmStatus = ref$2({ available: false, provider: '', model: '' });
const llmLoading = ref$2(false);
const aiResult = ref$2(null);
const aiNotice = ref$2('');

const selectedTerm = ref$2(null);

// ref → 词条（精确匹配 term，其次匹配别名）
const termByRef = computed$2(() => {
  const map = {};
  for (const t of dictTerms.value) {
    map[t.term] = t;
    for (const a of t.aliases || []) {
      if (!(a in map)) map[a] = t;
    }
  }
  return map
});

const DIM_ORDER = ['episode', 'resolution', 'source', 'vcodec', 'audio', 'edition', 'format', 'quality', 'release_type', 'year', 'group'];
const dimEntries = computed$2(() => {
  if (!parsed.value) return []
  const dims = parsed.value.dims || {};
  return DIM_ORDER.filter(d => dims[d]).map(d => ({ dim: d, title: DIM_TITLES[d] || d, color: DIM_COLORS[d] || 'grey', items: dims[d] }))
});

function openRef(refName) {
  if (refName && termByRef.value[refName]) {
    selectedTerm.value = termByRef.value[refName];
  }
}

function segmentColor(seg) {
  return DIM_COLORS[seg.dim] || 'grey'
}

async function loadDict() {
  try {
    const client = apiClient.value;
    if (!client) return
    const data = unwrapResponse(await client.get(`${pluginBase.value}/dict`));
    dictTerms.value = data?.terms || [];
    dictLadders.value = data?.ladders || {};
    dictSizeMatrix.value = data?.size_matrix || {};
  } catch {
    dictTerms.value = [];
  }
}

async function loadLlmStatus() {
  try {
    const client = apiClient.value;
    if (!client) return
    llmStatus.value = unwrapResponse(await client.get(`${pluginBase.value}/llm/status`)) || { available: false };
  } catch {
    llmStatus.value = { available: false };
  }
}

async function runLlm() {
  if (!input.value.trim() || llmLoading.value) return
  llmLoading.value = true;
  error.value = '';
  aiResult.value = null;
  aiNotice.value = '';
  try {
    const client = apiClient.value;
    if (!client) throw new Error('宿主 API 客户端不可用，请刷新页面重试')
    const resp = await client.post(`${pluginBase.value}/parse/llm`, { text: input.value, kind: kind.value });
    // 手动解包：兜底失败时 success=true 但 llm 为空 + message 说明（保留纯正则结果）
    if (resp && Object.prototype.hasOwnProperty.call(resp, 'success')) {
      if (resp.success === false) throw new Error(resp.message || 'AI 兜底失败')
      parsed.value = resp.data?.parse || null;
      aiResult.value = resp.data?.llm || null;
      aiNotice.value = resp.message || '';
    } else {
      parsed.value = resp?.data?.parse || null;
      aiResult.value = resp?.data?.llm || null;
    }
  } catch (err) {
    error.value = err.message || String(err);
  } finally {
    llmLoading.value = false;
  }
}

async function runParse() {
  if (!input.value.trim() || loading.value) return
  loading.value = true;
  error.value = '';
  parsed.value = null;
  preview.value = null;
  try {
    const client = apiClient.value;
    if (!client) throw new Error('宿主 API 客户端不可用，请刷新页面重试')
    const data = unwrapResponse(
      await client.post(`${pluginBase.value}/parse/preview`, { text: input.value, kind: kind.value })
    );
    parsed.value = data?.parse || null;
    preview.value = data?.preview || null;
  } catch (err) {
    error.value = err.message || String(err);
  } finally {
    loading.value = false;
  }
}

const examples = [
  'The.Bear.S02E05.2160p.WEB-DL.DDP5.1.Atmos.HDR.H.265-NOSIVAD',
  'Jay Chou - 最伟大的作品 (2022) [FLAC 24bit-44.1kHz] 分轨',
];

function tryExample(text) {
  input.value = text;
  runParse();
}

// 画质档次徽章：按最高分辨率 × 来源映射（与天梯口径一致）
const tier = computed$2(() => {
  if (!parsed.value || parsed.value.kind !== 'video') return null
  if ((parsed.value.warnings || []).length) {
    return { icon: 'mdi-alert-octagon', color: 'error', text: '应急枪版' }
  }
  const dims = parsed.value.dims || {};
  const res = dims.resolution?.[0]?.value || '';
  const src = (dims.source || []).map(s => s.value).join('|');
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
});

// 体积估算：分辨率 × 来源 查矩阵
const sizeEstimate = computed$2(() => {
  if (!preview.value || preview.value.media_type === '音乐' || !parsed.value) return null
  const matrix = dictSizeMatrix.value;
  if (!matrix?.rows || !matrix?.columns) return null
  const dims = parsed.value.dims || {};
  const res = dims.resolution?.[0]?.value || '';
  const rowKey = /2160|4K|UHD/i.test(res)
    ? '2160p'
    : /1080/.test(res)
      ? '1080p'
      : /720/.test(res)
        ? '720p'
        : /[45]76|480/.test(res)
          ? '480p'
          : null;
  const srcVals = (dims.source || []).map(s => `${s.value} ${s.label}`).join(' ');
  let col = null;
  if (/枪版|CAM|TeleSync/i.test(srcVals)) col = '枪版';
  else if (/REMUX/i.test(srcVals)) col = 'REMUX';
  else if (/BDMV|原盘/i.test(srcVals)) col = 'BDMV 原盘';
  else if (/HDTV/i.test(srcVals)) col = 'HDTV';
  else if (/BluRay|Blu-Ray|蓝光/i.test(srcVals)) col = 'BluRay 转码';
  else if (/WEB-DL|WEBRip|流媒体/i.test(srcVals)) col = 'WEB-DL';
  if (!rowKey || !col) return null
  const val = matrix.rows?.[rowKey]?.[matrix.columns.indexOf(col)];
  return val != null ? { gb: val, combo: `${rowKey} × ${col}` } : null
});

onMounted$1(() => {
  loadDict();
  loadLlmStatus();
});

return (_ctx, _cache) => {
  const _component_VSelect = _resolveComponent$3("VSelect");
  const _component_VTextField = _resolveComponent$3("VTextField");
  const _component_VIcon = _resolveComponent$3("VIcon");
  const _component_VBtn = _resolveComponent$3("VBtn");
  const _component_VRow = _resolveComponent$3("VRow");
  const _component_VCard = _resolveComponent$3("VCard");
  const _component_VAlert = _resolveComponent$3("VAlert");
  const _component_VCardTitle = _resolveComponent$3("VCardTitle");
  const _component_VChip = _resolveComponent$3("VChip");
  const _component_VCardItem = _resolveComponent$3("VCardItem");
  const _component_VCardText = _resolveComponent$3("VCardText");
  const _component_VCol = _resolveComponent$3("VCol");
  const _component_VCode = _resolveComponent$3("VCode");
  const _component_VDivider = _resolveComponent$3("VDivider");
  const _component_VEmptyState = _resolveComponent$3("VEmptyState");
  const _component_VSpacer = _resolveComponent$3("VSpacer");
  const _component_VCardActions = _resolveComponent$3("VCardActions");
  const _component_VDialog = _resolveComponent$3("VDialog");

  return (_openBlock$3(), _createElementBlock$3("div", null, [
    _createVNode$3(_component_VCard, {
      variant: "flat",
      class: "pa-4 mb-4"
    }, {
      default: _withCtx$3(() => [
        _createVNode$3(_component_VRow, {
          align: "center",
          "no-gutters": ""
        }, {
          default: _withCtx$3(() => [
            _createVNode$3(_component_VSelect, {
              modelValue: kind.value,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => ((kind).value = $event)),
              items: kindOptions,
              variant: "outlined",
              density: "comfortable",
              "hide-details": "",
              "max-width": "9rem",
              class: "mr-4"
            }, null, 8, ["modelValue"]),
            _createVNode$3(_component_VTextField, {
              modelValue: input.value,
              "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => ((input).value = $event)),
              placeholder: "粘贴一个文件名，如 The.Bear.S02E05.2160p.WEB-DL.DDP5.1.Atmos.HDR.H.265-NOSIVAD",
              variant: "outlined",
              density: "comfortable",
              "hide-details": "",
              clearable: "",
              onKeyup: _withKeys(runParse, ["enter"])
            }, null, 8, ["modelValue"]),
            _createVNode$3(_component_VBtn, {
              color: "primary",
              class: "ml-4",
              loading: loading.value,
              "min-width": "7rem",
              onClick: runParse
            }, {
              default: _withCtx$3(() => [
                _createVNode$3(_component_VIcon, {
                  start: "",
                  icon: "mdi-magnify-scan"
                }),
                _cache[4] || (_cache[4] = _createTextVNode$3(" 解析 ", -1))
              ]),
              _: 1
            }, 8, ["loading"]),
            (llmStatus.value.available)
              ? (_openBlock$3(), _createBlock$3(_component_VBtn, {
                  key: 0,
                  color: "deep-purple",
                  variant: "tonal",
                  class: "ml-2",
                  loading: llmLoading.value,
                  "min-width": "9rem",
                  onClick: runLlm
                }, {
                  default: _withCtx$3(() => [
                    _createVNode$3(_component_VIcon, {
                      start: "",
                      icon: "mdi-robot-outline"
                    }),
                    _cache[5] || (_cache[5] = _createTextVNode$3(" AI 兜底解析 ", -1))
                  ]),
                  _: 1
                }, 8, ["loading"]))
              : _createCommentVNode$1("", true)
          ]),
          _: 1
        }),
        _createElementVNode$2("div", _hoisted_1$2, [
          _cache[6] || (_cache[6] = _createTextVNode$3(" 试试： ", -1)),
          (_openBlock$3(), _createElementBlock$3(_Fragment$3, null, _renderList$3(examples, (ex) => {
            return _createElementVNode$2("a", {
              key: ex,
              class: "mr-3",
              href: "javascript:void(0)",
              onClick: $event => (tryExample(ex))
            }, _toDisplayString$3(ex.slice(0, 42)) + "…", 9, _hoisted_2$1)
          }), 64))
        ])
      ]),
      _: 1
    }),
    (error.value)
      ? (_openBlock$3(), _createBlock$3(_component_VAlert, {
          key: 0,
          type: "error",
          variant: "tonal",
          class: "mb-4",
          density: "compact"
        }, {
          default: _withCtx$3(() => [
            _createTextVNode$3(_toDisplayString$3(error.value), 1)
          ]),
          _: 1
        }))
      : _createCommentVNode$1("", true),
    (parsed.value)
      ? (_openBlock$3(), _createElementBlock$3(_Fragment$3, { key: 1 }, [
          _createVNode$3(_component_VCard, {
            variant: "outlined",
            class: "mb-4"
          }, {
            default: _withCtx$3(() => [
              _createVNode$3(_component_VCardItem, { class: "pb-2" }, {
                default: _withCtx$3(() => [
                  _createElementVNode$2("div", _hoisted_3$1, [
                    _createVNode$3(_component_VCardTitle, { class: "text-subtitle-1 font-weight-bold pa-0" }, {
                      default: _withCtx$3(() => [...(_cache[7] || (_cache[7] = [
                        _createTextVNode$3("解析结果", -1)
                      ]))]),
                      _: 1
                    }),
                    _createVNode$3(_component_VChip, {
                      size: "small",
                      color: parsed.value.kind === 'music' ? 'green' : 'indigo',
                      variant: "tonal"
                    }, {
                      default: _withCtx$3(() => [
                        _createTextVNode$3(_toDisplayString$3(parsed.value.kind === 'music' ? '音乐命名' : '影视命名'), 1)
                      ]),
                      _: 1
                    }, 8, ["color"]),
                    (tier.value)
                      ? (_openBlock$3(), _createBlock$3(_component_VChip, {
                          key: 0,
                          size: "small",
                          color: tier.value.color,
                          variant: "flat"
                        }, {
                          default: _withCtx$3(() => [
                            _createVNode$3(_component_VIcon, {
                              start: "",
                              size: "x-small",
                              icon: tier.value.icon
                            }, null, 8, ["icon"]),
                            _createTextVNode$3(" " + _toDisplayString$3(tier.value.text), 1)
                          ]),
                          _: 1
                        }, 8, ["color"]))
                      : _createCommentVNode$1("", true),
                    (parsed.value.title_hint)
                      ? (_openBlock$3(), _createBlock$3(_component_VChip, {
                          key: 1,
                          size: "small",
                          variant: "outlined"
                        }, {
                          default: _withCtx$3(() => [
                            _createTextVNode$3(" 标题：" + _toDisplayString$3(parsed.value.title_hint), 1)
                          ]),
                          _: 1
                        }))
                      : _createCommentVNode$1("", true)
                  ])
                ]),
                _: 1
              }),
              _createVNode$3(_component_VCardText, null, {
                default: _withCtx$3(() => [
                  (_openBlock$3(true), _createElementBlock$3(_Fragment$3, null, _renderList$3(parsed.value.warnings || [], (w, i) => {
                    return (_openBlock$3(), _createBlock$3(_component_VAlert, {
                      key: i,
                      type: "error",
                      variant: "tonal",
                      density: "compact",
                      class: "mb-2"
                    }, {
                      default: _withCtx$3(() => [
                        _createElementVNode$2("b", null, "检测到" + _toDisplayString$3(w.label) + "（" + _toDisplayString$3(w.value) + "）：", 1),
                        _cache[8] || (_cache[8] = _createTextVNode$3(" 这是影院偷录/翻录版本，画质和音质都很差，除非全网没有更好的选择，否则不建议下载收藏。 在「词典 → 天梯」里看看正常来源的画质阶梯。 ", -1))
                      ]),
                      _: 2
                    }, 1024))
                  }), 128)),
                  _createElementVNode$2("div", _hoisted_4$1, [
                    (_openBlock$3(true), _createElementBlock$3(_Fragment$3, null, _renderList$3(parsed.value.segments, (seg, i) => {
                      return (_openBlock$3(), _createElementBlock$3(_Fragment$3, { key: i }, [
                        (seg.dim && seg.raw.trim())
                          ? (_openBlock$3(), _createBlock$3(_component_VChip, {
                              key: 0,
                              color: segmentColor(seg),
                              size: "small",
                              variant: seg.ref && termByRef.value[seg.ref] ? 'tonal' : 'outlined',
                              class: _normalizeClass(["mr-1 mb-1", { 'cursor-pointer': seg.ref && termByRef.value[seg.ref] }]),
                              title: seg.ref && termByRef.value[seg.ref] ? '点击查看词条' : '',
                              onClick: $event => (openRef(seg.ref))
                            }, {
                              default: _withCtx$3(() => [
                                _createTextVNode$3(_toDisplayString$3(seg.raw), 1)
                              ]),
                              _: 2
                            }, 1032, ["color", "variant", "class", "title", "onClick"]))
                          : (seg.raw.trim())
                            ? (_openBlock$3(), _createElementBlock$3("span", _hoisted_5, _toDisplayString$3(seg.raw), 1))
                            : _createCommentVNode$1("", true)
                      ], 64))
                    }), 128))
                  ]),
                  _createVNode$3(_component_VRow, { dense: "" }, {
                    default: _withCtx$3(() => [
                      (_openBlock$3(true), _createElementBlock$3(_Fragment$3, null, _renderList$3(dimEntries.value, (d) => {
                        return (_openBlock$3(), _createBlock$3(_component_VCol, {
                          key: d.dim,
                          cols: "12",
                          sm: "6",
                          md: "4"
                        }, {
                          default: _withCtx$3(() => [
                            _createVNode$3(_component_VCard, {
                              variant: "tonal",
                              color: d.color,
                              class: "h-100"
                            }, {
                              default: _withCtx$3(() => [
                                _createVNode$3(_component_VCardItem, { class: "py-2" }, {
                                  default: _withCtx$3(() => [
                                    _createVNode$3(_component_VCardTitle, { class: "text-caption font-weight-bold pa-0" }, {
                                      default: _withCtx$3(() => [
                                        _createVNode$3(_component_VIcon, {
                                          size: "x-small",
                                          icon: "mdi-tag-outline",
                                          class: "mr-1"
                                        }),
                                        _createTextVNode$3(" " + _toDisplayString$3(d.title), 1)
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ]),
                                  _: 2
                                }, 1024),
                                _createVNode$3(_component_VCardText, { class: "py-1" }, {
                                  default: _withCtx$3(() => [
                                    (_openBlock$3(true), _createElementBlock$3(_Fragment$3, null, _renderList$3(d.items, (item) => {
                                      return (_openBlock$3(), _createElementBlock$3("div", {
                                        key: item.label + item.value,
                                        class: "text-body-2"
                                      }, [
                                        _createElementVNode$2("span", {
                                          class: _normalizeClass({ 'cursor-pointer text-decoration-underline': item.ref && termByRef.value[item.ref] }),
                                          onClick: $event => (openRef(item.ref))
                                        }, [
                                          _createTextVNode$3(_toDisplayString$3(item.label), 1),
                                          (item.value && item.value !== item.label)
                                            ? (_openBlock$3(), _createElementBlock$3(_Fragment$3, { key: 0 }, [
                                                _createTextVNode$3("（" + _toDisplayString$3(item.value) + "）", 1)
                                              ], 64))
                                            : _createCommentVNode$1("", true)
                                        ], 10, _hoisted_6)
                                      ]))
                                    }), 128))
                                  ]),
                                  _: 2
                                }, 1024)
                              ]),
                              _: 2
                            }, 1032, ["color"])
                          ]),
                          _: 2
                        }, 1024))
                      }), 128))
                    ]),
                    _: 1
                  }),
                  ((parsed.value.unrecognized || []).length)
                    ? (_openBlock$3(), _createElementBlock$3(_Fragment$3, { key: 0 }, [
                        _createElementVNode$2("div", _hoisted_7, [
                          _createVNode$3(_component_VIcon, {
                            size: "x-small",
                            icon: "mdi-help-circle-outline",
                            class: "mr-1"
                          }),
                          _createTextVNode$3(" 未识别片段" + _toDisplayString$3(llmStatus.value.available ? '（可点上方「AI 兜底解析」补全）' : '') + "： ", 1)
                        ]),
                        (_openBlock$3(true), _createElementBlock$3(_Fragment$3, null, _renderList$3(parsed.value.unrecognized, (token) => {
                          return (_openBlock$3(), _createBlock$3(_component_VChip, {
                            key: token,
                            size: "small",
                            variant: "outlined",
                            color: "grey",
                            class: "mr-1 mb-1"
                          }, {
                            default: _withCtx$3(() => [
                              _createTextVNode$3(_toDisplayString$3(token), 1)
                            ]),
                            _: 2
                          }, 1024))
                        }), 128))
                      ], 64))
                    : _createCommentVNode$1("", true),
                  (aiResult.value)
                    ? (_openBlock$3(), _createBlock$3(_component_VCard, {
                        key: 1,
                        variant: "tonal",
                        color: "deep-purple",
                        class: "mt-4"
                      }, {
                        default: _withCtx$3(() => [
                          _createVNode$3(_component_VCardItem, { class: "pb-1" }, {
                            prepend: _withCtx$3(() => [
                              _createVNode$3(_component_VIcon, { icon: "mdi-robot-outline" })
                            ]),
                            append: _withCtx$3(() => [
                              _createElementVNode$2("span", _hoisted_8, _toDisplayString$3(aiResult.value.provider) + " / " + _toDisplayString$3(aiResult.value.model) + " · " + _toDisplayString$3(aiResult.value.duration_ms) + "ms ", 1)
                            ]),
                            default: _withCtx$3(() => [
                              _createVNode$3(_component_VCardTitle, { class: "text-subtitle-1 font-weight-bold pa-0" }, {
                                default: _withCtx$3(() => [...(_cache[9] || (_cache[9] = [
                                  _createTextVNode$3("AI 推断（仅供参考）", -1)
                                ]))]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          _createVNode$3(_component_VCardText, null, {
                            default: _withCtx$3(() => [
                              (_openBlock$3(true), _createElementBlock$3(_Fragment$3, null, _renderList$3(aiResult.value.tags || [], (t, i) => {
                                return (_openBlock$3(), _createBlock$3(_component_VChip, {
                                  key: i,
                                  size: "small",
                                  variant: "outlined",
                                  class: "mr-1 mb-1"
                                }, {
                                  default: _withCtx$3(() => [
                                    _createTextVNode$3(_toDisplayString$3(t.label) + "：" + _toDisplayString$3(t.value), 1)
                                  ]),
                                  _: 2
                                }, 1024))
                              }), 128)),
                              (aiResult.value.explanation)
                                ? (_openBlock$3(), _createElementBlock$3("div", _hoisted_9, _toDisplayString$3(aiResult.value.explanation), 1))
                                : _createCommentVNode$1("", true)
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }))
                    : (aiNotice.value)
                      ? (_openBlock$3(), _createBlock$3(_component_VAlert, {
                          key: 2,
                          type: "info",
                          variant: "tonal",
                          density: "compact",
                          class: "mt-4"
                        }, {
                          default: _withCtx$3(() => [
                            _createTextVNode$3(_toDisplayString$3(aiNotice.value), 1)
                          ]),
                          _: 1
                        }))
                      : _createCommentVNode$1("", true)
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          (preview.value)
            ? (_openBlock$3(), _createBlock$3(_component_VCard, {
                key: 0,
                variant: "flat",
                color: "grey-lighten-4",
                class: "mb-4"
              }, {
                default: _withCtx$3(() => [
                  _createVNode$3(_component_VCardItem, { class: "pb-1" }, {
                    default: _withCtx$3(() => [
                      _createElementVNode$2("div", _hoisted_10, [
                        _createVNode$3(_component_VIcon, {
                          icon: "mdi-target",
                          color: "primary"
                        }),
                        _createVNode$3(_component_VCardTitle, { class: "text-subtitle-1 font-weight-bold pa-0" }, {
                          default: _withCtx$3(() => [...(_cache[10] || (_cache[10] = [
                            _createTextVNode$3("联动预告", -1)
                          ]))]),
                          _: 1
                        }),
                        _createVNode$3(_component_VChip, {
                          size: "small",
                          variant: "tonal",
                          color: "primary"
                        }, {
                          default: _withCtx$3(() => [
                            _createTextVNode$3(_toDisplayString$3(preview.value.media_type), 1)
                          ]),
                          _: 1
                        }),
                        _createElementVNode$2("span", _hoisted_11, _toDisplayString$3(preview.value.media_type_source), 1)
                      ])
                    ]),
                    _: 1
                  }),
                  _createVNode$3(_component_VCardText, null, {
                    default: _withCtx$3(() => [
                      (preview.value.directory)
                        ? (_openBlock$3(), _createElementBlock$3(_Fragment$3, { key: 0 }, [
                            _createElementVNode$2("div", _hoisted_12, [
                              _createVNode$3(_component_VIcon, {
                                size: "x-small",
                                icon: "mdi-folder-move-outline",
                                class: "mr-1"
                              }),
                              _cache[11] || (_cache[11] = _createTextVNode$3(" 命中目录配置：", -1)),
                              _createElementVNode$2("b", null, _toDisplayString$3(preview.value.directory.name), 1),
                              _createElementVNode$2("span", _hoisted_13, " （" + _toDisplayString$3(preview.value.directory.transfer_type) + " 模式 · 智能重命名 " + _toDisplayString$3(preview.value.directory.renaming ? '开' : '关') + "） ", 1)
                            ]),
                            _createVNode$3(_component_VCode, {
                              class: "d-block pa-2 mb-3 text-caption",
                              style: {"white-space":"pre-wrap","word-break":"break-all"}
                            }, {
                              default: _withCtx$3(() => [
                                _createTextVNode$3(_toDisplayString$3(preview.value.path_guess), 1)
                              ]),
                              _: 1
                            }),
                            (sizeEstimate.value)
                              ? (_openBlock$3(), _createBlock$3(_component_VAlert, {
                                  key: 0,
                                  type: "info",
                                  variant: "tonal",
                                  density: "compact",
                                  class: "mb-2"
                                }, {
                                  default: _withCtx$3(() => [
                                    _cache[12] || (_cache[12] = _createTextVNode$3(" 预计体积：", -1)),
                                    _createElementVNode$2("b", null, "约 " + _toDisplayString$3(sizeEstimate.value.gb) + " GB", 1),
                                    _createTextVNode$3("（" + _toDisplayString$3(sizeEstimate.value.combo) + " · 估算值，随片长与码率浮动） ", 1)
                                  ]),
                                  _: 1
                                }))
                              : _createCommentVNode$1("", true)
                          ], 64))
                        : _createCommentVNode$1("", true),
                      (_openBlock$3(true), _createElementBlock$3(_Fragment$3, null, _renderList$3(preview.value.warnings || [], (w, i) => {
                        return (_openBlock$3(), _createBlock$3(_component_VAlert, {
                          key: i,
                          type: "warning",
                          variant: "tonal",
                          density: "compact",
                          class: "mb-2"
                        }, {
                          default: _withCtx$3(() => [
                            _createTextVNode$3(_toDisplayString$3(w), 1)
                          ]),
                          _: 2
                        }, 1024))
                      }), 128)),
                      ((preview.value.classification?.candidates || []).length)
                        ? (_openBlock$3(), _createElementBlock$3("div", _hoisted_14, [
                            _createVNode$3(_component_VIcon, {
                              size: "x-small",
                              icon: "mdi-folder-multiple-outline",
                              class: "mr-1"
                            }),
                            _createTextVNode$3(" " + _toDisplayString$3(preview.value.media_type) + "的候选二级分类（" + _toDisplayString$3(preview.value.classification.mode) + " 模式）： ", 1),
                            (_openBlock$3(true), _createElementBlock$3(_Fragment$3, null, _renderList$3(preview.value.classification.candidates, (c) => {
                              return (_openBlock$3(), _createBlock$3(_component_VChip, {
                                key: c.name,
                                size: "x-small",
                                variant: "outlined",
                                class: "ml-1 mb-1"
                              }, {
                                default: _withCtx$3(() => [
                                  _createTextVNode$3(_toDisplayString$3(c.name), 1)
                                ]),
                                _: 2
                              }, 1024))
                            }), 128))
                          ]))
                        : _createCommentVNode$1("", true),
                      (preview.value.classification?.note)
                        ? (_openBlock$3(), _createElementBlock$3("div", _hoisted_15, _toDisplayString$3(preview.value.classification.note), 1))
                        : _createCommentVNode$1("", true),
                      _createVNode$3(_component_VDivider, { class: "my-2" }),
                      _createElementVNode$2("div", _hoisted_16, [
                        (_openBlock$3(true), _createElementBlock$3(_Fragment$3, null, _renderList$3(preview.value.limitations || [], (l, i) => {
                          return (_openBlock$3(), _createElementBlock$3("div", { key: i }, "· " + _toDisplayString$3(l), 1))
                        }), 128))
                      ])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }))
            : _createCommentVNode$1("", true)
        ], 64))
      : (!loading.value && !error.value)
        ? (_openBlock$3(), _createBlock$3(_component_VEmptyState, {
            key: 2,
            icon: "mdi-magnify-scan",
            headline: "粘贴文件名开始解析",
            text: "支持影视命名（来源/分辨率/编码/音轨/季集/发布组）与音乐命名（格式/规格/发行类型）"
          }))
        : _createCommentVNode$1("", true),
    _createVNode$3(_component_VDialog, {
      "model-value": !!selectedTerm.value,
      "max-width": "42rem",
      scrollable: "",
      "onUpdate:modelValue": _cache[3] || (_cache[3] = $event => (selectedTerm.value = null))
    }, {
      default: _withCtx$3(() => [
        (selectedTerm.value)
          ? (_openBlock$3(), _createBlock$3(_component_VCard, { key: 0 }, {
              default: _withCtx$3(() => [
                _createVNode$3(_component_VCardItem, null, {
                  default: _withCtx$3(() => [
                    _createElementVNode$2("div", _hoisted_17, [
                      _createElementVNode$2("span", _hoisted_18, _toDisplayString$3(selectedTerm.value.term), 1),
                      _createVNode$3(_component_VChip, {
                        size: "small",
                        color: "primary",
                        variant: "tonal"
                      }, {
                        default: _withCtx$3(() => [
                          _createTextVNode$3(_toDisplayString$3(_unref$1(domainTitle)(selectedTerm.value.domain)), 1)
                        ]),
                        _: 1
                      })
                    ]),
                    ((selectedTerm.value.aliases || []).length)
                      ? (_openBlock$3(), _createElementBlock$3("div", _hoisted_19, " 别名：" + _toDisplayString$3(selectedTerm.value.aliases.join(' / ')), 1))
                      : _createCommentVNode$1("", true)
                  ]),
                  _: 1
                }),
                _createVNode$3(_component_VDivider),
                _createVNode$3(_component_VCardText, { style: {"max-height":"55vh"} }, {
                  default: _withCtx$3(() => [
                    _createElementVNode$2("div", _hoisted_20, _toDisplayString$3(selectedTerm.value.one_line), 1),
                    _createElementVNode$2("div", _hoisted_21, _toDisplayString$3(selectedTerm.value.detail), 1),
                    ((selectedTerm.value.examples || []).length)
                      ? (_openBlock$3(), _createElementBlock$3(_Fragment$3, { key: 0 }, [
                          _cache[13] || (_cache[13] = _createElementVNode$2("div", { class: "text-subtitle-2 font-weight-bold mt-3 mb-2" }, "命名示例", -1)),
                          (_openBlock$3(true), _createElementBlock$3(_Fragment$3, null, _renderList$3(selectedTerm.value.examples, (ex) => {
                            return (_openBlock$3(), _createBlock$3(_component_VCode, {
                              key: ex,
                              class: "d-block pa-2 mb-2 text-caption",
                              style: {"white-space":"pre-wrap","word-break":"break-all"}
                            }, {
                              default: _withCtx$3(() => [
                                _createTextVNode$3(_toDisplayString$3(ex), 1)
                              ]),
                              _: 2
                            }, 1024))
                          }), 128))
                        ], 64))
                      : _createCommentVNode$1("", true)
                  ]),
                  _: 1
                }),
                _createVNode$3(_component_VCardActions, null, {
                  default: _withCtx$3(() => [
                    _createVNode$3(_component_VSpacer),
                    _createVNode$3(_component_VBtn, {
                      variant: "text",
                      onClick: _cache[2] || (_cache[2] = $event => (selectedTerm.value = null))
                    }, {
                      default: _withCtx$3(() => [...(_cache[14] || (_cache[14] = [
                        _createTextVNode$3("关闭", -1)
                      ]))]),
                      _: 1
                    })
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }))
          : _createCommentVNode$1("", true)
      ]),
      _: 1
    }, 8, ["model-value"])
  ]))
}
}

};

const {toDisplayString:_toDisplayString$2,createTextVNode:_createTextVNode$2,resolveComponent:_resolveComponent$2,withCtx:_withCtx$2,createVNode:_createVNode$2,openBlock:_openBlock$2,createBlock:_createBlock$2,createCommentVNode:_createCommentVNode,renderList:_renderList$2,Fragment:_Fragment$2,createElementBlock:_createElementBlock$2,createElementVNode:_createElementVNode$1,unref:_unref} = await importShared('vue');


const _hoisted_1$1 = { class: "text-subtitle-1 font-weight-bold mb-2" };
const _hoisted_2 = { class: "d-flex align-center flex-wrap ga-2" };
const _hoisted_3 = { class: "text-h6 font-weight-bold" };
const _hoisted_4 = ["innerHTML"];

const {computed: computed$1,onMounted,ref: ref$1} = await importShared('vue');


const _sfc_main$2 = {
  __name: 'CaseView',
  props: {
  api: { type: Object, default: () => ({}) },
  pluginId: { type: String, default: 'NewbieVillage' },
},
  setup(__props) {

const props = __props;

const loading = ref$1(false);
const error = ref$1('');
const cases = ref$1([]);
const selected = ref$1(null);
const detailLoading = ref$1(false);

const pluginBase = computed$1(() => `plugin/${props.pluginId}`);
const apiClient = computed$1(() => resolveApi(props.api));

const storylines = computed$1(() => {
  const groups = {};
  for (const c of cases.value) {
    const key = c.storyline || '综合'
    ;(groups[key] = groups[key] || []).push(c);
  }
  return Object.entries(groups).map(([name, items]) => ({ name, items }))
});

async function load() {
  loading.value = true;
  error.value = '';
  try {
    const client = apiClient.value;
    if (!client) throw new Error('宿主 API 客户端不可用，请刷新页面重试')
    cases.value = unwrapResponse(await client.get(`${pluginBase.value}/cases`)) || [];
  } catch (err) {
    error.value = err.message || String(err);
  } finally {
    loading.value = false;
  }
}

async function openCase(c) {
  detailLoading.value = true;
  selected.value = { ...c, content: '' };
  try {
    const client = apiClient.value;
    if (!client) throw new Error('宿主 API 客户端不可用')
    const detail = unwrapResponse(await client.get(`${pluginBase.value}/cases/${c.id}`));
    selected.value = detail || c;
  } catch (err) {
    selected.value = { ...c, content: `加载失败：${err.message || err}` };
  } finally {
    detailLoading.value = false;
  }
}

function closeCase() {
  selected.value = null;
}

onMounted(load);

return (_ctx, _cache) => {
  const _component_VBtn = _resolveComponent$2("VBtn");
  const _component_VAlert = _resolveComponent$2("VAlert");
  const _component_VProgressLinear = _resolveComponent$2("VProgressLinear");
  const _component_VEmptyState = _resolveComponent$2("VEmptyState");
  const _component_VIcon = _resolveComponent$2("VIcon");
  const _component_VCardTitle = _resolveComponent$2("VCardTitle");
  const _component_VChip = _resolveComponent$2("VChip");
  const _component_VCardItem = _resolveComponent$2("VCardItem");
  const _component_VCardText = _resolveComponent$2("VCardText");
  const _component_VCard = _resolveComponent$2("VCard");
  const _component_VCol = _resolveComponent$2("VCol");
  const _component_VRow = _resolveComponent$2("VRow");
  const _component_VDivider = _resolveComponent$2("VDivider");
  const _component_VSpacer = _resolveComponent$2("VSpacer");
  const _component_VCardActions = _resolveComponent$2("VCardActions");
  const _component_VDialog = _resolveComponent$2("VDialog");

  return (_openBlock$2(), _createElementBlock$2("div", null, [
    (error.value)
      ? (_openBlock$2(), _createBlock$2(_component_VAlert, {
          key: 0,
          type: "error",
          variant: "tonal",
          class: "mb-4",
          density: "compact"
        }, {
          default: _withCtx$2(() => [
            _createTextVNode$2(_toDisplayString$2(error.value) + " ", 1),
            _createVNode$2(_component_VBtn, {
              size: "small",
              variant: "text",
              color: "white",
              class: "ml-2",
              onClick: load
            }, {
              default: _withCtx$2(() => [...(_cache[0] || (_cache[0] = [
                _createTextVNode$2("重试", -1)
              ]))]),
              _: 1
            })
          ]),
          _: 1
        }))
      : _createCommentVNode("", true),
    (loading.value)
      ? (_openBlock$2(), _createBlock$2(_component_VProgressLinear, {
          key: 1,
          indeterminate: "",
          color: "primary",
          class: "mb-2"
        }))
      : _createCommentVNode("", true),
    (!loading.value && !cases.value.length)
      ? (_openBlock$2(), _createBlock$2(_component_VEmptyState, {
          key: 2,
          icon: "mdi-map-legend",
          headline: "暂无案例",
          text: "实战案例整理中"
        }))
      : _createCommentVNode("", true),
    (_openBlock$2(true), _createElementBlock$2(_Fragment$2, null, _renderList$2(storylines.value, (group) => {
      return (_openBlock$2(), _createElementBlock$2("div", {
        key: group.name,
        class: "mb-6"
      }, [
        _createElementVNode$1("div", _hoisted_1$1, [
          _createVNode$2(_component_VIcon, {
            size: "small",
            icon: "mdi-chart-timeline-variant",
            class: "mr-1"
          }),
          _createTextVNode$2(" " + _toDisplayString$2(group.name), 1)
        ]),
        _createVNode$2(_component_VRow, null, {
          default: _withCtx$2(() => [
            (_openBlock$2(true), _createElementBlock$2(_Fragment$2, null, _renderList$2(group.items, (c) => {
              return (_openBlock$2(), _createBlock$2(_component_VCol, {
                key: c.id,
                cols: "12",
                sm: "6",
                md: "4"
              }, {
                default: _withCtx$2(() => [
                  _createVNode$2(_component_VCard, {
                    variant: "outlined",
                    hover: "",
                    class: "h-100",
                    onClick: $event => (openCase(c))
                  }, {
                    default: _withCtx$2(() => [
                      _createVNode$2(_component_VCardItem, null, {
                        append: _withCtx$2(() => [
                          _createVNode$2(_component_VChip, {
                            size: "x-small",
                            color: "primary",
                            variant: "tonal"
                          }, {
                            default: _withCtx$2(() => [
                              _createTextVNode$2(_toDisplayString$2(_unref(domainTitle)(c.domain)), 1)
                            ]),
                            _: 2
                          }, 1024)
                        ]),
                        default: _withCtx$2(() => [
                          _createVNode$2(_component_VCardTitle, {
                            class: "text-body-1 font-weight-medium",
                            style: {"white-space":"normal"}
                          }, {
                            default: _withCtx$2(() => [
                              _createTextVNode$2(_toDisplayString$2(c.title), 1)
                            ]),
                            _: 2
                          }, 1024)
                        ]),
                        _: 2
                      }, 1024),
                      ((c.settings || []).length)
                        ? (_openBlock$2(), _createBlock$2(_component_VCardText, {
                            key: 0,
                            class: "text-caption text-medium-emphasis"
                          }, {
                            default: _withCtx$2(() => [
                              _createVNode$2(_component_VIcon, {
                                size: "x-small",
                                icon: "mdi-cog-outline",
                                class: "mr-1"
                              }),
                              _createTextVNode$2(" " + _toDisplayString$2(c.settings.join(' · ')), 1)
                            ]),
                            _: 2
                          }, 1024))
                        : _createCommentVNode("", true)
                    ]),
                    _: 2
                  }, 1032, ["onClick"])
                ]),
                _: 2
              }, 1024))
            }), 128))
          ]),
          _: 2
        }, 1024)
      ]))
    }), 128)),
    _createVNode$2(_component_VDialog, {
      "model-value": !!selected.value,
      "max-width": "52rem",
      scrollable: "",
      "onUpdate:modelValue": closeCase
    }, {
      default: _withCtx$2(() => [
        (selected.value)
          ? (_openBlock$2(), _createBlock$2(_component_VCard, { key: 0 }, {
              default: _withCtx$2(() => [
                _createVNode$2(_component_VCardItem, null, {
                  default: _withCtx$2(() => [
                    _createElementVNode$1("div", _hoisted_2, [
                      _createElementVNode$1("span", _hoisted_3, _toDisplayString$2(selected.value.title), 1),
                      _createVNode$2(_component_VChip, {
                        size: "small",
                        color: "primary",
                        variant: "tonal"
                      }, {
                        default: _withCtx$2(() => [
                          _createTextVNode$2(_toDisplayString$2(_unref(domainTitle)(selected.value.domain)), 1)
                        ]),
                        _: 1
                      })
                    ])
                  ]),
                  _: 1
                }),
                _createVNode$2(_component_VDivider),
                _createVNode$2(_component_VCardText, { style: {"max-height":"62vh"} }, {
                  default: _withCtx$2(() => [
                    (detailLoading.value)
                      ? (_openBlock$2(), _createBlock$2(_component_VProgressLinear, {
                          key: 0,
                          indeterminate: "",
                          color: "primary",
                          class: "mb-2"
                        }))
                      : (_openBlock$2(), _createElementBlock$2("div", {
                          key: 1,
                          innerHTML: _unref(renderCaseMarkdown)(selected.value.content)
                        }, null, 8, _hoisted_4))
                  ]),
                  _: 1
                }),
                _createVNode$2(_component_VCardActions, null, {
                  default: _withCtx$2(() => [
                    _createVNode$2(_component_VSpacer),
                    _createVNode$2(_component_VBtn, {
                      variant: "text",
                      onClick: closeCase
                    }, {
                      default: _withCtx$2(() => [...(_cache[1] || (_cache[1] = [
                        _createTextVNode$2("关闭", -1)
                      ]))]),
                      _: 1
                    })
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }))
          : _createCommentVNode("", true)
      ]),
      _: 1
    }, 8, ["model-value"])
  ]))
}
}

};

const {resolveComponent:_resolveComponent$1,createVNode:_createVNode$1,createElementVNode:_createElementVNode,createTextVNode:_createTextVNode$1,withCtx:_withCtx$1,renderList:_renderList$1,Fragment:_Fragment$1,openBlock:_openBlock$1,createElementBlock:_createElementBlock$1,toDisplayString:_toDisplayString$1,createBlock:_createBlock$1} = await importShared('vue');


const _hoisted_1 = { class: "d-flex align-center mb-4" };


const _sfc_main$1 = {
  __name: 'HealthView',
  setup(__props) {

// v2.0 交付：配置体检引擎（解释型 + 检测型）。
// 当前展示规划中的检查项，让新手提前知道哪些配置值得自查。
const plannedChecks = [
  { icon: 'mdi-file-link-outline', title: '目录映射缺失', desc: '下载器报告的路径没有对应的目录映射，导致无法整理' },
  { icon: 'mdi-file-cog-outline', title: '分类无规则', desc: '媒体库目录配置了二级分类，但分类策略里没有对应规则' },
  { icon: 'mdi-download-outline', title: '下载分类未对应', desc: '下载器中的分类在 MP 目录配置中找不到匹配条目' },
  { icon: 'mdi-link-variant-off', title: '硬链接跨盘', desc: '下载目录与媒体库目录不在同一文件系统，硬链接会退化为复制' },
  { icon: 'mdi-history', title: '分类策略 revision 校验', desc: 'history/active 版本顺序异常（手改 JSON 常见错误）' },
  { icon: 'mdi-debug-step-over', title: 'fallbacks 指向检查', desc: '分类兜底分类在 categories 中不存在' },
  { icon: 'mdi-link-box-variant-outline', title: '规则串引用失效', desc: '过滤规则串引用了已删除的规则 ID' },
  { icon: 'mdi-text-box-search-outline', title: '识别词冲突', desc: '多条识别词对同一输入产生冲突或互相覆盖' },
  { icon: 'mdi-server-network-off', title: 'NFS stale', desc: '存储挂载句柄失效的痕迹检测' },
  { icon: 'mdi-shield-check-outline', title: '媒体服务器连接', desc: 'Emby/Jellyfin/Plex 对接可用性与媒体库路径可达性' },
];

return (_ctx, _cache) => {
  const _component_VIcon = _resolveComponent$1("VIcon");
  const _component_VChip = _resolveComponent$1("VChip");
  const _component_VAlert = _resolveComponent$1("VAlert");
  const _component_VCardTitle = _resolveComponent$1("VCardTitle");
  const _component_VCardItem = _resolveComponent$1("VCardItem");
  const _component_VCardText = _resolveComponent$1("VCardText");
  const _component_VCard = _resolveComponent$1("VCard");
  const _component_VCol = _resolveComponent$1("VCol");
  const _component_VRow = _resolveComponent$1("VRow");

  return (_openBlock$1(), _createBlock$1(_component_VCard, {
    variant: "flat",
    class: "pa-6"
  }, {
    default: _withCtx$1(() => [
      _createElementVNode("div", _hoisted_1, [
        _createVNode$1(_component_VIcon, {
          icon: "mdi-stethoscope",
          color: "primary",
          class: "mr-3",
          size: "28"
        }),
        _cache[1] || (_cache[1] = _createElementVNode("div", { class: "text-h6 font-weight-bold" }, "配置体检", -1)),
        _createVNode$1(_component_VChip, {
          size: "small",
          color: "warning",
          variant: "tonal",
          class: "ml-3"
        }, {
          default: _withCtx$1(() => [...(_cache[0] || (_cache[0] = [
            _createTextVNode$1("v2.0 交付", -1)
          ]))]),
          _: 1
        })
      ]),
      _createVNode$1(_component_VAlert, {
        type: "warning",
        variant: "tonal",
        density: "compact",
        class: "mb-4"
      }, {
        default: _withCtx$1(() => [...(_cache[2] || (_cache[2] = [
          _createTextVNode$1(" 体检引擎将在 v2.0 上线：自动检测下面这些常见配置问题，并给出解释和修复建议。 ", -1)
        ]))]),
        _: 1
      }),
      _createVNode$1(_component_VRow, null, {
        default: _withCtx$1(() => [
          (_openBlock$1(), _createElementBlock$1(_Fragment$1, null, _renderList$1(plannedChecks, (c) => {
            return _createVNode$1(_component_VCol, {
              key: c.title,
              cols: "12",
              sm: "6"
            }, {
              default: _withCtx$1(() => [
                _createVNode$1(_component_VCard, {
                  variant: "tonal",
                  class: "h-100"
                }, {
                  default: _withCtx$1(() => [
                    _createVNode$1(_component_VCardItem, { class: "pb-1" }, {
                      prepend: _withCtx$1(() => [
                        _createVNode$1(_component_VIcon, {
                          icon: c.icon,
                          color: "primary"
                        }, null, 8, ["icon"])
                      ]),
                      default: _withCtx$1(() => [
                        _createVNode$1(_component_VCardTitle, { class: "text-body-1 font-weight-medium" }, {
                          default: _withCtx$1(() => [
                            _createTextVNode$1(_toDisplayString$1(c.title), 1)
                          ]),
                          _: 2
                        }, 1024)
                      ]),
                      _: 2
                    }, 1024),
                    _createVNode$1(_component_VCardText, { class: "text-body-2 text-medium-emphasis" }, {
                      default: _withCtx$1(() => [
                        _createTextVNode$1(_toDisplayString$1(c.desc), 1)
                      ]),
                      _: 2
                    }, 1024)
                  ]),
                  _: 2
                }, 1024)
              ]),
              _: 2
            }, 1024)
          }), 64))
        ]),
        _: 1
      })
    ]),
    _: 1
  }))
}
}

};

const {renderList:_renderList,Fragment:_Fragment,openBlock:_openBlock,createElementBlock:_createElementBlock,resolveComponent:_resolveComponent,createVNode:_createVNode,toDisplayString:_toDisplayString,createTextVNode:_createTextVNode,withCtx:_withCtx,createBlock:_createBlock} = await importShared('vue');


const {ref} = await importShared('vue');


const _sfc_main = {
  __name: 'AppPage',
  props: {
  api: { type: Object, default: () => ({}) },
  navKey: { type: String, default: 'main' },
  pluginId: { type: String, default: 'NewbieVillage' },
},
  emits: ['action'],
  setup(__props) {





const tab = ref('dict');
const tabs = [
  { key: 'dict', title: '词典', icon: 'mdi-book-open-variant' },
  { key: 'parse', title: '解析', icon: 'mdi-magnify-scan' },
  { key: 'case', title: '案例', icon: 'mdi-map-legend' },
  { key: 'health', title: '体检', icon: 'mdi-stethoscope' },
];

return (_ctx, _cache) => {
  const _component_VIcon = _resolveComponent("VIcon");
  const _component_VTab = _resolveComponent("VTab");
  const _component_VTabs = _resolveComponent("VTabs");
  const _component_VWindowItem = _resolveComponent("VWindowItem");
  const _component_VWindow = _resolveComponent("VWindow");
  const _component_VContainer = _resolveComponent("VContainer");

  return (_openBlock(), _createBlock(_component_VContainer, {
    fluid: "",
    class: "px-0 px-sm-4 py-2"
  }, {
    default: _withCtx(() => [
      _createVNode(_component_VTabs, {
        modelValue: tab.value,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => ((tab).value = $event)),
        color: "primary",
        density: "comfortable",
        class: "mb-4"
      }, {
        default: _withCtx(() => [
          (_openBlock(), _createElementBlock(_Fragment, null, _renderList(tabs, (t) => {
            return _createVNode(_component_VTab, {
              key: t.key,
              value: t.key
            }, {
              default: _withCtx(() => [
                _createVNode(_component_VIcon, {
                  start: "",
                  icon: t.icon
                }, null, 8, ["icon"]),
                _createTextVNode(" " + _toDisplayString(t.title), 1)
              ]),
              _: 2
            }, 1032, ["value"])
          }), 64))
        ]),
        _: 1
      }, 8, ["modelValue"]),
      _createVNode(_component_VWindow, {
        modelValue: tab.value,
        "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => ((tab).value = $event))
      }, {
        default: _withCtx(() => [
          _createVNode(_component_VWindowItem, { value: "dict" }, {
            default: _withCtx(() => [
              _createVNode(_sfc_main$4, {
                api: __props.api,
                "plugin-id": __props.pluginId
              }, null, 8, ["api", "plugin-id"])
            ]),
            _: 1
          }),
          _createVNode(_component_VWindowItem, { value: "parse" }, {
            default: _withCtx(() => [
              _createVNode(_sfc_main$3)
            ]),
            _: 1
          }),
          _createVNode(_component_VWindowItem, { value: "case" }, {
            default: _withCtx(() => [
              _createVNode(_sfc_main$2, {
                api: __props.api,
                "plugin-id": __props.pluginId
              }, null, 8, ["api", "plugin-id"])
            ]),
            _: 1
          }),
          _createVNode(_component_VWindowItem, { value: "health" }, {
            default: _withCtx(() => [
              _createVNode(_sfc_main$1)
            ]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["modelValue"])
    ]),
    _: 1
  }))
}
}

};

export { _sfc_main as default };
