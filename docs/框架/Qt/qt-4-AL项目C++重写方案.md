# AL C++ 全内置重写方案

> 基于 AL (ikuntools) v1.0.0 项目分析，制定 C++ 全量重写实施计划
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
- **UI 使用 Qt6** 原生 GUI 框架
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

## 二、UI 库选型

### 2.1 对比结论

经过 6 大 C++ GUI 框架对比评估，**Qt6 是唯一适合 AL 的选择**：

| 框架 | 许可证 | 多媒体支持 | CSS 样式 | 深色主题 | 生态成熟度 | 适合 AL |
|------|--------|-----------|---------|---------|-----------|---------|
| **Qt6** | LGPL v3 / 商业 | Qt Multimedia (FFmpeg 后端) | QML 完整支持 | 支持 | 极高 | **首选** |
| Dear ImGui | MIT | 无 | 不支持 | 需自实现 | 中 | 不推荐 |
| wxWidgets | MPL 2.0 | wxMediaCtrl (基础) | 有限 | 支持 | 高 | 一般 |
| Slint | LGPL v3 / 商业 | 无内置 | 支持 | 支持 | 新兴 | 一般 |
| Sciter | GPL / 商业 | 有限 | 支持 | 支持 | 小众 | 一般 |
| FLTK | LGPL | 无 | 不支持 | 不支持 | 中 | 不推荐 |

### 2.2 Qt6 关键优势

1. **Qt Multimedia 模块** — 内置 FFmpeg 后端，视频/音频播放无需自行集成
2. **QML 声明式 UI** — 支持 CSS 变量、动画、深色模式，迁移原 Vue 3 主题系统
3. **Qt PDF Module** (6.4+) — 原生 PDF 渲染，替代 Chromium PDFium
4. **Qt Network** — HTTP Server/Client，替代 Node.js http 模块
5. **Qt SQL** — SQLite 驱动封装（也可直调 C API）
6. **跨平台** — 未来可扩展 macOS/Linux
7. **LGPL v3** — 开源项目可免费使用

### 2.3 Qt6 版本选择

- **Qt 6.7 LTS** — 长期支持版，稳定可靠
- 编译器：MSVC 2022 (Windows)
- 构建系统：CMake 3.21+

---

## 三、架构设计

### 3.1 整体架构

```
┌─────────────────────────────────────────────────────────┐
│                    Qt6 UI 层 (QML)                       │
│                                                          │
│  导航栏 │ 媒体播放器 │ 文件管理 │ 设置面板 │ 迷你播放器  │
│  主题引擎(QSS/CSS变量) │ 国际化(zh-CN/en-US) │ 快捷键    │
├─────────────────────────────────────────────────────────┤
│                  功能模块层 (C++)                         │
│                                                          │
│  媒体保险库  │ 笔记中心  │ 系统工具箱  │ 密码管理器      │
│  剪贴板管理  │ 文件互传  │ PDF工具     │ 视频解析        │
│  (所有功能编译期链接，信号槽直连，无 IPC)                │
├─────────────────────────────────────────────────────────┤
│                  核心引擎层 (C++)                         │
│                                                          │
│  SQLite WAL │ AES-256-GCM │ 文件扫描 │ 线程池           │
│  HTTP Server │ 媒体流服务 │ 缩略图生成 │ 文件监听        │
│  (所有引擎 C++ 原生实现，无 N-API 边界)                  │
├─────────────────────────────────────────────────────────┤
│                  系统依赖层                              │
│                                                          │
│  Windows API │ Qt 6.7 LTS │ SQLite 3 │ OpenSSL 3       │
│  FFmpeg 7 (libavcodec/libavformat) │ md4c │ Poppler    │
└─────────────────────────────────────────────────────────┘
```

### 3.2 与原架构对比

| 原架构 (Electron) | 新架构 (Qt6 C++) | 变化 |
|-------------------|-----------------|------|
| 渲染进程 (Vue 3 + Chromium) | Qt6 QML UI 层 | UI 框架替换 |
| Preload + contextBridge | (消除) | 同进程，信号槽直连 |
| 主进程 (Node.js) | 核心引擎层 (C++) | 原生实现 |
| IPC 通信 (90+ 通道) | Qt 信号槽 | 延迟从 ms 级降至 ns 级 |
| Worker 线程池 | std::thread 线程池 | 共享内存，无需序列化 |
| 插件系统 (23+ 插件) | 编译期链接模块 | 全内置，无动态加载 |
| plugin:// 协议 | Qt 资源系统 (qrc) | 编译进二进制 |
| better-sqlite3 (N-API) | SQLite C API 直调 | 消除边界开销 |
| Node crypto (OpenSSL 绑定) | OpenSSL EVP 直调 | 消除 Worker 通信 |
| ffmpeg 子进程 spawn | libavcodec 库内调用 | 零拷贝管道 |
| Node HTTP Server | Qt Network HTTP | 多线程并发 |

