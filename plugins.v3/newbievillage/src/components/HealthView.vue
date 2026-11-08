<script setup>
// v2.0 交付：配置体检引擎（解释型 + 检测型）。
// 当前展示规划中的检查项，让新手提前知道哪些配置值得自查。
const plannedChecks = [
  { icon: 'mdi-file-link-outline', title: '目录映射缺失', desc: '下载器报告的路径没有对应的目录映射，导致无法整理' },
  { icon: 'mdi-file-cog-outline', title: '分类无规则', desc: '媒体库目录配置了二级分类，但分类策略里没有对应规则' },
  { icon: 'mdi-download-outline', title: '下载分类未对应', desc: '下载器中的分类在 MP 目录配置中找不到匹配条目' },
  { icon: 'mdi-link-variant-off', title: '硬链接跨盘', desc: '下载目录与媒体库目录不在同一文件系统，硬链接会退化为复制' },
  { icon: 'mdi-history', title: '分类策略 revision 校验', desc: 'history/active 版本顺序异常（手改 JSON 常见错误）' },
  { icon: 'mdi-debug-step-over', title: 'fallbacks 指向检查', desc: '分类兜底分类在 categories 中不存在' },
  { icon: 'mdi-link-box-variant-outline', title: '规则串引用失效', desc: '过滤规则串引用了已删除的规则 ID' },
  { icon: 'mdi-text-box-search-outline', title: '识别词冲突', desc: '多条识别词对同一输入产生冲突或互相覆盖' },
  { icon: 'mdi-server-network-off', title: 'NFS stale', desc: '存储挂载句柄失效的痕迹检测' },
  { icon: 'mdi-shield-check-outline', title: '媒体服务器连接', desc: 'Emby/Jellyfin/Plex 对接可用性与媒体库路径可达性' },
]
</script>

<template>
  <VCard variant="flat" class="pa-6">
    <div class="d-flex align-center mb-4">
      <VIcon icon="mdi-stethoscope" color="primary" class="mr-3" size="28" />
      <div class="text-h6 font-weight-bold">配置体检</div>
      <VChip size="small" color="warning" variant="tonal" class="ml-3">v2.0 交付</VChip>
    </div>
    <VAlert type="warning" variant="tonal" density="compact" class="mb-4">
      体检引擎将在 v2.0 上线：自动检测下面这些常见配置问题，并给出解释和修复建议。
    </VAlert>
    <VRow>
      <VCol v-for="c in plannedChecks" :key="c.title" cols="12" sm="6">
        <VCard variant="tonal" class="h-100">
          <VCardItem class="pb-1">
            <template #prepend>
              <VIcon :icon="c.icon" color="primary" />
            </template>
            <VCardTitle class="text-body-1 font-weight-medium">{{ c.title }}</VCardTitle>
          </VCardItem>
          <VCardText class="text-body-2 text-medium-emphasis">{{ c.desc }}</VCardText>
        </VCard>
      </VCol>
    </VRow>
  </VCard>
</template>
