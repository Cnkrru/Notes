AL 项目使用 SQLite 作为主数据库（存储媒体索引、密码、笔记、配置等）。Qt SQL 模块提供内置 SQLite 驱动，无需额外安装。

## 连接数据库

```cpp
#include <QSqlDatabase>
#include <QSqlQuery>
#include <QSqlError>

QSqlDatabase db = QSqlDatabase::addDatabase("QSQLITE");
db.setDatabaseName("al.db");

if (!db.open()) {
    qWarning() << "Open failed:" << db.lastError().text();
    return;
}

// 用完关闭
db.close();
QSqlDatabase::removeDatabase(db.connectionName());
```

## 建表

```cpp
QSqlQuery q(db);
q.exec(R"(
    CREATE TABLE IF NOT EXISTS vault_videos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        path TEXT NOT NULL,
        name TEXT NOT NULL,
        size INTEGER,
        duration INTEGER,
        resolution TEXT,
        codec TEXT
    )
)");
```

## 预处理插入（防 SQL 注入）

```cpp
QSqlQuery ins(db);
ins.prepare("INSERT INTO vault_videos (path, name, size) "
            "VALUES (:path, :name, :size)");
ins.bindValue(":path", "/videos/movie.mp4");
ins.bindValue(":name", "Movie");
ins.bindValue(":size", 1024000);

if (!ins.exec())
    qWarning() << ins.lastError().text();

int newId = ins.lastInsertId().toInt();
```

## 查询

```cpp
QSqlQuery q(db);
q.exec("SELECT id, name, size FROM vault_videos WHERE size > 0");

while (q.next()) {
    int id = q.value(0).toInt();
    QString name = q.value("name").toString();
    qint64 size = q.value("size").toLongLong();
}
```

## 事务

批处理时务必使用事务，否则每条 INSERT 都是一次独立事务，极慢：

```cpp
QSqlQuery q(db);

// 开始事务
q.exec("BEGIN IMMEDIATE");

q.prepare("INSERT INTO vault_videos (name) VALUES (:name)");
for (const auto &video : videos) {
    q.bindValue(":name", video.name);
    q.exec();
}

// 提交
q.exec("COMMIT");
// 异常时回滚：q.exec("ROLLBACK");
```

## QSqlTableModel — 数据绑定

把整张表映射为可编辑 Model，直接绑定 QTableView：

```cpp
QSqlTableModel *model = new QSqlTableModel(nullptr, db);
model->setTable("vault_videos");
model->setEditStrategy(QSqlTableModel::OnManualSubmit);
model->setHeaderData(0, Qt::Horizontal, "ID");
model->setHeaderData(1, Qt::Horizontal, "Name");
model->select();

QTableView *view = new QTableView;
view->setModel(model);
view->show();

// 保存/取消编辑
// model->submitAll();
// model->revertAll();
```

## AL 项目数据库表设计

| 表 | 用途 | 关键字段 |
|----|------|---------|
| `vault_config` | 键值配置 | key, value, updated_at |
| `passwords` | 加密密码 | id, title, username, password_encrypted |
| `registry` | 键值存储 | key, value, type, category |
| `mobile_devices` | 设备授权 | device_id, device_name, status |
| `vault_videos` | 视频索引 | id, path, name, size, duration, codec |
| `vault_audios` | 音频索引 | id, path, name, size, duration, artist |
| `vault_photos` | 图片索引 | id, path, name, size, width, height |
| `vault_books` | 图书索引 | id, path, name, size, format |
| `vault_notes` | 笔记索引 | id, title, content, tags, created_at |

## WAL 模式

WAL（Write-Ahead Logging）允许读写并发，适合桌面应用：

```cpp
QSqlQuery q(db);
q.exec("PRAGMA journal_mode=WAL;");
q.exec("PRAGMA busy_timeout=5000;");  // 5秒锁等待
```

## 迁移策略

AL 项目从 Electron 迁移时的数据兼容：

1. 首次启动检测旧数据库 `{userData}/config/app.db` 是否存在
2. 若存在：自动执行 schema 迁移到新位置
3. 若不存在：创建新数据库 + 初始化默认配置
4. 每 30 分钟自动 WAL CHECKPOINT

## CMake 配置

```cmake
find_package(Qt6 REQUIRED COMPONENTS Sql)
target_link_libraries(app PRIVATE Qt6::Sql)
```

## 注意事项

1. QSqlDatabase 连接不要长期保存副本，需要时用 `QSqlDatabase::database()` 现取
2. 字符串拼接 SQL 是安全风险，务必用 `bindValue()` 预处理
3. 批处理写入一定要用事务包裹
4. 生产环境建议直接用 SQLite C API 以获得更好的性能和可控性（见后续章节）