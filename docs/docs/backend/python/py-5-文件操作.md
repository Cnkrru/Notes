---
title: "Python 文件操作"
description: "Python 文件操作相关知识，包括文件的打开、关闭、读取、写入等操作。"
date: 2026-04-21
tags: [Python, 文件操作]
sidebar: auto
---

#Python
# 文件操作

## 1. 文件打开与关闭

### 打开文件
```python
# 基本语法
file = open('文件路径', '模式')

# 常见模式
# 'r' - 只读模式（默认）
# 'w' - 写入模式（覆盖原有内容）
# 'a' - 追加模式（在文件末尾添加内容）
# 'b' - 二进制模式
# '+' - 读写模式
```

### 关闭文件
```python
file.close()
```

### 使用 with 语句（推荐）
```python
with open('文件路径', '模式') as file:
    # 文件操作
# 自动关闭文件
```

======================================================

## 2. 文件读取

### 读取全部内容
```python
with open('file.txt', 'r', encoding='utf-8') as file:
    content = file.read()
    print(content)
```

### 逐行读取
```python
with open('file.txt', 'r', encoding='utf-8') as file:
    for line in file:
        print(line.strip())
```

### 读取指定字节数
```python
with open('file.txt', 'r', encoding='utf-8') as file:
    content = file.read(100)  # 读取前100个字符
    print(content)
```

======================================================

## 3. 文件写入

### 写入内容
```python
with open('file.txt', 'w', encoding='utf-8') as file:
    file.write('Hello, World!\n')
    file.write('This is a test.\n')
```

### 追加内容
```python
with open('file.txt', 'a', encoding='utf-8') as file:
    file.write('This is an append.\n')
```

======================================================

## 4. 文件定位

### 获取当前位置
```python
with open('file.txt', 'r', encoding='utf-8') as file:
    position = file.tell()
    print(f'当前位置: {position}')
```

### 移动位置
```python
with open('file.txt', 'r', encoding='utf-8') as file:
    file.seek(10)  # 移动到第10个字节
    content = file.read()
    print(content)
```

======================================================

## 5. 文件属性

### 获取文件信息
```python
import os

# 文件大小
file_size = os.path.getsize('file.txt')
print(f'文件大小: {file_size} 字节')

# 文件修改时间
import time
mod_time = os.path.getmtime('file.txt')
print(f'修改时间: {time.ctime(mod_time)}')

# 文件是否存在
if os.path.exists('file.txt'):
    print('文件存在')
else:
    print('文件不存在')
```

======================================================

## 6. 目录操作

### 创建目录
```python
import os

# 创建单个目录
os.mkdir('new_directory')

# 创建嵌套目录
os.makedirs('parent/child/grandchild', exist_ok=True)
```

### 删除目录
```python
import os

# 删除空目录
os.rmdir('empty_directory')

# 删除非空目录
import shutil
shutil.rmtree('non_empty_directory')
```

### 列出目录内容
```python
import os

# 列出目录中的文件和子目录
entries = os.listdir('directory')
for entry in entries:
    print(entry)
```