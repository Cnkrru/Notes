对于有 Web 前端背景的开发者，理解 QML 的关键在于找到 HTML / CSS / JS 在 QML 世界中的"对位"。本文从六个维度做系统对比，帮助快速建立心智模型。

## 一、核心哲学差异

| 维度 | HTML+CSS+JS | QML |
|------|-------------|-----|
| 语言本质 | 三种语言各司其职 | 一种语言（QML）+ 内嵌 JS |
| 样式系统 | CSS 选择器 + 级联 | 属性直接写在对象上 |
| 布局方式 | 流式布局（默认） | 锚点/定位器/布局组件 |
| 事件模型 | DOM 事件冒泡/捕获 | 信号槽机制 |
| 组件化 | Web Components / 框架组件 | 每个 .qml 文件自动成为组件 |
| 渲染引擎 | 浏览器渲染管线 | Qt Quick Scene Graph |
| 数据绑定 | 框架层实现（Vue/React） | 语言内置属性绑定 |
| 样式隔离 | 需要 CSS Modules / Scoped | 天然隔离（属性直接绑定） |

## 二、HTML 元素 ↔ QML 类型对照

### 2.1 基础元素

| HTML 元素 | QML 类型 | 说明 |
|-----------|---------|------|
| `<div>` | `Rectangle` | 基础块容器，`color` 设置背景色 |
| `<span>` / 纯文本 | `Text` | 文本显示，`text` 属性 |
| `<img>` | `Image` | 图片显示，`source` 属性 |
| `<button>` | `Button` | 按钮（QtQuick.Controls） |
| `<input type="text">` | `TextField` | 单行文本输入 |
| `<textarea>` | `TextArea` | 多行文本输入 |
| `<select>` / `<option>` | `ComboBox` | 下拉选择框 |
| `<input type="checkbox">` | `CheckBox` | 复选框 |
| `<input type="radio">` | `RadioButton` | 单选按钮 |
| `<input type="range">` | `Slider` | 滑块 |
| `<input type="number">` | `SpinBox` | 数字微调 |
| `<input type="password">` | `TextField { echoMode: TextInput.Password }` | 密码输入 |
| `<progress>` | `ProgressBar` | 进度条 |
| `<video>` | `MediaPlayer` + `VideoOutput` | 视频播放 |
| `<audio>` | `MediaPlayer` + `AudioOutput` | 音频播放 |
| `<canvas>` | `Canvas` | 2D 绘图 |
| `<ul>` / `<ol>` | `ListView` | 列表视图 |
| `<table>` | `GridView` / `TableView` | 表格/网格视图 |
| `<dialog>` | `Dialog` | 对话框 |
| `<details>` / `<summary>` | `GroupBox` | 可折叠分组 |
| `<iframe>` | `WebEngineView` | 嵌入 Web 页面 |
| `<hr>` | `Rectangle { height: 1; color: "gray" }` | 分割线 |

### 2.2 容器与布局元素

| HTML 元素 | QML 类型 | 说明 |
|-----------|---------|------|
| `<header>` | `ApplicationWindow.header` | 页面顶部栏 |
| `<footer>` | `ApplicationWindow.footer` | 页面底部栏 |
| `<nav>` | `TabBar` / `SwipeView` | 导航 |
| `<aside>` | `Drawer` | 侧边栏 |
| `<main>` | `Page` | 主内容区 |
| `<section>` | `Pane` / `Frame` | 内容区块 |
| `<fieldset>` | `GroupBox` | 表单分组 |

### 2.3 对照示例

**HTML:**
```html
<div class="card" style="width: 300px; height: 200px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
  <img src="avatar.png" style="width: 48px; height: 48px; border-radius: 50%;">
  <h2 style="font-size: 18px; margin: 8px 0;">John Doe</h2>
  <p style="color: #666;">Software Engineer</p>
  <button style="background: #0078d4; color: white; border: none; padding: 8px 16px; border-radius: 4px;">Follow</button>
</div>
```

