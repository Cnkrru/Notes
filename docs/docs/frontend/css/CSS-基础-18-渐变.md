---
title: "CSS 渐变"
description: "CSS 渐变相关知识，包括线性渐变和径向渐变。"
date: 2026-04-21
tags: [CSS, 渐变]
sidebar: auto
---

#CSS

======================================================
## 1. 线性渐变

- **属性**：
  ```css
  background-image: linear-gradient(
    渐变方向,
    颜色1 终点位置,
    颜色2 终点位置,
    ......
  );
  ```

- **取值**：
  - **渐变方向**（可选）：
    - to 方位名词（如 to right、to bottom right）
    - 角度值（如 45deg）
  - **终点位置**（可选）：百分比（如 0%、50%、100%）

- **示例**：
  ```css
  /* 从左到右渐变 */
  background-image: linear-gradient(to right, red, blue);
  /* 45度角渐变 */
  background-image: linear-gradient(45deg, red, blue);
  /* 带位置的渐变 */
  background-image: linear-gradient(to right, red 0%, yellow 50%, blue 100%);
  ```

======================================================
## 2. 径向渐变

- **作用**：给按钮添加高光效果

- **属性**：
  ```css
  background-image: radial-gradient(
    半径 at 圆心位置,
    颜色1 终点位置,
    颜色2 终点位置,
    ......
  );
  ```

- **取值**：
  - **半径**：可以是2条，则为椭圆
  - **圆心位置**：
    - 方位名词（如 center、top left）
    - 像素单位数值
    - 百分比
  - **终点位置**（可选）：百分比

- **示例**：
  ```css
  /* 默认圆心（中心点）的径向渐变 */
  background-image: radial-gradient(red, blue);
  /* 自定义圆心位置的径向渐变 */
  background-image: radial-gradient(100px at 50px 50px, red, blue);
  /* 椭圆径向渐变（使用两个半径值） */
  background-image: radial-gradient(100px 50px at center, red, blue);
  ```

=======================================================