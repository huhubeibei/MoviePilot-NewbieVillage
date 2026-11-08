<script setup>
// 画质/规格天梯视图：双天梯 + 音乐规格梯 + 体积参考矩阵。
// 数据来自词典服务的 ladders/size_matrix（远端可更新）。
const props = defineProps({
  ladders: { type: Object, default: () => ({}) },
  sizeMatrix: { type: Object, default: () => ({}) },
})

const emit = defineEmits(['open-term'])

const ladderOrder = ['video_resolution', 'video_source', 'music_quality']
const ladderMeta = {
  video_resolution: { icon: 'mdi-wallpaper', color: 'green' },
  video_source: { icon: 'mdi-source-branch', color: 'blue' },
  music_quality: { icon: 'mdi-music-note', color: 'teal' },
}

function ladderList(key) {
  return props.ladders?.[key]?.items || []
}

function shade(index, total) {
  // 越往后（越高档）背景越实：返回 vuetify 色深后缀
  const steps = ['lighten-5', 'lighten-4', 'lighten-3', 'lighten-2', 'lighten-1', '']
  return steps[Math.min(steps.length - 1, Math.floor((index / Math.max(1, total - 1)) * (steps.length - 1)))]
}

const matrixRows = computed(() => {
  const m = props.sizeMatrix
  if (!m?.rows || !m?.columns) return []
  return Object.entries(m.rows).map(([res, values]) => ({
    res,
    cells: (m.columns || []).map((_, i) => values?.[i] ?? null),
  }))
})
</script>

<template>
  <div>
    <VAlert type="info" variant="tonal" density="compact" class="mb-4">
      天梯只讲「维度内」的高低——分辨率和来源是两回事：2160p 的 WEB-DL 未必比 1080p 的 REMUX 好。
      点击天梯项可查看对应词条。
    </VAlert>

    <VRow v-for="key in ladderOrder" :key="key">
      <VCol cols="12">
        <VCard variant="outlined">
          <VCardItem class="pb-1">
            <template #prepend>
              <VIcon :icon="ladderMeta[key]?.icon || 'mdi-stairs'" color="primary" />
            </template>
            <VCardTitle class="text-subtitle-1 font-weight-bold">
              {{ ladders[key]?.title || key }}
            </VCardTitle>
          </VCardItem>
          <VCardText class="text-caption text-medium-emphasis pb-2">
            {{ ladders[key]?.note }}
          </VCardText>
          <VCardText class="pt-0">
            <VRow v-for="(item, i) in ladderList(key)" :key="item.label" dense align="center">
              <VCol cols="12">
                <VCard
                  :color="ladderMeta[key]?.color"
                  :variant="i === ladderList(key).length - 1 ? 'tonal' : 'flat'"
                  :class="['py-1', 'px-3', 'd-flex', 'align-center', i === ladderList(key).length - 1 ? '' : 'bg-' + (ladderMeta[key]?.color || 'grey') + '-' + shade(i, ladderList(key).length)]"
                  :style="i === ladderList(key).length - 1 ? 'border: 1px solid currentColor' : ''"
                  flat
                >
                  <VIcon size="small" :icon="i === ladderList(key).length - 1 ? 'mdi-crown-outline' : 'mdi-stairs-up'" class="mr-2 flex-shrink-0" />
                  <span
                    class="font-weight-medium mr-2"
                    :class="{ 'cursor-pointer text-decoration-underline': item.ref }"
                    style="white-space: nowrap"
                    @click="item.ref && $emit('open-term', item.ref)"
                  >
                    {{ item.label }}
                  </span>
                  <span class="text-caption text-medium-emphasis" style="line-height: 1.4">{{ item.desc }}</span>
                </VCard>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- 体积参考矩阵 -->
    <VCard variant="outlined" v-if="sizeMatrix?.rows">
      <VCardItem class="pb-1">
        <template #prepend>
          <VIcon icon="mdi-database-outline" color="orange" />
        </template>
        <VCardTitle class="text-subtitle-1 font-weight-bold">单部电影典型体积参考（估算）</VCardTitle>
      </VCardItem>
      <VCardText class="text-caption text-medium-emphasis pb-2">
        {{ sizeMatrix?.note }}
      </VCardText>
      <VCardText class="pt-0 overflow-x-auto">
        <VTable density="compact">
          <thead>
            <tr>
              <th class="text-left">分辨率 \ 来源</th>
              <th v-for="col in sizeMatrix.columns" :key="col" class="text-left">{{ col }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in matrixRows" :key="row.res">
              <td class="font-weight-medium">{{ row.res }}</td>
              <td v-for="(cell, i) in row.cells" :key="i">
                <template v-if="cell !== null">{{ cell }} {{ sizeMatrix.unit }}</template>
                <span v-else class="text-disabled">—</span>
              </td>
            </tr>
          </tbody>
        </VTable>
      </VCardText>
    </VCard>
  </div>
</template>
