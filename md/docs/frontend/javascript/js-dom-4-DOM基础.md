---
title: "JavaScript DOM基础"

description: "JavaScript DOM基础相关知识，包括DOM的作用和分类、DOM树、DOM对象等。"

date: "2026-04-21"

tags: [JavaScript, DOM, 基础]

sidebar: auto

---


#JavaScript

---
## 1. 作用和分类

- **作用**：就是使用 JS 去操作 html 和浏览器

- **分类**：
  - DOM (Document Object Model，文档对象模型)
  - BOM (Browser Object Model，浏览器对象模型)

- **JavaScript 的组成**：
  - ECMAScript：JavaScript 语言基础
  - Web APIs：
    - DOM：页面文档对象模型
    - BOM：浏览器对象模型

---
## 2. 什么是 DOM

- **DOM (Document Object Model)**：是用来呈现以及与任意 HTML 或 XML 文档交互的 API

- **白话文**：DOM 是浏览器提供的一套专门用来操作网页内容的功能

- **DOM 作用**：
  - 开发网页内容特效
  - 实现用户交互

---
## 3. DOM 树

- **DOM 树是什么**：
  - 将 HTML 文档以树状结构直观的表现出来，我们称之为文档树或 DOM 树
  - 描述网页内容关系的名词
  - **作用**：文档树直观的体现了标签与标签之间的关系

- **DOM 树结构示例**：
  - Document
    - html
      - head
        - meta
        - title
        - link
      - body
        - div
        - p
        - img
        - button

---
## 4. DOM 对象

- **DOM 对象**：浏览器根据 html 标签生成的 JS 对象
  - 所有的标签属性都可以在这个对象上面找到
  - 修改这个对象的属性会自动映射到标签身上

- **DOM 的核心思想**：
  - 把网页内容当做对象来处理

- **document 对象**：
  - 是 DOM 里提供的一个对象
  - 所以它提供的属性和方法都是用来访问和操作网页内容的
  - 例：document.write()
  - 网页所有内容都在 document 里面

---

