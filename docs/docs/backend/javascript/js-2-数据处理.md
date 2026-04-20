---
title: "JavaScript 数据处理"
description: "JavaScript 数据处理相关知识，包括输入输出、函数、控制流程、库函数等。"
date: 2026-04-21
tags: [JavaScript, 数据处理]
sidebar: auto
---

# JavaScript

======================================================
## 一、输入输出

### 1. 输出

- **console.log()**：控制台打印

  ```javascript
  console.log('Hello');
  ```

- **alert()**：弹窗

  ```javascript
  alert('Hello');
  ```

- **document.write()**：页面写入

  ```javascript
  document.write('Hello');
  ```

======================================================
### 2. 输入

- **prompt()**：弹窗输入

  ```javascript
  const name = prompt('请输入姓名:');
  ```

- **confirm()**：确认框

  ```javascript
  const isOk = confirm('确定吗？');
  ```

- **表单输入**：

  ```javascript
  const value = document.getElementById('id').value;
  ```

======================================================
## 二、函数

### 1. 基本函数

- **定义**：

  ```javascript
  function add(a, b) {
    return a + b;
  }
  ```

- **调用**：

  ```javascript
  const sum = add(1, 2); // 3
  ```

- **参数**：默认参数、剩余参数

  ```javascript
  function greet(name = '张三') {
    console.log(`你好，${name}！`);
  }

  function sum(...nums) {
    return nums.reduce((a, b) => a + b, 0);
  }
  ```

======================================================
### 2. 匿名函数

- **基本形式**：

  ```javascript
  const func = function(a, b) {
    return a + b;
  };
  ```

- **类比 Python**：类似 Python 的 lambda 函数，但更灵活
  - Python: `lambda a, b: a + b`
  - JavaScript: `function(a, b) { return a + b; }`

- **使用场景**：

  ```javascript
  // 1. 作为参数传递
  setTimeout(function() {
    console.log('延迟执行');
  }, 1000);

  // 2. 立即执行函数表达式 (IIFE)
  (function() {
    console.log('立即执行');
  })();

  // 3. 事件监听器
  document.getElementById('btn').addEventListener('click', function() {
    console.log('点击了按钮');
  });
  ```

======================================================
## 三、控制流程

### 1. 条件语句

#### 1.1 if 语句

- **基本结构**：

  ```javascript
  if (条件) {
    // 执行代码
  } else if (条件) {
    // 执行代码
  } else {
    // 执行代码
  }
  ```

#### 1.2 switch 语句

- **基本结构**：

  ```javascript
  switch (表达式) {
    case 值1:
      // 执行代码
      break;
    case 值2:
      // 执行代码
      break;
    default:
      // 执行代码
  }
  ```

======================================================
### 2. 循环

- **while 循环**：

  ```javascript
  let i = 0;
  while (i < 5) {
    console.log(i);
    i++;
  }
  ```

- **for 循环**：

  ```javascript
  for (let i = 0; i < 5; i++) {
    console.log(i);
  }
  ```

======================================================
### 3. 循环控制

  ```javascript
  for (let i = 0; i < 5; i++) {
    if (i === 2) continue; // 跳过当前循环
    if (i === 4) break; // 结束循环
    console.log(i);
  }
  ```

======================================================
## 四、库函数

### 1. 数学相关

- **Math**：

  ```javascript
  Math.PI; // 3.14159
  Math.round(3.6); // 4（四舍五入）
  Math.abs(-5); // 5（绝对值）
  Math.max(1, 2, 3); // 3（最大值）
  Math.min(1, 2, 3); // 1（最小值）
  Math.pow(2, 3); // 8（2的3次方）
  Math.sqrt(9); // 3（平方根）
  ```

- **random**：

  ```javascript
  Math.random(); // 生成 0-1 随机数
  
  // 生成指定范围
  function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  const num = getRandom(1, 10); // 1-10 之间的随机数
  ```

======================================================
### 2. 日期时间（时间戳）

- **Date**：

  ```javascript
  // 创建
  const now = new Date(); // 当前时间
  const date = new Date('2024-01-01'); // 指定时间
  
  // 获取
  date.getFullYear(); // 年份
  date.getMonth() + 1; // 月份（0-11）
  date.getDate(); // 日期
  date.getHours(); // 小时
  date.getMinutes(); // 分钟
  date.getSeconds(); // 秒
  
  // 设置
  date.setFullYear(2025);
  date.setMonth(11); // 12月
  ```

======================================================
### 3. 数据结构

- **Array（数组）**：

  ```javascript
  // 转换
  Array.from('abc'); // ['a', 'b', 'c']
  Array.of(1, 2, 3); // [1, 2, 3]
  // 查找
  [1, 2, 3].find(item => item > 1); // 2
  [1, 2, 3].findIndex(item => item > 1); // 1
  ```

- **Map（字典）**：

  ```javascript
  const map = new Map();
  map.set('name', '张三');
  map.set(1, '数字');
  map.get('name'); // '张三'
  map.has('name'); // true
  map.size; // 2
  ```

- **Set（集合）**：

  ```javascript
  const set = new Set([1, 2, 2, 3]);
  set.add(4);
  set.size; // 4
  set.has(2); // true
  set.delete(3);
  ```

- **String（字符串）**：

  ```javascript
  // 查找
  'Hello'.includes('e'); // true
  'Hello'.startsWith('H'); // true
  'Hello'.endsWith('o'); // true
  // 转换
  'hello'.toUpperCase(); // 'HELLO'
  'HELLO'.toLowerCase(); // 'hello'
  // 模板
  const name = '张三';
  `你好，${name}！`; // 模板字符串
  ```

======================================================
### 4. 正则

- **RegExp**：

  ```javascript
  // 创建
  const reg = /\d+/; // 匹配数字
  const reg2 = new RegExp('\\d+');
  // 方法
  reg.test('123'); // true
  'abc123def'.match(reg); // ['123']
  ```

======================================================
### 5. 对象和 JSON

- **Object**：

  ```javascript
  // 转换
  Object.keys({name: '张三', age: 18}); // ['name', 'age']
  Object.values({name: '张三', age: 18}); // ['张三', 18]
  Object.entries({name: '张三', age: 18}); // [['name', '张三'], ['age', 18]]
  // 合并
  Object.assign({}, {a: 1}, {b: 2}); // {a: 1, b: 2}
  ```

- **JSON**：

  ```javascript
  // 对象转 JSON
  JSON.stringify({name: '张三', age: 18}); // '{"name":"张三","age":18}'
  // JSON 转对象
  JSON.parse('{"name":"张三","age":18}'); // {name: '张三', age: 18}
  ```

======================================================
### 6. 异步操作

- **Promise**：

  ```javascript
  // 创建
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('成功');
    }, 1000);
  });
  // 使用
  promise.then(result => {
    console.log(result); // '成功'
  });
  ```

======================================================