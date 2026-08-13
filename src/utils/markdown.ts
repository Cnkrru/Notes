/**
 * Markdown 解析工具
 */
import { marked } from 'marked'

function parseYamlValue(value: string): any {
  const trimmed = value.trim()
  if (trimmed === '') return ''
  if (trimmed === 'true') return true
  if (trimmed === 'false') return false
  if (trimmed === 'null' || trimmed === '~') return null

  const numMatch = trimmed.match(/^-?\d+(\.\d+)?$/)
  if (numMatch) return parseFloat(trimmed)

  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    const content = trimmed.slice(1, -1)
    if (!content.trim()) return []
    return content.split(',').map(item => parseYamlValue(item.trim().replace(/["']/g, ''))).filter(item => item !== '')
  }

  const quoteMatch = trimmed.match(/^(["'])((?:\\.|[^\\])*)\1$/)
  if (quoteMatch) return quoteMatch[2].replace(/\\(["'])/g, '$1')

  return trimmed
}

export function parseFrontmatter(content: string): { frontmatter: Record<string, any>; content: string } {
  if (!content || typeof content !== 'string') {
    return { frontmatter: {}, content: '' }
  }

  const frontmatter: Record<string, any> = {}
  let markdown = content.trim()

  const frontmatterMatch = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\s*/)
  if (frontmatterMatch) {
    const frontmatterText = frontmatterMatch[1]
    markdown = markdown.slice(frontmatterMatch[0].length)

    for (const line of frontmatterText.split('\n')) {
      if (!line.trim() || line.trim().startsWith('#')) continue
      const match = line.trim().match(/^\s*([^:]+):\s*(.+)$/)
      if (match) {
        const key = match[1].trim()
        try {
          frontmatter[key] = parseYamlValue(match[2])
        } catch {
          frontmatter[key] = match[2].trim()
        }
      }
    }
  }

  return { frontmatter, content: markdown }
}

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
 * 渲染 Markdown 为 HTML（后处理）
 * 统一处理标题 ID、锚点链接、代码块
 */
export function renderMarkdown(md: string): string {
  if (!md) return ''
  let html = md

  // 为所有标题添加 ID 和锚点链接（处理有/无 id 两种情况）
  html = html.replace(
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
      return `<h${level} id="${id}"><a class="anchor" href="#${id}" onclick="navigator.clipboard.writeText(window.location.href.split('#')[0]+'#'+this.getAttribute('href').slice(1));return false" aria-hidden="true">#</a>${cleanText}</h${level}>`
    }
  )

  // 代码块处理
  html = html.replace(
    /<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g,
    (_, lang, code) => {
      const escapedCode = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
      return `<div class="code-block"><div class="code-header"><span class="code-lang">${lang}</span><button class="code-copy" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.textContent.replace(/\n+$/, ''))">复制</button></div><pre><code class="language-${lang}">${escapedCode}</code></pre></div>`
    }
  )
  html = html.replace(
    /<pre><code>([\s\S]*?)<\/code><\/pre>/g,
    (_, code) => {
      const escapedCode = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
      return `<div class="code-block"><div class="code-header"><span class="code-lang">CODE</span><button class="code-copy" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.textContent.replace(/\n+$/, ''))">复制</button></div><pre><code>${escapedCode}</code></pre></div>`
    }
  )
  return html
}