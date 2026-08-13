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

<style scoped>
.toc-column {
    position: sticky;
    top: var(--topbar-height);
    align-self: start;
    max-height: calc(100vh - var(--topbar-height));
    overflow-y: auto;
    padding: var(--space-6) 0 var(--space-6) var(--space-2);
    font-size: var(--text-sm);
    display: none;
    position: relative;
}
@media (min-width: 1024px) {
    .toc-column { display: block; }
}

/* 左侧装饰线 */
.toc-column::before {
    content: "";
    position: absolute;
    left: 0;
    top: var(--space-6);
    bottom: var(--space-6);
    width: 1px;
    background: var(--border-light);
}

.toc-title {
    font-size: 0.6875rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--text-muted);
    padding: 0 var(--space-2) var(--space-2);
    font-weight: 600;
    font-family: var(--font-sans);
    position: relative;
}

.toc {
    margin: 0;
    padding: 0;
    list-style: none;
}

.toc li { margin: 0; }

.toc a {
    display: block;
    padding: 4px var(--space-2);
    color: var(--text-muted);
    text-decoration: none;
    border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
    border-left: 2px solid transparent;
    font-size: var(--text-xs);
    line-height: 1.45;
    transition: color var(--duration-fast) var(--ease-out),
                border-color var(--duration-fast) var(--ease-out),
                background var(--duration-fast) var(--ease-out);
}
.toc a:hover {
    color: var(--text);
    background: var(--bg-soft);
}
.toc a.active {
    color: var(--accent);
    border-left-color: var(--accent);
    background: var(--accent-soft);
    font-weight: 500;
}

.toc-h3 a { padding-left: var(--space-5); }
.toc-h4 a { padding-left: var(--space-8); }
</style>