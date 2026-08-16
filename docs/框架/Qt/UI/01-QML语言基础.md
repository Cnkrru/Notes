## 导入声明

每个 QML 文件顶部需要 import 语句引入所需模块：

```qml
import QtQuick           // QtQuick 核心模块
import QtQuick.Controls  // 控件模块
import QtQuick.Layouts   // 布局模块
import "myUtils.js" as Utils  // 导入 JavaScript 文件
```

## 对象声明

QML 采用声明式语法，通过嵌套大括号构建对象树：

```qml
Rectangle {
    width: 100
    height: 100
    color: "red"

    Text {
        anchors.centerIn: parent
        text: "Hello, QML!"
    }
}
```

## id 属性

每个对象最多有一个 id，用于在代码中引用该对象。id 必须以小写字母或下划线开头，创建后不可修改：

```qml
Column {
    TextInput { id: myTextInput; text: "Hello World" }
    Text { text: myTextInput.text }   // 引用 myTextInput 的 text 属性
}
```

## 自定义属性

QML 支持多种属性类型：

```qml
Rectangle {
    // 基本类型属性
    property int someNumber: 42
    property string someString: "hello"
    property color nextColor: "blue"

    // var 泛型属性
    property var someList: [1, 2, "three"]
    property var someObject: Rectangle { width: 100; height: 100; color: "red" }

    // 只读属性
    readonly property int readOnlyValue: 100

    // 必填属性
    required property int requiredValue

    // 属性别名 — 引用已有属性
    property alias buttonText: textItem.text

    // 对象列表属性
    property list<Rectangle> siblingRects: [
        Rectangle { color: "red" },
        Rectangle { color: "blue" }
    ]
}
```

## 属性绑定

属性绑定是 QML 的核心特性 — 声明属性间的依赖关系，当依赖变化时自动重新计算：

```qml
Rectangle {
    width: 200; height: 200

    Rectangle {
        width: parent.width / 2            // 绑定到父对象的 width
        height: Math.min(parent.width, 100) // 使用 JavaScript 表达式
        color: parent.height > 100 ? "red" : "blue"  // 条件绑定
    }
}
```

**命令式绑定**（使用 `Qt.binding()`）：

```qml
Rectangle {
    width: 100
    height: width * 2

    Keys.onSpacePressed: {
        // 必须用 Qt.binding() 才能保持绑定关系
        height = Qt.binding(function() { return width * 3 })
    }
}
```

## 分组属性

两种写法等价：

```qml
// 点号写法
Text {
    font.pixelSize: 12
    font.bold: true
}

// 分组写法
Text {
    font { pixelSize: 12; bold: true }
}
```

## 信号与信号处理器

### 接收信号

信号处理器命名为 `on<Signal>`（首字母大写）：

```qml
Button {
    text: "Change color!"
    onClicked: {
        rect.color = Qt.rgba(Math.random(), Math.random(), Math.random(), 1)
    }
}
```

### 属性变更信号

属性变化时自动生成 `on<Property>Changed` 处理器：

```qml
TapHandler {
    onPressedChanged: console.log("pressed:", pressed)
}
```

### 带参数的信号处理器

使用箭头函数或匿名函数：

```qml
Status {
    onErrorOccurred: (message, line, col) => console.log(`${line}:${col}: ${message}`)
    // 可省略尾部参数
    onErrorOccurred: message => console.log(message)
}
```

### 自定义信号

```qml
// SquareButton.qml
Rectangle {
    id: root
    signal activated(real xPosition, real yPosition)

    TapHandler {
        onTapped: root.activated(root.mouseXY.x, root.mouseXY.y)
    }
}

// 使用
SquareButton {
    onActivated: (xPos, yPos) => console.log(`Activated at ${xPos}, ${yPos}`)
}
```

### 使用 Connections 类型

跨对象连接信号：

```qml
Rectangle {
    id: rect
    Button { id: button }

    Connections {
        target: button
        function onClicked() { rect.color = "blue" }
    }
}
```

### 信号 connect() 方法

```qml
Rectangle {
    id: relay
    signal messageReceived(string person, string notice)

    Component.onCompleted: {
        relay.messageReceived.connect(sendToPost)
        relay.messageReceived.connect(sendToEmail)
    }

    function sendToPost(person, notice) {
        console.log(`Sending to post: ${person}, ${notice}`)
    }
}
```

## JavaScript 集成

QML 深度集成 JavaScript，可以在属性绑定、信号处理器和方法中使用 JavaScript 表达式。还可以导入外部 .js 文件复用逻辑。