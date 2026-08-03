---
title: "Python mouse包"

description: "Python mouse包相关知识。"

date: "2026-04-21"

tags: [Python, mouse]

sidebar: auto

---


## Py-mouse

## 2. 常用函数

# Python mouse包常用函数参考

| 函数名 | 必选参数 | 作用 |
|-------|---------|------|
| `mouse.move(x, y[, absolute, duration])` | x: 横坐标, y: 纵坐标 | 移动鼠标到指定位置 |
| `mouse.click([x, y, button, absolute, duration])` | 无 | 点击鼠标 |
| `mouse.right_click([x, y, absolute, duration])` | 无 | 右键点击鼠标 |
| `mouse.double_click([x, y, button, absolute, duration])` | 无 | 双击鼠标 |
| `mouse.press([button])` | button: 按键(可选) | 按下鼠标按键 |
| `mouse.release([button])` | button: 按键(可选) | 释放鼠标按键 |
| `mouse.wheel(delta)` | delta: 滚轮增量 | 滚动鼠标滚轮 |
| `mouse.get_position()` | 无 | 获取当前鼠标位置 |
| `mouse.on_move(callback)` | callback: 回调函数 | 注册鼠标移动事件监听器 |
| `mouse.on_click(callback[, buttons])` | callback: 回调函数 | 注册鼠标点击事件监听器 |
| `mouse.on_right_click(callback)` | callback: 回调函数 | 注册鼠标右键点击事件监听器 |
| `mouse.on_middle_click(callback)` | callback: 回调函数 | 注册鼠标中键点击事件监听器 |
| `mouse.on_scroll(callback)` | callback: 回调函数 | 注册鼠标滚轮事件监听器 |
| `mouse.wait([button])` | button: 等待的按键(可选) | 等待鼠标按键按下 |
| `mouse.record([button])` | button: 停止录制的按键(可选) | 录制鼠标事件 |
| `mouse.play(events[, speed_factor])` | events: 录制的事件 | 回放录制的鼠标事件 |
| `mouse.unhook_all()` | 无 | 移除所有事件监听器 |
| `mouse.is_pressed([button])` | button: 按键(可选) | 检查鼠标按键是否被按下 |
| `mouse.hook(callback)` | callback: 回调函数 | 注册全局鼠标事件监听器 |
| `mouse.unhook(callback)` | callback: 回调函数 | 移除指定的事件监听器 |

## 常用参数说明

### 核心参数
| 参数名 | 类型 | 作用 |
|-------|------|------|
| `x` | int/float | 鼠标横坐标 |
| `y` | int/float | 鼠标纵坐标 |
| `button` | str | 鼠标按键，如'left', 'right', 'middle' |
| `delta` | int | 鼠标滚轮滚动的增量 |
| `absolute` | bool | 是否使用绝对坐标 |
| `duration` | float | 鼠标移动的持续时间(秒) |
| `callback` | function | 事件触发时调用的回调函数 |
| `buttons` | int | 要监听的鼠标按键 |
| `speed_factor` | float | 回放速度因子 |

### 按键名称
| 按键名称 | 说明 |
|---------|------|
| `'left'` | 鼠标左键 |
| `'right'` | 鼠标右键 |
| `'middle'` | 鼠标中键 |

### 事件回调函数参数
| 参数名      | 类型    | 说明                |
| -------- | ----- | ----------------- |
| `event`  | dict  | 事件对象，包含事件类型、位置等信息 |
| `x`      | int   | 事件发生时的鼠标横坐标       |
| `y`      | int   | 事件发生时的鼠标纵坐标       |
| `button` | str   | 触发事件的鼠标按键         |
| `time`   | float | 事件发生的时间戳          |