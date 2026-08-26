<script setup>
import { ref } from 'vue'
import { showToast } from '@/utils/toast'

const props = defineProps({
  code: { type: String, required: true }
})

const isCopied = ref(false)

async function copyCode() {
  try {
    await navigator.clipboard.writeText(props.code)
    isCopied.value = true
    showToast('代码已复制到剪贴板', 'success')
    setTimeout(() => { isCopied.value = false }, 2000)
  } catch {
    // 降级方案
    const ta = document.createElement('textarea')
    ta.value = props.code
    ta.style.cssText = 'position:fixed;left:-9999px;top:-9999px'
    document.body.appendChild(ta)
    ta.select()
    try {
      document.execCommand('copy')
      showToast('代码已复制到剪贴板', 'success')
    } catch {
      showToast('复制失败', 'error')
    }
    document.body.removeChild(ta)
  }
}
</script>

<template>
  <button class="copy-button" :class="{ copied: isCopied }" @click="copyCode" title="复制代码">
    <span class="copy-icon">{{ isCopied ? '✓' : '⎘' }}</span>
    <span class="copy-text">{{ isCopied ? '已复制' : '复制' }}</span>
  </button>
</template>

<style scoped>
.copy-button {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: 3px 10px;
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  font-weight: 500;
  cursor: pointer;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-muted);
  transition: background-color var(--duration-fast) var(--ease-out),
              color var(--duration-fast) var(--ease-out),
              border-color var(--duration-fast) var(--ease-out);
}
.copy-button:hover {
  background: var(--accent-soft);
  border-color: var(--accent);
  color: var(--accent);
}
.copy-button:focus-visible {
  outline: none;
  box-shadow: var(--glow);
  border-color: var(--accent);
}
.copy-button.copied {
  background: #42b883;
  border-color: #42b883;
  color: #fff;
}
.copy-icon { font-size: 13px; line-height: 1; }
.copy-text { font-size: var(--text-xs); }
</style>