---
title: "JavaScript BOM"
description: "JavaScript BOM（浏览器对象模型）相关知识。"
date: 2026-04-21
tags: [JavaScript, BOM]
sidebar: auto
---

#JavaScript

======================================================
## BOM 概述

| 项目 | 内容 |
|------|------|
| 定义 | BOM (Browser Object Model) 是浏览器对象模型 |
| 顶级对象 | window 对象是一个全局对象，也是 JavaScript 中的顶级对象 |
| 特性 1 | document、alert()、console.log() 这些都是 window 的属性 |
| 特性 2 | 所有通过 var 定义在全局作用域中的变量、函数都会变成 window 对象的属性和方法 |
| 特性 3 | window 对象下的属性和方法调用的时候可以省略 window |

======================================================
## BOM 结构

```
BOM (浏览器对象模型)
├── window (顶级对象)
│   ├── navigator (浏览器信息对象)
│   ├── location (地址栏对象)
│   ├── document (文档对象)
│   ├── history (历史记录对象)
│   └── screen (屏幕对象)
```

======================================================