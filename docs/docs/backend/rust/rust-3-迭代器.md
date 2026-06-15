---
title: "Rust 迭代器"
description: "Rust 迭代器相关知识，包括创建迭代器、迭代器适配器和消耗型适配器。"
date: "2026-04-30"
tags: [Rust, 迭代器]
sidebar: auto
---

# Rust 迭代器

---

## 1. 创建迭代器

| 方法 | 说明 |
| :- | :- |
| **`.iter()`** | 返回集合的不可变引用迭代器 |
| **`.iter_mut()`** | 返回集合的可变引用迭代器 |
| **`.into_iter()`** | 将集合转移所有权并生成值迭代器 |

---

## 2. 迭代器适配器

迭代器适配器允许通过方法链来改变或过滤迭代器的内容，而不会立刻消耗它。

| 方法 | 说明 | 示例 |
| :- | :- | :- |
| `next()` | 返回迭代器中的下一个元素 | `let mut iter = (1..5).into_iter(); while let Some(val) = iter.next() {}` |
| `size_hint()` | 返回剩余元素数量的下界和上界 | `let iter = (1..10).into_iter(); println!("{:?}", iter.size_hint());` |
| `nth()` | 返回迭代器中第 n 个元素 | `let third = (0..10).into_iter().nth(2);` |
| `last()` | 返回迭代器中的最后一个元素 | `let last = (1..5).into_iter().last();` |
| `all()` | 如果所有元素都满足条件，返回 `true` | `let all_positive = (1..=5).into_iter().all(|x| x > 0);` |
| `any()` | 如果至少一个元素满足条件，返回 `true` | `let any_negative = (1..5).into_iter().any(|x| x < 0);` |
| `find()` | 返回第一个满足条件的元素 | `let first_even = (1..10).into_iter().find(|x| x % 2 == 0);` |
| `find_map()` | 应用函数，返回第一个 `Some` 结果 | `let first_letter = "hello".chars().find_map(|c| if c.is_alphabetic() { Some(c) } else { None });` |
| `map()` | 对每个元素应用一个函数 | `let squares: Vec\<i32\> = (1..5).into_iter().map(|x| x * x).collect();` |
| `filter()` | 保留满足条件的元素 | `let evens: Vec\<i32\> = (1..10).into_iter().filter(|x| x % 2 == 0).collect();` |
| `filter_map()` | 应用函数，保留返回 `Some` 的结果 | `let chars: Vec\<char\> = "hello".chars().filter_map(|c| if c.is_alphabetic() { Some(c.to_ascii_uppercase()) } else { None }).collect();` |
| `map_while()` | 应用函数，直到返回 `None` | `let first_three = (1..).into_iter().map_while(|x| if x <= 3 { Some(x) } else { None });` |
| `take_while()` | 取出满足条件的元素，直到不满足 | `let first_five = (1..10).into_iter().take_while(|x| x <= 5).collect::\<Vec\<_\>\>();` |
| `skip_while()` | 跳过满足条件的元素，直到不满足 | `let odds: Vec\<i32\> = (1..10).into_iter().skip_while(|x| x % 2 == 0).collect();` |
| `for_each()` | 对每个元素执行操作 | `(1..5).into_iter().for_each(|x| counter += x);` |
| `fold()` | 使用累加器折叠元素 | `let sum: i32 = (1..5).into_iter().fold(0, |acc, x| acc + x);` |
| `try_fold()` | 折叠，遇到错误时提前返回 | `let result: Result\<_, _\> = (1..5).into_iter().try_fold(0, |acc, x| if x == 3 { Err("Found 3") } else { Ok(acc + x) });` |
| `scan()` | 状态化的折叠 | `let sum: Vec\<i32\> = (1..5).into_iter().scan(0, |acc, x| { *acc += x; Some(*acc) }).collect();` |
| `take(n)` | 取出最多 n 个元素 | `let first_five = (1..10).into_iter().take(5).collect::\<Vec\<_\>\>();` |
| `skip(n)` | 跳过前 n 个元素 | `let after_five = (1..10).into_iter().skip(5).collect::\<Vec\<_\>\>();` |
| `zip()` | 将两个迭代器打包成元组 | `let zipped = (1..3).zip(&['a', 'b', 'c']).collect::\<Vec\<_\>\>();` |
| `cycle()` | 重复迭代器中的元素，直到无穷 | `let repeated = (1..3).into_iter().cycle().take(7).collect::\<Vec\<_\>\>();` |
| `chain()` | 连接多个迭代器 | `let combined = (1..3).chain(4..6).collect::\<Vec\<_\>\>();` |
| `rev()` | 反转元素顺序 | `let reversed = (1..4).into_iter().rev().collect::\<Vec\<_\>\>();` |
| `enumerate()` | 为每个元素添加索引 | `let enumerated = (1..4).into_iter().enumerate().collect::\<Vec\<_\>\>();` |
| `step_by()` | 按步长返回元素 | `let even_numbers = (0..10).into_iter().step_by(2).collect::\<Vec\<_\>\>();` |
| `fuse()` | 迭代器耗尽后仍可调用 `next()` | `let mut iter = (1..5).into_iter().fuse(); while iter.next().is_some() {}` |
| `inspect()` | 执行闭包但不改变元素 | `(1..5).into_iter().inspect(|x| println!("Inspecting: {}", x)).collect();` |

---

## 3. 消耗型适配器

消耗迭代器直到完全遍历，返回最终结果。

| 方法 | 说明 | 示例 |
| :- | :- | :- |
| `count()` | 计算迭代器中的元素数量 | `let count = (1..10).into_iter().count();` |
| `collect()` | 将迭代器转换为集合 | `let vec: Vec\<i32\> = (1..5).into_iter().collect();` |
| `sum()` | 计算所有元素的和 | `let sum: i32 = (1..5).into_iter().sum();` |
| `product()` | 计算所有元素的乘积 | `let product: i32 = (1..5).into_iter().product();` |