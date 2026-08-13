<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '@/stores'
import { searchDocs, getAllDocs } from '@/utils/docs'
import type { DocItem } from '@/utils/docs'

const themeStore = useThemeStore()
const router = useRouter()

const searchQuery = ref('')
const searchResults = ref<{ doc: DocItem; matches: string[] }[]>([])
const showPanel = ref(false)
const menuOpen = ref(false)
const searchInput = ref<HTMLInputElement | null>(null)

const searchVisible = computed(() => searchQuery.value.length > 0)

function highlightText(text: string, query: string): string {
  if (!query.trim()) return text
  const q = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${q})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}

function getMatchSnippet(matches: string[], query: string): string {
  // 找到第一个不是标题的匹配行
  const snippet = matches.find(m => m.length > 0) || ''
  if (snippet.length > 80) return snippet.substring(0, 80) + '...'
  return snippet
}

function onSearchInput() {
  if (searchQuery.value.trim()) {
    searchResults.value = searchDocs(searchQuery.value)
    showPanel.value = true
  } else {
    searchResults.value = []
    showPanel.value = false
  }
}

function clearSearch() {
  searchQuery.value = ''
  searchResults.value = []
  showPanel.value = false
}

function goToDoc(doc: DocItem) {
  clearSearch()
  router.push(`/doc/${doc.id}`)
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    clearSearch()
  }
}

const totalDocs = computed(() => getAllDocs().length)

// 全局键盘快捷键
function onGlobalKeydown(e: KeyboardEvent) {
  // Ctrl+K / Cmd+K → 聚焦搜索
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    searchInput.value?.focus()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onGlobalKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onGlobalKeydown)
})
</script>

<template>
  <nav class="topbar">
    <div class="container">
      <router-link to="/" class="brand">Notes</router-link>
      <div class="search-wrap">
        <input
          type="text"
          class="search-input"
          placeholder="搜索文档..."
          v-model="searchQuery"
          ref="searchInput"
          @input="onSearchInput"
          @keydown="handleKeydown"
          @focus="showPanel = searchQuery.trim().length > 0"
          @blur="setTimeout(() => showPanel = false, 200)"
          aria-label="搜索文档"
        />
        <button
          class="search-clear"
          :class="{ visible: searchQuery.length > 0 }"
          @click="clearSearch"
          aria-label="清除搜索"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <div class="search-panel" :class="{ open: showPanel }">
          <div v-if="searchResults.length === 0" class="search-empty">输入关键词搜索文档</div>
          <ul v-else class="search-results">
            <li v-for="(result, idx) in searchResults" :key="idx">
              <a class="search-item" @click.prevent="goToDoc(result.doc)" href="#">
                <div class="search-item-title" v-html="highlightText(result.doc.title, searchQuery)"></div>
                <div class="search-item-desc" v-if="getMatchSnippet(result.matches, searchQuery)" v-html="highlightText(getMatchSnippet(result.matches, searchQuery), searchQuery)"></div>
                <div class="search-item-tags" v-if="result.doc.tags && result.doc.tags.length > 0">
                  <span class="search-item-tag" v-for="tag in result.doc.tags" :key="tag">{{ tag }}</span>
                </div>
              </a>
            </li>
          </ul>
          <div class="search-hint">
            <kbd>Esc</kbd> 关闭
          </div>
        </div>
      </div>
      <div class="topbar-right">
        <button class="theme-toggle" @click="themeStore.toggleTheme" aria-label="切换主题">
          <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
        </button>
        <button class="menu-toggle" @click="menuOpen = !menuOpen" aria-label="菜单">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
        <ul class="nav-links" :class="{ open: menuOpen }">
          <li><router-link to="/">主页</router-link></li>
          <li><router-link to="/doc/index">文档</router-link></li>
        </ul>
      </div>
    </div>
    <div class="reading-progress" id="reading-progress"></div>
  </nav>
</template>