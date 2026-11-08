<script setup>
import { computed, onMounted, ref } from 'vue'
import { resolveApi, unwrapResponse } from '../utils'

const props = defineProps({
  api: { type: Object, default: () => ({}) },
  pluginId: { type: String, default: 'NewbieVillage' },
})

const pluginBase = computed(() => `plugin/${props.pluginId}`)
const apiClient = computed(() => resolveApi(props.api))

const loading = ref(false)
const error = ref('')
const report = ref(null)
const expanded = ref(new Set())

const STATUS_META = {
  ok: { icon: 'mdi-check-circle', color: 'success', text: '通过' },
  info: { icon: 'mdi-information', color: 'info', text: '提示' },
  warn: { icon: 'mdi-alert', color: 'warning', text: '警告' },
  error: { icon: 'mdi-close-circle', color: 'error', text: '错误' },
}

const summary = computed(() => report.value?.summary || {})
const results = computed(() => report.value?.results || [])

const overall = computed(() => {
  const s = summary.value
  if ((s.error || 0) > 0) return { icon: 'mdi-close-circle', color: 'error', text: `发现 ${s.error} 项错误` }
  if ((s.warn || 0) > 0) return { icon: 'mdi-alert', color: 'warning', text: `发现 ${s.warn} 项警告` }
  return { icon: 'mdi-check-decagram', color: 'success', text: '全部检查通过' }
})

function toggleExpand(id) {
  const next = new Set(expanded.value)
  next.has(id) ? next.delete(id) : next.add(id)
  expanded.value = next
}

async function run() {
  if (loading.value) return
  loading.value = true
  error.value = ''
  try {
    const client = apiClient.value
    if (!client) throw new Error('宿主 API 客户端不可用，请刷新页面重试')
    report.value = unwrapResponse(await client.get(`${pluginBase.value}/health/checks`))
    expanded.value = new Set(
      (report.value?.results || [])
        .filter(r => r.status === 'error' || r.status === 'warn')
        .map(r => r.id)
    )
  } catch (err) {
    error.value = err.message || String(err)
  } finally {
    loading.value = false
  }
}

onMounted(run)
</script>

<template>
  <div>
    <VCard variant="flat" class="pa-4 mb-4">
      <div class="d-flex align-center flex-wrap ga-3">
        <VIcon icon="mdi-stethoscope" color="primary" size="26" />
        <div class="text-subtitle-1 font-weight-bold">配置体检</div>
        <VBtn
          color="primary"
          size="small"
          :loading="loading"
          prepend-icon="mdi-refresh"
          class="ml-auto"
          @click="run"
        >
          重新体检
        </VBtn>
      </div>
      <div class="text-caption text-medium-emphasis mt-1">
        只读检测你的真实配置：目录映射、分类策略、过滤规则、识别词正则、硬链接可行性、媒体服务器与存储健康。
        不修改任何配置。
      </div>
    </VCard>

    <VAlert v-if="error" type="error" variant="tonal" class="mb-4" density="compact">
      {{ error }}
      <VBtn size="small" variant="text" color="white" class="ml-2" @click="run">重试</VBtn>
    </VAlert>

    <template v-if="report">
      <!-- 总览 -->
      <VCard variant="tonal" :color="overall.color" class="mb-4">
        <VCardItem class="py-3">
          <template #prepend>
            <VIcon :icon="overall.icon" size="30" />
          </template>
          <VCardTitle class="text-h6 font-weight-bold pa-0">{{ overall.text }}</VCardTitle>
          <template #append>
            <VChipGroup>
              <VChip size="small" color="success" variant="tonal">通过 {{ summary.ok || 0 }}</VChip>
              <VChip size="small" color="info" variant="tonal">提示 {{ summary.info || 0 }}</VChip>
              <VChip size="small" color="warning" variant="tonal">警告 {{ summary.warn || 0 }}</VChip>
              <VChip size="small" color="error" variant="tonal">错误 {{ summary.error || 0 }}</VChip>
            </VChipGroup>
          </template>
        </VCardItem>
      </VCard>

      <!-- 检查明细 -->
      <VCard
        v-for="r in results"
        :key="r.id"
        variant="outlined"
        class="mb-2"
        :class="{ 'cursor-pointer': (r.details || []).length }"
        @click="(r.details || []).length && toggleExpand(r.id)"
      >
        <VCardItem class="py-2">
          <template #prepend>
            <VIcon :icon="STATUS_META[r.status]?.icon || 'mdi-help-circle'" :color="STATUS_META[r.status]?.color || 'grey'" />
          </template>
          <VCardTitle class="text-body-1 font-weight-medium pa-0">{{ r.title }}</VCardTitle>
          <template #append>
            <VChip size="x-small" :color="STATUS_META[r.status]?.color || 'grey'" variant="tonal">
              {{ STATUS_META[r.status]?.text || r.status }}
            </VChip>
            <VIcon
              v-if="(r.details || []).length"
              size="small"
              :icon="expanded.has(r.id) ? 'mdi-chevron-up' : 'mdi-chevron-down'"
              class="ml-2"
            />
          </template>
        </VCardItem>
        <VCardText class="py-1 text-body-2 text-medium-emphasis">{{ r.message }}</VCardText>
        <VCardText v-if="expanded.has(r.id) && (r.details || []).length" class="pt-0">
          <VAlert
            v-for="(d, i) in r.details"
            :key="i"
            :type="r.status === 'error' ? 'error' : r.status === 'warn' ? 'warning' : 'info'"
            variant="tonal"
            density="compact"
            class="mb-1 text-body-2"
          >
            {{ d }}
          </VAlert>
          <div v-if="r.advice" class="text-caption text-medium-emphasis mt-1">
            <VIcon size="x-small" icon="mdi-lightbulb-outline" class="mr-1" />
            {{ r.advice }}
          </div>
        </VCardText>
      </VCard>

      <div class="text-caption text-disabled mt-2">
        体检为只读模拟与探测：文件系统级判断基于容器内实际挂载（st_dev 对比），媒体服务器仅探测网络可达性，NFS 通过日志痕迹检测（避免 stat 挂死）。
      </div>
    </template>

    <VEmptyState
      v-else-if="!loading && !error"
      icon="mdi-stethoscope"
      headline="正在准备体检…"
      text="读取真实配置做只读检测"
    />
  </div>
</template>
