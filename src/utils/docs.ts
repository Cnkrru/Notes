import type { DocMeta, DocTreeNode, TocItem } from '@/types'

/**
 * 扫描 docs 目录下的所有 markdown 文件，构建文档树
 * 使用相对路径 glob（避免 Windows 上绝对路径盘符大小写导致的解析错误）
 */
const docModules = import.meta.glob<{ default: string }>('../../docs/**/*.md', { eager: true, query: '?raw' })

export interface DocItem {
  id: string
  title: string
  path: string
  markdownContent: string
}

let cachedDocs: DocItem[] | null = null
let cachedTree: DocTreeNode[] | null = null

/**
 * 将 glob 返回的路径统一为 /docs/xxx 形式（兼容相对/绝对前缀）
 */
function normalizeDocPath(filePath: string): string {
  const normalized = filePath.replace(/\\/g, '/')
  const idx = normalized.indexOf('/docs/')
  return idx >= 0 ? normalized.slice(idx) : normalized
}

/**
 * 从路径中提取 ID
 */
function getIdFromPath(filePath: string): string {
  return normalizeDocPath(filePath).replace('/docs/', '').replace(/\.md$/, '')
}

/**
 * 获取所有文档
 */
export function getAllDocs(): DocItem[] {
  if (cachedDocs) return cachedDocs

  const docs: DocItem[] = []

  for (const [filePath, module] of Object.entries(docModules)) {
    const raw = module.default
    const id = getIdFromPath(filePath)
    const title = id.split('/').pop() || id

    docs.push({
      id,
      title,
      path: normalizeDocPath(filePath),
      markdownContent: raw
    })
  }

  cachedDocs = docs
  return docs
}

/**
 * 根据 ID 获取文档
 */
export function getDocById(id: string): DocItem | undefined {
  const docs = getAllDocs()
  return docs.find(doc => doc.id === id)
}

/**
 * 中文数字 → 阿拉伯数字（支持 一~九、十、百、千、万及组合，如 十二、二十三、二百零五）
 * 纯中文数字序列才转换，否则返回 null 视为文本
 */
function chineseToNumber(s: string): number | null {
  if (!/^[〇零一二三四五六七八九十百千万]+$/.test(s)) return null
  const digit: Record<string, number> = {
    零: 0, 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9
  }
  let total = 0
  let num = 0
  for (const ch of s) {
    if (digit[ch] !== undefined) {
      num = digit[ch]
    } else if (ch === '十') {
      total += (num === 0 ? 1 : num) * 10; num = 0
    } else if (ch === '百') {
      total += (num === 0 ? 1 : num) * 100; num = 0
    } else if (ch === '千') {
      total += (num === 0 ? 1 : num) * 1000; num = 0
    } else if (ch === '万') {
      total += (num === 0 ? 1 : num) * 10000; num = 0
    }
  }
  total += num
  return total
}

/** 把字符串拆成 token 序列，数字块（阿拉伯/中文）附数值，其余为文本块 */
function tokenize(s: string): { text: string; num: number | null }[] {
  const tokens: { text: string; num: number | null }[] = []
  const re = /\d+|[〇零一二三四五六七八九十百千万]+/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(s)) !== null) {
    if (m.index > last) tokens.push({ text: s.slice(last, m.index), num: null })
    const raw = m[0]
    const num = /^\d+$/.test(raw) ? parseInt(raw, 10) : chineseToNumber(raw)
    tokens.push({ text: raw, num })
    last = m.index + raw.length
  }
  if (last < s.length) tokens.push({ text: s.slice(last), num: null })
  return tokens
}

/**
 * 自然排序比较：数字块按数值比较，文本块按字典序比较
 * 解决「第十章」排在「第二章」之后、而非「第五章」之后的问题
 */
