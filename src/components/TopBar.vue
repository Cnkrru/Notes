<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useThemeStore } from '@/stores'
import { searchDocs, getAllDocs } from '@/utils/docs'
import { siteConfig, defaultNav } from '@/config/site'

const themeStore = useThemeStore()
const router = useRouter()

const searchQuery = ref('')
const searchResults = ref([])
const showPanel = ref(false)
const menuOpen = ref(false)
const searchInput = ref(null)

const searchVisible = computed(() => searchQuery.value.length > 0)

function highlightText(text, query) {
  if (!query.trim()) return text
  const q = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${q})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}

function getMatchSnippet(matches, query) {
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

function goToDoc(doc) {
  clearSearch()
  router.push(`/${doc.id}`)
}

function handleKeydown(e) {
  if (e.key === 'Escape') {
    clearSearch()
  }
}

const totalDocs = computed(() => getAllDocs().length)

// 导航：优先用配置的 siteConfig.nav，未配置回落到默认项
const nav = computed(() => (siteConfig.nav.length ? siteConfig.nav : defaultNav))

function isInternal(link) {
  return !!link && link.startsWith('/')
}
function onClick() {
  menuOpen.value = false
}

// 全局键盘快捷键
function onGlobalKeydown(e) {
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
      <router-link to="/" class="brand">{{ siteConfig.name }}</router-link>
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
          <template v-for="item in nav" :key="item.text">
            <li v-if="item.items && item.items.length" class="nav-sub">
              <span class="nav-sub-btn">{{ item.text }}</span>
              <ul class="nav-sub-list">
                <li v-for="sub in item.items" :key="sub.text" class="nav-sub-item">
                  <component
                    :is="isInternal(sub.link) ? RouterLink : 'a'"
                    :to="isInternal(sub.link) ? sub.link : undefined"
                    :href="isInternal(sub.link) ? undefined : sub.link"
                    :target="isInternal(sub.link) ? undefined : '_blank'"
                    :rel="isInternal(sub.link) ? undefined : 'noopener'"
                    @click="onClick"
                  >{{ sub.text }}</component>
                </li>
              </ul>
            </li>
            <li v-else class="nav-item">
              <component
                :is="isInternal(item.link) ? RouterLink : 'a'"
                :to="isInternal(item.link) ? item.link : undefined"
                :href="isInternal(item.link) ? undefined : item.link"
                :target="isInternal(item.link) ? undefined : '_blank'"
                :rel="isInternal(item.link) ? undefined : 'noopener'"
                @click="onClick"
              >{{ item.text }}</component>
            </li>
          </template>
        </ul>
      </div>
    </div>
    <div class="reading-progress" id="reading-progress"></div>
  </nav>
</template>

<style scoped>
.topbar {
    position: sticky;
    top: 0;
    z-index: 100;
    height: var(--topbar-height);
    background: var(--topbar-bg);
    -webkit-backdrop-filter: saturate(180%) blur(16px);
    backdrop-filter: saturate(180%) blur(16px);
    border-bottom: 1px solid var(--border-light);
    transition: background var(--duration-normal) var(--ease-out),
                border-color var(--duration-normal) var(--ease-out);
}

.reading-progress {
    position: absolute;
    bottom: 0;
    left: 0;
    height: var(--progress-height);
    background: var(--accent);
    border-radius: 0 1px 0 0;
    width: 0%;
    transition: width 0.1s linear;
    z-index: 101;
}

.topbar .container {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-4);
    max-width: 1360px;
    margin: 0 auto;
    padding: 0 var(--space-6);
}

.topbar-right {
    display: flex;
    align-items: center;
    gap: var(--space-3);
}

.brand {
    font-size: var(--text-lg);
    font-weight: 700;
    color: var(--text);
    text-decoration: none;
    letter-spacing: -0.01em;
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-family: var(--font-serif);
    flex-shrink: 0;
    transition: opacity var(--duration-fast) var(--ease-out);
}
.brand:hover { opacity: 0.8; color: var(--text); }

.nav-links {
    display: flex;
    gap: var(--space-6);
    margin: 0;
    padding: 0;
    list-style: none;
}
.nav-links a {
    color: var(--text-muted);
    text-decoration: none;
    font-size: var(--text-sm);
    font-weight: 500;
    transition: color var(--duration-fast) var(--ease-out);
}
.nav-links a:hover {
    color: var(--accent);
}

.nav-item,
.nav-sub { position: relative; }

.nav-sub-btn {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    color: var(--text-muted);
    font-size: var(--text-sm);
    font-weight: 500;
    cursor: default;
    padding: 2px 0;
    transition: color var(--duration-fast) var(--ease-out);
}
.nav-sub-btn::after {
    content: "";
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 4px solid currentColor;
    opacity: 0.6;
    margin-top: 2px;
}
.nav-sub:hover .nav-sub-btn { color: var(--accent); }

.nav-sub-list {
    position: absolute;
    top: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%) translateY(-4px);
    min-width: 168px;
    margin: 0;
    padding: var(--space-1);
    list-style: none;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: var(--shadow-lg);
    opacity: 0;
    visibility: hidden;
    transition: opacity var(--duration-fast) var(--ease-out),
                transform var(--duration-fast) var(--ease-out),
                visibility 0s var(--duration-fast);
    z-index: 50;
}
.nav-sub:hover .nav-sub-list,
.nav-sub:focus-within .nav-sub-list {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(0);
    transition: opacity var(--duration-fast) var(--ease-out),
                transform var(--duration-fast) var(--ease-out);
}
.nav-sub-list a {
    display: block;
    padding: var(--space-2) var(--space-3);
    border-radius: var(--radius-sm);
    white-space: nowrap;
}
.nav-sub-list a:hover {
    background: var(--accent-soft);
    color: var(--accent);
}

