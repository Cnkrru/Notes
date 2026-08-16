# AL 项目技术方案（Qt6 C++ 全内置重写）

> 基于 AL (ikuntools) v1.0.0 项目分析，从 Qt 框架选型、架构设计、核心技术、构建打包到实施路线，制定完整的技术方案。
>
> 日期：2026-08-05

---

## 一、项目概述

### 1.1 原项目概况

AL (ikuntools) 是一个基于 Electron 33 + Vue 3.5 + TypeScript 的桌面多媒体管理应用，采用全插件化架构。

| 维度 | 数据 |
|------|------|
| 源码规模 | ~21,300 行（不含测试） |
| 测试规模 | ~7,800 行（518 个测试） |
| 插件数量 | 23+ 个（8 个顶层 + 17 个子插件） |
| 核心模块 | 18 个 common 模块 + 8 个 mobile-server 模块 |
| 技术栈 | Electron 33 / Vue 3.5 / TS 5.7 / better-sqlite3 / Pinia / Vue Router |
| IPC 通道 | 90+ 个命名 API 方法 |

### 1.2 重写目标

- **完全脱离 Electron**，使用 C++ 原生框架重写
- **取消插件系统**，所有功能内置为编译期链接模块
- **UI 使用 Qt6** 原生 GUI 框架（QML 声明式 UI）
- **性能优化**：消除 IPC / Worker / N-API 边界开销

### 1.3 重写动机

| 原架构痛点 | C++ 方案收益 |
|-----------|-------------|
| Electron 包体 ~150MB+ | Qt6 静态链接 ~30-50MB |
| IPC 跨进程通信延迟 ~1-5ms | 信号槽同进程 ~0.001ms |
| Worker 线程通信需序列化 | 线程池直接共享内存 |
| better-sqlite3 N-API 边界 | SQLite C API 直调 |
| ffmpeg 子进程 spawn 开销 | libavcodec 库内直调 |
| 内存占用 ~300-500MB | 预估 ~80-150MB |

---

## 二、Qt 框架与模块体系

### 2.1 什么是 Qt

Qt 是一个跨平台的 C++ 应用程序开发框架，由 Qt Company 维护。广泛用于桌面应用、嵌入式系统、移动应用和车载系统开发。Qt 6 是最新主版本，在图形渲染架构、QML 引擎、多媒体后端等方面全面升级。

### 2.2 模块化设计

Qt 6 采用模块化设计，功能划分为两类：

- **基础模块（Essentials）**：所有平台可用，保证源码和二进制兼容。包括 Qt Core、Qt GUI、Qt Widgets、Qt Network、Qt QML、Qt Quick、Qt Test 等。
- **附加模块（Add-Ons）**：针对特定场景，可能在部分平台可用。包括 Qt Multimedia、Qt SQL、Qt Concurrent、Qt WebEngine、Qt Charts 等。

### 2.3 两大开发范式

Qt 提供两种主要 UI 开发范式：

**Qt Widgets（传统 C++ UI）** — 基于 C++ 的经典桌面 UI，使用 QMainWindow、QPushButton 等控件结合布局管理器。适合传统桌面应用，性能稳定。

**Qt Quick / QML（声明式 UI）** — 基于 QML（Qt Modeling Language）的现代声明式 UI。QML 是类似 JSON 的声明式语言，内嵌 JavaScript，适合构建流畅、动画丰富的界面。Qt Quick 提供标准组件库。

> 本项目采用 **QML 作为主要 UI 开发方式**，Qt Widgets 仅作快速原型备用。

### 2.4 AL 项目所需模块

| 模块 | 用途 |
|------|------|
| Qt Core / Gui | 基础 |
| Qt QML / Quick | 声明式 UI |
| Qt Quick Controls / Layouts | QML 控件与布局 |
| Qt Multimedia | 音视频播放、录制 |
| Qt Network | HTTP Server/Client、网络通信 |
| Qt SQL | 数据库驱动（SQLite） |
| Qt PDF (6.4+) | PDF 渲染（替代 PDFium） |
| Qt6HttpServer (独立模块) | 文件互传 HTTP 服务 |

### 2.5 Qt6 版本选择

- **Qt 6.7 LTS** — 长期支持版，稳定可靠
- 编译器：MSVC 2022 (Windows)
- 构建系统：CMake 3.21+
- 许可模式：LGPL v3（基础模块）允许闭源商用；附加模块若用 GPL 需开源或购买商业许可

---

## 三、UI 库选型

### 3.1 对比结论

经过 6 大 C++ GUI 框架对比评估，**Qt6 是唯一适合 AL 的选择**：

| 框架 | 许可证 | 多媒体支持 | CSS 样式 | 深色主题 | 生态成熟度 | 适合 AL |
|------|--------|-----------|---------|---------|-----------|---------|
| **Qt6** | LGPL v3 / 商业 | Qt Multimedia (FFmpeg 后端) | QML 完整支持 | 支持 | 极高 | **首选** |
| Dear ImGui | MIT | 无 | 不支持 | 需自实现 | 中 | 不推荐 |
| wxWidgets | MPL 2.0 | wxMediaCtrl (基础) | 有限 | 支持 | 高 | 一般 |
| Slint | LGPL v3 / 商业 | 无内置 | 支持 | 支持 | 新兴 | 一般 |
| Sciter | GPL / 商业 | 有限 | 支持 | 支持 | 小众 | 一般 |
| FLTK | LGPL | 无 | 不支持 | 不支持 | 中 | 不推荐 |