### 3.3 目录结构设计

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
│   │   ├── Database.hpp           # SQLite C API 封装
│   │   ├── Database.cpp
│   │   ├── Crypto.hpp             # AES-256-GCM 加密
│   │   ├── Crypto.cpp
│   │   ├── Scanner.hpp            # 文件扫描引擎
│   │   ├── Scanner.cpp
│   │   ├── ThreadPool.hpp         # C++ 线程池
│   │   ├── ThreadPool.cpp
│   │   ├── Thumbnail.hpp          # 缩略图生成
│   │   ├── Thumbnail.cpp
│   │   ├── MediaStreamer.hpp      # 媒体流服务
│   │   ├── MediaStreamer.cpp
│   │   ├── FileWatcher.hpp        # 文件监听
│   │   ├── FileWatcher.cpp
│   │   ├── Logger.hpp             # 日志系统
│   │   ├── Logger.cpp
│   │   ├── Paths.hpp              # 路径管理
│   │   └── Registry.hpp           # 键值配置存储
│   │
│   ├── modules/                   # 功能模块层
│   │   ├── media_vault/           # 媒体保险库
│   │   │   ├── MediaVault.hpp
│   │   │   ├── MediaVault.cpp
│   │   │   ├── VideoVault.hpp     # 视频仓库
│   │   │   ├── AudioVault.hpp     # 音频仓库
│   │   │   ├── PhotoVault.hpp     # 图片仓库
│   │   │   └── BookReader.hpp     # 图书阅读器
│   │   ├── notes_hub/             # 笔记中心
│   │   │   ├── NotesHub.hpp
│   │   │   ├── MarkdownEditor.hpp # MD 编辑器
│   │   │   ├── Journal.hpp        # 日记本
│   │   │   └── Snippets.hpp       # 代码片段
│   │   ├── system_kit/            # 系统工具箱
│   │   │   ├── SystemKit.hpp
│   │   │   ├── FileConverter.hpp  # 文件转换
│   │   │   ├── FileDedup.hpp      # 文件去重
│   │   │   └── ImageResizer.hpp   # 图片缩放
│   │   ├── password_manager/      # 密码管理器
│   │   │   ├── PasswordManager.hpp
│   │   │   └── PasswordManager.cpp
│   │   ├── clipboard/             # 剪贴板管理
│   │   │   ├── ClipboardManager.hpp
│   │   │   └── ClipboardManager.cpp
│   │   ├── file_transfer/         # 文件互传
│   │   │   ├── HttpServer.hpp     # HTTP Server
│   │   │   ├── HttpServer.cpp
│   │   │   └── DeviceAuth.hpp     # 设备授权
│   │   ├── pdf_tools/             # PDF 工具
│   │   │   ├── PdfTools.hpp
│   │   │   └── PdfTools.cpp
│   │   └── video_parser/          # 视频解析
│   │       ├── VideoParser.hpp
│   │       └── VideoParser.cpp
│   │
│   └── resources/                 # Qt 资源文件
│       ├── resources.qrc          # 资源清单
│       ├── icons/                 # SVG 图标
│       └── fonts/                 # 字体文件
│
├── libs/                          # 第三方库
│   ├── sqlite3/                   # SQLite 3 源码
│   ├── openssl/                   # OpenSSL 3
│   ├── ffmpeg/                    # FFmpeg 7 头文件+库
│   ├── md4c/                      # Markdown 解析器
│   └── stb/                       # stb_image 图片解码
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

## 四、功能模块映射

### 4.1 插件 → 内置模块映射表

