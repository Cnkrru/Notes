<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { buildDocTree } from '@/utils/docs'
import type { DocTreeNode } from '@/types'
import SidebarNode from './SidebarNode.vue'
import { useLayoutStore } from '@/stores'

const route = useRoute()
const layoutStore = useLayoutStore()

const tree = ref<DocTreeNode[]>([])
const sidebarEl = ref<HTMLElement | null>(null)

function buildAndExpand() {
  const raw = buildDocTree()
  // 深拷贝避免修改缓存
  tree.value = JSON.parse(JSON.stringify(raw))
  expandCurrent()
}

function expandCurrent() {
  const currentPath = route.path
  // 从根往下展开当前路径所在文件夹
  // 不关闭已打开的文件夹，保留用户手动操作
  function walk(nodes: DocTreeNode[]): boolean {
    for (const node of nodes) {
      if (node.type === 'doc') {
        if (node.path === currentPath) return true
      } else if (node.type === 'folder' && node.children) {
        const found = walk(node.children)
        if (found) {
          node.open = true
          return true
        }
      }
    }
    return false
  }
  walk(tree.value)
}

function afterNavigate() {
  expandCurrent()
  // 滚动到激活项
  nextTick(() => {
    if (!sidebarEl.value) return
    const active = sidebarEl.value.querySelector('.sidebar-leaf a.active')
    if (active) {
      active.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }
  })
}

onMounted(() => {
  buildAndExpand()
})

watch(() => route.path, () => {
  afterNavigate()
})
</script>

<template>
  <aside class="sidebar" :class="{ collapsed: layoutStore.sidebarCollapsed }" ref="sidebarEl">
    <template v-if="!layoutStore.sidebarCollapsed">
      <div class="sidebar-title">
        <span class="sidebar-title-label">文档目录</span>
        <button class="sidebar-toggle" type="button" title="收起侧边栏" @click="layoutStore.toggleSidebar()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
      </div>
      <ul class="sidebar-nav">
        <SidebarNode v-for="node in tree" :key="node.name" :node="node" />
      </ul>
    </template>
    <button v-else class="sidebar-expand" type="button" title="展开侧边栏" @click="layoutStore.toggleSidebar()">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
    </button>
  </aside>
</template>

<style scoped>
.sidebar {
    position: sticky;
    top: var(--topbar-height);
    align-self: start;
    max-height: calc(100vh - var(--topbar-height));
    overflow-y: auto;
    padding: var(--space-5) 0;
    border-right: 1px solid var(--border-light);
}

/* 自定义滚动条 */
.sidebar::-webkit-scrollbar { width: 4px; }
.sidebar::-webkit-scrollbar-track { background: transparent; }
.sidebar::-webkit-scrollbar-thumb {
    background: var(--border);
    border-radius: 4px;
    transition: background var(--duration-fast) var(--ease-out);
}
.sidebar::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }

/* Firefox 滚动条 */
.sidebar { scrollbar-width: thin; scrollbar-color: var(--border) transparent; }

/* ---- 标题 ---- */
.sidebar-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.6875rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--text-muted);
    padding: 0 var(--space-3) var(--space-3);
    font-weight: 600;
    font-family: var(--font-sans);
    position: relative;
    padding-left: var(--space-3);
}

/* 标题左侧朱砂装饰点 */
.sidebar-title-label::before {
    content: "";
    display: inline-block;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--accent);
    margin-right: 6px;
    vertical-align: middle;
    opacity: 0.5;
    position: relative;
    top: -1px;
}

/* ---- 收放按钮 ---- */
.sidebar-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--text-muted);
    cursor: pointer;
    transition: color var(--duration-fast) var(--ease-out),
                background var(--duration-fast) var(--ease-out),
                border-color var(--duration-fast) var(--ease-out);
}
.sidebar-toggle:hover {
    color: var(--accent);
    border-color: var(--accent);
    background: var(--accent-soft);
}

/* ---- 收起状态：窄条 + 展开按钮 ---- */
.sidebar.collapsed {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--space-5) 0;
    overflow: visible;
}
.sidebar-expand {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--text-muted);
    cursor: pointer;
    transition: color var(--duration-fast) var(--ease-out),
                background var(--duration-fast) var(--ease-out),
                border-color var(--duration-fast) var(--ease-out);
}
.sidebar-expand:hover {
    color: var(--accent);
    border-color: var(--accent);
    background: var(--accent-soft);
}

/* ---- 导航列表 ---- */
.sidebar-nav {
    margin: 0;
    padding: 0;
    list-style: none;
    font-size: var(--text-sm);
}

/* ---- 分隔线（顶层分组之间） ---- */
.sidebar-nav > :deep(.sidebar-folder) + :deep(.sidebar-folder),
.sidebar-nav > :deep(.sidebar-folder) + :deep(.sidebar-leaf) {
    border-top: 1px solid var(--border-light);
    margin-top: 6px;
    padding-top: 6px;
    position: relative;
}

/* 分隔线上方加一个小圆点装饰 */
.sidebar-nav > :deep(.sidebar-folder) + :deep(.sidebar-folder)::before,
.sidebar-nav > :deep(.sidebar-folder) + :deep(.sidebar-leaf)::before {
    content: "";
    position: absolute;
    top: -4px;
    left: var(--space-3);
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: var(--border);
    opacity: 0.5;
}

@media (max-width: 768px) {
    .sidebar { display: none; }
}
</style>