### 3.2 Qt6 关键优势

1. **Qt Multimedia 模块** — 内置 FFmpeg 后端，音视频播放无需自行集成
2. **QML 声明式 UI** — 支持 CSS 变量、动画、深色模式，可迁移原 Vue 3 主题系统
3. **Qt PDF Module** (6.4+) — 原生 PDF 渲染，替代 Chromium PDFium
4. **Qt Network** — HTTP Server/Client，替代 Node.js http 模块
5. **Qt SQL** — SQLite 驱动封装（也可直调 C API）
6. **跨平台** — 未来可扩展 macOS/Linux
7. **LGPL v3** — 开源项目可免费使用

---

## 四、架构设计

### 4.1 整体架构

```
┌─────────────────────────────────────────────────────────┐
│                    Qt6 UI 层 (QML)                       │
│                                                          │
│  导航栏 │ 媒体播放器 │ 文件管理 │ 设置面板 │ 迷你播放器    │
│  主题引擎(QSS/CSS变量) │ 国际化(zh-CN/en-US) │ 快捷键      │
├─────────────────────────────────────────────────────────┤
│                  功能模块层 (C++)                         │
│                                                          │
│  媒体保险库  │ 笔记中心  │ 系统工具箱  │ 密码管理器        │
│  剪贴板管理  │ 文件互传  │ PDF工具     │ 视频解析          │
│  (所有功能编译期链接，信号槽直连，无 IPC)                  │
├─────────────────────────────────────────────────────────┤
│                  核心引擎层 (C++)                         │
│                                                          │
│  SQLite WAL │ AES-256-GCM │ 文件扫描 │ 线程池             │
│  HTTP Server │ 媒体流服务 │ 缩略图生成 │ 文件监听          │
│  (所有引擎 C++ 原生实现，无 N-API 边界)                   │
├─────────────────────────────────────────────────────────┤
│                  系统依赖层                              │
│                                                          │
│  Windows API │ Qt 6.7 LTS │ SQLite 3 │ OpenSSL 3         │
│  FFmpeg 7 (libavcodec/libavformat) │ md4c │ Poppler      │
└─────────────────────────────────────────────────────────┘
```

### 4.2 与原架构对比

| 原架构 (Electron) | 新架构 (Qt6 C++) | 变化 |
|-------------------|-----------------|------|
| 渲染进程 (Vue 3 + Chromium) | Qt6 QML UI 层 | UI 框架替换 |
| Preload + contextBridge | (消除) | 同进程，信号槽直连 |
| 主进程 (Node.js) | 核心引擎层 (C++) | 原生实现 |
| IPC 通信 (90+ 通道) | Qt 信号槽 | 延迟从 ms 级降至 ns |
| Worker 线程池 | std::thread 线程池 | 共享内存，无需序列化 |
| 插件系统 (23+ 插件) | 编译期链接模块 | 全内置，无动态加载 |
| plugin:// 协议 | Qt 资源系统 (qrc) | 编译进二进制 |
| better-sqlite3 (N-API) | SQLite C API 直调 | 消除边界开销 |
| Node crypto (OpenSSL 绑定) | OpenSSL EVP 直调 | 消除 Worker 通信 |
| ffmpeg 子进程 spawn | libavcodec 库内调用 | 零拷贝管道 |
| Node HTTP Server | Qt Network HTTP | 多线程并发 |

### 4.3 目录结构设计

