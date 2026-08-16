# spdlog 快速学习资料（C++ 日志库）

> header-only，只需 `#include` 头文件，无需链接库文件（`cmake`/`vcpkg` 一键集成）。
> 多线程安全（`_mt` 后缀 logger）、性能高、支持格式化输出与滚动/周期 flush。

---

## 一、核心概念

- **logger（日志器）**：负责把日志写到某个目标（控制台 / 文件 / 滚动文件…）。
- **sink（输出目标）**：logger 内部真正写日志的"管道"，一个 logger 可挂多个 sink。
- **默认 logger**：`spdlog::info/warn/error/...` 全局宏直接使用的那个 logger，程序启动时自动创建并指向控制台。
- **全局注册表（registry）**：所有通过工厂函数创建的 logger 会按名字登记，之后可用 `spdlog::get("名字")` 随时取回。
- **级别（level）**：`trace < debug < info < warn < error < critical < off`。低于当前 `set_level` 的日志会被丢弃。

---

## 二、基本用法：全局宏

最简单的起步方式，直接用默认 logger：

```cpp
#include "spdlog/spdlog.h"

spdlog::info("Welcome to spdlog!");
spdlog::warn("Easy padding in numbers like {:08d}", 12);
spdlog::error("Some error message with arg: {}", 1);
spdlog::critical("Support for int: {0:d}; hex: {0:x}; oct: {0:o}; bin: {0:b}", 42);
spdlog::info("Support for floats {:03.2f}", 1.23456);
spdlog::info("Positional args are {1} {0}..", "too", "supported");
spdlog::info("{:<30}", "left aligned");
```

- 格式化语法基于 fmt：`{}` 占位，`{:08d}` 补零，`{0:d}` 指定参数位置与格式。
- 常用宏：`spdlog::trace / debug / info / warn / error / critical`。
- 想固定编译期级别、让低于某级别的调用在 release 中被删除，可用 `SPDLOG_ACTIVE_LEVEL` + `SPDLOG_TRACE("...{}", x)` 等编译期宏。

---

## 三、创建 logger（工厂函数）

工厂函数返回 `std::shared_ptr<spdlog::logger>`，并自动注册到全局注册表。

### 1. 控制台日志（带颜色）

```cpp
#include "spdlog/sinks/stdout_color_sinks.h"

auto console = spdlog::stdout_color_mt("console");   // 彩色输出到 stdout
auto err_log = spdlog::stderr_color_mt("stderr");    // 彩色输出到 stderr
```

### 2. 文件日志

```cpp
#include "spdlog/sinks/basic_file_sink.h"

try {
    auto logger = spdlog::basic_logger_mt("basic_logger", "logs/basic-log.txt");
} catch (const spdlog::spdlog_ex& ex) {
    // 文件打不开等初始化失败
}
```

- 参数：`basic_logger_mt(名字, 文件路径)`。文件不存在会自动创建，追加写。

### 3. 滚动文件日志（按大小切割）

```cpp
#include "spdlog/sinks/rotating_file_sink.h"

auto max_size = 1048576 * 5;   // 单个文件 5 MB
auto max_files = 3;            // 最多保留 3 个滚动文件
auto logger = spdlog::rotating_logger_mt("file_logger", "logs/rotating.txt", max_size, max_files);
```

- 写满 `max_size` 字节后自动切下一个文件，超过 `max_files` 个时覆盖最老的。

### 4. 取回已创建的 logger

```cpp
auto logger = spdlog::get("file_logger");   // 名字找，找不到返回空 shared_ptr
if (logger) logger->info("Hello again");
```

> 注意：`spdlog::get` 内部会加锁，高频调用路径上尽量缓存 `shared_ptr`。

---

## 四、格式与级别设置

### 级别

```cpp
spdlog::set_level(spdlog::level::debug);    // 全局：所有已注册 logger
spdlog::default_logger()->set_level(spdlog::level::trace);  // 仅默认 logger
logger->set_level(spdlog::level::debug);    // 单个 logger
```

### 日志模式（set_pattern）

```cpp
spdlog::set_pattern("[%H:%M:%S %z] [%n] [%^---%L---%$] [thread %t] %v");
logger->set_pattern("[%Y-%m-%d %H:%M:%S] [%l] [%n] %v");
```

常用格式符：

| 格式符 | 含义 |
| --- | --- |
| `%Y-%m-%d %H:%M:%S` | 日期时间 |
| `%z` | 时区偏移 |
| `%n` | logger 名字 |
| `%l` / `%L` | 小写 / 大写级别名（info/INFO） |
| `%t` | 线程 id |
| `%v` | 日志正文 |
| `%s` / `%#` | 源码文件名 / 文件名:行号 |
| `%^` ... `%$` | 包裹中间部分，开启颜色高亮 |

