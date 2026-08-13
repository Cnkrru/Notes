<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { buildDocTree } from '@/utils/docs'
import type { DocTreeNode } from '@/types'

const route = useRoute()

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

function isActive(node: DocTreeNode): boolean {
  if (node.type !== 'doc') return false
  return route.path === node.path
}

function toggleFolder(node: DocTreeNode) {
  if (node.type === 'folder') {
    node.open = !node.open
  }
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
  <aside class="sidebar" ref="sidebarEl">
    <div class="sidebar-title">文档目录</div>
    <ul class="sidebar-nav">
      <template v-for="node in tree" :key="node.name">
        <!-- 文件夹 -->
        <li v-if="node.type === 'folder'" class="sidebar-folder" :class="{ open: node.open }">
          <div class="sidebar-folder-header" @click="toggleFolder(node)">
            <span class="sidebar-folder-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </span>
            <span class="sidebar-folder-label">{{ node.name }}</span>
          </div>
          <ul class="sidebar-folder-children" v-if="node.children">
            <template v-for="child in node.children" :key="child.name">
              <li v-if="child.type === 'doc'" class="sidebar-leaf">
                <router-link :to="child.path" :class="{ active: isActive(child) }">
                  <span class="sidebar-leaf-dot"></span>
                  {{ child.name }}
                </router-link>
              </li>
              <li v-else-if="child.type === 'folder'" class="sidebar-folder" :class="{ open: child.open }">
                <div class="sidebar-folder-header" @click="toggleFolder(child)">
                  <span class="sidebar-folder-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                  </span>
                  <span class="sidebar-folder-label">{{ child.name }}</span>
                </div>
                <ul class="sidebar-folder-children" v-if="child.children">
                  <template v-for="sub in child.children" :key="sub.name">
                    <li v-if="sub.type === 'doc'" class="sidebar-leaf">
                      <router-link :to="sub.path" :class="{ active: isActive(sub) }">
                        <span class="sidebar-leaf-dot"></span>
                        {{ sub.name }}
                      </router-link>
                    </li>
                  </template>
                </ul>
              </li>
            </template>
          </ul>
        </li>
        <!-- 根目录文档 -->
        <li v-else class="sidebar-leaf">
          <router-link :to="node.path" :class="{ active: isActive(node) }">
            <span class="sidebar-leaf-dot"></span>
            {{ node.name }}
          </router-link>
        </li>
      </template>
    </ul>
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
.sidebar-title::before {
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

/* ---- 导航列表 ---- */
.sidebar-nav {
    margin: 0;
    padding: 0;
    list-style: none;
    font-size: var(--text-sm);
}

/* ---- 分隔线（顶层分组之间） ---- */
.sidebar-nav > .sidebar-folder + .sidebar-folder,
.sidebar-nav > .sidebar-folder + .sidebar-leaf {
    border-top: 1px solid var(--border-light);
    margin-top: 6px;
    padding-top: 6px;
    position: relative;
}

/* 分隔线上方加一个小圆点装饰 */
.sidebar-nav > .sidebar-folder + .sidebar-folder::before,
.sidebar-nav > .sidebar-folder + .sidebar-leaf::before {
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

/* ---- 文件夹 ---- */
.sidebar-folder { margin: 0; }

.sidebar-folder-header {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 7px var(--space-3);
    margin: 0 6px;
    cursor: pointer;
    user-select: none;
    color: var(--text);
    font-weight: 550;
    font-size: var(--text-sm);
    border-radius: var(--radius-sm);
    transition: background var(--duration-fast) var(--ease-out),
                color var(--duration-fast) var(--ease-out);
}
.sidebar-folder-header:hover {
    background: var(--bg-soft);
    color: var(--accent);
}

/* 文件夹图标 */
.sidebar-folder-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    color: var(--text-muted);
    transition: transform var(--duration-fast) var(--ease-out);
}
.sidebar-folder.open > .sidebar-folder-header .sidebar-folder-icon {
    transform: rotate(90deg);
}

.sidebar-folder-label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* 子级缩进 */
.sidebar-folder-children {
    margin: 0;
    padding: 0 0 0 var(--space-3);
    list-style: none;
    overflow: hidden;
    max-height: 0;
    transition: max-height var(--duration-slow) var(--ease-out);
}
.sidebar-folder.open > .sidebar-folder-children {
    max-height: 9999px;
}

/* ---- 文档项 ---- */
.sidebar-leaf { margin: 0; }

.sidebar-leaf a {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px var(--space-3);
    margin: 0 6px;
    border-left: 2px solid transparent;
    color: var(--text-muted);
    text-decoration: none;
    font-size: var(--text-sm);
    border-radius: var(--radius-sm);
    line-height: 1.5;
    transition: background var(--duration-fast) var(--ease-out),
                color var(--duration-fast) var(--ease-out),
                border-color var(--duration-fast) var(--ease-out);
}
.sidebar-leaf a:hover {
    color: var(--text);
    background: var(--bg-soft);
}
.sidebar-leaf a.active {
    color: var(--accent);
    background: var(--accent-soft);
    border-left-color: var(--accent);
    font-weight: 600;
}

/* 文档项前缀小圆点 */
.sidebar-leaf-dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    flex-shrink: 0;
    background: var(--border);
    transition: background var(--duration-fast) var(--ease-out);
}
.sidebar-leaf a:hover .sidebar-leaf-dot {
    background: var(--text-muted);
}
.sidebar-leaf a.active .sidebar-leaf-dot {
    background: var(--accent);
}

@media (max-width: 768px) {
    .sidebar { display: none; }
}
</style>