---
title: "Rust 闭包"
description: "Rust 闭包相关知识，包括闭包语法、捕获变量和闭包 Trait。"
date: "2026-04-30"
tags: [Rust, 闭包]
sidebar: auto
---

# Rust 闭包

---

## 1. 概述

- 闭包是一种匿名函数，可以捕获并存储其环境中的变量
- 广泛用于函数式编程、并发编程和事件驱动编程

### 闭包与函数的区别

| 特性 | 闭包 | 函数 |
| :- | :- | :- |
| 匿名性 | 是匿名的，可存储为变量 | 有固定名称 |
| 环境捕获 | 可以捕获外部变量 | 不能捕获外部变量 |
| 定义方式 | `|参数| 表达式` | `fn name(参数) -> 返回值 {}` |
| 类型推导 | 参数和返回值类型可以推导 | 必须显式指定 |

---

## 2. 基本语法

```rust
let closure_name = |参数列表| 表达式;
```

```rust
let add_one = |x: i32| x + 1;
let calculate = |a, b, c| a * b + c;
let result = calculate(1, 2, 3);
```

---

## 3. 捕获外部变量

| 捕获方式 | 说明 | 示例 |
| :- | :- | :- |
| **按引用（默认）** | 类似 `&T`，闭包和外部都可使用 | `let add_x = |y| x + y;` |
| **按值（move）** | 类似 `T`，所有权转移到闭包 | `let print_s = move || println!("{}", s);` |
| **可变借用** | 类似 `&mut T`，闭包可修改外部变量 | `let mut change_num = || num += 1;` |

---

## 4. 闭包 Trait

闭包根据捕获方式自动实现以下三个 Trait：

| Trait | 说明 | 调用次数 |
| :- | :- | :- |
| **Fn** | 不可变借用，不修改捕获变量 | 可多次调用 |
| **FnMut** | 可变借用，可修改捕获变量 | 可多次调用 |
| **FnOnce** | 获取所有权，只能调用一次 | 仅一次 |

---

## 5. 作为函数参数

```rust
fn apply_to_value<F>(val: i32, f: F) -> i32
where
    F: Fn(i32) -> i32,
{
    f(val)
}

fn main() {
    let double = |x| x * 2;
    let result = apply_to_value(5, double);
}
```

---

## 6. 作为函数返回值

### 使用 `impl Fn`

```rust
fn make_adder(x: i32) -> impl Fn(i32) -> i32 {
    move |y| x + y
}
```

### 使用 `Box<dyn Fn>`

```rust
fn make_adder(x: i32) -> Box<dyn Fn(i32) -> i32> {
    Box::new(move |y| x + y)
}
```

---

## 7. 应用场景

### 迭代器

```rust
let vec = vec![1, 2, 3];
let squared_vec: Vec<i32> = vec.iter().map(|x| x * x).collect();
```

### 多线程

```rust
use std::thread;

let nums = vec![1, 2, 3];
let handles: Vec<_> = nums.into_iter().map(|num| {
    thread::spawn(move || num * 2)
}).collect();
```