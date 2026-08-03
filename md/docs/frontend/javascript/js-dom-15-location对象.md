---
title: "JavaScript location对象"

description: "JavaScript location对象的使用方法，包括href属性、search属性和reload方法。"

date: "2026-04-21"

tags: [JavaScript, DOM, location对象]

sidebar: auto

---


### location 对象

| 项目        | 内容                                      |
| --------- | --------------------------------------- |
| 定义        | location 的数据类型是对象，它拆分并保存了 URL 地址的各个组成部分 |
| href 属性   | 获取完整的 URL 地址，对其赋值时用于地址的跳转               |
| search 属性 | 获取地址中携带的参数，符号 ? 后面部分                    |
| reload 方法 | 用来刷新当前页面，传入参数 true 时表示强制刷新              |

### 示例代码

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>location 对象示例</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .section { margin: 20px 0; padding: 10px; border: 1px solid #ddd; }
        button { margin: 5px; padding: 5px 10px; }
        .result { margin-top: 10px; padding: 10px; background: #f0f8ff; }
    </style>
</head>
<body>
    <h1>location 对象示例</h1>
    
    <div class="section">
        <h2>1. href 属性</h2>
        <button onclick="getHref()">获取当前 URL</button>
        <button onclick="jumpToItcast()">跳转到传智播客</button>
        <div class="result" id="hrefResult"></div>
    </div>
    
    <div class="section">
        <h2>2. search 属性</h2>
        <button onclick="getSearch()">获取 URL 参数</button>
        <div class="result" id="searchResult"></div>
    </div>
    
    <div class="section">
        <h2>3. reload 方法</h2>
        <button onclick="reloadPage()">刷新页面</button>
        <button onclick="forceReload()">强制刷新</button>
    </div>
    
    <script>
        // href 属性示例
        function getHref() {
            document.getElementById('hrefResult').textContent = '当前 URL: ' + location.href;
        }
        
        function jumpToItcast() {
            location.href = 'https://cnkrru.github.io/blog/';
        }
        
        // search 属性示例
        function getSearch() {
            document.getElementById('searchResult').textContent = 'URL 参数: ' + location.search;
        }
        
        // reload 方法示例
        function reloadPage() {
            location.reload();
        }
        
        function forceReload() {
            location.reload(true);
        }
    </script>
</body>
</html>
```