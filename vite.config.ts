import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { existsSync, readdirSync } from 'node:fs'
import { resolve, join } from 'node:path'
import { siteConfig } from './src/config/site.ts'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

/** 递归收集某根目录下所有 .md，生成 SSG 预渲染路由清单 */
function collectDocRoutes(root: string, prefix: string, out: string[]): void {
  for (const ent of readdirSync(root, { withFileTypes: true })) {
    const full = join(root, ent.name)
    if (ent.isDirectory()) {
      collectDocRoutes(full, prefix, out)
    } else if (ent.isFile() && ent.name.endsWith('.md')) {
      const rel = full
        .replace(root, '')
        .replace(/\\/g, '/')
        .replace(/\.md$/, '')
        .replace(/^\//, '')
      out.push(`${prefix}/${rel}`)
    }
  }
}

/** 按 siteConfig.docRoots 注册的目录收集预渲染路由 */
function includedRoutes(): string[] {
  const routes: string[] = ['/']
  for (const root of siteConfig.docRoots) {
    // 每个挂载目录的 index 页始终预渲染（博客列表等由页面自动生成，无需 index.md）
    routes.push(`/${root.dir}/index`)
    const dir = resolve(__dirname, root.dir)
    if (existsSync(dir)) collectDocRoutes(dir, `/${root.dir}`, routes)
  }
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
