<script setup>
import { computed, onMounted, ref } from 'vue'
import { domainTitle, renderCaseMarkdown, resolveApi, unwrapResponse } from '../utils'

const props = defineProps({
  api: { type: Object, default: () => ({}) },
  pluginId: { type: String, default: 'NewbieVillage' },
})

const loading = ref(false)
const error = ref('')
const cases = ref([])
const selected = ref(null)
const detailLoading = ref(false)

const pluginBase = computed(() => `plugin/${props.pluginId}`)
const apiClient = computed(() => resolveApi(props.api))

const storylines = computed(() => {
  const groups = {}
  for (const c of cases.value) {
    const key = c.storyline || '综合'
    ;(groups[key] = groups[key] || []).push(c)
  }
  return Object.entries(groups).map(([name, items]) => ({ name, items }))
})

async function load() {
  loading.value = true
  error.value = ''
  try {
    const client = apiClient.value
    if (!client) throw new Error('宿主 API 客户端不可用，请刷新页面重试')
    cases.value = unwrapResponse(await client.get(`${pluginBase.value}/cases`)) || []
  } catch (err) {
    error.value = err.message || String(err)
  } finally {
    loading.value = false
  }
}

async function openCase(c) {
  detailLoading.value = true
  selected.value = { ...c, content: '' }
  try {
    const client = apiClient.value
    if (!client) throw new Error('宿主 API 客户端不可用')
    const detail = unwrapResponse(await client.get(`${pluginBase.value}/cases/${c.id}`))
    selected.value = detail || c
  } catch (err) {
    selected.value = { ...c, content: `加载失败：${err.message || err}` }
  } finally {
    detailLoading.value = false
  }
}

function closeCase() {
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

    <VProgressLinear v-if="loading" indeterminate color="primary" class="mb-2" />

    <VEmptyState
      v-if="!loading && !cases.length"
      icon="mdi-map-legend"
      headline="暂无案例"
      text="实战案例整理中"
    />

    <div v-for="group in storylines" :key="group.name" class="mb-6">
      <div class="text-subtitle-1 font-weight-bold mb-2">
        <VIcon size="small" icon="mdi-chart-timeline-variant" class="mr-1" />
        {{ group.name }}
      </div>
      <VRow>
        <VCol v-for="c in group.items" :key="c.id" cols="12" sm="6" md="4">
          <VCard variant="outlined" hover class="h-100" @click="openCase(c)">
            <VCardItem>
              <VCardTitle class="text-body-1 font-weight-medium" style="white-space: normal">
                {{ c.title }}
              </VCardTitle>
              <template #append>
                <VChip size="x-small" color="primary" variant="tonal">
                  {{ domainTitle(c.domain) }}
                </VChip>
              </template>
            </VCardItem>
            <VCardText v-if="(c.settings || []).length" class="text-caption text-medium-emphasis">
              <VIcon size="x-small" icon="mdi-cog-outline" class="mr-1" />
              {{ c.settings.join(' · ') }}
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </div>

    <!-- 案例详情 -->
    <VDialog
      :model-value="!!selected"
      max-width="52rem"
      scrollable
      @update:model-value="closeCase"
    >
      <VCard v-if="selected">
        <VCardItem>
          <div class="d-flex align-center flex-wrap ga-2">
            <span class="text-h6 font-weight-bold">{{ selected.title }}</span>
            <VChip size="small" color="primary" variant="tonal">
              {{ domainTitle(selected.domain) }}
            </VChip>
          </div>
        </VCardItem>
        <VDivider />
        <VCardText style="max-height: 62vh">
          <VProgressLinear v-if="detailLoading" indeterminate color="primary" class="mb-2" />
          <!-- eslint-disable-next-line vue/no-v-html — 内容为本地案例文件，经过转义 -->
          <div v-else v-html="renderCaseMarkdown(selected.content)" />
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn variant="text" @click="closeCase">关闭</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>
