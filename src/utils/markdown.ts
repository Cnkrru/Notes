/**
 * Markdown 解析工具
 */
import { marked } from 'marked'

/**
 * 预处理 admonition 提示块（::: tip/warning/danger）
 */
export async function processAdmonitions(md: string): Promise<string> {
  if (!md) return md
  if (!/^:::\s*\w+/m.test(md)) return md

  const blocks: { type: string; raw: string }[] = []

  const result = md.replace(
    /^:::\s*(\w+)\s*\n([\s\S]*?)\n:::$/gm,
    (_, rawType, content) => {
      blocks.push({ type: rawType.toLowerCase(), raw: content.trim() })
      return `\n<!--ADMONITION-${blocks.length - 1}-->\n`
    }
  )

  let html = result
  for (let i = blocks.length - 1; i >= 0; i--) {
    const block = blocks[i]
    const innerHtml = await marked.parse(block.raw)
    const admonitionHtml = `<div class="admonition admonition-${block.type}">${innerHtml.trim()}</div>`
    html = html.replace(`<!--ADMONITION-${i}-->`, admonitionHtml)
  }

  return html
}

/**
 * 生成标题的 slug ID（兼容中文和特殊字符）
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fff\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '') || 'heading'
}

/**
 * 为标题添加 ID 和锚点链接（供块级渲染复用）
 * 传入 sharedIds 可跨调用去重（同一文档内标题 ID 唯一），未传则在单次调用内去重
 */
export function addHeadingAnchors(html: string, sharedIds?: Set<string>): string {
  if (!html) return ''
  const used = sharedIds || new Set<string>()
  return html.replace(
    /<h([1-6])([^>]*)>(.*?)<\/h[1-6]>/g,
    (_, level, attrs, text) => {
      const cleanText = text.replace(/<[^>]+>/g, '').trim()
      let id = ''
      const idMatch = attrs.match(/\sid="([^"]+)"/)
      if (idMatch) {
        id = idMatch[1]
      } else {
        id = slugify(cleanText)
      }
      // 若 ID 已被占用，追加递增后缀，保证锚点与 TOC key 唯一
      if (used.has(id)) {
        let n = 2
        while (used.has(`${id}-${n}`)) n++
        id = `${id}-${n}`
      }
      used.add(id)
      return `<h${level} id="${id}"><a class="anchor" href="#${id}" aria-hidden="true">#</a>${cleanText}</h${level}>`
    }
  )
}