```
AL-CPP/
├── CMakeLists.txt                 # CMake 顶层构建文件
├── src/
│   ├── main.cpp                   # 程序入口
│   │
│   ├── ui/                        # Qt6 UI 层 (QML)
│   │   ├── main.qml               # 主窗口
│   │   ├── components/            # 通用组件
│   │   │   ├── NavBar.qml         # 导航栏
│   │   │   ├── MediaPlayer.qml    # 媒体播放器
│   │   │   ├── MiniPlayer.qml     # 迷你播放器
│   │   │   ├── NotificationToast.qml
│   │   │   ├── ConfirmDialog.qml
│   │   │   └── ProgressBar.qml
│   │   ├── pages/                 # 功能页面
│   │   │   ├── MediaVaultPage.qml # 媒体保险库
│   │   │   ├── NotesHubPage.qml   # 笔记中心
│   │   │   ├── SystemKitPage.qml  # 系统工具箱
│   │   │   ├── PasswordPage.qml   # 密码管理器
│   │   │   ├── ClipboardPage.qml  # 剪贴板管理
│   │   │   ├── FileTransferPage.qml # 文件互传
│   │   │   ├── PdfToolsPage.qml   # PDF 工具
│   │   │   ├── VideoParserPage.qml # 视频解析
│   │   │   └── SettingsPage.qml   # 设置页
│   │   ├── theme/                 # 主题系统
│   │   │   ├── ThemeManager.hpp   # 主题管理器 (C++)
│   │   │   ├── themes/            # 12 套配色 JSON
│   │   │   │   ├── dark/
│   │   │   │   └── light/
│   │   │   └── AppStyle.qml       # 全局 QSS 样式
│   │   └── i18n/                  # 国际化
│   │       ├── zh-CN.ts
│   │       └── en-US.ts
│   │
│   ├── core/                      # 核心引擎层
│   │   ├── Database.hpp/cpp       # SQLite C API 封装
│   │   ├── Crypto.hpp/cpp         # AES-256-GCM 加密
│   │   ├── Scanner.hpp/cpp        # 文件扫描引擎
│   │   ├── ThreadPool.hpp/cpp     # C++ 线程池
│   │   ├── Thumbnail.hpp/cpp      # 缩略图生成
│   │   ├── MediaStreamer.hpp/cpp  # 媒体流服务
│   │   ├── FileWatcher.hpp/cpp    # 文件监听
│   │   ├── Logger.hpp/cpp         # 日志系统
│   │   ├── Paths.hpp              # 路径管理
│   │   └── Registry.hpp           # 键值配置存储
│   │
│   ├── modules/                   # 功能模块层
│   │   ├── media_vault/           # 媒体保险库
│   │   ├── notes_hub/             # 笔记中心
│   │   ├── system_kit/            # 系统工具箱
│   │   ├── password_manager/      # 密码管理器
│   │   ├── clipboard/             # 剪贴板管理
│   │   ├── file_transfer/         # 文件互传
│   │   ├── pdf_tools/             # PDF 工具
│   │   └── video_parser/          # 视频解析
│   │
│   └── resources/                 # Qt 资源文件 (qrc)
│       ├── resources.qrc
│       ├── icons/                 # SVG 图标
│       └── fonts/                 # 字体文件
│
├── libs/                          # 第三方库
│   ├── sqlite3/                   # SQLite 3 源码
│   ├── openssl/                   # OpenSSL 3
│   ├── ffmpeg/                    # FFmpeg 7
│   ├── md4c/                      # Markdown 解析器
│   └── stb/                       # stb_image (header-only)
│
├── tests/                         # 测试
│   ├── unit/
│   └── integration/
│
├── packaging/                     # 打包配置
│   ├── installer.nsi              # NSIS 安装脚本
│   └── version.h                  # 版本信息
│
└── docs/                          # 文档
```

---

## 五、功能模块映射

### 5.1 插件 → 内置模块映射

| 原插件 (ID) | 类型 | C++ 模块 | 核心依赖 | 优先级 |
|-------------|------|---------|---------|--------|
| media-vault | 父插件 | MediaVault | Qt Multimedia, FFmpeg, SQLite | P0 |
| ├ video-vault | 子插件 | VideoVault | FFmpeg (libavformat/libavcodec) | P0 |
| ├ audio-vault | 子插件 | AudioVault | Qt Multimedia | P0 |
| ├ photo-vault | 子插件 | PhotoVault | stb_image / Qt Image | P0 |
| ├ book-reader | 子插件 | BookReader | Qt PDF / Poppler | P1 |
| └ password-manager | 子插件 | PasswordManager | OpenSSL EVP AES-256-GCM | P1 |
| notes-hub | 父插件 | NotesHub | md4c + SQLite | P1 |
| ├ md-editor | 子插件 | MarkdownEditor | md4c (Markdown→HTML) | P1 |
| ├ journal | 子插件 | Journal | SQLite + md4c | P2 |
| └ snippets | 子插件 | Snippets | SQLite | P2 |
| sys-kit | 父插件 | SystemKit | FFmpeg + stb_image | P1 |
| ├ converter | 子插件 | FileConverter | FFmpeg (格式转换) | P1 |
| ├ dedup | 子插件 | FileDedup | std::filesystem (SHA-256) | P2 |
| └ image-resizer | 子插件 | ImageResizer | stb_image (批量缩放) | P2 |
| clipboard | 独立插件 | ClipboardManager | Windows Clipboard API | P2 |
| debug | 独立插件 | DatabaseViewer | SQLite (表结构查看) | P3 |
| video-parser | 独立插件 | VideoParser | Qt Network (HTTP 请求) | P3 |
| file-transfer | 独立插件 | FileTransfer | Qt Network (HTTP Server) | P2 |
| pdf-tools | 独立插件 | PdfTools | Qt PDF / Poppler | P2 |
| media-tools | 独立插件 | MediaTools | FFmpeg (剪切/合并/压缩) | P3 |

### 5.2 核心引擎模块映射

