import { defineConfig } from 'vitepress'

export default defineConfig({
  // 站点head基础配置
  lang: 'zh-CN',
  title: "Cnkrru'Obsidian",
  description: "个人知识管理系统",
  // 禁用死链检查
  ignoreDeadLinks: true,
  // 构建输出目录
  outDir: '../dist',
  
  // 主题配置
  themeConfig: {
    
    // logo以及标题
    logo: '/logo.png',
    siteTitle: 'Cnkrru\'Obsidian',

    // 页眉导航栏
    nav: [
      { text: '首页', link: '/' },
      { text: '文档', link: '/docs/' },
    ],

    // 侧边栏导航栏
    sidebar: [
      { text: '首页', link: '/' },
      { text: '后端',
        collapsed: true,
        items: [
          { text: 'Python',
            collapsed: true,
            items: [
              { text: '基础知识', link: '/docs/backend/python/py-1-基础知识.md' },
              { text: '数据存储', link: '/docs/backend/python/py-2-数据存储.md' },
              { text: '数据操作', link: '/docs/backend/python/py-3-数据操作.md' },
              { text: '面向对象', link: '/docs/backend/python/py-4-面向对象.md' },
              { text: '文件操作', link: '/docs/backend/python/py-5-文件操作.md' },
              { text: 'OS', link: '/docs/backend/python/py-bag-1-OS.md' },
              { text: 'Sys', link: '/docs/backend/python/py-bag-2-Sys.md' },
              { text: 'Hashlib', link: '/docs/backend/python/py-bag-3-Hashlib.md' },
              { text: 'Math', link: '/docs/backend/python/py-bag-4-Math.md' },
              { text: 'Time-Datetime', link: '/docs/backend/python/py-bag-5-Time-Datetime.md' },
              { text: 'Logging', link: '/docs/backend/python/py-bag-6-Logging.md' },
              { text: 'Pillow', link: '/docs/backend/python/py-bag-7-Pillow.md' },
              { text: 'Re', link: '/docs/backend/python/py-bag-8-Re.md' },
              { text: 'Tqdm', link: '/docs/backend/python/py-bag-9-Tqdm.md' },
              { text: 'colorama', link: '/docs/backend/python/py-bag-10-colorama.md' },
              { text: 'office-csv', link: '/docs/backend/python/py-bag-11-office-csv.md' },
              { text: 'office-docx', link: '/docs/backend/python/py-bag-12-office-docx.md' },
              { text: 'office-excel', link: '/docs/backend/python/py-bag-13-office-excel.md' },
              { text: 'office-json', link: '/docs/backend/python/py-bag-14-office-json.md' },
              { text: 'office-pdf', link: '/docs/backend/python/py-bag-15-office-pdf.md' },
              { text: 'auto-keyboard', link: '/docs/backend/python/py-bag-16-auto-keyboard.md' },
              { text: 'auto-mouse', link: '/docs/backend/python/py-bag-17-auto-mouse.md' },
              { text: 'auto-shutil', link: '/docs/backend/python/py-bag-18-auto-shutil.md' },
              { text: 'auto-pyautogui', link: '/docs/backend/python/py-bag-19-auto-pyautogui.md' },
              { text: 'spider-requests', link: '/docs/backend/python/py-bag-20-spider-requests.md' },
              { text: 'spider-beautifulsoup4', link: '/docs/backend/python/py-bag-21-spider-beautifulsoup4.md' },
              { text: 'spider-selenium', link: '/docs/backend/python/py-bag-22-spider-selenium.md' }
            ]
          },
          { text: 'C语言',
            collapsed: true,
            items: [
              { text: '数据存储', link: '/docs/backend/C/c-1-数据存储.md' },
              { text: 'IO与流程控制', link: '/docs/backend/C/c-2-IO与流程控制.md' },
              { text: '函数与指针', link: '/docs/backend/C/c-3-函数与指针.md' },
              { text: '位运算', link: '/docs/backend/C/c-4-位运算.md' },
              { text: '文件操作', link: '/docs/backend/C/c-5-文件操作.md' },
              { text: '字符串操作', link: '/docs/backend/C/c-6-字符串操作.md' }
            ]
          },
          { text: 'JavaScript',
            collapsed: true,
            items: [
              { text: '数据存储', link: '/docs/backend/javascript/js-1-数据存储.md' },
              { text: '数据处理', link: '/docs/backend/javascript/js-2-数据处理.md' },
              { text: '作用域链', link: '/docs/backend/javascript/js-3-作用域链.md' },
              { text: '闭包', link: '/docs/backend/javascript/js-4-闭包.md' },
              { text: '变量or函数提升', link: '/docs/backend/javascript/js-5-变量or函数提升.md' },
              { text: '参数and展开运算符', link: '/docs/backend/javascript/js-6-参数and展开运算符.md' }
            ]
          }
        ]
      },
      { text: '前端',
        collapsed: true,
        items: [
          { text: 'HTML',
            collapsed: true,
            items: [
              { text: '文本-多媒体', link: '/docs/frontend/html/HTML-1-文本-多媒体.md' },
              { text: '列表-表格-表单', link: '/docs/frontend/html/HTML-2-列表-表格-表单.md' },
              { text: '路径', link: '/docs/frontend/html/HTML-3-路径.md' }
            ]
          },
          { text: 'CSS',
            collapsed: true,
            items: [
              { text: '选择器', link: '/docs/frontend/css/CSS-基础-1-选择器.md' },
              { text: '字体样式', link: '/docs/frontend/css/CSS-基础-2-字体样式.md' },
              { text: '盒子模型', link: '/docs/frontend/css/CSS-基础-3-盒子模型.md' },
              { text: '背景图设置', link: '/docs/frontend/css/CSS-基础-4-背景图设置.md' },
              { text: 'Flex', link: '/docs/frontend/css/CSS-基础-5-Flex.md' },
              { text: '盒子显示属性', link: '/docs/frontend/css/CSS-基础-6-盒子显示属性.md' },
              { text: '定位', link: '/docs/frontend/css/CSS-基础-7-定位.md' },
              { text: '水平-竖直居中方式', link: '/docs/frontend/css/CSS-基础-8-水平-竖直居中方式.md' },
              { text: 'CSS精灵', link: '/docs/frontend/css/CSS-基础-9-CSS精灵.md' },
              { text: '字体图标-fontAwesome', link: '/docs/frontend/css/CSS-基础-10-字体图标-fontAwesome.md' },
              { text: '过渡效果', link: '/docs/frontend/css/CSS-基础-11-过渡效果.md' },
              { text: '透明效果', link: '/docs/frontend/css/CSS-基础-12-透明效果.md' },
              { text: '鼠标光标属性', link: '/docs/frontend/css/CSS-基础-13-鼠标光标属性.md' },
              { text: 'Favicon实现', link: '/docs/frontend/css/CSS-基础-14-Favicon实现.md' },
              { text: 'SEO', link: '/docs/frontend/css/CSS-基础-15-SEO.md' },
              { text: 'transform-2D', link: '/docs/frontend/css/CSS-基础-16-transform-2D.md' },
              { text: 'transform-3D', link: '/docs/frontend/css/CSS-基础-17-transform-3D.md' },
              { text: '渐变', link: '/docs/frontend/css/CSS-基础-18-渐变.md' },
              { text: '动画', link: '/docs/frontend/css/CSS-基础-19-动画.md' },
              { text: '相对单位-rem与vm、vh', link: '/docs/frontend/css/CSS-基础-20-相对单位-rem与vm、vh.md' },
              { text: 'less', link: '/docs/frontend/css/CSS-基础-21-less.md' },
              { text: '多列', link: '/docs/frontend/css/CSS-基础-22-多列.md' },
              { text: 'CSS三大特性', link: '/docs/frontend/css/CSS-基础-23-CSS三大特性.md' },
              { text: '响应式设计', link: '/docs/frontend/css/CSS-基础-24-响应式设计.md' },
              { text: 'FontAwesome', link: '/docs/frontend/css/CSS-基础-25-FontAwesome.md' },
              { text: '双开门', link: '/docs/frontend/css/CSS-特效-1-双开门.md' },
              { text: '视频播放特效', link: '/docs/frontend/css/CSS-特效-2-视频播放特效.md' },
              { text: '线性渐变', link: '/docs/frontend/css/CSS-特效-3-线性渐变.md' },
              { text: '3D导航', link: '/docs/frontend/css/CSS-特效-4-3D导航.md' }
            ]
          },
          { text: 'JavaScript (DOM)',
            collapsed: true,
            items: [
              { text: 'BOM', link: '/docs/frontend/javascript/JS-DOM-1-BOM.md' },
              { text: 'GC机制', link: '/docs/frontend/javascript/JS-DOM-2-GC机制.md' },
              { text: 'js异步', link: '/docs/frontend/javascript/JS-DOM-3-js异步.md' },
              { text: 'DOM基础', link: '/docs/frontend/javascript/JS-DOM-4-DOM基础.md' },
              { text: '获取CSS选择器', link: '/docs/frontend/javascript/JS-DOM-5-获取CSS选择器.md' },
              { text: '修改标签文本', link: '/docs/frontend/javascript/JS-DOM-6-修改标签文本.md' },
              { text: '修改选择器属性', link: '/docs/frontend/javascript/JS-DOM-7-修改选择器属性.md' },
              { text: '修改表单属性', link: '/docs/frontend/javascript/JS-DOM-8-修改表单属性.md' },
              { text: '自定义属性', link: '/docs/frontend/javascript/JS-DOM-9-自定义属性.md' },
              { text: '定时器-loop or once', link: '/docs/frontend/javascript/JS-DOM-10-定时器-loop or once.md' },
              { text: '事件（键鼠监听）', link: '/docs/frontend/javascript/JS-DOM-11-事件（键鼠监听）.md' },
              { text: '事件（事件绑定）', link: '/docs/frontend/javascript/JS-DOM-12-事件（事件绑定）.md' },
              { text: '事件（加载-滚动-尺寸）', link: '/docs/frontend/javascript/JS-DOM-13-事件（加载-滚动-尺寸）.md' },
              { text: 'DOM增删查', link: '/docs/frontend/javascript/JS-DOM-14-DOM增删查.md' },
              { text: 'location对象', link: '/docs/frontend/javascript/JS-DOM-15-location对象.md' },
              { text: 'nvaigator对象', link: '/docs/frontend/javascript/JS-DOM-16-nvaigator对象.md' },
              { text: 'history对象', link: '/docs/frontend/javascript/JS-DOM-17-history对象.md' },
              { text: '本地存储', link: '/docs/frontend/javascript/JS-DOM-18-本地存储.md' },
              { text: 'this对象', link: '/docs/frontend/javascript/JS-DOM-19-this对象.md' }
            ]
          }
        ]
      },
      { text: '硬件',
        collapsed: true,
        items: [
          { text: 'OpenMV',
            collapsed: true,
            items: [
              { text: 'sensor', link: '/docs/hardware/openmv/openmv-1-sensor.md' },
              { text: 'img', link: '/docs/hardware/openmv/openmv-2-img.md' }
            ]
          },
          { text: 'STM32',
            collapsed: true,
            items: [
              { text: '工程复用', link: '/docs/hardware/stm32/stm32-1-工程复用.md' },
              { text: 'STM32F103C8T6外设资源', link: '/docs/hardware/stm32/stm32-2-STM32F103C8T6外设资源.md' },
              { text: 'GPIO', link: '/docs/hardware/stm32/stm32-3-GPIO.md' },
              { text: 'OLED 旋转编码器 舵机 电机', link: '/docs/hardware/stm32/stm32-4-OLED 旋转编码器 舵机 电机.md' },
              { text: '外部中断与EXTI', link: '/docs/hardware/stm32/stm32-5-外部中断与EXTI.md' },
              { text: 'TIM', link: '/docs/hardware/stm32/stm32-6-TIM.md' },
              { text: 'OC PWM', link: '/docs/hardware/stm32/stm32-7-OC PWM.md' },
              { text: 'IC PWM', link: '/docs/hardware/stm32/stm32-8-IC PWM.md' },
              { text: 'TIM编码器', link: '/docs/hardware/stm32/stm32-9-TIM编码器.md' },
              { text: 'ADC数模转换', link: '/docs/hardware/stm32/stm32-10-ADC数模转换.md' },
              { text: 'DMA', link: '/docs/hardware/stm32/stm32-11-DMA.md' },
              { text: '串口与USART', link: '/docs/hardware/stm32/stm32-12-串口与USART.md' },
              { text: 'I2C', link: '/docs/hardware/stm32/stm32-13-I2C.md' },
              { text: 'MPU6050', link: '/docs/hardware/stm32/stm32-14-MPU6050.md' },
              { text: 'SPI', link: '/docs/hardware/stm32/stm32-15-SPI.md' },
              { text: 'W25Q64', link: '/docs/hardware/stm32/stm32-16-W25Q64.md' },
              { text: '时间戳', link: '/docs/hardware/stm32/stm32-17-时间戳.md' },
              { text: 'BKP', link: '/docs/hardware/stm32/stm32-18-BKP.md' },
              { text: 'RTC', link: '/docs/hardware/stm32/stm32-19-RTC.md' },
              { text: 'PWR', link: '/docs/hardware/stm32/stm32-20-PWR.md' },
              { text: 'BKP与RTC与PWR', link: '/docs/hardware/stm32/stm32-21-BKP与RTC与PWR.md' },
              { text: '看门狗', link: '/docs/hardware/stm32/stm32-22-看门狗.md' },
              { text: 'Flash', link: '/docs/hardware/stm32/stm32-23-Flash.md' },
              { text: 'ST命名规则', link: '/docs/hardware/stm32/stm32-24-ST命名规则.md' }
            ]
          }
        ]
      },
      { text: '数据',
        collapsed: true,
        items: [
          { text: 'ASCII码表', link: '/docs/data/ds-1-ASCII码表.md' },
          { text: 'CSV', link: '/docs/data/ds-2-CSV.md' },
          { text: 'JSON', link: '/docs/data/ds-3-JSON.md' },
          { text: 'LOG', link: '/docs/data/ds-4-LOG.md' },
          { text: 'Markdown', link: '/docs/data/ds-5-Markdown.md' },
          { text: 'SQL', link: '/docs/data/ds-6-SQL.md' },
          { text: 'Toml', link: '/docs/data/ds-7-Toml.md' },
          { text: 'XML', link: '/docs/data/ds-8-XML.md' },
          { text: 'config', link: '/docs/data/ds-9-config.md' },
          { text: 'ini', link: '/docs/data/ds-10-ini.md' },
          { text: 'yaml', link: '/docs/data/ds-11-yaml.md' },
          { text: '常见文件类型', link: '/docs/data/ds-12-常见文件类型.md' }
        ]
      }
    ],

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
      appId: 'your-algolia-app-id',
      apiKey: 'your-algolia-api-key',
      indexName: 'your-algolia-index-name',
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
      prev: 'Pagina prior',
      next: 'Proxima pagina'
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
