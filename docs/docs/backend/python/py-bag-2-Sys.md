---
title: "Python sys包"
description: "Python sys包相关知识。"
date: 2026-04-21
tags: [Python, sys]
sidebar: auto
---

## Py-Sys

## 1. 模块介绍

- **sys包**用于Python解释器以及系统参数的查看和操作

======================================================

## 2. 常用函数

| 分类           | 函数名                | 参数           | 作用                 | 使用场景          |
| ------------ | ------------------ | ------------ | ------------------ | ------------- |
| 程序相关         | `sys.argv`         | 无            | 命令行参数列表，第一个元素是脚本名称 | 处理命令行输入参数     |
|              | `sys.exit([arg])`  | arg: 退出码(可选) | 退出当前程序，可选指定退出码     | 程序异常或完成时退出    |
| Python 解释器相关 | `sys.platform`     | 无            | 返回当前操作系统平台标识符      | 跨平台兼容性判断      |
|              | `sys.version_info` | 无            | 返回包含版本号的命名元组       | 版本兼容性检查       |
|              | `sys.executable`   | 无            | 返回Python解释器可执行文件路径 | 查找Python解释器位置 |
|              | `sys.path`         | 无            | 模块搜索路径列表           | 动态添加模块搜索路径    |
|              | `sys.maxsize`      | 无            | 返回Python支持的最大整数    | 整数范围判断        |
| 标准输入输出相关     | `sys.stdin`        | 无            | 标准输入流对象            | 自定义输入处理       |
|              | `sys.stdout`       | 无            | 标准输出流对象            | 自定义输出处理       |
|              | `sys.stderr`       | 无            | 标准错误流对象            | 自定义错误处理       |

======================================================

## 3. 使用示例

### 3.1 处理命令行参数
```python
import sys

# 打印命令行参数
print(f"脚本名称: {sys.argv[0]}")
print(f"参数个数: {len(sys.argv) - 1}")
print(f"参数列表: {sys.argv[1:]}")
```

### 3.2 退出程序
```python
import sys

# 正常退出
sys.exit(0)

# 异常退出
sys.exit(1)
```

### 3.3 版本兼容性检查
```python
import sys

if sys.version_info >= (3, 6):
    print("Python 3.6+")
else:
    print("Python 3.5 or lower")
```

### 3.4 动态添加模块搜索路径
```python
import sys

# 添加自定义路径
sys.path.append("/path/to/modules")

# 打印当前路径
print(sys.path)
```

