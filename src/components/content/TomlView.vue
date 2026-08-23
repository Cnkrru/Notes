<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import JsonTree from '@/components/content/JsonTree.vue'
import CodeCopy from '@/components/content/CodeCopy.vue'
import { useSourceHighlight } from '@/composables/useSourceHighlight'

const props = defineProps<{ code: string }>()

const viewMode = ref<'preview' | 'source'>('preview')
const { sourceRef } = useSourceHighlight('toml', computed(() => viewMode.value === 'source'))
const parseError = ref('')
const parsed = ref<any>(null)

/* ===== 手写 TOML 解析器 ===== */
function parseToml(input: string): Record<string, any> {
  const result: Record<string, any> = {}
  let currentTable = result
  const lines = input.split('\n')

  for (const line of lines) {
    const l = line.trim()
    if (!l || l.startsWith('#')) continue

    if (l.startsWith('[') && !l.startsWith('[[')) {
      const m = l.match(/^\[([^\]]+)\]$/)
      if (!m) continue
      currentTable = navigateTo(result, m[1].split('.'), true)
      continue
    }
    if (l.startsWith('[[')) {
      const m = l.match(/^\[\[([^\]]+)\]\]$/)
      if (!m) continue
      const keys = m[1].split('.')
      const parent = keys.slice(0, -1).length ? navigateTo(result, keys.slice(0, -1), true) : result
      const lastKey = keys[keys.length - 1]
      if (!Array.isArray(parent[lastKey])) parent[lastKey] = []
      const arr = parent[lastKey] as any[]
      arr.push({})
      currentTable = arr[arr.length - 1]
      continue
    }
    const eqIdx = l.indexOf('=')
    if (eqIdx === -1) continue
    const key = l.substring(0, eqIdx).trim()
    const valStr = l.substring(eqIdx + 1).trim()
    currentTable[key] = parseTomlValue(valStr)
  }
  return result
}

function navigateTo(root: any, keys: string[], create: boolean): any {
  let curr = root
  for (const k of keys) {
    if (!(k in curr)) { if (!create) return undefined; curr[k] = {} }
    curr = curr[k]
  }
  return curr
}

function parseTomlValue(raw: string): any {
  const v = raw.trim()
  if (v.startsWith('[') && v.endsWith(']')) return parseTomlArray(v)
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    const inner = v.slice(1, -1)
    if (v.startsWith('"')) return inner.replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\\\/g, '\\')
    return inner
  }
  if (v === 'true') return true
  if (v === 'false') return false
  const num = Number(v)
  if (!isNaN(num) && v !== '') return num
  if (/^\d{4}-\d{2}-\d{2}/.test(v)) return v
  return v
}

function parseTomlArray(raw: string): any[] {
  const inner = raw.slice(1, -1).trim()
  if (!inner) return []
  const result: any[] = []
  let buf = ''
  let depth = 0
  let inStr = false
  let quote = ''
  for (const ch of inner) {
    if (inStr) {
      buf += ch
      if (ch === quote) inStr = false
    } else if (ch === '"' || ch === "'") {
      buf += ch; inStr = true; quote = ch
    } else if (ch === '[' || ch === '{') {
      buf += ch; depth++
    } else if (ch === ']' || ch === '}') {
      buf += ch; depth--
    } else if (ch === ',' && depth === 0) {
      result.push(parseTomlValue(buf.trim())); buf = ''
    } else {
      buf += ch
    }
  }
  if (buf.trim()) result.push(parseTomlValue(buf.trim()))
  return result
}

function parse() {
  parseError.value = ''
  parsed.value = null
  const trimmed = props.code.trim()
  if (!trimmed) { parseError.value = '输入为空'; viewMode.value = 'source'; return }
  try {
    parsed.value = parseToml(trimmed)
    viewMode.value = 'preview'
  } catch (e: any) {
    parseError.value = `解析失败: ${e.message || '语法错误'}`
    viewMode.value = 'source'
  }
}

parse()
watch(() => props.code, parse)

const statsText = computed(() => {
  if (parseError.value) return '解析失败'
  const lines = props.code.split('\n').length
  const nodes = countNodes(parsed.value)
  return `${lines} 行 · ${nodes} 节点`
})

function countNodes(data: any): number {
  if (data === null || data === undefined || typeof data !== 'object') return 1
  let count = 1
  if (Array.isArray(data)) {
    for (const item of data) count += countNodes(item)
  } else {
    for (const key of Object.keys(data)) count += countNodes(data[key])
  }
  return count
}
</script>

<template>
  <div class="struct-view toml-view" :class="{ 'has-error': parseError }">
    <div class="sv-header">
      <span class="sv-badge toml">TOML</span>
      <div class="sv-actions">
        <CodeCopy :code="code" />
        <button class="sv-toggle" :class="{ active: viewMode === 'preview' }" @click="viewMode = 'preview'">结构化</button>
        <button class="sv-toggle" :class="{ active: viewMode === 'source' }" @click="viewMode = 'source'">源码</button>
        <span class="sv-stats">{{ statsText }}</span>
      </div>
    </div>
    <div v-if="viewMode === 'preview'" class="sv-preview">
      <div v-if="parseError" class="sv-error">{{ parseError }}</div>
      <div v-else class="sv-tree"><JsonTree :data="parsed" /></div>
    </div>
    <pre v-else class="sv-source"><code ref="sourceRef">{{ code }}</code></pre>
  </div>
</template>

<style scoped src="@/assets/css/structured.css"></style>
<style scoped>
/* 清除 Prism 默认主题的浅色适配样式（深色代码背景上）
   :deep() 需写在组件内联 scoped style 中才会被 Vue 处理 */
.sv-source :deep(.token) {
  text-shadow: none !important;
  background: transparent !important;
}
</style>