<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(defineProps<{
  data: any
  keyName?: string
  depth?: number
}>(), { depth: 0 })

const isExpanded = ref(props.depth < 3)

function isObject(val: any): boolean {
  return val !== null && typeof val === 'object'
}

const isArray = computed(() => Array.isArray(props.data))

const valueClass = computed(() => {
  const val = props.data
  if (val === null || val === undefined) return 'value-null'
  if (typeof val === 'boolean') return 'value-boolean'
  if (typeof val === 'number') return 'value-number'
  if (typeof val === 'string') return 'value-string'
  return 'value-other'
})

function formatValue(val: any): string {
  if (val === null) return 'null'
  if (val === undefined) return 'undefined'
  if (typeof val === 'string') {
    if (val.length > 200) return `"${val.substring(0, 200)}..."`
    return `"${val}"`
  }
  return String(val)
}

const previewText = computed(() => {
  if (isArray.value) {
    if (props.data.length === 0) return '[]'
    return `[${props.data.length} items]`
  }
  const keys = Object.keys(props.data)
  if (keys.length === 0) return '{}'
  return `{${keys.slice(0, 3).join(', ')}${keys.length > 3 ? ', ...' : ''}}`
})

const entries = computed(() => {
  if (isArray.value) {
    return props.data.map((v: any, i: number) => ({ key: String(i), value: v }))
  }
  return Object.keys(props.data).sort().map((k) => ({ key: k, value: props.data[k] }))
})

function toggle() { isExpanded.value = !isExpanded.value }
</script>

<template>
  <div class="json-tree-node" :style="{ paddingLeft: depth > 0 ? '18px' : '0' }">
    <div v-if="isObject(data)" class="tree-branch">
      <div class="branch-header" :class="{ collapsed: !isExpanded }" @click="toggle">
        <span class="toggle-icon" :class="{ expanded: isExpanded }">▸</span>
        <span v-if="keyName" class="key-name">{{ keyName }}</span>
        <span class="type-badge" :class="isArray ? 'type-array' : 'type-object'">
          {{ isArray ? 'Array' : 'Object' }}
        </span>
        <span class="size-info">({{ isArray ? data.length : Object.keys(data).length }})</span>
        <span class="branch-preview" v-if="!isExpanded">{{ previewText }}</span>
      </div>
      <div v-if="isExpanded" class="branch-children">
        <JsonTree v-for="e in entries" :key="e.key" :data="e.value" :key-name="String(e.key)" :depth="depth + 1" />
      </div>
    </div>
    <div v-else class="tree-leaf">
      <span class="leaf-key" v-if="keyName">{{ keyName }}: </span>
      <span class="leaf-value" :class="valueClass">{{ formatValue(data) }}</span>
    </div>
  </div>
</template>

<style scoped>
.json-tree-node {
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.7;
}
.branch-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 2px 4px;
  border-radius: var(--radius-xs);
  cursor: pointer;
  user-select: none;
  transition: background var(--duration-fast) var(--ease-out);
}
.branch-header:hover { background: var(--accent-soft); }
.toggle-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  color: var(--text-muted);
  opacity: 0.6;
  font-size: 10px;
  transition: transform 0.2s ease;
  flex-shrink: 0;
}
.toggle-icon.expanded { transform: rotate(90deg); }
.key-name { color: var(--accent); font-weight: 500; margin-right: 2px; }
.type-badge {
  padding: 0 6px;
  border-radius: var(--radius-xs);
  font-weight: 600;
  font-size: 10px;
  line-height: 1.6;
}
.type-array { background: rgba(49, 120, 198, 0.18); color: #3178c6; }
.type-object { background: rgba(139, 92, 246, 0.18); color: #8b5cf6; }
.size-info { color: var(--text-muted); opacity: 0.5; font-size: 11px; }
.branch-preview {
  color: var(--text-muted);
  opacity: 0.5;
  font-size: 11px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}
.branch-children {
  border-left: 1px solid var(--border);
  margin-left: 6px;
}
.tree-leaf {
  padding: 2px 4px;
  padding-left: 18px;
  border-radius: var(--radius-xs);
}
.tree-leaf:hover { background: var(--accent-soft); }
.leaf-key { color: var(--accent); font-weight: 500; }
.leaf-value { font-weight: 500; }
.value-string { color: #16a34a; }
.value-number { color: #2563eb; }
.value-boolean { color: #d97706; }
.value-null { color: var(--text-muted); font-style: italic; }
.value-other { color: var(--text); }
html[data-theme="dark"] .value-string { color: #4ade80; }
html[data-theme="dark"] .value-number { color: #60a5fa; }
html[data-theme="dark"] .value-boolean { color: #fbbf24; }
</style>