/* 当前页高亮（站内链接）/ 外链打开新标签 */
.nav-links a.router-link-active {
    color: var(--accent);
}

.theme-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border: 1px solid var(--border);
    background: var(--bg-card);
    color: var(--text-muted);
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: background var(--duration-fast) var(--ease-out),
                color var(--duration-fast) var(--ease-out),
                border-color var(--duration-fast) var(--ease-out),
                box-shadow var(--duration-fast) var(--ease-out);
}
.theme-toggle:hover {
    background: var(--bg-soft);
    border-color: var(--accent);
    color: var(--accent);
    box-shadow: var(--glow);
}

.theme-toggle svg,
.menu-toggle svg {
    display: block;
    width: 16px;
    height: 16px;
}

html:not([data-theme="dark"]) .icon-sun { display: none; }
html[data-theme="dark"] .icon-moon { display: none; }

.menu-toggle {
    display: none;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border: 1px solid var(--border);
    background: var(--bg-card);
    border-radius: var(--radius-sm);
    cursor: pointer;
    color: var(--text-muted);
    transition: background var(--duration-fast) var(--ease-out),
                color var(--duration-fast) var(--ease-out),
                border-color var(--duration-fast) var(--ease-out);
}
.menu-toggle:hover {
    background: var(--bg-soft);
    border-color: var(--accent);
    color: var(--accent);
}

/* ---- 搜索 ---- */
.search-wrap {
    position: relative;
    flex: 0 1 260px;
    min-width: 0;
}

.search-input {
    width: 100%;
    height: 34px;
    padding: 0 34px 0 var(--space-3);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    background: var(--bg-card);
    color: var(--text);
    font-family: var(--font-sans);
    font-size: var(--text-sm);
    outline: none;
    transition: border-color var(--duration-fast) var(--ease-out),
                box-shadow var(--duration-fast) var(--ease-out),
                background var(--duration-fast) var(--ease-out);
}
.search-input::placeholder {
    color: var(--text-muted);
    opacity: 0.5;
}
.search-input:focus {
    border-color: var(--accent);
    box-shadow: var(--glow);
    background: var(--bg);
}

.search-icon {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    color: var(--text-muted);
    pointer-events: none;
    transition: color var(--duration-fast) var(--ease-out);
}
.search-input:focus ~ .search-icon,
.search-input:not(:placeholder-shown) ~ .search-icon {
    color: var(--accent);
}

