<script setup>
import { siteConfig } from '@/config/site'
</script>

<template>
  <footer class="footer">
    <div class="footer-inner">
      <span>&copy; {{ siteConfig.copyrightYear }} {{ siteConfig.name }} &middot; Vue 3 驱动</span>
    </div>
  </footer>
</template>

<style scoped>
.footer {
    border-top: 1px solid var(--border-light);
    padding: var(--space-6) var(--space-6);
    background: var(--bg-soft);
    position: relative;
}

.footer::before {
    content: "";
    position: absolute;
    top: -1px;
    left: 50%;
    transform: translateX(-50%);
    width: 48px;
    height: 2px;
    background: var(--accent);
    border-radius: 0 0 1px 1px;
    opacity: 0.4;
}

.footer-inner {
    max-width: var(--content-width);
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-4);
    flex-wrap: wrap;
    color: var(--text-muted);
    font-size: var(--text-sm);
}

.footer a {
    color: var(--text-muted);
    text-decoration: none;
    font-weight: 500;
    transition: color var(--duration-fast) var(--ease-out);
}
.footer a:hover { color: var(--accent); }

@media (max-width: 768px) {
    .footer-inner {
        flex-direction: column;
        text-align: center;
        gap: var(--space-2);
    }
}
</style>