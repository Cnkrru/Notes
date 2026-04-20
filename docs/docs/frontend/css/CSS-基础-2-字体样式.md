---
title: "CSS 基础字体样式"
description: "CSS 字体样式相关知识，包括文字效果、排版布局、字体样式等。"
date: 2026-04-21
tags: [CSS, 字体样式]
sidebar: auto
---

#CSS

======================================================
## 1. 文字效果

### 1.1 尺寸

- **font-size**：num+px
  - **说明**：px指的是像素大小
  - **默认值**：谷歌浏览器默认字体大小是16px

### 1.2 粗细

- **font-weight**：num

### 1.3 行高

- **line-height**：num+px
  - **说明**：
    - 如果只写num，则为当前标签的字符大小的num倍
    - 行高=上间距+下间距+字体大小

### 1.4 颜色

- **color**

- **rgb三原色写法**

- **rgba透明色表示法**：a表示透明度，属于（0，1）小数

- **十六进制表示**：RRGGBB（如果重复，则写成RGB）

======================================================
## 2. 排版布局

### 2.1 横向位置

- **text-align**：style
  - **style值**：
    - left（默认左）
    - right
    - center（居中的是字体）

- **图片居中**：需要给img标签加一个父级：div

### 2.2 垂直居中（行高特殊作用）

- **方法**：
  - 造一个盒子
  - 把文字行高和盒子高度设置一样就行

- **说明**：仅限单行文字垂直居中

### 2.3 单词换行

- word-warp: break-word

### 2.4 长句子拆分换行

- word-break: keep-all/break-all

======================================================
## 3. 字体样式

- **font-family**：字体样式

### 3.1 倾斜

- **font-style**：normal/italic
  - **说明**：normal是不倾斜，italic是倾斜

### 3.2 缩进

- **text-indent**：num+px/num+em
  - **说明**：一般使用em，em与当前内容字体相关，2em就是首行缩进2格

### 3.3 修饰线

- **text-decoration**：
  - none：无
  - underline：下划线
  - line-through：删除线
  - overline：上划线

### 3.4 文本阴影

- text-shadow：px px px color

======================================================
## 4. 字符复合属性

- **font**：倾斜 加粗 字号/行高 字体
  - **说明**：
    - 必须严格按照顺序来写
    - 一般用于开发初期，统一文字效果

======================================================
## 5. HTML替代

### 5.1 加粗效果

- **HTML标签**：`<strong>` 或 `<b>`

- **CSS实现**：
  ```css
  .bold {
    font-weight: bold; /* 或 700 */
  }
  ```

### 5.2 倾斜效果

- **HTML标签**：`<em>` 或 `<i>`

- **CSS实现**：
  ```css
  .italic {
    font-style: italic;
  }
  ```

### 5.3 下划线效果

- **HTML标签**：`<ins>` 或 `<u>`

- **CSS实现**：
  ```css
  .underline {
    text-decoration: underline;
  }
  ```

### 5.4 删除线效果

- **HTML标签**：`<del>` 或 `<s>`

- **CSS实现**：
  ```css
  .line-through {
    text-decoration: line-through;
  }
  ```

### 5.5 换行符效果

- **HTML标签**：`<br>`

- **CSS实现**：
  ```css
  /* 自定义换行符样式（通过父元素控制行间距） */
  .line-break {
    line-height: 1.5; /* 控制行间距 */
  }

  /* 直接为br标签设置样式（较少使用） */
  br {
    content: "";
    margin: 10px 0;
    display: block;
  }
  ```

### 5.6 分割线效果

- **HTML标签**：`<hr>`

- **CSS实现**：
  ```css
  hr {
    /* 基本样式 */
    border: none;
    border-top: 1px solid #ddd;
    margin: 20px 0;
    width: 100%;
  }

  /* 自定义分割线样式 */
  .custom-hr {
    border-top: 2px dashed #3498db;
    margin: 30px 0;
  }

  /* 带阴影的分割线 */
  .shadow-hr {
    border: none;
    height: 1px;
    background: linear-gradient(to right, transparent, #333, transparent);
    margin: 25px 0;
  }
  ```