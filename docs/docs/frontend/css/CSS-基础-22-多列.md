---
title: "CSS 多列布局"
description: "CSS 多列布局相关知识。"
date: 2026-04-21
tags: [CSS, 多列布局]
sidebar: auto
---


======================================================
## 1. 多列布局属性

### 1.1 创建多列
- **属性**：column-count
- **取值**：num（列数）
- **作用**：指定元素应该被分割成的列数
- **示例**：
  ```css
  .container {
    column-count: 3; /* 分成3列 */
  }
  ```

### 1.2 多列间隙
- **属性**：column-gap
- **取值**：px（像素值）
- **作用**：指定列之间的间隙大小
- **示例**：
  ```css
  .container {
    column-gap: 20px; /* 列间隙为20px */
  }
  ```

### 1.3 多列宽度
- **属性**：column-width
- **取值**：px（像素值）
- **作用**：指定每列的宽度
- **示例**：
  ```css
  .container {
    column-width: 200px; /* 每列宽度为200px */
  }
  ```

### 1.4 多列元素跨越
- **属性**：column-span
- **取值**：all（跨越所有列）
- **作用**：指定元素应该跨越多少列
- **示例**：
  ```css
  h2 {
    column-span: all; /* 标题跨越所有列 */
  }
  ```

### 1.5 多列边框样式
- **属性**：column-rule-style
- **取值**：solid（实线）等边框样式
- **作用**：指定列之间边框的样式
- **示例**：
  ```css
  .container {
    column-rule-style: solid; /* 列边框为实线 */
  }
  ```

### 1.6 边框厚度
- **属性**：column-rule-width
- **取值**：px（像素值）
- **作用**：指定列之间边框的厚度
- **示例**：
  ```css
  .container {
    column-rule-width: 2px; /* 边框厚度为2px */
  }
  ```

### 1.7 边框颜色
- **属性**：column-rule-color
- **取值**：颜色值
- **作用**：指定列之间边框的颜色
- **示例**：
  ```css
  .container {
    column-rule-color: #ccc; /* 边框颜色为灰色 */
  }
  ```

======================================================
## 2. 复合属性

- **属性**：column-rule
- **作用**：同时设置列边框的宽度、样式和颜色
- **示例**：
  ```css
  .container {
    column-rule: 2px solid #ccc; /* 边框厚度2px，实线，灰色 */
  }
  ```

- **属性**：columns
- **作用**：同时设置列数和列宽
- **示例**：
  ```css
  .container {
    columns: 3 200px; /* 3列，每列宽度200px */
  }
  ```

======================================================