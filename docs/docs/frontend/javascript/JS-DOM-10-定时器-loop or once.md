---
title: "JavaScript 定时器"
description: "JavaScript 定时器的使用方法，包括setInterval和setTimeout两种定时器的特性和使用建议。"
date: 2026-04-21
tags: [JavaScript, 定时器, setInterval, setTimeout]
sidebar: auto
---

## 两种定时器

| 特性  | setInterval (间隔函数)                              | setTimeout (延时函数)                      |
| --- | ----------------------------------------------- | -------------------------------------- |
| 次数  | 重复执行，每隔指定时间执行一次                                 | 仅执行一次                                  |
| 用途  | 定期重复执行一段代码                                      | 延迟执行一段代码                               |
| 开启  | setInterval(回调函数, 毫秒)                           | setTimeout(回调函数, 毫秒)                   |
| 清除  | clearInterval(timer)                            | clearTimeout(timer)                    |
| 机制  | 每隔指定时间执行一次                                      | 等待指定时间后执行一次                            |
| 注意  | 函数名字不需要加括号；定时器返回的是一个id数字；一般不会刚创建就停止，而是满足一定条件再停止 | 延时器需要等待，所以后面的代码先执行；每一次调用延时器都会产生一个新的延时器 |
### 定时器使用建议

1. **简单延迟执行**：使用 `setTimeout`
2. **简单重复执行**：使用 `setInterval`
3. **复杂重复执行**：使用 `setInterval`
4. **一次延迟操作**：使用 `setTimeout`

### 示例代码
```
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>定时器示例</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .section { margin: 20px 0; padding: 10px; border: 1px solid #ddd; }
        button { margin: 5px; padding: 5px 10px; }
        .result { margin-top: 10px; padding: 10px; background: #f0f8ff; }
    </style>
</head>
<body>
    <h1>定时器示例</h1>
    
    <!-- setTimeout 示例 -->
    <div class="section">
        <h2>setTimeout（只执行一次）</h2>
        <button onclick="startTimeout()">开始延时</button>
        <button onclick="stopTimeout()" disabled>取消</button>
        <div class="result" id="timeoutResult"></div>
    </div>
    
    <!-- setInterval 示例 -->
    <div class="section">
        <h2>setInterval（重复执行）</h2>
        <button onclick="startInterval()">开始计数</button>
        <button onclick="stopInterval()" disabled>停止</button>
        <div class="result" id="intervalResult">计数: 0</div>
    </div>
    
    <script>
        let timeoutId, intervalId, count = 0;
        
        // setTimeout 示例
        function startTimeout() {
            document.querySelector('button[onclick="startTimeout()"]').disabled = true;
            document.querySelector('button[onclick="stopTimeout()"]').disabled = false;
            document.getElementById('timeoutResult').textContent = '等待中...';
            
            timeoutId = setTimeout(() => {
                document.getElementById('timeoutResult').textContent = '延时执行完成（仅执行一次）';
                document.querySelector('button[onclick="startTimeout()"]').disabled = false;
                document.querySelector('button[onclick="stopTimeout()"]').disabled = true;
            }, 2000);
        }
        
        function stopTimeout() {
            clearTimeout(timeoutId);
            document.getElementById('timeoutResult').textContent = '延时已取消';
            document.querySelector('button[onclick="startTimeout()"]').disabled = false;
            document.querySelector('button[onclick="stopTimeout()"]').disabled = true;
        }
        
        // setInterval 示例
        function startInterval() {
            document.querySelector('button[onclick="startInterval()"]').disabled = true;
            document.querySelector('button[onclick="stopInterval()"]').disabled = false;
            count = 0;
            
            intervalId = setInterval(() => {
                count++;
                document.getElementById('intervalResult').textContent = `计数: ${count}`;
            }, 1000);
        }
        
        function stopInterval() {
            clearInterval(intervalId);
            document.querySelector('button[onclick="startInterval()"]').disabled = false;
            document.querySelector('button[onclick="stopInterval()"]').disabled = true;
        }
    </script>
</body>
</html>
```