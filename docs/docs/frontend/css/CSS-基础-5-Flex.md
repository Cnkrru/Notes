---
title: "CSS Flex 弹性布局"
description: "CSS Flex 弹性布局相关知识，包括容器属性和项目属性。"
date: 2026-04-21
tags: [CSS, Flex, 弹性布局]
sidebar: auto
---

#CSS

======================================================
## 1. Flex（弹性布局）

### 1.1 容器属性

- **display: flex**：启用弹性布局

- **flex-direction**：设置主轴方向
  - row：水平方向（默认）
  - column：垂直方向

- **justify-content**：设置主轴对齐方式
  - center：居中对齐
  - space-between：两端对齐，间距相等
  - space-around：间距环绕

- **align-items**：设置交叉轴对齐方式
  - center：居中对齐
  - stretch：拉伸填充（默认，子元素没有尺寸才能拉伸）

- **flex-wrap**：设置是否换行
  - nowrap：不换行（默认）
  - wrap：换行

- **align-content**：设置多行对齐方式
  - center：居中对齐
  - space-between：两端对齐，间距相等
  - space-around：间距环绕
  - stretch：拉伸填充（默认）

======================================================
### 1.2 项目属性

- **flex**：设置项目伸缩比例（可填写px/1、2之类的比例）

- **flex-grow**：设置项目放大比例

- **flex-shrink**：设置项目缩小比例

- **flex-basis**：设置项目初始大小

- **order**：设置项目排列顺序

- **align-self**：设置单个项目对齐方式

======================================================
