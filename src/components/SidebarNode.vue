<script setup lang="ts">
import { useRoute } from 'vue-router'
import type { DocTreeNode } from '@/types'

defineProps<{ node: DocTreeNode }>()

const route = useRoute()

function isActive(node: DocTreeNode): boolean {
  return node.type === 'doc' && route.path === node.path
}

function toggleFolder(node: DocTreeNode) {
  if (node.type === 'folder') node.open = !node.open
}
</script>

<template>
  <li v-if="node.type === 'folder'" class="sidebar-folder" :class="{ open: node.open }">
    <div class="sidebar-folder-header" @click="toggleFolder(node)">
      <span class="sidebar-folder-icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </span>
      <span class="sidebar-folder-label">{{ node.name }}</span>
    </div>
    <ul class="sidebar-folder-children" v-if="node.children">
      <SidebarNode v-for="child in node.children" :key="child.name" :node="child" />
    </ul>
  </li>
  <li v-else class="sidebar-leaf">
    <router-link :to="node.path" :class="{ active: isActive(node) }">
      <span class="sidebar-leaf-dot"></span>
      {{ node.name }}
    </router-link>
  </li>
</template>

<style scoped>
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
</style>
