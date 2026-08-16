<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { getDocById, flattenTree } from '@/utils/docs'
import MarkdownRender from '@/components/content/MarkdownRender.vue'
import type { TocItem } from '@/types'
import SideBar from '@/components/SideBar.vue'
import TocColumn from '@/components/TocColumn.vue'
import { useLayoutStore } from '@/stores'

const route = useRoute()
const layoutStore = useLayoutStore()

const doc = ref<any>(null)
const toc = ref<TocItem[]>([])
const loading = ref(true)
const error = ref('')

// 面包屑导航
const breadcrumb = computed(() => {
  if (!doc.value?.id) return []
  const parts = doc.value.id.split('/')
  parts.pop() // 去掉文件名，只留目录层级
  return parts
})

// 上一篇 / 下一篇
const flatDocs = computed(() => flattenTree())
const currentIndex = computed(() => {
  if (!doc.value) return -1
  return flatDocs.value.findIndex(d => d.path === `/doc/${doc.value.id}`)
})
const prev = computed(() => {
  const idx = currentIndex.value
  return idx > 0 ? flatDocs.value[idx - 1] : null
})
const next = computed(() => {
  const idx = currentIndex.value
  return idx >= 0 && idx < flatDocs.value.length - 1 ? flatDocs.value[idx + 1] : null
})

async function loadDoc() {
  const path = Array.isArray(route.params.pathMatch) ? route.params.pathMatch.join('/') : (route.params.pathMatch || '')
  loading.value = true
  error.value = ''
  doc.value = null

  try {
    const found = getDocById(path)
    if (found) {
      doc.value = found
    } else {
      error.value = '文档未找到'
    }
  } catch (e: any) {
    error.value = e.message || '加载失败'
  } finally {
    loading.value = false
  }
}

// MarkdownRender 渲染完成后，根据生成的标题 HTML 提取 TOC
function onReady(html: string) {
  toc.value = extractTocFromHtml(html)
}

/**
 * 从渲染后的 HTML 中提取标题 ID
 */
function extractTocFromHtml(html: string): TocItem[] {
  const toc: TocItem[] = []
  const headingRegex = /<h([1-4])\s+id="([^"]+)"[^>]*>(?:<a[^>]*>.*?<\/a>)?(.+?)<\/h[1-4]>/g
  let match
  while ((match = headingRegex.exec(html)) !== null) {
    const level = parseInt(match[1])
    const id = match[2]
    const text = match[3].replace(/<[^>]+>/g, '').trim()
    toc.push({ id, text, level })
  }
  return toc
}

// 滚动进度条
function updateProgress() {
  const scrollEl = document.documentElement
  const scrollTop = scrollEl.scrollTop || document.body.scrollTop
  const scrollHeight = scrollEl.scrollHeight - scrollEl.clientHeight
  const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0
  const el = document.getElementById('reading-progress')
  if (el) {
    el.style.width = progress + '%'
  }
}

onMounted(() => {
  loadDoc()
  window.addEventListener('scroll', updateProgress)
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateProgress)
})

watch(() => route.params.pathMatch, () => {
  loadDoc()
})
</script>

<template>
  <div
    class="layout"
    :class="{
      'sidebar-collapsed': layoutStore.sidebarCollapsed,
      'toc-collapsed': layoutStore.tocCollapsed
    }"
  >
    <SideBar />
    <div class="doc-wrap">
      <!-- 加载中 -->
      <div v-if="loading" class="doc" style="text-align: center; padding: 4rem 0; color: var(--text-muted);">
        加载中...
      </div>
      <!-- 错误 -->
      <div v-else-if="error" class="doc" style="text-align: center; padding: 4rem 0; color: var(--accent);">
        {{ error }}
      </div>
      <!-- 文档内容 -->
      <template v-else-if="doc">
        <div class="doc-content">
        <!-- 面包屑 -->
        <div class="doc-breadcrumb" v-if="breadcrumb.length > 0">
          <router-link to="/">主页</router-link>
          <template v-for="(crumb, i) in breadcrumb" :key="i">
            <span class="sep">/</span>
            <span v-if="i < breadcrumb.length - 1">{{ crumb }}</span>
            <span v-else class="current">{{ crumb }}</span>
          </template>
        </div>

        <!-- 正文（markdown 渲染，包含标题） -->
        <article class="doc">
          <MarkdownRender :content="doc.markdownContent" @ready="onReady" />
        </article>

        <!-- 底部 -->
        <div class="doc-footer">
          <!-- 上下页导航 -->
          <div class="doc-nav" v-if="prev || next">
            <router-link v-if="prev" :to="prev.path" class="doc-nav-prev">
              <span class="doc-nav-label">上一篇</span>
              <span class="doc-nav-title">{{ prev.label }}</span>
            </router-link>
            <div v-else class="doc-nav-spacer"></div>
            <router-link v-if="next" :to="next.path" class="doc-nav-next">
              <span class="doc-nav-label">下一篇</span>
              <span class="doc-nav-title">{{ next.label }}</span>
            </router-link>
            <div v-else class="doc-nav-spacer"></div>
          </div>

          <!-- 文件路径 -->
          <span class="doc-filepath" v-if="doc.path">{{ doc.path }}</span>
        </div>
        </div>
      </template>
    </div>
    <TocColumn :toc="toc" />
  </div>
