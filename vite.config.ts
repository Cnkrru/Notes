import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { existsSync, readdirSync } from 'node:fs'
import { resolve, join } from 'node:path'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const docsRoot = resolve(__dirname, 'docs')

/** 递归收集 docs/ 下所有 .md，生成 SSG 预渲染路由清单 */
function collectDocRoutes(root: string, out: string[]): void {
  for (const ent of readdirSync(root, { withFileTypes: true })) {
    const full = join(root, ent.name)
    if (ent.isDirectory()) {
      collectDocRoutes(full, out)
    } else if (ent.isFile() && ent.name.endsWith('.md')) {
      const rel = full
        .replace(docsRoot, '')
        .replace(/\\/g, '/')
        .replace(/\.md$/, '')
        .replace(/^\//, '')
      out.push(`/doc/${rel}`)
    }
  }
}

function includedRoutes(): string[] {
  const routes: string[] = ['/']
  if (existsSync(docsRoot)) collectDocRoutes(docsRoot, routes)
  return routes
}

export default defineConfig({
  base: '/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    cssCodeSplit: true,
    minify: 'esbuild',
    sourcemap: false,
    chunkSizeWarningLimit: 1000
  },
  plugins: [vue()],
  // vite-ssg：构建期把每个路由预渲染成独立 HTML，首屏直接有内容、利于 SEO
  ssgOptions: {
    formatting: 'minify',
    script: 'async',
    includedRoutes
  }
})