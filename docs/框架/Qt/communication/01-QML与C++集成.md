## 核心原理

QML 引擎与 Qt 元对象系统深度集成。任何 `QObject` 派生类的属性（Q_PROPERTY）、方法（Q_INVOKABLE / public slots）和信号都可以从 QML 访问。

## 注册 C++ 类型到 QML

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

## 暴露方法

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

## 暴露信号

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

## 注册方式速查

| 宏 | 用途 |
|------|------|
| `QML_ELEMENT` | 注册为可实例化的 QML 对象类型 |
| `QML_NAMED_ELEMENT(name)` | 使用自定义名称注册 |
| `QML_SINGLETON` | 注册为单例类型 |
| `QML_UNCREATABLE(reason)` | 注册为不可实例化类型（暴露枚举等） |
| `QML_VALUE_TYPE(name)` | 注册为值类型（Q_GADGET，小写名称） |
| `QML_ANONYMOUS` | 匿名注册，QML 不可引用 |
| `QML_ADDED_IN_VERSION(v)` | 标记类型在特定版本引入 |

## 对象列表属性

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

## 分组属性

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

## 类型修订

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

## 最佳实践

- 尽量将业务逻辑放在 C++ 层，QML 专注于 UI 展示
- 使用 `Q_PROPERTY` 暴露数据，自动获得属性绑定支持
- 通过 `NOTIFY` 信号确保 QML 能感知属性变化
- 大量数据使用 Model/View 模式，而非逐条暴露属性
- 性能敏感操作使用 `Q_INVOKABLE` 方法在 C++ 端处理
