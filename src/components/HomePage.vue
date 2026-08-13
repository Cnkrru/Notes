<script setup lang="ts">
</script>

<template>
  <div class="main-content" style="max-width: 1360px; margin: 0 auto; width: 100%; padding: 0 var(--space-6);">
    <section class="hero">
      <h1>Notes</h1>
      <p class="hero-sub">个人技术笔记知识库，记录编程学习与工程实践。</p>
      <div class="hero-actions">
        <router-link class="btn btn-primary" to="/doc/index">快速开始</router-link>
      </div>
    </section>

    
  </div>
</template>

<style scoped>
.hero {
    position: relative;
    padding: var(--space-20) var(--space-6) var(--space-12);
    text-align: center;
    overflow: hidden;
}

/* 水墨光晕 */
.hero::before {
    content: "";
    position: absolute;
    top: -40px;
    left: 50%;
    transform: translateX(-50%);
    width: 600px;
    height: 320px;
    z-index: -1;
    pointer-events: none;
    background:
        radial-gradient(ellipse 400px 160px at 30% 50%, var(--accent-soft), transparent 60%),
        radial-gradient(ellipse 300px 140px at 70% 60%, rgba(120, 100, 70, 0.04), transparent 60%);
    animation: inkDrift 14s ease-in-out infinite alternate;
}

@keyframes inkDrift {
    0%   { transform: translateX(-50%) translateY(0) scale(1); opacity: 0.8; }
    100% { transform: translateX(-50%) translateY(-8px) scale(1.04); opacity: 1; }
}

.hero h1 {
    margin: 0 0 0.3em;
    font-size: 3.2em;
    font-weight: 750;
    letter-spacing: -0.03em;
    font-family: var(--font-serif);
    color: var(--text);
    animation: fadeInUp 0.5s var(--ease-out);
    position: relative;
    display: inline-block;
}

/* 标题下方朱砂装饰线 */
.hero h1::after {
    content: "";
    display: block;
    width: 48px;
    height: 3px;
    background: var(--accent);
    border-radius: 2px;
    margin: 0.35em auto 0;
    opacity: 0.5;
}

.hero-sub {
    margin: var(--space-6) auto 0;
    max-width: 520px;
    color: var(--text-muted);
    font-size: var(--text-lg);
    line-height: 1.6;
    font-family: var(--font-serif);
    animation: fadeInUp 0.5s 0.08s var(--ease-out) both;
}

.hero-actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--space-3);
    margin-top: var(--space-8);
    animation: fadeInUp 0.5s 0.16s var(--ease-out) both;
}

/* 装饰性水墨笔触 */
.hero::after {
    content: " ";
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--accent), transparent);
    opacity: 0.15;
}

@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
    .hero {
        padding: var(--space-12) var(--space-4) var(--space-8);
    }
    .hero h1 { font-size: 2.4em; }
    .hero::before { width: 100%; height: 240px; }
}
</style>