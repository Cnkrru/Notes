---
title: "Python hashlib包"
description: "Python hashlib包相关知识。"
date: 2026-04-21
tags: [Python, hashlib]
sidebar: auto
---

# Py-Hashlib

## 1. 模块介绍

- **hashlib包**提供了多种安全哈希算法，用于生成数据的哈希值
- **常用算法**：MD5、SHA1、SHA256、SHA512等
- **输出格式**：一般用hex格式，也可以字节形式digest

======================================================

## 2. 常用函数

| 函数名                      | 必选参数             | 作用             |
| ------------------------ | ---------------- | -------------- |
| `hashlib.md5([data])`    | data: 要哈希的数据(可选) | 创建MD5哈希对象      |
| `hashlib.sha1([data])`   | data: 要哈希的数据(可选) | 创建SHA1哈希对象     |
| `hashlib.sha256([data])` | data: 要哈希的数据(可选) | 创建SHA256哈希对象   |
| `hashlib.sha512([data])` | data: 要哈希的数据(可选) | 创建SHA512哈希对象   |
| `hash.update(data)`      | data: 要哈希的数据     | 更新哈希对象         |
| `hash.hexdigest()`       | 无                | 返回哈希值（十六进制字符串） |

======================================================

## 3. 哈希对象方法参数

| 方法名 | 参数 | 作用 |
|-------|------|------|
| `update(data)` | data: bytes | 使用data更新哈希对象的状态 |
| `digest()` | 无 | 返回当前哈希值，以字节串形式 |
| `hexdigest()` | 无 | 返回当前哈希值，以十六进制字符串形式 |
| `copy()` | 无 | 返回哈希对象的副本，状态与原对象相同 |

======================================================

## 4. 常用哈希算法

| 算法名称      | 输出长度 | 应用场景           |
| --------- | ---- | -------------- |
| `md5`     | 128位 | 一般数据完整性校验      |
| `sha1`    | 160位 | 数据完整性校验        |
| `sha256`  | 256位 | 安全敏感场景         |
| `sha512`  | 512位 | 高安全性要求场景       |

======================================================

## 5. 使用示例

### 5.1 基本使用
```python
import hashlib

# 使用MD5算法
hash_obj = hashlib.md5()
hash_obj.update(b'Hello, World!')
hash_value = hash_obj.hexdigest()
print(f"MD5哈希值: {hash_value}")

# 一步到位
hash_value = hashlib.md5(b'Hello, World!').hexdigest()
print(f"MD5哈希值: {hash_value}")
```

### 5.2 使用SHA256算法
```python
import hashlib

hash_obj = hashlib.sha256()
hash_obj.update(b'Hello, World!')
hash_value = hash_obj.hexdigest()
print(f"SHA256哈希值: {hash_value}")
```

### 5.3 处理大文件
```python
import hashlib

def hash_file(filename, algorithm='md5'):
    hash_obj = hashlib.new(algorithm)
    with open(filename, 'rb') as f:
        while chunk := f.read(8192):
            hash_obj.update(chunk)
    return hash_obj.hexdigest()

# 示例
hash_value = hash_file('example.txt')
print(f"文件哈希值: {hash_value}")
```
