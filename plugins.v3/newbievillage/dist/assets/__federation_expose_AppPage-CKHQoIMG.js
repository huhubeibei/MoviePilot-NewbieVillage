import { importShared } from './__federation_fn_import-JrT3xvdd.js';
import { r as resolveApi, d as domainTitle, u as unwrapResponse, e as estimateSizeGb, t as tierOf, D as DIM_TITLES, a as DIM_ORDER, b as DIM_COLORS, c as renamePreviewOf, f as renderCaseMarkdown } from './utils-BxVZqrSK.js';

const {createTextVNode:_createTextVNode$7,resolveComponent:_resolveComponent$7,withCtx:_withCtx$7,createVNode:_createVNode$7,toDisplayString:_toDisplayString$7,renderList:_renderList$7,Fragment:_Fragment$7,openBlock:_openBlock$7,createElementBlock:_createElementBlock$7,normalizeClass:_normalizeClass$3,createElementVNode:_createElementVNode$6,createBlock:_createBlock$7,createCommentVNode:_createCommentVNode$6,normalizeStyle:_normalizeStyle} = await importShared('vue');


const _hoisted_1$6 = ["onClick"];
const _hoisted_2$6 = ["onClick"];
const _hoisted_3$4 = {
  class: "text-caption text-medium-emphasis",
  style: {"line-height":"1.4"}
};
const _hoisted_4$4 = { class: "font-weight-medium" };
const _hoisted_5$3 = {
  key: 1,
  class: "text-disabled"
};

const {computed: computed$6} = await importShared('vue');

// 画质/规格天梯视图：双天梯 + 音乐规格梯 + 体积参考矩阵。
// 数据来自词典服务的 ladders/size_matrix（远端可更新）。

