---
title: "Python keyboard包"
description: "Python keyboard包相关知识。"
date: 2026-04-21
tags: [Python, keyboard]
sidebar: auto
---

## Py-keyboard

## 2. 常用函数

# Python keyboard包常用函数参考

| 函数名 | 必选参数 | 作用 |
|-------|---------|------|
| `keyboard.press(key)` | key: 按键名称 | 按下指定按键 |
| `keyboard.release(key)` | key: 按键名称 | 释放指定按键 |
| `keyboard.press_and_release(hotkey)` | hotkey: 按键或组合键 | 按下并释放按键 |
| `keyboard.write(text[, delay])` | text: 要输入的文本 | 模拟键盘输入文本 |
| `keyboard.send(hotkey[, do_press, do_release])` | hotkey: 按键或组合键 | 发送按键事件 |
| `keyboard.add_hotkey(hotkey, callback[, args, kwargs, suppress, timeout])` | hotkey: 热键, callback: 回调函数 | 注册热键 |
| `keyboard.on_press(callback)` | callback: 回调函数 | 注册按键按下事件监听器 |
| `keyboard.on_release(callback)` | callback: 回调函数 | 注册按键释放事件监听器 |
| `keyboard.on_press_key(key, callback)` | key: 按键, callback: 回调函数 | 注册特定按键按下事件监听器 |
| `keyboard.on_release_key(key, callback)` | key: 按键, callback: 回调函数 | 注册特定按键释放事件监听器 |
| `keyboard.wait([hotkey, timeout])` | hotkey: 等待的按键(可选) | 等待按键按下 |
| `keyboard.read_key([suppress])` | 无 | 读取单个按键 |
| `keyboard.read_hotkey([suppress])` | 无 | 读取热键组合 |
| `keyboard.record([until, suppress])` | until: 停止录制的按键(可选) | 录制按键事件 |
| `keyboard.play(recorded_events[, speed_factor])` | recorded_events: 录制的事件 | 回放录制的按键事件 |
| `keyboard.remove_hotkey(hotkey)` | hotkey: 热键 | 移除热键 |
| `keyboard.unhook_all()` | 无 | 移除所有事件监听器 |
| `keyboard.is_pressed(key)` | key: 按键 | 检查按键是否被按下 |
| `keyboard.stash_state()` | 无 | 保存当前按键状态 |
| `keyboard.restore_state(state)` | state: 按键状态 | 恢复按键状态 |

## 常用参数说明

### 核心参数
| 参数名 | 类型 | 作用 |
|-------|------|------|
| `key` | str | 按键名称，如'a', 'ctrl', 'shift'等 |
| `hotkey` | str | 热键组合，如'ctrl+c', 'alt+tab'等 |
| `text` | str | 要输入的文本内容 |
| `callback` | function | 事件触发时调用的回调函数 |
| `args` | tuple | 传递给回调函数的位置参数 |
| `kwargs` | dict | 传递给回调函数的关键字参数 |
| `suppress` | bool | 是否阻止按键事件传递给其他程序 |
| `delay` | float | 按键之间的延迟时间(秒) |
| `timeout` | float | 超时时间(秒) |
| `speed_factor` | float | 回放速度因子 |

### 按键名称
| 按键类型 | 示例 | 说明 |
|---------|------|------|
| 字母数字 | 'a', '1', '5' | 普通字母和数字键 |
| 功能键 | 'f1', 'esc', 'enter' | 功能键和特殊键 |
| 修饰键 | 'ctrl', 'shift', 'alt' | 修饰键 |
| 方向键 | 'up', 'down', 'left', 'right' | 方向键 |
| 组合键 | 'ctrl+c', 'alt+tab' | 修饰键组合 |
| 鼠标按键 | 'left', 'right', 'middle' | 鼠标按键(部分系统支持) |