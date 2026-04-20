---
title: "JavaScript 修改选择器属性"
description: "JavaScript 修改选择器属性的方法，包括通过classList操作类控制CSS、通过style属性操作CSS和操作类名(className)操作CSS。"
date: 2026-04-21
tags: [JavaScript, DOM, 选择器属性]
sidebar: auto
---

#JavaScript

======================================================
## 操作元素样式属性

| 方法 | 语法 | 描述 |
|------|------|--------|
| 通过classList操作类控制CSS | 元素.classList.add('类名')<br>元素.classList.remove('类名')<br>元素.classList.toggle('类名') | 通过添加、删除或切换类名来控制样式，不会覆盖原有类名 |
| 通过style属性操作CSS | 对象.style.样式属性 = 值 | 直接修改元素的行内样式 |
| 操作类名(className)操作CSS | 元素.className = '类名' | 通过修改类名来应用CSS样式，会覆盖原有类名 |

======================================================
## 示例代码

### 1. 通过classList操作类控制CSS示例（推荐）

```javascript
// HTML: <div class="box">内容</div>

// 获取元素
const box = document.querySelector('.box');

// 添加类名
box.classList.add('active');

// 移除类名
// box.classList.remove('active');

// 切换类名（点击时切换）
box.addEventListener('click', function() {
  box.classList.toggle('active');
});

// CSS:
// .box { width: 200px; height: 100px; }
// .active { background-color: lightgreen; border: 2px solid green; }
```

### 2. 通过style属性操作CSS示例（不推荐）

```javascript
// 获取元素
const box = document.querySelector('.box');

// 修改单个样式
box.style.width = '200px';
box.style.height = '100px';
box.style.backgroundColor = 'lightblue';
box.style.margin = '10px';
box.style.padding = '15px';
```

### 3. 操作类名(className)操作CSS示例（不推荐）

```javascript
// HTML: <div class="box">内容</div>

// 获取元素
const box = document.querySelector('.box');

// 替换类名
box.className = 'box active'; // 保留原有类名并添加新类名

// CSS:
// .box { width: 200px; height: 100px; }
// .active { background-color: lightgreen; border: 2px solid green; }
```

======================================================