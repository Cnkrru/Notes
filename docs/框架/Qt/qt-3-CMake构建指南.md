AL 项目使用 CMake 3.21+ 作为构建系统，vcpkg 管理第三方依赖，Qt 6.7+ 作为 GUI 框架。本章提供从零搭建到打包的完整构建指南。

## 环境要求

| 组件 | 版本要求 | 说明 |
|------|---------|------|
| CMake | 3.21+ | Qt 6.2+ 静态构建需要 3.21 |
| C++ 标准 | C++20 | 使用 `std::format`、`std::jthread` 等特性 |
| 编译器 | MSVC 2022 / MinGW GCC 13+ | Windows 推荐 MSVC |
| Qt | 6.7 LTS | 长期支持版 |
| vcpkg | 最新 | 包管理器，推荐 `x64-mingw-dynamic` triplet |

## 顶层 CMakeLists.txt

```cmake
cmake_minimum_required(VERSION 3.21)
project(AL VERSION 1.0.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_AUTOMOC ON)     # Qt MOC 自动处理
set(CMAKE_AUTORCC ON)     # Qt 资源文件自动处理
set(CMAKE_AUTOUIC ON)     # Qt UI 文件自动处理

# ── Qt6 模块 ──────────────────────────────────────
# 核心：Core Gui Widgets Qml Quick
# 功能：Multimedia Network Sql
# 可选：Pdf（PDF 渲染，Qt 6.4+）
find_package(Qt6 6.7 REQUIRED COMPONENTS
    Core Gui Widgets Qml Quick
    Multimedia Network Sql
)

# Qt HTTP Server（Qt 6.4+ 独立模块，需通过 vcpkg 安装）
# vcpkg install qt-httpserver
find_package(Qt6HttpServer QUIET)

# ── 第三方库 ──────────────────────────────────────
# SQLite C API（源码编译或 find_package）
find_package(SQLite3 REQUIRED)

# OpenSSL（仅需 Crypto 库用于 AES-256-GCM）
find_package(OpenSSL REQUIRED)

# FFmpeg（媒体编解码）
find_package(FFmpeg REQUIRED COMPONENTS avformat avcodec avutil swscale)

# spdlog（header-only 日志）
find_package(spdlog REQUIRED)

# nlohmann/json（header-only JSON）
find_package(nlohmann_json REQUIRED)

# md4c（Markdown 解析，源码编译）
# 作为子目录添加：add_subdirectory(libs/md4c)
# 或直接编译源文件：target_sources(... md4c.c md4c-html.c)

# ── 主程序 ────────────────────────────────────────
qt_add_executable(AL
    src/main.cpp
)

# QML 模块
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
    # Qt6 模块
    Qt6::Core Qt6::Gui Qt6::Widgets
    Qt6::Qml Qt6::Quick
    Qt6::Multimedia Qt6::Network Qt6::Sql
    # 第三方库
    SQLite::SQLite3
    OpenSSL::Crypto
    FFmpeg::avformat FFmpeg::avcodec FFmpeg::avutil FFmpeg::swscale
    spdlog::spdlog
    nlohmann_json::nlohmann_json
    md4c
)

# 可选：Qt HTTP Server
if(Qt6HttpServer_FOUND)
    target_link_libraries(AL PRIVATE Qt6::HttpServer)
endif()

# ── 编译选项 ──────────────────────────────────────
target_compile_definitions(AL PRIVATE
    $<$<CONFIG:Debug>:AL_DEBUG>
    $<$<CONFIG:Release>:AL_RELEASE NDEBUG>
    SPDLOG_ACTIVE_LEVEL=SPDLOG_LEVEL_DEBUG  # spdlog 编译期级别
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

# 安装 Qt 运行时依赖
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

## vcpkg 依赖清单

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

## 构建命令

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

## 目录结构映射

```
AL-CPP/
├── CMakeLists.txt              # 顶层构建文件（本文档）
├── src/
│   ├── CMakeLists.txt          # 源文件子目录构建
│   ├── main.cpp
│   ├── ui/                     # QML UI 层
│   ├── core/                   # 核心引擎层
│   ├── modules/                # 功能模块层
│   └── resources/
│       └── resources.qrc       # Qt 资源清单
├── libs/                       # 第三方库
│   ├── CMakeLists.txt
│   ├── sqlite3/                # SQLite 源码
│   ├── md4c/                   # md4c 源码
│   └── stb/                    # stb_image (header-only)
├── tests/
│   └── CMakeLists.txt
└── packaging/                  # 打包配置
    └── installer.nsi           # NSIS 安装脚本
