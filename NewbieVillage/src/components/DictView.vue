<script setup>
import { computed, onMounted, ref } from 'vue'
import { domainTitle, resolveApi, unwrapResponse } from '../utils'
import LadderView from './LadderView.vue'

const props = defineProps({
  api: { type: Object, default: () => ({}) },
  pluginId: { type: String, default: 'NewbieVillage' },
})

const loading = ref(false)
const error = ref('')
const q = ref('')
const domain = ref('')
const view = ref('terms')
const data = ref({ terms: [], version: 0, source: '', count: 0, ladders: {}, size_matrix: {} })
const selected = ref(null)

const domains = [
  { key: '', title: '全部' },
  { key: 'video', title: '影视命名' },
  { key: 'music', title: '音乐命名' },
  { key: 'pt', title: 'PT 行为' },
  { key: 'moviepilot', title: 'MP 概念' },
]

const GROUP_ORDER = ['分辨率', '来源', '视频编码', '音轨', 'HDR/制式', '版本', '字幕', '季集与识别', '封装与识别', '格式', '规格', '发行形态', '来源', '工具与概念']
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
}

const pluginBase = computed(() => `plugin/${props.pluginId}`)
const apiClient = computed(() => resolveApi(props.api))

const filtered = computed(() => {
  const kw = q.value.trim().toLowerCase()
  return data.value.terms.filter(t => {
    if (domain.value && t.domain !== domain.value) return false
    if (!kw) return true
    const hay = [t.term, ...(t.aliases || []), t.one_line, ...(t.tags || [])]
      .join(' ')
      .toLowerCase()
    return hay.includes(kw)
  })
})

// 分组分节：有 group 的词条按组聚合（组序按 GROUP_ORDER），无组的归入「其他」
const grouped = computed(() => {
  const groups = new Map()
  for (const term of filtered.value) {
    const key = term.group || ''
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(term)
  }
  const keys = [...groups.keys()].sort((a, b) => {
    if (!a) return 1
    if (!b) return -1
    return GROUP_ORDER.indexOf(a) - GROUP_ORDER.indexOf(b)
  })
  return keys.map(key => ({
    name: key || '其他',
    icon: GROUP_ICONS[key] || 'mdi-bookmark-outline',
    terms: groups.get(key),
  }))
})

const hasGrouping = computed(() => filtered.value.some(t => t.group))

const termByRef = computed(() => {
  const map = {}
  for (const t of data.value.terms) {
    map[t.term] = t
    for (const a of t.aliases || []) {
      if (!(a in map)) map[a] = t
    }
  }
  return map
})

async function load() {
  loading.value = true
  error.value = ''
  try {
    const client = apiClient.value
    if (!client) throw new Error('宿主 API 客户端不可用，请刷新页面重试')
    data.value = unwrapResponse(await client.get(`${pluginBase.value}/dict`)) || { terms: [] }
  } catch (err) {
    error.value = err.message || String(err)
  } finally {
    loading.value = false
  }
}

function openTerm(term) {
  selected.value = term
}

function openByRef(refName) {
  if (refName && termByRef.value[refName]) {
    selected.value = termByRef.value[refName]
  }
}

function closeTerm() {
  selected.value = null
}

onMounted(load)
</script>

