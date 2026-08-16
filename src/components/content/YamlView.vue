<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import JsonTree from './JsonTree.vue'
import CodeCopy from './CodeCopy.vue'
import { useSourceHighlight } from './useSourceHighlight'

const props = defineProps<{ code: string }>()

const viewMode = ref<'preview' | 'source'>('preview')
const { sourceRef } = useSourceHighlight('yaml', computed(() => viewMode.value === 'source'))
const parseError = ref('')
const parsed = ref<any>(null)
const yamlReady = ref(false)
const cdnError = ref('')

const CDN_JSYAML = 'https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/dist/js-yaml.min.js'

function loadJsYaml(): Promise<void> {
  if ((window as any).jsyaml) { yamlReady.value = true; return Promise.resolve() }
  return new Promise((resolve) => {
    const s = document.createElement('script')
    s.src = CDN_JSYAML
    s.onload = () => { yamlReady.value = true; resolve() }
    s.onerror = () => {
      cdnError.value = 'js-yaml 加载失败，已切换到源码视图'
      viewMode.value = 'source'
      resolve()
    }
    document.head.appendChild(s)
  })
}

async function parse() {
  parseError.value = ''
  parsed.value = null
  const trimmed = props.code.trim()
  if (!trimmed) { parseError.value = '输入为空'; viewMode.value = 'source'; return }
  if (!yamlReady.value) await loadJsYaml()
  try {
    const jsyaml = (window as any).jsyaml
    if (!jsyaml) { viewMode.value = 'source'; return }
    const result = jsyaml.load(trimmed)
    parsed.value = (result === null || result === undefined) ? {} : (typeof result === 'object' ? result : { value: result })
    viewMode.value = 'preview'
  } catch (e: any) {
    parseError.value = `解析失败: ${e.message || '语法错误'}`
    viewMode.value = 'source'
  }
}

parse()
watch(() => props.code, parse)

const statsText = computed(() => {
  if (parseError.value || cdnError.value) return '解析失败'
  if (!yamlReady.value) return '加载中…'
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
  <div class="struct-view yaml-view" :class="{ 'has-error': parseError || cdnError }">
    <div class="sv-header">
      <span class="sv-badge yaml">YAML</span>
      <div class="sv-actions">
        <CodeCopy :code="code" />
        <button class="sv-toggle" :class="{ active: viewMode === 'preview' }" @click="viewMode = 'preview'">结构化</button>
        <button class="sv-toggle" :class="{ active: viewMode === 'source' }" @click="viewMode = 'source'">源码</button>
        <span class="sv-stats">{{ statsText }}</span>
      </div>
    </div>
    <div v-if="viewMode === 'preview'" class="sv-preview">
      <div v-if="cdnError" class="sv-error">{{ cdnError }}</div>
      <div v-else-if="!yamlReady" class="sv-error">加载解析器…</div>
      <div v-else-if="parseError" class="sv-error">{{ parseError }}</div>
      <div v-else class="sv-tree"><JsonTree :data="parsed" /></div>
    </div>
    <pre v-else class="sv-source"><code ref="sourceRef">{{ code }}</code></pre>
  </div>
</template>

<style scoped src="./structured.css"></style>
<style scoped>
/* 清除 Prism 默认主题的浅色适配样式（深色代码背景上）
   :deep() 需写在组件内联 scoped style 中才会被 Vue 处理 */
.sv-source :deep(.token) {
  text-shadow: none !important;
  background: transparent !important;
}
</style>