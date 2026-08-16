AL 项目从 Vue 3 + TypeScript 迁移到 Qt6 QML。本指南覆盖所有常用前端概念到 QML 的对照。

## 基础元素对照

| HTML | QML 类型 | 说明 |
|------|---------|------|
| `<div>` | `Rectangle` | 基础块/容器 |
| `<span>` / 文本 | `Text` | 显示文本 |
| `<img>` | `Image` | 显示图片 |
| `<button>` | `Button` | 按钮（QtQuick.Controls） |
| `<input type="text">` | `TextField` | 单行输入 |
| `<textarea>` | `TextArea` | 多行输入 |
| `<select>` | `ComboBox` | 下拉选择 |
| `<input type="checkbox">` | `CheckBox` | 复选框 |
| `<video>` | `MediaPlayer` + `VideoOutput` | 视频播放 |
| `<ul>/<ol>/<li>` | `ListView` + `delegate` | 列表 |
| `<progress>` | `ProgressBar` | 进度条 |

### div → Rectangle

```html
<div class="card" style="width:200px;height:100px;background:#fff;border-radius:8px;">
  Hello
</div>
```

```qml
Rectangle {
    width: 200; height: 100
    color: "#ffffff"
    radius: 8
    Text { anchors.centerIn: parent; text: "Hello" }
}
```

## 布局对照

| CSS 布局 | QML 布局 |
|---------|---------|
| `display:flex; flex-direction:row` | `Row { spacing: N }` |
| `flex-direction:column` | `Column { spacing: N }` |
| `flex-wrap: wrap` | `Flow { }` |
| `display:grid` | `Grid { columns: N }` 或 `GridLayout` |
| `position:absolute; top/left` | `x` / `y` 或 `anchors { }` |
| `margin` / `padding` | `anchors.margins` / `spacing` |
| `z-index` | `z` |

### anchors（最重要）

```qml
Rectangle {
    anchors.fill: parent            // 占满父级
    anchors.centerIn: parent        // 居中
    anchors.left: parent.left       // 贴左
    anchors.leftMargin: 16          // margin
}
```

## 样式对照

| CSS | QML 属性 |
|-----|---------|
| `background-color` | `color`（Rectangle） |
| `border: 1px solid #ccc` | `border.width` / `border.color` |
| `border-radius` | `radius` |
| `opacity: 0.5` | `opacity: 0.5` |
| `display:none` | `visible: false` |
| `font-size: 16px` | `font.pixelSize: 16` |
| `font-weight: bold` | `font.bold: true` |
| `color`（文字颜色） | `color`（Text） |
| `overflow: hidden` | `clip: true` |
| `overflow: scroll` | `Flickable` / `ScrollView` |
| `transform: rotate(45deg)` | `rotation: 45` |
| `transition: all 0.3s` | `Behavior` + `PropertyAnimation` |
| `cursor: pointer` | `cursorShape: Qt.PointingHandCursor` |

## 事件与交互对照

| HTML/JS | QML |
|---------|-----|
| `onclick` | `onClicked` |
| `onmouseover` | `HoverHandler` |
| `onchange` | `onTextChanged` |
| `setTimeout(fn, 1000)` | `Timer { interval: 1000; onTriggered: fn() }` |
| `document.getElementById("id")` | `id: xxx` + 直接引用 |
| `element.classList.add("active")` | `states: [ State { name: "active" } ]` |
| 键盘事件 | `Keys.onPressed` / `Shortcut` |

## Vue → QML 对照

| Vue | QML |
|-----|-----|
| `{{ title }}` | `text: title` |
| `v-if="cond"` | `visible: cond` |
| `v-for="item in list"` | `Repeater { model: list }` |
| `v-model="input"` | `text: input` + `onTextChanged` |
| `computed` | 属性绑定表达式 |
| `props` | `property var xxx` |
| `emit` | `signal` + `onXxx` |

### 列表 v-for → Repeater

```html
<li v-for="f in files" :key="f.id">{{ f.name }}</li>
```

```qml
Repeater {
    model: fileModel
    delegate: Text { text: model.name }
}
```

## 组件化

每个 `.qml` 文件就是一个组件（对应 Vue SFC）。

| Vue 组件概念 | QML 对应 |
|-------------|---------|
| `.vue` 单文件组件 | `.qml` 文件 |
| `props`（父传子） | `property` 声明 |
| `emit`（子传父） | `signal` 信号 |
| `<slot>`（插槽） | `default property` |

### Vue 组件 → QML 组件

```qml
// MyButton.qml
Rectangle {
    id: root
    property string label: ""
    property color bg: "gray"
    signal clicked

    width: 80; height: 36; radius: 4; color: root.bg
    Text {
        anchors.centerIn: parent
        text: root.label
    }
    MouseArea {
        anchors.fill: parent
        onClicked: root.clicked()
    }
}

// 使用
MyButton {
    label: "确定"
    bg: "#4CAF50"
    onClicked: doSomething()
}
```

## 主题系统

### CSS 变量 → QML 单例

```qml
// Theme.qml (pragma Singleton)
pragma Singleton
QtObject {
    readonly property color primary: "#4CAF50"
    readonly property color background: "#1e1e1e"
    readonly property color text: "#ffffff"
}
```

```qml
// 使用
Rectangle { color: Theme.background }
Text { color: Theme.text }
```

## 迁移速记

1. **块级容器** 一律 `Rectangle`；**文本** 一律 `Text`
2. **定位** 优先 `anchors`（别用绝对坐标 x/y，除非必要）
3. **布局** 用 `Row` / `Column` / `Grid` / `Flow`，别手写间距
4. **样式** 全部写成 QML 属性，没有 CSS 类名
5. **交互** 用信号 `onClicked` / `onTextChanged`，不用选择器
6. **主题** 用单例对象存颜色，替代 CSS 变量
7. **条件/循环** 用 `visible` / `Repeater`，替代 v-if / v-for