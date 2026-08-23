<script setup lang="ts">
import { ref, computed } from 'vue'
import CodeCopy from '@/components/content/CodeCopy.vue'

const props = defineProps<{ code: string }>()

const viewMode = ref<'preview' | 'source'>('preview')

function parseCsv(raw: string): { header: string[]; body: string[][]; rows: number; cols: number } {
  const lines = raw.trim().split(/\r?\n/).filter(l => l.trim() !== '')
  if (lines.length === 0) return { header: [], body: [], rows: 0, cols: 0 }

  const result: string[][] = []
  for (const line of lines) {
    const row: string[] = []
    let cell = ''
    let inQuotes = false
    for (let i = 0; i < line.length; i++) {
      const ch = line[i]
      if (inQuotes) {
        if (ch === '"') {
          if (i + 1 < line.length && line[i + 1] === '"') { cell += '"'; i++ }
          else inQuotes = false
        } else cell += ch
      } else {
        if (ch === '"') inQuotes = true
        else if (ch === ',') { row.push(cell.trim()); cell = '' }
        else cell += ch
      }
    }
    row.push(cell.trim())
    result.push(row)
  }

  if (result.length === 0) return { header: [], body: [], rows: 0, cols: 0 }
  const cols = result[0].length
  const hasHeader = result.length > 1
  return {
    header: hasHeader ? result[0] : [],
    body: hasHeader ? result.slice(1) : result,
    rows: result.length,
    cols
  }
}

const parsed = computed(() => parseCsv(props.code))
const header = computed(() => parsed.value.header)
const body = computed(() => parsed.value.body)
const rows = computed(() => parsed.value.rows)
const cols = computed(() => parsed.value.cols)
const hasHeader = computed(() => header.value.length > 0)
</script>

<template>
  <div class="struct-view csv-view">
    <div class="sv-header">
      <span class="sv-badge csv">CSV</span>
      <div class="sv-actions">
        <CodeCopy :code="code" />
        <button class="sv-toggle" :class="{ active: viewMode === 'source' }" @click="viewMode = 'source'">源码</button>
        <button class="sv-toggle" :class="{ active: viewMode === 'preview' }" @click="viewMode = 'preview'">预览</button>
        <span class="sv-stats">{{ rows }} 行 × {{ cols }} 列</span>
      </div>
    </div>
    <div v-if="viewMode === 'preview'" class="csv-table-scroll">
      <table class="csv-table">
        <thead v-if="hasHeader">
          <tr><th v-for="(col, ci) in header" :key="'h' + ci">{{ col }}</th></tr>
        </thead>
        <tbody>
          <tr v-for="(row, ri) in body" :key="'r' + ri">
            <td v-for="(cell, ci) in row" :key="'c' + ri + '-' + ci">{{ cell }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <pre v-else class="sv-source"><code>{{ code }}</code></pre>
  </div>
</template>

<style scoped src="@/assets/css/structured.css"></style>

<style scoped>
.csv-table-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
.csv-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9em;
  line-height: 1.6;
  color: var(--text);
}
.csv-table th {
  padding: 10px 14px;
  text-align: left;
  font-weight: 600;
  border-bottom: 2px solid var(--accent);
  color: var(--accent);
  background: var(--bg-soft);
  white-space: nowrap;
}
.csv-table td {
  padding: 8px 14px;
  border-bottom: 1px solid var(--border-light);
}
.csv-table tbody tr:nth-child(even) { background: var(--bg-soft); }
.csv-table tbody tr:hover { background: var(--accent-soft); }
</style>