## 布局方式概览

QML 提供四种布局方式：

| 方式 | 适用场景 | 灵活性 |
|------|----------|--------|
| 手动定位 (x/y) | 精确位置控制 | 低 |
| Anchors 锚定 | 相对布局 | 高 |
| Positioners 定位器 | 简单排列 | 中 |
| Layouts 布局 | 响应式布局 | 最高 |

## 手动定位

直接设置 x、y 属性：

```qml
Rectangle {
    x: 20; y: 20
    width: 80; height: 80
    color: "red"
}
```

## Anchors 锚定布局

每个 Item 有 7 条锚线：`left`、`horizontalCenter`、`right`、`top`、`verticalCenter`、`baseline`、`bottom`。

### 基本锚定

```qml
Rectangle {
    // 锚定到父对象右侧和顶部
    anchors.right: parent.right
    anchors.top: parent.top
    anchors.margins: 20          // 统一边距

    // 居中
    anchors.centerIn: parent

    // 填充父对象
    anchors.fill: parent

    // 单独边距
    anchors.left: parent.left
    anchors.leftMargin: 10
    anchors.topMargin: 5
}
```

### 多锚点控制尺寸

```qml
Rectangle {
    // 左右同时锚定 → 自动拉伸
    anchors.left: rect1.right
    anchors.right: rect3.left
}
```

### 锚定限制

- 只能锚定到同级兄弟或直接父对象
- 锚定布局与绝对定位（x/y/width/height）不能混用
- 条件绑定中修改锚定应使用 `AnchorChanges` 而非直接赋值

## Positioners 定位器

Row、Column、Grid、Flow 用于常规排列：

```qml
Row {
    spacing: 20
    Rectangle { width: 80; height: 80; color: "red" }
    Rectangle { width: 80; height: 80; color: "green" }
    Rectangle { width: 80; height: 80; color: "blue" }
}

Column {
    spacing: 10
    Text { text: "Item 1" }
    Text { text: "Item 2" }
}

Grid {
    columns: 3
    spacing: 5
    Repeater {
        model: 9
        Rectangle { width: 50; height: 50; color: "lightblue" }
    }
}
```

## Qt Quick Layouts

需要 `import QtQuick.Layouts`。支持自动调整大小、尺寸约束、对齐、拉伸等。

### RowLayout

```qml
import QtQuick.Layouts

RowLayout {
    anchors.fill: parent
    spacing: 6

    Rectangle {
        color: "orange"
        Layout.fillWidth: true
        Layout.minimumWidth: 50
        Layout.preferredWidth: 100
        Layout.maximumWidth: 300
        Layout.minimumHeight: 150
    }

    Rectangle {
        color: "plum"
        Layout.fillWidth: true
        Layout.fillHeight: true
        Layout.preferredWidth: 200
    }
}
```

### GridLayout

支持行列跨度和坐标：

```qml
GridLayout {
    rows: 3
    columns: 2
    flow: GridLayout.TopToBottom

    Label { text: "Line 1" }
    Label { text: "Line 2" }
    Label { text: "Line 3" }
    TextField { }
    TextField { }

    TextArea {
        Layout.rowSpan: 3
        Layout.columnSpan: 2
        Layout.fillHeight: true
        Layout.fillWidth: true
    }
}
```

### 关键 Layout 附加属性

| 属性 | 说明 |
|------|------|
| `Layout.fillWidth` / `Layout.fillHeight` | 是否填充可用空间 |
| `Layout.minimumWidth` / `Layout.maximumWidth` | 最小/最大尺寸约束 |
| `Layout.preferredWidth` / `Layout.preferredHeight` | 首选尺寸 |
| `Layout.alignment` | 对齐方式（如 `Qt.AlignHCenter`） |
| `Layout.rowSpan` / `Layout.columnSpan` | GridLayout 的行列跨度 |
| `Layout.row` / `Layout.column` | GridLayout 的坐标 |

## 布局选择建议

- **简单排列**：使用 Row、Column、Grid Positioners
- **响应式/自适应界面**：使用 Qt Quick Layouts
- **相对定位**：使用 Anchors
- **精确像素控制**：使用手动定位