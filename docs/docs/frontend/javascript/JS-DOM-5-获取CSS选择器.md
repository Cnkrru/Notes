---
title: "JavaScript 获取CSS选择器"

description: "JavaScript 获取CSS选择器的方法，包括querySelector、querySelectorAll等推荐方法和其他了解即可的方法。"

date: "2026-04-21"

tags: [JavaScript, DOM, CSS选择器]

sidebar: auto

---


#JavaScript

---
## 推荐使用的方法（重点）

| 方法               | 语法                                  | 参数                  | 描述                                              |
| ---------------- | ----------------------------------- | ------------------- | ----------------------------------------------- |
| querySelector    | document.querySelector('css选择器')    | 包含一个或多个有效的CSS选择器字符串 | CSS选择器匹配的第一个元素，一个HTMLElement对象。如果没有匹配到，则返回null。 |
| querySelectorAll | document.querySelectorAll('css选择器') | 包含一个或多个有效的CSS选择器字符串 | CSS选择器匹配的NodeList对象集合                           |

---
## 了解即可的方法

| 方法                     | 语法                                   | 参数       | 描述                     |
| ---------------------- | ------------------------------------ | -------- | ---------------------- |
| getElementById         | document.getElementById('id')        | 元素的ID属性值 | 根据ID获取一个元素             |
| getElementsByTagName   | document.getElementsByTagName('div') | 标签名      | 根据标签获取一类元素，获取页面所有div   |
| getElementsByClassName | document.getElementsByClassName('w') | 类名       | 根据类名获取元素，获取页面所有类名为w的元素 |

---
## 推荐方法示例

### 完整HTML示例

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DOM选择器示例</title>
  <style>
    .box {
      width: 200px;
      height: 100px;
      background-color: lightblue;
      margin: 10px;
      padding: 10px;
      border-radius: 5px;
    }
    .box.active {
      background-color: lightcoral;
    }
    .item {
      padding: 5px;
      margin: 5px;
      background-color: lightgreen;
      border-radius: 3px;
    }
    .item.even {
      background-color: lightgreen;
    }
    .item.odd {
      background-color: lightyellow;
    }
    #header {
      background-color: #333;
      color: white;
      padding: 10px;
      text-align: center;
    }
    #header.small {
      font-size: 20px;
    }
  </style>
</head>
<body>
  <div id="header">
    <h1>DOM选择器示例</h1>
  </div>
  
  <div class="box">
    <p>这是第一个box</p>
  </div>
  
  <div class="box">
    <p>这是第二个box</p>
  </div>
  
  <ul>
    <li class="item">项目1</li>
    <li class="item">项目2</li>
    <li class="item">项目3</li>
  </ul>
  
  <script>
    // 使用 querySelector 获取元素
    const firstBox = document.querySelector('.box');
    const header = document.querySelector('#header');
    const firstParagraph = document.querySelector('p');
    
    // 操作获取到的元素
    firstBox.classList.add('active');
    header.classList.add('small');
    firstParagraph.innerHTML = '修改后的文本';
    
    // 使用 querySelectorAll 获取元素
    const items = document.querySelectorAll('.item');
    
    // 遍历并操作所有获取到的元素
    items.forEach((item, index) => {
      item.innerHTML = `修改后的项目${index + 1}`;
      item.classList.add(index % 2 === 0 ? 'even' : 'odd');
    });
    
    // 输出获取到的元素数量
    const listItems = document.querySelectorAll('li');
    console.log('获取到的li元素数量:', listItems.length);
  </script>
</body>
</html>
```

---
