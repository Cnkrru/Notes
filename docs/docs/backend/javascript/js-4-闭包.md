---
title: "JavaScript 闭包"

description: "JavaScript 闭包相关知识。"

date: "2026-04-21"

tags: [JavaScript, 闭包]

sidebar: auto

---


#JavaScript

---
## 1. 闭包概念

| 概念 | 说明 |
|------|------|
| 闭包 | 封闭数据，提供操作，外部也可以访问函数内部的变量 |

---
## 2. 闭包的基本格式

```javascript
function outer() {
  let i = 1
  function fn() {
    console.log(i)
  }
  return fn
}

const fun = outer()
fun() // 1
// 外层函数使用内层函数的变量
// 内层函数调用时仍然能访问 i
```

---