const _sfc_main$7 = {
  __name: 'LadderView',
  props: {
  ladders: { type: Object, default: () => ({}) },
  sizeMatrix: { type: Object, default: () => ({}) },
  buyersGuide: { type: Object, default: () => ({}) },
},
  emits: ['open-term'],
  setup(__props, { emit: __emit }) {

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

const matrixRows = computed$6(() => {
  const m = props.sizeMatrix;
  if (!m?.rows || !m?.columns) return []
  return Object.entries(m.rows).map(([res, values]) => ({
    res,
    cells: (m.columns || []).map((_, i) => values?.[i] ?? null),
  }))
});

return (_ctx, _cache) => {
  const _component_VAlert = _resolveComponent$7("VAlert");
  const _component_VIcon = _resolveComponent$7("VIcon");
  const _component_VCardTitle = _resolveComponent$7("VCardTitle");
  const _component_VCardItem = _resolveComponent$7("VCardItem");
  const _component_VCardText = _resolveComponent$7("VCardText");
  const _component_VCard = _resolveComponent$7("VCard");
  const _component_VCol = _resolveComponent$7("VCol");
  const _component_VRow = _resolveComponent$7("VRow");
  const _component_VTable = _resolveComponent$7("VTable");

  return (_openBlock$7(), _createElementBlock$7("div", null, [
    _createVNode$7(_component_VAlert, {
      type: "info",
      variant: "tonal",
      density: "compact",
      class: "mb-4"
    }, {
      default: _withCtx$7(() => [...(_cache[0] || (_cache[0] = [
        _createTextVNode$7(" 天梯只讲「维度内」的高低——分辨率和来源是两回事：2160p 的 WEB-DL 未必比 1080p 的 REMUX 好。 点击天梯项可查看对应词条。 ", -1)
      ]))]),
      _: 1
    }),
    (__props.buyersGuide?.personas?.length)
      ? (_openBlock$7(), _createBlock$7(_component_VCard, {
          key: 0,
          variant: "flat",
          color: "amber-lighten-4",
          class: "mb-4"
        }, {
          default: _withCtx$7(() => [
            _createVNode$7(_component_VCardItem, { class: "pb-1" }, {
              prepend: _withCtx$7(() => [
                _createVNode$7(_component_VIcon, {
                  icon: "mdi-compass-outline",
                  color: "amber-darken-2"
                })
              ]),
              default: _withCtx$7(() => [
                _createVNode$7(_component_VCardTitle, { class: "text-subtitle-1 font-weight-bold pa-0" }, {
                  default: _withCtx$7(() => [
                    _createTextVNode$7(_toDisplayString$7(__props.buyersGuide.title || '怎么选？按人群对号入座'), 1)
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }),
            _createVNode$7(_component_VCardText, { class: "text-caption text-medium-emphasis pb-2" }, {
              default: _withCtx$7(() => [
                _createTextVNode$7(_toDisplayString$7(__props.buyersGuide.intro), 1)
              ]),
              _: 1
            }),
            _createVNode$7(_component_VCardText, { class: "pt-0" }, {
              default: _withCtx$7(() => [
                _createVNode$7(_component_VRow, null, {
                  default: _withCtx$7(() => [
                    (_openBlock$7(true), _createElementBlock$7(_Fragment$7, null, _renderList$7(__props.buyersGuide.personas, (p) => {
                      return (_openBlock$7(), _createBlock$7(_component_VCol, {
                        key: p.name,
                        cols: "12",
                        sm: "6",
                        md: "3"
                      }, {
                        default: _withCtx$7(() => [
                          _createVNode$7(_component_VCard, {
                            variant: "outlined",
                            class: "h-100"
                          }, {
                            default: _withCtx$7(() => [
                              _createVNode$7(_component_VCardItem, { class: "pb-1" }, {
                                prepend: _withCtx$7(() => [
                                  _createVNode$7(_component_VIcon, {
                                    icon: p.icon || 'mdi-account-circle',
                                    color: "amber-darken-2"
                                  }, null, 8, ["icon"])
                                ]),
                                default: _withCtx$7(() => [
                                  _createVNode$7(_component_VCardTitle, { class: "text-body-2 font-weight-bold pa-0" }, {
                                    default: _withCtx$7(() => [
                                      _createTextVNode$7(_toDisplayString$7(p.name), 1)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ]),
                                _: 2
                              }, 1024),
                              _createVNode$7(_component_VCardText, { class: "text-caption text-medium-emphasis pb-1" }, {
                                default: _withCtx$7(() => [
                                  _createTextVNode$7(_toDisplayString$7(p.desc), 1)
                                ]),
                                _: 2
                              }, 1024),
                              _createVNode$7(_component_VCardText, { class: "pt-0" }, {
                                default: _withCtx$7(() => [
                                  (_openBlock$7(true), _createElementBlock$7(_Fragment$7, null, _renderList$7(p.items || [], (item) => {
                                    return (_openBlock$7(), _createElementBlock$7("div", {
                                      key: item.label,
                                      class: "mb-1"
                                    }, [
                                      _createElementVNode$6("span", {
                                        class: _normalizeClass$3(["text-body-2", { 'cursor-pointer text-decoration-underline text-primary': item.ref }]),
                                        onClick: $event => (item.ref && _ctx.$emit('open-term', item.ref))
                                      }, [
                                        _createVNode$7(_component_VIcon, {
                                          size: "x-small",
                                          icon: "mdi-check-circle-outline",
                                          class: "mr-1"
                                        }),
                                        _createTextVNode$7(" " + _toDisplayString$7(item.label), 1)
                                      ], 10, _hoisted_1$6)
                                    ]))
                                  }), 128))
                                ]),
                                _: 2
                              }, 1024)
                            ]),
                            _: 2
                          }, 1024)
                        ]),
                        _: 2
                      }, 1024))
                    }), 128))
                  ]),
                  _: 1
                })
              ]),
              _: 1
            })
          ]),
          _: 1
        }))
      : _createCommentVNode$6("", true),
    (_openBlock$7(), _createElementBlock$7(_Fragment$7, null, _renderList$7(ladderOrder, (key) => {
      return _createVNode$7(_component_VRow, { key: key }, {
        default: _withCtx$7(() => [
          _createVNode$7(_component_VCol, { cols: "12" }, {
            default: _withCtx$7(() => [
              _createVNode$7(_component_VCard, { variant: "outlined" }, {
                default: _withCtx$7(() => [
                  _createVNode$7(_component_VCardItem, { class: "pb-1" }, {
                    prepend: _withCtx$7(() => [
                      _createVNode$7(_component_VIcon, {
                        icon: ladderMeta[key]?.icon || 'mdi-stairs',
                        color: "primary"
                      }, null, 8, ["icon"])
                    ]),
                    default: _withCtx$7(() => [
                      _createVNode$7(_component_VCardTitle, { class: "text-subtitle-1 font-weight-bold" }, {
                        default: _withCtx$7(() => [
                          _createTextVNode$7(_toDisplayString$7(__props.ladders[key]?.title || key), 1)
                        ]),
                        _: 2
                      }, 1024)
                    ]),
                    _: 2
                  }, 1024),
                  _createVNode$7(_component_VCardText, { class: "text-caption text-medium-emphasis pb-2" }, {
                    default: _withCtx$7(() => [
                      _createTextVNode$7(_toDisplayString$7(__props.ladders[key]?.note), 1)
                    ]),
                    _: 2
                  }, 1024),
                  _createVNode$7(_component_VCardText, { class: "pt-0" }, {
                    default: _withCtx$7(() => [
                      (_openBlock$7(true), _createElementBlock$7(_Fragment$7, null, _renderList$7(ladderList(key), (item, i) => {
                        return (_openBlock$7(), _createBlock$7(_component_VRow, {
                          key: item.label,
                          dense: "",
                          align: "center"
                        }, {
                          default: _withCtx$7(() => [
                            _createVNode$7(_component_VCol, { cols: "12" }, {
                              default: _withCtx$7(() => [
                                _createVNode$7(_component_VCard, {
                                  color: ladderMeta[key]?.color,
                                  variant: i === ladderList(key).length - 1 ? 'tonal' : 'flat',
                                  class: _normalizeClass$3(['py-1', 'px-3', 'd-flex', 'align-center', i === ladderList(key).length - 1 ? '' : 'bg-' + (ladderMeta[key]?.color || 'grey') + '-' + shade(i, ladderList(key).length)]),
                                  style: _normalizeStyle(i === ladderList(key).length - 1 ? 'border: 1px solid currentColor' : ''),
                                  flat: ""
                                }, {
                                  default: _withCtx$7(() => [
                                    _createVNode$7(_component_VIcon, {
                                      size: "small",
                                      icon: i === ladderList(key).length - 1 ? 'mdi-crown-outline' : 'mdi-stairs-up',
                                      class: "mr-2 flex-shrink-0"
                                    }, null, 8, ["icon"]),
                                    _createElementVNode$6("span", {
                                      class: _normalizeClass$3(["font-weight-medium mr-2", { 'cursor-pointer text-decoration-underline': item.ref }]),
                                      style: {"white-space":"nowrap"},
                                      onClick: $event => (item.ref && _ctx.$emit('open-term', item.ref))
                                    }, _toDisplayString$7(item.label), 11, _hoisted_2$6),
                                    _createElementVNode$6("span", _hoisted_3$4, _toDisplayString$7(item.desc), 1)
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
      ? (_openBlock$7(), _createBlock$7(_component_VCard, {
          key: 1,
          variant: "outlined"
        }, {
          default: _withCtx$7(() => [
            _createVNode$7(_component_VCardItem, { class: "pb-1" }, {
              prepend: _withCtx$7(() => [
                _createVNode$7(_component_VIcon, {
                  icon: "mdi-database-outline",
                  color: "orange"
                })
              ]),
              default: _withCtx$7(() => [
                _createVNode$7(_component_VCardTitle, { class: "text-subtitle-1 font-weight-bold" }, {
                  default: _withCtx$7(() => [...(_cache[1] || (_cache[1] = [
                    _createTextVNode$7("单部电影典型体积参考（估算）", -1)
                  ]))]),
                  _: 1
                })
              ]),
              _: 1
            }),
            _createVNode$7(_component_VCardText, { class: "text-caption text-medium-emphasis pb-2" }, {
              default: _withCtx$7(() => [
                _createTextVNode$7(_toDisplayString$7(__props.sizeMatrix?.note), 1)
              ]),
              _: 1
            }),
            _createVNode$7(_component_VCardText, { class: "pt-0 overflow-x-auto" }, {
              default: _withCtx$7(() => [
                _createVNode$7(_component_VTable, { density: "compact" }, {
                  default: _withCtx$7(() => [
                    _createElementVNode$6("thead", null, [
                      _createElementVNode$6("tr", null, [
                        _cache[2] || (_cache[2] = _createElementVNode$6("th", { class: "text-left" }, "分辨率 \\ 来源", -1)),
                        (_openBlock$7(true), _createElementBlock$7(_Fragment$7, null, _renderList$7(__props.sizeMatrix.columns, (col) => {
                          return (_openBlock$7(), _createElementBlock$7("th", {
                            key: col,
                            class: "text-left"
                          }, _toDisplayString$7(col), 1))
                        }), 128))
                      ])
                    ]),
                    _createElementVNode$6("tbody", null, [
                      (_openBlock$7(true), _createElementBlock$7(_Fragment$7, null, _renderList$7(matrixRows.value, (row) => {
                        return (_openBlock$7(), _createElementBlock$7("tr", {
                          key: row.res
                        }, [
                          _createElementVNode$6("td", _hoisted_4$4, _toDisplayString$7(row.res), 1),
                          (_openBlock$7(true), _createElementBlock$7(_Fragment$7, null, _renderList$7(row.cells, (cell, i) => {
                            return (_openBlock$7(), _createElementBlock$7("td", { key: i }, [
                              (cell !== null)
                                ? (_openBlock$7(), _createElementBlock$7(_Fragment$7, { key: 0 }, [
                                    _createTextVNode$7(_toDisplayString$7(cell) + " " + _toDisplayString$7(__props.sizeMatrix.unit), 1)
                                  ], 64))
                                : (_openBlock$7(), _createElementBlock$7("span", _hoisted_5$3, "—"))
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
      : _createCommentVNode$6("", true)
  ]))
}
}

};

const {toDisplayString:_toDisplayString$6,createTextVNode:_createTextVNode$6,resolveComponent:_resolveComponent$6,withCtx:_withCtx$6,createVNode:_createVNode$6,openBlock:_openBlock$6,createBlock:_createBlock$6,createCommentVNode:_createCommentVNode$5,renderList:_renderList$6,Fragment:_Fragment$6,createElementBlock:_createElementBlock$6,unref:_unref$2,createElementVNode:_createElementVNode$5} = await importShared('vue');


const _hoisted_1$5 = ["onClick"];
const _hoisted_2$5 = { class: "mt-1 d-flex ga-1 flex-wrap" };
const _hoisted_3$3 = { class: "d-flex align-center flex-wrap ga-2" };
const _hoisted_4$3 = { class: "text-h6 font-weight-bold" };
const _hoisted_5$2 = {
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

const {computed: computed$5,onMounted: onMounted$3,ref: ref$6} = await importShared('vue');

const EXPANDED_KEY = 'nv_dict_expanded_groups';


const _sfc_main$6 = {
  __name: 'DictView',
  props: {
  api: { type: Object, default: () => ({}) },
  pluginId: { type: String, default: 'NewbieVillage' },
},
  setup(__props) {

const props = __props;

const loading = ref$6(false);
const error = ref$6('');
const q = ref$6('');
const domain = ref$6('');
const view = ref$6('terms');
const data = ref$6({ terms: [], version: 0, source: '', count: 0, ladders: {}, size_matrix: {} });
const selected = ref$6(null);

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

const expandedGroups = ref$6(loadExpandedGroups());

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

const pluginBase = computed$5(() => `plugin/${props.pluginId}`);
const apiClient = computed$5(() => resolveApi(props.api));

const filtered = computed$5(() => {
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
const grouped = computed$5(() => {
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

const hasGrouping = computed$5(() => filtered.value.some(t => t.group));

const searching = computed$5(() => q.value.trim().length > 0);

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

const termByRef = computed$5(() => {
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

onMounted$3(load);

return (_ctx, _cache) => {
  const _component_VBtn = _resolveComponent$6("VBtn");
  const _component_VAlert = _resolveComponent$6("VAlert");
  const _component_VTextField = _resolveComponent$6("VTextField");
  const _component_VChip = _resolveComponent$6("VChip");
  const _component_VChipGroup = _resolveComponent$6("VChipGroup");
  const _component_VSpacer = _resolveComponent$6("VSpacer");
  const _component_VIcon = _resolveComponent$6("VIcon");
  const _component_VBtnToggle = _resolveComponent$6("VBtnToggle");
  const _component_VRow = _resolveComponent$6("VRow");
  const _component_VProgressLinear = _resolveComponent$6("VProgressLinear");
  const _component_VEmptyState = _resolveComponent$6("VEmptyState");
  const _component_VDivider = _resolveComponent$6("VDivider");
  const _component_VCardTitle = _resolveComponent$6("VCardTitle");
  const _component_VCardItem = _resolveComponent$6("VCardItem");
  const _component_VCardText = _resolveComponent$6("VCardText");
  const _component_VCard = _resolveComponent$6("VCard");
  const _component_VCol = _resolveComponent$6("VCol");
  const _component_VCode = _resolveComponent$6("VCode");
  const _component_VCardActions = _resolveComponent$6("VCardActions");
  const _component_VDialog = _resolveComponent$6("VDialog");

  return (_openBlock$6(), _createElementBlock$6("div", null, [
    (error.value)
      ? (_openBlock$6(), _createBlock$6(_component_VAlert, {
          key: 0,
          type: "error",
          variant: "tonal",
          class: "mb-4",
          density: "compact"
        }, {
          default: _withCtx$6(() => [
            _createTextVNode$6(_toDisplayString$6(error.value) + " ", 1),
            _createVNode$6(_component_VBtn, {
              size: "small",
              variant: "text",
              color: "white",
              class: "ml-2",
              onClick: load
            }, {
              default: _withCtx$6(() => [...(_cache[3] || (_cache[3] = [
                _createTextVNode$6("重试", -1)
              ]))]),
              _: 1
            })
          ]),
          _: 1
        }))
      : _createCommentVNode$5("", true),
    _createVNode$6(_component_VRow, {
      class: "mb-2",
      align: "center",
      "no-gutters": ""
    }, {
      default: _withCtx$6(() => [
        (view.value === 'terms')
          ? (_openBlock$6(), _createBlock$6(_component_VTextField, {
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
          : _createCommentVNode$5("", true),
        (view.value === 'terms')
          ? (_openBlock$6(), _createBlock$6(_component_VChipGroup, {
              key: 1,
              modelValue: domain.value,
              "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => ((domain).value = $event)),
              mandatory: "",
              column: ""
            }, {
              default: _withCtx$6(() => [
                (_openBlock$6(), _createElementBlock$6(_Fragment$6, null, _renderList$6(domains, (d) => {
                  return _createVNode$6(_component_VChip, {
                    key: d.key,
                    value: d.key,
                    filter: "",
                    variant: "outlined",
                    color: "primary",
                    class: "mr-2"
                  }, {
                    default: _withCtx$6(() => [
                      _createTextVNode$6(_toDisplayString$6(d.title), 1)
                    ]),
                    _: 2
                  }, 1032, ["value"])
                }), 64))
              ]),
              _: 1
            }, 8, ["modelValue"]))
          : _createCommentVNode$5("", true),
        _createVNode$6(_component_VSpacer),
        _createVNode$6(_component_VBtnToggle, {
          modelValue: view.value,
          "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => ((view).value = $event)),
          mandatory: "",
          density: "comfortable",
          variant: "outlined",
          color: "primary"
        }, {
          default: _withCtx$6(() => [
            _createVNode$6(_component_VBtn, {
              value: "terms",
              size: "small"
            }, {
              default: _withCtx$6(() => [
                _createVNode$6(_component_VIcon, {
                  start: "",
                  size: "small",
                  icon: "mdi-book-open-variant"
                }),
                _cache[4] || (_cache[4] = _createTextVNode$6(" 词条 ", -1))
              ]),
              _: 1
            }),
            _createVNode$6(_component_VBtn, {
              value: "ladder",
              size: "small"
            }, {
              default: _withCtx$6(() => [
                _createVNode$6(_component_VIcon, {
                  start: "",
                  size: "small",
                  icon: "mdi-stairs"
                }),
                _cache[5] || (_cache[5] = _createTextVNode$6(" 天梯 ", -1))
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
      ? (_openBlock$6(), _createBlock$6(_component_VProgressLinear, {
          key: 1,
          indeterminate: "",
          color: "primary",
          class: "mb-2"
        }))
      : _createCommentVNode$5("", true),
    (view.value === 'ladder' && !loading.value)
      ? (_openBlock$6(), _createBlock$6(_sfc_main$7, {
          key: 2,
          ladders: data.value.ladders,
          "size-matrix": data.value.size_matrix,
          "buyers-guide": data.value.buyers_guide,
          onOpenTerm: openByRef
        }, null, 8, ["ladders", "size-matrix", "buyers-guide"]))
      : (view.value === 'terms' && !loading.value)
        ? (_openBlock$6(), _createElementBlock$6(_Fragment$6, { key: 3 }, [
            (!filtered.value.length)
              ? (_openBlock$6(), _createBlock$6(_component_VEmptyState, {
                  key: 0,
                  icon: "mdi-book-search-outline",
                  headline: "没有找到匹配的词条",
                  text: "换个关键词，或切换领域筛选再试试"
                }))
              : _createCommentVNode$5("", true),
            (_openBlock$6(true), _createElementBlock$6(_Fragment$6, null, _renderList$6(grouped.value, (group) => {
              return (_openBlock$6(), _createElementBlock$6("div", {
                key: group.name,
                class: "mb-4"
              }, [
                (group.name !== '其他' && hasGrouping.value)
                  ? (_openBlock$6(), _createElementBlock$6("div", {
                      key: 0,
                      class: "text-subtitle-2 font-weight-bold mb-2 d-flex align-center cursor-pointer",
                      style: {"user-select":"none"},
                      onClick: $event => (toggleGroup(group.name))
                    }, [
                      _createVNode$6(_component_VIcon, {
                        size: "small",
                        icon: isGroupExpanded(group.name) ? 'mdi-chevron-down' : 'mdi-chevron-right',
                        class: "mr-1"
                      }, null, 8, ["icon"]),
                      _createVNode$6(_component_VIcon, {
                        size: "small",
                        icon: group.icon,
                        color: "primary",
                        class: "mr-1"
                      }, null, 8, ["icon"]),
                      _createTextVNode$6(" " + _toDisplayString$6(group.name) + " ", 1),
                      _createVNode$6(_component_VChip, {
                        size: "x-small",
                        variant: "tonal",
                        class: "ml-2"
                      }, {
                        default: _withCtx$6(() => [
                          _createTextVNode$6(_toDisplayString$6(group.terms.length), 1)
                        ]),
                        _: 2
                      }, 1024),
                      _createVNode$6(_component_VDivider, {
                        class: "ml-3",
                        style: {"flex":"1"}
                      })
                    ], 8, _hoisted_1$5))
                  : _createCommentVNode$5("", true),
                (group.name === '其他' || !hasGrouping.value || isGroupExpanded(group.name))
                  ? (_openBlock$6(), _createBlock$6(_component_VRow, { key: 1 }, {
                      default: _withCtx$6(() => [
                        (_openBlock$6(true), _createElementBlock$6(_Fragment$6, null, _renderList$6(group.terms, (term) => {
                          return (_openBlock$6(), _createBlock$6(_component_VCol, {
                            key: term.term + term.domain,
                            cols: "12",
                            sm: "6",
                            md: "4"
                          }, {
                            default: _withCtx$6(() => [
                              _createVNode$6(_component_VCard, {
                                variant: "outlined",
                                hover: "",
                                class: "h-100 d-flex flex-column",
                                onClick: $event => (openTerm(term))
                              }, {
                                default: _withCtx$6(() => [
                                  _createVNode$6(_component_VCardItem, null, {
                                    default: _withCtx$6(() => [
                                      _createVNode$6(_component_VCardTitle, { class: "text-body-1 font-weight-bold" }, {
                                        default: _withCtx$6(() => [
                                          _createTextVNode$6(_toDisplayString$6(term.term), 1)
                                        ]),
                                        _: 2
                                      }, 1024),
                                      _createElementVNode$5("div", _hoisted_2$5, [
                                        _createVNode$6(_component_VChip, {
                                          text: _unref$2(domainTitle)(term.domain),
                                          size: "x-small",
                                          color: "primary",
                                          variant: "tonal"
                                        }, null, 8, ["text"]),
                                        (term.group)
                                          ? (_openBlock$6(), _createBlock$6(_component_VChip, {
                                              key: 0,
                                              text: term.group,
                                              size: "x-small",
                                              variant: "outlined"
                                            }, null, 8, ["text"]))
                                          : _createCommentVNode$5("", true)
                                      ])
                                    ]),
                                    _: 2
                                  }, 1024),
                                  _createVNode$6(_component_VCardText, { class: "text-body-2 text-medium-emphasis pb-3" }, {
                                    default: _withCtx$6(() => [
                                      _createTextVNode$6(_toDisplayString$6(term.one_line), 1)
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
                  : _createCommentVNode$5("", true)
              ]))
            }), 128))
          ], 64))
        : _createCommentVNode$5("", true),
    _createVNode$6(_component_VDialog, {
      "model-value": !!selected.value,
      "max-width": "46rem",
      scrollable: "",
      "onUpdate:modelValue": closeTerm
    }, {
      default: _withCtx$6(() => [
        (selected.value)
          ? (_openBlock$6(), _createBlock$6(_component_VCard, { key: 0 }, {
              default: _withCtx$6(() => [
                _createVNode$6(_component_VCardItem, null, {
                  default: _withCtx$6(() => [
                    _createElementVNode$5("div", _hoisted_3$3, [
                      _createElementVNode$5("span", _hoisted_4$3, _toDisplayString$6(selected.value.term), 1),
                      _createVNode$6(_component_VChip, {
                        size: "small",
                        color: "primary",
                        variant: "tonal"
                      }, {
                        default: _withCtx$6(() => [
                          _createTextVNode$6(_toDisplayString$6(_unref$2(domainTitle)(selected.value.domain)), 1)
                        ]),
                        _: 1
                      }),
                      (selected.value.group)
                        ? (_openBlock$6(), _createBlock$6(_component_VChip, {
                            key: 0,
                            size: "small",
                            variant: "outlined"
                          }, {
                            default: _withCtx$6(() => [
                              _createTextVNode$6(_toDisplayString$6(selected.value.group), 1)
                            ]),
                            _: 1
                          }))
                        : _createCommentVNode$5("", true),
                      (_openBlock$6(true), _createElementBlock$6(_Fragment$6, null, _renderList$6(selected.value.tags || [], (tag) => {
                        return (_openBlock$6(), _createBlock$6(_component_VChip, {
                          key: tag,
                          size: "small",
                          variant: "outlined"
                        }, {
                          default: _withCtx$6(() => [
                            _createTextVNode$6(_toDisplayString$6(tag), 1)
                          ]),
                          _: 2
                        }, 1024))
                      }), 128))
                    ]),
                    ((selected.value.aliases || []).length)
                      ? (_openBlock$6(), _createElementBlock$6("div", _hoisted_5$2, " 别名：" + _toDisplayString$6(selected.value.aliases.join(' / ')), 1))
                      : _createCommentVNode$5("", true)
                  ]),
                  _: 1
                }),
                _createVNode$6(_component_VDivider),
                _createVNode$6(_component_VCardText, { style: {"max-height":"60vh"} }, {
                  default: _withCtx$6(() => [
                    _createElementVNode$5("div", _hoisted_6$1, _toDisplayString$6(selected.value.one_line), 1),
                    _createElementVNode$5("div", _hoisted_7$1, _toDisplayString$6(selected.value.detail), 1),
                    ((selected.value.examples || []).length)
                      ? (_openBlock$6(), _createElementBlock$6(_Fragment$6, { key: 0 }, [
                          _cache[6] || (_cache[6] = _createElementVNode$5("div", { class: "text-subtitle-2 font-weight-bold mt-4 mb-2" }, "命名示例", -1)),
                          (_openBlock$6(true), _createElementBlock$6(_Fragment$6, null, _renderList$6(selected.value.examples, (ex) => {
                            return (_openBlock$6(), _createBlock$6(_component_VCode, {
                              key: ex,
                              class: "d-block pa-2 mb-2 text-caption",
                              style: {"white-space":"pre-wrap","word-break":"break-all"}
                            }, {
                              default: _withCtx$6(() => [
                                _createTextVNode$6(_toDisplayString$6(ex), 1)
                              ]),
                              _: 2
                            }, 1024))
                          }), 128))
                        ], 64))
                      : _createCommentVNode$5("", true),
                    ((selected.value.related_mp_settings || []).length)
                      ? (_openBlock$6(), _createElementBlock$6(_Fragment$6, { key: 1 }, [
                          _cache[7] || (_cache[7] = _createElementVNode$5("div", { class: "text-subtitle-2 font-weight-bold mt-4 mb-2" }, "在 MoviePilot 中的相关设置", -1)),
                          (_openBlock$6(true), _createElementBlock$6(_Fragment$6, null, _renderList$6(selected.value.related_mp_settings, (s) => {
                            return (_openBlock$6(), _createElementBlock$6("div", {
                              key: s.label,
                              class: "mb-2 text-body-2"
                            }, [
                              _createVNode$6(_component_VIcon, {
                                size: "small",
                                icon: "mdi-cog-outline",
                                class: "mr-1"
                              }),
                              _createElementVNode$5("span", _hoisted_8$1, _toDisplayString$6(s.label), 1),
                              (s.hint)
                                ? (_openBlock$6(), _createElementBlock$6("span", _hoisted_9$1, " — " + _toDisplayString$6(s.hint), 1))
                                : _createCommentVNode$5("", true)
                            ]))
                          }), 128))
                        ], 64))
                      : _createCommentVNode$5("", true)
                  ]),
                  _: 1
                }),
                _createVNode$6(_component_VCardActions, null, {
                  default: _withCtx$6(() => [
                    _createVNode$6(_component_VSpacer),
                    _createVNode$6(_component_VBtn, {
                      variant: "text",
                      onClick: closeTerm
                    }, {
                      default: _withCtx$6(() => [...(_cache[8] || (_cache[8] = [
                        _createTextVNode$6("关闭", -1)
                      ]))]),
                      _: 1
                    })
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }))
          : _createCommentVNode$5("", true)
      ]),
      _: 1
    }, 8, ["model-value"])
  ]))
}
}

};

const {resolveComponent:_resolveComponent$5,createVNode:_createVNode$5,createTextVNode:_createTextVNode$5,withCtx:_withCtx$5,toDisplayString:_toDisplayString$5,openBlock:_openBlock$5,createBlock:_createBlock$5,createCommentVNode:_createCommentVNode$4,createElementVNode:_createElementVNode$4,renderList:_renderList$5,Fragment:_Fragment$5,createElementBlock:_createElementBlock$5} = await importShared('vue');


const _hoisted_1$4 = {
  class: "text-caption",
  style: {"max-width":"22rem","word-break":"break-all"}
};
const _hoisted_2$4 = {
  key: 1,
  class: "text-disabled"
};
const _hoisted_3$2 = {
  class: "text-caption",
  style: {"max-width":"20rem"}
};
const _hoisted_4$2 = { class: "text-caption" };
const _hoisted_5$1 = {
  key: 1,
  class: "text-disabled"
};

const {computed: computed$4,ref: ref$5} = await importShared('vue');


const _sfc_main$5 = {
  __name: 'ParseBatch',
  props: {
  api: { type: Object, default: () => ({}) },
  pluginId: { type: String, default: 'NewbieVillage' },
  sizeMatrix: { type: Object, default: () => ({}) },
},
  emits: ['open-term'],
  setup(__props, { emit: __emit }) {

const props = __props;

const pluginBase = computed$4(() => `plugin/${props.pluginId}`);
const apiClient = computed$4(() => resolveApi(props.api));

const bulkText = ref$5('');
const kind = ref$5('auto');
const loading = ref$5(false);
const error = ref$5('');
const rows = ref$5([]);

const kindOptions = [
  { title: '自动识别', value: 'auto' },
  { title: '影视', value: 'video' },
  { title: '音乐', value: 'music' },
];

function dimsSummary(parse) {
  const dims = parse?.dims || {};
  const parts = [];
  for (const [dim, items] of Object.entries(dims)) {
    for (const item of items) {
      parts.push(DIM_TITLES[dim] ? `${DIM_TITLES[dim]}:${item.value}` : item.value);
    }
  }
  return parts.slice(0, 5).join(' · ')
}

function warnOf(parse) {
  return (parse?.warnings || []).length > 0
}

async function run() {
  const lines = bulkText.value.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (!lines.length || loading.value) return
  loading.value = true;
  error.value = '';
  rows.value = [];
  try {
    const client = apiClient.value;
    if (!client) throw new Error('宿主 API 客户端不可用，请刷新页面重试')
    const data = unwrapResponse(
      await client.post(`${pluginBase.value}/parse/batch`, { texts: lines, kind: kind.value })
    );
    rows.value = (data?.results || []).map(r => ({
      text: r.text,
      parse: r.parse,
      tier: tierOf(r.parse),
      size: estimateSizeGb(props.sizeMatrix, r.parse),
    }));
  } catch (err) {
    error.value = err.message || String(err);
  } finally {
    loading.value = false;
  }
}

return (_ctx, _cache) => {
  const _component_VSelect = _resolveComponent$5("VSelect");
  const _component_VTextarea = _resolveComponent$5("VTextarea");
  const _component_VIcon = _resolveComponent$5("VIcon");
  const _component_VBtn = _resolveComponent$5("VBtn");
  const _component_VRow = _resolveComponent$5("VRow");
  const _component_VCard = _resolveComponent$5("VCard");
  const _component_VAlert = _resolveComponent$5("VAlert");
  const _component_VCardTitle = _resolveComponent$5("VCardTitle");
  const _component_VCardItem = _resolveComponent$5("VCardItem");
  const _component_VChip = _resolveComponent$5("VChip");
  const _component_VTable = _resolveComponent$5("VTable");

  return (_openBlock$5(), _createElementBlock$5("div", null, [
    _createVNode$5(_component_VCard, {
      variant: "flat",
      class: "pa-4 mb-4"
    }, {
      default: _withCtx$5(() => [
        _createVNode$5(_component_VRow, {
          align: "start",
          "no-gutters": ""
        }, {
          default: _withCtx$5(() => [
            _createVNode$5(_component_VSelect, {
              modelValue: kind.value,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => ((kind).value = $event)),
              items: kindOptions,
              variant: "outlined",
              density: "comfortable",
              "hide-details": "",
              "max-width": "9rem",
              class: "mr-4"
            }, null, 8, ["modelValue"]),
            _createVNode$5(_component_VTextarea, {
              modelValue: bulkText.value,
              "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => ((bulkText).value = $event)),
              rows: "5",
              "auto-grow": "",
              placeholder: "每行一个文件名，粘贴多行批量解析（上限 100 行）…",
              variant: "outlined",
              density: "comfortable",
              "hide-details": ""
            }, null, 8, ["modelValue"]),
            _createVNode$5(_component_VBtn, {
              color: "primary",
              class: "ml-4",
              loading: loading.value,
              onClick: run
            }, {
              default: _withCtx$5(() => [
                _createVNode$5(_component_VIcon, {
                  start: "",
                  icon: "mdi-format-list-numbered"
                }),
                _cache[2] || (_cache[2] = _createTextVNode$5(" 批量解析 ", -1))
              ]),
              _: 1
            }, 8, ["loading"])
          ]),
          _: 1
        })
      ]),
      _: 1
    }),
    (error.value)
      ? (_openBlock$5(), _createBlock$5(_component_VAlert, {
          key: 0,
          type: "error",
          variant: "tonal",
          class: "mb-4",
          density: "compact"
        }, {
          default: _withCtx$5(() => [
            _createTextVNode$5(_toDisplayString$5(error.value), 1)
          ]),
          _: 1
        }))
      : _createCommentVNode$4("", true),
    (rows.value.length)
      ? (_openBlock$5(), _createBlock$5(_component_VCard, {
          key: 1,
          variant: "outlined"
        }, {
          default: _withCtx$5(() => [
            _createVNode$5(_component_VCardItem, { class: "py-2" }, {
              default: _withCtx$5(() => [
                _createVNode$5(_component_VCardTitle, { class: "text-subtitle-1 font-weight-bold pa-0" }, {
                  default: _withCtx$5(() => [
                    _createTextVNode$5(" 解析结果（" + _toDisplayString$5(rows.value.length) + " 条） ", 1)
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }),
            _createVNode$5(_component_VTable, null, {
              default: _withCtx$5(() => [
                _cache[3] || (_cache[3] = _createElementVNode$4("thead", null, [
                  _createElementVNode$4("tr", null, [
                    _createElementVNode$4("th", { class: "text-left" }, "文件名"),
                    _createElementVNode$4("th", { class: "text-left" }, "档位"),
                    _createElementVNode$4("th", { class: "text-left" }, "维度摘要"),
                    _createElementVNode$4("th", { class: "text-left" }, "体积估算"),
                    _createElementVNode$4("th", { class: "text-left" }, "警示")
                  ])
                ], -1)),
                _createElementVNode$4("tbody", null, [
                  (_openBlock$5(true), _createElementBlock$5(_Fragment$5, null, _renderList$5(rows.value, (row) => {
                    return (_openBlock$5(), _createElementBlock$5("tr", {
                      key: row.text
                    }, [
                      _createElementVNode$4("td", _hoisted_1$4, _toDisplayString$5(row.text), 1),
                      _createElementVNode$4("td", null, [
                        (row.tier)
                          ? (_openBlock$5(), _createBlock$5(_component_VChip, {
                              key: 0,
                              size: "small",
                              color: row.tier.color,
                              variant: "tonal"
                            }, {
                              default: _withCtx$5(() => [
                                _createTextVNode$5(_toDisplayString$5(row.tier.text), 1)
                              ]),
                              _: 2
                            }, 1032, ["color"]))
                          : (_openBlock$5(), _createElementBlock$5("span", _hoisted_2$4, "—"))
                      ]),
                      _createElementVNode$4("td", _hoisted_3$2, _toDisplayString$5(dimsSummary(row.parse) || '—'), 1),
                      _createElementVNode$4("td", _hoisted_4$2, _toDisplayString$5(row.size ? `约 ${row.size.gb} GB` : '—'), 1),
                      _createElementVNode$4("td", null, [
                        (warnOf(row.parse))
                          ? (_openBlock$5(), _createBlock$5(_component_VIcon, {
                              key: 0,
                              size: "small",
                              icon: "mdi-alert-octagon",
                              color: "error"
                            }))
                          : (_openBlock$5(), _createElementBlock$5("span", _hoisted_5$1, "—"))
                      ])
                    ]))
                  }), 128))
                ])
              ]),
              _: 1
            })
          ]),
          _: 1
        }))
      : _createCommentVNode$4("", true)
  ]))
}
}

};

const {resolveComponent:_resolveComponent$4,withKeys:_withKeys$1,createVNode:_createVNode$4,withCtx:_withCtx$4,createTextVNode:_createTextVNode$4,createElementVNode:_createElementVNode$3,toDisplayString:_toDisplayString$4,openBlock:_openBlock$4,createBlock:_createBlock$4,createCommentVNode:_createCommentVNode$3,renderList:_renderList$4,Fragment:_Fragment$4,createElementBlock:_createElementBlock$4,normalizeClass:_normalizeClass$2} = await importShared('vue');


const _hoisted_1$3 = { class: "mt-3" };
const _hoisted_2$3 = { class: "text-body-2 font-weight-medium" };

const {computed: computed$3,ref: ref$4} = await importShared('vue');


const _sfc_main$4 = {
  __name: 'ParseCompare',
  props: {
  api: { type: Object, default: () => ({}) },
  pluginId: { type: String, default: 'NewbieVillage' },
},
  emits: ['open-term'],
  setup(__props, { emit: __emit }) {

const props = __props;

const pluginBase = computed$3(() => `plugin/${props.pluginId}`);
const apiClient = computed$3(() => resolveApi(props.api));

const inputA = ref$4('');
const inputB = ref$4('');
const loading = ref$4(false);
const error = ref$4('');
const parsedA = ref$4(null);
const parsedB = ref$4(null);

const compareDims = [
  { dim: 'resolution', title: '分辨率' },
  { dim: 'source', title: '来源' },
  { dim: 'vcodec', title: '视频编码' },
  { dim: 'audio', title: '音轨' },
  { dim: 'edition', title: 'HDR/制式' },
];

const RES_RANK = [
  [/^(480|576)/i, 0], [/^720/i, 1], [/^1080/i, 2], [/2160|4K|UHD/i, 3],
];
const SRC_RANK = [
  [/枪版|CAM|TeleSync|TeleCine/i, 0], [/TVRip/i, 1], [/HDTV/i, 2],
  [/WEBRip/i, 3], [/WEB-DL/i, 4], [/BluRay|Blu-Ray|蓝光/i, 5],
  [/REMUX/i, 6], [/BDMV|原盘/i, 7],
];
const AUDIO_RANK = [[/AAC/i, 1], [/DD\b|AC3/i, 2], [/DDP/i, 3], [/DTS/i, 3.5], [/TrueHD|LPCM|无损/i, 5]];
const RANKS = { resolution: RES_RANK, source: SRC_RANK, audio: AUDIO_RANK };

function firstValue(parsed, dim) {
  return parsed?.dims?.[dim]?.[0]?.value || ''
}

function rankOf(dim, value) {
  const ranks = RANKS[dim];
  if (!ranks || !value) return null
  for (const [pat, rank] of ranks) {
    if (pat.test(value)) return rank
  }
  return null
}

const compared = computed$3(() => {
  if (!parsedA.value || !parsedB.value) return []
  return compareDims.map(({ dim, title }) => {
    const a = firstValue(parsedA.value, dim);
    const b = firstValue(parsedB.value, dim);
    const ra = rankOf(dim, a);
    const rb = rankOf(dim, b);
    let winner = null;
    if (ra !== null && rb !== null && ra !== rb) winner = ra > rb ? 'A' : 'B';
    return { dim, title, a, b, ra, rb, winner }
  })
});

const extraNotes = computed$3(() => {
  const notes = [];
  for (const [label, parsed] of [['A', parsedA.value], ['B', parsedB.value]]) {
    for (const e of parsed?.dims?.edition || []) {
      notes.push(`${label} 带 ${e.value}`);
    }
  }
  return notes
});

const verdict = computed$3(() => {
  const rows = compared.value.filter(r => r.winner);
  const aWins = rows.filter(r => r.winner === 'A').length;
  const bWins = rows.filter(r => r.winner === 'B').length;
  if (!aWins && !bWins) return null
  if (aWins > bWins) return { text: `A 在 ${aWins} 个维度占优（${rows.filter(r => r.winner === 'A').map(r => r.title).join('、')}）`, side: 'A' }
  if (bWins > aWins) return { text: `B 在 ${bWins} 个维度占优（${rows.filter(r => r.winner === 'B').map(r => r.title).join('、')}）`, side: 'B' }
  return { text: '两边互有胜负，按你的设备与需求取舍', side: null }
});

function winnerStyle(winner, side) {
  return winner === side ? 'font-weight-bold text-primary' : 'text-medium-emphasis'
}

async function parseBoth() {
  const a = inputA.value.trim();
  const b = inputB.value.trim();
  if (!a || !b || loading.value) return
  loading.value = true;
  error.value = '';
  parsedA.value = parsedB.value = null;
  try {
    const client = apiClient.value;
    if (!client) throw new Error('宿主 API 客户端不可用，请刷新页面重试')
    const data = unwrapResponse(
      await client.post(`${pluginBase.value}/parse/batch`, { texts: [a, b], kind: 'video' })
    );
    const results = data?.results || [];
    parsedA.value = results[0]?.parse || null;
    parsedB.value = results[1]?.parse || null;
  } catch (err) {
    error.value = err.message || String(err);
  } finally {
    loading.value = false;
  }
}

return (_ctx, _cache) => {
  const _component_VTextField = _resolveComponent$4("VTextField");
  const _component_VCol = _resolveComponent$4("VCol");
  const _component_VRow = _resolveComponent$4("VRow");
  const _component_VIcon = _resolveComponent$4("VIcon");
  const _component_VBtn = _resolveComponent$4("VBtn");
  const _component_VCard = _resolveComponent$4("VCard");
  const _component_VAlert = _resolveComponent$4("VAlert");
  const _component_VTable = _resolveComponent$4("VTable");

  return (_openBlock$4(), _createElementBlock$4("div", null, [
    _createVNode$4(_component_VCard, {
      variant: "flat",
      class: "pa-4 mb-4"
    }, {
      default: _withCtx$4(() => [
        _createVNode$4(_component_VRow, { "no-gutters": "" }, {
          default: _withCtx$4(() => [
            _createVNode$4(_component_VCol, {
              cols: "12",
              md: "6",
              class: "pr-md-2"
            }, {
              default: _withCtx$4(() => [
                _createVNode$4(_component_VTextField, {
                  modelValue: inputA.value,
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => ((inputA).value = $event)),
                  label: "版本 A",
                  variant: "outlined",
                  density: "comfortable",
                  "hide-details": "",
                  clearable: "",
                  onKeyup: _withKeys$1(parseBoth, ["enter"])
                }, null, 8, ["modelValue"])
              ]),
              _: 1
            }),
            _createVNode$4(_component_VCol, {
              cols: "12",
              md: "6",
              class: "pl-md-2"
            }, {
              default: _withCtx$4(() => [
                _createVNode$4(_component_VTextField, {
                  modelValue: inputB.value,
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => ((inputB).value = $event)),
                  label: "版本 B",
                  variant: "outlined",
                  density: "comfortable",
                  "hide-details": "",
                  clearable: "",
                  onKeyup: _withKeys$1(parseBoth, ["enter"])
                }, null, 8, ["modelValue"])
              ]),
              _: 1
            })
          ]),
          _: 1
        }),
        _createElementVNode$3("div", _hoisted_1$3, [
          _createVNode$4(_component_VBtn, {
            color: "primary",
            loading: loading.value,
            onClick: parseBoth
          }, {
            default: _withCtx$4(() => [
              _createVNode$4(_component_VIcon, {
                start: "",
                icon: "mdi-compare-horizontal"
              }),
              _cache[2] || (_cache[2] = _createTextVNode$4(" 对比 ", -1))
            ]),
            _: 1
          }, 8, ["loading"])
        ])
      ]),
      _: 1
    }),
    (error.value)
      ? (_openBlock$4(), _createBlock$4(_component_VAlert, {
          key: 0,
          type: "error",
          variant: "tonal",
          class: "mb-4",
          density: "compact"
        }, {
          default: _withCtx$4(() => [
            _createTextVNode$4(_toDisplayString$4(error.value), 1)
          ]),
          _: 1
        }))
      : _createCommentVNode$3("", true),
    (parsedA.value && parsedB.value)
      ? (_openBlock$4(), _createElementBlock$4(_Fragment$4, { key: 1 }, [
          _createVNode$4(_component_VCard, {
            variant: "outlined",
            class: "mb-4"
          }, {
            default: _withCtx$4(() => [
              _createVNode$4(_component_VTable, null, {
                default: _withCtx$4(() => [
                  _cache[3] || (_cache[3] = _createElementVNode$3("thead", null, [
                    _createElementVNode$3("tr", null, [
                      _createElementVNode$3("th", { class: "text-left" }, "维度"),
                      _createElementVNode$3("th", { class: "text-left" }, "版本 A"),
                      _createElementVNode$3("th", { class: "text-left" }, "版本 B")
                    ])
                  ], -1)),
                  _createElementVNode$3("tbody", null, [
                    (_openBlock$4(true), _createElementBlock$4(_Fragment$4, null, _renderList$4(compared.value, (row) => {
                      return (_openBlock$4(), _createElementBlock$4("tr", {
                        key: row.dim
                      }, [
                        _createElementVNode$3("td", _hoisted_2$3, _toDisplayString$4(row.title), 1),
                        _createElementVNode$3("td", {
                          class: _normalizeClass$2(winnerStyle(row.winner, 'A'))
                        }, _toDisplayString$4(row.a || '—'), 3),
                        _createElementVNode$3("td", {
                          class: _normalizeClass$2(winnerStyle(row.winner, 'B'))
                        }, _toDisplayString$4(row.b || '—'), 3)
                      ]))
                    }), 128))
                  ])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          (verdict.value)
            ? (_openBlock$4(), _createBlock$4(_component_VAlert, {
                key: 0,
                type: "info",
                variant: "tonal",
                density: "compact",
                class: "mb-2"
              }, {
                default: _withCtx$4(() => [
                  _createTextVNode$4(_toDisplayString$4(verdict.value.text) + " ", 1),
                  _cache[4] || (_cache[4] = _createElementVNode$3("span", { class: "text-caption" }, "（按天梯口径的机械判定，实际观感以设备为准）", -1))
                ]),
                _: 1
              }))
            : _createCommentVNode$3("", true),
          (extraNotes.value.length)
            ? (_openBlock$4(), _createBlock$4(_component_VAlert, {
                key: 1,
                type: "info",
                variant: "tonal",
                density: "compact",
                class: "mb-2"
              }, {
                default: _withCtx$4(() => [
                  _createTextVNode$4(_toDisplayString$4(extraNotes.value.join(' · ')), 1)
                ]),
                _: 1
              }))
            : _createCommentVNode$3("", true),
          _cache[5] || (_cache[5] = _createElementVNode$3("div", { class: "text-caption text-disabled" }, " 对比只覆盖可机械判定的维度；字幕、压制组口碑等请结合词条详情判断。 ", -1))
        ], 64))
      : _createCommentVNode$3("", true)
  ]))
}
}

};

const {resolveComponent:_resolveComponent$3,createVNode:_createVNode$3,createTextVNode:_createTextVNode$3,withCtx:_withCtx$3,renderList:_renderList$3,Fragment:_Fragment$3,openBlock:_openBlock$3,createElementBlock:_createElementBlock$3,toDisplayString:_toDisplayString$3,createElementVNode:_createElementVNode$2,createBlock:_createBlock$3,createCommentVNode:_createCommentVNode$2,withKeys:_withKeys,normalizeClass:_normalizeClass$1,unref:_unref$1} = await importShared('vue');


const _hoisted_1$2 = {
  class: "d-flex flex-wrap ga-1 mb-2",
  style: {"line-height":"2.6"}
};
const _hoisted_2$2 = { class: "d-flex flex-wrap ga-2 text-caption text-medium-emphasis" };
const _hoisted_3$1 = { class: "text-caption text-medium-emphasis mt-2" };
const _hoisted_4$1 = ["onClick"];
const _hoisted_5 = { class: "d-flex align-center flex-wrap ga-2" };
const _hoisted_6 = {
  class: "parse-segments mb-4",
  style: {"line-height":"2.4"}
};
const _hoisted_7 = {
  key: 1,
  class: "text-body-2 mr-1 text-high-emphasis"
};
const _hoisted_8 = ["onClick"];
const _hoisted_9 = { class: "text-caption text-medium-emphasis mt-3 mb-1" };
const _hoisted_10 = { class: "text-caption text-medium-emphasis" };
const _hoisted_11 = {
  key: 0,
  class: "text-body-2 mt-2",
  style: {"line-height":"1.7"}
};
const _hoisted_12 = { class: "d-flex align-center flex-wrap ga-2" };
const _hoisted_13 = { class: "text-caption text-medium-emphasis" };
const _hoisted_14 = { class: "text-body-2 mb-2" };
const _hoisted_15 = { class: "text-medium-emphasis" };
const _hoisted_16 = {
  key: 1,
  class: "text-body-2 mb-1"
};
const _hoisted_17 = {
  key: 2,
  class: "text-caption text-medium-emphasis mb-2"
};
const _hoisted_18 = { class: "text-caption text-disabled" };
const _hoisted_19 = { class: "d-flex align-center flex-wrap ga-2" };
const _hoisted_20 = { class: "text-h6 font-weight-bold" };
const _hoisted_21 = {
  key: 0,
  class: "text-caption text-medium-emphasis mt-1"
};
const _hoisted_22 = {
  class: "text-body-1 mb-3",
  style: {"line-height":"1.8"}
};
const _hoisted_23 = {
  class: "text-body-2",
  style: {"line-height":"1.9","white-space":"pre-wrap"}
};

const {computed: computed$2,onMounted: onMounted$2,ref: ref$3} = await importShared('vue');


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

// 文件名结构图解：与解析高亮配色一致（Q2 教学卡）
const structureGuide = [
  { label: 'Black.Panther.Wakanda.Forever', title: '片名（英文原名）', color: 'grey' },
  { label: '2022', title: '年份（首映年）', color: 'brown' },
  { label: '2160p', title: '分辨率', color: 'green' },
  { label: 'BluRay', title: '片源', color: 'blue' },
  { label: 'REMUX', title: '片源形态', color: 'blue' },
  { label: 'HEVC', title: '视频编码', color: 'teal' },
  { label: 'TrueHD.7.1.Atmos', title: '音频编码+声道', color: 'orange' },
  { label: 'FGT', title: '压制组', color: 'pink' },
  { label: '.mkv', title: '封装格式', color: 'grey' },
];
const showGuide = ref$3(true);

const mode = ref$3('single');
const modeOptions = [
  { title: '单个解析', value: 'single', icon: 'mdi-magnify' },
  { title: '批量解析', value: 'batch', icon: 'mdi-format-list-numbered' },
  { title: '版本对比', value: 'compare', icon: 'mdi-compare-horizontal' },
];

const input = ref$3('');
const kind = ref$3('auto');
const kindOptions = [
  { title: '自动识别', value: 'auto' },
  { title: '影视', value: 'video' },
  { title: '音乐', value: 'music' },
];
const loading = ref$3(false);
const error = ref$3('');
const parsed = ref$3(null);
const preview = ref$3(null);
const dictTerms = ref$3([]);
const dictLadders = ref$3({});
const dictSizeMatrix = ref$3({});
const llmStatus = ref$3({ available: false, provider: '', model: '' });
const llmLoading = ref$3(false);
const aiResult = ref$3(null);
const aiNotice = ref$3('');

const selectedTerm = ref$3(null);

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

// 画质档次徽章与体积估算：共享逻辑见 utils.js（批量/对比模式复用）
const tier = computed$2(() => tierOf(parsed.value));

const sizeEstimate = computed$2(() => {
  if (!preview.value || preview.value.media_type === '音乐' || !parsed.value) return null
  return estimateSizeGb(dictSizeMatrix.value, parsed.value)
});

// 重命名预览（推断展示）
const renamePreview = computed$2(() => {
  if (!preview.value || !parsed.value) return null
  return renamePreviewOf(parsed.value)
});

onMounted$2(() => {
  loadDict();
  loadLlmStatus();
});

return (_ctx, _cache) => {
  const _component_VIcon = _resolveComponent$3("VIcon");
  const _component_VCardTitle = _resolveComponent$3("VCardTitle");
  const _component_VCardItem = _resolveComponent$3("VCardItem");
  const _component_VChip = _resolveComponent$3("VChip");
  const _component_VCardText = _resolveComponent$3("VCardText");
  const _component_VCard = _resolveComponent$3("VCard");
  const _component_VBtn = _resolveComponent$3("VBtn");
  const _component_VBtnToggle = _resolveComponent$3("VBtnToggle");
  const _component_VSelect = _resolveComponent$3("VSelect");
  const _component_VTextField = _resolveComponent$3("VTextField");
  const _component_VRow = _resolveComponent$3("VRow");
  const _component_VAlert = _resolveComponent$3("VAlert");
  const _component_VCol = _resolveComponent$3("VCol");
  const _component_VCode = _resolveComponent$3("VCode");
  const _component_VDivider = _resolveComponent$3("VDivider");
  const _component_VEmptyState = _resolveComponent$3("VEmptyState");
  const _component_VSpacer = _resolveComponent$3("VSpacer");
  const _component_VCardActions = _resolveComponent$3("VCardActions");
  const _component_VDialog = _resolveComponent$3("VDialog");

  return (_openBlock$3(), _createElementBlock$3("div", null, [
    _createVNode$3(_component_VCard, {
      variant: "outlined",
      class: "mb-4"
    }, {
      default: _withCtx$3(() => [
        _createVNode$3(_component_VCardItem, {
          class: "py-2",
          style: {"cursor":"pointer"},
          onClick: _cache[0] || (_cache[0] = $event => (showGuide.value = !showGuide.value))
        }, {
          prepend: _withCtx$3(() => [
            _createVNode$3(_component_VIcon, {
              icon: showGuide.value ? 'mdi-chevron-down' : 'mdi-chevron-right'
            }, null, 8, ["icon"]),
            _createVNode$3(_component_VIcon, {
              icon: "mdi-file-document-outline",
              color: "primary"
            })
          ]),
          default: _withCtx$3(() => [
            _createVNode$3(_component_VCardTitle, { class: "text-subtitle-2 font-weight-bold pa-0" }, {
              default: _withCtx$3(() => [...(_cache[6] || (_cache[6] = [
                _createTextVNode$3(" 文件名结构图解 —— 一段文件名从左到右每段是什么？ ", -1)
              ]))]),
              _: 1
            })
          ]),
          _: 1
        }),
        (showGuide.value)
          ? (_openBlock$3(), _createBlock$3(_component_VCardText, {
              key: 0,
              class: "pt-0"
            }, {
              default: _withCtx$3(() => [
                _createElementVNode$2("div", _hoisted_1$2, [
                  (_openBlock$3(), _createElementBlock$3(_Fragment$3, null, _renderList$3(structureGuide, (seg) => {
                    return _createVNode$3(_component_VChip, {
                      key: seg.title,
                      color: seg.color,
                      size: "small",
                      variant: "tonal"
                    }, {
                      default: _withCtx$3(() => [
                        _createTextVNode$3(_toDisplayString$3(seg.label), 1)
                      ]),
                      _: 2
                    }, 1032, ["color"])
                  }), 64))
                ]),
                _createElementVNode$2("div", _hoisted_2$2, [
                  (_openBlock$3(), _createElementBlock$3(_Fragment$3, null, _renderList$3(structureGuide, (seg) => {
                    return _createElementVNode$2("span", {
                      key: seg.title
                    }, [
                      _createVNode$3(_component_VIcon, {
                        size: "x-small",
                        icon: "mdi-circle",
                        color: seg.color,
                        class: "mr-1"
                      }, null, 8, ["color"]),
                      _createTextVNode$3(" " + _toDisplayString$3(seg.title), 1)
                    ])
                  }), 64))
                ]),
                _cache[7] || (_cache[7] = _createElementVNode$2("div", { class: "text-caption text-disabled mt-2" }, " 各段用「.」分隔 · 片名用英文原名（译名各地不同） · 年份取首映年（剧集取开播年） · 把同样的名字粘贴到下面立即实测解析 ", -1))
              ]),
              _: 1
            }))
          : _createCommentVNode$2("", true)
      ]),
      _: 1
    }),
    _createVNode$3(_component_VCard, {
      variant: "tonal",
      color: "primary",
      class: "mb-4 pa-1"
    }, {
      default: _withCtx$3(() => [
        _createVNode$3(_component_VBtnToggle, {
          modelValue: mode.value,
          "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => ((mode).value = $event)),
          mandatory: "",
          color: "primary",
          variant: "text",
          class: "w-100"
        }, {
          default: _withCtx$3(() => [
            (_openBlock$3(), _createElementBlock$3(_Fragment$3, null, _renderList$3(modeOptions, (m) => {
              return _createVNode$3(_component_VBtn, {
                key: m.value,
                value: m.value,
                class: "flex-grow-1"
              }, {
                default: _withCtx$3(() => [
                  _createVNode$3(_component_VIcon, {
                    start: "",
                    size: "small",
                    icon: m.icon
                  }, null, 8, ["icon"]),
                  _createTextVNode$3(" " + _toDisplayString$3(m.title), 1)
                ]),
                _: 2
              }, 1032, ["value"])
            }), 64))
          ]),
          _: 1
        }, 8, ["modelValue"])
      ]),
      _: 1
    }),
    (mode.value === 'single')
      ? (_openBlock$3(), _createElementBlock$3(_Fragment$3, { key: 0 }, [
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
                    "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => ((kind).value = $event)),
                    items: kindOptions,
                    variant: "outlined",
                    density: "comfortable",
                    "hide-details": "",
                    "max-width": "9rem",
                    class: "mr-4"
                  }, null, 8, ["modelValue"]),
                  _createVNode$3(_component_VTextField, {
                    modelValue: input.value,
                    "onUpdate:modelValue": _cache[3] || (_cache[3] = $event => ((input).value = $event)),
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
                      _cache[8] || (_cache[8] = _createTextVNode$3(" 解析 ", -1))
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
                          _cache[9] || (_cache[9] = _createTextVNode$3(" AI 兜底解析 ", -1))
                        ]),
                        _: 1
                      }, 8, ["loading"]))
                    : _createCommentVNode$2("", true)
                ]),
                _: 1
              }),
              _createElementVNode$2("div", _hoisted_3$1, [
                _cache[10] || (_cache[10] = _createTextVNode$3(" 试试： ", -1)),
                (_openBlock$3(), _createElementBlock$3(_Fragment$3, null, _renderList$3(examples, (ex) => {
                  return _createElementVNode$2("a", {
                    key: ex,
                    class: "mr-3",
                    href: "javascript:void(0)",
                    onClick: $event => (tryExample(ex))
                  }, _toDisplayString$3(ex.slice(0, 42)) + "…", 9, _hoisted_4$1)
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
            : _createCommentVNode$2("", true),
          (parsed.value)
            ? (_openBlock$3(), _createElementBlock$3(_Fragment$3, { key: 1 }, [
                _createVNode$3(_component_VCard, {
                  variant: "outlined",
                  class: "mb-4"
                }, {
                  default: _withCtx$3(() => [
                    _createVNode$3(_component_VCardItem, { class: "pb-2" }, {
                      default: _withCtx$3(() => [
                        _createElementVNode$2("div", _hoisted_5, [
                          _createVNode$3(_component_VCardTitle, { class: "text-subtitle-1 font-weight-bold pa-0" }, {
                            default: _withCtx$3(() => [...(_cache[11] || (_cache[11] = [
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
                            : _createCommentVNode$2("", true),
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
                            : _createCommentVNode$2("", true)
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
                              _cache[12] || (_cache[12] = _createTextVNode$3(" 这是影院偷录/翻录版本，画质和音质都很差，除非全网没有更好的选择，否则不建议下载收藏。 在「词典 → 天梯」里看看正常来源的画质阶梯。 ", -1))
                            ]),
                            _: 2
                          }, 1024))
                        }), 128)),
                        _createElementVNode$2("div", _hoisted_6, [
                          (_openBlock$3(true), _createElementBlock$3(_Fragment$3, null, _renderList$3(parsed.value.segments, (seg, i) => {
                            return (_openBlock$3(), _createElementBlock$3(_Fragment$3, { key: i }, [
                              (seg.dim && seg.raw.trim())
                                ? (_openBlock$3(), _createBlock$3(_component_VChip, {
                                    key: 0,
                                    color: segmentColor(seg),
                                    size: "small",
                                    variant: seg.ref && termByRef.value[seg.ref] ? 'tonal' : 'outlined',
                                    class: _normalizeClass$1(["mr-1 mb-1", { 'cursor-pointer': seg.ref && termByRef.value[seg.ref] }]),
                                    title: seg.ref && termByRef.value[seg.ref] ? '点击查看词条' : '',
                                    onClick: $event => (openRef(seg.ref))
                                  }, {
                                    default: _withCtx$3(() => [
                                      _createTextVNode$3(_toDisplayString$3(seg.raw), 1)
                                    ]),
                                    _: 2
                                  }, 1032, ["color", "variant", "class", "title", "onClick"]))
                                : (seg.raw.trim())
                                  ? (_openBlock$3(), _createElementBlock$3("span", _hoisted_7, _toDisplayString$3(seg.raw), 1))
                                  : _createCommentVNode$2("", true)
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
                                                class: _normalizeClass$1({ 'cursor-pointer text-decoration-underline': item.ref && termByRef.value[item.ref] }),
                                                onClick: $event => (openRef(item.ref))
                                              }, [
                                                _createTextVNode$3(_toDisplayString$3(item.label), 1),
                                                (item.value && item.value !== item.label)
                                                  ? (_openBlock$3(), _createElementBlock$3(_Fragment$3, { key: 0 }, [
                                                      _createTextVNode$3("（" + _toDisplayString$3(item.value) + "）", 1)
                                                    ], 64))
                                                  : _createCommentVNode$2("", true)
                                              ], 10, _hoisted_8)
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
                              _createElementVNode$2("div", _hoisted_9, [
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
                          : _createCommentVNode$2("", true),
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
                                    _createElementVNode$2("span", _hoisted_10, _toDisplayString$3(aiResult.value.provider) + " / " + _toDisplayString$3(aiResult.value.model) + " · " + _toDisplayString$3(aiResult.value.duration_ms) + "ms ", 1)
                                  ]),
                                  default: _withCtx$3(() => [
                                    _createVNode$3(_component_VCardTitle, { class: "text-subtitle-1 font-weight-bold pa-0" }, {
                                      default: _withCtx$3(() => [...(_cache[13] || (_cache[13] = [
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
                                      ? (_openBlock$3(), _createElementBlock$3("div", _hoisted_11, _toDisplayString$3(aiResult.value.explanation), 1))
                                      : _createCommentVNode$2("", true)
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
                            : _createCommentVNode$2("", true)
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
                            _createElementVNode$2("div", _hoisted_12, [
                              _createVNode$3(_component_VIcon, {
                                icon: "mdi-target",
                                color: "primary"
                              }),
                              _createVNode$3(_component_VCardTitle, { class: "text-subtitle-1 font-weight-bold pa-0" }, {
                                default: _withCtx$3(() => [...(_cache[14] || (_cache[14] = [
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
                              _createElementVNode$2("span", _hoisted_13, _toDisplayString$3(preview.value.media_type_source), 1)
                            ])
                          ]),
                          _: 1
                        }),
                        _createVNode$3(_component_VCardText, null, {
                          default: _withCtx$3(() => [
                            (preview.value.directory)
                              ? (_openBlock$3(), _createElementBlock$3(_Fragment$3, { key: 0 }, [
                                  _createElementVNode$2("div", _hoisted_14, [
                                    _createVNode$3(_component_VIcon, {
                                      size: "x-small",
                                      icon: "mdi-folder-move-outline",
                                      class: "mr-1"
                                    }),
                                    _cache[15] || (_cache[15] = _createTextVNode$3(" 命中目录配置：", -1)),
                                    _createElementVNode$2("b", null, _toDisplayString$3(preview.value.directory.name), 1),
                                    _createElementVNode$2("span", _hoisted_15, " （" + _toDisplayString$3(preview.value.directory.transfer_type) + " 模式 · 智能重命名 " + _toDisplayString$3(preview.value.directory.renaming ? '开' : '关') + "） ", 1)
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
                                          _cache[16] || (_cache[16] = _createTextVNode$3(" 预计体积：", -1)),
                                          _createElementVNode$2("b", null, "约 " + _toDisplayString$3(sizeEstimate.value.gb) + " GB", 1),
                                          _createTextVNode$3("（" + _toDisplayString$3(sizeEstimate.value.combo) + " · 估算值，随片长与码率浮动） ", 1)
                                        ]),
                                        _: 1
                                      }))
                                    : _createCommentVNode$2("", true),
                                  (renamePreview.value)
                                    ? (_openBlock$3(), _createBlock$3(_component_VAlert, {
                                        key: 1,
                                        type: "success",
                                        variant: "tonal",
                                        density: "compact",
                                        class: "mb-2"
                                      }, {
                                        default: _withCtx$3(() => [
                                          _cache[17] || (_cache[17] = _createTextVNode$3(" 整理后命名预览：", -1)),
                                          _createElementVNode$2("b", null, _toDisplayString$3(renamePreview.value), 1),
                                          _cache[18] || (_cache[18] = _createElementVNode$2("span", { class: "text-caption" }, "（推断展示，以实际整理结果为准）", -1))
                                        ]),
                                        _: 1
                                      }))
                                    : _createCommentVNode$2("", true)
                                ], 64))
                              : _createCommentVNode$2("", true),
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
                              ? (_openBlock$3(), _createElementBlock$3("div", _hoisted_16, [
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
                              : _createCommentVNode$2("", true),
                            (preview.value.classification?.note)
                              ? (_openBlock$3(), _createElementBlock$3("div", _hoisted_17, _toDisplayString$3(preview.value.classification.note), 1))
                              : _createCommentVNode$2("", true),
                            _createVNode$3(_component_VDivider, { class: "my-2" }),
                            _createElementVNode$2("div", _hoisted_18, [
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
                  : _createCommentVNode$2("", true)
              ], 64))
            : _createCommentVNode$2("", true)
        ], 64))
      : _createCommentVNode$2("", true),
    (mode.value === 'batch')
      ? (_openBlock$3(), _createBlock$3(_sfc_main$5, {
          key: 1,
          api: __props.api,
          "plugin-id": __props.pluginId,
          "size-matrix": dictSizeMatrix.value,
          onOpenTerm: openRef
        }, null, 8, ["api", "plugin-id", "size-matrix"]))
      : (mode.value === 'compare')
        ? (_openBlock$3(), _createBlock$3(_sfc_main$4, {
            key: 2,
            api: __props.api,
            "plugin-id": __props.pluginId,
            onOpenTerm: openRef
          }, null, 8, ["api", "plugin-id"]))
        : _createCommentVNode$2("", true),
    (mode.value === 'single' && !loading.value && !error.value && !parsed.value)
      ? (_openBlock$3(), _createBlock$3(_component_VEmptyState, {
          key: 3,
          icon: "mdi-magnify-scan",
          headline: "粘贴文件名开始解析",
          text: "支持影视命名（来源/分辨率/编码/音轨/季集/发布组）与音乐命名（格式/规格/发行类型）"
        }))
      : _createCommentVNode$2("", true),
    _createVNode$3(_component_VDialog, {
      "model-value": !!selectedTerm.value,
      "max-width": "42rem",
      scrollable: "",
      "onUpdate:modelValue": _cache[5] || (_cache[5] = $event => (selectedTerm.value = null))
    }, {
      default: _withCtx$3(() => [
        (selectedTerm.value)
          ? (_openBlock$3(), _createBlock$3(_component_VCard, { key: 0 }, {
              default: _withCtx$3(() => [
                _createVNode$3(_component_VCardItem, null, {
                  default: _withCtx$3(() => [
                    _createElementVNode$2("div", _hoisted_19, [
                      _createElementVNode$2("span", _hoisted_20, _toDisplayString$3(selectedTerm.value.term), 1),
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
                      ? (_openBlock$3(), _createElementBlock$3("div", _hoisted_21, " 别名：" + _toDisplayString$3(selectedTerm.value.aliases.join(' / ')), 1))
                      : _createCommentVNode$2("", true)
                  ]),
                  _: 1
                }),
                _createVNode$3(_component_VDivider),
                _createVNode$3(_component_VCardText, { style: {"max-height":"55vh"} }, {
                  default: _withCtx$3(() => [
                    _createElementVNode$2("div", _hoisted_22, _toDisplayString$3(selectedTerm.value.one_line), 1),
                    _createElementVNode$2("div", _hoisted_23, _toDisplayString$3(selectedTerm.value.detail), 1),
                    ((selectedTerm.value.examples || []).length)
                      ? (_openBlock$3(), _createElementBlock$3(_Fragment$3, { key: 0 }, [
                          _cache[19] || (_cache[19] = _createElementVNode$2("div", { class: "text-subtitle-2 font-weight-bold mt-3 mb-2" }, "命名示例", -1)),
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
                      : _createCommentVNode$2("", true)
                  ]),
                  _: 1
                }),
                _createVNode$3(_component_VCardActions, null, {
                  default: _withCtx$3(() => [
                    _createVNode$3(_component_VSpacer),
                    _createVNode$3(_component_VBtn, {
                      variant: "text",
                      onClick: _cache[4] || (_cache[4] = $event => (selectedTerm.value = null))
                    }, {
                      default: _withCtx$3(() => [...(_cache[20] || (_cache[20] = [
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
          : _createCommentVNode$2("", true)
      ]),
      _: 1
    }, 8, ["model-value"])
  ]))
}
}

};

const {toDisplayString:_toDisplayString$2,createTextVNode:_createTextVNode$2,resolveComponent:_resolveComponent$2,withCtx:_withCtx$2,createVNode:_createVNode$2,openBlock:_openBlock$2,createBlock:_createBlock$2,createCommentVNode:_createCommentVNode$1,renderList:_renderList$2,Fragment:_Fragment$2,createElementBlock:_createElementBlock$2,createElementVNode:_createElementVNode$1,unref:_unref} = await importShared('vue');


const _hoisted_1$1 = { class: "text-subtitle-1 font-weight-bold mb-2" };
const _hoisted_2$1 = { class: "d-flex align-center flex-wrap ga-2" };
const _hoisted_3 = { class: "text-h6 font-weight-bold" };
const _hoisted_4 = ["innerHTML"];

const {computed: computed$1,onMounted: onMounted$1,ref: ref$2} = await importShared('vue');


const _sfc_main$2 = {
  __name: 'CaseView',
  props: {
  api: { type: Object, default: () => ({}) },
  pluginId: { type: String, default: 'NewbieVillage' },
},
  setup(__props) {

const props = __props;

const loading = ref$2(false);
const error = ref$2('');
const cases = ref$2([]);
const selected = ref$2(null);
const detailLoading = ref$2(false);

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

onMounted$1(load);

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
      : _createCommentVNode$1("", true),
    (loading.value)
      ? (_openBlock$2(), _createBlock$2(_component_VProgressLinear, {
          key: 1,
          indeterminate: "",
          color: "primary",
          class: "mb-2"
        }))
      : _createCommentVNode$1("", true),
    (!loading.value && !cases.value.length)
      ? (_openBlock$2(), _createBlock$2(_component_VEmptyState, {
          key: 2,
          icon: "mdi-map-legend",
          headline: "暂无案例",
          text: "实战案例整理中"
        }))
      : _createCommentVNode$1("", true),
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
                        : _createCommentVNode$1("", true)
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
                    _createElementVNode$1("div", _hoisted_2$1, [
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
          : _createCommentVNode$1("", true)
      ]),
      _: 1
    }, 8, ["model-value"])
  ]))
}
}

};

const {resolveComponent:_resolveComponent$1,createVNode:_createVNode$1,createElementVNode:_createElementVNode,createTextVNode:_createTextVNode$1,withCtx:_withCtx$1,toDisplayString:_toDisplayString$1,openBlock:_openBlock$1,createBlock:_createBlock$1,createCommentVNode:_createCommentVNode,renderList:_renderList$1,Fragment:_Fragment$1,createElementBlock:_createElementBlock$1,normalizeClass:_normalizeClass} = await importShared('vue');


const _hoisted_1 = { class: "d-flex align-center flex-wrap ga-3" };
const _hoisted_2 = {
  key: 0,
  class: "text-caption text-medium-emphasis mt-1"
};

const {computed,onMounted,ref: ref$1} = await importShared('vue');


const _sfc_main$1 = {
  __name: 'HealthView',
  props: {
  api: { type: Object, default: () => ({}) },
  pluginId: { type: String, default: 'NewbieVillage' },
},
  setup(__props) {

const props = __props;

const pluginBase = computed(() => `plugin/${props.pluginId}`);
const apiClient = computed(() => resolveApi(props.api));

const loading = ref$1(false);
const error = ref$1('');
const report = ref$1(null);
const expanded = ref$1(new Set());

const STATUS_META = {
  ok: { icon: 'mdi-check-circle', color: 'success', text: '通过' },
  info: { icon: 'mdi-information', color: 'info', text: '提示' },
  warn: { icon: 'mdi-alert', color: 'warning', text: '警告' },
  error: { icon: 'mdi-close-circle', color: 'error', text: '错误' },
};

const summary = computed(() => report.value?.summary || {});
const results = computed(() => report.value?.results || []);

const overall = computed(() => {
  const s = summary.value;
  if ((s.error || 0) > 0) return { icon: 'mdi-close-circle', color: 'error', text: `发现 ${s.error} 项错误` }
  if ((s.warn || 0) > 0) return { icon: 'mdi-alert', color: 'warning', text: `发现 ${s.warn} 项警告` }
  return { icon: 'mdi-check-decagram', color: 'success', text: '全部检查通过' }
});

function toggleExpand(id) {
  const next = new Set(expanded.value);
  next.has(id) ? next.delete(id) : next.add(id);
  expanded.value = next;
}

async function run() {
  if (loading.value) return
  loading.value = true;
  error.value = '';
  try {
    const client = apiClient.value;
    if (!client) throw new Error('宿主 API 客户端不可用，请刷新页面重试')
    report.value = unwrapResponse(await client.get(`${pluginBase.value}/health/checks`));
    expanded.value = new Set(
      (report.value?.results || [])
        .filter(r => r.status === 'error' || r.status === 'warn')
        .map(r => r.id)
    );
  } catch (err) {
    error.value = err.message || String(err);
  } finally {
    loading.value = false;
  }
}

onMounted(run);

return (_ctx, _cache) => {
  const _component_VIcon = _resolveComponent$1("VIcon");
  const _component_VBtn = _resolveComponent$1("VBtn");
  const _component_VCard = _resolveComponent$1("VCard");
  const _component_VAlert = _resolveComponent$1("VAlert");
  const _component_VCardTitle = _resolveComponent$1("VCardTitle");
  const _component_VChip = _resolveComponent$1("VChip");
  const _component_VChipGroup = _resolveComponent$1("VChipGroup");
  const _component_VCardItem = _resolveComponent$1("VCardItem");
  const _component_VCardText = _resolveComponent$1("VCardText");
  const _component_VEmptyState = _resolveComponent$1("VEmptyState");

  return (_openBlock$1(), _createElementBlock$1("div", null, [
    _createVNode$1(_component_VCard, {
      variant: "flat",
      class: "pa-4 mb-4"
    }, {
      default: _withCtx$1(() => [
        _createElementVNode("div", _hoisted_1, [
          _createVNode$1(_component_VIcon, {
            icon: "mdi-stethoscope",
            color: "primary",
            size: "26"
          }),
          _cache[1] || (_cache[1] = _createElementVNode("div", { class: "text-subtitle-1 font-weight-bold" }, "配置体检", -1)),
          _createVNode$1(_component_VBtn, {
            color: "primary",
            size: "small",
            loading: loading.value,
            "prepend-icon": "mdi-refresh",
            class: "ml-auto",
            onClick: run
          }, {
            default: _withCtx$1(() => [...(_cache[0] || (_cache[0] = [
              _createTextVNode$1(" 重新体检 ", -1)
            ]))]),
            _: 1
          }, 8, ["loading"])
        ]),
        _cache[2] || (_cache[2] = _createElementVNode("div", { class: "text-caption text-medium-emphasis mt-1" }, " 只读检测你的真实配置：目录映射、分类策略、过滤规则、识别词正则、硬链接可行性、媒体服务器与存储健康。 不修改任何配置。 ", -1))
      ]),
      _: 1
    }),
    (error.value)
      ? (_openBlock$1(), _createBlock$1(_component_VAlert, {
          key: 0,
          type: "error",
          variant: "tonal",
          class: "mb-4",
          density: "compact"
        }, {
          default: _withCtx$1(() => [
            _createTextVNode$1(_toDisplayString$1(error.value) + " ", 1),
            _createVNode$1(_component_VBtn, {
              size: "small",
              variant: "text",
              color: "white",
              class: "ml-2",
              onClick: run
            }, {
              default: _withCtx$1(() => [...(_cache[3] || (_cache[3] = [
                _createTextVNode$1("重试", -1)
              ]))]),
              _: 1
            })
          ]),
          _: 1
        }))
      : _createCommentVNode("", true),
    (report.value)
      ? (_openBlock$1(), _createElementBlock$1(_Fragment$1, { key: 1 }, [
          _createVNode$1(_component_VCard, {
            variant: "tonal",
            color: overall.value.color,
            class: "mb-4"
          }, {
            default: _withCtx$1(() => [
              _createVNode$1(_component_VCardItem, { class: "py-3" }, {
                prepend: _withCtx$1(() => [
                  _createVNode$1(_component_VIcon, {
                    icon: overall.value.icon,
                    size: "30"
                  }, null, 8, ["icon"])
                ]),
                append: _withCtx$1(() => [
                  _createVNode$1(_component_VChipGroup, null, {
                    default: _withCtx$1(() => [
                      _createVNode$1(_component_VChip, {
                        size: "small",
                        color: "success",
                        variant: "tonal"
                      }, {
                        default: _withCtx$1(() => [
                          _createTextVNode$1("通过 " + _toDisplayString$1(summary.value.ok || 0), 1)
                        ]),
                        _: 1
                      }),
                      _createVNode$1(_component_VChip, {
                        size: "small",
                        color: "info",
                        variant: "tonal"
                      }, {
                        default: _withCtx$1(() => [
                          _createTextVNode$1("提示 " + _toDisplayString$1(summary.value.info || 0), 1)
                        ]),
                        _: 1
                      }),
                      _createVNode$1(_component_VChip, {
                        size: "small",
                        color: "warning",
                        variant: "tonal"
                      }, {
                        default: _withCtx$1(() => [
                          _createTextVNode$1("警告 " + _toDisplayString$1(summary.value.warn || 0), 1)
                        ]),
                        _: 1
                      }),
                      _createVNode$1(_component_VChip, {
                        size: "small",
                        color: "error",
                        variant: "tonal"
                      }, {
                        default: _withCtx$1(() => [
                          _createTextVNode$1("错误 " + _toDisplayString$1(summary.value.error || 0), 1)
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                default: _withCtx$1(() => [
                  _createVNode$1(_component_VCardTitle, { class: "text-h6 font-weight-bold pa-0" }, {
                    default: _withCtx$1(() => [
                      _createTextVNode$1(_toDisplayString$1(overall.value.text), 1)
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["color"]),
          (_openBlock$1(true), _createElementBlock$1(_Fragment$1, null, _renderList$1(results.value, (r) => {
            return (_openBlock$1(), _createBlock$1(_component_VCard, {
              key: r.id,
              variant: "outlined",
              class: _normalizeClass(["mb-2", { 'cursor-pointer': (r.details || []).length }]),
              onClick: $event => ((r.details || []).length && toggleExpand(r.id))
            }, {
              default: _withCtx$1(() => [
                _createVNode$1(_component_VCardItem, { class: "py-2" }, {
                  prepend: _withCtx$1(() => [
                    _createVNode$1(_component_VIcon, {
                      icon: STATUS_META[r.status]?.icon || 'mdi-help-circle',
                      color: STATUS_META[r.status]?.color || 'grey'
                    }, null, 8, ["icon", "color"])
                  ]),
                  append: _withCtx$1(() => [
                    _createVNode$1(_component_VChip, {
                      size: "x-small",
                      color: STATUS_META[r.status]?.color || 'grey',
                      variant: "tonal"
                    }, {
                      default: _withCtx$1(() => [
                        _createTextVNode$1(_toDisplayString$1(STATUS_META[r.status]?.text || r.status), 1)
                      ]),
                      _: 2
                    }, 1032, ["color"]),
                    ((r.details || []).length)
                      ? (_openBlock$1(), _createBlock$1(_component_VIcon, {
                          key: 0,
                          size: "small",
                          icon: expanded.value.has(r.id) ? 'mdi-chevron-up' : 'mdi-chevron-down',
                          class: "ml-2"
                        }, null, 8, ["icon"]))
                      : _createCommentVNode("", true)
                  ]),
                  default: _withCtx$1(() => [
                    _createVNode$1(_component_VCardTitle, { class: "text-body-1 font-weight-medium pa-0" }, {
                      default: _withCtx$1(() => [
                        _createTextVNode$1(_toDisplayString$1(r.title), 1)
                      ]),
                      _: 2
                    }, 1024)
                  ]),
                  _: 2
                }, 1024),
                _createVNode$1(_component_VCardText, { class: "py-1 text-body-2 text-medium-emphasis" }, {
                  default: _withCtx$1(() => [
                    _createTextVNode$1(_toDisplayString$1(r.message), 1)
                  ]),
                  _: 2
                }, 1024),
                (expanded.value.has(r.id) && (r.details || []).length)
                  ? (_openBlock$1(), _createBlock$1(_component_VCardText, {
                      key: 0,
                      class: "pt-0"
                    }, {
                      default: _withCtx$1(() => [
                        (_openBlock$1(true), _createElementBlock$1(_Fragment$1, null, _renderList$1(r.details, (d, i) => {
                          return (_openBlock$1(), _createBlock$1(_component_VAlert, {
                            key: i,
                            type: r.status === 'error' ? 'error' : r.status === 'warn' ? 'warning' : 'info',
                            variant: "tonal",
                            density: "compact",
                            class: "mb-1 text-body-2"
                          }, {
                            default: _withCtx$1(() => [
                              _createTextVNode$1(_toDisplayString$1(d), 1)
                            ]),
                            _: 2
                          }, 1032, ["type"]))
                        }), 128)),
                        (r.advice)
                          ? (_openBlock$1(), _createElementBlock$1("div", _hoisted_2, [
                              _createVNode$1(_component_VIcon, {
                                size: "x-small",
                                icon: "mdi-lightbulb-outline",
                                class: "mr-1"
                              }),
                              _createTextVNode$1(" " + _toDisplayString$1(r.advice), 1)
                            ]))
                          : _createCommentVNode("", true)
                      ]),
                      _: 2
                    }, 1024))
                  : _createCommentVNode("", true)
              ]),
              _: 2
            }, 1032, ["class", "onClick"]))
          }), 128)),
          _cache[4] || (_cache[4] = _createElementVNode("div", { class: "text-caption text-disabled mt-2" }, " 体检为只读模拟与探测：文件系统级判断基于容器内实际挂载（st_dev 对比），媒体服务器仅探测网络可达性，NFS 通过日志痕迹检测（避免 stat 挂死）。 ", -1))
        ], 64))
      : (!loading.value && !error.value)
        ? (_openBlock$1(), _createBlock$1(_component_VEmptyState, {
            key: 2,
            icon: "mdi-stethoscope",
            headline: "正在准备体检…",
            text: "读取真实配置做只读检测"
          }))
        : _createCommentVNode("", true)
  ]))
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
              _createVNode(_sfc_main$6, {
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
