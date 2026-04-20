---
title: "Python pyautogui包"
description: "Python pyautogui包常用函数参考，包括鼠标操作、键盘操作、屏幕截图等自动化操作。"
date: 2026-04-21
tags: [Python, pyautogui, 自动化]
sidebar: auto
---

# Python pyautogui包常用函数参考

| 函数名 | 必选参数 | 作用 |
|-------|---------|------|
| `pyautogui.moveTo(x, y[, duration])` | x: 横坐标, y: 纵坐标 | 移动鼠标到指定位置 |
| `pyautogui.moveRel(xOffset, yOffset[, duration])` | xOffset: 水平偏移, yOffset: 垂直偏移 | 相对当前位置移动鼠标 |
| `pyautogui.click([x, y, clicks, interval, button])` | 无 | 点击鼠标 |
| `pyautogui.rightClick([x, y, interval])` | 无 | 右键点击鼠标 |
| `pyautogui.middleClick([x, y, interval])` | 无 | 中键点击鼠标 |
| `pyautogui.doubleClick([x, y, interval, button])` | 无 | 双击鼠标 |
| `pyautogui.tripleClick([x, y, interval, button])` | 无 | 三击鼠标 |
| `pyautogui.mouseDown([x, y, button])` | 无 | 按下鼠标按键 |
| `pyautogui.mouseUp([x, y, button])` | 无 | 释放鼠标按键 |
| `pyautogui.scroll(clicks[, x, y])` | clicks: 滚动次数 | 滚动鼠标滚轮 |
| `pyautogui.hscroll(clicks[, x, y])` | clicks: 滚动次数 | 水平滚动鼠标滚轮 |
| `pyautogui.vscroll(clicks[, x, y])` | clicks: 滚动次数 | 垂直滚动鼠标滚轮 |
| `pyautogui.typewrite(message[, interval])` | message: 要输入的文本 | 模拟键盘输入 |
| `pyautogui.press(keys[, presses, interval])` | keys: 按键名称 | 按下并释放按键 |
| `pyautogui.hotkey(*args[, interval])` | args: 热键组合 | 按下热键组合 |
| `pyautogui.keyDown(key)` | key: 按键名称 | 按下按键 |
| `pyautogui.keyUp(key)` | key: 按键名称 | 释放按键 |
| `pyautogui.screenshot([imageFilename, region])` | 无 | 截取屏幕截图 |
| `pyautogui.locateOnScreen(image[, grayscale, confidence])` | image: 图片路径 | 在屏幕上查找图片 |
| `pyautogui.locateCenterOnScreen(image[, grayscale, confidence])` | image: 图片路径 | 查找图片并返回中心点坐标 |
| `pyautogui.getWindowsWithTitle(title)` | title: 窗口标题 | 获取匹配标题的窗口 |
| `pyautogui.getActiveWindow()` | 无 | 获取当前活动窗口 |
| `pyautogui.size()` | 无 | 获取屏幕尺寸 |
| `pyautogui.position()` | 无 | 获取当前鼠标位置 |
| `pyautogui.onScreen(x, y)` | x: 横坐标, y: 纵坐标 | 检查坐标是否在屏幕上 |
| `pyautogui.alert(text[, title, button])` | text: 提示文本 | 显示警告对话框 |
| `pyautogui.confirm(text[, title, buttons])` | text: 提示文本 | 显示确认对话框 |
| `pyautogui.prompt(text[, title, default])` | text: 提示文本 | 显示输入对话框 |
| `pyautogui.password(text[, title, default, mask])` | text: 提示文本 | 显示密码输入对话框 |

## 常用参数说明

### 核心参数
| 参数名 | 类型 | 作用 |
|-------|------|------|
| `x, y` | int | 鼠标坐标 |
| `xOffset, yOffset` | int | 鼠标相对偏移量 |
| `duration` | float | 操作持续时间(秒) |
| `button` | str | 鼠标按键，如'left', 'right', 'middle' |
| `clicks` | int | 点击次数 |
| `interval` | float | 点击间隔时间(秒) |
| `message` | str | 要输入的文本 |
| `keys` | str/list | 按键名称或按键列表 |
| `imageFilename` | str | 截图保存路径 |
| `region` | tuple | 截图区域(x, y, width, height) |
| `image` | str | 要查找的图片路径 |
| `confidence` | float | 图片匹配的置信度 |
| `text` | str | 对话框文本 |
| `title` | str | 对话框标题 |
| `button` | str | 对话框按钮文本 |

### 按键名称
| 按键类型 | 示例 | 说明 |
|---------|------|------|
| 字母数字 | 'a', '1', '5' | 普通字母和数字键 |
| 功能键 | 'f1', 'esc', 'enter' | 功能键和特殊键 |
| 修饰键 | 'ctrl', 'shift', 'alt' | 修饰键 |
| 方向键 | 'up', 'down', 'left', 'right' | 方向键 |
| 其他特殊键 | 'tab', 'space', 'backspace' | 其他特殊键 |

### 对话框参数
| 参数名       | 类型   | 作用         |
| --------- | ---- | ---------- |
| `text`    | str  | 对话框显示的文本内容 |
| `title`   | str  | 对话框标题      |
| `button`  | str  | 对话框按钮文本    |
| `buttons` | list | 确认对话框的按钮列表 |
| `default` | str  | 输入对话框的默认值  |
| `mask`    | str  | 密码对话框的掩码字符 |