<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount, computed } from 'vue'
import CodeCopy from '@/components/content/CodeCopy.vue'
import Prism, { ensureLanguageLoaded, ensurePrismLoaded, normalizeLang } from '@/utils/prism'

const props = defineProps<{ code: string; language?: string }>()

const codeRef = ref<HTMLElement | null>(null)
const loaded = ref(false)
const collapsed = ref(true)
const highlightedLine = ref(0)
let highlightTimer: number | null = null

const lang = computed(() => normalizeLang(props.language))
const lineCount = computed(() => props.code.split('\n').length)
const isCollapsible = computed(() => lineCount.value > 15)
const lineNumbers = computed(() => Array.from({ length: lineCount.value }, (_, i) => i + 1))

function highlightLine(n: number) {
  highlightedLine.value = n
}

const LANG_BADGE_CLASS: Record<string, string> = {
  javascript: 'js', js: 'js', typescript: 'ts', ts: 'ts', python: 'py',
  html: 'html', css: 'css', bash: 'bash', shell: 'bash', sh: 'bash',
  json: 'json', sql: 'sql', vue: 'vue', yaml: 'yaml', toml: 'toml', php: 'php'
}

async function highlight() {
  if (!codeRef.value) return
  try {
    await ensurePrismLoaded()
    await ensureLanguageLoaded(lang.value)
    if (Prism.highlightElement) {
      Prism.highlightElement(codeRef.value)
    }
  } catch {
    // 高亮失败不阻塞显示
  } finally {
    loaded.value = true
  }
}

function scheduleHighlight() {
  if (highlightTimer) window.clearTimeout(highlightTimer)
  highlightTimer = window.setTimeout(() => {
    highlight()
  }, 50)
}

onMounted(() => scheduleHighlight())
onBeforeUnmount(() => {
  if (highlightTimer) window.clearTimeout(highlightTimer)
})
watch(() => [props.code, props.language], () => scheduleHighlight())
</script>

<template>
  <div class="code-container with-line-numbers">
    <div class="code-header">
      <span class="lang-badge" :class="LANG_BADGE_CLASS[lang]">
        <span class="lang-dot"></span>
        <span class="lang-text">{{ lang }}</span>
      </span>
      <div class="header-actions">
        <span class="line-count" v-if="isCollapsible">{{ lineCount }} 行</span>
        <CodeCopy :code="code" />
      </div>
    </div>
    <div class="code-content-wrapper" :class="{ collapsed: isCollapsible && collapsed }">
      <!-- 行号列 -->
      <div class="line-numbers">
        <span v-for="line in lineNumbers" :key="line" class="line-number">{{ line }}</span>
      </div>
      <pre class="code-pre"><code ref="codeRef" :class="'language-' + lang">{{ code }}</code></pre>
      <!-- hover 行高亮 overlay -->
      <div class="line-highlight-overlay">
        <div
          v-for="line in lineNumbers"
          :key="line"
          class="line-highlight-row"
          :class="{ active: highlightedLine === line }"
          @mouseenter="highlightLine(line)"
          @mouseleave="highlightLine(0)"
        ></div>
      </div>
      <div v-if="isCollapsible && collapsed" class="fold-overlay" @click="collapsed = false">
        <div class="fold-gradient"></div>
        <button class="fold-btn">展开全部 ({{ lineCount }} 行)</button>
      </div>
      <button v-else-if="isCollapsible && !collapsed" class="fold-toggle" @click="collapsed = true">收起</button>
    </div>
  </div>
</template>