| 原模块 | 文件 | C++ 替代 | 说明 |
|--------|------|---------|------|
| 数据库 | `db/core.ts` | `Database.hpp/cpp` | SQLite C API 直调，WAL 模式 |
| 加密 | `crypto.ts` | `Crypto.hpp/cpp` | OpenSSL EVP_PBE_scrypt + EVP_aes_256_gcm |
| 文件扫描 | `scanner.ts` | `Scanner.hpp/cpp` | std::filesystem 递归遍历 |
| Worker 线程池 | `worker-pool.ts` | `ThreadPool.hpp/cpp` | std::thread + 无锁队列 |
| 缩略图 | `thumbnail.ts` | `Thumbnail.hpp/cpp` | stb_image 解码 + Qt Image 缩放 |
| 流媒体 | `media-streamer.ts` | `MediaStreamer.hpp/cpp` | FFmpeg libavcodec 直调 |
| 文件监听 | `watcher.ts` | `FileWatcher.hpp/cpp` | ReadDirectoryChangesW (Windows) |
| 窗口管理 | `window-manager.ts` | Qt QWindow | Qt 原生窗口管理 |
| 系统托盘 | `tray-manager.ts` | QSystemTrayIcon | Qt 原生托盘 |
| IPC 注册 | `ipc-registry.ts` | (消除) | 信号槽直连 |
| 路径管理 | `paths.ts` | `Paths.hpp` | std::filesystem::path |
| 注册表 | `registry.ts` | `Registry.hpp/cpp` | SQLite registry 表 |
| 日志 | `logger.ts` | `Logger.hpp/cpp` | spdlog |
| 移动端服务 | `mobile-server/` | `HttpServer.hpp/cpp` | Qt Network HTTP Server |
| 插件加载器 | `plugin-loader.ts` | (消除) | 编译期链接 |

---

## 六、核心技术方案

### 6.1 数据库层

**原方案**：better-sqlite3 (Node.js N-API 绑定)

**C++ 方案**：SQLite C API 直调，消除 N-API 类型转换开销（~0.1-0.5ms/次），Prepared Statement 缓存命中率更高。

```cpp
class Database {
public:
    static Database& instance();
    void init(const std::string& dbPath);
    void enableWAL();
    void walCheckpoint();
    sqlite3_stmt* prepare(const std::string& sql);
    void beginTransaction();
    void commit();
    void rollback();
private:
    sqlite3* m_db = nullptr;
    std::unordered_map<std::string, sqlite3_stmt*> m_stmtCache;
    std::mutex m_mutex;
};
```

### 6.2 加密层

**原方案**：Node crypto + Worker 异步 scrypt

**C++ 方案**：OpenSSL EVP 直调。scrypt 密钥派生从 ~200ms (Worker) 降至 ~50ms。

```cpp
class Crypto {
public:
    static Crypto& instance();
    void warmupKeyCache();
    std::string encrypt(const std::string& plaintext);
    std::string decrypt(const std::string& ciphertext);
    std::string decryptLegacy(const std::string& ciphertext); // AES-256-CBC 兼容
private:
    std::vector<uint8_t> m_cachedKey;
    std::string getMachineFingerprint();
    std::vector<uint8_t> deriveKey(const std::string& password, const std::string& salt);
};
```

### 6.3 文件扫描引擎

**原方案**：`fs.promises.readdir` + `lstat` 递归遍历 + Worker 分片

**C++ 方案**：`std::filesystem` + IOCP 异步 I/O，大目录扫描（>2000 文件）提速 4-8 倍。

```cpp
class Scanner {
public:
    struct ScanResult {
        std::vector<std::string> added;
        std::vector<std::string> removed;
        size_t total;
    };
    using ProgressCallback = std::function<void(int percent)>;
    ScanResult scanDirectory(
        const std::string& dirPath,
        const std::vector<std::string>& extensions,
        ProgressCallback onProgress = nullptr);
private:
    std::unordered_set<std::string> m_seenDirs;  // 符号链接环检测
    std::unordered_set<std::string> m_extSet;
    ThreadPool& m_pool;
};
```

### 6.4 线程池

**原方案**：Node Worker Threads + 优先级队列

**C++ 方案**：std::thread + 无锁队列。任务分发延迟从 ~5-10ms 降至 ~0.01ms。

```cpp
class ThreadPool {
public:
    static ThreadPool& instance();
    using TaskPriority = enum { High, Normal, Low };
    template<typename F, typename... Args>
    auto submit(TaskPriority prio, F&& f, Args&&... args)
        -> std::future<std::invoke_result_t<F, Args...>>;
    void destroy();
private:
    std::vector<std::thread> m_workers;
    struct Task {
        TaskPriority priority;
        std::function<void()> func;
    };
    std::priority_queue<Task> m_queue;
    std::mutex m_mutex;
    std::condition_variable m_cv;
};
```

### 6.5 媒体播放

**原方案**：HTTP 流媒体服务 + ffmpeg 子进程转码 + `<video>` 标签

**C++ 方案**：Qt Multimedia 直接播放，消除 HTTP Server 中间层。首帧延迟减少 ~200ms，内存降低 ~50%。

```qml
MediaPlayer {
    id: player
    source: "file:///" + filePath
}
VideoOutput {
    source: player
    anchors.fill: parent
}
```

### 6.6 HTTP Server（文件互传）

**原方案**：Node `http.createServer`

**C++ 方案**：Qt Network HTTP Server，支持多线程并发 + Token 认证 + 设备白名单。

