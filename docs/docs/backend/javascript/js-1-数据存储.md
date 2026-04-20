---
title: "JavaScript 数据存储"
description: "JavaScript 数据存储相关知识，包括变量、常量、数据类型、数组、字符串和对象。"
date: 2026-04-21
tags: [JavaScript, 数据存储]
sidebar: auto
---

#JavaScript

======================================================
## 变量和常量

### 1. 变量

- **声明**：let（块级）、const（不可改）、var（函数级）

  ```javascript
  let name = '张三';
  ```

- **解构**：

  ```javascript
  let [a, b] = [1, 2];
  ```

======================================================
### 2. 常量

- **声明**：使用 const

  ```javascript
  const PI = 3.14;
  ```

- **特点**：不可修改引用，对象/数组内部可改

  ```javascript
  const obj = {name: '张三'};
  obj.age = 18; // 可以
  ```

======================================================
## 数据类型

### 1. 数字类型

- **类型**：整数、浮点数

  ```javascript
  let num1 = 10;
  let num2 = 3.14;
  ```

- **特殊值**：Infinity、NaN

  ```javascript
  let inf = Infinity;
  let nan = NaN;
  ```

- **检测类型**：

  ```javascript
  typeof 10; // 'number'
  typeof 'hello'; // 'string'
  typeof true; // 'boolean'
  typeof []; // 'object'
  typeof {}; // 'object'
  typeof null; // 'object'（历史遗留）
  typeof undefined; // 'undefined'
  ```

- **显式转换**：

  ```javascript
  Number('123'); // 123
  String(123); // '123'
  Boolean(0); // false
  Boolean(''); // false
  Boolean(null); // false
  Boolean(undefined); // false
  Boolean(1); // true
  Boolean('hello'); // true
  ```

- **隐式转换**：

  ```javascript
  1 + '2'; // '12'（数字转字符串）
  '5' - 2; // 3（字符串转数字）
  '' == false; // true（隐式布尔转换）
  // 假值：false, 0, '', null, undefined, NaN
  // 真值：除假值外的所有值
  ```

======================================================
### 2. 数组

- **创建**：

  ```javascript
  const arr = [1, 2, 3];
  ```

- **访问**：

  ```javascript
  arr[0]; // 1
  ```

- **增删改查**：

  ```javascript
  // 增
  arr.push(4); // 末尾添加
  arr.unshift(0); // 开头添加
  arr.splice(2, 0, 2.5); // 中间插入
  // 删
  arr.pop(); // 末尾删除
  arr.shift(); // 开头删除
  arr.splice(1, 1); // 中间删除
  // 改
  arr[0] = 10; // 直接修改
  // 查
  arr.indexOf(2); // 查找索引
  arr.includes(3); // 检查是否包含
  ```

- **遍历**：

  ```javascript
  for (let i = 0; i < arr.length; i++) {
    console.log(arr[i]);
  }
  ```

======================================================
### 3. 字符串

- **创建**：单引号、双引号、反引号

  ```javascript
  const str = 'Hello';
  ```

- **方法**：length（长度）、slice（截取）、split（分割）

  ```javascript
  str.length; // 5
  ```

======================================================
### 4. 对象

- **创建**：

  ```javascript
  const obj = {name: '张三', age: 18};
  ```

- **增删改查**：

  ```javascript
  // 增
  obj.gender = '男'; // 添加属性
  // 删
  delete obj.gender;
  // 改
  obj.age = 19;
  // 查
  obj.name; // '张三'
  obj['age']; // 19
  ```

- **方法**：

  ```javascript
  // 方法 1：直接在对象创建时定义
  const obj = {
    name: '张三',
    age: 18,
    // 传统写法
    sayHi: function() {
      console.log(`你好，我是${this.name}`);
    },
    // ES6 简写
    sayHello() {
      console.log('Hello!');
    }
  };
  // 方法 2：后续添加
  obj.sayBye = function() {
    console.log('Bye!');
  };
  // 调用方法
  obj.sayHi(); // 你好，我是张三
  ```

- **遍历**：

  ```javascript
  for (const key in obj) {
    console.log(key, obj[key]);
  }
  ```

======================================================