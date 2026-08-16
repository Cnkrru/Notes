<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { marked } from 'marked'
import { processAdmonitions, addHeadingAnchors } from '@/utils/markdown'
import { normalizeLang } from '@/utils/prism'
import MermaidRender from './MermaidRender.vue'
import KatexRender from './KatexRender.vue'
import CodeBlock from './CodeBlock.vue'
import JsonView from './JsonView.vue'
import YamlView from './YamlView.vue'
import TomlView from './TomlView.vue'
import CsvTable from './CsvTable.vue'
import ToastButton from './ToastButton.vue'

const props = defineProps<{ content: string }>()

const emit = defineEmits<{ 'ready': [html: string] }>()

interface Block {
  type: 'markdown' | 'mermaid' | 'math' | 'code' | 'toast'
  content: string
  language?: string
  toastType?: string
}

const blocks = ref<Block[]>([])

marked.setOptions({ breaks: true, gfm: true })

/* ===== 计算代码围栏范围，避免 $$ 数学误匹配代码块内 ===== */
function codeFenceRanges(content: string): Array<[number, number]> {
  const ranges: Array<[number, number]> = []
  const regex = /```/g
  let m
  while ((m = regex.exec(content)) !== null) {
    const start = m.index
    const next = content.indexOf('```', start + 3)
    if (next === -1) break
    ranges.push([start, next + 3])
    regex.lastIndex = next + 3
  }
  return ranges
}

function isInsideRanges(index: number, ranges: Array<[number, number]>): boolean {
  return ranges.some(([s, e]) => index >= s && index <= e)
}

/* ===== 提取特殊块并保持顺序 ===== */
function extractBlocks(content: string): Block[] {
  const fences = codeFenceRanges(content)
  const out: Block[] = []
  let lastIndex = 0

  const patterns: Array<{ type: Block['type']; regex: RegExp }> = [
    { type: 'mermaid', regex: /```mermaid[\s\S]*?```/gim },
    { type: 'math', regex: /\$\$([\s\S]*?)\$\$/gim },
    { type: 'code', regex: /```([\s\S]*?)```/gim },
    { type: 'toast', regex: /<msg:(info|success|warning|error)>([\s\S]*?)<\/msg:(info|success|warning|error)>/gim }
  ]

  const all: Array<{ type: Block['type']; match: RegExpExecArray; index: number }> = []
  patterns.forEach(({ type, regex }) => {
    let m
    while ((m = regex.exec(content)) !== null) {
      // 数学块跳过代码围栏内的匹配
      if (type === 'math' && isInsideRanges(m.index, fences)) continue
      all.push({ type, match: m, index: m.index })
    }
  })

  all.sort((a, b) => a.index - b.index)

  for (const { type, match, index } of all) {
    if (index > lastIndex) {
      const md = content.substring(lastIndex, index)
      if (md.trim()) out.push({ type: 'markdown', content: md })
    }

    if (type === 'mermaid') {
      const code = match[0].replace(/^```mermaid\s*/i, '').replace(/```$/i, '').trim()
      out.push({ type: 'mermaid', content: code })
    } else if (type === 'math') {
      out.push({ type: 'math', content: match[1].trim() })
    } else if (type === 'code') {
      const code = match[1]
      const lines = code.split('\n')
      const rawLang = lines[0].trim() || 'plaintext'
      const codeContent = lines.slice(1).join('\n').replace(/\n+$/, '')
      if (normalizeLang(rawLang) !== 'mermaid') {
        out.push({ type: 'code', content: codeContent, language: normalizeLang(rawLang) })
      }
    } else if (type === 'toast') {
      out.push({ type: 'toast', content: match[2].trim(), toastType: (match[1] || 'info').toLowerCase() })
    }

    lastIndex = index + match[0].length
  }

  if (lastIndex < content.length) {
    const md = content.substring(lastIndex)
    if (md.trim()) out.push({ type: 'markdown', content: md })
  }

  return out
}

/* ===== 渲染 markdown 块 ===== */
async function renderMarkdownBlock(md: string, usedIds: Set<string>): Promise<string> {
  const asAdmonitions = await processAdmonitions(md)
  const rawHtml = await marked.parse(asAdmonitions)
  return addHeadingAnchors(rawHtml, usedIds)
}

async function render() {
  const rawBlocks = extractBlocks(props.content)
  const rendered: Block[] = []
  let headingHtml = ''
  const usedIds = new Set<string>()  // 同一文档内跨块去重标题 ID
  for (const b of rawBlocks) {
    if (b.type === 'markdown') {
      const html = await renderMarkdownBlock(b.content, usedIds)
      headingHtml += html
      rendered.push({ ...b, content: html })
    } else {
      rendered.push(b)
    }
  }
  blocks.value = rendered

  await nextTick()
  setupImages()
  setupAnchorIntercept()
  emit('ready', headingHtml)
}

/* ===== 图片灯箱 ===== */
const showLightbox = ref(false)
const lightboxImages = ref<{ src: string; title: string }[]>([])
const currentImageIndex = ref(0)
const imageHandlers = new WeakMap<Element, () => void>()

function setupImages() {
  const imgs = document.querySelectorAll('.markdown-render .markdown-content img')
  const data: { src: string; title: string }[] = []
  imgs.forEach((img, i) => {
    const src = img.getAttribute('src') || ''
    const alt = img.getAttribute('alt') || ''
    data.push({ src, title: alt })
    img.setAttribute('style', 'cursor:pointer')
    const old = imageHandlers.get(img)
    if (old) img.removeEventListener('click', old)
    const handler = () => openLightbox(i)
    imageHandlers.set(img, handler)
    img.addEventListener('click', handler)
  })
  lightboxImages.value = data
}