**QML:**
```qml
Rectangle {
    width: 300; height: 200
    color: "white"
    radius: 8
    layer.enabled: true
    layer.effect: DropShadow { radius: 8; samples: 16; color: "#10000000" }

    Column {
        anchors.centerIn: parent
        spacing: 8
        Image {
            source: "avatar.png"
            width: 48; height: 48
            sourceSize: Qt.size(48, 48)
        }
        Text { text: "John Doe"; font.pixelSize: 18; font.bold: true }
        Text { text: "Software Engineer"; color: "#666" }
        Button {
            text: "Follow"
            background: Rectangle {
                color: "#0078d4"; radius: 4
            }
            contentItem: Text { text: parent.text; color: "white" }
        }
    }
}
```

## 三、CSS 样式 ↔ QML 属性对照

### 3.1 盒模型与视觉

| CSS 属性 | QML 属性 | 适用类型 |
|----------|---------|---------|
| `width` / `height` | `width` / `height` | 所有可视元素 |
| `min-width` / `min-height` | `minWidth` / `minHeight` | Item |
| `max-width` / `max-height` | `maxWidth` / `maxHeight` | Item |
| `background-color` | `color` | Rectangle |
| `background-image` | `source` | Image / BorderImage |
| `border: 1px solid #ccc` | `border.width: 1; border.color: "#ccc"` | Rectangle |
| `border-radius` | `radius` | Rectangle |
| `box-shadow` | `DropShadow` 效果 | layer.effect |
| `opacity` | `opacity` | 所有 Item |
| `display: none` | `visible: false` | 所有 Item |
| `overflow: hidden` | `clip: true` | Item |
| `overflow: auto` / `scroll` | `Flickable` / `ScrollView` | 容器 |
| `cursor: pointer` | `cursorShape: Qt.PointingHandCursor` | 鼠标交互区域 |
| `z-index` | `z` | Item |
| `transform: translate(x, y)` | `x` / `y` 或 `transform: Translate { x: N; y: N }` | Item |
| `transform: rotate(45deg)` | `rotation: 45` | Item |
| `transform: scale(1.5)` | `scale: 1.5` | Item |
| `transform-origin` | `transformOrigin: Item.TopLeft` | Item |

### 3.2 字体与文本

| CSS 属性 | QML 属性 | 适用类型 |
|----------|---------|---------|
| `font-size: 16px` | `font.pixelSize: 16` | Text |
| `font-weight: bold` | `font.bold: true` | Text |
| `font-weight: 600` | `font.weight: Font.DemiBold` | Text |
| `font-family: "Arial"` | `font.family: "Arial"` | Text |
| `font-style: italic` | `font.italic: true` | Text |
| `text-align: center` | `horizontalAlignment: Text.AlignHCenter` | Text |
| `vertical-align: middle` | `verticalAlignment: Text.AlignVCenter` | Text |
| `color: red`（文字颜色） | `color: "red"` | Text |
| `line-height: 1.5` | `lineHeight: 1.5` | Text |
| `text-decoration: underline` | `font.underline: true` | Text |
| `text-overflow: ellipsis` | `elide: Text.ElideRight` | Text |
| `white-space: nowrap` | `wrapMode: Text.NoWrap` | Text |
| `word-break: break-all` | `wrapMode: Text.WordWrap` | Text |
| `text-shadow` | `layer.effect: DropShadow` | Text + layer |

### 3.3 布局与间距

| CSS 属性 | QML 属性 | 说明 |
|----------|---------|------|
| `margin: 10px` | `anchors.margins: 10` | 锚点边距 |
| `margin-top: 10px` | `anchors.topMargin: 10` | 上边距 |
| `padding: 10px` | `anchors.margins: 10`（容器内子元素） | 内边距 |
| `gap: 10px` | `spacing: 10` | Row / Column / Grid |
| `display: flex` | `Row` / `Column` | 弹性布局 |
| `flex-direction: row` | `Row { }` | 水平排列 |
| `flex-direction: column` | `Column { }` | 垂直排列 |
| `flex-wrap: wrap` | `Flow { }` | 自动换行 |
| `justify-content: center` | `anchors.horizontalCenter: parent.horizontalCenter` | 水平居中 |
| `align-items: center` | `anchors.verticalCenter: parent.verticalCenter` | 垂直居中 |
| `flex: 1` | `Layout.fillWidth: true; Layout.fillHeight: true` | 填充剩余空间 |
| `display: grid` | `Grid { columns: 3 }` 或 `GridLayout` | 网格布局 |
| `position: absolute` | `x: N; y: N` | 绝对定位 |
| `position: relative` | 默认（QML 元素默认相对定位） | 相对定位 |
| `position: fixed` | 无直接对应，通过 `anchors` + 窗口坐标模拟 | 固定定位 |

