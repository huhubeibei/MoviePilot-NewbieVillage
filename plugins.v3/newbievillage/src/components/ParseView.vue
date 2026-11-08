<script setup>
import { computed, onMounted, ref } from 'vue'
import { domainTitle, resolveApi, unwrapResponse } from '../utils'

const props = defineProps({
  api: { type: Object, default: () => ({}) },
  pluginId: { type: String, default: 'NewbieVillage' },
})

const pluginBase = computed(() => `plugin/${props.pluginId}`)
const apiClient = computed(() => resolveApi(props.api))

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
}

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
}

const input = ref('')
const kind = ref('auto')
const kindOptions = [
  { title: '自动识别', value: 'auto' },
  { title: '影视', value: 'video' },
  { title: '音乐', value: 'music' },
]
const loading = ref(false)
const error = ref('')
const parsed = ref(null)
const preview = ref(null)
const dictTerms = ref([])
const dictLadders = ref({})
const dictSizeMatrix = ref({})
const llmStatus = ref({ available: false, provider: '', model: '' })
const llmLoading = ref(false)
const aiResult = ref(null)
const aiNotice = ref('')

const selectedTerm = ref(null)

// ref → 词条（精确匹配 term，其次匹配别名）
const termByRef = computed(() => {
  const map = {}
  for (const t of dictTerms.value) {
    map[t.term] = t
    for (const a of t.aliases || []) {
      if (!(a in map)) map[a] = t
    }
  }
  return map
})

const DIM_ORDER = ['episode', 'resolution', 'source', 'vcodec', 'audio', 'edition', 'format', 'quality', 'release_type', 'year', 'group']
const dimEntries = computed(() => {
  if (!parsed.value) return []
  const dims = parsed.value.dims || {}
  return DIM_ORDER.filter(d => dims[d]).map(d => ({ dim: d, title: DIM_TITLES[d] || d, color: DIM_COLORS[d] || 'grey', items: dims[d] }))
})

function openRef(refName) {
  if (refName && termByRef.value[refName]) {
    selectedTerm.value = termByRef.value[refName]
  }
}

function segmentColor(seg) {
  return DIM_COLORS[seg.dim] || 'grey'
}

async function loadDict() {
  try {
    const client = apiClient.value
    if (!client) return
    const data = unwrapResponse(await client.get(`${pluginBase.value}/dict`))
    dictTerms.value = data?.terms || []
    dictLadders.value = data?.ladders || {}
    dictSizeMatrix.value = data?.size_matrix || {}
  } catch {
    dictTerms.value = []
  }
}

async function loadLlmStatus() {
  try {
    const client = apiClient.value
    if (!client) return
    llmStatus.value = unwrapResponse(await client.get(`${pluginBase.value}/llm/status`)) || { available: false }
  } catch {
    llmStatus.value = { available: false }
  }
}

async function runLlm() {
  if (!input.value.trim() || llmLoading.value) return
  llmLoading.value = true
  error.value = ''
  aiResult.value = null
  aiNotice.value = ''
  try {
    const client = apiClient.value
    if (!client) throw new Error('宿主 API 客户端不可用，请刷新页面重试')
    const resp = await client.post(`${pluginBase.value}/parse/llm`, { text: input.value, kind: kind.value })
    // 手动解包：兜底失败时 success=true 但 llm 为空 + message 说明（保留纯正则结果）
    if (resp && Object.prototype.hasOwnProperty.call(resp, 'success')) {
      if (resp.success === false) throw new Error(resp.message || 'AI 兜底失败')
      parsed.value = resp.data?.parse || null
      aiResult.value = resp.data?.llm || null
      aiNotice.value = resp.message || ''
    } else {
      parsed.value = resp?.data?.parse || null
      aiResult.value = resp?.data?.llm || null
    }
  } catch (err) {
    error.value = err.message || String(err)
  } finally {
    llmLoading.value = false
  }
}

async function runParse() {
  if (!input.value.trim() || loading.value) return
  loading.value = true
  error.value = ''
  parsed.value = null
  preview.value = null
  try {
    const client = apiClient.value
    if (!client) throw new Error('宿主 API 客户端不可用，请刷新页面重试')
    const data = unwrapResponse(
      await client.post(`${pluginBase.value}/parse/preview`, { text: input.value, kind: kind.value })
    )
    parsed.value = data?.parse || null
    preview.value = data?.preview || null
  } catch (err) {
    error.value = err.message || String(err)
  } finally {
    loading.value = false
  }
}

const examples = [
  'The.Bear.S02E05.2160p.WEB-DL.DDP5.1.Atmos.HDR.H.265-NOSIVAD',
  'Jay Chou - 最伟大的作品 (2022) [FLAC 24bit-44.1kHz] 分轨',
]

