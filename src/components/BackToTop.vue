<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const visible = ref(false)

function onScroll() {
  visible.value = window.scrollY > 300
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <button
    class="back-top"
    :class="{ visible }"
    @click="scrollToTop"
    v-show="visible"
    aria-label="返回顶部"
  >
    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
  </button>
</template>

<style scoped>
.back-top {
    position: fixed;
    right: var(--space-6);
    bottom: var(--space-6);
    z-index: 90;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border: 1px solid var(--border);
    background: var(--bg-card);
    color: var(--text-muted);
    border-radius: 4px;
    cursor: pointer;
    box-shadow: var(--shadow-sm);
    transition: background var(--duration-fast) var(--ease-out),
                color var(--duration-fast) var(--ease-out),
                border-color var(--duration-fast) var(--ease-out),
                box-shadow var(--duration-fast) var(--ease-out),
                transform var(--duration-fast) var(--ease-out),
                opacity var(--duration-normal) var(--ease-out);
}
.back-top:hover {
    background: var(--bg-soft);
    border-color: var(--accent);
    color: var(--accent);
    box-shadow: var(--glow);
    transform: translateY(-2px);
}
.back-top:active {
    transform: translateY(0);
}

.back-top .icon {
    display: block;
    width: 16px;
    height: 16px;
    transition: transform var(--duration-fast) var(--ease-out);
}
.back-top:hover .icon {
    transform: translateY(-1px);
}

@media (max-width: 768px) {
    .back-top {
        right: var(--space-4);
        bottom: var(--space-4);
        width: 36px;
        height: 36px;
    }
}
</style>