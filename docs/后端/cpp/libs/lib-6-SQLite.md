# SQLite C/C++ API 实战速查（AL 项目）

> 目标：为 AL 项目提供最小可用的 SQLite C API 学习资料。内容基于 sqlite.org 官方文档
> （C/C++ API Reference：https://www.sqlite.org/c3ref/intro.html 、cintro.html 及各 c3ref 页面）。
> 头文件 `#include <sqlite3.h>`，链接 `-lsqlite3`（vcpkg 包名 `sqlite3`）。

---

## 核心概念

SQLite 的 C 接口围绕两个核心对象：

| 对象 | 类型 | 创建 | 销毁 |
|------|------|------|------|
| 数据库连接 | `sqlite3 *` | `sqlite3_open()` | `sqlite3_close()` |
| 预编译语句 | `sqlite3_stmt *` | `sqlite3_prepare_v2()` | `sqlite3_finalize()` |

一次典型的查询流程官方原文只有四步（"The foregoing is all one really needs to know in
order to use SQLite effectively"）：

1. **Prepare** — `sqlite3_prepare_v2()` 把 SQL 文本编译成字节码（不执行）。
2. **Step** — `sqlite3_step()` 逐行求值。
3. **Extract** — 在两次 step 之间用 `sqlite3_column_*()` 读取当前行的各列。
4. **Finalize** — `sqlite3_finalize()` 释放语句。

```
prepare → step → step → … → step(SQLITE_DONE) → finalize
            ↑
      sqlite3_column_*(stmt, i)  取当前行第 i 列（i 从 0 开始）
```

**关键约定：**

- 几乎所有函数返回整数结果码，`SQLITE_OK` 表示成功。
- `sqlite3_step()` 返回 `SQLITE_ROW`（还有一行可读）或 `SQLITE_DONE`（执行完毕）。
- 列索引从 0 开始；字符串一律 UTF-8。
- 错误详情用 `sqlite3_errmsg(db)` 获取。
- **防 SQL 注入**：把用户数据用 `sqlite3_bind_*()` 绑定到 SQL 中的参数位
  （`?`、`?NNN`、`:name`、`$name`、`@name`），而不是拼接进 SQL 字符串。
  参数只能出现在 DQL/DML 中值的位置，不能用于表名/列名。

---

## 1. 打开 / 关闭连接

```c
int sqlite3_open(const char *filename, sqlite3 **ppDb);
int sqlite3_open_v2(const char *filename, sqlite3 **ppDb, int flags, const char *zVfs);
int sqlite3_close(sqlite3*);
int sqlite3_close_v2(sqlite3*);
```

- `sqlite3_open()`：打开已存在或创建新库。**即使出错也通常会在 `*ppDb` 返回句柄**
  （内存分配失败是唯一例外），调用方仍应调用 `sqlite3_close()`。
- `sqlite3_open_v2()`：多两个参数。`flags` 至少包含一种组合：
  - `SQLITE_OPEN_READONLY`
  - `SQLITE_OPEN_READWRITE`
  - `SQLITE_OPEN_READWRITE | SQLITE_OPEN_CREATE`（等价于默认 open 行为，最常用）
  - 常用附加：`SQLITE_OPEN_FULLMUTEX`（多线程可共享同一连接）、`SQLITE_OPEN_NOMUTEX`、
    `SQLITE_OPEN_URI`（文件名按 URI 解析）。
  - `zVfs` 传 `NULL` 使用默认 VFS。
- `sqlite3_close()`：销毁连接；若还有未 finalize 的语句返回 `SQLITE_BUSY`。
  `sqlite3_close_v2()` 允许存在未 finalize 语句时关闭，连接会等最后一个语句
  finalize 后真正释放。新代码推荐 `sqlite3_close_v2()`。

C++ 示例（打开 + 关闭）：

```cpp
#include <sqlite3.h>
#include <stdexcept>
#include <string>

sqlite3* open_db(const std::string& path) {
    sqlite3* db = nullptr;
    int rc = sqlite3_open_v2(path.c_str(), &db,
        SQLITE_OPEN_READWRITE | SQLITE_OPEN_CREATE | SQLITE_OPEN_FULLMUTEX,
        nullptr);
    if (rc != SQLITE_OK) {
        std::string msg = db ? sqlite3_errmsg(db) : "out of memory";
        if (db) sqlite3_close_v2(db);
        throw std::runtime_error("open db failed: " + msg);
    }
    sqlite3_busy_timeout(db, 5000);   // 5 秒锁等待
    return db;
}

void close_db(sqlite3* db) {
    if (db) sqlite3_close_v2(db);
}
```

