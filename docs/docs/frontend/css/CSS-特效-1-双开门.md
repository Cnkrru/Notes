---
title: "CSS 双开门特效"
description: "CSS 双开门特效的实现方法，包括核心实现步骤、HTML结构、CSS样式和实现原理。"
date: 2026-04-21
tags: [CSS, 特效, 双开门]
sidebar: auto
---

#CSS特效

======================================================
## 1. 核心实现步骤

- **创建容器结构**：外层容器作为透视空间，内层容器作为门的父元素

- **添加透视效果**：为外层容器添加perspective属性

- **设置3D空间**：为门的父元素添加transform-style: preserve-3d

- **创建门元素**：左右两个门，分别设置不同的旋转方向

- **添加过渡效果**：为门元素添加transition属性实现平滑动画

======================================================
## 2. HTML结构

```html
<div class="container">
  <div class="door-frame">
    <div class="door left"></div>
    <div class="door right"></div>
  </div>
</div>
```

======================================================
## 3. CSS样式

```css
/* 外层容器 - 添加透视效果 */
.container {
  perspective: 1000px;
  width: 400px;
  height: 300px;
  margin: 50px auto;
}

/* 门的父元素 - 保持3D空间 */
.door-frame {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
}

/* 门的基础样式 */
.door {
  position: absolute;
  top: 0;
  width: 50%;
  height: 100%;
  background-color: #8B4513;
  transition: transform 1s;
  border: 1px solid #5D2906;
}

/* 左门 */
.left {
  left: 0;
  transform-origin: left center;
}

/* 右门 */
.right {
  right: 0;
  transform-origin: right center;
}

/* 悬停效果 - 门打开 */
.container:hover .left {
  transform: rotateY(-90deg);
}

.container:hover .right {
  transform: rotateY(90deg);
}
```

======================================================
## 4. 实现原理

- **透视效果**：perspective属性创建了一个3D视觉空间

- **3D变换**：transform-style: preserve-3d确保子元素在3D空间中渲染

- **旋转效果**：通过transform-origin设置旋转中心，使用rotateY实现绕Y轴旋转

- **过渡动画**：transition属性使门的打开和关闭过程平滑过渡

======================================================