```

## SQLite 源码编译

SQLite 推荐源码编译，以确保版本可控：

```cmake
# libs/CMakeLists.txt
add_library(sqlite3 STATIC
    sqlite3/sqlite3.c
    sqlite3/sqlite3.h
)
target_include_directories(sqlite3 PUBLIC sqlite3)
target_compile_definitions(sqlite3 PRIVATE
    SQLITE_THREADSAFE=1
    SQLITE_ENABLE_FTS5
    SQLITE_ENABLE_JSON1
)
```

## md4c 源码编译

md4c 是纯 C 实现，两个源文件即可：

```cmake
# libs/CMakeLists.txt
add_library(md4c STATIC
    md4c/md4c.c
    md4c/md4c-html.c
)
target_include_directories(md4c PUBLIC md4c)
```

## 资源打包 (qrc)

Qt 资源系统将 QML/JS/图片/主题 JSON 编译进二进制：

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

在 QML 中引用资源：

```qml
Image {
    source: "qrc:/icons/play.svg"
}
```

## FFmpeg DLL 分发

FFmpeg 需作为独立 DLL 随安装包分发（LGPL 动态链接要求）。`windeployqt` 不会自动部署 FFmpeg DLL，需手动处理：

```cmake
# 安装 FFmpeg DLL
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

## NSIS 打包

使用 NSIS 创建 Windows 安装包，与 node 原项目保持一致：

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

## 调试配置

```cmake
# Debug 模式下启用 AddressSanitizer (MSVC)
if(MSVC AND CMAKE_BUILD_TYPE STREQUAL "Debug")
    target_compile_options(AL PRIVATE /fsanitize=address)
    target_link_options(AL PRIVATE /fsanitize=address)
endif()

# 启用 Qt 调试输出
target_compile_definitions(AL PRIVATE
    $<$<CONFIG:Debug>:QT_QML_DEBUG>
)
```

## 常见问题

### Qt6 找不到模块

确保 `CMAKE_PREFIX_PATH` 指向 Qt 安装目录：

```bash
cmake -B build -DCMAKE_PREFIX_PATH="C:/Qt/6.7.0/mingw_64"
```

### FFmpeg 链接错误

FFmpeg 的 CMake 配置文件可能不完整，手动指定：

```cmake
find_package(PkgConfig REQUIRED)
pkg_check_modules(FFMPEG REQUIRED
    libavformat libavcodec libavutil libswscale
)
target_include_directories(AL PRIVATE ${FFMPEG_INCLUDE_DIRS})
target_link_libraries(AL PRIVATE ${FFMPEG_LIBRARIES})
```

### windeployqt 找不到 QML 模块

确保 `qt_add_qml_module` 正确声明了所有 QML 文件，或手动指定 `--qmldir` 参数。

## 静态链接 vs 动态链接

| 维度 | 动态链接（推荐） | 静态链接 |
|------|----------------|---------|
| 包体大小 | 较大（需带 DLL） | 较小 |
| LGPL 合规 | 简单（替换 Qt DLL 即可） | 需提供目标文件 |
| 更新 Qt | 替换 DLL 即可 | 需重新编译 |
| 启动时间 | 略慢（加载 DLL） | 快 |
| 推荐场景 | 开发阶段、开源分发 | 商业闭源分发 |

AL 项目推荐**动态链接**（Qt LGPL 合规更简单），FFmpeg 必须动态链接（LGPL 要求）。