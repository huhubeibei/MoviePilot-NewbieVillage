<script setup>
import { computed, onMounted, ref } from 'vue'
import { domainTitle, resolveApi, unwrapResponse } from '../utils'

const props = defineProps({
  api: { type: Object, default: () => ({}) },
  pluginId: { type: String, default: 'NewbieVillage' },
})

const loading = ref(false)
const error = ref('')
const q = ref('')
const domain = ref('')
const data = ref({ terms: [], version: 0, source: '', count: 0 })
const selected = ref(null)

const domains = [
  { key: '', title: '全部' },
  { key: 'video', title: '影视命名' },
  { key: 'music', title: '音乐命名' },
  { key: 'pt', title: 'PT 行为' },
  { key: 'moviepilot', title: 'MP 概念' },
]

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
        v-model="q"
        prepend-inner-icon="mdi-magnify"
        placeholder="搜索术语、别名、释义关键词…"
        variant="outlined"
        density="comfortable"
        hide-details
        clearable
        class="mr-4"
        max-width="26rem"
      />
      <VChipGroup v-model="domain" mandatory column>
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
      <span class="text-caption text-medium-emphasis mr-2">
        {{ filtered.length }}/{{ data.count }} 条 · 词典 v{{ data.version }}（{{ data.source === 'remote' ? '远端' : '内置' }}）
      </span>
    </VRow>

    <VProgressLinear v-if="loading" indeterminate color="primary" class="mb-2" />

    <VEmptyState
      v-if="!loading && !filtered.length"
      icon="mdi-book-search-outline"
      headline="没有找到匹配的词条"
      text="换个关键词，或切换领域筛选再试试"
    />

    <VRow v-else>
      <VCol v-for="term in filtered" :key="term.term + term.domain" cols="12" sm="6" md="4">
        <VCard
          variant="outlined"
          hover
          class="h-100 d-flex flex-column"
          @click="openTerm(term)"
        >
          <VCardItem>
            <VCardTitle class="text-body-1 font-weight-bold">{{ term.term }}</VCardTitle>
            <VChip
              :text="domainTitle(term.domain)"
              size="x-small"
              color="primary"
              variant="tonal"
              class="mt-1 align-self-start"
            />
          </VCardItem>
          <VCardText class="text-body-2 text-medium-emphasis pb-3">
            {{ term.one_line }}
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

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
            <div
              v-for="s in selected.related_mp_settings"
              :key="s.label"
              class="mb-2 text-body-2"
            >
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
