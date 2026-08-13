## 1. 作用和分类

| 项目 | 内容 |
|------|------|
| 作用 | 就是使用 JS 去操作 html 和浏览器 |
| 分类 | DOM (Document Object Model，文档对象模型)；BOM (Browser Object Model，浏览器对象模型) |
| JavaScript 组成 | ECMAScript：JavaScript 语言基础；Web APIs：DOM（页面文档对象模型），BOM（浏览器对象模型） |

---

## 2. 什么是 DOM

| 项目 | 内容 |
|------|------|
| DOM 定义 | 是用来呈现以及与任意 HTML 或 XML 文档交互的 API |
| DOM 作用 | 开发网页内容特效；实现用户交互 |

---

## 3. DOM 树

| 项目 | 内容 |
|------|------|
| DOM 树 | 将 HTML 文档以树状结构直观的表现出来，我们称之为文档树或 DOM 树，描述网页内容关系的名词 |
| 作用 | 文档树直观的体现了标签与标签之间的关系 |
| 结构示例 | 见下方树结构 |

```text
Document
└── html
    ├── head
    │   ├── meta
    │   ├── title
    │   └── link
    └── body
        ├── div
        ├── p
        ├── img
        └── button
```

---

## 4. DOM 对象

| 项目 | 内容 |
|------|------|
| DOM 对象 | 浏览器根据 html 标签生成的 JS 对象，所有的标签属性都可以在这个对象上面找到，修改这个对象的属性会自动映射到标签身上 |
| DOM 核心思想 | 把网页内容当做对象来处理 |
| document 对象 | DOM 里提供的一个对象，提供的属性和方法都是用来访问和操作网页内容的，例：document.write() |

---

> 没那么多事，就是document，每个页面都可以当作一个画布，文档，CSS和HTML来写文档，画画，JS做交互