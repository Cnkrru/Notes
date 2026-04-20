---
title: "CSS 水平与竖直居中方式"
description: "CSS 水平与竖直居中的实现方法，包括flex布局、transform定位、margin负值等。"
date: 2026-04-21
tags: [CSS, 居中]
sidebar: auto
---

#CSS

======================================================
## 1. 水平垂直居中实现方法

### 1.1 flex布局

```css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

### 1.2 transform定位

```css
.element {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

======================================================
## 2. 水平居中方法

### 2.1 margin负值

```css
.element {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 300px;
  height: 200px;
  margin-top: -100px; /* 高度的一半 */
  margin-left: -150px; /* 宽度的一半 */
}
```

======================================================
## 3. 垂直对齐方式

### 3.1 vertical-align属性

- **适用场景**：行内元素和表格单元格

- **实现方法**：
  ```css
  .element {
    vertical-align: middle; /* 与父元素中部对齐 */
  }
  ```

### 3.2 line-height

- **适用场景**：单行文本

- **实现方法**：
  ```css
  .container {
    height: 50px;
    line-height: 50px; /* 与容器高度相同 */
  }
  ```

======================================================
