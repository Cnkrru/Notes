## 自定义属性

| 项目 | 内容 |
|------|------|
| HTML5 标准 | 推出了专门的 data- 自定义属性 |
| 命名规范 | 在标签上一律以 data- 开头 |
| 获取方式 | 在 DOM 对象上一律以 dataset 对象方式获取 |

---

## 代码示例

```html
<body>
  <div class="box" data-id="10">盒子</div>
  <script>
    const box = document.querySelector('.box');
    console.log(box.dataset.id); // 输出: 10
  </script>
</body>
```

---

## 常见用途

| 用途 | 描述 |
|------|------|
| 存储额外数据 | 为元素存储不影响视觉的额外信息 |
| 传递配置 | 通过 data-* 属性传递组件配置 |
| 事件处理 | 在事件处理中获取元素的相关数据 |
| 动画控制 | 存储动画相关的配置参数 |