---
title: "JavaScript DOM增删查"

description: "JavaScript DOM增删查的使用方法，包括DOM节点类型和增删改查操作。"

date: "2026-04-21"

tags: [JavaScript, DOM, 增删查]

sidebar: auto

---


## 1. DOM 节点类型

| 节点类型 | 描述               | 示例                   |
| ---- | ---------------- | -------------------- |
| 元素节点 | 所有的标签，如 body、div | `<div>内容</div>`      |
| 属性节点 | 所有的属性，如 href     | `<a href="#">链接</a>` |
| 文本节点 | 所有的文本            | `文本内容`               |
| 其他   | 注释、文档类型等         | `<!-- 注释 -->`        |

## 2. 增删改查操作

| 操作类型 | 方法/属性                    | 描述                                                 |
| ---- | ------------------------ | -------------------------------------------------- |
| 查找节点 | `parentNode`             | 获取父节点                                              |
|      | `children`               | 仅获得所有元素子节点（重点），返回的是一个伪数组                           |
|      | `nextElementSibling`     | 获取下一个兄弟节点                                          |
|      | `previousElementSibling` | 获取上一个兄弟节点                                          |
| 增加节点 | `createElement`          | 创建一个新的元素节点                                         |
|      | `cloneNode`              | 克隆一个已有的元素节点，括号内传入布尔值，true 表示包含后代节点，false 表示不包含（默认） |
|      | `appendChild`            | 插入到父元素的最后一个子元素                                     |
|      | `insertBefore`           | 插入到父元素中某个子元素的前面                                    |
| 删除节点 | `removeChild`            | 通过父元素删除子元素，语法：父元素.removeChild(要删除的元素)              |

## 实例代码
```
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DOM 增删改查示例</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            text-align: center;
            margin-bottom: 20px;
            color: #333;
        }
        .controls {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 20px;
        }
        button {
            padding: 8px 16px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }
        button:hover {
            background-color: #45a049;
        }
        .demo-area {
            border: 1px solid #ddd;
            padding: 20px;
            margin-bottom: 20px;
            border-radius: 4px;
        }
        .item {
            background-color: #f0f0f0;
            padding: 10px;
            margin: 10px 0;
            border-radius: 4px;
            border-left: 4px solid #4CAF50;
        }
        .result {
            background-color: #e3f2fd;
            padding: 10px;
            border-radius: 4px;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>DOM 增删改查示例</h1>
        
        <div class="controls">
            <button data-func="createElement">创建元素</button>
            <button data-func="cloneElement">克隆元素</button>
            <button data-func="deleteElement">删除元素</button>
            <button data-func="findParent">查找父节点</button>
            <button data-func="findChildren">查找子节点</button>
            <button data-func="findNextSibling">查找下一个兄弟节点</button>
            <button data-func="findPrevSibling">查找上一个兄弟节点</button>
        </div>
        
        <div class="demo-area" id="demoArea">
            <div class="item" id="item1">项目 1</div>
            <div class="item" id="item2">项目 2</div>
            <div class="item" id="item3">项目 3</div>
        </div>
        
        <div class="result" id="result"></div>
    </div>
    
    <script>
        // 创建元素
        function createElement() {
            // 创建新元素
            const newItem = document.createElement('div');
            newItem.classList.add('item');
            newItem.innerHTML = '新创建的项目';
            
            // 添加到容器末尾
            const demoArea = document.querySelector('#demoArea');
            demoArea.appendChild(newItem);
            
            showResult('创建了新元素并添加到末尾');
        }
        
        // 克隆元素
        function cloneElement() {
            // 克隆元素
            const item2 = document.querySelector('#item2');
            const clonedItem = item2.cloneNode(true);
            clonedItem.innerHTML = '克隆的项目 2';
            
            // 插入到项目 3 前面
            const demoArea = document.querySelector('#demoArea');
            const item3 = document.querySelector('#item3');
            demoArea.insertBefore(clonedItem, item3);
            
            showResult('克隆了项目 2 并插入到项目 3 前面');
        }
        
        // 删除元素
        function deleteElement() {
            // 删除元素
            const demoArea = document.querySelector('#demoArea');
            const item1 = document.querySelector('#item1');
            
            if (item1) {
                demoArea.removeChild(item1);
                showResult('删除了项目 1');
            } else {
                showResult('项目 1 已不存在');
            }
        }
        
        // 查找父节点
        function findParent() {
            // 查找父节点
            const item2 = document.querySelector('#item2');
            const parent = item2.parentNode;
            
            showResult(`项目 2 的父节点是: ${parent.tagName}`);
        }
        
        // 查找子节点
        function findChildren() {
            // 查找子节点
            const demoArea = document.querySelector('#demoArea');
            const children = demoArea.children;
            let result = '容器的子元素数量: ' + children.length + '<br>';
            
            for (let i = 0; i < children.length; i++) {
                result += `子元素 ${i + 1}: ${children[i].innerHTML}<br>`;
            }
            
            showResult(result);
        }
        
        // 查找下一个兄弟节点
        function findNextSibling() {
            // 查找下一个兄弟节点
            const item2 = document.querySelector('#item2');
            const nextSibling = item2.nextElementSibling;
            
            if (nextSibling) {
                showResult(`项目 2 的下一个兄弟节点是: ${nextSibling.innerHTML}`);
            } else {
                showResult('项目 2 没有下一个兄弟节点');
            }
        }
        
        // 查找上一个兄弟节点
        function findPrevSibling() {
            // 查找上一个兄弟节点
            const item2 = document.querySelector('#item2');
            const prevSibling = item2.previousElementSibling;
            
            if (prevSibling) {
                showResult(`项目 2 的上一个兄弟节点是: ${prevSibling.innerHTML}`);
            } else {
                showResult('项目 2 没有上一个兄弟节点');
            }
        }
        
        // 显示结果
        function showResult(message) {
            const resultDiv = document.querySelector('#result');
            resultDiv.innerHTML = message;
        }
        
        // 绑定事件（使用addEventListener，冒泡模式）
        document.addEventListener('DOMContentLoaded', function() {
            const buttons = document.querySelectorAll('button');
            buttons.forEach(button => {
                button.addEventListener('click', function() {
                    const funcName = this.getAttribute('data-func');
                    window[funcName]();
                });
            });
        });
    </script>
</body>
</html>
```