### 3.4 过渡与动画

| CSS 属性 | QML 对应 |
|----------|---------|
| `transition: all 0.3s ease` | `Behavior { NumberAnimation { duration: 300; easing.type: Easing.InOutQuad } }` |
| `@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }` | `OpacityAnimator { from: 0; to: 1; duration: 300 }` |
| `animation: spin 2s linear infinite` | `RotationAnimation { duration: 2000; loops: Animation.Infinite }` |
| `transform: translateX(100px)` | `Translate { x: 100 }` + `NumberAnimation` |
| `transition-delay` | `PauseAnimation { duration: 200 }` |

### 3.5 样式对照示例

**CSS:**
```css
.card {
  width: 200px; height: 100px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
  transition: transform 0.3s ease;
}
.card:hover { transform: scale(1.05); }
.card h2 { font-size: 18px; color: white; text-align: center; line-height: 100px; }
```

**QML:**
```qml
Rectangle {
    id: card
    width: 200; height: 100
    radius: 12
    gradient: Gradient {
        GradientStop { position: 0.0; color: "#667eea" }
        GradientStop { position: 1.0; color: "#764ba2" }
    }
    layer.enabled: true
    layer.effect: DropShadow {
        radius: 12; samples: 24; color: "#33000000"; verticalOffset: 4
    }

    Text {
        text: "Hello QML"
        anchors.centerIn: parent
        font.pixelSize: 18; color: "white"
        horizontalAlignment: Text.AlignHCenter
    }

    // hover 缩放效果
    HoverHandler {
        onHoveredChanged: {
            if (hovered) card.scale = 1.05
            else card.scale = 1.0
        }
    }
    Behavior on scale {
        NumberAnimation { duration: 300; easing.type: Easing.InOutQuad }
    }
}
```

## 四、JavaScript 逻辑 ↔ QML 信号槽对照

### 4.1 事件处理

| JS 事件 | QML 信号处理器 |
|---------|---------------|
| `element.onclick = fn` | `onClicked: fn` |
| `element.addEventListener('click', fn)` | `onClicked: fn` |
| `element.onmouseover` | `HoverHandler { onHoveredChanged: }` |
| `element.onchange` | `onTextChanged` / `onCheckedChanged` / `onCurrentIndexChanged` |
| `element.oninput` | `onTextEdited`（仅手动输入时触发） |
| `element.onfocus` | `onActiveFocusChanged` |
| `element.onblur` | `onActiveFocusChanged: if (!activeFocus) ...` |
| `element.onscroll` | `Flickable.onContentYChanged` |
| `window.onkeydown` | `Keys.onPressed` / `Shortcut { sequence: "..." }` |
| `window.onresize` | `onWidthChanged` / `onHeightChanged` |
| `window.setTimeout(fn, 1000)` | `Timer { interval: 1000; onTriggered: fn }` |
| `window.setInterval(fn, 1000)` | `Timer { interval: 1000; repeat: true; onTriggered: fn }` |
| `new Promise(resolve => ...)` | 无原生对应，用 `Qt.callLater()` 或信号 + 状态机 |

### 4.2 DOM 操作 ↔ QML 对象操作

| DOM API | QML 对应 |
|---------|---------|
| `document.getElementById('id')` | `id: xxx` 直接引用 |
| `document.querySelector('.cls')` | 无直接对应（QML 无 CSS 选择器） |
| `element.classList.add('active')` | `states: [ State { name: "active" } ]` |
| `element.classList.remove('active')` | `state: ""` |
| `element.style.property = 'value'` | `element.property = value` |
| `element.innerHTML = '...'` | `Text { text: "..." }` |
| `element.setAttribute('data-x', val)` | `property var dataX: val` |
| `element.appendChild(child)` | `children: [ child ]` 或动态创建 |
| `element.removeChild(child)` | `child.destroy()` |
| `element.cloneNode()` | `Qt.createQmlObject()` |
| `createElement('div')` | `Qt.createQmlObject('import QtQuick; Rectangle {}', parent)` |
| `element.addEventListener('event', fn)` | `signal.connect(fn)` |
| `element.removeEventListener('event', fn)` | `signal.disconnect(fn)` |

