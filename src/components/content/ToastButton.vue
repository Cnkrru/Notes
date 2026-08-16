<script setup lang="ts">
import { showToast } from '@/utils/toast'

const props = defineProps<{ type: string; text: string }>()

const typeMap: Record<string, 'success' | 'error' | 'warning' | 'info'> = {
  success: 'success', error: 'error', warning: 'warning', info: 'info'
}

function trigger() {
  showToast(props.text, typeMap[props.type] || 'info')
}
</script>

<template>
  <button class="toast-btn" :class="'toast-btn-' + type" @click="trigger">{{ text }}</button>
</template>

<style scoped>
.toast-btn {
  display: inline-flex;
  align-items: center;
  padding: 6px 18px;
  margin: 4px 6px 4px 0;
  border-radius: var(--radius);
  border: 1px solid;
  font-size: var(--text-sm);
  font-weight: 500;
  cursor: pointer;
  background: transparent;
  transition: all 0.2s ease;
}
.toast-btn:hover { transform: translateY(-1px); box-shadow: var(--shadow-md); }
.toast-btn:active { transform: translateY(0); }

.toast-btn-info { color: var(--accent); border-color: color-mix(in srgb, var(--accent) 40%, transparent); }
.toast-btn-info:hover { background: var(--accent-soft); border-color: var(--accent); }
.toast-btn-success { color: #42b883; border-color: color-mix(in srgb, #42b883 40%, transparent); }
.toast-btn-success:hover { background: rgba(66, 184, 131, 0.12); border-color: #42b883; }
.toast-btn-warning { color: #e6a23c; border-color: color-mix(in srgb, #e6a23c 40%, transparent); }
.toast-btn-warning:hover { background: rgba(230, 162, 60, 0.12); border-color: #e6a23c; }
.toast-btn-error { color: #f56c6c; border-color: color-mix(in srgb, #f56c6c 40%, transparent); }
.toast-btn-error:hover { background: rgba(245, 108, 108, 0.12); border-color: #f56c6c; }
</style>