import { importShared } from './__federation_fn_import-JrT3xvdd.js';
import { r as resolveApi, d as domainTitle, u as unwrapResponse } from './utils-CprB0h7l.js';

const {resolveComponent:_resolveComponent,openBlock:_openBlock,createBlock:_createBlock,createCommentVNode:_createCommentVNode,toDisplayString:_toDisplayString,createElementVNode:_createElementVNode,unref:_unref,createTextVNode:_createTextVNode,withCtx:_withCtx,createVNode:_createVNode,createElementBlock:_createElementBlock,Fragment:_Fragment} = await importShared('vue');


const _hoisted_1 = { class: "pa-2" };
const _hoisted_2 = { class: "d-flex align-center flex-wrap ga-2 mb-1" };
const _hoisted_3 = { class: "text-h6 font-weight-bold" };
const _hoisted_4 = {
  class: "text-body-2 text-medium-emphasis",
  style: {"line-height":"1.7"}
};
const _hoisted_5 = {
  key: 0,
  class: "text-caption text-disabled mt-1"
};
const _hoisted_6 = {
  key: 2,
  class: "text-body-2 text-medium-emphasis"
};

const {computed,onMounted,ref} = await importShared('vue');

const pluginId = 'NewbieVillage';

const _sfc_main = {
  __name: 'Dashboard',
  props: {
  api: { type: Object, default: () => ({}) },
  config: { type: Object, default: () => ({}) },
  allowRefresh: { type: Boolean, default: true },
},
  setup(__props) {

const props = __props;

const pluginBase = computed(() => `plugin/${pluginId}`);
const apiClient = computed(() => resolveApi(props.api));

const loading = ref(false);
const term = ref(null);

async function loadTerm() {
  if (!props.allowRefresh && term.value) return
  loading.value = true;
  try {
    const client = apiClient.value;
    if (!client) return
    term.value = unwrapResponse(await client.get(`${pluginBase.value}/dict/daily`));
  } catch (err) {
    term.value = null;
  } finally {
    loading.value = false;
  }
}

onMounted(loadTerm);

return (_ctx, _cache) => {
  const _component_VProgressLinear = _resolveComponent("VProgressLinear");
  const _component_VChip = _resolveComponent("VChip");

  return (_openBlock(), _createElementBlock("div", _hoisted_1, [
    (loading.value && !term.value)
      ? (_openBlock(), _createBlock(_component_VProgressLinear, {
          key: 0,
          indeterminate: "",
          color: "primary",
          class: "mb-2"
        }))
      : _createCommentVNode("", true),
    (term.value)
      ? (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [
          _createElementVNode("div", _hoisted_2, [
            _createElementVNode("span", _hoisted_3, _toDisplayString(term.value.term), 1),
            _createVNode(_component_VChip, {
              size: "x-small",
              color: "primary",
              variant: "tonal"
            }, {
              default: _withCtx(() => [
                _createTextVNode(_toDisplayString(_unref(domainTitle)(term.value.domain)), 1)
              ]),
              _: 1
            })
          ]),
          _createElementVNode("div", _hoisted_4, _toDisplayString(term.value.one_line), 1),
          ((term.value.aliases || []).length)
            ? (_openBlock(), _createElementBlock("div", _hoisted_5, " 别名：" + _toDisplayString(term.value.aliases.slice(0, 3).join(' / ')), 1))
            : _createCommentVNode("", true)
        ], 64))
      : (!loading.value)
        ? (_openBlock(), _createElementBlock("div", _hoisted_6, " 暂无词条，启用插件后自动加载每日一词。 "))
        : _createCommentVNode("", true),
    _cache[0] || (_cache[0] = _createElementVNode("div", { class: "text-caption text-disabled mt-2" }, "每天一个术语，慢慢成为老手", -1))
  ]))
}
}

};

export { _sfc_main as default };
