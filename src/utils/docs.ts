import type { DocMeta, DocTreeNode, TocItem } from '@/types'

/**
 * 扫描 docs 目录下的所有 markdown 文件，构建文档树
 */
const docModules = import.meta.glob<{ default: string }>('/docs/**/*.md', { eager: true, query: '?raw' })

export interface DocItem {
  id: string
  title: string
  description?: string
  tags?: string[]
  date?: string
  category?: string
  path: string
  rawContent: string
  markdownContent: string
}

let cachedDocs: DocItem[] | null = null
let cachedTree: DocTreeNode[] | null = null

/**
 * 解析文件路径中的 category 信息
 */
function getCategoryFromPath(filePath: string): string {
  const parts = filePath.replace(/\\/g, '/').replace('/docs/', '').split('/')
  parts.pop() // 去掉文件名
  return parts.join(' > ')
}

/**
 * 从路径中提取 ID
 */
function getIdFromPath(filePath: string): string {
  const normalized = filePath.replace(/\\/g, '/')
  const name = normalized.replace('/docs/', '').replace(/\.md$/, '')
  return name
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

    // 解析 frontmatter（兼容 CRLF 和 LF）
    const frontmatterMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\s*/)
    let frontmatter: Record<string, any> = {}
    let markdownContent = raw

    if (frontmatterMatch) {
      const fmText = frontmatterMatch[1]
      markdownContent = raw.slice(frontmatterMatch[0].length)
      for (const line of fmText.split('\n')) {
        const trimmed = line.trim()
        if (!trimmed || trimmed.startsWith('#')) continue
        const m = trimmed.match(/^\s*([^:]+):\s*(.+)$/)
        if (m) {
          frontmatter[m[1].trim()] = m[2].trim().replace(/["']/g, '')
        }
      }
    }

    docs.push({
      id,
      title: frontmatter.title || id.split('/').pop() || id,
      description: frontmatter.description || frontmatter.desc || '',
      tags: (() => {
        const raw = frontmatter.tags || frontmatter.tag
        if (!raw) return []
        if (typeof raw === 'string') {
          // 支持 [CSS, 选择器] 和 CSS, 选择器 两种格式
          const cleaned = raw.replace(/^\[|\]$/g, '')
          return cleaned.split(',').map((t: string) => t.trim().replace(/["']/g, '')).filter(Boolean)
        }
        return raw
      })(),
      date: frontmatter.date || frontmatter.update || '',
      category: getCategoryFromPath(filePath),
      path: filePath.replace(/\\/g, '/'),
      rawContent: raw,
      markdownContent
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
            description: doc.description,
            tags: doc.tags,
            date: doc.date,
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

  // 排序：文件夹在前，文档在后，按名称排序
  function sortTree(nodes: DocTreeNode[]) {
    nodes.sort((a, b) => {
      if (a.type !== b.type) return a.type === 'folder' ? -1 : 1
      return a.name.localeCompare(b.name, 'zh-CN')
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

    // 标签匹配（权重中等）
    if (doc.tags?.some(t => t.toLowerCase().includes(q))) {
      const matchedTags = doc.tags.filter(t => t.toLowerCase().includes(q))
      matches.push(...matchedTags)
      score += 50 * matchedTags.length
    }

    // 描述匹配
    if (doc.description?.toLowerCase().includes(q)) {
      matches.push(doc.description)
      score += 20
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