---

## 2. 预编译与执行语句

```c
int sqlite3_prepare_v2(sqlite3 *db, const char *zSql, int nByte,
                       sqlite3_stmt **ppStmt, const char **pzTail);
int sqlite3_step(sqlite3_stmt*);
int sqlite3_finalize(sqlite3_stmt *pStmt);
int sqlite3_reset(sqlite3_stmt *pStmt);
```

- `sqlite3_prepare_v2()`：编译第一条 SQL。`nByte` 传 `-1` 表示读到字符串结尾；
  `pzTail` 不需要时传 `nullptr`；出错时 `*ppStmt` 置 NULL。返回 `SQLITE_OK`。
- `sqlite3_step()`：执行。查询语句每行返回 `SQLITE_ROW`，直到 `SQLITE_DONE`。
- `sqlite3_finalize()`：销毁语句，必须调用以防内存泄漏。
- `sqlite3_reset()`：把语句重置回初始态，**保留已绑定的参数**，可复用。

C++ 示例（查询多行）：

```cpp
#include <sqlite3.h>
#include <string>
#include <vector>
#include <stdexcept>

struct User { long long id; std::string name; int age; };

std::vector<User> query_users(sqlite3* db, int min_age) {
    sqlite3_stmt* stmt = nullptr;
    const char* sql = "SELECT id, name, age FROM users WHERE age >= ? ORDER BY id;";
    if (sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr) != SQLITE_OK)
        throw std::runtime_error(sqlite3_errmsg(db));

    sqlite3_bind_int(stmt, 1, min_age);   // ? 的索引从 1 开始

    std::vector<User> out;
    int rc;
    while ((rc = sqlite3_step(stmt)) == SQLITE_ROW) {
        User u;
        u.id   = sqlite3_column_int64(stmt, 0);
        u.name = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 1));
        u.age  = sqlite3_column_int(stmt, 2);
        out.push_back(std::move(u));
    }
    sqlite3_finalize(stmt);

    if (rc != SQLITE_DONE)
        throw std::runtime_error(sqlite3_errmsg(db));
    return out;
}
```

注意：`sqlite3_column_text()` 返回的指针在**下一次 step / reset / finalize 或发生类型转换
之前**有效，所以要立即拷贝进 `std::string`。

---

## 3. 绑定参数 `sqlite3_bind_*`

```c
int sqlite3_bind_blob(sqlite3_stmt*, int, const void*, int n, void(*)(void*));
int sqlite3_bind_double(sqlite3_stmt*, int, double);
int sqlite3_bind_int(sqlite3_stmt*, int, int);
int sqlite3_bind_int64(sqlite3_stmt*, int, sqlite3_int64);
int sqlite3_bind_null(sqlite3_stmt*, int);
int sqlite3_bind_text(sqlite3_stmt*, int, const char*, int, void(*)(void*));
int sqlite3_bind_zeroblob(sqlite3_stmt*, int, int n);
int sqlite3_bind_parameter_index(sqlite3_stmt*, const char *zName);
int sqlite3_clear_bindings(sqlite3_stmt*);
```

- 参数索引从 1 开始（对应 SQL 中的 `?`、`?NNN`、`:name`）。
- 绑定在 `sqlite3_reset()` 后保留；未绑定的参数默认是 NULL。
- 最后一个参数是析构回调：
  - `SQLITE_TRANSIENT`：SQLite 在函数返回前**拷贝一份**数据（传 `std::string` 等
    临时数据时**最常用**）。
  - `SQLITE_STATIC`：SQLite 只持有指针，调用方保证其生命周期（传生命周期很长的
    常量字符串时可用）。
- 文本/Blob 的第 4 个参数是**字节数**，不是字符数；传 `-1` 表示读到第一个 NUL。

C++ 示例（INSERT + 复用语句 + 取 last_insert_rowid）：

```cpp
sqlite3_int64 insert_user(sqlite3* db, const std::string& name, int age) {
    sqlite3_stmt* stmt = nullptr;
    const char* sql = "INSERT INTO users(name, age) VALUES (?, ?);";
    if (sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr) != SQLITE_OK)
        throw std::runtime_error(sqlite3_errmsg(db));

    sqlite3_bind_text(stmt, 1, name.c_str(), (int)name.size(), SQLITE_TRANSIENT);
    sqlite3_bind_int(stmt, 2, age);

    if (sqlite3_step(stmt) != SQLITE_DONE) {
        std::string msg = sqlite3_errmsg(db);
        sqlite3_finalize(stmt);
        throw std::runtime_error(msg);
    }
    sqlite3_finalize(stmt);

    return sqlite3_last_insert_rowid(db);   // 新行的 rowid
}
```

