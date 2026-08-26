<script setup>
</script>

<template>
  <div class="not-found">
    <div class="not-found-inner">
      <div class="not-found-code">404</div>
      <h1 class="not-found-title">页面未找到</h1>
      <p class="not-found-desc">你访问的页面不存在，可能已被移除或输入了错误的链接。</p>
      <div class="not-found-actions">
        <router-link class="btn btn-primary" to="/">返回首页</router-link>
        <button class="btn btn-secondary" @click="$router.back()">返回上页</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.not-found {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    padding: var(--space-8) var(--space-6);
}

.not-found-inner {
    text-align: center;
    max-width: 420px;
}

.not-found-code {
    font-size: 6em;
    font-weight: 800;
    line-height: 1;
    font-family: var(--font-serif);
    color: var(--accent);
    opacity: 0.35;
    letter-spacing: -0.04em;
    margin-bottom: var(--space-2);
    animation: notFoundFade 0.6s var(--ease-out);
}

.not-found-title {
    margin: 0 0 var(--space-3);
    font-size: var(--text-2xl);
    font-weight: 650;
    font-family: var(--font-serif);
    color: var(--text);
    animation: notFoundFade 0.6s 0.1s var(--ease-out) both;
}

.not-found-desc {
    margin: 0 0 var(--space-8);
    color: var(--text-muted);
    font-size: var(--text-base);
    line-height: 1.6;
    animation: notFoundFade 0.6s 0.2s var(--ease-out) both;
}

.not-found-actions {
    display: flex;
    justify-content: center;
    gap: var(--space-3);
    flex-wrap: wrap;
    animation: notFoundFade 0.6s 0.3s var(--ease-out) both;
}

@keyframes notFoundFade {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
    .not-found-code {
        font-size: 4em;
    }
    .not-found {
        min-height: 50vh;
        padding: var(--space-6) var(--space-4);
    }
}
</style>