<template>
  <div>
    <VAlert v-if="error" type="error" variant="tonal" class="mb-4" density="compact">
      {{ error }}
      <VBtn size="small" variant="text" color="white" class="ml-2" @click="load">重试</VBtn>
    </VAlert>

    <VRow class="mb-2" align="center" no-gutters>
      <VTextField
        v-if="view === 'terms'"
        v-model="q"
        prepend-inner-icon="mdi-magnify"
        placeholder="搜索术语、别名、释义关键词（英文术语直接输，如 flac）…"
        variant="outlined"
        density="comfortable"
        hide-details
        clearable
        class="mr-4"
        max-width="26rem"
      />
      <VChipGroup v-if="view === 'terms'" v-model="domain" mandatory column>
        <VChip
          v-for="d in domains"
          :key="d.key"
          :value="d.key"
          filter
          variant="outlined"
          color="primary"
          class="mr-2"
        >
          {{ d.title }}
        </VChip>
      </VChipGroup>
      <VSpacer />
      <VBtnToggle v-model="view" mandatory density="comfortable" variant="outlined" color="primary">
        <VBtn value="terms" size="small">
          <VIcon start size="small" icon="mdi-book-open-variant" />
          词条
        </VBtn>
        <VBtn value="ladder" size="small">
          <VIcon start size="small" icon="mdi-stairs" />
          天梯
        </VBtn>
      </VBtnToggle>
    </VRow>

    <VProgressLinear v-if="loading" indeterminate color="primary" class="mb-2" />

    <!-- 天梯子视图 -->
    <LadderView
      v-if="view === 'ladder' && !loading"
      :ladders="data.ladders"
      :size-matrix="data.size_matrix"
      @open-term="openByRef"
    />

    <template v-else-if="view === 'terms' && !loading">
      <VEmptyState
        v-if="!filtered.length"
        icon="mdi-book-search-outline"
        headline="没有找到匹配的词条"
        text="换个关键词，或切换领域筛选再试试"
      />

      <div v-for="group in grouped" :key="group.name" class="mb-4">
        <div
          v-if="group.name !== '其他' && hasGrouping"
          class="text-subtitle-2 font-weight-bold mb-2 d-flex align-center"
        >
          <VIcon size="small" :icon="group.icon" color="primary" class="mr-1" />
          {{ group.name }}
          <VDivider class="ml-3" style="flex: 1" />
        </div>
        <VRow>
          <VCol v-for="term in group.terms" :key="term.term + term.domain" cols="12" sm="6" md="4">
            <VCard variant="outlined" hover class="h-100 d-flex flex-column" @click="openTerm(term)">
              <VCardItem>
                <VCardTitle class="text-body-1 font-weight-bold">{{ term.term }}</VCardTitle>
                <div class="mt-1 d-flex ga-1 flex-wrap">
                  <VChip :text="domainTitle(term.domain)" size="x-small" color="primary" variant="tonal" />
                  <VChip v-if="term.group" :text="term.group" size="x-small" variant="outlined" />
                </div>
              </VCardItem>
              <VCardText class="text-body-2 text-medium-emphasis pb-3">
                {{ term.one_line }}
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
      </div>
    </template>

    <!-- 词条详情 -->
    <VDialog
      :model-value="!!selected"
      max-width="46rem"
      scrollable
      @update:model-value="closeTerm"
    >
      <VCard v-if="selected">
        <VCardItem>
          <div class="d-flex align-center flex-wrap ga-2">
            <span class="text-h6 font-weight-bold">{{ selected.term }}</span>
            <VChip size="small" color="primary" variant="tonal">
              {{ domainTitle(selected.domain) }}
            </VChip>
            <VChip v-if="selected.group" size="small" variant="outlined">
              {{ selected.group }}
            </VChip>
            <VChip
              v-for="tag in selected.tags || []"
              :key="tag"
              size="small"
              variant="outlined"
            >
              {{ tag }}
            </VChip>
          </div>
          <div v-if="(selected.aliases || []).length" class="text-caption text-medium-emphasis mt-1">
            别名：{{ selected.aliases.join(' / ') }}
          </div>
        </VCardItem>
        <VDivider />
        <VCardText style="max-height: 60vh">
          <div class="text-body-1 mb-4" style="line-height: 1.8">{{ selected.one_line }}</div>
          <div class="text-body-2" style="line-height: 1.9; white-space: pre-wrap">{{ selected.detail }}</div>

          <template v-if="(selected.examples || []).length">
            <div class="text-subtitle-2 font-weight-bold mt-4 mb-2">命名示例</div>
            <VCode
              v-for="ex in selected.examples"
              :key="ex"
              class="d-block pa-2 mb-2 text-caption"
              style="white-space: pre-wrap; word-break: break-all"
            >
              {{ ex }}
            </VCode>
          </template>

          <template v-if="(selected.related_mp_settings || []).length">
            <div class="text-subtitle-2 font-weight-bold mt-4 mb-2">在 MoviePilot 中的相关设置</div>
            <div v-for="s in selected.related_mp_settings" :key="s.label" class="mb-2 text-body-2">
              <VIcon size="small" icon="mdi-cog-outline" class="mr-1" />
              <span class="font-weight-medium">{{ s.label }}</span>
              <span v-if="s.hint" class="text-medium-emphasis"> — {{ s.hint }}</span>
            </div>
          </template>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn variant="text" @click="closeTerm">关闭</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>
