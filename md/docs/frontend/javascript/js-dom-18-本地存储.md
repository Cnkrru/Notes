---
title: "JavaScript 本地存储"

description: "JavaScript 本地存储的使用方法，包括localStorage和sessionStorage的使用。"

date: "2026-04-21"

tags: [JavaScript, DOM, 本地存储, localStorage, sessionStorage]

sidebar: auto

---


### 1. 本地存储介绍

| 项目 | 内容 |
|------|------|
| 问题 | 以前我们页面写的数据一刷新页面就没有了 |
| 特点 | 1. 数据存储在用户浏览器中<br>2. 设置、读取方便，页面刷新不丢失数据<br>3. 容量较大，约5M左右 |

### 2. 本地存储分类

| 存储类型 | 特性 |
|----------|------|
| localStorage | - 永久存储，除非手动删除<br>- 多窗口（页面）共享（同一浏览器）<br>- 以键值对形式存储 |
| sessionStorage | - 生命周期为关闭浏览器窗口<br>- 同一窗口（页面）下数据共享<br>- 以键值对形式存储<br>- 用法与localStorage基本相同 |

**注意**：sessionStorage 的使用方法与 localStorage 完全相同，只需将 `localStorage` 替换为 `sessionStorage` 即可。

### 3. 本地存储使用方法

| 方法 | 语法 | 描述 |
|------|------|------|
| 存储数据 | `localStorage.setItem('键', '值')` | 将数据存储到本地存储中 |
| 获取数据 | `localStorage.getItem('键')` | 从本地存储中获取数据 |
| 删除数据 | `localStorage.removeItem('键')` | 从本地存储中删除指定数据 |
| 清空数据 | `localStorage.clear()` | 清空本地存储中的所有数据 |

### 4. 存储复杂数据类型

| 操作 | 语法 | 描述 |
|------|------|------|
| 存储对象 | `localStorage.setItem('键', JSON.stringify(对象))` | 将对象转换为 JSON 字符串后存储 |
| 获取对象 | `const obj = JSON.parse(localStorage.getItem('键'))` | 将 JSON 字符串转换为对象后使用 |

## 示例代码

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>本地存储示例</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; }
        button { margin: 5px; padding: 5px 10px; }
        .result { margin-top: 10px; padding: 10px; background: #f0f8ff; }
        input { margin: 5px; padding: 5px; }
    </style>
</head>
<body>
    <h1>本地存储示例</h1>
    
    <!-- 单一键值对存储 -->
    <div class="section">
        <h2>1. 单一键值对存储</h2>
        <input type="text" id="key" placeholder="键">
        <input type="text" id="value" placeholder="值">
        <button onclick="saveKeyValue()">存储</button>
        <button onclick="getKeyValue()">获取</button>
        <button onclick="removeKeyValue()">删除</button>
        <div class="result" id="keyValueResult"></div>
    </div>
    
    <!-- JSON 存储 -->
    <div class="section">
        <h2>2. JSON 存储</h2>
        <input type="text" id="productName" placeholder="商品名称">
        <input type="number" id="productPrice" placeholder="价格">
        <button onclick="saveObject()">存储商品</button>
        <button onclick="getObject()">获取商品</button>
        <div class="result" id="objectResult"></div>
    </div>
    
    <!-- 清空存储 -->
    <div class="section">
        <h2>3. 清空存储</h2>
        <button onclick="clearStorage()">清空本地存储</button>
        <div class="result" id="clearResult"></div>
    </div>
    
    <script>
        // 单一键值对存储
        function saveKeyValue() {
            const key = document.getElementById('key').value;
            const value = document.getElementById('value').value;
            if (key && value) {
                localStorage.setItem(key, value);
                document.getElementById('keyValueResult').textContent = `已存储: ${key} = ${value}`;
            } else {
                document.getElementById('keyValueResult').textContent = '请输入键和值';
            }
        }
        
        function getKeyValue() {
            const key = document.getElementById('key').value;
            if (key) {
                const value = localStorage.getItem(key);
                if (value) {
                    document.getElementById('keyValueResult').textContent = `获取到: ${key} = ${value}`;
                } else {
                    document.getElementById('keyValueResult').textContent = `未找到键: ${key}`;
                }
            } else {
                document.getElementById('keyValueResult').textContent = '请输入键';
            }
        }
        
        function removeKeyValue() {
            const key = document.getElementById('key').value;
            if (key) {
                localStorage.removeItem(key);
                document.getElementById('keyValueResult').textContent = `已删除键: ${key}`;
            } else {
                document.getElementById('keyValueResult').textContent = '请输入键';
            }
        }
        
        // JSON 存储
        function saveObject() {
            const name = document.getElementById('productName').value;
            const price = document.getElementById('productPrice').value;
            if (name && price) {
                const product = { name, price: parseFloat(price) };
                localStorage.setItem('product', JSON.stringify(product));
                document.getElementById('objectResult').textContent = `已存储商品: ${name}, 价格: ${price}`;
            } else {
                document.getElementById('objectResult').textContent = '请输入商品名称和价格';
            }
        }
        
        function getObject() {
            const productStr = localStorage.getItem('product');
            if (productStr) {
                const product = JSON.parse(productStr);
                document.getElementById('objectResult').textContent = `获取到商品: ${product.name}, 价格: ${product.price}`;
            } else {
                document.getElementById('objectResult').textContent = '未找到商品数据';
            }
        }
        
        // 清空存储
        function clearStorage() {
            localStorage.clear();
            document.getElementById('clearResult').textContent = '已清空本地存储';
            document.getElementById('keyValueResult').textContent = '';
            document.getElementById('objectResult').textContent = '';
        }
    </script>
</body>
</html>
```