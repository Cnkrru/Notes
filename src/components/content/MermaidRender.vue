<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useThemeStore } from '@/stores'

const props = defineProps({
  code: { type: String, required: true }
})

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)

const containerRef = ref(null)
const loading = ref(false)
const error = ref('')
const mermaidId = ref('mermaid-' + Date.now() + '-' + Math.floor(Math.random() * 10000))
let mermaidReady = false
let mermaidPromise = null

const MERMAID_VERSION = '10.9.1'
const CDN_LINKS = [
  `https://cdn.jsdelivr.net/npm/mermaid@${MERMAID_VERSION}/dist/mermaid.min.js`,
  `https://unpkg.com/mermaid@${MERMAID_VERSION}/dist/mermaid.min.js`
]

function loadMermaid() {
  if (mermaidReady) return Promise.resolve()
  if (mermaidPromise) return mermaidPromise
  mermaidPromise = new Promise((resolve, reject) => {
    if (window.mermaid) {
      mermaidReady = true
      resolve()
      return
    }
    let i = 0
    const tryLoad = () => {
      if (i >= CDN_LINKS.length) { reject(new Error('Mermaid 加载失败')); return }
      const s = document.createElement('script')
      s.src = CDN_LINKS[i]
      s.crossOrigin = 'anonymous'
      s.onload = () => { mermaidReady = true; resolve() }
      s.onerror = () => { i++; tryLoad() }
      document.head.appendChild(s)
    }
    tryLoad()
  })
  return mermaidPromise
}

function initializeMermaid() {
  const m = window.mermaid
  if (!m) return
  m.initialize({
    startOnLoad: false,
    securityLevel: 'loose',
    theme: isDark.value ? 'dark' : 'default',
    flowchart: { useMaxWidth: true, htmlLabels: true }
  })
}

async function render() {
  if (!containerRef.value) return
  loading.value = true
  error.value = ''
  try {
    await loadMermaid()
    const m = window.mermaid
    if (!m) throw new Error('Mermaid 未加载')
    initializeMermaid()
    mermaidId.value = 'mermaid-' + Date.now() + '-' + Math.floor(Math.random() * 10000)
    containerRef.value.innerHTML = ''
    const { svg } = await m.render(mermaidId.value, props.code)
    containerRef.value.innerHTML = svg
  } catch (e) {
    error.value = e.message || '图表渲染失败'
  } finally {
    loading.value = false
  }
}

onMounted(() => render())
onUnmounted(() => { mermaidPromise = null })
watch(() => props.code, () => render())
watch(isDark, () => { if (mermaidReady) render() })
</script>

<template>
  <div class="mermaid-container">
    <div v-if="loading" class="mermaid-state">加载图表中…</div>
    <div v-else-if="error" class="mermaid-state mermaid-error">{{ error }}</div>
    <div ref="containerRef" class="mermaid-content" v-show="!loading && !error"></div>
  </div>
</template>

<style scoped>
.mermaid-container {
  margin: 1.5em 0;
  padding: 1.2em 1.4em;
  border-radius: var(--radius);
  border: 1px solid var(--border-light);
  background: var(--bg-card);
  overflow-x: auto;
}
.mermaid-state {
  color: var(--text-muted);
  font-size: var(--text-sm);
  padding: 1em 0;
  text-align: center;
}
.mermaid-error { color: #f56c6c; }
.mermaid-content :deep(svg) { max-width: 100%; height: auto; }
</style>