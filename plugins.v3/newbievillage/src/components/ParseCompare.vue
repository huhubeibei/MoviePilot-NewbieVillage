<script setup>
import { computed, ref } from 'vue'
import { DIM_TITLES, resolveApi, unwrapResponse } from '../utils'

const props = defineProps({
  api: { type: Object, default: () => ({}) },
  pluginId: { type: String, default: 'NewbieVillage' },
})

const emit = defineEmits(['open-term'])

const pluginBase = computed(() => `plugin/${props.pluginId}`)
const apiClient = computed(() => resolveApi(props.api))

const inputA = ref('')
const inputB = ref('')
const loading = ref(false)
const error = ref('')
const parsedA = ref(null)
const parsedB = ref(null)

const compareDims = [
  { dim: 'resolution', title: '分辨率' },
  { dim: 'source', title: '来源' },
  { dim: 'vcodec', title: '视频编码' },
  { dim: 'audio', title: '音轨' },
  { dim: 'edition', title: 'HDR/制式' },
]

const RES_RANK = [
  [/^(480|576)/i, 0], [/^720/i, 1], [/^1080/i, 2], [/2160|4K|UHD/i, 3],
]
const SRC_RANK = [
  [/枪版|CAM|TeleSync|TeleCine/i, 0], [/TVRip/i, 1], [/HDTV/i, 2],
  [/WEBRip/i, 3], [/WEB-DL/i, 4], [/BluRay|Blu-Ray|蓝光/i, 5],
  [/REMUX/i, 6], [/BDMV|原盘/i, 7],
]
const AUDIO_RANK = [[/AAC/i, 1], [/DD\b|AC3/i, 2], [/DDP/i, 3], [/DTS/i, 3.5], [/TrueHD|LPCM|无损/i, 5]]
const RANKS = { resolution: RES_RANK, source: SRC_RANK, audio: AUDIO_RANK }

function firstValue(parsed, dim) {
  return parsed?.dims?.[dim]?.[0]?.value || ''
}

function rankOf(dim, value) {
  const ranks = RANKS[dim]
  if (!ranks || !value) return null
  for (const [pat, rank] of ranks) {
    if (pat.test(value)) return rank
  }
  return null
}

const compared = computed(() => {
  if (!parsedA.value || !parsedB.value) return []
  return compareDims.map(({ dim, title }) => {
    const a = firstValue(parsedA.value, dim)
    const b = firstValue(parsedB.value, dim)
    const ra = rankOf(dim, a)
    const rb = rankOf(dim, b)
    let winner = null
    if (ra !== null && rb !== null && ra !== rb) winner = ra > rb ? 'A' : 'B'
    return { dim, title, a, b, ra, rb, winner }
  })
})

const extraNotes = computed(() => {
  const notes = []
  for (const [label, parsed] of [['A', parsedA.value], ['B', parsedB.value]]) {
    for (const e of parsed?.dims?.edition || []) {
      notes.push(`${label} 带 ${e.value}`)
    }
  }
  return notes
})

const verdict = computed(() => {
  const rows = compared.value.filter(r => r.winner)
  const aWins = rows.filter(r => r.winner === 'A').length
  const bWins = rows.filter(r => r.winner === 'B').length
  if (!aWins && !bWins) return null
  if (aWins > bWins) return { text: `A 在 ${aWins} 个维度占优（${rows.filter(r => r.winner === 'A').map(r => r.title).join('、')}）`, side: 'A' }
  if (bWins > aWins) return { text: `B 在 ${bWins} 个维度占优（${rows.filter(r => r.winner === 'B').map(r => r.title).join('、')}）`, side: 'B' }
  return { text: '两边互有胜负，按你的设备与需求取舍', side: null }
})

function winnerStyle(winner, side) {
  return winner === side ? 'font-weight-bold text-primary' : 'text-medium-emphasis'
}

async function parseBoth() {
  const a = inputA.value.trim()
  const b = inputB.value.trim()
  if (!a || !b || loading.value) return
  loading.value = true
  error.value = ''
  parsedA.value = parsedB.value = null
  try {
    const client = apiClient.value
    if (!client) throw new Error('宿主 API 客户端不可用，请刷新页面重试')
    const data = unwrapResponse(
      await client.post(`${pluginBase.value}/parse/batch`, { texts: [a, b], kind: 'video' })
    )
    const results = data?.results || []
    parsedA.value = results[0]?.parse || null
    parsedB.value = results[1]?.parse || null
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
      <VRow no-gutters>
        <VCol cols="12" md="6" class="pr-md-2">
          <VTextField
            v-model="inputA"
            label="版本 A"
            variant="outlined"
            density="comfortable"
            hide-details
            clearable
            @keyup.enter="parseBoth"
          />
        </VCol>
        <VCol cols="12" md="6" class="pl-md-2">
          <VTextField
            v-model="inputB"
            label="版本 B"
            variant="outlined"
            density="comfortable"
            hide-details
            clearable
            @keyup.enter="parseBoth"
          />
        </VCol>
      </VRow>
      <div class="mt-3">
        <VBtn color="primary" :loading="loading" @click="parseBoth">
          <VIcon start icon="mdi-compare-horizontal" />
          对比
        </VBtn>
      </div>
    </VCard>

    <VAlert v-if="error" type="error" variant="tonal" class="mb-4" density="compact">{{ error }}</VAlert>

    <template v-if="parsedA && parsedB">
      <VCard variant="outlined" class="mb-4">
        <VTable>
          <thead>
            <tr>
              <th class="text-left">维度</th>
              <th class="text-left">版本 A</th>
              <th class="text-left">版本 B</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in compared" :key="row.dim">
              <td class="text-body-2 font-weight-medium">{{ row.title }}</td>
              <td :class="winnerStyle(row.winner, 'A')">{{ row.a || '—' }}</td>
              <td :class="winnerStyle(row.winner, 'B')">{{ row.b || '—' }}</td>
            </tr>
          </tbody>
        </VTable>
      </VCard>

      <VAlert v-if="verdict" type="info" variant="tonal" density="compact" class="mb-2">
        {{ verdict.text }}
        <span class="text-caption">（按天梯口径的机械判定，实际观感以设备为准）</span>
      </VAlert>
      <VAlert v-if="extraNotes.length" type="info" variant="tonal" density="compact" class="mb-2">
        {{ extraNotes.join(' · ') }}
      </VAlert>
      <div class="text-caption text-disabled">
        对比只覆盖可机械判定的维度；字幕、压制组口碑等请结合词条详情判断。
      </div>
    </template>
  </div>
</template>