### 4.3 数据与逻辑

| JS 概念 | QML 对应 |
|---------|---------|
| 变量声明 `let x = 10` | `property int x: 10` |
| 常量 `const PI = 3.14` | `readonly property double pi: 3.14` |
| 函数 `function add(a, b) { return a + b; }` | `function add(a, b) { return a + b; }` |
| 箭头函数 `(x) => x * 2` | 直接支持 JS 箭头函数 |
| 对象 `{ name: 'Alice', age: 30 }` | `QtObject { property string name: "Alice"; property int age: 30 }` |
| 数组 `[1, 2, 3]` | `[1, 2, 3]`（QML 中直接使用 JS 数组） |
| `JSON.parse()` / `JSON.stringify()` | 直接可用（QML 内嵌 JS 引擎） |
| `console.log()` | `console.log()` 直接可用 |
| `Math.random()` | `Math.random()` 直接可用 |
| `Date.now()` | `Date.now()` 直接可用 |
| 模板字符串 `` `Hello ${name}` `` | `"Hello " + name`（QML 中不支持模板字符串） |
| `import` / `export` | `import "utils.js" as Utils` |

### 4.4 信号与事件发射

**自定义事件（JS）：**
```javascript
// 自定义事件
class MyButton extends EventTarget {
    click() {
        this.dispatchEvent(new CustomEvent('click', { detail: { x: 10, y: 20 } }));
    }
}
const btn = new MyButton();
btn.addEventListener('click', (e) => console.log(e.detail));
```

**自定义信号（QML）：**
```qml
// MyButton.qml
Rectangle {
    id: root
    signal clicked(real xPos, real yPos)

    TapHandler {
        onTapped: root.clicked(root.mouseXY.x, root.mouseXY.y)
    }
}

// 使用
MyButton {
    onClicked: (xPos, yPos) => console.log(xPos, yPos)
}
```

## 五、前端框架概念 ↔ QML 对照

### 5.1 Vue.js 对照

| Vue 概念 | QML 对应 |
|----------|---------|
| `{{ title }}` 模板插值 | `text: title` 属性绑定 |
| `v-bind:class="{ active: isActive }"` | `state: isActive ? "active" : ""` |
| `v-bind:style="{ color: 'red' }"` | 直接属性赋值 `color: "red"` |
| `v-if="cond"` | `visible: cond` |
| `v-show="cond"` | `opacity: cond ? 1.0 : 0.0` |
| `v-for="item in list"` | `Repeater { model: list }` |
| `v-model="input"` | `TextField { text: input; onTextChanged: input = text }` |
| `computed` 计算属性 | 属性绑定表达式 |
| `watch` 侦听器 | `on<Property>Changed` 信号处理器 |
| `props: ['title']` | `property string title` |
| `emit('update', val)` | `signal update(val)` + `onUpdate: ...` |
| `<slot>` 插槽 | `default property alias children` |
| `provide / inject` | `Qt.binding()` 或全局单例 |
| `nextTick(fn)` | `Qt.callLater(fn)` |
| `this.$refs.myRef` | `id: myRef` 直接引用 |
| `this.$router.push('/home')` | `stackView.push("HomePage.qml")` |
| `this.$store.state.count` | 单例 `QtObject` 全局状态 |

### 5.2 React 对照

| React 概念 | QML 对应 |
|-----------|---------|
| JSX `<div>{name}</div>` | `Text { text: name }` |
| `useState` | `property var state` |
| `useEffect` | `Component.onCompleted` + `on<Property>Changed` |
| `useMemo` | 属性绑定（自动缓存依赖） |
| `useCallback` | `function` 声明或 `Qt.binding()` |
| `useContext` | 全局单例 `QtObject` |
| `useRef` | `id` 直接引用 |
| `props.children` | `default property` |
| `key` prop | 无直接对应（QML 使用对象标识） |
| `onClick={handleClick}` | `onClicked: handleClick()` |
| `style={{ color: 'red' }}` | `color: "red"` 直接属性 |

### 5.3 状态管理

