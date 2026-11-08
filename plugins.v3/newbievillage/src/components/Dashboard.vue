<script setup>
import { computed, onMounted, ref } from 'vue'
import { domainTitle, resolveApi, unwrapResponse } from '../utils'

const props = defineProps({
  api: { type: Object, default: () => ({}) },
  config: { type: Object, default: () => ({}) },
  allowRefresh: { type: Boolean, default: true },
})

const pluginId = 'NewbieVillage'
const pluginBase = computed(() => `plugin/${pluginId}`)
const apiClient = computed(() => resolveApi(props.api))

const loading = ref(false)
const term = ref(null)

async function loadTerm() {
  if (!props.allowRefresh && term.value) return
  loading.value = true
  try {
    const client = apiClient.value
    if (!client) return
    term.value = unwrapResponse(await client.get(`${pluginBase.value}/dict/daily`))
  } catch (err) {
    term.value = null
  } finally {
    loading.value = false
  }
}

onMounted(loadTerm)
</script>

<template>
  <div class="pa-2">
    <VProgressLinear v-if="loading && !term" indeterminate color="primary" class="mb-2" />

    <template v-if="term">
      <div class="d-flex align-center flex-wrap ga-2 mb-1">
        <span class="text-h6 font-weight-bold">{{ term.term }}</span>
        <VChip size="x-small" color="primary" variant="tonal">
          {{ domainTitle(term.domain) }}
        </VChip>
      </div>
      <div class="text-body-2 text-medium-emphasis" style="line-height: 1.7">
        {{ term.one_line }}
      </div>
      <div v-if="(term.aliases || []).length" class="text-caption text-disabled mt-1">
        别名：{{ term.aliases.slice(0, 3).join(' / ') }}
      </div>
    </template>

    <div v-else-if="!loading" class="text-body-2 text-medium-emphasis">
      暂无词条，启用插件后自动加载每日一词。
    </div>

    <div class="text-caption text-disabled mt-2">每天一个术语，慢慢成为老手</div>
  </div>
</template>