function tryExample(text) {
  input.value = text
  runParse()
}

// 画质档次徽章：按最高分辨率 × 来源映射（与天梯口径一致）
const tier = computed(() => {
  if (!parsed.value || parsed.value.kind !== 'video') return null
  if ((parsed.value.warnings || []).length) {
    return { icon: 'mdi-alert-octagon', color: 'error', text: '应急枪版' }
  }
  const dims = parsed.value.dims || {}
  const res = dims.resolution?.[0]?.value || ''
  const src = (dims.source || []).map(s => s.value).join('|')
  const is2160 = /2160|4K|UHD/i.test(res)
  const is1080 = /1080/.test(res)
  const highSrc = /REMUX|BDMV/i.test(src)
  const midSrc = /WEB-DL|BluRay|Blu-Ray/i.test(src)
  if (is2160 && highSrc) return { icon: 'mdi-crown-outline', color: 'amber-darken-2', text: '顶配收藏级' }
  if ((is2160 && midSrc) || (is1080 && (midSrc || highSrc))) {
    return { icon: 'mdi-star-outline', color: 'primary', text: '优选主流' }
  }
  if (res || src) return { icon: 'mdi-thumb-up-outline', color: 'success', text: '够用先行' }
  return null
})

// 体积估算：分辨率 × 来源 查矩阵
const sizeEstimate = computed(() => {
  if (!preview.value || preview.value.media_type === '音乐' || !parsed.value) return null
  const matrix = dictSizeMatrix.value
  if (!matrix?.rows || !matrix?.columns) return null
  const dims = parsed.value.dims || {}
  const res = dims.resolution?.[0]?.value || ''
  const rowKey = /2160|4K|UHD/i.test(res)
    ? '2160p'
    : /1080/.test(res)
      ? '1080p'
      : /720/.test(res)
        ? '720p'
        : /[45]76|480/.test(res)
          ? '480p'
          : null
  const srcVals = (dims.source || []).map(s => `${s.value} ${s.label}`).join(' ')
  let col = null
  if (/枪版|CAM|TeleSync/i.test(srcVals)) col = '枪版'
  else if (/REMUX/i.test(srcVals)) col = 'REMUX'
  else if (/BDMV|原盘/i.test(srcVals)) col = 'BDMV 原盘'
  else if (/HDTV/i.test(srcVals)) col = 'HDTV'
  else if (/BluRay|Blu-Ray|蓝光/i.test(srcVals)) col = 'BluRay 转码'
  else if (/WEB-DL|WEBRip|流媒体/i.test(srcVals)) col = 'WEB-DL'
  if (!rowKey || !col) return null
  const val = matrix.rows?.[rowKey]?.[matrix.columns.indexOf(col)]
  return val != null ? { gb: val, combo: `${rowKey} × ${col}` } : null
})

onMounted(() => {
  loadDict()
  loadLlmStatus()
})
</script>