```cpp
class HttpServer : public QObject {
    Q_OBJECT
public:
    bool start(quint16 port);
    void stop();
private slots:
    void onNewConnection();
    void onRequest(QHttpRequest* req, QHttpResponse* resp);
private:
    QHttpServer* m_server;
    AuthManager m_auth;          // Token 认证
    DeviceAuth m_deviceAuth;     // 设备白名单
    FilesStore m_filesStore;
    ConvertManager m_convert;
};
```

### 6.7 主题系统

**原方案**：CSS 变量 + JSON 配色 + Pinia store

**C++ 方案**：QML 属性绑定 + JSON 配色文件（12 套配色）。

```cpp
class ThemeManager : public QObject {
    Q_OBJECT
    Q_PROPERTY(QString currentTheme READ currentTheme WRITE setCurrentTheme NOTIFY themeChanged)
public:
    void loadThemes(const QString& themeDir);
    void applyTheme(const QString& themeId);
private:
    QMap<QString, QJsonObject> m_themes;
    QString m_currentTheme;
};
```

### 6.8 其他组件

| 组件 | 原方案 | C++ 方案 | 说明 |
|------|--------|---------|------|
| Markdown 解析 | markdown-it (JS) | md4c (C) | MIT，支持 CommonMark + GFM |
| PDF 渲染 | Chromium PDFium | Qt PDF Module | 官方模块，支持合并/拆分/压缩 |
| 缩略图 | Electron nativeImage | stb_image + Qt Image | 解码 + 缩放，视频用 FFmpeg 截帧 |

---

## 七、数据库设计

### 7.1 表结构（与原项目保持一致）

| 表 | 用途 | 关键字段 |
|----|------|---------|
| `vault_config` | 键值配置 | key (PK), value, updated_at |
| `passwords` | 加密密码 | id (PK), title, username, password_encrypted, url, notes_encrypted |
| `registry` | 键值配置（替代 localStorage） | key (PK), value, type, category, desc |
| `mobile_devices` | 移动端设备授权 | device_id (PK), device_name, status, first_seen, approved_at |
| `vault_videos` | 视频索引 | id, path, name, size, vault_path, duration, resolution, codec |
| `vault_audios` | 音频索引 | id, path, name, size, vault_path, duration, artist, album |
| `vault_photos` | 图片索引 | id, path, name, size, vault_path, width, height |
| `vault_books` | 图书索引 | id, path, name, size, vault_path, format |
| `vault_notes` | 笔记索引 | id, title, content, tags, created_at, updated_at |

### 7.2 迁移策略

1. 首次启动检测 `{userData}/config/app.db` 是否存在
2. 若存在（从旧版迁移）：自动执行 schema 迁移
3. 若不存在：创建新数据库 + 初始化默认配置
4. WAL 模式 + 每 30 分钟自动 CHECKPOINT

---

## 八、构建系统

### 8.1 环境要求

| 组件 | 版本要求 | 说明 |
|------|---------|------|
| CMake | 3.21+ | Qt 6.2+ 静态构建需要 3.21 |
| C++ 标准 | C++20 | 使用 `std::format`、`std::jthread` 等特性 |
| 编译器 | MSVC 2022 / MinGW GCC 13+ | Windows 推荐 MSVC |
| Qt | 6.7 LTS | 长期支持版 |
| vcpkg | 最新 | 包管理器，推荐 `x64-mingw-dynamic` triplet |

### 8.2 顶层 CMakeLists.txt

```cmake
cmake_minimum_required(VERSION 3.21)
project(AL VERSION 1.0.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_AUTOMOC ON)     # Qt MOC 自动处理
set(CMAKE_AUTORCC ON)     # Qt 资源文件自动处理
set(CMAKE_AUTOUIC ON)     # Qt UI 文件自动处理

# ── Qt6 模块 ──────────────────────────────────────
find_package(Qt6 6.7 REQUIRED COMPONENTS
    Core Gui Widgets Qml Quick
    Multimedia Network Sql
)

# Qt HTTP Server（Qt 6.4+ 独立模块，需通过 vcpkg 安装）
# vcpkg install qt-httpserver
find_package(Qt6HttpServer QUIET)

# ── 第三方库 ──────────────────────────────────────
find_package(SQLite3 REQUIRED)
find_package(OpenSSL REQUIRED)
find_package(FFmpeg REQUIRED COMPONENTS avformat avcodec avutil swscale)
find_package(spdlog REQUIRED)
find_package(nlohmann_json REQUIRED)

# ── 主程序 ────────────────────────────────────────
qt_add_executable(AL src/main.cpp)

qt_add_qml_module(AL
    URI AL
    VERSION 1.0
    QML_FILES
        src/ui/main.qml
        src/ui/components/NavBar.qml
        src/ui/components/MediaPlayer.qml
        src/ui/pages/MediaVaultPage.qml
        # ... 更多 QML 文件
    RESOURCES
        src/resources/resources.qrc
)

# ── 链接库 ────────────────────────────────────────
target_link_libraries(AL PRIVATE
    Qt6::Core Qt6::Gui Qt6::Widgets
    Qt6::Qml Qt6::Quick
    Qt6::Multimedia Qt6::Network Qt6::Sql
    SQLite::SQLite3
    OpenSSL::Crypto
    FFmpeg::avformat FFmpeg::avcodec FFmpeg::avutil FFmpeg::swscale
    spdlog::spdlog
    nlohmann_json::nlohmann_json
    md4c
)

if(Qt6HttpServer_FOUND)
    target_link_libraries(AL PRIVATE Qt6::HttpServer)
endif()

# ── 编译选项 ──────────────────────────────────────
target_compile_definitions(AL PRIVATE
    $<$<CONFIG:Debug>:AL_DEBUG>
    $<$<CONFIG:Release>:AL_RELEASE NDEBUG>
    SPDLOG_ACTIVE_LEVEL=SPDLOG_LEVEL_DEBUG
)

# Windows 特定
if(WIN32)
    target_sources(AL PRIVATE src/platform/win/al.rc)  # 图标资源
    set_target_properties(AL PROPERTIES
        WIN32_EXECUTABLE TRUE  # 无控制台窗口
    )
endif()

# ── 安装规则 ──────────────────────────────────────
install(TARGETS AL
    BUNDLE DESTINATION .
    RUNTIME DESTINATION ${CMAKE_INSTALL_BINDIR}
)

if(WIN32)
    # 使用 windeployqt 自动部署 Qt DLL
    install(CODE "
        execute_process(COMMAND windeployqt
            --qmldir \"${CMAKE_SOURCE_DIR}/src/ui\"
            \"${CMAKE_INSTALL_PREFIX}/bin/AL.exe\"
        )
    ")
endif()
```