| 原插件 (ID) | 类型 | C++ 模块 | 核心依赖 | 优先级 |
|-------------|------|---------|---------|--------|
| media-vault | 父插件 | MediaVault | Qt Multimedia, FFmpeg, SQLite | P0 |
| ├ video-vault | 子插件 | VideoVault | FFmpeg (libavformat/libavcodec) | P0 |
| ├ audio-vault | 子插件 | AudioVault | Qt Multimedia (音频元数据) | P0 |
| ├ photo-vault | 子插件 | PhotoVault | stb_image / Qt Image | P0 |
| ├ book-reader | 子插件 | BookReader | Qt PDF / Poppler | P1 |
| └ password-manager | 子插件 | PasswordManager | OpenSSL EVP AES-256-GCM | P1 |
| notes-hub | 父插件 | NotesHub | md4c + SQLite | P1 |
| ├ md-editor | 子插件 | MarkdownEditor | md4c (Markdown→HTML) | P1 |
| ├ journal | 子插件 | Journal | SQLite + md4c | P2 |
| └ snippets | 子插件 | Snippets | SQLite | P2 |
| sys-kit | 父插件 | SystemKit | FFmpeg + stb_image | P1 |
| ├ converter | 子插件 | FileConverter | FFmpeg (格式转换) | P1 |
| ├ dedup | 子插件 | FileDedup | std::filesystem (哈希去重) | P2 |
| └ image-resizer | 子插件 | ImageResizer | stb_image (批量缩放) | P2 |
| clipboard | 独立插件 | ClipboardManager | Windows Clipboard API | P2 |
| debug | 独立插件 | DatabaseViewer | SQLite (表结构查看) | P3 |
| video-parser | 独立插件 | VideoParser | Qt Network (HTTP 请求) | P3 |
| file-transfer | 独立插件 | FileTransfer | Qt Network (HTTP Server) | P2 |
| pdf-tools | 独立插件 | PdfTools | Qt PDF / Poppler | P2 |
| media-tools | 独立插件 | MediaTools | FFmpeg (剪切/合并/压缩) | P3 |

### 4.2 核心引擎模块映射

| 原模块 | 文件 | C++ 替代 | 说明 |
|--------|------|---------|------|
| 数据库 | `db/core.ts` | `Database.hpp/cpp` | SQLite C API 直调，WAL 模式 |
| 加密 | `crypto.ts` | `Crypto.hpp/cpp` | OpenSSL EVP_PBE_scrypt + EVP_aes_256_gcm |
| 文件扫描 | `scanner.ts` | `Scanner.hpp/cpp` | std::filesystem::recursive_directory_iterator |
| Worker 线程池 | `worker-pool.ts` | `ThreadPool.hpp/cpp` | std::thread + std::future + 无锁队列 |
| 缩略图 | `thumbnail.ts` | `Thumbnail.hpp/cpp` | stb_image 解码 + Qt Image 缩放 |
| 流媒体 | `media-streamer.ts` | `MediaStreamer.hpp/cpp` | FFmpeg libavcodec 直调（无需 HTTP 中间层） |
| 文件监听 | `watcher.ts` | `FileWatcher.hpp/cpp` | ReadDirectoryChangesW (Windows API) |
| 窗口管理 | `window-manager.ts` | Qt QWindow | Qt 原生窗口管理 |
| 系统托盘 | `tray-manager.ts` | QSystemTrayIcon | Qt 原生托盘 |
| IPC 注册 | `ipc-registry.ts` | (消除) | 信号槽直连 |
| 路径管理 | `paths.ts` | `Paths.hpp` | std::filesystem::path |
| 注册表 | `registry.ts` | `Registry.hpp/cpp` | SQLite registry 表 |
| 日志 | `logger.ts` | `Logger.hpp/cpp` | spdlog 或自研 |
| 移动端服务 | `mobile-server/` | `HttpServer.hpp/cpp` | Qt Network HTTP Server |
| 插件加载器 | `plugin-loader.ts` | (消除) | 编译期链接 |
| 插件安装器 | `plugin-installer.ts` | (消除) | 无需远程安装 |

---

## 五、关键技术方案

### 5.1 数据库层

**原方案**：better-sqlite3 (Node.js N-API 绑定)

**C++ 方案**：SQLite C API 直调

```cpp
// Database.hpp 核心设计
class Database {
public:
    static Database& instance();
    
    void init(const std::string& dbPath);
    void close();
    
    // WAL 模式
    void enableWAL();
    void walCheckpoint();
    
    // Prepared Statement 缓存
    sqlite3_stmt* prepare(const std::string& sql);
    void executeBatch(const std::string& sql);
    
    // 事务
    void beginTransaction();
    void commit();
    void rollback();
    
    // 安全 CRUD（参数化查询）
    template<typename... Args>
    std::vector<std::map<std::string, std::string>> query(
        const std::string& sql, Args&&... args);
    
private:
    sqlite3* m_db = nullptr;
    std::unordered_map<std::string, sqlite3_stmt*> m_stmtCache;
    std::mutex m_mutex;
};
```

