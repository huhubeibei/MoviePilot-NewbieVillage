import { importShared } from './__federation_fn_import-JrT3xvdd.js';

const {resolveComponent:_resolveComponent,createVNode:_createVNode,createElementVNode:_createElementVNode,renderList:_renderList,Fragment:_Fragment,openBlock:_openBlock,createElementBlock:_createElementBlock,toDisplayString:_toDisplayString,createTextVNode:_createTextVNode,withCtx:_withCtx,createBlock:_createBlock} = await importShared('vue');


const _hoisted_1 = { class: "d-flex align-center mb-4" };


const _sfc_main = {
  __name: 'Page',
  props: {
  api: { type: Object, default: () => ({}) },
},
  emits: ['action', 'close'],
  setup(__props) {

// 插件详情页：概览 + 引导到侧栏主页面。



const features = [
  {
    icon: 'mdi-book-open-variant',
    title: '术语词典',
    desc: '影视命名 / 音乐命名 / PT 行为 / MP 概念四领域词条，支持搜索与远端刷新',
  },
  {
    icon: 'mdi-magnify-scan',
    title: '命名解析器',
    desc: '粘贴文件名逐段解析，M2 交付',
  },
  {
    icon: 'mdi-map-legend',
    title: '实战案例',
    desc: '音乐入库、H&R、硬链接跨盘等真实踩坑故事线',
  },
  {
    icon: 'mdi-stethoscope',
    title: '配置体检',
    desc: '十项配置自检与修复建议，v2.0 交付',
  },
];

return (_ctx, _cache) => {
  const _component_VIcon = _resolveComponent("VIcon");
  const _component_VCardTitle = _resolveComponent("VCardTitle");
  const _component_VCardItem = _resolveComponent("VCardItem");
  const _component_VCardText = _resolveComponent("VCardText");
  const _component_VCard = _resolveComponent("VCard");
  const _component_VCol = _resolveComponent("VCol");
  const _component_VRow = _resolveComponent("VRow");
  const _component_VAlert = _resolveComponent("VAlert");

  return (_openBlock(), _createBlock(_component_VCard, {
    variant: "flat",
    class: "pa-6"
  }, {
    default: _withCtx(() => [
      _createElementVNode("div", _hoisted_1, [
        _createVNode(_component_VIcon, {
          icon: "mdi-school",
          color: "primary",
          size: "32",
          class: "mr-3"
        }),
        _cache[0] || (_cache[0] = _createElementVNode("div", null, [
          _createElementVNode("div", { class: "text-h6 font-weight-bold" }, "影音新手村"),
          _createElementVNode("div", { class: "text-caption text-medium-emphasis" }, " 影视/音乐新手通关手册 · 词典 | 解析 | 案例 | 体检 ")
        ], -1))
      ]),
      _createVNode(_component_VRow, {
        dense: "",
        class: "mb-4"
      }, {
        default: _withCtx(() => [
          (_openBlock(), _createElementBlock(_Fragment, null, _renderList(features, (f) => {
            return _createVNode(_component_VCol, {
              key: f.title,
              cols: "12",
              sm: "6"
            }, {
              default: _withCtx(() => [
                _createVNode(_component_VCard, {
                  variant: "tonal",
                  class: "h-100"
                }, {
                  default: _withCtx(() => [
                    _createVNode(_component_VCardItem, { class: "pb-1" }, {
                      prepend: _withCtx(() => [
                        _createVNode(_component_VIcon, {
                          icon: f.icon,
                          color: "primary"
                        }, null, 8, ["icon"])
                      ]),
                      default: _withCtx(() => [
                        _createVNode(_component_VCardTitle, { class: "text-body-1 font-weight-medium" }, {
                          default: _withCtx(() => [
                            _createTextVNode(_toDisplayString(f.title), 1)
                          ]),
                          _: 2
                        }, 1024)
                      ]),
                      _: 2
                    }, 1024),
                    _createVNode(_component_VCardText, { class: "text-body-2 text-medium-emphasis" }, {
                      default: _withCtx(() => [
                        _createTextVNode(_toDisplayString(f.desc), 1)
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
      }),
      _createVNode(_component_VAlert, {
        type: "info",
        variant: "tonal",
        density: "compact"
      }, {
        default: _withCtx(() => [...(_cache[1] || (_cache[1] = [
          _createTextVNode(" 完整体验请在左侧菜单「整理」分组打开", -1),
          _createElementVNode("b", null, "影音新手村", -1),
          _createTextVNode("主页面；仪表盘可添加「每日一词」卡片。 ", -1)
        ]))]),
        _: 1
      })
    ]),
    _: 1
  }))
}
}

};

export { _sfc_main as default };