### 8.3 vcpkg 依赖清单

```bash
# 安装 vcpkg（一次性）
git clone https://github.com/Microsoft/vcpkg.git
cd vcpkg
.\bootstrap-vcpkg.bat

# 安装项目依赖（MinGW 动态链接 triplet）
vcpkg install qt6:x64-mingw-dynamic
vcpkg install sqlite3:x64-mingw-dynamic
vcpkg install openssl:x64-mingw-dynamic
vcpkg install ffmpeg:x64-mingw-dynamic
vcpkg install spdlog:x64-mingw-dynamic
vcpkg install nlohmann-json:x64-mingw-dynamic
vcpkg install qt-httpserver:x64-mingw-dynamic  # 可选
```

> 若使用 MSVC，将 triplet 替换为 `x64-windows` 或 `x64-windows-static`。

### 8.4 构建命令

```bash
# 配置（从 vcpkg toolchain 文件构建）
cmake -B build -S . \
    -DCMAKE_TOOLCHAIN_FILE="[vcpkg-root]/scripts/buildsystems/vcpkg.cmake" \
    -DVCPKG_TARGET_TRIPLET=x64-mingw-dynamic \
    -DCMAKE_BUILD_TYPE=Release

# 编译
cmake --build build --config Release --parallel

# 安装到指定目录
cmake --install build --prefix dist/
```

### 8.5 源码编译的第三方库

**SQLite**（确保版本可控）：
```cmake
add_library(sqlite3 STATIC sqlite3/sqlite3.c sqlite3/sqlite3.h)
target_include_directories(sqlite3 PUBLIC sqlite3)
target_compile_definitions(sqlite3 PRIVATE
    SQLITE_THREADSAFE=1
    SQLITE_ENABLE_FTS5
    SQLITE_ENABLE_JSON1
)
```

**md4c**（纯 C，两个源文件）：
```cmake
add_library(md4c STATIC md4c/md4c.c md4c/md4c-html.c)
target_include_directories(md4c PUBLIC md4c)
```

### 8.6 资源打包 (qrc)

```xml
<!-- src/resources/resources.qrc -->
<RCC>
    <qresource prefix="/">
        <file>icons/play.svg</file>
        <file>icons/pause.svg</file>
        <file>fonts/NotoSansSC-Regular.otf</file>
        <file>theme/dark.json</file>
        <file>theme/light.json</file>
    </qresource>
</RCC>
```

QML 中引用：`Image { source: "qrc:/icons/play.svg" }`

### 8.7 FFmpeg DLL 分发

FFmpeg 需作为独立 DLL 随安装包分发（LGPL 动态链接要求），`windeployqt` 不会自动部署，需手动处理：

```cmake
if(WIN32)
    install(FILES
        ${FFMPEG_DIR}/bin/avcodec-*.dll
        ${FFMPEG_DIR}/bin/avformat-*.dll
        ${FFMPEG_DIR}/bin/avutil-*.dll
        ${FFMPEG_DIR}/bin/swscale-*.dll
        DESTINATION ${CMAKE_INSTALL_BINDIR}
    )
endif()
```

### 8.8 NSIS 打包

```nsis
; packaging/installer.nsi
!define PRODUCT_NAME "AL"
!define PRODUCT_VERSION "1.0.0"
!define PRODUCT_PUBLISHER "AL Team"

OutFile "AL-Setup-${PRODUCT_VERSION}.exe"
InstallDir "$PROGRAMFILES\${PRODUCT_NAME}"

Section "Install"
    SetOutPath "$INSTDIR"
    File /r "dist\*.*"
    CreateShortCut "$DESKTOP\AL.lnk" "$INSTDIR\AL.exe"
SectionEnd
```

### 8.9 动态链接 vs 静态链接

