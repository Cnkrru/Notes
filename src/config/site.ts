// 站点全局配置 —— 个人技术笔记站点
import type { NavItem } from '@/types'

export const siteConfig = {
  // 站点名称：用于顶栏品牌、首页标题、页脚版权
  name: 'Notes',
  // 站点描述：用于 <meta name="description"> 与搜索索引
  description: '个人技术笔记',
  // 首页主标语
  slogan: '个人技术笔记知识库，记录编程学习与工程实践。',
  // 主题持久化存储键（需与 index.html 内联脚本中的键保持一致）
  themeStorageKey: 'notes-theme',
  // 页脚版权起始年份
  copyrightYear: 2026,
  // 顶部导航：留空用默认（主页 / 文档）；可配置多级下拉、站内(`/…`)与外部(https://…)链接
  nav: [] as NavItem[]
}

/** 未配置 siteConfig.nav 时的兜底导航 */
export const defaultNav: NavItem[] = [
  { text: '主页', link: '/' },
  { text: '文档', link: '/doc/index' }
]