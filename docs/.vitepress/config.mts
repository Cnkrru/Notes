import { defineConfig } from 'vitepress'
import { loadSidebar } from './utils/loadSidebar'

export default defineConfig({
  // 站点head基础配置
  lang: 'zh-CN',
  title: "Cnkrru'notes",
  description: "个人知识库",
  // 禁用死链检查
  ignoreDeadLinks: true,
  // 构建输出目录
  outDir: '../dist',
  
  // 主题配置
  themeConfig: {
    
    // logo以及标题
    logo: '/logo.png',
    siteTitle: 'Cnkrru\'notes',

    // 页眉导航栏
    nav: [
      { text: '首页', link: '/' },
      { text: '文档', link: '/docs/' },
    ],

    // 侧边栏导航栏（从 JSON 配置文件加载）
    sidebar: loadSidebar(),

    // 侧边栏位置
    aside: 'right',

    // 侧边栏大纲
    outline: 2,

    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com' }
    ],

    // 页脚信息
    footer: {
      message: '基于 VitePress 构建的个人知识库站点',
      copyright: '© 2026 cnkrru 的知识库'
    },

    // 编辑链接
    editLink: {
      pattern: 'https://github.com/vuejs/vitepress/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },

    // 最后更新时间
    lastUpdated: {
      text: 'Updated at',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    },

    // Algolia 搜索配置
    algolia: {
      appId: '2NC7P3JOKB',
      apiKey: '4424be6326cbc51cbb348a6daf08dd1e',
      indexName: 'notes',
      placeholder: 'Search',
      translations: {
        button: {
          buttonText: '搜索',
          buttonAriaLabel: '搜索'
        },
        modal: {
          searchBox: {
            resetButtonTitle: '清除查询',
            resetButtonAriaLabel: '清除查询',
            cancelButtonText: '取消',
            cancelButtonAriaLabel: '取消'
          },
          startScreen: {
            recentSearchesTitle: '最近搜索',
            noRecentSearchesText: '没有最近搜索',
            saveRecentSearchButtonTitle: '保存搜索',
            removeRecentSearchButtonTitle: '从历史中删除',
            favoriteSearchesTitle: '收藏',
            removeFavoriteSearchButtonTitle: '从收藏中删除'
          },
          errorScreen: {
            titleText: '无法获取结果',
            helpText: '你可能需要检查你的网络连接'
          },
          footer: {
            selectText: '选择',
            selectKeyAriaLabel: '回车键',
            navigateText: '导航',
            navigateUpKeyAriaLabel: '上箭头',
            navigateDownKeyAriaLabel: '下箭头',
            closeText: '关闭',
            closeKeyAriaLabel: 'Esc键',
            searchByText: '搜索提供'
          },
          noResultsScreen: {
            noResultsText: '没有找到相关结果',
            suggestedQueryText: '你可以尝试查询',
            reportMissingResultsText: '你认为这个查询应该有结果吗？',
            reportMissingResultsLinkText: '点击反馈'
          }
        }
      },
      searchParameters: {
        facetFilters: ['tags:cnkrru']
      }
    },

    // Carbon Ads广告配置
    // carbonAds: {
    //   code: 'your-carbon-code',
    //   placement: 'your-carbon-placement'
    // },

    // 文档页脚信息
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    darkModeSwitchLabel: '切换到深色模式',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    sidebarMenuLabel: '侧边栏菜单',
    returnToTopLabel: '返回顶部',
    langMenuLabel: '语言',
    externalLinkIcon: true
  }
})