| 维度 | 动态链接（推荐） | 静态链接 |
|------|----------------|---------|
| 包体大小 | 较大（需带 DLL） | 较小 |
| LGPL 合规 | 简单（替换 Qt DLL 即可） | 需提供目标文件 |
| 更新 Qt | 替换 DLL 即可 | 需重新编译 |
| 启动时间 | 略慢（加载 DLL） | 快 |
| 推荐场景 | 开发阶段、开源分发 | 商业闭源分发 |

AL 项目推荐**动态链接**（Qt LGPL 合规更简单），FFmpeg 必须动态链接（LGPL 要求）。

### 8.10 常见问题

- **Qt6 找不到模块**：确保 `CMAKE_PREFIX_PATH` 指向 Qt 安装目录，如 `cmake -B build -DCMAKE_PREFIX_PATH="C:/Qt/6.7.0/mingw_64"`
- **FFmpeg 链接错误**：CMake 配置可能不完整，用 `pkg_check_modules` 手动指定
- **windeployqt 找不到 QML 模块**：确保 `qt_add_qml_module` 正确声明所有 QML 文件，或手动指定 `--qmldir`

---

## 九、安全设计

### 9.1 加密

- **算法**：AES-256-GCM（带 authTag 防篡改）
- **密钥派生**：scrypt（主机指纹 + 用户名 + CPU 型号 + salt）
- **密钥不持久化**：每次启动从机器指纹重新派生
- **兼容旧格式**：AES-256-CBC 向后读取（不再写入新数据）

### 9.2 路径安全

- 所有路径经 `std::filesystem::canonical()` 规范化
- 路径穿越防护：检查规范路径是否在允许目录内
- 文件操作限制在用户数据目录和仓库目录

### 9.3 网络安全

- HTTP Server 随机 Token 认证
- 设备白名单（站主审批机制）
- 仅监听 `127.0.0.1`（流媒体）和 `0.0.0.0:7528`（移动端服务）

---

## 十、实施路线图

| 阶段 | 内容 | 时长 |
|------|------|------|
| 阶段 1 | 核心框架搭建（CMake 骨架、SQLite、加密、扫描、线程池、主窗口、日志） | 2-3 周 |
| 阶段 2 | 媒体保险库 + 播放器（视频/音频/图片仓库、播放器、FFmpeg 集成） | 3-4 周 |
| 阶段 3 | 笔记 + 工具 + 密码（MD 编辑器、日记、密码管理器、文件转换、剪贴板） | 4-5 周 |
| 阶段 4 | 网络服务 + 收尾（HTTP Server、PDF 工具、主题、国际化、打包） | 3-4 周 |
| **总计** | | **12-16 周** |

### 阶段 1：核心框架搭建（2-3 周）

| 任务 | 说明 | 产出 |
|------|------|------|
| CMake 项目骨架 | Qt6 + 第三方库配置 | 可编译的空项目 |
| SQLite 封装 | Database 类 + WAL + 迁移 | 数据库可读写 |
| OpenSSL 加密 | AES-256-GCM + scrypt | 加解密可用 |
| 文件扫描引擎 | std::filesystem 递归遍历 | 扫描可用 |
| 线程池 | std::thread + 优先级队列 | 并发可用 |
| 主窗口 + 导航栏 | QML 主界面 + 侧边导航 | UI 框架 |
| 日志系统 | spdlog 集成 | 日志可写 |
| 路径管理 | 用户数据/配置/仓库目录 | 路径可用 |

### 阶段 2：媒体保险库 + 播放器（3-4 周）

| 任务 | 说明 | 产出 |
|------|------|------|
| 视频仓库 | CRUD + 搜索 + 索引 | 视频管理 |
| 音频仓库 | CRUD + 元数据 | 音频管理 |
| 图片仓库 | CRUD + 缩略图 | 图片管理 |
| 图书阅读器 | PDF/TXT/EPUB 渲染 | 阅读功能 |
| 媒体播放器 | Qt Multimedia 播放 | 视频播放 |
| 迷你播放器 | 独立窗口 + 系统托盘 | 迷你模式 |
| 文件监听 | ReadDirectoryChangesW | 自动更新索引 |
| FFmpeg 集成 | libavcodec/libavformat | 格式支持 |

### 阶段 3：笔记 + 工具 + 密码（4-5 周）

| 任务 | 说明 | 产出 |
|------|------|------|
| MD 编辑器 | md4c 解析 + 实时预览 | Markdown 编辑 |
| 日记本 | 每日记录 + 心情追踪 | 日记功能 |
| 代码片段 | 收藏 + 搜索 + 高亮 | 代码管理 |
| 密码管理器 | AES-256-GCM + 主密码 | 密码存储 |
| 文件转换 | FFmpeg 格式转换 | 转换功能 |
| 文件去重 | SHA-256 哈希去重 | 去重功能 |
| 图片缩放 | stb_image 批量处理 | 缩放功能 |
| 剪贴板管理 | Windows Clipboard API | 剪贴板历史 |

### 阶段 4：网络服务 + 收尾（3-4 周）

