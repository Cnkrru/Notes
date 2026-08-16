# QML 与 C++ 集成（UI 与服务对接）

> 基于 Qt 官方文档整理。QML 引擎与 Qt 元对象系统深度集成，任何 `QObject` 派生类的属性（`Q_PROPERTY`）、方法（`Q_INVOKABLE` / public slots）和信号都可从 QML 访问。UI（QML）与业务/服务层（C++）正是通过这套机制对接。

## 一、对接方式总览

要把 C++ 服务或数据暴露给 QML，官方提供以下几种方式：

| 方式 | 宏 / API | 适用场景 | 官方建议 |
|------|----------|----------|----------|
| 注册为可实例化类型 | `QML_ELEMENT` | 该类型需在 QML 中多次实例化 | 常规使用 |
| 注册为单例类型 | `QML_SINGLETON` | 服务需在多处被访问（全局能力/服务层） | **服务层首选** |
| 初始化属性注入 | `QML_UNCREATABLE` + `QQmlComponent::createWithInitialProperties` + `required property` | 服务只需根组件访问 | 推荐 |
| Context Property 嵌入 | `QQmlContext::setContextProperty` | 临时把 C++ 对象塞进 QML 作用域 | **避免** |

> 官方明确警告：Context Property 会与具体 context 耦合，破坏组件复用，且对 `qmllint`、QML 编译器、语言服务器等工具不可见（被当作 unqualified access）。一般可用**根对象属性**或**单例**替代。

## 二、核心原理

QML 引擎与 Qt 元对象系统深度集成。任何 `QObject` 派生类的属性（`Q_PROPERTY`）、方法（`Q_INVOKABLE` / public slots）和信号都可以从 QML 访问。

## 三、注册 C++ 类型到 QML

### CMake 配置

```cmake
find_package(Qt6 REQUIRED COMPONENTS Qml Quick)
qt_add_qml_module(myapp
    URI com.mycompany.messaging
    VERSION 1.0
    SOURCES
        message.cpp message.h
)
```

### C++ 类定义

```cpp
#include <QObject>
#include <QtQml/qqmlregistration.h>

class Message : public QObject
{
    Q_OBJECT
    QML_ELEMENT
    Q_PROPERTY(QString author READ author WRITE setAuthor NOTIFY authorChanged)
    Q_PROPERTY(QDateTime creationDate READ creationDate WRITE setCreationDate NOTIFY creationDateChanged)

public:
    void setAuthor(const QString &a) {
        if (a != m_author) {
            m_author = a;
            emit authorChanged();
        }
    }
    QString author() const { return m_author; }

signals:
    void authorChanged();

private:
    QString m_author;
};
```

### QML 中使用

```qml
import com.mycompany.messaging

Message {
    author: "Amelie"
    creationDate: new Date()
}
```

## 四、暴露属性和方法

| QML 可见项 | C++ 声明 | 说明 |
|-----------|----------|------|
| 属性 | `Q_PROPERTY(... READ ... WRITE ... NOTIFY ...)` | 可读写，`NOTIFY` 信号让 QML 感知变化 |
| 方法 | `Q_INVOKABLE` 或 `public slots` | QML 中可直接调用 |
| 信号 | `signals:` | QML 自动生成 `onXxx` 处理器 |
| 枚举 | `Q_ENUM` | 可以从 QML 访问枚举值 |

```cpp
class MessageBoard : public QObject
{
    Q_OBJECT
    QML_ELEMENT

public:
    Q_INVOKABLE bool postMessage(const QString &msg) {
        qDebug() << "Called the C++ method with" << msg;
        return true;
    }

public slots:
    void refresh() {
        qDebug() << "Called the C++ slot";
    }
};
```

## 五、暴露信号

```cpp
class MessageBoard : public QObject
{
    Q_OBJECT
signals:
    void newMessagePosted(const QString &subject);
};
```

QML 中使用：

```qml
MessageBoard {
    onNewMessagePosted: (subject) => console.log("New message:", subject)
}
```

## 六、注册方式速查

