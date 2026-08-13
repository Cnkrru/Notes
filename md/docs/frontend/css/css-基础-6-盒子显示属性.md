---
title: "CSS 盒子显示属性"

description: "CSS 盒子显示属性相关知识，包括显示模式和显示模式的转换。"

date: "2026-04-21"

tags: [CSS, 显示模式]

sidebar: auto

---


#CSS

---
## 1. 显示模式

### 1.1 常用的显示模式

- **block（块级元素）**
  - 独占一行，可设置宽高，可设置边距
  - 默认块级元素：div、p、h1-h6、ul、ol、li等

- **inline（行内元素）**
  - 不独占一行，不可设置宽高，水平边距有效
  - 默认行内元素：span、a、strong、em、i、b等

- **flex（弹性布局）**
  - 弹性容器，灵活布局
  - 适用于导航栏、卡片网格、居中对齐

---
### 1.2 显示模式的转换

- **转换为块级元素**：`display: block;`

- **转换为行内元素**：`display: inline;`

- **转换为弹性容器**：`display: flex;`

---