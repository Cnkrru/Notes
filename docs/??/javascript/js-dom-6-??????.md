# JavaScript

---

## 1. 元素.innerHTML 属性

| 项目 | 说明 |
|------|------|
| 功能 | 将文本内容添加/更新到任意标签位置 |
| 特点 | 会解析标签，多标签建议使用模板字符串 |

---

## 2. 元素.innerText 属性（一般不用）

| 项目 | 说明 |
|------|------|
| 功能 | 将文本内容添加/更新到任意标签位置 |
| 特点 | 显示纯文本，不解析标签 |

---

## 方法对比

| 方法 | 语法 | 描述 |
|------|------|--------|
| innerHTML 属性 | 元素.innerHTML | 将文本内容添加/更新到任意标签位置，解析标签 |
| innerText 属性 | 元素.innerText | 将文本内容添加/更新到任意标签位置，显示纯文本，不解析标签 |

---

## 代码示例

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>操作元素内容示例</title>
</head>
<body>
    <div id="content"></div>
    <button onclick="updateContent()">更新内容</button>

    <script>
        function updateContent() {
            const content = document.querySelector('#content');
            content.innerHTML = `
                <h2>使用 innerHTML 更新内容</h2>
                <p>这是通过 innerHTML 添加的段落</p>
                <ul>
                    <li>列表项 1</li>
                    <li>列表项 2</li>
                    <li>列表项 3</li>
                </ul>
            `;
        }
    </script>
</body>
</html>
```

---