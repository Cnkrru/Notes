---
title: "CSS 3D转换"

description: "CSS 3D转换相关知识，包括空间转换-平移、视距、旋转、立体呈现和缩放。"

date: "2026-04-21"

tags: [CSS, 3D转换, transform]

sidebar: auto

---


#CSS

---
## 1. 空间转换-平移

- **作用**：改变元素在立体空间中的位置

- **语法**：
  ```css
  /* 单个方向平移 */
  transform: translateX(值); /* X轴方向平移 */
  transform: translateY(值); /* Y轴方向平移 */
  transform: translateZ(值); /* Z轴方向平移 */
  /* 三个方向同时平移 */
  transform: translate3d(x, y, z);
  ```

- **取值**：
  - 像素单位数值
  - 百分比（相对于自身尺寸）
  - 正值：向对应轴的正方向移动
  - 负值：向对应轴的负方向移动

- **注意事项**：
  - Z轴平移需要配合透视效果才能看到明显效果
  - 平移不会影响其他元素的布局

---
## 2. 空间转换-视距

- **属性**：perspective

- **作用**：指定了观察者与Z=0平面的距离，为元素添加透视效果

- **透视效果**：近大远小、近实远虚

- **取值**：像素单位数值（如 800px）

- **使用场景**：添加到父元素上，为子元素提供透视空间

- **示例**：
  ```css
  .parent {
    perspective: 800px; /* 父元素添加透视效果 */
  }
  .child {
    transform: translateZ(100px); /* 子元素Z轴平移 */
  }
  ```

---
## 3. 空间转换-旋转

- **作用**：使元素在立体空间中绕坐标轴旋转

- **语法**：
  ```css
  /* 绕Z轴旋转 */
  transform: rotateZ(值);
  /* 绕X轴旋转 */
  transform: rotateX(值);
  /* 绕Y轴旋转 */
  transform: rotateY(值);
  /* 同时绕三个轴旋转 */
  transform: rotate3d(x, y, z, 角度);
  ```

- **取值**：
  - 角度值：单位为deg（如 45deg）
  - 正值：顺时针旋转
  - 负值：逆时针旋转

- **示例**：
  ```css
  /* 绕Z轴旋转45度 */
  transform: rotateZ(45deg);
  /* 绕X轴旋转30度 */
  transform: rotateX(30deg);
  /* 绕Y轴旋转60度 */
  transform: rotateY(60deg);
  ```

---
## 4. 立体呈现

- **作用**：设置元素的子元素是位于3D空间中还是平面中

- **属性**：transform-style

- **取值**：
  - **flat**：子级处于平面中
  - **preserve-3d**：子级处于3D空间

- **示例**：
  ```css
  .parent {
    transform-style: preserve-3d; /* 启用3D空间 */
    perspective: 800px;
  }
  .child {
    transform: rotateY(45deg); /* 子元素在3D空间中旋转 */
  }
  ```

- **使用场景**：
  - 实现复杂的3D效果时需要设置
  - 通常添加到父元素上，为子元素提供3D空间

---
## 5. 空间转换-缩放

- **作用**：使元素在立体空间中放大或缩小

- **语法**：
  ```css
  /* 单个方向缩放 */
  transform: scaleX(值); /* X轴方向缩放 */
  transform: scaleY(值); /* Y轴方向缩放 */
  transform: scaleZ(值); /* Z轴方向缩放 */
  /* 三个方向同时缩放 */
  transform: scale3d(x, y, z);
  /* 等比例缩放 */
  transform: scale(值);
  ```

- **取值**：
  - 数值：1为原始大小，大于1放大，小于1缩小
  - 正值：正常缩放
  - 负值：翻转并缩放

- **示例**：
  ```css
  /* 等比例放大1.2倍 */
  transform: scale(1.2);
  /* X轴放大1.5倍，Y轴不变 */
  transform: scaleX(1.5);
  /* 三个方向同时缩放 */
  transform: scale3d(1.2, 1.2, 1.2);
  ```

---