| 宏 | 用途 |
|------|------|
| `QML_ELEMENT` | 注册为可实例化的 QML 对象类型 |
| `QML_NAMED_ELEMENT(name)` | 使用自定义名称注册 |
| `QML_SINGLETON` | 注册为单例类型 |
| `QML_UNCREATABLE(reason)` | 注册为不可实例化类型（暴露枚举等） |
| `QML_VALUE_TYPE(name)` | 注册为值类型（Q_GADGET，小写名称） |
| `QML_ANONYMOUS` | 匿名注册，QML 不可引用 |
| `QML_ADDED_IN_VERSION(v)` | 标记类型在特定版本引入 |

## 七、服务层对接模式（推荐）

### 7.1 单例服务（`QML_SINGLETON`）

服务层往往是全局能力（状态、网络、数据库），用单例最合适：一处 import 即可在任意组件访问。

```cpp
// AppService.h
class AppService : public QObject
{
    Q_OBJECT
    QML_ELEMENT
    QML_SINGLETON
    Q_PROPERTY(bool connected READ connected NOTIFY connectedChanged)
public:
    Q_INVOKABLE void login(const QString &user, const QString &pwd);
signals:
    void connectedChanged();
};
```

```qml
import com.mycompany.messaging

Button {
    onClicked: AppService.login(userName.text, password.text)
}
```

适合：服务需在**多处**访问（超过根组件范围），此时用单例比层层向下传对象更干净。

### 7.2 初始化属性注入（`createWithInitialProperties` + `required property`）

若服务只需根组件使用，用此方式：C++ 侧 `QML_UNCREATABLE` 标记，QML 根组件声明 `required property`，C++ 加载时注入。

```qml
// Root.qml
import QtQuick
import com.mycompany.messaging

Item {
    required property AppService service
    Component.onCompleted: service.login("u", "p")
}
```

```cpp
QQmlComponent component(&engine, "Root.qml");
component.createWithInitialProperties(
    { { u"service"_s, QVariant::fromValue(new AppService) } });
```

- `required` 保证组件在未注入时无法创建，避免漏配。
- 比 Context Property 更可取：工具可见、类型明确、C++ 侧连接信号/槽更方便。

### 7.3 Context Property（不推荐）

```cpp
view.rootContext()->setContextProperty("currentDateTime", QDateTime::currentDateTime());
```

仅适合初始化一次性注入；官方不推荐，优先用 7.1 / 7.2。

## 八、从 C++ 反向对接 QML（官方不推荐，仅测试/原型）

官方建议 UI 由 QML 完全驱动，C++ 不应直接操作 QML 对象（会破坏 UI 与逻辑分离）。以下 API 仅用于测试/原型。

### 加载 QML 对象

| 方式 | 类 | 说明 |
|------|-----|------|
| 纯对象加载 | `QQmlComponent` | `create()` 生成对象树，可轻易重建 |
| 显示渲染 | `QQuickView` | 继承 `QWindow`，自动渲染，`rootObject()` 取根 |

### 读写属性

```cpp
object->setProperty("width", 500);          // 保留绑定
QQmlProperty(object, "width").write(500);   // 移除绑定
```

> 二者区别：`setProperty` 保留原有绑定（`width: height` 仍会随 height 更新）；`QQmlProperty::write` 会**移除绑定**。修改属性务必走元对象 API，直接改成员变量会绕过绑定与 `onXxxChanged`。

### 调用 QML 方法

```cpp
QMetaObject::invokeMethod(object, "methodName",
                          Q_RETURN_ARG(int, result), Q_ARG(int, 42));
```

### 连接 QML 信号

```cpp
QObject::connect(item, SIGNAL(qmlSignal(QString)),
                 &myClass, SLOT(cppSlot(QString)));
```

### 按名称查找子对象

```cpp
QObject *rect = object->findChild<QObject*>("rect");
rect->setProperty("color", "red");
```

## 九、数据模型对接（Model / View）

大量数据不要逐条暴露属性，用模型暴露给 QML 视图：

| C++ 模型类型 | 适用场景 | 复杂度 |
|--------------|----------|--------|
| `QStringList` | 简单字符串列表 | 低 |
| `QVariantList` | 简单异构数据列表 | 低 |
| `QObjectList`（`QList<QObject*>`） | 对象列表，属性可直接绑定 | 中 |
| `QAbstractItemModel` | 复杂树形/表格模型，动态增删改 | 高 |

