export interface DocMeta {
  id: string
  title: string
  description?: string
  tags?: string[]
  date?: string
  category?: string
  path: string
}

export interface DocTreeNode {
  name: string
  type: 'folder' | 'doc'
  path: string
  children?: DocTreeNode[]
  meta?: DocMeta
  open?: boolean
}

export interface TocItem {
  id: string
  text: string
  level: number
}