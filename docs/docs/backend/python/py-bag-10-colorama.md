---
title: "Python colorama包"

description: "Python colorama包相关知识。"

date: "2026-04-21"

tags: [Python, colorama]

sidebar: auto

---


## Py-colorama

## 2. 常用函数

# Python colorama包常用函数参考

| 函数名 | 必选参数 | 作用 |
|-------|---------|------|
| `colorama.init([autoreset, convert, strip, wrap])` | 无 | 初始化colorama |
| `colorama.Fore` | 无 | 前景色常量 |
| `colorama.Back` | 无 | 背景色常量 |
| `colorama.Style` | 无 | 样式常量 |
| `colorama.deinit()` | 无 | 清理colorama |
| `colorama.reinit()` | 无 | 重新初始化colorama |

## 常用参数说明

### init参数
| 参数名 | 类型 | 作用 |
|-------|------|------|
| `autoreset` | bool | 是否自动重置颜色 |
| `convert` | bool | 是否在Windows上转换ANSI代码 |
| `strip` | bool | 是否在非Windows平台上剥离ANSI代码 |
| `wrap` | bool | 是否包装sys.stdout/stderr |

## 常用常量

### 前景色常量
| 常量 | 作用 |
|------|------|
| `Fore.BLACK` | 黑色前景 |
| `Fore.RED` | 红色前景 |
| `Fore.GREEN` | 绿色前景 |
| `Fore.YELLOW` | 黄色前景 |
| `Fore.BLUE` | 蓝色前景 |
| `Fore.MAGENTA` | 洋红色前景 |
| `Fore.CYAN` | 青色前景 |
| `Fore.WHITE` | 白色前景 |
| `Fore.RESET` | 重置前景色 |

### 背景色常量
| 常量 | 作用 |
|------|------|
| `Back.BLACK` | 黑色背景 |
| `Back.RED` | 红色背景 |
| `Back.GREEN` | 绿色背景 |
| `Back.YELLOW` | 黄色背景 |
| `Back.BLUE` | 蓝色背景 |
| `Back.MAGENTA` | 洋红色背景 |
| `Back.CYAN` | 青色背景 |
| `Back.WHITE` | 白色背景 |
| `Back.RESET` | 重置背景色 |

### 样式常量
| 常量 | 作用 |
|------|------|
| `Style.DIM` | 暗淡模式 |
| `Style.NORMAL` | 正常模式 |
| `Style.BRIGHT` | 明亮模式 |
| `Style.RESET_ALL` | 重置所有样式 |

## 示例用法

### 基本用法
```python
import colorama

# 初始化colorama
colorama.init()

# 打印彩色文本
print(colorama.Fore.RED + "红色文本" + colorama.Style.RESET_ALL)
print(colorama.Back.GREEN + "绿色背景" + colorama.Style.RESET_ALL)
print(colorama.Style.BRIGHT + "明亮文本" + colorama.Style.RESET_ALL)

# 组合使用
print(colorama.Fore.BLUE + colorama.Back.YELLOW + "蓝底黄字" + colorama.Style.RESET_ALL)

# 自动重置
colorama.init(autoreset=True)
print(colorama.Fore.GREEN + "绿色文本，自动重置")
print("这行文本恢复默认颜色")

# 清理
colorama.deinit()
```

### 实际应用
```python
import colorama

colorama.init()

# 成功消息
print(colorama.Fore.GREEN + "✓ 操作成功" + colorama.Style.RESET_ALL)

# 错误消息
print(colorama.Fore.RED + "✗ 操作失败" + colorama.Style.RESET_ALL)

# 警告消息
print(colorama.Fore.YELLOW + "⚠ 警告信息" + colorama.Style.RESET_ALL)

# 信息消息
print(colorama.Fore.CYAN + "ℹ 提示信息" + colorama.Style.RESET_ALL)

# 标题样式
print(colorama.Style.BRIGHT + colorama.Fore.BLUE + "=== 标题 ===" + colorama.Style.RESET_ALL)

# 强调文本
print(f"普通文本 {colorama.Style.BRIGHT + colorama.Fore.GREEN}强调文本{colorama.Style.RESET_ALL} 普通文本")
```