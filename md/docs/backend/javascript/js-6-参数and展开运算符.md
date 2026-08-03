---
title: "JavaScript 参数与展开运算符"

description: "JavaScript 函数参数与展开运算符相关知识。"

date: "2026-04-21"

tags: [JavaScript, 函数参数, 展开运算符]

sidebar: auto

---


#JavaScript

---
## 1. 函数参数

| 类型 | 概念 | 说明 |
|------|------|------|
| 剩余参数 | 剩余参数 | ... 是语法符号，置于最末函数形参之前，用于获取多余的实参，是个真数组 |
| 动态参数 | arguments | 函数内部内置的伪数组变量，它包含了调用函数时传入的所有实参 |

**开发建议：** 开发中，还是提倡多使用 剩余参数。

---
## 2. 展开运算符

| 概念 | 说明 |
|------|------|
| 展开运算符 | ... 将一个数组进行展开 |

**说明：**
1. 不会修改原数组

---
## 示例代码

### 1. 剩余参数示例

```javascript
function config(baseURL, ...other) {
  console.log(baseURL) // 得到 "http://baidu.com"
  console.log(other) // other 得到 ["get", "json"]
}

// 调用函数
config("http://baidu.com", "get", "json");
```

### 2. 动态参数示例

```javascript
// 求任意参数的和
function sum() {
  console.log(arguments)
  let s = 0
  for (let i = 0; i < arguments.length; i++) {
    s += arguments[i]
  }
  console.log(s)
}

// 调用求和函数
sum(5, 10) // 两个参数
sum(1, 2, 4) // 两个参数
```

### 3. 展开运算符示例

```javascript
const arr = [1, 5, 3, 8, 2]
console.log(...arr) // 1 5 3 8 2
```

---