<template>
  <div>
    <VCard variant="flat" class="pa-4 mb-4">
      <VRow align="center" no-gutters>
        <VSelect
          v-model="kind"
          :items="kindOptions"
          variant="outlined"
          density="comfortable"
          hide-details
          max-width="9rem"
          class="mr-4"
        />
        <VTextField
          v-model="input"
          placeholder="粘贴一个文件名，如 The.Bear.S02E05.2160p.WEB-DL.DDP5.1.Atmos.HDR.H.265-NOSIVAD"
          variant="outlined"
          density="comfortable"
          hide-details
          clearable
          @keyup.enter="runParse"
        />
        <VBtn color="primary" class="ml-4" :loading="loading" min-width="7rem" @click="runParse">
          <VIcon start icon="mdi-magnify-scan" />
          解析
        </VBtn>
        <VBtn
          v-if="llmStatus.available"
          color="deep-purple"
          variant="tonal"
          class="ml-2"
          :loading="llmLoading"
          min-width="9rem"
          @click="runLlm"
        >
          <VIcon start icon="mdi-robot-outline" />
          AI 兜底解析
        </VBtn>
      </VRow>
      <div class="text-caption text-medium-emphasis mt-2">
        试试：
        <a
          v-for="ex in examples"
          :key="ex"
          class="mr-3"
          href="javascript:void(0)"
          @click="tryExample(ex)"
        >{{ ex.slice(0, 42) }}…</a>
      </div>
    </VCard>

    <VAlert v-if="error" type="error" variant="tonal" class="mb-4" density="compact">{{ error }}</VAlert>

    <template v-if="parsed">
      <!-- 解析结果 -->
      <VCard variant="outlined" class="mb-4">
        <VCardItem class="pb-2">
          <div class="d-flex align-center flex-wrap ga-2">
            <VCardTitle class="text-subtitle-1 font-weight-bold pa-0">解析结果</VCardTitle>
            <VChip size="small" :color="parsed.kind === 'music' ? 'green' : 'indigo'" variant="tonal">
              {{ parsed.kind === 'music' ? '音乐命名' : '影视命名' }}
            </VChip>
            <VChip v-if="tier" size="small" :color="tier.color" variant="flat">
              <VIcon start size="x-small" :icon="tier.icon" />
              {{ tier.text }}
            </VChip>
            <VChip v-if="parsed.title_hint" size="small" variant="outlined">
              标题：{{ parsed.title_hint }}
            </VChip>
          </div>
        </VCardItem>
        <VCardText>
          <VAlert
            v-for="(w, i) in parsed.warnings || []"
            :key="i"
            type="error"
            variant="tonal"
            density="compact"
            class="mb-2"
          >
            <b>检测到{{ w.label }}（{{ w.value }}）：</b>
            这是影院偷录/翻录版本，画质和音质都很差，除非全网没有更好的选择，否则不建议下载收藏。
            在「词典 → 天梯」里看看正常来源的画质阶梯。
          </VAlert>
          <!-- 分段高亮 -->
          <div class="parse-segments mb-4" style="line-height: 2.4">
            <template v-for="(seg, i) in parsed.segments" :key="i">
              <VChip
                v-if="seg.dim && seg.raw.trim()"
                :color="segmentColor(seg)"
                size="small"
                :variant="seg.ref && termByRef[seg.ref] ? 'tonal' : 'outlined'"
                class="mr-1 mb-1"
                :class="{ 'cursor-pointer': seg.ref && termByRef[seg.ref] }"
                :title="seg.ref && termByRef[seg.ref] ? '点击查看词条' : ''"
                @click="openRef(seg.ref)"
              >
                {{ seg.raw }}
              </VChip>
              <span v-else-if="seg.raw.trim()" class="text-body-2 mr-1 text-high-emphasis">{{ seg.raw }}</span>
            </template>
          </div>

          <!-- 维度摘要 -->
          <VRow dense>
            <VCol v-for="d in dimEntries" :key="d.dim" cols="12" sm="6" md="4">
              <VCard variant="tonal" :color="d.color" class="h-100">
                <VCardItem class="py-2">
                  <VCardTitle class="text-caption font-weight-bold pa-0">
                    <VIcon size="x-small" icon="mdi-tag-outline" class="mr-1" />
                    {{ d.title }}
                  </VCardTitle>
                </VCardItem>
                <VCardText class="py-1">
                  <div v-for="item in d.items" :key="item.label + item.value" class="text-body-2">
                    <span
                      :class="{ 'cursor-pointer text-decoration-underline': item.ref && termByRef[item.ref] }"
                      @click="openRef(item.ref)"
                    >
                      {{ item.label }}<template v-if="item.value && item.value !== item.label">（{{ item.value }}）</template>
                    </span>
                  </div>
                </VCardText>
              </VCard>
            </VCol>
          </VRow>

          <!-- 未识别 -->
          <template v-if="(parsed.unrecognized || []).length">
            <div class="text-caption text-medium-emphasis mt-3 mb-1">
              <VIcon size="x-small" icon="mdi-help-circle-outline" class="mr-1" />
              未识别片段{{ llmStatus.available ? '（可点上方「AI 兜底解析」补全）' : '' }}：
            </div>
            <VChip
              v-for="token in parsed.unrecognized"
              :key="token"
              size="small"
              variant="outlined"
              color="grey"
              class="mr-1 mb-1"
            >
              {{ token }}
            </VChip>
          </template>

          <!-- AI 兜底结果 -->
          <VCard v-if="aiResult" variant="tonal" color="deep-purple" class="mt-4">
            <VCardItem class="pb-1">
              <template #prepend>
                <VIcon icon="mdi-robot-outline" />
              </template>
              <VCardTitle class="text-subtitle-1 font-weight-bold pa-0">AI 推断（仅供参考）</VCardTitle>
              <template #append>
                <span class="text-caption text-medium-emphasis">
                  {{ aiResult.provider }} / {{ aiResult.model }} · {{ aiResult.duration_ms }}ms
                </span>
              </template>
            </VCardItem>
            <VCardText>
              <VChip
                v-for="(t, i) in aiResult.tags || []"
                :key="i"
                size="small"
                variant="outlined"
                class="mr-1 mb-1"
              >
                {{ t.label }}：{{ t.value }}
              </VChip>
              <div v-if="aiResult.explanation" class="text-body-2 mt-2" style="line-height: 1.7">
                {{ aiResult.explanation }}
              </div>
            </VCardText>
          </VCard>
          <VAlert v-else-if="aiNotice" type="info" variant="tonal" density="compact" class="mt-4">
            {{ aiNotice }}
          </VAlert>
        </VCardText>
      </VCard>

      <!-- 联动预告 -->
      <VCard v-if="preview" variant="flat" color="grey-lighten-4" class="mb-4">
        <VCardItem class="pb-1">
          <div class="d-flex align-center flex-wrap ga-2">
            <VIcon icon="mdi-target" color="primary" />
            <VCardTitle class="text-subtitle-1 font-weight-bold pa-0">联动预告</VCardTitle>
            <VChip size="small" variant="tonal" color="primary">{{ preview.media_type }}</VChip>
            <span class="text-caption text-medium-emphasis">{{ preview.media_type_source }}</span>
          </div>
        </VCardItem>
        <VCardText>
          <template v-if="preview.directory">
            <div class="text-body-2 mb-2">
              <VIcon size="x-small" icon="mdi-folder-move-outline" class="mr-1" />
              命中目录配置：<b>{{ preview.directory.name }}</b>
              <span class="text-medium-emphasis">
                （{{ preview.directory.transfer_type }} 模式 · 智能重命名 {{ preview.directory.renaming ? '开' : '关' }}）
              </span>
            </div>
            <VCode class="d-block pa-2 mb-3 text-caption" style="white-space: pre-wrap; word-break: break-all">
              {{ preview.path_guess }}
            </VCode>
            <VAlert
              v-if="sizeEstimate"
              type="info"
              variant="tonal"
              density="compact"
              class="mb-2"
            >
              预计体积：<b>约 {{ sizeEstimate.gb }} GB</b>（{{ sizeEstimate.combo }} · 估算值，随片长与码率浮动）
            </VAlert>
          </template>

          <VAlert
            v-for="(w, i) in preview.warnings || []"
            :key="i"
            type="warning"
            variant="tonal"
            density="compact"
            class="mb-2"
          >
            {{ w }}
          </VAlert>

          <div v-if="(preview.classification?.candidates || []).length" class="text-body-2 mb-1">
            <VIcon size="x-small" icon="mdi-folder-multiple-outline" class="mr-1" />
            {{ preview.media_type }}的候选二级分类（{{ preview.classification.mode }} 模式）：
            <VChip
              v-for="c in preview.classification.candidates"
              :key="c.name"
              size="x-small"
              variant="outlined"
              class="ml-1 mb-1"
            >
              {{ c.name }}
            </VChip>
          </div>
          <div v-if="preview.classification?.note" class="text-caption text-medium-emphasis mb-2">
            {{ preview.classification.note }}
          </div>

          <VDivider class="my-2" />
          <div class="text-caption text-disabled">
            <div v-for="(l, i) in preview.limitations || []" :key="i">· {{ l }}</div>
          </div>
        </VCardText>
      </VCard>
    </template>

    <VEmptyState
      v-else-if="!loading && !error"
      icon="mdi-magnify-scan"
      headline="粘贴文件名开始解析"
      text="支持影视命名（来源/分辨率/编码/音轨/季集/发布组）与音乐命名（格式/规格/发行类型）"
    />

    <!-- 词条详情 -->
    <VDialog
      :model-value="!!selectedTerm"
      max-width="42rem"
      scrollable
      @update:model-value="selectedTerm = null"
    >
      <VCard v-if="selectedTerm">
        <VCardItem>
          <div class="d-flex align-center flex-wrap ga-2">
            <span class="text-h6 font-weight-bold">{{ selectedTerm.term }}</span>
            <VChip size="small" color="primary" variant="tonal">
              {{ domainTitle(selectedTerm.domain) }}
            </VChip>
          </div>
          <div v-if="(selectedTerm.aliases || []).length" class="text-caption text-medium-emphasis mt-1">
            别名：{{ selectedTerm.aliases.join(' / ') }}
          </div>
        </VCardItem>
        <VDivider />
        <VCardText style="max-height: 55vh">
          <div class="text-body-1 mb-3" style="line-height: 1.8">{{ selectedTerm.one_line }}</div>
          <div class="text-body-2" style="line-height: 1.9; white-space: pre-wrap">{{ selectedTerm.detail }}</div>
          <template v-if="(selectedTerm.examples || []).length">
            <div class="text-subtitle-2 font-weight-bold mt-3 mb-2">命名示例</div>
            <VCode
              v-for="ex in selectedTerm.examples"
              :key="ex"
              class="d-block pa-2 mb-2 text-caption"
              style="white-space: pre-wrap; word-break: break-all"
            >
              {{ ex }}
            </VCode>
          </template>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn variant="text" @click="selectedTerm = null">关闭</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>
