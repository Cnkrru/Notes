import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { existsSync, readdirSync } from 'node:fs'
import { resolve, join } from 'node:path'
import { siteConfig } from './src/config/site.js'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

/** 递归收集某根目录下所有 .md，生成 SSG 预渲染路由清单 */
function collectDocRoutes(root, prefix, out) {
  for (const ent of readdirSync(root, { withFileTypes: true })) {
    if (ent.isDirectory()) {
      // 递归时把子目录名累加进前缀，保留完整层级（否则多级目录会被压平丢失）
      collectDocRoutes(join(root, ent.name), `${prefix}/${ent.name}`, out)
    } else if (ent.isFile() && ent.name.endsWith('.md')) {
      // 前缀已含完整层级，这里只取文件名（去 .md 扩展），避免重复拼接目录
      out.push(`${prefix}/${ent.name.replace(/\.md$/, '')}`)
    }
  }
}

/** 按 siteConfig.docRoots 注册的目录收集预渲染路由 */
function includedRoutes() {
  const routes = ['/']
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