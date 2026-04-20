---
title: "Python re包"
description: "Python re包相关知识。"
date: 2026-04-21
tags: [Python, re]
sidebar: auto
---

## Py-Re

## 2. 常用函数

# Python re包常用函数参考

| 函数名 | 必选参数 | 作用 |
|-------|---------|------|
| `re.compile(pattern[, flags])` | pattern: 正则表达式模式 | 编译正则表达式模式为模式对象 |
| `re.match(pattern, string[, flags])` | pattern: 正则表达式, string: 要匹配的字符串 | 从字符串开头开始匹配 |
| `re.search(pattern, string[, flags])` | pattern: 正则表达式, string: 要匹配的字符串 | 在字符串中搜索第一个匹配项 |
| `re.findall(pattern, string[, flags])` | pattern: 正则表达式, string: 要匹配的字符串 | 查找所有匹配项并返回列表 |
| `re.finditer(pattern, string[, flags])` | pattern: 正则表达式, string: 要匹配的字符串 | 查找所有匹配项并返回迭代器 |
| `re.sub(pattern, repl, string[, count, flags])` | pattern: 正则表达式, repl: 替换字符串, string: 要处理的字符串 | 替换匹配项 |
| `re.subn(pattern, repl, string[, count, flags])` | pattern: 正则表达式, repl: 替换字符串, string: 要处理的字符串 | 替换匹配项并返回替换次数 |
| `re.split(pattern, string[, maxsplit, flags])` | pattern: 正则表达式, string: 要分割的字符串 | 根据匹配分割字符串 |
| `re.escape(string)` | string: 要转义的字符串 | 转义字符串中的特殊字符 |
| `re.purge()` | 无 | 清除正则表达式缓存 |

## 常用参数说明

### 核心参数
| 参数名 | 类型 | 作用 |
|-------|------|------|
| `pattern` | str | 正则表达式模式字符串 |
| `string` | str | 要匹配或处理的字符串 |
| `repl` | str/callable | 替换字符串或替换函数 |
| `count` | int | 替换的最大次数 |
| `flags` | int | 正则表达式标志 |
| `maxsplit` | int | 最大分割次数 |

### 常用标志
| 标志 | 描述 |
|------|------|
| `re.IGNORECASE` 或 `re.I` | 忽略大小写 |
| `re.MULTILINE` 或 `re.M` | 多行模式，^和$匹配每行的开头和结尾 |
| `re.DOTALL` 或 `re.S` | 点号匹配所有字符，包括换行符 |
| `re.VERBOSE` 或 `re.X` | 详细模式，允许注释和空格 |
| `re.ASCII` 或 `re.A` | 仅ASCII模式，、等仅匹配ASCII字符 |

### 模式对象方法
| 方法名 | 作用 |
|-------|------|
| `pattern.match(string[, pos[, endpos]])` | 从指定位置开始匹配 |
| `pattern.search(string[, pos[, endpos]])` | 在指定范围内搜索 |
| `pattern.findall(string[, pos[, endpos]])` | 查找指定范围内的所有匹配项 |
| `pattern.finditer(string[, pos[, endpos]])` | 查找指定范围内的所有匹配项并返回迭代器 |
| `pattern.sub(repl, string[, count])` | 替换匹配项 |
| `pattern.subn(repl, string[, count])` | 替换匹配项并返回替换次数 |
| `pattern.split(string[, maxsplit])` | 根据匹配分割字符串 |