function openLightbox(i: number) {
  currentImageIndex.value = i
  showLightbox.value = true
  document.body.style.overflow = 'hidden'
}

function closeLightbox() {
  showLightbox.value = false
  document.body.style.overflow = ''
}

function prevImage() { if (currentImageIndex.value > 0) currentImageIndex.value-- }
function nextImage() { if (currentImageIndex.value < lightboxImages.value.length - 1) currentImageIndex.value++ }

function onKeydown(e: KeyboardEvent) {
  if (!showLightbox.value) return
  if (e.key === 'Escape') closeLightbox()
  if (e.key === 'ArrowLeft') prevImage()
  if (e.key === 'ArrowRight') nextImage()
}

/* ===== 锚点平滑滚动 ===== */
let interceptContainers: Element[] = []
function setupAnchorIntercept() {
  const containers = document.querySelectorAll('.markdown-render .markdown-content')
  containers.forEach((c) => {
    if (!interceptContainers.includes(c)) {
      c.addEventListener('click', handleAnchorClick)
      interceptContainers.push(c)
    }
  })
}

function handleAnchorClick(e: Event) {
  const target = e.target as HTMLElement
  const anchor = target.closest('a[href^="#"]')
  if (!anchor) return
  const href = anchor.getAttribute('href')
  if (!href || href === '#') return
  const el = document.getElementById(href.slice(1))
  if (!el) return
  e.preventDefault()
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

onMounted(() => {
  render()
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
  interceptContainers.forEach((c) => c.removeEventListener('click', handleAnchorClick))
  interceptContainers = []
})

watch(() => props.content, () => render())
</script>

<template>
  <div class="markdown-render">
    <div v-for="(block, i) in blocks" :key="i" class="block-item">
      <MermaidRender v-if="block.type === 'mermaid'" :code="block.content" />
      <KatexRender v-else-if="block.type === 'math'" :latex="block.content" />
      <JsonView v-else-if="block.type === 'code' && block.language === 'json'" :code="block.content" />
      <YamlView v-else-if="block.type === 'code' && (block.language === 'yaml' || block.language === 'yml')" :code="block.content" />
      <TomlView v-else-if="block.type === 'code' && block.language === 'toml'" :code="block.content" />
      <CsvTable v-else-if="block.type === 'code' && block.language === 'csv'" :code="block.content" />
      <CodeBlock v-else-if="block.type === 'code'" :code="block.content" :language="block.language" />
      <ToastButton v-else-if="block.type === 'toast'" :type="block.toastType || 'info'" :text="block.content" />
      <div v-else class="markdown-content" v-html="block.content"></div>
    </div>

    <Teleport to="body">
      <div v-if="showLightbox" class="lightbox-overlay" @click="closeLightbox" tabindex="-1">
        <button class="lightbox-close" @click="closeLightbox" aria-label="关闭">✕</button>
        <div class="lightbox-counter" v-if="lightboxImages.length > 1">
          {{ currentImageIndex + 1 }} / {{ lightboxImages.length }}
        </div>
        <button v-if="currentImageIndex > 0" class="lightbox-nav lightbox-prev" @click.stop="prevImage" aria-label="上一张">‹</button>
        <div class="lightbox-image-area" @click.stop>
          <img :src="lightboxImages[currentImageIndex].src" :alt="lightboxImages[currentImageIndex].title" class="lightbox-img">
          <div class="lightbox-title" v-if="lightboxImages[currentImageIndex].title">{{ lightboxImages[currentImageIndex].title }}</div>
        </div>
        <button v-if="currentImageIndex < lightboxImages.length - 1" class="lightbox-nav lightbox-next" @click.stop="nextImage" aria-label="下一张">›</button>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.markdown-render :deep(.markdown-content) { min-width: 0; }
.block-item { min-width: 0; }
.lightbox-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  display: flex; align-items: center; justify-content: center;
  z-index: 4000;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(6px);
  outline: none;
}
.lightbox-close {
  position: fixed; top: 20px; right: 20px;
  width: 40px; height: 40px; border-radius: 50%;
  border: none; cursor: pointer;
  background: rgba(255, 255, 255, 0.15); color: #fff;
  font-size: 18px;
  transition: background 0.2s, transform 0.2s;
}
.lightbox-close:hover { background: rgba(255, 255, 255, 0.3); transform: scale(1.1); }
.lightbox-counter {
  position: fixed; top: 24px; left: 50%; transform: translateX(-50%);
  padding: 4px 14px; border-radius: 20px;
  background: rgba(0, 0, 0, 0.5); color: #fff;
  font-size: 12px; font-weight: 600;
  pointer-events: none;
}
.lightbox-image-area {
  display: flex; flex-direction: column; align-items: center;
  max-width: 90vw; max-height: 85vh; gap: 12px;
}
.lightbox-img { max-width: 90vw; max-height: 80vh; object-fit: contain; border-radius: 8px; box-shadow: 0 4px 30px rgba(0,0,0,0.3); }
.lightbox-title { color: rgba(255,255,255,0.85); font-size: 13px; text-align: center; max-width: 80vw; }
.lightbox-nav {
  position: fixed; top: 50%; transform: translateY(-50%);
  width: 48px; height: 48px; border-radius: 50%;
  border: none; cursor: pointer;
  background: rgba(255, 255, 255, 0.15); color: #fff;
  font-size: 26px; line-height: 1;
  transition: background 0.2s;
}
.lightbox-nav:hover { background: rgba(255, 255, 255, 0.3); }
.lightbox-prev { left: 20px; }
.lightbox-next { right: 20px; }
</style>