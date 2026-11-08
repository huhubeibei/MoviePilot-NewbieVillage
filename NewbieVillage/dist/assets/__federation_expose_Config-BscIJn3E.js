import { importShared } from './__federation_fn_import-JrT3xvdd.js';
import { r as resolveApi, u as unwrapResponse } from './utils-CZzYmT1-.js';

const {resolveComponent:_resolveComponent,createVNode:_createVNode,createTextVNode:_createTextVNode,createElementVNode:_createElementVNode,withCtx:_withCtx,toDisplayString:_toDisplayString,openBlock:_openBlock,createBlock:_createBlock,createCommentVNode:_createCommentVNode} = await importShared('vue');


const _hoisted_1 = { class: "text-h6 font-weight-bold mb-4" };
const _hoisted_2 = { class: "d-flex align-center" };

const {computed,onMounted,reactive,ref} = await importShared('vue');

const pluginId = 'NewbieVillage';

const _sfc_main = {
  __name: 'Config',
  props: {
  initialConfig: { type: Object, default: () => ({}) },
  api: { type: Object, default: () => ({}) },
},
  emits: ['layout', 'close'],
  setup(__props, { emit: __emit }) {

const props = __props;

const emit = __emit;

const pluginBase = computed(() => `plugin/${pluginId}`);
const apiClient = computed(() => resolveApi(props.api));

const form = reactive({
  enabled: false,
  show_sidebar: true,
  remote_dict_url: '',
  auto_refresh_days: 7,
  llm_fallback: false,
});

const saving = ref(false);
const message = ref('');
const messageType = ref('success');

onMounted(() => {
  Object.assign(form, props.initialConfig || {});
  emit('layout', { maxWidth: '52rem' });
});

async function save() {
  saving.value = true;
  message.value = '';
  try {
    const client = apiClient.value;
    if (!client) throw new Error('宿主 API 客户端不可用，请刷新页面重试')
    const config = unwrapResponse(
      await client.post(`${pluginBase.value}/config`, { ...form })
    );
    Object.assign(form, config || {});
    messageType.value = 'success';
    message.value = '配置已保存并生效';
  } catch (err) {
    messageType.value = 'error';
    message.value = err.message || String(err);
  } finally {
    saving.value = false;
  }
}

return (_ctx, _cache) => {
  const _component_VIcon = _resolveComponent("VIcon");
  const _component_VSwitch = _resolveComponent("VSwitch");
  const _component_VTextField = _resolveComponent("VTextField");
  const _component_VBtn = _resolveComponent("VBtn");
  const _component_VAlert = _resolveComponent("VAlert");
  const _component_VCard = _resolveComponent("VCard");

  return (_openBlock(), _createBlock(_component_VCard, {
    variant: "flat",
    class: "pa-4"
  }, {
    default: _withCtx(() => [
      _createElementVNode("div", _hoisted_1, [
        _createVNode(_component_VIcon, {
          icon: "mdi-school",
          color: "primary",
          class: "mr-2"
        }),
        _cache[6] || (_cache[6] = _createTextVNode(" 影音新手村 · 配置 ", -1))
      ]),
      _createVNode(_component_VSwitch, {
        modelValue: form.enabled,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => ((form.enabled) = $event)),
        color: "primary",
        label: "启用插件",
        hint: "关闭后侧栏入口与仪表盘卡片一并隐藏（词典数据仍保留）",
        "persistent-hint": "",
        class: "mb-2"
      }, null, 8, ["modelValue"]),
      _createVNode(_component_VSwitch, {
        modelValue: form.show_sidebar,
        "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => ((form.show_sidebar) = $event)),
        color: "primary",
        label: "在左侧菜单显示「影音新手村」入口",
        "hide-details": "",
        class: "mb-4"
      }, null, 8, ["modelValue"]),
      _createVNode(_component_VTextField, {
        modelValue: form.remote_dict_url,
        "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => ((form.remote_dict_url) = $event)),
        label: "远端词典 URL（可选）",
        placeholder: "https://raw.githubusercontent.com/…/dict.json",
        hint: "指向远端 dict.json；不填则使用内置词典。刷新入口在插件页面「词典」标签右上角",
        "persistent-hint": "",
        variant: "outlined",
        density: "comfortable",
        class: "mb-4"
      }, null, 8, ["modelValue"]),
      _createVNode(_component_VTextField, {
        modelValue: form.auto_refresh_days,
        "onUpdate:modelValue": _cache[3] || (_cache[3] = $event => ((form.auto_refresh_days) = $event)),
        label: "远端词典自动检查周期（天）",
        type: "number",
        min: "0",
        max: "365",
        hint: "每 N 天自动检查一次远端词典更新，0 = 关闭自动检查",
        "persistent-hint": "",
        variant: "outlined",
        density: "comfortable",
        class: "mb-4",
        "max-width": "18rem"
      }, null, 8, ["modelValue"]),
      _createVNode(_component_VSwitch, {
        modelValue: form.llm_fallback,
        "onUpdate:modelValue": _cache[4] || (_cache[4] = $event => ((form.llm_fallback) = $event)),
        color: "primary",
        label: "解析失败时使用 LLM 兜底（M2 上线，需在系统设置中配置 AI）",
        hint: "当前版本解析器尚未上线，此开关暂不生效",
        "persistent-hint": "",
        class: "mb-4"
      }, null, 8, ["modelValue"]),
      _createElementVNode("div", _hoisted_2, [
        _createVNode(_component_VBtn, {
          color: "primary",
          loading: saving.value,
          onClick: save
        }, {
          default: _withCtx(() => [...(_cache[7] || (_cache[7] = [
            _createTextVNode("保存配置", -1)
          ]))]),
          _: 1
        }, 8, ["loading"]),
        _createVNode(_component_VBtn, {
          variant: "text",
          class: "ml-2",
          disabled: saving.value,
          onClick: _cache[5] || (_cache[5] = $event => (_ctx.$emit('close')))
        }, {
          default: _withCtx(() => [...(_cache[8] || (_cache[8] = [
            _createTextVNode("关闭", -1)
          ]))]),
          _: 1
        }, 8, ["disabled"]),
        (message.value)
          ? (_openBlock(), _createBlock(_component_VAlert, {
              key: 0,
              type: messageType.value,
              variant: "tonal",
              density: "compact",
              class: "ml-4 flex-grow-1"
            }, {
              default: _withCtx(() => [
                _createTextVNode(_toDisplayString(message.value), 1)
              ]),
              _: 1
            }, 8, ["type"]))
          : _createCommentVNode("", true)
      ])
    ]),
    _: 1
  }))
}
}

};

export { _sfc_main as default };