**性能收益**：
- 消除 N-API 类型转换开销（~0.1-0.5ms/次）
- Prepared Statement 缓存命中率更高
- 批量事务直接 C API 调用，无异步 Promise 包装

### 5.2 加密层

**原方案**：Node crypto (OpenSSL 绑定) + Worker 线程池异步 scrypt

**C++ 方案**：OpenSSL EVP 直调

```cpp
// Crypto.hpp 核心设计
class Crypto {
public:
    static Crypto& instance();
    
    // 密钥派生（同步，无 Worker 开销）
    void warmupKeyCache();
    
    // AES-256-GCM
    std::string encrypt(const std::string& plaintext);
    std::string decrypt(const std::string& ciphertext);
    
    // 兼容旧格式（AES-256-CBC）
    std::string decryptLegacy(const std::string& ciphertext);
    
private:
    std::vector<uint8_t> m_cachedKey;
    
    std::string getMachineFingerprint();
    std::string getMachineSaltHex();
    std::vector<uint8_t> deriveKey(
        const std::string& password,
        const std::string& salt);
};
```

**性能收益**：
- scrypt 密钥派生从 ~200ms (Worker) 降至 ~50ms (直调)
- 加解密无 Worker 通信开销
- 密钥缓存无需跨线程传递

### 5.3 文件扫描引擎

**原方案**：`fs.promises.readdir` + `lstat` 递归遍历 + Worker 分片

**C++ 方案**：`std::filesystem` + IOCP 异步 I/O

```cpp
// Scanner.hpp 核心设计
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
    // 符号链接环检测
    std::unordered_set<std::string> m_seenDirs;
    
    // 文件类型过滤
    std::unordered_set<std::string> m_extSet;
    
    // 线程池引用
    ThreadPool& m_pool;
};
```

**性能收益**：
- 大目录扫描（>2000 文件）提速 4-8 倍
- IOCP 异步 I/O 不阻塞 UI 线程
- 符号链接检测更高效（std::filesystem 原生支持）

### 5.4 线程池

**原方案**：Node Worker Threads + 优先级队列

**C++ 方案**：std::thread + 无锁队列

```cpp
// ThreadPool.hpp 核心设计
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
    
    // 三级优先级无锁队列
    struct Task {
        TaskPriority priority;
        std::function<void()> func;
    };
    std::priority_queue<Task> m_queue;
    std::mutex m_mutex;
    std::condition_variable m_cv;
};
```

**性能收益**：
- 任务分发延迟从 ~5-10ms 降至 ~0.01ms
- 线程间共享内存，无需序列化
- 无 Worker 创建/销毁开销

### 5.5 媒体播放

**原方案**：HTTP 流媒体服务 + ffmpeg 子进程转码 + `<video>` 标签播放

**C++ 方案**：Qt Multimedia 直接播放

```cpp
// 媒体播放无需 HTTP 中间层
// QML 直接使用 MediaPlayer + VideoOutput
```

```qml
// QML 播放器
MediaPlayer {
    id: player
    source: "file:///" + filePath
    // 非原生格式自动通过 FFmpeg 后端解码
}

VideoOutput {
    source: player
    anchors.fill: parent
}
```

**性能收益**：
- 消除 HTTP Server 中间层
- 消除 ffmpeg 子进程 spawn 开销
- 首帧延迟减少 ~200ms
- 内存占用降低 ~50%（无需管道缓冲）

### 5.6 HTTP Server（文件互传）

**原方案**：Node `http.createServer`

**C++ 方案**：Qt Network HTTP Server

```cpp
// HttpServer.hpp 核心设计
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
    FilesStore m_filesStore;     // 文件存储
    ConvertManager m_convert;    // 格式转换
};
```

### 5.7 主题系统

**原方案**：CSS 变量 + JSON 配色文件 + Pinia store

**C++ 方案**：QML 属性绑定 + JSON 配色文件

