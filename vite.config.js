import { createSite } from 'cvdocs'

// cvdocs 唯一入口：渲染核心（路由/页面/状态/主题/文档树）全部在 cvdocs 包内，
// 本站点只保留 docs 与这份配置。改配置即改站，无需触碰包内代码。
// theme 选填：缺省用内置主题；传路径（相对项目根）即切换整套 runtime（App/路由/页面/样式）。
export default createSite({
  name: 'Notes',
  description: '个人技术笔记',
  slogan: '个人技术笔记知识库，记录编程学习与工程实践。',
  themeStorageKey: 'notes-theme',
  copyrightYear: 2026,
  // 文件夹注册与页面类型绑定：dir=挂载目录
  docRoots: [{ dir: 'docs', mode: 'Doc.vue' }],
  // 左侧边栏目录：只扫描展示这些目录的文档树（未列入的目录不显示侧边栏）
  sidebarDirs: ['docs'],
  // 顶部导航：留空用默认（主页 / 文档）
  nav: []
})