function naturalCompare(a: string, b: string): number {
  const ta = tokenize(a)
  const tb = tokenize(b)
  const n = Math.min(ta.length, tb.length)
  for (let i = 0; i < n; i++) {
    const x = ta[i]
    const y = tb[i]
    if (x.num !== null && y.num !== null) {
      if (x.num !== y.num) return x.num - y.num
    } else if (x.num !== y.num) {
      // 数字块排在文本块之前
      return x.num !== null ? -1 : 1
    } else {
      // 都是文本块
      const c = x.text.localeCompare(y.text, 'zh-CN')
      if (c !== 0) return c
    }
  }
  return ta.length - tb.length
}

/**
 * 构建文档树
 */
export function buildDocTree(): DocTreeNode[] {
  if (cachedTree) return cachedTree

  const docs = getAllDocs()
  const tree: DocTreeNode[] = []

  for (const doc of docs) {
    const parts = doc.id.split('/')
    let current = tree

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]
      const isLast = i === parts.length - 1

      if (isLast) {
        current.push({
          name: doc.title,
          type: 'doc',
          path: `/doc/${doc.id}`,
          meta: {
            id: doc.id,
            title: doc.title,
            path: doc.path
          }
        })
      } else {
        let folder = current.find(n => n.name === part && n.type === 'folder')
        if (!folder) {
          folder = {
            name: part,
            type: 'folder',
            path: '',
            children: [],
            open: false
          }
          current.push(folder)
        }
        if (!folder.children) folder.children = []
        current = folder.children
      }
    }
  }

  // 排序：文件夹在前，文档在后，按名称自然排序（数字按数值大小，而非逐位比较）
  function sortTree(nodes: DocTreeNode[]) {
    nodes.sort((a, b) => {
      if (a.type !== b.type) return a.type === 'folder' ? -1 : 1
      return naturalCompare(a.name, b.name)
    })
    for (const node of nodes) {
      if (node.children) sortTree(node.children)
    }
  }
  sortTree(tree)

  cachedTree = tree
  return tree
}

/**
 * 生成内容的 TOC
 */
export function generateToc(markdownContent: string): TocItem[] {
  const toc: TocItem[] = []
  const headingRegex = /^#{1,4}\s+(.+)$/gm
  let match

  while ((match = headingRegex.exec(markdownContent)) !== null) {
    const level = match[0].trim().split(' ')[0].length
    const text = match[1].trim()
    const id = text
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fff\s-]/g, '')
      .replace(/\s+/g, '-')
    toc.push({ id, text, level })
  }

  return toc
}

/**
 * 搜索文档
 */
/**
 * 将文档树展平为有序列表（用于上一篇/下一篇导航）
 */
export function flattenTree(tree?: DocTreeNode[]): { label: string; path: string }[] {
  const nodes = tree || buildDocTree()
  const result: { label: string; path: string }[] = []
  for (const node of nodes) {
    if (node.type === 'doc') {
      result.push({ label: node.name, path: node.path })
    } else if (node.type === 'folder' && node.children) {
      result.push(...flattenTree(node.children))
    }
  }
  return result
}

export function searchDocs(query: string): { doc: DocItem; matches: string[] }[] {
  if (!query.trim()) return []
  const q = query.toLowerCase()
  const scored: { doc: DocItem; matches: string[]; score: number }[] = []

  for (const doc of getAllDocs()) {
    const matches: string[] = []
    let score = 0

    // 标题匹配（权重最高）
    if (doc.title.toLowerCase().includes(q)) {
      matches.push(doc.title)
      score += 100
    }

    // 内容匹配（权重最低）
    if (doc.markdownContent.toLowerCase().includes(q)) {
      const lines = doc.markdownContent.split('\n')
      let found = 0
      for (const line of lines) {
        if (line.toLowerCase().includes(q) && line.trim()) {
          matches.push(line.trim().substring(0, 80))
          found++
        }
        if (found >= 2) break
      }
      score += 10 * found
    }

    if (matches.length > 0) {
      scored.push({ doc, matches, score })
    }
  }

  // 按权重降序排列
  scored.sort((a, b) => b.score - a.score)

  return scored.map(({ doc, matches }) => ({ doc, matches }))
}