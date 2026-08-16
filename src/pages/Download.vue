<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface DownloadItem {
  title: string
  url: string
  size?: string
  type?: string
  desc?: string
}

interface DownloadManifest {
  items: DownloadItem[]
}

const manifest = ref<DownloadManifest>({ items: [] })
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const res = await fetch('/download.json', { cache: 'no-cache' })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    manifest.value = await res.json()
  } catch {
    error.value = '无法加载 download.json，请确认 public/download.json 存在'
  } finally {
    loading.value = false
  }
})

function fileType(item: DownloadItem): string {
  if (item.type) return item.type
  const m = item.url.match(/\.([a-z0-9]+)(?:\?.*)?$/i)
  return m ? m[1].toUpperCase() : '文件'
}
</script>

<template>
  <div class="download-page">
    <header class="dl-header">
      <h1>资源下载</h1>
      <p class="dl-sub">本页资源清单由 <code>public/download.json</code> 维护。</p>
    </header>

    <div v-if="loading" class="dl-state">加载中…</div>
    <div v-else-if="error" class="dl-state dl-error">{{ error }}</div>
    <div v-else-if="!manifest.items || manifest.items.length === 0" class="dl-state">
      暂无资源。请在 <code>public/download.json</code> 中添加 items。
    </div>
    <ul v-else class="dl-list">
      <li v-for="(item, idx) in manifest.items" :key="idx" class="dl-item">
        <a class="dl-link" :href="item.url" :download="item.title || true">
          <span class="dl-type">{{ fileType(item) }}</span>
          <span class="dl-info">
            <span class="dl-name">{{ item.title || item.url }}</span>
            <span class="dl-meta">
              <template v-if="item.size">{{ item.size }}</template>
              <template v-if="item.size && item.desc"> · </template>
              <template v-if="item.desc">{{ item.desc }}</template>
            </span>
          </span>
          <svg class="dl-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        </a>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.download-page {
    max-width: 860px;
    margin: 0 auto;
    width: 100%;
    padding: var(--space-10) var(--space-6) var(--space-16);
}

.dl-header {
    margin-bottom: var(--space-8);
}
.dl-header h1 {
    margin: 0 0 0.3em;
    font-size: var(--text-2xl);
    font-weight: 750;
    font-family: var(--font-serif);
    color: var(--text);
}
.dl-sub {
    margin: 0;
    color: var(--text-muted);
    font-size: var(--text-sm);
}
.dl-sub code {
    color: var(--accent);
    background: var(--accent-soft);
    padding: 1px 6px;
    border-radius: var(--radius-sm);
    font-size: 0.85em;
}

.dl-state {
    padding: var(--space-12) var(--space-6);
    text-align: center;
    color: var(--text-muted);
    background: var(--bg-card);
    border: 1px dashed var(--border);
    border-radius: var(--radius);
    font-size: var(--text-sm);
}
.dl-state code {
    color: var(--accent);
    background: var(--accent-soft);
    padding: 1px 6px;
    border-radius: var(--radius-sm);
}
.dl-error { color: var(--danger, #c0392b); }

.dl-list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
}

.dl-link {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    padding: var(--space-4) var(--space-5);
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    text-decoration: none;
    color: var(--text);
    transition: border-color var(--duration-fast) var(--ease-out),
                box-shadow var(--duration-fast) var(--ease-out),
                transform var(--duration-fast) var(--ease-out);
}
.dl-link:hover {
    border-color: var(--accent);
    box-shadow: var(--glow);
    transform: translateY(-1px);
}

.dl-type {
    flex-shrink: 0;
    font-size: var(--text-xs);
    font-weight: 600;
    color: var(--accent);
    background: var(--accent-soft);
    padding: 3px 9px;
    border-radius: var(--radius-sm);
    letter-spacing: 0.02em;
}

.dl-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
}
.dl-name {
    font-size: var(--text-base);
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.dl-meta {
    font-size: var(--text-xs);
    color: var(--text-muted);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.dl-icon {
    flex-shrink: 0;
    width: 18px;
    height: 18px;
    color: var(--text-muted);
    transition: color var(--duration-fast) var(--ease-out),
                transform var(--duration-fast) var(--ease-out);
}
.dl-link:hover .dl-icon {
    color: var(--accent);
    transform: translateY(2px);
}

@media (max-width: 640px) {
    .download-page { padding: var(--space-8) var(--space-4) var(--space-12); }
}
</style>