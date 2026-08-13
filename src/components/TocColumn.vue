<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import type { TocItem } from '@/types'

const props = defineProps<{
  toc: TocItem[]
}>()

const activeId = ref('')

function scrollTo(id: string) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    activeId.value = id
  }
}

// 滚动时高亮当前标题
function onScroll() {
  if (props.toc.length === 0) return
  // 从下往上找，取第一个在视口内的标题
  for (let i = props.toc.length - 1; i >= 0; i--) {
    const el = document.getElementById(props.toc[i].id)
    if (el) {
      const rect = el.getBoundingClientRect()
      if (rect.top <= 100) {
        activeId.value = props.toc[i].id
        return
      }
    }
  }
  if (props.toc.length > 0) {
    activeId.value = props.toc[0].id
  }
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  // 初始设置
  setTimeout(onScroll, 100)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

// TOC 数据更新后重新触发滚动检测（异步加载完成时）
watch(() => props.toc.length, () => {
  nextTick(() => {
    setTimeout(onScroll, 50)
  })
})
</script>

<template>
  <aside class="toc-column" v-if="toc.length > 0">
    <div class="toc-title">本页目录</div>
    <ul class="toc">
      <li
        v-for="item in toc"
        :key="item.id"
        :class="`toc-h${item.level}`"
      >
        <a
          :href="`#${item.id}`"
          :class="{ active: activeId === item.id }"
          @click.prevent="scrollTo(item.id)"
        >{{ item.text }}</a>
      </li>
    </ul>
  </aside>
</template>