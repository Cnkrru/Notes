---
title: "JavaScript 事件（键鼠监听）"
description: "JavaScript 事件（键鼠监听）的使用方法，包括事件监听语法、事件监听三要素、常用事件类型和事件对象。"
date: 2026-04-21
tags: [JavaScript, DOM, 事件, 键鼠监听]
sidebar: auto
---

### 事件与事件对象

### 事件监听语法

```javascript
元素对象.addEventListener('事件类型', 要执行的函数)
```

### 事件监听三要素
- **事件源**：那个DOM元素被事件触发了，要获取DOM元素
- **事件类型**：用什么方式触发，比如鼠标单击click、鼠标经过mouseover等
- **事件调用的函数**：要做什么事

### 常用事件类型

| 分类 | 事件类型 | 描述 |
|------|---------|------|
| 鼠标事件 | click | 鼠标单击事件 |
| | mouseenter | 鼠标经过事件 |
| | mouseleave | 鼠标离开事件 |
| 焦点事件 | focus | 元素获得焦点事件 |
| | blur | 元素失去焦点事件 |
| 键盘事件 | keydown | 键盘按下事件 |
| | keyup | 键盘释放事件 |
| 文本事件 | input | 输入框输入事件 |

### 事件对象

#### 语法：如何获取
- 在事件绑定的回调函数的第一个参数就是事件对象
- 一般命名为event、ev、e

```javascript
元素.addEventListener('click', function (e) {
  // e 就是事件对象
});
```

#### 常用事件对象属性

| 属性 | 描述 |
|------|------|
| type | 获取当前的事件类型 |
| clientX/clientY | 获取光标相对于浏览器可见窗口左上角的位置 |
| offsetX/offsetY | 获取光标相对于当前DOM元素左上角的位置 |
| key | 用户按下的键盘键的值（现在不提倡使用keyCode） |

### 代码实现步骤

1. **获取DOM元素**：使用`querySelector`或`querySelectorAll`获取需要绑定事件的元素
2. **定义事件处理函数**：创建处理事件的函数，函数参数为事件对象
3. **绑定事件监听器**：使用`addEventListener`方法为元素绑定事件和处理函数
4. **使用事件对象**：在事件处理函数中通过事件对象访问所需的属性和方法

### 示例代码：事件与事件对象

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>事件与事件对象示例</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 30px;
            background: #f5f7fa;
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .event-box {
            padding: 20px;
            margin: 10px 0;
            border: 1px solid #ddd;
            border-radius: 6px;
            transition: all 0.3s ease;
        }
        
        .event-box:hover {
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        input {
            padding: 8px;
            width: 200px;
            margin: 5px 0;
        }
        
        .output {
            margin-top: 20px;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 6px;
            font-family: monospace;
            white-space: pre-wrap;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>事件与事件对象示例</h1>
        
        <!-- 鼠标事件 -->
        <div class="event-box" id="mouseBox">
            <h3>鼠标事件</h3>
            <p>点击、鼠标经过或离开此区域</p>
        </div>
        
        <!-- 焦点事件 -->
        <div class="event-box">
            <h3>焦点事件</h3>
            <input type="text" id="focusInput" placeholder="点击此处获得焦点">
        </div>
        
        <!-- 键盘事件 -->
        <div class="event-box">
            <h3>键盘事件</h3>
            <input type="text" id="keyInput" placeholder="在此输入文字">
        </div>
        
        <!-- 文本事件 -->
        <div class="event-box">
            <h3>文本事件</h3>
            <input type="text" id="textInput" placeholder="在此输入文字查看实时变化">
        </div>
        
        <!-- 输出区域 -->
        <div class="output" id="output"></div>
    </div>

    <script>
        // 获取DOM元素
        const mouseBox = document.querySelector('#mouseBox');
        const focusInput = document.querySelector('#focusInput');
        const keyInput = document.querySelector('#keyInput');
        const textInput = document.querySelector('#textInput');
        const output = document.querySelector('#output');
        
        // 输出函数
        function logEvent(event) {
            let message = `${new Date().toLocaleTimeString()}: ${event.type} 事件触发`;
            
            // 鼠标事件信息
            if (event.type.includes('mouse')) {
                message += `\n鼠标位置: clientX=${event.clientX}, clientY=${event.clientY}`;
                message += `\n相对于元素位置: offsetX=${event.offsetX}, offsetY=${event.offsetY}`;
            }
            
            // 键盘事件信息
            if (event.type.includes('key')) {
                message += `\n按下的键: ${event.key}`;
                message += `\n键码: ${event.code}`;
            }
            
            message += '\n';
            output.textContent += message;
            output.scrollTop = output.scrollHeight;
        }
        
        // 鼠标事件
        mouseBox.addEventListener('click', logEvent);
        mouseBox.addEventListener('mouseenter', logEvent);
        mouseBox.addEventListener('mouseleave', logEvent);
        
        // 焦点事件
        focusInput.addEventListener('focus', logEvent);
        focusInput.addEventListener('blur', logEvent);
        
        // 键盘事件
        keyInput.addEventListener('keydown', logEvent);
        keyInput.addEventListener('keyup', logEvent);
        
        // 文本事件
        textInput.addEventListener('input', logEvent);
    </script>
</body>
</html>
```