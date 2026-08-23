export interface DocMeta {
  id: string
  title: string
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

/** 顶部导航项：可多层分组、站内或站外链接 */
export interface NavItem {
  /** 显示文本 */
  text: string
  /** 跳转地址：以 `/` 开头视为站内路由，完整 URL 视为外部链接 */
  link?: string
  /** 子菜单（配置后渲染为下拉分组） */
  items?: NavItem[]
}