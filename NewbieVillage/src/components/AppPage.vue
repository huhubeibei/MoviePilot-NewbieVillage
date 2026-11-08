<script setup>
import { ref } from 'vue'
import DictView from './DictView.vue'
import ParseView from './ParseView.vue'
import CaseView from './CaseView.vue'
import HealthView from './HealthView.vue'

defineProps({
  api: { type: Object, default: () => ({}) },
  navKey: { type: String, default: 'main' },
  pluginId: { type: String, default: 'NewbieVillage' },
})

defineEmits(['action'])

const tab = ref('dict')
const tabs = [
  { key: 'dict', title: '词典', icon: 'mdi-book-open-variant' },
  { key: 'parse', title: '解析', icon: 'mdi-magnify-scan' },
  { key: 'case', title: '案例', icon: 'mdi-map-legend' },
  { key: 'health', title: '体检', icon: 'mdi-stethoscope' },
]
</script>

<template>
  <VContainer fluid class="px-0 px-sm-4 py-2">
    <VTabs v-model="tab" color="primary" density="comfortable" class="mb-4">
      <VTab v-for="t in tabs" :key="t.key" :value="t.key">
        <VIcon start :icon="t.icon" />
        {{ t.title }}
      </VTab>
    </VTabs>
    <VWindow v-model="tab">
      <VWindowItem value="dict">
        <DictView :api="api" :plugin-id="pluginId" />
      </VWindowItem>
      <VWindowItem value="parse">
        <ParseView />
      </VWindowItem>
      <VWindowItem value="case">
        <CaseView :api="api" :plugin-id="pluginId" />
      </VWindowItem>
      <VWindowItem value="health">
        <HealthView />
      </VWindowItem>
    </VWindow>
  </VContainer>
</template>
