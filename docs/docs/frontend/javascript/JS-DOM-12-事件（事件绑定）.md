---
title: "JavaScript 事件（事件绑定）"

description: "JavaScript 事件（事件绑定）的使用方法，包括事件操作语法、事件流的实际应用和事件委托。"

date: "2026-04-21"

tags: [JavaScript, DOM, 事件, 事件绑定]

sidebar: auto

---


### 事件操作语法

| 操作类型 | 语法 | 说明 |
|----------|------|------|
| 冒泡绑定 | addEventListener(事件类型, 处理函数, false) | 从触发元素开始，依次向上触发祖先元素的同名事件 |
| 捕获绑定 | addEventListener(事件类型, 处理函数, true) | 从DOM根元素开始，依次向下触发目标元素的事件 |
| 阻止冒泡 | 事件对象.stopPropagation() | 阻止事件向上传播，限制在当前元素内 |
| 阻止默认行为 | 事件对象.preventDefault() | 阻止元素的默认行为，如链接跳转、表单提交等 |
| 解绑事件 | removeEventListener(事件类型, 处理函数, [阶段]) | 移除之前绑定的事件监听器 |

### 示例代码

```javascript
// 获取元素
const father = document.querySelector('.father')
const son = document.querySelector('.son')
const btn = document.querySelector('button')
const form = document.querySelector('form')

// 事件冒泡示例
function grandpaClick() {
  alert('我是爷爷')
}

function fatherClick() {
  alert('我是爸爸')
}

function sonClick(e) {
  alert('我是儿子')
  // 阻止冒泡
  e.stopPropagation()
}

// 绑定事件
document.addEventListener('click', grandpaClick)
father.addEventListener('click', fatherClick)
son.addEventListener('click', sonClick)

// 解绑事件示例
function btnClick() {
  alert('按钮被点击了')
}

// 绑定按钮事件
btn.addEventListener('click', btnClick)

// 解绑按钮事件
// btn.removeEventListener('click', btnClick)

// 阻止默认行为示例
const form = document.querySelector('form')
form.addEventListener('click', function(e) {
  // 阻止表单默认提交行为
  e.preventDefault()
  alert('表单提交已被阻止')
})
```

## 事件流的实际应用：事件委托

### 原理
给父元素注册事件，当触发子元素的事件时，会冒泡到父元素身上，从而触发父元素的事件。使用 `事件对象.target` 可以获得真正触发事件的元素。

### 完整示例

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>事件委托示例</title>
    <style>
        ul {
            list-style: none;
            padding: 0;
        }
        li {
            padding: 10px;
            border: 1px solid #ccc;
            margin: 5px 0;
            cursor: pointer;
        }
        li:hover {
            background-color: #f5f5f5;
        }
    </style>
</head>
<body>
    <h3>事件委托示例</h3>
    <ul id="myList">
        <li>项目1</li>
        <li>项目2</li>
        <li>项目3</li>
        <li>项目4</li>
        <li>项目5</li>
    </ul>
    <p id="result">点击列表项查看结果</p>

    <script>
        // 获取父元素
        const ul = document.getElementById('myList')
        const result = document.getElementById('result')

        // 给父元素绑定点击事件
        ul.addEventListener('click', function(e) {
            // 获得真正触发事件的元素
            if (e.target.tagName === 'LI') {
                // 执行操作
                result.textContent = '点击了: ' + e.target.textContent
                // 可以在这里添加更多操作，比如添加样式
                e.target.style.backgroundColor = '#e3f2fd'
            }
        })
    </script>
</body>
</html>
```