```cpp
// ThemeManager.hpp
class ThemeManager : public QObject {
    Q_OBJECT
    Q_PROPERTY(QString currentTheme READ currentTheme WRITE setCurrentTheme NOTIFY themeChanged)
    
public:
    void loadThemes(const QString& themeDir);
    void applyTheme(const QString& themeId);
    
private:
    QMap<QString, QJsonObject> m_themes;  // 12 套配色
    QString m_currentTheme;
};
```

```qml
// 全局样式绑定
Rectangle {
    color: ThemeManager.primaryColor
    // 主题切换时自动更新
}
```

### 5.8 Markdown 解析

**原方案**：markdown-it (JS)

**C++ 方案**：md4c (C 库)

- MIT 许可，纯 C 实现
- 支持 CommonMark + GFM (表格/任务列表/删除线)
- 速度极快，无外部依赖
- 输出 HTML，QML 可直接渲染

### 5.9 PDF 渲染

**原方案**：Chromium 内置 PDFium

**C++ 方案**：Qt PDF Module (Qt 6.4+)

- 官方模块，集成度高
- 支持 QML 渲染
- 支持 PDF 合并/拆分/压缩

### 5.10 缩略图生成

**原方案**：Electron nativeImage (依赖 Chromium)

**C++ 方案**：stb_image + Qt Image

```cpp
// Thumbnail.hpp
class Thumbnail {
public:
    static QString generate(const QString& filePath);
    
private:
    static constexpr int MAX_SIZE = 256;
    static constexpr int MAX_FILE_BYTES = 30 * 1024 * 1024;
    
    QString getThumbPath(const QString& filePath);
    QByteArray generateFromImage(const QString& filePath);
    QByteArray generateFromVideo(const QString& filePath); // FFmpeg 截帧
};
```

---

## 六、数据库设计

### 6.1 表结构（与原项目保持一致）

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

### 6.2 迁移策略

1. 首次启动检测 `{userData}/config/app.db` 是否存在
2. 若存在（从旧版迁移）：自动执行 schema 迁移
3. 若不存在：创建新数据库 + 初始化默认配置
4. WAL 模式 + 每 30 分钟自动 CHECKPOINT

---

## 七、安全设计

### 7.1 加密

- **算法**：AES-256-GCM（带 authTag 防篡改）
- **密钥派生**：scrypt（主机指纹 + 用户名 + CPU 型号 + salt）
- **密钥不持久化**：每次启动从机器指纹重新派生
- **兼容旧格式**：AES-256-CBC 向后读取（不再写入新数据）

### 7.2 路径安全

- 所有文件路径经 `std::filesystem::canonical()` 规范化
- 路径穿越防护：检查规范路径是否在允许目录内
- 文件操作限制在用户数据目录和仓库目录

### 7.3 网络安全

- HTTP Server 随机 Token 认证
- 设备白名单（站主审批机制）
- 仅监听 `127.0.0.1`（流媒体）和 `0.0.0.0:7528`（移动端服务）

---

## 八、实施路线图

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

## 九、第三方依赖清单

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

## 十、构建与打包

### 10.1 构建系统

```cmake
# CMakeLists.txt 顶层结构
cmake_minimum_required(VERSION 3.21)
project(AL-CPP VERSION 1.0.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Qt6
find_package(Qt6 6.7 REQUIRED COMPONENTS
    Core Gui Qml Quick Widgets Multimedia Network Sql
)

# 第三方库
add_subdirectory(libs/sqlite3)
find_package(OpenSSL REQUIRED)
find_package(FFmpeg REQUIRED)
add_subdirectory(libs/md4c)

# 主程序
qt_add_executable(AL src/main.cpp)
qt_add_qml_module(AL URI AL VERSION 1.0)
target_link_libraries(AL PRIVATE
    Qt6::Core Qt6::Gui Qt6::Qml Qt6::Quick
    Qt6::Multimedia Qt6::Network Qt6::Sql
    SQLite3 OpenSSL::Crypto FFmpeg::avcodec
    md4c spdlog::spdlog nlohmann_json::nlohmann_json
)
```

### 10.2 打包

- **Windows**：NSIS 安装包（与原项目一致）
- **静态链接**：Qt 静态链接 + 第三方库静态链接，减小包体
- **资源打包**：QML/JS/图片/主题 JSON 通过 qrc 编译进二进制
- **FFmpeg**：作为独立 DLL 随安装包分发（LGPL 动态链接要求）

---

## 十一、风险与对策

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

> 本文档将随开发进度持续更新。
>
> 最后更新：2026-08-05
