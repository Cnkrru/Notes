<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { subscribeToast, initToast, type ToastItem } from '@/utils/toast'

const toasts = ref<ToastItem[]>([])
let unsubscribe: (() => void) | null = null

onMounted(() => {
  initToast()
  unsubscribe = subscribeToast((list) => {
    toasts.value = [...list]
  })
})

onUnmounted(() => {
  unsubscribe?.()
})
</script>

<template>
  <Teleport to="body">
    <div class="toast-host" aria-live="polite">
      <TransitionGroup name="toast">
        <div v-for="t in toasts" :key="t.id" class="toast" :class="['toast-' + t.type, { leaving: t.leaving }]">
          <span class="toast-icon">{{ t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : t.type === 'warning' ? '!' : 'i' }}</span>
          <span class="toast-text">{{ t.text }}</span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-host {
  position: fixed;
  top: calc(var(--topbar-height) + var(--space-4));
  right: var(--space-6);
  z-index: 6000;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  pointer-events: none;
  max-width: min(320px, 80vw);
}
.toast {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius);
  background: var(--bg-card);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-lg);
  font-size: var(--text-sm);
  color: var(--text);
  pointer-events: auto;
}
.toast-icon {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
}
.toast-success .toast-icon { background: #42b883; }
.toast-error .toast-icon { background: #f56c6c; }
.toast-warning .toast-icon { background: #e6a23c; }
.toast-info .toast-icon { background: var(--accent); }

.toast-enter-active, .toast-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.toast-enter-from { opacity: 0; transform: translateX(20px); }
.toast-leave-to { opacity: 0; transform: translateX(20px); }

@media (max-width: 768px) {
  .toast-host {
    right: var(--space-4);
    left: var(--space-4);
    max-width: none;
  }
}
</style>