`QAbstractItemModel` 提供最灵活的方案，支持增删改、排序、过滤，QML 的 `ListView` / `GridView` / `TableView` 直接消费。

## 十、异步服务调用

服务层（网络、数据库、耗时计算）通常是异步的。模式：**C++ 侧异步发起 + 信号回调，QML 侧用信号处理器接收**。

```cpp
// 网络服务（QNetworkAccessManager）
class ApiService : public QObject
{
    Q_OBJECT
    QML_ELEMENT
    QML_SINGLETON
public:
    Q_INVOKABLE void fetchData() {
        auto *reply = m_nam.get({QUrl("https://api.example.com/data")});
        connect(reply, &QNetworkReply::finished, this, [this, reply] {
            emit dataReady(reply->readAll());
            reply->deleteLater();
        });
    }
signals:
    void dataReady(const QString &json);
private:
    QNetworkAccessManager m_nam;
};
```

```qml
Connections {
    target: ApiService
    onDataReady: (json) => model.load(json)
}
```

要点：
- 用 `QNetworkAccessManager` / `QThread` / `QtConcurrent` 在 C++ 侧异步执行，避免阻塞 UI 主线程。
- 通过信号（`NOTIFY` / 自定义 signal）把结果推给 QML，QML 用 `onXxx` 或 `Connections` 接收。
- 不要在 QML JS 里做重 IO，QML 的 JS 引擎跑在 UI 线程。

## 十一、数据类型转换

QML 与 C++ 交换数据时，引擎自动转换常见类型：

| QML 类型 | C++ 类型 |
|----------|----------|
| `int` / `double` | `int` / `double` |
| `bool` | `bool` |
| `string` | `QString` |
| `var` | `QVariant` |
| `date` / `time` / `datetime` | `QDate` / `QTime` / `QDateTime` |
| `url` | `QUrl` |
| `color` | `QColor` |
| `list<...>` | `QVariantList`（或 `QList<...>`） |
| 对象类型 | `QObject*` / `T*` |
| 值类型 | `Q_GADGET` 派生值类型 |

## 十二、分组属性与对象列表

### 对象列表属性

```cpp
class MessageBoard : public QObject
{
    Q_OBJECT
    Q_PROPERTY(QQmlListProperty<Message> messages READ messages)
public:
    QQmlListProperty<Message> messages();
    static void append_message(QQmlListProperty<Message> *list, Message *msg);
    QList<Message *> m_messages;
};
```

### 分组属性

```cpp
class MessageAuthor : public QObject
{
    Q_PROPERTY(QString name READ name WRITE setName)
    Q_PROPERTY(QString email READ email WRITE setEmail);
};

class Message : public QObject
{
    Q_PROPERTY(MessageAuthor* author READ author)  // 只读 → 分组属性
};
```

QML 中使用：

```qml
Message {
    author.name: "Alexandra"
    author.email: "alexandra@mail.com"
}
```

## 十三、类型修订

```cpp
class CppType : public BaseType
{
    Q_OBJECT
    // 标记为在 1.1 版本引入
    Q_PROPERTY(int root READ root WRITE setRoot NOTIFY rootChanged REVISION(1, 0))
    QML_ELEMENT

signals:
    Q_REVISION(1, 0) void rootChanged();
};
```

## 十四、最佳实践（官方）

- 尽量将业务逻辑放在 C++ 层，QML 专注于 UI 展示。
- 使用 `Q_PROPERTY` 暴露数据，自动获得属性绑定支持。
- 通过 `NOTIFY` 信号确保 QML 能感知属性变化。
- 大量数据使用 Model/View 模式，而非逐条暴露属性。
- 性能敏感操作使用 `Q_INVOKABLE` 方法在 C++ 端处理。
- **服务/全局状态优先用 `QML_SINGLETON` 或初始化属性注入**，避免 Context Property。
- **C++ 不要直接操纵 QML 对象**（`findChild` / `setProperty` 仅限测试），让 QML 驱动 UI、C++ 提供数据与能力，保持职责分离。