---
title: "Python logging包"
description: "Python logging包相关知识。"
date: 2026-04-21
tags: [Python, logging]
sidebar: auto
---

## Py-Logging

## 1. 模块介绍

- **logging包**提供了灵活的日志记录系统，用于记录应用程序的运行状态、错误信息等
- **适用场景**：应用程序监控、错误追踪、性能分析等

======================================================

## 2. 日志级别

| 级别 | 数值 | 描述 |
| ---- | ---- | ---- |
| DEBUG | 10 | 详细的调试信息 |
| INFO | 20 | 一般信息 |
| WARNING | 30 | 警告信息 |
| ERROR | 40 | 错误信息 |
| CRITICAL | 50 | 严重错误信息 |

======================================================

## 3. 常用函数

| 分类     | 函数名                                       | 必选参数 | 作用        |
| ------ | ----------------------------------------- | ---- | --------- |
| 配置操作   | `logging.basicConfig(**kwargs)`           | 无    | 配置基础日志系统  |
| 日志记录   | `logging.debug(msg, *args, **kwargs)`     | msg  | 记录调试级别的消息 |
|          | `logging.info(msg, *args, **kwargs)`      | msg  | 记录信息级别的消息 |
|          | `logging.warning(msg, *args, **kwargs)`   | msg  | 记录警告级别的消息 |
|          | `logging.error(msg, *args, **kwargs)`     | msg  | 记录错误级别的消息 |
|          | `logging.critical(msg, *args, **kwargs)`  | msg  | 记录严重错误级别的消息 |
|          | `logging.exception(msg, *args, **kwargs)` | msg  | 记录异常信息    |

======================================================

## 4. 配置选项

### 4.1 basicConfig参数

| 参数 | 描述 |
| ---- | ---- |
| level | 设置日志级别 |
| format | 设置日志格式 |
| datefmt | 设置日期时间格式 |
| filename | 设置日志文件路径 |
| filemode | 设置文件打开模式（'w'或'a'） |
| stream | 设置输出流 |

### 4.2 日志格式占位符

| 占位符 | 描述 |
| ------ | ---- |
| %(asctime)s | 日志记录的时间 |
| %(levelname)s | 日志级别 |
| %(message)s | 日志消息 |
| %(name)s | 日志器名称 |
| %(filename)s | 文件名 |
| %(lineno)d | 行号 |
| %(funcName)s | 函数名 |

======================================================

## 5. 使用示例

### 5.1 基本使用
```python
import logging

# 配置日志系统
logging.basicConfig(
    level=logging.INFO,  # 设置日志级别为INFO
    format='%(asctime)s - %(levelname)s - %(message)s',  # 日志格式
    filename='app.log',  # 输出到文件
    filemode='a'  # 追加模式
)

# 记录不同级别的日志
logging.debug('这是一条调试信息')  # 不会显示，因为级别低于INFO
logging.info('应用启动成功')
logging.warning('配置文件缺失，使用默认配置')
logging.error('API调用失败: 404 Not Found')
logging.critical('数据库连接失败')
```

### 5.2 记录异常
```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

try:
    # 模拟可能引发异常的操作
    result = 10 / 0
except Exception as e:
    # 记录异常，自动包含堆栈跟踪
    logging.exception('发生除零错误:')
```

### 5.3 使用日志器
```python
import logging

# 创建日志器
logger = logging.getLogger('my_app')
logger.setLevel(logging.INFO)

# 创建文件处理器
file_handler = logging.FileHandler('app.log')
file_handler.setLevel(logging.INFO)

# 创建控制台处理器
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.WARNING)

# 设置格式
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
file_handler.setFormatter(formatter)
console_handler.setFormatter(formatter)

# 添加处理器
logger.addHandler(file_handler)
logger.addHandler(console_handler)

# 使用日志器
logger.info('应用启动')
logger.warning('配置警告')
logger.error('发生错误')
```

