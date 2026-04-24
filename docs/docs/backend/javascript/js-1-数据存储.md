---
title: "JavaScript 数据存储"

description: "JavaScript 数据存储相关知识，包括变量、常量、数据类型、数组、字符串和对象。"

date: "2026-04-21"

tags: [JavaScript, 数据存储]

sidebar: auto

---


#JavaScript

---
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

---
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

---
## 数据类型（Python中没有的）

### 1. undefined

- **说明**：表示未定义的值，变量声明但未赋值时的默认值

  ```javascript
  let x;
  console.log(x); // undefined
  ```

- **类型检测**：

  ```javascript
  typeof undefined; // 'undefined'
  ```

### 2. Symbol

- **说明**：ES6新增，表示唯一的、不可变的值，用于对象属性的键

  ```javascript
  const sym1 = Symbol('description');
  const sym2 = Symbol('description');
  console.log(sym1 === sym2); // false
  ```

- **类型检测**：

  ```javascript
  typeof Symbol(); // 'symbol'
  ```

### 3. BigInt

- **说明**：ES6新增，表示任意精度的整数

  ```javascript
  const bigInt = 9007199254740991n;
  const anotherBigInt = BigInt(9007199254740991);
  ```

- **类型检测**：

  ```javascript
  typeof 1n; // 'bigint'
  ```

---
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

---
### 3. 字符串

- **创建**：单引号、双引号、反引号

  ```javascript
  const str = 'Hello';
  ```

- **方法**：length（长度）、slice（截取）、split（分割）

  ```javascript
  str.length; // 5
  ```

---
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

---