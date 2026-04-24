---
title: "CSS 过渡效果"

description: "CSS 过渡效果（Transition）的实现方法和示例。"

date: "2026-04-21"

tags: [CSS, 过渡效果, Transition]

sidebar: auto

---


#CSS

---
## 1. 过渡效果（Transition）

- **作用**：为元素在不同状态之间切换时添加平滑过渡动画

- **实现方法**：
  ```css
  .element {
    transition: property duration timing-function delay;
  }
  ```

### 1.1 示例：按钮悬停效果

```css
.button {
  background-color: #3498db;
  transition: background-color 0.3s ease;
}

.button:hover {
  background-color: #2980b9;
}
```

---