---

## 五、flush 策略（落盘时机）

日志默认先写缓冲，flush 才真正写盘。三种方式：

```cpp
// 1) 达到某个级别即 flush（重要日志立刻落盘）
logger->flush_on(spdlog::level::err);
spdlog::flush_on(spdlog::level::err);     // 全局：所有已注册 logger

// 2) 周期 flush：每隔 N 秒，由独立 worker 线程 flush 全部已注册 logger
spdlog::flush_every(std::chrono::seconds(3));

// 3) 手动 flush
logger->flush();
```

> 使用 `flush_every` 前请确认所有 logger 都是线程安全的（`_mt` 后缀），
> 因为周期 flush 发生在另一个线程。

---

## 六、生命周期：shutdown / drop

```cpp
spdlog::shutdown();   // 关闭所有 logger（含异步队列），释放资源
```

- 正常退出时无需手动调用，程序退出析构阶段会自动完成。
- 但如果你要在 `abort()` 或 `_exit(-1)` 这类"立即退出"前把异步日志刷完，必须手动 `spdlog::shutdown()`。

```cpp
spdlog::drop("basic_logger");  // 从注册表移除指定 logger；若无其它 shared_ptr 引用，会关闭并释放其资源
spdlog::drop_all();            // 移除全部
```

---

## 七、实战示例：初始化文件日志 + 各级别输出 + 模式设置

```cpp
#include <memory>
#include "spdlog/spdlog.h"
#include "spdlog/sinks/basic_file_sink.h"
#include "spdlog/sinks/rotating_file_sink.h"
#include "spdlog/sinks/stdout_color_sinks.h"

int main()
{
    // 1. 创建带颜色的控制台 logger
    auto console = spdlog::stdout_color_mt("console");
    console->set_level(spdlog::level::debug);

    // 2. 创建滚动文件 logger：单文件 5MB，保留 3 个
    auto file_logger = spdlog::rotating_logger_mt("file_logger", "logs/app.log", 1048576 * 5, 3);
    file_logger->set_level(spdlog::level::debug);

    // 3. 设置模式：文件里带时间 + 级别 + 线程
    file_logger->set_pattern("[%Y-%m-%d %H:%M:%S] [%^%L%$] [t:%t] %v");

    // 4. 级别达到 error 就立刻落盘
    file_logger->flush_on(spdlog::level::err);
    spdlog::flush_every(std::chrono::seconds(5));   // 兜底：每 5 秒刷一次

    // 5. 不同级别输出
    file_logger->trace("trace message {}", 1);
    file_logger->debug("debug message {}", 2);
    file_logger->info("application started, version {}", "1.0.0");
    file_logger->warn("disk usage high: {}%", 88);
    file_logger->error("failed to open config file: {}", "config.ini");

    // 6. 全局宏 = 默认 logger（控制台）
    spdlog::info("hello from default logger");

    // 7. 从任意位置按名字取回
    auto l = spdlog::get("file_logger");
    if (l) l->info("logger fetched by name");

    // 8. 退出前清理（正常退出会自动执行，这里显式调用以明确语义）
    spdlog::shutdown();
    return 0;
}
```

---

## 八、本项目最小可用 API 清单

| 场景 | API |
| --- | --- |
| 起步/默认日志 | `spdlog::info/warn/error(...)` |
| 控制台彩色日志 | `spdlog::stdout_color_mt(name)` |
| 单文件日志 | `spdlog::basic_logger_mt(name, path)` |
| 滚动文件日志 | `spdlog::rotating_logger_mt(name, path, max_size, max_files)` |
| 取回 logger | `spdlog::get(name)` |
| 全局级别/格式 | `spdlog::set_level(...)`、`spdlog::set_pattern(...)` |
| 单 logger 级别/格式 | `logger->set_level(...)`、`logger->set_pattern(...)` |
| 重要日志立刻落盘 | `logger->flush_on(spdlog::level::err)` |
| 周期落盘 | `spdlog::flush_every(std::chrono::seconds(n))` |
| 手动落盘 | `logger->flush()` |
| 关闭/清理 | `spdlog::shutdown()`、`spdlog::drop_all()`、`spdlog::drop(name)` |

> 结论：一个桌面应用里最常见的组合 = 控制台 logger + 滚动文件 logger +
> `set_pattern` 加时间戳 + `flush_on(err)` + `flush_every(几秒)`，退出前 `shutdown()` 即可。