**Vuex / Pinia:**
```javascript
// store.js
export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  actions: { increment() { this.count++ } }
})
```

**QML 全局状态单例:**
```qml
// AppState.qml (pragma Singleton)
pragma Singleton
import QtQuick

QtObject {
    readonly property int count: _count
    property int _count: 0

    function increment() {
        _count = _count + 1
    }
}

// 使用
Text { text: "Count: " + AppState.count }
Button { onClicked: AppState.increment() }
```

## 六、组件化开发对照

### 6.1 组件定义

**Vue SFC:**
```vue
<!-- MyCard.vue -->
<template>
  <div class="card" :style="{ background: bg }">
    <h2>{{ title }}</h2>
    <slot />
  </div>
</template>
<script setup>
defineProps({ title: String, bg: { type: String, default: '#fff' } })
</script>
```

**QML 组件:**
```qml
// MyCard.qml
Rectangle {
    id: root
    property string title: ""
    property color bg: "white"
    // 默认属性：子对象自动成为 children
    default property alias content: contentItem.children

    width: 200; height: 150
    color: root.bg
    radius: 8

    Column {
        anchors.fill: parent
        anchors.margins: 12
        Text {
            text: root.title
            font.pixelSize: 16; font.bold: true
        }
        Item { id: contentItem; width: parent.width; height: parent.height - 30 }
    }
}
```

### 6.2 组件使用

**Vue:**
```vue
<MyCard title="Hello" bg="#f0f0f0">
  <p>This is slot content</p>
</MyCard>
```

**QML:**
```qml
MyCard {
    title: "Hello"
    bg: "#f0f0f0"
    Text { text: "This is slot content" }
}
```

### 6.3 组件生命周期

| Vue 生命周期 | QML 对应 |
|-------------|---------|
| `beforeCreate` | N/A（QML 对象创建即初始化） |
| `created` | `Component.onCompleted` |
| `beforeMount` | N/A |
| `mounted` | `Component.onCompleted`（此时已渲染） |
| `beforeUpdate` | `on<Property>Changed` |
| `updated` | `on<Property>Changed` |
| `beforeUnmount` | `Component.onDestruction` |
| `unmounted` | `Component.onDestruction` |

## 七、路由与导航对照

| Vue Router / React Router | QML 对应 |
|--------------------------|---------|
| `<router-link to="/home">` | `TabButton { text: "Home" }` |
| `<router-view>` | `StackView { }` |
| `router.push('/home')` | `stackView.push("HomePage.qml")` |
| `router.replace('/home')` | `stackView.replace("HomePage.qml")` |
| `router.go(-1)` | `stackView.pop()` |
| `router.beforeEach` | `StackView.onCurrentItemChanged` |
| 路由参数 `/user/:id` | `stackView.push("UserPage.qml", { userId: id })` |
| 嵌套路由 | `StackView` 嵌套 |
| 懒加载 | 默认按需加载（QML 引擎延迟加载） |

## 八、数据流与网络对照

| Web 前端 | QML 对应 |
|---------|---------|
| `fetch('/api/data')` | `XMLHttpRequest` 或 C++ `QNetworkAccessManager` |
| `axios.get('/api/data')` | `XMLHttpRequest`（QML JS 环境） |
| `WebSocket` | `WebSocket { url: "ws://..." }` |
| `localStorage` | `Settings { }` 或 C++ `QSettings` |
| `sessionStorage` | `property var sessionData` |
| `IndexedDB` | C++ `QSqlDatabase` / SQLite 直调 |
| `new URL('/path', base)` | `Qt.resolvedUrl('relative/path')` |
| `FormData` | 无直接对应，需手动构造 multipart |
| 图片懒加载 | `Image { asynchronous: true; cache: true }` |

## 九、开发工具与调试对照

| Web 工具 | QML 工具 |
|---------|---------|
| Chrome DevTools | `Qt Quick Debugger` / `qmlscene` |
| CSS 选择器调试 | `qmltooling` 属性检查器 |
| React DevTools | `qmldump` 对象树查看 |
| `console.log()` | `console.log()` 直接可用 |
| 断点调试 | `debugger;` 语句 + Qt Creator 调试器 |
| Source Maps | 无直接对应（QML 源码直接映射） |
| Hot Module Replacement | `qmlscene` 实时预览（非完全热重载） |
| `npm install` | `vcpkg install` / CMake 子模块 |
| Webpack / Vite | `CMake` + `qt_add_qml_module` |