<style scoped>
.code-container {
  position: relative;
  margin: 1.4em 0;
  border-radius: var(--radius);
  overflow: hidden;
  border: 1px solid var(--code-border);
  background: var(--code-bg);
  box-shadow: var(--shadow-sm);
}
.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 12px;
  background: color-mix(in srgb, var(--code-bg) 88%, var(--bg));
  border-bottom: 1px solid var(--code-border);
}
.header-actions { display: flex; align-items: center; gap: 8px; }
.lang-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 2px 10px;
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  font-weight: 600;
  text-transform: lowercase;
  color: var(--code-text);
  opacity: 0.9;
}
.lang-dot { width: 8px; height: 8px; border-radius: 50%; background: currentColor; opacity: 0.6; }
.lang-text { letter-spacing: 0.3px; }
.lang-badge.js { background: #f0db4f; color: #1e1e2e; }
.lang-badge.ts { background: #3178c6; color: #fff; }
.lang-badge.py { background: #3776ab; color: #fff; }
.lang-badge.html { background: #e34f26; color: #fff; }
.lang-badge.css { background: #563d7c; color: #fff; }
.lang-badge.bash { background: #4eaa25; color: #fff; }
.lang-badge.json { background: #b8b8b8; color: #1e1e2e; }
.lang-badge.sql { background: #00618b; color: #fff; }
.lang-badge.vue { background: #41b883; color: #1e1e2e; }
.lang-badge.yaml { background: #6b5b95; color: #fff; }
.lang-badge.toml { background: #4479a1; color: #fff; }
.lang-badge.php { background: #787cb5; color: #fff; }

.line-count {
  font-size: 10px;
  font-weight: 500;
  padding: 2px 6px;
  border-radius: var(--radius-xs);
  color: var(--code-text);
  opacity: 0.5;
  background: color-mix(in srgb, var(--code-text) 10%, transparent);
}

.code-content-wrapper { position: relative; display: flex; }
.code-content-wrapper.collapsed { max-height: 220px; overflow: hidden; }

/* 行号列 */
.line-numbers {
  flex-shrink: 0;
  padding: 1em 8px;
  text-align: right;
  user-select: none;
  background: color-mix(in srgb, var(--code-bg) 60%, var(--bg));
  border-right: 1px solid var(--code-border);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  line-height: 1.65;
  color: var(--code-text);
  opacity: 0.7;
}
.line-number {
  display: block;
  transition: opacity 0.2s ease;
}
.line-number:hover { opacity: 1; }

.code-pre {
  flex: 1;
  margin: 0;
  padding: 1em 1.2em;
  overflow-x: auto;
  background: var(--code-bg);
  color: var(--code-text);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  line-height: 1.65;
}
.code-pre :deep(code) {
  background: none;
  color: inherit;
  padding: 0;
  font-family: inherit;
  font-size: 1em;
}
/* 覆盖 Prism 默认主题的浅色适配样式：
   1. text-shadow: 0 1px white（白色文字阴影，深色背景上产生重影）
   2. .token.operator/.entity/.url 的 background: rgba(255,255,255,0.5)（深色背景上形成浅色矩形块）
   这些都为浅色代码背景设计，深色代码块下需清除 */
.code-pre :deep(code),
.code-pre :deep(.token) {
  text-shadow: none !important;
  background: transparent !important;
}

/* hover 行高亮 overlay */
.line-highlight-overlay {
  position: absolute;
  left: 0; right: 0; top: 0; bottom: 0;
  pointer-events: none;
  padding: 1em 0;
  font-size: var(--text-sm); /* 与代码行高保持一致的基准 */
}
.line-highlight-row {
  height: 1.65em;
  pointer-events: auto;
  cursor: default;
  transition: background-color 0.15s ease;
}
.line-highlight-row:hover,
.line-highlight-row.active {
  background: color-mix(in srgb, var(--code-accent, var(--code-text)) 12%, transparent);
}

.fold-overlay {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 100px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 12px;
  cursor: pointer;
  z-index: 5;
}
.fold-gradient {
  position: absolute;
  bottom: 0; left: 0; right: 0; height: 100%;
  background: linear-gradient(transparent, color-mix(in srgb, var(--code-bg) 85%, transparent) 40%, var(--code-bg) 100%);
  pointer-events: none;
}
.fold-btn {
  position: relative;
  z-index: 1;
  padding: 6px 16px;
  border: 1px solid var(--code-border);
  border-radius: var(--radius-sm);
  background: color-mix(in srgb, var(--code-bg) 70%, var(--bg-card));
  color: var(--code-text);
  font-size: var(--text-xs);
  font-weight: 600;
  cursor: pointer;
  transition: transform var(--duration-fast) var(--ease-out);
}
.fold-btn:hover { transform: translateY(-1px); }
.fold-toggle {
  position: absolute;
  bottom: 8px; right: 12px;
  padding: 2px 10px;
  border: 1px solid var(--code-border);
  border-radius: var(--radius-xs);
  background: color-mix(in srgb, var(--code-bg) 70%, var(--bg-card));
  color: var(--code-text);
  font-size: 10px;
  font-weight: 500;
  cursor: pointer;
  opacity: 0.6;
  z-index: 5;
}
.fold-toggle:hover { opacity: 1; }
</style>