</template>

<style scoped>
.layout {
    --sidebar-w: var(--sidebar-width);
    --toc-w: var(--toc-width);
    display: grid;
    grid-template-columns: var(--sidebar-w) 1fr;
    gap: var(--space-6);
    max-width: 1160px;
    margin: 0 auto;
    padding: 0 var(--space-6);
    transition: grid-template-columns var(--duration-normal) var(--ease-out);
}
.layout.sidebar-collapsed { --sidebar-w: 48px; }
.layout.toc-collapsed { --toc-w: 48px; }
@media (min-width: 1024px) {
    .layout {
        grid-template-columns: var(--sidebar-w) 1fr var(--toc-w);
        max-width: 1360px;
    }
}

.doc-wrap {
    min-width: 0;
    max-width: 100%;
}

/* 文档内容区约束 */
.doc-content {
    max-width: var(--content-width);
    margin: 0 auto;
    transition: max-width var(--duration-normal) var(--ease-out);
}
/* 侧边栏收起后内容区自适应扩展 */
.layout.sidebar-collapsed .doc-content,
.layout.toc-collapsed .doc-content {
    max-width: 100%;
}

/* 面包屑导航 */
.doc-breadcrumb {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.3em;
    font-size: var(--text-sm);
    color: var(--text-muted);
    padding-top: var(--space-4);
    margin-bottom: var(--space-2);
    padding-bottom: var(--space-4);
    border-bottom: 1px solid var(--border-light);
}
.doc-breadcrumb a {
    color: var(--text-muted);
    text-decoration: none;
    transition: color var(--duration-fast) var(--ease-out);
}
.doc-breadcrumb a:hover {
    color: var(--accent);
}
.doc-breadcrumb .sep {
    color: var(--border);
    user-select: none;
}
.doc-breadcrumb .current {
    color: var(--text);
    font-weight: 500;
}

/* 文档底部（文件路径 + 上下页导航） */
.doc-footer {
    margin-top: 3em;
}
.doc-filepath {
    display: block;
    font-size: var(--text-xs);
    color: var(--text-muted);
    font-family: var(--font-mono);
    padding: var(--space-2) 0;
    border-top: 1px solid var(--border-light);
    opacity: 0.6;
}

/* 上下页导航 */
.doc-nav {
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    gap: var(--space-4);
    margin-top: 0;
    padding-top: var(--space-5);
    border-top: 1px solid var(--border-light);
}
.doc-nav-prev,
.doc-nav-next {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.2em;
    text-decoration: none;
    padding: var(--space-3) var(--space-4);
    border-radius: var(--radius);
    border: 1px solid var(--border-light);
    transition: border-color var(--duration-fast) var(--ease-out),
                background var(--duration-fast) var(--ease-out),
                transform var(--duration-fast) var(--ease-out);
}
.doc-nav-prev:hover,
.doc-nav-next:hover {
    border-color: var(--accent);
    background: var(--accent-soft);
    transform: translateY(-1px);
}
.doc-nav-prev:active,
.doc-nav-next:active {
    transform: translateY(0);
}
.doc-nav-next {
    text-align: right;
    align-items: flex-end;
}
.doc-nav-label {
    font-size: 0.6875rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--text-muted);
    font-weight: 600;
}
.doc-nav-title {
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--text);
    line-height: 1.4;
    transition: color var(--duration-fast) var(--ease-out);
}
.doc-nav-prev:hover .doc-nav-title,
.doc-nav-next:hover .doc-nav-title {
    color: var(--accent);
}
.doc-nav-spacer {
    flex: 1;
}

@media (max-width: 768px) {
    .layout {
        grid-template-columns: 1fr;
        padding: 0 var(--space-4);
    }
}
</style>