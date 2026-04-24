---
title: "Python time模块"

description: "Python time模块相关知识。"

date: "2026-04-21"

tags: [Python, time]

sidebar: auto

---


## Py-Time-Datetime

## 1. 模块介绍

- **time模块**：提供时间相关的函数，如时间戳获取、程序暂停等
- **datetime模块**：提供更高级的日期和时间处理功能，如日期对象、时间间隔等

---

## 2. time模块

| 分类       | 作用    | 函数名                   | 参数            |
| -------- | ----- | --------------------- | ------------- |
| **时间获取** | 当前时间戳 | `time.time()`         | 无             |
|          | 单增计数器 | `time.monotonic()`    | 无             |
|          | 性能计数器 | `time.perf_counter()` | 无             |
| **程序控制** | 暂停执行  | `time.sleep(secs)`    | secs: 睡眠时间(秒) |

---

## 3. datetime模块

| 分类        | 作用           | 函数名                                                           | 参数                                 |
| --------- | ------------ | ------------------------------------------------------------- | ---------------------------------- |
| **对象创建**  | 创建指定时间对象     | `datetime.datetime(year, month, day[, hour, minute, second])` | year: 年, month: 月, day: 日          |
|          | 创建时间间隔       | `datetime.timedelta(days=0, seconds=0, ...)`                  | 无                                  |
| **当前时间**  | 当前本地日期时间     | `datetime.datetime.now([tz])`                                 | tz: 时区(可选)                         |
|          | 当前日期         | `datetime.date.today()`                                       | 无                                  |
| **时间戳转换** | 时间戳转datetime | `datetime.datetime.fromtimestamp(timestamp[, tz])`            | timestamp: 时间戳                     |
|          | datetime转时间戳 | `date.timestamp()`                                            | 无                                  |
| **字符串转换** | 字符串转datetime | `datetime.datetime.strptime(date_string, format)`             | date_string: 日期字符串, format: 格式字符串 |
|          | datetime转字符串 | `date.strftime(format)`                                       | format: 格式字符串                      |
| **属性访问**  | 获取年、月、日      | `date.year`, `date.month`, `date.day`                         | 无                                  |
|          | 获取时、分、秒      | `date.hour`, `date.minute`, `date.second`                     | 无                                  |
|          | 获取星期几        | `date.weekday()`                                              | 无                                  |
| **常用方法**  | 替换属性         | `date.replace(year=None, month=None, day=None, ...)`          | 无                                  |

---

## 4. 时间元组结构

| 索引 | 字段 | 取值范围 |
|------|------|----------|
| 0 | 年 | 如2023 |
| 1 | 月 | 1-12 |
| 2 | 日 | 1-31 |
| 3 | 时 | 0-23 |
| 4 | 分 | 0-59 |
| 5 | 秒 | 0-59 |
| 6 | 星期 | 0-6 (0表示周一) |
| 7 | 一年中的第几天 | 1-366 |
| 8 | 夏令时标志 | -1, 0, 1 |

---

## 5. 常用strftime格式字符

| 格式字符 | 含义       | 示例                      |
| ---- | -------- | ----------------------- |
| `%Y` | 四位年份     | 2023                    |
| `%m` | 两位月份     | 01-12                   |
| `%d` | 两位日期     | 01-31                   |
| `%H` | 24小时制小时  | 00-23                   |
| `%M` | 分钟       | 00-59                   |
| `%S` | 秒        | 00-59                   |
| `%A` | 星期全名     | Monday                  |
| `%a` | 星期缩写     | Mon                     |
| `%B` | 月份全名     | January                 |
| `%b` | 月份缩写     | Jan                     |
| `%x` | 本地日期格式   | 01/01/23                |
| `%X` | 本地时间格式   | 12:00:00                |
| `%c` | 本地日期时间格式 | Mon Jan 1 12:00:00 2023 |

---

## 6. 使用示例

### 6.1 time模块使用
```python
import time

# 获取当前时间戳
print(time.time())  # 输出: 1620000000.0

# 暂停执行
time.sleep(2)  # 暂停2秒

# 性能计数器
start = time.perf_counter()
# 执行一些操作
end = time.perf_counter()
print(f"执行时间: {end - start} 秒")
```

### 6.2 datetime模块使用
```python
from datetime import datetime, date, timedelta

# 获取当前日期时间
now = datetime.now()
print(now)  # 输出: 2023-01-01 12:00:00.000000

# 获取当前日期
today = date.today()
print(today)  # 输出: 2023-01-01

# 创建指定时间对象
specific_date = datetime(2023, 12, 25, 10, 30, 0)
print(specific_date)  # 输出: 2023-12-25 10:30:00

# 时间戳转换
timestamp = 1620000000
dt_from_timestamp = datetime.fromtimestamp(timestamp)
print(dt_from_timestamp)  # 输出: 2021-05-03 13:20:00

# 字符串转换
date_string = "2023-12-25"
dt_from_string = datetime.strptime(date_string, "%Y-%m-%d")
print(dt_from_string)  # 输出: 2023-12-25 00:00:00

# 格式化输出
formatted_date = now.strftime("%Y-%m-%d %H:%M:%S")
print(formatted_date)  # 输出: 2023-01-01 12:00:00

# 时间间隔
delta = timedelta(days=7)
next_week = today + delta
print(next_week)  # 输出: 2023-01-08

# 属性访问
print(now.year)  # 输出: 2023
print(now.month)  # 输出: 1
print(now.day)  # 输出: 1
print(now.hour)  # 输出: 12

# 替换属性
new_date = now.replace(year=2024)
print(new_date)  # 输出: 2024-01-01 12:00:00.000000
```