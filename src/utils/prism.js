/**
 * Prism.js 代码高亮 — 本地化加载管理器
 * 核心 + 主题 CSS 随包打包；语言组件通过动态 import 按需加载（vite 拆成独立 chunk，不增大主包）
 * 完全本地运行，不依赖外部 CDN，避免跨域被浏览器拦截
 */
import Prism from 'prismjs'
import 'prismjs/themes/prism.min.css'

// 语言别名标准化（Prism 只认小写 + 特定命名）
const LANG_ALIAS = {
  js: 'javascript',
  ts: 'typescript',
  py: 'python',
  sh: 'bash',
  shell: 'bash',
  'c++': 'cpp',
  yml: 'yaml',
  cs: 'csharp',
  rb: 'ruby',
  md: 'markdown',
  xml: 'html',
  svg: 'html',
  // vue 不是 Prism 官方语言，模板本质是 HTML，映射到 markup/html 高亮
  vue: 'html'
}

export function normalizeLang(lang) {
  if (!lang) return 'plaintext'
  const lower = lang.toLowerCase()
  return LANG_ALIAS[lower] || lower
}

// Prism 核心自带语言（markup/html/css/javascript/clike），无需额外组件
const CORE_LANGS = new Set([
  'html', 'markup', 'css', 'clike', 'javascript', 'xml', 'svg', 'mathml'
])

// 常用语言 → 动态加载的组件模块（vite 自动按需拆包）
const LANG_MODULES = {
  python: () => import('prismjs/components/prism-python'),
  typescript: () => import('prismjs/components/prism-typescript'),
  json: () => import('prismjs/components/prism-json'),
  json5: () => import('prismjs/components/prism-json5'),
  bash: () => import('prismjs/components/prism-bash'),
  c: () => import('prismjs/components/prism-c'),
  cpp: () => import('prismjs/components/prism-cpp'),
  csharp: () => import('prismjs/components/prism-csharp'),
  cmake: () => import('prismjs/components/prism-cmake'),
  yaml: () => import('prismjs/components/prism-yaml'),
  toml: () => import('prismjs/components/prism-toml'),
  sql: () => import('prismjs/components/prism-sql'),
  markdown: () => import('prismjs/components/prism-markdown'),
  ruby: () => import('prismjs/components/prism-ruby'),
  java: () => import('prismjs/components/prism-java'),
  go: () => import('prismjs/components/prism-go'),
  rust: () => import('prismjs/components/prism-rust'),
  php: () => import('prismjs/components/prism-php'),
  docker: () => import('prismjs/components/prism-docker'),
  git: () => import('prismjs/components/prism-git'),
  ini: () => import('prismjs/components/prism-ini'),
  diff: () => import('prismjs/components/prism-diff'),
  regex: () => import('prismjs/components/prism-regex'),
  nginx: () => import('prismjs/components/prism-nginx')
}

const loadedLangs = new Set()
const loading = new Map()

export function isPrismLoaded() {
  return true // 核心已随包加载
}

/** 核心已本地打包，无需异步加载 */
export function ensurePrismLoaded() {
  return Promise.resolve()
}

/** 确保指定语言组件已加载 */
export function ensureLanguageLoaded(lang) {
  const normalized = normalizeLang(lang)
  if (normalized === 'plaintext') return Promise.resolve()
  if (CORE_LANGS.has(normalized) || Prism.languages[normalized] || loadedLangs.has(normalized)) {
    return Promise.resolve()
  }
  const loader = LANG_MODULES[normalized]
  if (!loader) return Promise.resolve()
  if (!loading.has(normalized)) {
    loading.set(
      normalized,
      loader()
        .then(() => { loadedLangs.add(normalized) })
        .catch(() => { /* 加载失败不阻塞渲染 */ })
    )
  }
  return loading.get(normalized)
}

export default Prism