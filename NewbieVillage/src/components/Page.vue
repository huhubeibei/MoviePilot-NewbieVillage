<script setup>
// 插件详情页：概览 + 引导到侧栏主页面。
defineProps({
  api: { type: Object, default: () => ({}) },
})
defineEmits(['action', 'close'])

const features = [
  {
    icon: 'mdi-book-open-variant',
    title: '术语词典',
    desc: '影视命名 / 音乐命名 / PT 行为 / MP 概念四领域词条，支持搜索与远端刷新',
  },
  {
    icon: 'mdi-magnify-scan',
    title: '命名解析器',
    desc: '粘贴文件名逐段解析，M2 交付',
  },
  {
    icon: 'mdi-map-legend',
    title: '实战案例',
    desc: '音乐入库、H&R、硬链接跨盘等真实踩坑故事线',
  },
  {
    icon: 'mdi-stethoscope',
    title: '配置体检',
    desc: '十项配置自检与修复建议，v2.0 交付',
  },
]
</script>

<template>
  <VCard variant="flat" class="pa-6">
    <div class="d-flex align-center mb-4">
      <VIcon icon="mdi-school" color="primary" size="32" class="mr-3" />
      <div>
        <div class="text-h6 font-weight-bold">影音新手村</div>
        <div class="text-caption text-medium-emphasis">
          影视/音乐新手通关手册 · 词典 | 解析 | 案例 | 体检
        </div>
      </div>
    </div>

    <VRow dense class="mb-4">
      <VCol v-for="f in features" :key="f.title" cols="12" sm="6">
        <VCard variant="tonal" class="h-100">
          <VCardItem class="pb-1">
            <template #prepend>
              <VIcon :icon="f.icon" color="primary" />
            </template>
            <VCardTitle class="text-body-1 font-weight-medium">{{ f.title }}</VCardTitle>
          </VCardItem>
          <VCardText class="text-body-2 text-medium-emphasis">{{ f.desc }}</VCardText>
        </VCard>
      </VCol>
    </VRow>

    <VAlert type="info" variant="tonal" density="compact">
      完整体验请在左侧菜单「整理」分组打开<b>影音新手村</b>主页面；仪表盘可添加「每日一词」卡片。
    </VAlert>
  </VCard>
</template>
