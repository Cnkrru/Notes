---
title: "JavaScript history对象"
description: "JavaScript history对象的使用方法，包括back()、forward()和go()方法。"
date: 2026-04-21
tags: [JavaScript, DOM, history对象]
sidebar: auto
---

### history 对象

| 项目 | 内容 |
|------|------|
| 定义 | history 的数据类型是对象，主要管理历史记录，该对象与浏览器地址栏的操作相对应，如前进、后退、历史记录等 |
| 常用属性和方法 | - |
| back() | 可以后退功能 |
| forward() | 前进功能 |
| go(参数) | 前进后退功能，参数如果是 1 前进1个页面，如果是-1 后退1个页面 |

## 示例代码

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>history 对象示例</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .section { margin: 20px 0; padding: 10px; border: 1px solid #ddd; }
        button { margin: 5px; padding: 5px 10px; }
        .info { margin-top: 10px; padding: 10px; background: #f0f8ff; }
    </style>
</head>
<body>
    <h1>history 对象示例</h1>
    
    <div class="section">
        <h2>历史记录操作</h2>
        <button onclick="goBack()">后退</button>
        <button onclick="goForward()">前进</button>
        <button onclick="goToPage(-2)">后退 2 页</button>
        <button onclick="goToPage(2)">前进 2 页</button>
        <div class="info">
            <p>说明：请先访问几个页面，然后使用上面的按钮测试历史记录操作。</p>
            <p>点击以下链接打开新页面：</p>
            <a href="https://www.baidu.com" target="_blank">百度</a> | 
            <a href="https://www.google.com" target="_blank">Google</a> | 
            <a href="https://www.github.com" target="_blank">GitHub</a>
        </div>
    </div>
    
    <script>
        // 后退
        function goBack() {
            history.back();
        }
        
        // 前进
        function goForward() {
            history.forward();
        }
        
        // 前进或后退指定页数
        function goToPage(pages) {
            history.go(pages);
        }
    </script>
</body>
</html>
```