---

## 4. 读取结果 `sqlite3_column_*`

```c
const void *sqlite3_column_blob(sqlite3_stmt*, int iCol);
double      sqlite3_column_double(sqlite3_stmt*, int iCol);
int         sqlite3_column_int(sqlite3_stmt*, int iCol);
sqlite3_int64 sqlite3_column_int64(sqlite3_stmt*, int iCol);
const unsigned char *sqlite3_column_text(sqlite3_stmt*, int iCol);
int         sqlite3_column_bytes(sqlite3_stmt*, int iCol);  // BLOB 或 TEXT 的字节数
int         sqlite3_column_type(sqlite3_stmt*, int iCol);   // SQLITE_INTEGER/FLOAT/TEXT/BLOB/NULL
int         sqlite3_column_count(sqlite3_stmt*);            // 列数
const char *sqlite3_column_name(sqlite3_stmt*, int iCol);
```

- 只在最近一次 `sqlite3_step()` 返回 `SQLITE_ROW` 时调用，且必须在
  `sqlite3_reset()` / `sqlite3_finalize()` 之前。
- `sqlite3_column_text()` 返回的字符串总是 NUL 结尾；`sqlite3_column_bytes()` 返回
  字节数（BLOB 无 NUL 结尾）。
- 请求的类型与存储类型不一致时 SQLite 会自动做类型转换。

C++ 示例（读取 BLOB）：

```cpp
std::vector<unsigned char> get_avatar(sqlite3* db, long long user_id) {
    sqlite3_stmt* stmt = nullptr;
    const char* sql = "SELECT avatar FROM users WHERE id = ?;";
    if (sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr) != SQLITE_OK)
        throw std::runtime_error(sqlite3_errmsg(db));
    sqlite3_bind_int64(stmt, 1, user_id);

    std::vector<unsigned char> blob;
    if (sqlite3_step(stmt) == SQLITE_ROW) {
        const unsigned char* p =
            static_cast<const unsigned char*>(sqlite3_column_blob(stmt, 0));
        int n = sqlite3_column_bytes(stmt, 0);
        blob.assign(p, p + n);
    }
    sqlite3_finalize(stmt);
    return blob;
}
```

---

## 5. 事务

官方建议用 `sqlite3_exec()` 执行 `BEGIN` / `COMMIT` / `ROLLBACK`。

```c
int sqlite3_exec(sqlite3*, const char *sql,
                 int (*callback)(void*, int, char**, char**),
                 void *, char **errmsg);
```

- 是 prepare/step/finalize 的便捷封装，可一次执行多条分号分隔的 SQL。
- 不需要处理结果行时回调传 `NULL`；回调返回非 0 会中止并返回 `SQLITE_ABORT`。
- 出错时 `*errmsg` 由 SQLite 用 `sqlite3_malloc` 分配，用完后必须 `sqlite3_free(*errmsg)`。

C++ 示例（批量写入用事务，语句复用）：

```cpp
void batch_insert(sqlite3* db, const std::vector<User>& users) {
    char* err = nullptr;
    auto exec = [&](const char* sql) {
        if (sqlite3_exec(db, sql, nullptr, nullptr, &err) != SQLITE_OK) {
            std::string msg = err ? err : sqlite3_errmsg(db);
            sqlite3_free(err);
            err = nullptr;
            throw std::runtime_error(msg);
        }
    };

    // 写事务用 BEGIN IMMEDIATE：立即取写锁，避免 WAL 下与其他写者互相等待/死锁
    exec("BEGIN IMMEDIATE;");
    try {
        sqlite3_stmt* stmt = nullptr;
        const char* sql = "INSERT INTO users(name, age) VALUES (?, ?);";
        if (sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr) != SQLITE_OK)
            throw std::runtime_error(sqlite3_errmsg(db));

        for (const auto& u : users) {
            sqlite3_bind_text(stmt, 1, u.name.c_str(), (int)u.name.size(), SQLITE_TRANSIENT);
            sqlite3_bind_int(stmt, 2, u.age);
            if (sqlite3_step(stmt) != SQLITE_DONE)
                throw std::runtime_error(sqlite3_errmsg(db));
            sqlite3_reset(stmt);   // 复用语句，绑定值保留
        }
        sqlite3_finalize(stmt);

        exec("COMMIT;");
    } catch (...) {
        exec("ROLLBACK;");
        throw;
    }
}
```

