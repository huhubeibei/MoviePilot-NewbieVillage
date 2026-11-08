<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { resolveApi, unwrapResponse } from '../utils'

const props = defineProps({
  initialConfig: { type: Object, default: () => ({}) },
  api: { type: Object, default: () => ({}) },
})

const emit = defineEmits(['layout', 'close'])

const pluginId = 'NewbieVillage'
const pluginBase = computed(() => `plugin/${pluginId}`)
const apiClient = computed(() => resolveApi(props.api))

const form = reactive({
  enabled: false,
  show_sidebar: true,
  remote_dict_url: '',
  auto_refresh_days: 7,
  llm_fallback: false,
})

const saving = ref(false)
const message = ref('')
const messageType = ref('success')

onMounted(() => {
  Object.assign(form, props.initialConfig || {})
  emit('layout', { maxWidth: '52rem' })
})

async function save() {
  saving.value = true
  message.value = ''
  try {
    const client = apiClient.value
    if (!client) throw new Error('宿主 API 客户端不可用，请刷新页面重试')
    const config = unwrapResponse(
      await client.post(`${pluginBase.value}/config`, { ...form })
    )
    Object.assign(form, config || {})
    messageType.value = 'success'
    message.value = '配置已保存并生效'
  } catch (err) {
    messageType.value = 'error'
    message.value = err.message || String(err)
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <VCard variant="flat" class="pa-4">
    <div class="text-h6 font-weight-bold mb-4">
      <VIcon icon="mdi-school" color="primary" class="mr-2" />
      影音新手村 · 配置
    </div>

    <VSwitch
      v-model="form.enabled"
      color="primary"
      label="启用插件"
      hint="关闭后侧栏入口与仪表盘卡片一并隐藏（词典数据仍保留）"
      persistent-hint
      class="mb-2"
    />
    <VSwitch
      v-model="form.show_sidebar"
      color="primary"
      label="在左侧菜单显示「影音新手村」入口"
      hide-details
      class="mb-4"
    />

    <VTextField
      v-model="form.remote_dict_url"
      label="远端词典 URL（可选）"
      placeholder="https://raw.githubusercontent.com/…/dict.json"
      hint="指向远端 dict.json；不填则使用内置词典。刷新入口在插件页面「词典」标签右上角"
      persistent-hint
      variant="outlined"
      density="comfortable"
      class="mb-4"
    />

    <VTextField
      v-model="form.auto_refresh_days"
      label="远端词典自动检查周期（天）"
      type="number"
      min="0"
      max="365"
      hint="每 N 天自动检查一次远端词典更新，0 = 关闭自动检查"
      persistent-hint
      variant="outlined"
      density="comfortable"
      class="mb-4"
      max-width="18rem"
    />

    <VSwitch
      v-model="form.llm_fallback"
      color="primary"
      label="解析失败时使用 LLM 兜底（M2 上线，需在系统设置中配置 AI）"
      hint="当前版本解析器尚未上线，此开关暂不生效"
      persistent-hint
      class="mb-4"
    />

    <div class="d-flex align-center">
      <VBtn color="primary" :loading="saving" @click="save">保存配置</VBtn>
      <VBtn variant="text" class="ml-2" :disabled="saving" @click="$emit('close')">关闭</VBtn>
      <VAlert
        v-if="message"
        :type="messageType"
        variant="tonal"
        density="compact"
        class="ml-4 flex-grow-1"
      >
        {{ message }}
      </VAlert>
    </div>
  </VCard>
</template>
