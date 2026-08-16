导入：`import QtQuick.Controls`

## 按钮类

| 控件 | 说明 |
|------|------|
| `Button` | 标准按钮 |
| `CheckBox` | 复选框 |
| `RadioButton` | 单选按钮 |
| `Switch` | 开关 |
| `RoundButton` | 圆角按钮 |
| `ToolButton` | 工具栏按钮 |
| `DelayButton` | 长按触发按钮 |

```qml
Button {
    text: "Click Me"
    onClicked: console.log("clicked")
}

CheckBox {
    text: "Enable feature"
    checked: true
    onCheckedChanged: console.log("checked:", checked)
}

RadioButton {
    text: "Option A"
    checked: true
}

Switch {
    text: "Wi-Fi"
    checked: true
}
```

## 容器类

| 控件 | 说明 |
|------|------|
| `ApplicationWindow` | 顶层窗口（含 header/footer） |
| `Page` | 带 header/footer 的页面 |
| `Frame` | 视觉框 |
| `GroupBox` | 带标题的分组框 |
| `Pane` | 风格化的背景容器 |
| `ScrollView` | 可滚动视图 |
| `SplitView` | 可拖拽分割视图 |
| `StackView` | 栈式导航 |
| `SwipeView` | 滑动页面导航 |
| `TabBar` + `TabButton` | 选项卡 |

```qml
ApplicationWindow {
    width: 400; height: 300
    visible: true

    header: ToolBar {
        Label { text: "My App" }
    }

    StackView {
        id: stack
        initialItem: Page {
            Button {
                text: "Next"
                onClicked: stack.push(page2)
            }
        }
    }
}
```

### TabBar 选项卡

```qml
TabBar {
    id: bar
    width: parent.width
    TabButton { text: "Home" }
    TabButton { text: "Settings" }
    TabButton { text: "About" }
}

SwipeView {
    anchors.fill: parent
    currentIndex: bar.currentIndex
    Page { Label { text: "Home Page" } }
    Page { Label { text: "Settings Page" } }
    Page { Label { text: "About Page" } }
}
```

## 输入控件

| 控件 | 说明 |
|------|------|
| `TextField` | 单行文本输入 |
| `TextArea` | 多行文本输入 |
| `ComboBox` | 下拉选择框 |
| `SpinBox` | 整数微调框 |
| `DoubleSpinBox` | 浮点数微调框 |
| `Slider` | 滑块 |
| `RangeSlider` | 范围滑块 |
| `Dial` | 旋钮 |
| `Tumbler` | 滚轮选择器 |

```qml
TextField {
    placeholderText: "Enter your name"
    onTextChanged: console.log(text)
}

ComboBox {
    model: ["Option 1", "Option 2", "Option 3"]
    onActivated: console.log(currentText)
}

Slider {
    from: 0; to: 100
    value: 50
    onValueChanged: console.log(value)
}

SpinBox {
    from: 0; to: 100
    value: 50
    onValueChanged: console.log(value)
}
```

## 弹窗与菜单

| 控件 | 说明 |
|------|------|
| `Dialog` | 标准对话框 |
| `Popup` | 弹窗基类 |
| `Drawer` | 侧滑面板 |
| `Menu` | 弹出菜单 |
| `MenuBar` | 菜单栏 |
| `ToolTip` | 工具提示 |

```qml
Button {
    text: "Open Dialog"
    onClicked: dialog.open()
}

Dialog {
    id: dialog
    title: "Confirm"
    standardButtons: Dialog.Ok | Dialog.Cancel
    Label { text: "Are you sure?" }
    onAccepted: console.log("Ok clicked")
    onRejected: console.log("Cancel clicked")
}

// Drawer 侧滑面板
Drawer {
    id: drawer
    width: parent.width * 0.6
    height: parent.height
    Column {
        Label { text: "Menu Item 1" }
        Label { text: "Menu Item 2" }
    }
}

// Menu 弹出菜单
Button {
    text: "Menu"
    onClicked: menu.open()
    Menu {
        id: menu
        MenuItem { text: "Cut" }
        MenuItem { text: "Copy" }
        MenuItem { text: "Paste" }
    }
}
```

## 指示器类

| 控件 | 说明 |
|------|------|
| `BusyIndicator` | 加载指示器 |
| `ProgressBar` | 进度条 |
| `ScrollBar` / `ScrollIndicator` | 滚动条 |

```qml
BusyIndicator {
    running: true
    anchors.centerIn: parent
}

ProgressBar {
    from: 0; to: 100
    value: 45
    width: 200
}
```

## 代理类

`ItemDelegate`、`CheckDelegate`、`RadioDelegate`、`SwitchDelegate`、`SwipeDelegate` 用于 ListView 等视图中：

```qml
ListView {
    model: ["Item 1", "Item 2", "Item 3"]
    delegate: ItemDelegate {
        text: modelData
        onClicked: console.log("clicked:", modelData)
    }
}
```

## 总结

Qt Quick Controls 提供了构建现代 UI 所需的全套控件。选择建议：

- **按钮操作**：Button、CheckBox、RadioButton、Switch
- **页面导航**：StackView、SwipeView、TabBar
- **数据输入**：TextField、ComboBox、Slider、SpinBox
- **信息展示**：Label、ProgressBar、BusyIndicator
- **交互反馈**：Dialog、Drawer、Menu、ToolTip