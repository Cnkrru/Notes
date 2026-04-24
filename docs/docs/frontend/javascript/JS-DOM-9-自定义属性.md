---
title: "JavaScript 自定义属性"

description: "JavaScript 自定义属性的使用方法，包括HTML5标准的data-自定义属性的命名规范和获取方式。"

date: "2026-04-21"

tags: [JavaScript, DOM, 自定义属性]

sidebar: auto

---


### 自定义属性

- **HTML5 标准**：推出了专门的data-自定义属性
- **命名规范**：在标签上一律以data-开头
- **获取方式**：在DOM对象上一律以dataset对象方式获取

### 代码示例

```html
<body>
  <div class="box" data-id="10">盒子</div>
  <script>
    const box = document.querySelector('.box');
    console.log(box.dataset.id); // 输出: 10
  </script>
</body>
```

### 常见用途
1. **存储额外数据**：为元素存储不影响视觉的额外信息
2. **传递配置**：通过data-*属性传递组件配置
3. **事件处理**：在事件处理中获取元素的相关数据
4. **动画控制**：存储动画相关的配置参数