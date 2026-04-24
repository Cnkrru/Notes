# cnkrru'Obsidian

个人知识管理系统，记录学习和工作中积累的各种知识和经验，构建完整的技术知识体系。

## 技术栈

- [VitePress](https://vitepress.dev/) - 静态站点生成器
- Vue 3 - 前端框架

## 项目结构

```
obsidian/
├── docs/              # 文档内容
│   ├── index.md       # 首页
│   ├── docs/          # 文档目录
│   │   ├── backend/   # 后端开发
│   │   ├── frontend/  # 前端开发
│   │   ├── hardware/  # 硬件开发
│   │   ├── data/      # 数据处理
│   │   ├── 电气/       # 电气相关知识
│   │   ├── other/     # 其他知识
│   │   └── code/      # 特效代码
│   └── .vitepress/    # VitePress 配置
├── package.json       # 项目配置
├── README.md         # 项目说明
└── SKILL.md          # 技能标准
```

## 知识分类

### 后端开发
- Python
- C 语言
- JavaScript
- Shell
- 正则表达式
- 算法
- 力扣
- AJAX

### 前端开发
- HTML
- CSS
- JavaScript (DOM)

### 硬件开发
- OpenMV
- STM32

### 数据处理
- 各种数据格式和序列化方法

### 电气
- 数字电路

### 其他
- 博客开发笔记
- 电脑硬件知识
- PS完全教程

### 代码
- 樱花特效
- 雪花特效

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run docs:dev
```

访问 http://localhost:5174/ (端口可能会自动调整)

### 构建生产版本

```bash
npm run docs:build
```

构建输出到 `dist` 目录

### 预览构建结果

```bash
npm run docs:preview
```

## 许可证

MIT License

## 作者

cnkrru