## 十、迁移速查表

### 10.1 最常用的 20 个对照

| # | Web 前端 | QML |
|---|---------|-----|
| 1 | `<div>` | `Rectangle {}` |
| 2 | `<span>` / 文本 | `Text {}` |
| 3 | `<button>` | `Button {}` |
| 4 | CSS `display: flex` | `Row {}` / `Column {}` |
| 5 | CSS `background-color` | `color` 属性 |
| 6 | CSS `border-radius` | `radius` 属性 |
| 7 | CSS `box-shadow` | `DropShadow` 效果 |
| 8 | `onclick` | `onClicked` 信号 |
| 9 | `v-if` / `ngIf` | `visible` 属性 |
| 10 | `v-for` / `ngFor` | `Repeater { model: ... }` |
| 11 | `v-model` | `text` + `onTextChanged` |
| 12 | `setTimeout` | `Timer { interval: N; onTriggered: fn }` |
| 13 | CSS `transition` | `Behavior + NumberAnimation` |
| 14 | CSS `@keyframes` | `PropertyAnimation` / `Animator` |
| 15 | 组件 `props` | `property` 声明 |
| 16 | 组件 `emit` | `signal` 声明 |
| 17 | `fetch('/api')` | `XMLHttpRequest` 或 C++ 网络层 |
| 18 | `localStorage` | `Settings {}` / `QSettings` |
| 19 | `router.push()` | `StackView.push()` |
| 20 | `:hover` | `HoverHandler` |

### 10.2 QML 特有的关键概念

以下概念在 Web 前端中没有直接对应，需要特别留意：

1. **属性绑定（Property Binding）** — QML 最强大的特性。`width: parent.width / 2` 不是一次赋值，而是持续的关系声明。当父级宽度变化时，子级自动更新。这是 QML 比 Vue/React 更"原生"的响应式。

2. **锚点布局（Anchors）** — QML 独有的布局系统，比 CSS Flexbox 更直观。`anchors.centerIn: parent` 等价于 CSS `display: flex; justify-content: center; align-items: center`。

3. **信号槽（Signal/Slot）** — QML 的事件机制，比 DOM 事件更类型安全。每个属性变化自动发出 `on<Property>Changed` 信号。

4. **状态机（State + Transition）** — QML 内置状态机，比 CSS class 切换更强大。`states: [ State { name: "active"; PropertyChanges { target: rect; color: "blue" } } ]`。

5. **Scene Graph** — QML 的渲染引擎，基于 GPU 加速，与浏览器的 DOM 树完全不同。渲染性能远优于同等复杂度的 Web 页面。

6. **QML 引擎 vs 浏览器** — QML 没有 DOM API、没有 `window` 对象、没有 `document` 对象。所有操作都通过 QML 对象属性完成。

### 10.3 "在 QML 中不要这样做"

| Web 习惯 | 问题 | QML 建议 |
|---------|------|---------|
| 用 JS 操作 DOM 属性 | 破坏声明式绑定 | 用属性绑定或 `State` |
| 用 CSS 类名切换样式 | QML 无 CSS 类名 | 用 `state` + `PropertyChanges` |
| 用 `document.getElementById` | 无 DOM API | 用 `id` 直接引用 |
| 用 `innerHTML` 动态内容 | 无 DOM API | 用 `Text.text` + `Loader` |
| 用 `addEventListener` | 不优雅 | 用信号处理器 `onClicked` |
| 用 `setInterval` 驱动动画 | 性能差 | 用 `PropertyAnimation` / `Animator` |

## 总结

QML 与 HTML+CSS+JS 的核心差异在于 **QML 将所有 UI 表达统一到一种声明式语言中**，没有 CSS 选择器、没有 DOM API、没有浏览器兼容性问题。对于 Web 开发者，最需要适应的三点：

1. **用属性替代 CSS** — 所有样式直接写在 QML 对象属性上
2. **用信号替代事件监听** — 使用 `onXxx` 处理器，而不是 `addEventListener`
3. **用 State + Transition 替代 class 切换** — 内置状态机比 CSS class 更强大