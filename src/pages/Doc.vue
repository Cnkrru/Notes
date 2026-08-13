<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { marked } from 'marked'
import { getDocById, flattenTree } from '@/utils/docs'
import { renderMarkdown, processAdmonitions } from '@/utils/markdown'
import type { TocItem } from '@/types'
import SideBar from '@/components/SideBar.vue'
import TocColumn from '@/components/TocColumn.vue'

const route = useRoute()

const doc = ref<any>(null)
const htmlContent = ref('')
const toc = ref<TocItem[]>([])
const loading = ref(true)
const error = ref('')

// 配置 marked
marked.setOptions({
  breaks: true,
  gfm: true
})

// 面包屑导航
const breadcrumb = computed(() => {
  if (!doc.value?.category) return []
  const parts = doc.value.category.split(' > ')
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
      // 1) 预处理 admonition 提示块
      const mdWithAdmonitions = await processAdmonitions(found.markdownContent)
      // 2) marked 渲染
      const rawHtml = await marked.parse(mdWithAdmonitions)
      // 3) 后处理（代码块 + 锚点）
      const rendered = renderMarkdown(rawHtml)
      htmlContent.value = rendered
      // 4) 提取 TOC
      await nextTick()
      toc.value = extractTocFromHtml(rendered)
    } else {
      error.value = '文档未找到'
    }
  } catch (e: any) {
    error.value = e.message || '加载失败'
  } finally {
    loading.value = false
  }
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
  <div class="layout">
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
        <article class="doc" v-html="htmlContent"></article>

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