---

## 6. WAL 模式

```sql
PRAGMA journal_mode=WAL;
```

- WAL（Write-Ahead Logging）：写操作先追加到 `-wal` 文件；读不阻塞写、写不阻塞读，
  适合桌面应用多连接（例如后台线程 + UI 线程）的场景。
- WAL 是**持久化**的：对同一数据库文件设置一次，之后所有连接都保持 WAL。
- 需要配合 `sqlite3_busy_timeout`，否则并发写会返回 `SQLITE_BUSY`。

Checkpoint 相关：

```c
int sqlite3_wal_checkpoint(sqlite3 *db, const char *zDb);   // 等价于 PASSIVE
int sqlite3_wal_checkpoint_v2(sqlite3 *db, const char *zDb,
                              int eMode, int *pnLog, int *pnCkpt);
int sqlite3_wal_autocheckpoint(sqlite3 *db, int nFrame);
```

- `sqlite3_wal_checkpoint(db, NULL)`：把 WAL 内容合并回主库文件并重置 WAL（被动模式）。
- `sqlite3_wal_checkpoint_v2()` 的 `eMode`：
  - `SQLITE_CHECKPOINT_PASSIVE` —— 默认，不阻塞，能推多少推多少
  - `SQLITE_CHECKPOINT_FULL` —— 阻塞直到完成并重置 WAL
  - `SQLITE_CHECKPOINT_RESTART` —— 同 FULL，且等所有读事务结束后才重置
  - `SQLITE_CHECKPOINT_TRUNCATE` —— 同 RESTART，并把 WAL 文件截断为 0
- `sqlite3_wal_autocheckpoint(db, N)`：WAL 增长到约 N 帧时自动 checkpoint（默认 1000）。

C++ 示例（开启 WAL + 手动 checkpoint）：

```cpp
void enable_wal(sqlite3* db) {
    sqlite3_stmt* stmt = nullptr;
    const char* sql = "PRAGMA journal_mode=WAL;";
    if (sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr) != SQLITE_OK)
        throw std::runtime_error(sqlite3_errmsg(db));

    std::string mode;
    if (sqlite3_step(stmt) == SQLITE_ROW)
        mode = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 0));
    sqlite3_finalize(stmt);

    if (mode != "wal")
        throw std::runtime_error("failed to enable WAL, mode=" + mode);
}

void checkpoint_full(sqlite3* db) {
    if (sqlite3_wal_checkpoint_v2(db, nullptr, SQLITE_CHECKPOINT_TRUNCATE,
                                  nullptr, nullptr) != SQLITE_OK)
        throw std::runtime_error(sqlite3_errmsg(db));
}
```

---

## 7. 其他常用扩展

### busy_timeout（锁等待）

```c
int sqlite3_busy_timeout(sqlite3*, int ms);
```

表被锁时让 step 睡眠等待最多 `ms` 毫秒，超时后返回 `SQLITE_BUSY`。
传 `<= 0` 关闭等待。等价于 `PRAGMA busy_timeout`。

### last_insert_rowid（最近插入的 rowid）

```c
sqlite3_int64 sqlite3_last_insert_rowid(sqlite3*);
```

返回该连接最近一次成功 INSERT 到 rowid 表（**不含 WITHOUT ROWID 表**）的 rowid；
从未成功插入过返回 0。约束失败的 INSERT 不会更新该值；被回滚的 INSERT 仍会计入。

### errmsg / errcode / errstr

```c
const char *sqlite3_errmsg(sqlite3*);
int         sqlite3_errcode(sqlite3 *db);
int         sqlite3_extended_errcode(sqlite3 *db);
const char *sqlite3_errstr(int);
void        sqlite3_free(void*);
```

- `sqlite3_errmsg()`：最近错误的英文描述（UTF-8），内存由 SQLite 内部管理，
  下次调用会被覆盖。
- `sqlite3_errcode()`：最近失败调用的主结果码；`sqlite3_extended_errcode()` 返回
  扩展码。
- `sqlite3_errstr(E)`：把结果码 `E` 翻译成静态英文文本（不需要连接）。
- `sqlite3_free()`：释放 SQLite 分配的内存（如 `sqlite3_exec` 的 `errmsg`）。

---

## 8. 编译链接（vcpkg / CMake）

```
vcpkg install sqlite3

# CMakeLists.txt
find_package(SQLite3 REQUIRED)
target_link_libraries(app PRIVATE SQLite::SQLite3)
```
