AL (ikuntools) 是一个桌面多媒体管理应用，原基于 Electron 33 + Vue 3.5 + TypeScript（~21,300 行源码、23+ 插件）。重写目标为完全脱离 Electron，使用 Qt6 C++ 原生框架实现全内置架构。

## 架构对比

| 维度 | 原架构 (Electron) | 新架构 (Qt6 C++) | 变化 |
|------|-------------------|-----------------|------|
| UI 层 | Vue 3 + Chromium 渲染进程 | Qt6 QML UI 层 | 框架替换 |
| 通信 | IPC 90+ 通道 (contextBridge) | Qt 信号槽 | 延迟 ms → ns |
| 主进程 | Node.js (单线程事件循环) | C++ 核心引擎层 | 原生多线程 |
| 插件系统 | 23+ 插件动态加载 | 编译期链接模块 | 全内置 |
| 数据库 | better-sqlite3 (N-API) | SQLite C API 直调 | 消除边界 |
| 加密 | Node crypto + Worker | OpenSSL EVP 直调 | 消除 Worker |
| 媒体 | ffmpeg 子进程 spawn | libavcodec 库内调用 | 零拷贝 |
| HTTP | Node http.createServer | Qt Network HTTP Server | 多线程并发 |

## 四层架构

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
│  FFmpeg 7 (libavcodec/libavformat) │ md4c │ stb_image    │
└─────────────────────────────────────────────────────────┘
```

## 功能模块映射

### 原插件 → C++ 模块

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
| video-parser | 独立插件 | VideoParser | Qt Network (HTTP 请求) | P3 |
| file-transfer | 独立插件 | FileTransfer | Qt Network (HTTP Server) | P2 |
| pdf-tools | 独立插件 | PdfTools | Qt PDF / Poppler | P2 |
| media-tools | 独立插件 | MediaTools | FFmpeg (剪切/合并/压缩) | P3 |

### 核心引擎映射

| 原模块 | C++ 替代 | 说明 |
|--------|---------|------|
| 数据库 (`db/core.ts`) | `Database.hpp/cpp` | SQLite C API 直调，WAL 模式 |
| 加密 (`crypto.ts`) | `Crypto.hpp/cpp` | OpenSSL EVP_PBE_scrypt + EVP_aes_256_gcm |
| 文件扫描 (`scanner.ts`) | `Scanner.hpp/cpp` | `std::filesystem::recursive_directory_iterator` |
| Worker 线程池 (`worker-pool.ts`) | `ThreadPool.hpp/cpp` | `std::thread` + 无锁队列 |
| 缩略图 (`thumbnail.ts`) | `Thumbnail.hpp/cpp` | stb_image 解码 + Qt Image 缩放 |
| 流媒体 (`media-streamer.ts`) | `MediaStreamer.hpp/cpp` | FFmpeg libavcodec 直调 |
| 文件监听 (`watcher.ts`) | `FileWatcher.hpp/cpp` | `QFileSystemWatcher` |
| 窗口管理 (`window-manager.ts`) | Qt QWindow | Qt 原生窗口管理 |
| 系统托盘 (`tray-manager.ts`) | QSystemTrayIcon | Qt 原生托盘 |
| IPC 注册 (`ipc-registry.ts`) | (消除) | 信号槽直连 |
| 日志 (`logger.ts`) | `Logger.hpp/cpp` | spdlog |
| HTTP Server (`mobile-server/`) | `HttpServer.hpp/cpp` | Qt Network HTTP Server |

## 目录结构

```
AL-CPP/
├── CMakeLists.txt                 # CMake 顶层构建文件
├── src/
│   ├── main.cpp                   # 程序入口
│   ├── ui/                        # Qt6 UI 层 (QML)
│   │   ├── main.qml               # 主窗口
│   │   ├── components/            # 通用组件 (NavBar, MediaPlayer, MiniPlayer...)
│   │   ├── pages/                 # 功能页面 (MediaVault, NotesHub, Settings...)
│   │   ├── theme/                 # 主题系统 (12 套配色 JSON)
│   │   └── i18n/                  # 国际化 (zh-CN, en-US)
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
│   ├── modules/                   # 功能模块层
│   │   ├── media_vault/           # 媒体保险库
│   │   ├── notes_hub/             # 笔记中心
│   │   ├── system_kit/            # 系统工具箱
│   │   ├── password_manager/      # 密码管理器
│   │   ├── clipboard/             # 剪贴板管理
│   │   ├── file_transfer/         # 文件互传
│   │   ├── pdf_tools/             # PDF 工具
│   │   └── video_parser/          # 视频解析
│   └── resources/                 # Qt 资源文件 (qrc)
├── libs/                          # 第三方库
│   ├── sqlite3/                   # SQLite 3 源码
│   ├── openssl/                   # OpenSSL 3
│   ├── ffmpeg/                    # FFmpeg 7
│   ├── md4c/                      # Markdown 解析器
│   └── stb/                       # stb_image
├── tests/                         # 测试
│   ├── unit/
│   └── integration/
└── packaging/                     # 打包配置
```

## 关键技术决策

### 数据库层

原方案 better-sqlite3 (N-API) → **SQLite C API 直调**。消除 N-API 类型转换开销（~0.1-0.5ms/次），Prepared Statement 缓存命中率更高，批量事务无异步 Promise 包装。

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

### 加密层

原方案 Node crypto + Worker scrypt → **OpenSSL EVP 直调**。scrypt 密钥派生从 ~200ms (Worker) 降至 ~50ms，加解密无 Worker 通信开销。

```cpp
class Crypto {
public:
    static Crypto& instance();
    void warmupKeyCache();
    std::string encrypt(const std::string& plaintext);
    std::string decrypt(const std::string& ciphertext);
    std::string decryptLegacy(const std::string& ciphertext);
private:
    std::vector<uint8_t> m_cachedKey;
    std::string getMachineFingerprint();
    std::vector<uint8_t> deriveKey(const std::string& password, const std::string& salt);
};
```

### 媒体播放

原方案 HTTP 流媒体服务 + ffmpeg 子进程 + `<video>` 标签 → **Qt Multimedia 直接播放**。消除 HTTP Server 中间层和 ffmpeg 子进程 spawn 开销，首帧延迟减少 ~200ms，内存占用降低 ~50%。

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

### 线程池

原方案 Node Worker Threads → **`std::thread` + 无锁队列**。任务分发延迟从 ~5-10ms 降至 ~0.01ms，线程间共享内存无需序列化，无 Worker 创建/销毁开销。

## 实施路线图

| 阶段 | 内容 | 时长 |
|------|------|------|
| 阶段 1 | 核心框架搭建（CMake 骨架、SQLite、加密、扫描、线程池、主窗口、日志） | 2-3 周 |
| 阶段 2 | 媒体保险库 + 播放器（视频/音频/图片仓库、播放器、FFmpeg 集成） | 3-4 周 |
| 阶段 3 | 笔记 + 工具 + 密码（MD 编辑器、日记、密码管理器、文件转换、剪贴板） | 4-5 周 |
| 阶段 4 | 网络服务 + 收尾（HTTP Server、PDF 工具、主题、国际化、打包） | 3-4 周 |
| **总计** | | **12-16 周** |

## 性能预期

| 指标 | Electron 原项目 | C++ 重写 | 提升 |
|------|---------------|---------|------|
| 安装包大小 | ~150MB | ~30-50MB | 3-5x |
| 启动时间 | ~2-3s | ~0.3-0.5s | 5-6x |
| 内存占用 | ~300-500MB | ~80-150MB | 3-4x |
| IPC 调用延迟 | ~1-5ms | ~0.001ms | 1000x+ |
| 文件扫描(10k文件) | ~15-20s | ~2-4s | 5-8x |
| 密钥预热 | ~200ms | ~50ms | 4x |
| 首帧播放延迟 | ~300-500ms | ~100-200ms | 2-3x |
| CPU 空闲占用 | ~3-5% | ~0.1-0.5% | 10x+ |

## 安全设计

- **加密算法**：AES-256-GCM（带 authTag 防篡改）
- **密钥派生**：scrypt（主机指纹 + 用户名 + CPU 型号 + salt）
- **密钥不持久化**：每次启动从机器指纹重新派生
- **兼容旧格式**：AES-256-CBC 向后读取（不再写入新数据）
- **路径安全**：所有路径经 `std::filesystem::canonical()` 规范化，防止路径穿越
- **网络安全**：HTTP Server 随机 Token 认证 + 设备白名单审批机制

## 风险与对策

| 风险 | 影响 | 对策 |
|------|------|------|
| Qt6 LGPL 合规 | 法律风险 | 动态链接 Qt，或购买商业许可 |
| FFmpeg 专利风险 | 法律风险 | 仅使用开源编解码器 |
| QML 学习曲线 | 开发效率 | 先用 Qt Widgets 快速原型，再迁移 QML |
| 主题还原度 | UI 一致性 | QSS + QML 属性绑定，逐步调试 |
| 数据库迁移 | 数据丢失 | 自动检测旧数据库 + schema 迁移 |