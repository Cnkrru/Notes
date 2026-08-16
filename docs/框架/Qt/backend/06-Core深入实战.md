Qt Core 是所有 Qt 应用的基石。本章聚焦 AL 项目中真正会用到的 Core 模块能力。

## 信号与槽

Qt 核心通信机制，等价于 Electron 的 IPC，但延迟从 ms 级降至 ns 级。

### 基本连接

```cpp
class Counter : public QObject {
    Q_OBJECT
public:
    int value() const { return m_value; }
public slots:
    void setValue(int v) {
        if (v != m_value) { m_value = v; emit valueChanged(v); }
    }
signals:
    void valueChanged(int newValue);
private:
    int m_value = 0;
};

// 连接（编译期类型检查）
Counter a, b;
QObject::connect(&a, &Counter::valueChanged,
                 &b, &Counter::setValue);
a.setValue(12);  // b.value() == 12
```

### Lambda 连接（必须传 context）

```cpp
// context 通常是 this，保证对象销毁后自动断开
connect(&a, &Counter::valueChanged, this, [this](int v) {
    // this 存活时才会执行
});
```

### 跨线程信号槽

```cpp
// 默认 Qt::AutoConnection — 跨线程自动排队投递
connect(worker, &Worker::resultReady,
        this, &Controller::handleResult);
// 等价于 Electron 的 ipcMain.handle + contextBridge
```

## QThread 多线程

### 推荐方式：Worker + moveToThread

```cpp
class Worker : public QObject {
    Q_OBJECT
public slots:
    void doWork(const QString &param) {
        QString result = param + " done";
        emit resultReady(result);
    }
signals:
    void resultReady(const QString &result);
};

class Controller : public QObject {
    Q_OBJECT
public:
    Controller() {
        Worker *worker = new Worker;
        worker->moveToThread(&m_thread);
        connect(&m_thread, &QThread::finished,
                worker, &QObject::deleteLater);
        connect(this, &Controller::operate,
                worker, &Worker::doWork);
        connect(worker, &Worker::resultReady,
                this, &Controller::handleResult);
        m_thread.start();
    }
    ~Controller() {
        m_thread.quit();
        m_thread.wait();  // 必须 quit + wait
    }
signals:
    void operate(const QString &);
private:
    QThread m_thread;
};
```

### QRunnable + QThreadPool（一次性后台任务）

```cpp
class SaveTask : public QRunnable {
public:
    explicit SaveTask(const QByteArray &data) : m_data(data) {}
    void run() override {
        QFile f("out.bin");
        f.open(QIODevice::WriteOnly);
        f.write(m_data);
    }
private:
    QByteArray m_data;
};

// autoDelete 默认 true，池执行完自动释放
QThreadPool::globalInstance()->start(new SaveTask(data));
QThreadPool::globalInstance()->waitForDone();
```

## QJson 处理

等价于 JS 的 `JSON.parse/stringify`：

```cpp
#include <QJsonDocument>
#include <QJsonObject>
#include <QJsonArray>

// 解析
QJsonParseError err;
QJsonDocument doc = QJsonDocument::fromJson(rawData, &err);
if (doc.isNull()) {
    qWarning() << "Parse error:" << err.errorString();
    return;
}
QJsonObject obj = doc.object();
QString name = obj.value("name").toString();
int count = obj.value("count").toInt();

// 构造并保存
QJsonObject out;
out.insert("name", "AL");
out.insert("count", 42);
QJsonDocument outDoc(out);
QFile f("config.json");
if (f.open(QIODevice::WriteOnly))
    f.write(outDoc.toJson(QJsonDocument::Indented));
```

## QTimer 定时器

等价于 JS 的 setInterval / setTimeout：

```cpp
// 周期刷新（如 UI 每 5 秒拉数据）
QTimer *refresh = new QTimer(this);
connect(refresh, &QTimer::timeout, this, &MainWindow::refreshData);
refresh->start(5000);

// 一次性延迟（带 context，对象销毁后不再触发）
QTimer::singleShot(2000, this, &MainWindow::showWelcome);
```

## QSettings 配置管理

等价于 localStorage / electron-store。Windows 走注册表，也可强制 INI 文件：

```cpp
QSettings s;
s.beginGroup("MainWindow");
s.setValue("width", 1280);
s.setValue("fullscreen", false);
s.endGroup();
s.sync();

// 读取
s.beginGroup("MainWindow");
int w = s.value("width", 1024).toInt();
bool fs = s.value("fullscreen", true).toBool();
s.endGroup();
```

## QFile / QDir / QFileInfo

```cpp
// 文本读写
QFile f("data.txt");
if (f.open(QIODevice::WriteOnly | QIODevice::Text)) {
    QTextStream out(&f);
    out << "line one\n";
    out << "line two\n";
}

// 二进制读写
QFile bf("data.bin");
if (bf.open(QIODevice::ReadOnly)) {
    QByteArray data = bf.readAll();
}

// 文件信息
QFileInfo info("data.txt");
qint64 size = info.size();
QDateTime modified = info.lastModified();
```

## 常见注意事项

1. **QObject 不可拷贝**：容器存指针，别存值
2. **信号槽 lambda 必须传 context**：`connect(sender, &S::sig, this, [this]{})`
3. **跨线程信号槽**：自定义类型需 `qRegisterMetaType<T>()`
4. **不要在 UI 线程做耗时 I/O**：用 `QThreadPool` 或 `moveToThread`
5. **QThread 析构**：必须 `quit() + wait()`，直接删除运行中的线程会崩溃
6. **QString 与 const char\***：Qt6 中 `const char*` 按 UTF-8 解释