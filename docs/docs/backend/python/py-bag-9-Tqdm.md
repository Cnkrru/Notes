---
title: "Python tqdm包"
description: "Python tqdm包相关知识。"
date: 2026-04-21
tags: [Python, tqdm]
sidebar: auto
---

## Py-Tqdm

## 2. 常用函数

# Python tqdm包常用函数参考

| 函数名 | 必选参数 | 作用 |
|-------|---------|------|
| `tqdm(iterable[, desc, total, leave, file, ncols, ...])` | iterable: 可迭代对象 | 创建进度条 |
| `trange(*args, **kwargs)` | *args: range参数 | 创建基于range的进度条 |
| `tqdm.notebook.tqdm(iterable[, desc, total, ...])` | iterable: 可迭代对象 | 在Jupyter Notebook中创建进度条 |
| `tqdm.auto.tqdm(iterable[, desc, total, ...])` | iterable: 可迭代对象 | 自动选择合适的进度条类型 |
| `tqdm.write(s[, file, end])` | s: 要写入的字符串 | 在进度条旁安全地写入文本 |
| `tqdm.tqdm.pandas([desc])` | 无 | 为pandas操作添加进度条 |
| `tqdm.contrib.concurrent.process_map(func, iterable[, ...])` | func: 函数, iterable: 可迭代对象 | 并行处理可迭代对象并显示进度条 |
| `tqdm.contrib.concurrent.thread_map(func, iterable[, ...])` | func: 函数, iterable: 可迭代对象 | 多线程处理可迭代对象并显示进度条 |
| `tqdm.contrib.telegram.tqdm(iterable[, token, chat_id, ...])` | iterable: 可迭代对象 | 创建Telegram通知进度条 |
| `tqdm.contrib.discord.tqdm(iterable[, token, channel_id, ...])` | iterable: 可迭代对象 | 创建Discord通知进度条 |

## 常用参数说明

### 核心参数
| 参数名 | 类型 | 作用 |
|-------|------|------|
| `iterable` | iterable | 要迭代的对象 |
| `desc` | str | 进度条描述文本 |
| `total` | int | 总迭代次数 |
| `leave` | bool | 迭代结束后是否保留进度条 |
| `file` | file-like | 输出文件对象 |
| `ncols` | int | 进度条宽度 |
| `mininterval` | float | 最小更新间隔(秒) |
| `maxinterval` | float | 最大更新间隔(秒) |
| `miniters` | int | 最小更新迭代次数 |
| `ascii` | bool/str | 使用ASCII字符 |
| `unit` | str | 单位名称 |
| `unit_scale` | bool/float | 自动缩放单位 |
| `dynamic_ncols` | bool | 动态调整宽度 |
| `smoothing` | float | 进度条平滑度 |
| `bar_format` | str | 自定义进度条格式 |
| `initial` | int | 初始计数 |
| `position` | int | 进度条位置 |
| `postfix` | dict | 后缀信息 |

### trange参数
| 参数名 | 类型 | 作用 |
|-------|------|------|
| `start` | int | 起始值 |
| `stop` | int | 结束值 |
| `step` | int | 步长 |
| `desc` | str | 进度条描述文本 |
| `total` | int | 总迭代次数 |

## 常用方法

| 方法名 | 作用 |
|-------|------|
| `tqdm.update(n=1)` | 手动更新进度条 |
| `tqdm.refresh()` | 刷新进度条显示 |
| `tqdm.reset(total=None)` | 重置进度条 |
| `tqdm.close()` | 关闭进度条 |
| `tqdm.set_description(desc)` | 设置进度条描述 |
| `tqdm.set_postfix(**kwargs)` | 设置进度条后缀信息 |
| `tqdm.set_postfix_str(s)` | 设置进度条后缀字符串 |

## 示例用法

### 基本用法
```python
from tqdm import tqdm
import time

# 基本用法
for i in tqdm(range(100)):
    time.sleep(0.01)

# 使用desc参数
for i in tqdm(range(100), desc="Processing"):
    time.sleep(0.01)

# 使用trange
from tqdm import trange

for i in trange(100, desc="Counting"):
    time.sleep(0.01)

# 手动更新
with tqdm(total=100) as pbar:
    for i in range(100):
        time.sleep(0.01)
        pbar.update(1)

# 设置后缀信息
with tqdm(total=100) as pbar:
    for i in range(100):
        time.sleep(0.01)
        pbar.update(1)
        pbar.set_postfix({'current': i})
```

### 高级用法
```python
# 并行处理
from tqdm.contrib.concurrent import process_map

def process_func(x):
    time.sleep(0.1)
    return x * x

results = process_map(process_func, range(100))

# pandas集成
tqdm.pandas(desc="Processing")
df['new_column'] = df['old_column'].progress_apply(lambda x: x * 2)

# 多进度条
from tqdm import tqdm

with tqdm(total=100, position=0, desc="First") as pbar1, \
     tqdm(total=100, position=1, desc="Second") as pbar2:
    for i in range(100):
        time.sleep(0.01)
        pbar1.update(1)
        pbar2.update(1)
```