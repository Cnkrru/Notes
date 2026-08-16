<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps<{ latex: string }>()

const mathRef = ref<HTMLElement | null>(null)
const loading = ref(false)
const error = ref('')
let katexReady = false
let katexPromise: Promise<void> | null = null

const KATEX_VERSION = '0.16.11'
const CDN_LINKS = {
  css: [
    `https://cdn.jsdelivr.net/npm/katex@${KATEX_VERSION}/dist/katex.min.css`,
    `https://unpkg.com/katex@${KATEX_VERSION}/dist/katex.min.css`
  ],
  js: [
    `https://cdn.jsdelivr.net/npm/katex@${KATEX_VERSION}/dist/katex.min.js`,
    `https://unpkg.com/katex@${KATEX_VERSION}/dist/katex.min.js`
  ]
}

function loadResource(urls: string[], type: 'css' | 'js'): Promise<void> {
  return new Promise((resolve, reject) => {
    let i = 0
    const tryLoad = () => {
      if (i >= urls.length) { reject(new Error(`${type} 加载失败`)); return }
      const url = urls[i]
      const el = type === 'css' ? document.createElement('link') : document.createElement('script')
      el.crossOrigin = 'anonymous'
      if (type === 'css') {
        el.rel = 'stylesheet'; el.href = url
      } else {
        el.src = url
      }
      el.onload = () => resolve()
      el.onerror = () => { i++; tryLoad() }
      document.head.appendChild(el)
    }
    tryLoad()
  })
}

function loadKaTeX(): Promise<void> {
  if (katexReady) return Promise.resolve()
  if (katexPromise) return katexPromise
  katexPromise = Promise.all([
    loadResource(CDN_LINKS.css, 'css'),
    loadResource(CDN_LINKS.js, 'js')
  ]).then(() => { katexReady = true })
  return katexPromise
}

async function renderMath() {
  if (!mathRef.value) return
  loading.value = true
  error.value = ''
  try {
    await loadKaTeX()
    const katex = (window as any).katex
    if (!katex) throw new Error('KaTeX 未加载')
    mathRef.value.innerHTML = ''
    katex.render(props.latex, mathRef.value, {
      throwOnError: false,
      displayMode: true,
      strict: 'ignore',
      trust: true
    })
  } catch (e: any) {
    error.value = e.message || '公式渲染失败'
  } finally {
    loading.value = false
  }
}

onMounted(() => renderMath())
onUnmounted(() => { katexPromise = null })
watch(() => props.latex, () => renderMath())
</script>

<template>
  <div class="math-container">
    <div v-if="loading" class="math-state">加载公式中…</div>
    <div v-else-if="error" class="math-state math-error">{{ error }}</div>
    <div ref="mathRef" class="math-content" v-show="!loading && !error"></div>
  </div>
</template>

<style scoped>
.math-container {
  margin: 1.5em 0;
  padding: 1.2em 1.4em;
  border-radius: var(--radius);
  border: 1px solid var(--border-light);
  background: var(--bg-soft);
  overflow-x: auto;
}
.math-state {
  color: var(--text-muted);
  font-size: var(--text-sm);
  padding: 0.5em 0;
}
.math-error { color: #f56c6c; }
.math-content { padding: 0.2em 0; }
.math-content :deep(.katex) { color: var(--text); }
</style>