.search-clear {
    position: absolute;
    right: 28px;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    display: none;
    align-items: center;
    justify-content: center;
    border: none;
    background: none;
    color: var(--text-muted);
    cursor: pointer;
    padding: 0;
    border-radius: 50%;
    transition: color var(--duration-fast) var(--ease-out),
                background var(--duration-fast) var(--ease-out);
}
.search-clear:hover {
    color: var(--accent);
    background: var(--accent-soft);
}
.search-clear.visible { display: flex; }

.search-panel {
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    right: 0;
    max-height: 400px;
    overflow-y: auto;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: var(--shadow-lg);
    z-index: 200;
    display: none;
    animation: panelIn 0.12s var(--ease-out);
}
.search-panel.open { display: block; }

@keyframes panelIn {
    from { opacity: 0; transform: translateY(-4px); }
    to   { opacity: 1; transform: translateY(0); }
}

.search-empty {
    padding: var(--space-6) var(--space-4);
    text-align: center;
    color: var(--text-muted);
    font-size: var(--text-sm);
}

.search-results {
    margin: 0;
    padding: var(--space-1);
    list-style: none;
}

.search-item {
    display: block;
    padding: var(--space-2) var(--space-3);
    border-radius: var(--radius-sm);
    text-decoration: none;
    color: var(--text);
    cursor: pointer;
    transition: background var(--duration-fast) var(--ease-out),
                transform var(--duration-fast) var(--ease-out);
}
.search-item:hover {
    background: var(--accent-soft);
    transform: translateX(2px);
}
.search-item:active {
    transform: scale(0.99);
}

.search-item-title {
    font-size: var(--text-sm);
    font-weight: 600;
    margin-bottom: 2px;
    line-height: 1.4;
}
.search-item-title mark {
    background: none;
    color: var(--accent);
    font-weight: 700;
}

.search-item-desc {
    font-size: var(--text-xs);
    color: var(--text-muted);
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin-bottom: 2px;
}
.search-item-desc mark {
    background: none;
    color: var(--accent);
}

.search-item-tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-1);
    margin-top: 2px;
}

.search-item-tag {
    font-size: 0.6875rem;
    color: var(--accent);
    background: var(--accent-soft);
    padding: 1px 6px;
    border-radius: 999px;
    font-weight: 500;
    transition: background var(--duration-fast) var(--ease-out);
}

.search-hint {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: var(--space-2) var(--space-3);
    border-top: 1px solid var(--border-light);
    font-size: 0.6875rem;
    color: var(--text-muted);
    opacity: 0.65;
}

@media (max-width: 768px) {
    .menu-toggle { display: inline-flex; }
    .nav-links {
        position: absolute;
        top: var(--topbar-height);
        left: 0;
        right: 0;
        flex-direction: column;
        gap: 0;
        background: var(--bg-card);
        border-bottom: 1px solid var(--border);
        padding: var(--space-2) var(--space-6);
        display: none;
        box-shadow: var(--shadow-md);
    }
    .nav-links li { padding: var(--space-2) 0; }
    .nav-links.open { display: flex; }

    /* 移动端菜单内把下拉展平为缩进列表 */
    .nav-sub-list {
        position: static;
        transform: none;
        opacity: 1;
        visibility: visible;
        box-shadow: none;
        border: none;
        background: none;
        padding: var(--space-1) 0 0 var(--space-4);
    }
    .nav-sub-list a:hover { background: none; }
    .nav-sub-btn { cursor: pointer; }

    .search-wrap {
        flex: 1 1 auto;
        order: -1;
        width: 100%;
    }
    .topbar .container {
        flex-wrap: wrap;
        padding-top: var(--space-2);
        padding-bottom: var(--space-2);
        height: auto;
    }
    .topbar {
        height: auto;
        min-height: var(--topbar-height);
    }
    .search-panel {
        position: fixed;
        top: 104px;
        left: var(--space-3);
        right: var(--space-3);
        max-height: 50vh;
    }
}
</style>