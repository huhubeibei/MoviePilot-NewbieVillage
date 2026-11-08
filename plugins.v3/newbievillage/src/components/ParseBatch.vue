<script setup>
import { computed, ref } from 'vue'
import { DIM_TITLES, estimateSizeGb, resolveApi, tierOf, unwrapResponse } from '../utils'

const props = defineProps({
  api: { type: Object, default: () => ({}) },
  pluginId: { type: String, default: 'NewbieVillage' },
  sizeMatrix: { type: Object, default: () => ({}) },
})

const emit = defineEmits(['open-term'])

const pluginBase = computed(() => `plugin/${props.pluginId}`)
const apiClient = computed(() => resolveApi(props.api))

const bulkText = ref('')
const kind = ref('auto')
const loading = ref(false)
const error = ref('')
const rows = ref([])

const kindOptions = [
  { title: '自动识别', value: 'auto' },
  { title: '影视', value: 'video' },
  { title: '音乐', value: 'music' },
]

function tierOfRow(parse) {
  return tierOf(parse)
}

function sizeOf(parse) {
  return estimateSizeGb(props.sizeMatrix, parse)
}

function dimsSummary(parse) {
  const dims = parse?.dims || {}
  const parts = []
  for (const [dim, items] of Object.entries(dims)) {
    for (const item of items) {
      parts.push(DIM_TITLES[dim] ? `${DIM_TITLES[dim]}:${item.value}` : item.value)
    }
  }
  return parts.slice(0, 5).join(' · ')
}

function warnOf(parse) {
  return (parse?.warnings || []).length > 0
}

async function run() {
  const lines = bulkText.value.split(/\r?\n/).map(l => l.trim()).filter(Boolean)
  if (!lines.length || loading.value) return
  loading.value = true
  error.value = ''
  rows.value = []
  try {
    const client = apiClient.value
    if (!client) throw new Error('宿主 API 客户端不可用，请刷新页面重试')
    const data = unwrapResponse(
      await client.post(`${pluginBase.value}/parse/batch`, { texts: lines, kind: kind.value })
    )
    rows.value = (data?.results || []).map(r => ({
      text: r.text,
      parse: r.parse,
      tier: tierOf(r.parse),
      size: estimateSizeGb(props.sizeMatrix, r.parse),
    }))
  } catch (err) {
    error.value = err.message || String(err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <VCard variant="flat" class="pa-4 mb-4">
      <VRow align="start" no-gutters>
        <VSelect
          v-model="kind"
          :items="kindOptions"
          variant="outlined"
          density="comfortable"
          hide-details
          max-width="9rem"
          class="mr-4"
        />
        <VTextarea
          v-model="bulkText"
          rows="5"
          auto-grow
          placeholder="每行一个文件名，粘贴多行批量解析（上限 100 行）…"
          variant="outlined"
          density="comfortable"
          hide-details
        />
        <VBtn color="primary" class="ml-4" :loading="loading" @click="run">
          <VIcon start icon="mdi-format-list-numbered" />
          批量解析
        </VBtn>
      </VRow>
    </VCard>

    <VAlert v-if="error" type="error" variant="tonal" class="mb-4" density="compact">{{ error }}</VAlert>

    <VCard v-if="rows.length" variant="outlined">
      <VCardItem class="py-2">
        <VCardTitle class="text-subtitle-1 font-weight-bold pa-0">
          解析结果（{{ rows.length }} 条）
        </VCardTitle>
      </VCardItem>
      <VTable>
        <thead>
          <tr>
            <th class="text-left">文件名</th>
            <th class="text-left">档位</th>
            <th class="text-left">维度摘要</th>
            <th class="text-left">体积估算</th>
            <th class="text-left">警示</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.text">
            <td class="text-caption" style="max-width: 22rem; word-break: break-all">{{ row.text }}</td>
            <td>
              <VChip v-if="row.tier" size="small" :color="row.tier.color" variant="tonal">
                {{ row.tier.text }}
              </VChip>
              <span v-else class="text-disabled">—</span>
            </td>
            <td class="text-caption" style="max-width: 20rem">{{ dimsSummary(row.parse) || '—' }}</td>
            <td class="text-caption">
              {{ row.size ? `约 ${row.size.gb} GB` : '—' }}
            </td>
            <td>
              <VIcon v-if="warnOf(row.parse)" size="small" icon="mdi-alert-octagon" color="error" />
              <span v-else class="text-disabled">—</span>
            </td>
          </tr>
        </tbody>
      </VTable>
    </VCard>
  </div>
</template>
