---
title: "Rust 数据操作"
description: "Rust 数据操作相关知识，包括函数、控制流、错误处理、运算符等。"
date: "2026-04-30"
tags: [Rust, 数据操作]
sidebar: auto
---

# Rust 数据操作

---

## 1. 函数

- **定义**：使用 `fn` 关键字，箭头定义返回值类型

  ```rust
  fn add(a: i32, b: i32) -> i32 {
      a + b
  }
  ```

---

## 2. 控制流

### 条件语句

- **if 语句**

  ```rust
  if x > 0 {
      println!("正数");
  } else if x < 0 {
      println!("负数");
  } else {
      println!("零");
  }
  ```

- **match 语句**

  ```rust
  match value {
      1 => println!("一"),
      2 => println!("二"),
      _ => println!("其他"),
  }
  ```

### 循环语句

- **for 循环**

  ```rust
  for i in 0..5 {
      println!("{}", i);
  }
  ```

- **while 循环**

  ```rust
  while x > 0 {
      x -= 1;
  }
  ```

- **loop 循环**

  ```rust
  loop {
      println!("无限循环");
      break;
  }
  ```

---

## 3. 错误处理

- **Result 枚举**：处理可能的错误

  ```rust
  enum Result\<T, E\> {
      Ok(T),
      Err(E),
  }
  ```

  ```rust
  fn divide(a: i32, b: i32) -> Result\<i32, String\> {
      if b == 0 {
          Err(String::from("除零错误"))
      } else {
          Ok(a / b)
      }
  }
  ```

- **? 运算符**：简化错误处理
  - 示例：`let result = some_function()?;`

---

## 4. 重影（Shadowing）

- **说明**：可以使用相同变量名重新声明变量

  ```rust
  let x = 5;
  let x = x + 1; // x 现在是 6
  let x = "hello"; // x 现在是字符串
  ```

---

## 5. 运算符

### 算术运算符

- **加减乘除取余**：`+ - * / %`（与 C 语言一致）
- **乘方**：使用 `pow` 方法（浮点数用 `powf`）

  ```rust
  let x = 2_i32.pow(3); // 8
  let y = 2.0_f64.powf(3.0); // 8.0
  ```

### 其他运算符

| 运算符 | 说明 | 示例 |
| :- | :- | :- |
| **..** | 范围（不含右端） | `0..5` 产生 0 到 4 |
| **..=** | 范围（含右端） | `0..=5` 产生 0 到 5 |
| **as** | 类型转换 | `5 as f32` |
| **?** | 错误传播 | `some()?` |
| **ref** | 绑定为引用 | `let ref y = x;` |