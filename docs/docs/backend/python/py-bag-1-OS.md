---
title: "Python OS模块"

description: "Python OS模块相关知识，用于处理文件系统操作。"

date: "2026-04-21"

tags: [Python, OS模块, 文件系统]

sidebar: auto

---


#Python
# Py-OS

## 1. 模块介绍

- **OS包**用于处理文件系统
- **主要功能**：处理文件的CURD（创建、读取、更新、删除）

---

## 2. 常用函数

| 分类                | 函数名                          | 参数                       | 作用                |
| ----------------- | ---------------------------- | ------------------------ | ----------------- |
| **增加类**           | `os.mkdir()`                 | path: 目录路径               | 创建目录              |
|                   | `os.makedirs()`              | path: 目录路径               | 创建多级目录            |
| **删除类**           | `os.rmdir()`                 | path: 目录路径               | 删除目录              |
|                   | `os.remove(path)`            | path: 文件路径               | 删除文件              |
| **修改类**           | `os.rename(path1, path2)`    | path1: 源路径, path2: 目标路径  | 重命名文件或目录          |
|                   | `os.replace(path1, path2)`   | path1: 源路径, path2: 目标路径  | 替换文件或目录           |
|                   | `os.chdir(path)`             | path: 目标目录路径             | 改变当前工作目录          |
| **查找类**           | `os.getcwd()`                | 无                        | 获取当前工作目录          |
|                   | `os.listdir(path)`           | 无                        | 获取当前工作目录下的所有文件和目录 |
|                   | `os.stat(path)`              | path: 文件或目录路径            | 获取文件或目录的统计信息      |
|                   | `os.path.basename(path)`     | path: 路径                 | 获取文件名或目录名         |
|                   | `os.path.dirname(path)`      | path: 路径                 | 获取目录名             |
|                   | `os.path.abspath(path)`      | path: 路径                 | 获取绝对路径            |
| **校验类**           | `os.path.exists(path)`       | path: 路径                 | 校验路径是否存在          |
|                   | `os.path.isfile(path)`       | path: 路径                 | 校验是否为文件           |
|                   | `os.path.isdir(path)`        | path: 路径                 | 校验是否为目录           |
|                   | `os.path.isabs(path)`        | path: 路径                 | 校验是否为绝对路径         |
| **特殊用处类 - 环境变量类** | `os.environ`                 | 无                        | 获取环境变量            |
|                   | `os.getenv(key)`             | key: 环境变量名               | 获取环境变量的值          |
|                   | `os.putenv(key, value)`      | key: 环境变量名, value: 环境变量值 | 设置环境变量的值          |
| **特殊用处类 - 操作系统类** | `os.name`                    | 无                        | 获取操作系统            |
|                   | `os.sep`                     | 无                        | 获取路径分隔符           |
|                   | `os.system(cmd)`             | cmd: 系统命令                | 执行系统命令            |
| **特殊用处类 - 拼接**    | `os.path.join(path1, path2)` | path1: 路径1, path2: 路径2   | 拼接路径              |