| 任务 | 说明 | 产出 |
|------|------|------|
| HTTP Server | Qt Network 文件互传 | 移动端联动 |
| 设备授权 | Token + 白名单 | 安全认证 |
| PDF 工具 | 合并/拆分/压缩 | PDF 处理 |
| 视频解析 | HTTP 请求 + 解析 | VIP 解析 |
| 主题系统 | 12 套配色 + 动态切换 | 主题 |
| 国际化 | zh-CN / en-US | 多语言 |
| 快捷键 | 全局快捷键注册 | 快捷操作 |
| 打包部署 | NSIS 安装包 | 可分发 |

### 总工期

| 阶段 | 时长 | 累计 |
|------|------|------|
| 阶段 1 | 2-3 周 | 3 周 |
| 阶段 2 | 3-4 周 | 7 周 |
| 阶段 3 | 4-5 周 | 12 周 |
| 阶段 4 | 3-4 周 | 16 周 |
| **总计** | **12-16 周** | |

---

## 十一、第三方依赖清单

| 库 | 版本 | 许可证 | 用途 | 集成方式 |
|----|------|--------|------|---------|
| Qt6 | 6.7 LTS | LGPL v3 | GUI 框架 + 多媒体 + 网络 | CMake find_package |
| SQLite | 3.46+ | Public Domain | 数据库 | 源码编译 |
| OpenSSL | 3.3+ | Apache 2.0 | 加密 | vcpkg / 预编译 |
| FFmpeg | 7.0+ | LGPL v2.1+ | 媒体编解码 | 预编译库 |
| md4c | 0.5+ | MIT | Markdown 解析 | 源码编译 |
| stb_image | 2.28+ | Public Domain | 图片解码 | header-only |
| spdlog | 1.14+ | MIT | 日志 | header-only |
| nlohmann/json | 3.11+ | MIT | JSON 解析 | header-only |
| Poppler (可选) | 24.0+ | GPL v2 | PDF 渲染（备选 Qt PDF） | 预编译 |

---

## 十二、与原项目功能对照

### 12.1 保留功能（100% 覆盖）

- [x] 媒体保险库（视频/音频/图片/图书）
- [x] 媒体播放器（全格式支持 + 迷你播放器）
- [x] 笔记中心（MD 编辑器 + 日记 + 代码片段）
- [x] 系统工具箱（转换 + 去重 + 图片缩放）
- [x] 密码管理器（AES-256-GCM 加密）
- [x] 剪贴板管理器
- [x] 文件互传（HTTP Server + 移动端联动）
- [x] PDF 工具箱
- [x] 视频解析
- [x] 主题系统（12 套配色 + 深色模式）
- [x] 国际化（zh-CN / en-US）
- [x] 系统托盘 + 全局快捷键
- [x] 文件监听 + 自动索引
- [x] 缩略图生成

### 12.2 消除功能

- [x] ~~插件系统~~（全内置，无需动态加载）
- [x] ~~插件商店~~（无需远程安装）
- [x] ~~plugin:// 协议~~（Qt 资源系统替代）
- [x] ~~Web 测试插件~~（17+ Web 演示应用，不再需要）
- [x] ~~IPC 桥接~~（同进程信号槽）
- [x] ~~Preload 脚本~~（无需安全隔离）

### 12.3 新增能力

- [x] 真正的多线程并发（非单线程事件循环）
- [x] 零拷贝媒体管道（FFmpeg 库内调用）
- [x] 更低的内存占用
- [x] 更小的安装包体积
- [x] 更快的启动速度

---

## 十三、性能预期

| 指标 | 原项目 (Electron) | C++ 重写 | 提升 |
|------|-------------------|---------|------|
| 安装包大小 | ~150MB | ~30-50MB | 3-5x |
| 启动时间 | ~2-3s | ~0.3-0.5s | 5-6x |
| 内存占用 | ~300-500MB | ~80-150MB | 3-4x |
| IPC 调用延迟 | ~1-5ms | ~0.001ms | 1000x+ |
| 文件扫描(10k文件) | ~15-20s | ~2-4s | 5-8x |
| 密钥预热 | ~200ms | ~50ms | 4x |
| 首帧播放延迟 | ~300-500ms | ~100-200ms | 2-3x |
| CPU 空闲占用 | ~3-5% | ~0.1-0.5% | 10x+ |

---

## 十四、风险与对策

| 风险 | 影响 | 概率 | 对策 |
|------|------|------|------|
| Qt6 LGPL 合规 | 法律风险 | 低 | 动态链接 Qt，或购买商业许可 |
| FFmpeg 专利风险 | 法律风险 | 中 | 仅使用开源编解码器（H.264 需注意） |
| 开发周期超长 | 进度风险 | 中 | 严格按优先级实施，P3 功能可延后 |
| QML 学习曲线 | 开发效率 | 中 | 先用 Qt Widgets 快速原型，再迁移 QML |
| 主题还原度 | UI 一致性 | 中 | QSS + QML 属性绑定，逐步调试 |
| 数据库迁移 | 数据丢失 | 低 | 自动检测旧数据库 + schema 迁移 |
| Windows API 兼容 | 运行时错误 | 低 | 最低支持 Windows 10 1903+ |

---

> 本文档将随开发进度持续更新。
>
> 最后更新：2026-08-05