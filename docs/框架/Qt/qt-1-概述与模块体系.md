## 什么是 Qt

Qt 是一个跨平台的 C++ 应用程序开发框架，由 Qt Company 维护。它广泛用于桌面应用、嵌入式系统、移动应用和车载系统的开发。Qt 6 是最新的主版本，在图形渲染架构、QML 引擎、多媒体后端等方面进行了全面升级。

## 核心架构

Qt 6 采用模块化设计，所有功能被划分为不同的模块，开发者可以按需引入。模块分为两大类别：

- **基础模块（Essentials）**：在所有支持的平台上可用，保证源码和二进制兼容。包括 Qt Core、Qt GUI、Qt Widgets、Qt Network、Qt QML、Qt Quick、Qt Test 等。
- **附加模块（Add-Ons）**：针对特定场景，可能在部分平台可用。包括 Qt Multimedia、Qt SQL、Qt Concurrent、Qt WebEngine、Qt Charts 等。

## 两大开发范式

Qt 提供了两种主要的 UI 开发范式：

### Qt Widgets（传统 C++ UI）

基于 C++ 的经典桌面 UI 开发方式，使用 QMainWindow、QPushButton、QLabel 等控件，结合布局管理器（QVBoxLayout、QHBoxLayout）构建界面。适合传统桌面应用，性能稳定，控件成熟。

> 注：本项目仅使用 QML 进行 UI 开发，Qt Widgets 不再作为主要开发方式。

### Qt Quick / QML（声明式 UI）

基于 QML（Qt Modeling Language）的现代声明式 UI 开发方式。QML 是一种类似 JSON 的声明式语言，内嵌 JavaScript 支持，特别适合构建流畅、动画丰富的现代用户界面。Qt Quick 提供了 QML 的标准组件库。

## 文档分类导航

本 Qt 知识库按三层架构组织文档，帮助开发者快速定位所需内容：

- **UI 层 (QML)** — 纯 QML 声明式 UI 开发，包含 QML 基础、布局、控件、动画，以及 QML 与 HTML+CSS+JS 的对照
- **后端层 (C++)** — Qt 核心模块、网络、数据库、多媒体、并发、第三方库集成
- **前后端通信** — QML 与 C++ 的集成方式，包括类型注册、属性暴露、信号槽连接

## 模块总览

### 基础模块

| 模块 | 功能 | 备注 |
|------|------|------|
| Qt Core | 核心非图形类：信号槽、元对象系统、容器、线程、文件 I/O、JSON | |
| Qt GUI | 图形基础：窗口系统、2D/3D 图形、RHI 渲染抽象层、字体文本 | |
| Qt Widgets | 传统桌面 UI 控件与布局系统 | 本项目仅使用 QML，Widgets 已弃用 |
| Qt Network | TCP/IP 网络通信、HTTP 客户端、SSL/TLS | |
| Qt QML | QML 语言引擎、类型注册、JavaScript 集成 | |
| Qt Quick | QML 标准库：可视化画布、动画、粒子、输入处理 | |
| Qt Quick Controls | 轻量级 QML UI 控件集 | |
| Qt Quick Layouts | QML 布局管理 | |
| Qt Test | 单元测试框架 | |
| Qt D-Bus | Linux 进程间通信 | |

### 附加模块（精选）

| 模块 | 功能 |
|------|------|
| Qt Multimedia | 音视频播放、摄像头、录制、3D 空间音频 |
| Qt SQL | 数据库集成（SQLite、MySQL、PostgreSQL） |
| Qt Concurrent | 高级并发编程（MapReduce、异步任务） |
| Qt WebEngine | 基于 Chromium 的 Web 引擎 |
| Qt SerialPort | 串口通信 |
| Qt Graphs | 2D/3D 图表（替代 Qt Charts） |
| Qt Quick 3D | 高级 3D 内容创建 |
| Qt Bluetooth | 经典蓝牙与 BLE |
| Qt MQTT | IoT 消息协议 |

## 开发环境

Qt 6 推荐使用 CMake 构建系统：

```cmake
cmake_minimum_required(VERSION 3.16)
project(MyApp)

find_package(Qt6 REQUIRED COMPONENTS Widgets Qml Quick)

qt_add_executable(MyApp main.cpp)
target_link_libraries(MyApp PRIVATE Qt6::Widgets Qt6::Qml Qt6::Quick)
```

## 许可模式

Qt 提供三种许可：LGPLv3（基础模块）、GPLv3（部分附加模块）、商业许可。基础模块在 LGPL 下允许闭源商用，附加模块若使用 GPL 则需要开源或购买商业许可。