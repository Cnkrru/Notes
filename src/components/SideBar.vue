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