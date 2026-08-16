## 状态 (States)

`State` 定义某个状态下属性的变化集合，通过 `PropertyChanges` 指定目标属性的新值：

```qml
Item {
    id: container
    width: 320; height: 120

    Rectangle {
        id: rect
        color: "red"
        width: 120; height: 120

        TapHandler {
            onTapped: container.state === 'other'
                ? container.state = ''
                : container.state = 'other'
        }
    }

    states: [
        State {
            name: "other"
            PropertyChanges {
                target: rect
                x: 200
                color: "green"
            }
        }
    ]

    transitions: [
        Transition {
            NumberAnimation { properties: "x,color"; duration: 500 }
        }
    ]
}
```

## 过渡 (Transitions)

`Transition` 定义状态切换时的动画方式：

```qml
transitions: [
    Transition {
        from: ""; to: "other"           // 限定从哪个状态到哪个状态
        reversible: true                 // 反向也应用动画

        NumberAnimation {
            properties: "x,y"
            duration: 600
            easing.type: Easing.OutBounce
        }
        ColorAnimation { duration: 300 }
    }
]
```

## 动画类型

| 动画类型 | 说明 |
|----------|------|
| `NumberAnimation` | 数值属性动画 |
| `ColorAnimation` | 颜色属性动画 |
| `RotationAnimation` | 旋转动画 |
| `PropertyAnimation` | 通用属性动画 |
| `PauseAnimation` | 暂停 |
| `SequentialAnimation` | 顺序动画组 |
| `ParallelAnimation` | 并行动画组 |
| `AnchorAnimation` | 锚定变化动画 |
| `ParentAnimation` | 父对象变化动画 |
| `SmoothedAnimation` | 平滑过渡动画 |
| `SpringAnimation` | 弹性动画 |

## Behavior（默认属性动画）

`Behavior` 指定属性变化时的默认动画，无需状态切换：

```qml
Rectangle {
    color: "green"
    width: 120; height: 120

    Behavior on x {
        NumberAnimation {
            duration: 600
            easing.type: Easing.OutBounce
        }
    }

    Behavior on opacity {
        NumberAnimation { duration: 300 }
    }

    TapHandler {
        onTapped: parent.x == 0 ? parent.x = 200 : parent.x = 0
    }
}
```

## 独立动画

不绑定状态或属性，直接指定目标：

```qml
SequentialAnimation {
    id: anim
    NumberAnimation { target: rectangle; property: "x"; from: 0; to: 200; duration: 500 }
    NumberAnimation { target: rectangle; property: "x"; from: 200; to: 0; duration: 500 }
}

// 触发
TapHandler {
    onTapped: anim.running = true
}
```

### 无限循环动画

```qml
SequentialAnimation on x {
    running: false
    loops: Animation.Infinite
    NumberAnimation { from: 0; to: 200; duration: 500; easing.type: Easing.InOutQuad }
    NumberAnimation { from: 200; to: 0; duration: 500; easing.type: Easing.InOutQuad }
    PauseAnimation { duration: 250 }
}
```

## Animator（高性能动画）

直接操作场景图原语，可在渲染线程运行，UI 阻塞时仍可继续：

| Animator | 说明 |
|----------|------|
| `XAnimator` / `YAnimator` | 水平/垂直位移动画 |
| `ScaleAnimator` | 缩放动画 |
| `RotationAnimator` | 旋转动画 |
| `OpacityAnimator` | 透明度动画 |

```qml
Rectangle {
    id: rect
    ScaleAnimator on scale {
        from: 0.5; to: 2
        duration: 1000
        running: true
    }
}
```

## 缓动曲线

常用缓动类型：

| 类型 | 效果 |
|------|------|
| `Easing.Linear` | 线性 |
| `Easing.InQuad` / `Easing.OutQuad` / `Easing.InOutQuad` | 二次缓入/缓出 |
| `Easing.InCubic` / `Easing.OutCubic` | 三次缓入/缓出 |
| `Easing.OutBounce` | 反弹 |
| `Easing.OutElastic` | 弹性 |
| `Easing.InOutBack` | 回弹 |

## AnchorChanges（锚定状态切换）

```qml
State {
    name: "anchorRight"
    AnchorChanges {
        target: rect2
        anchors.right: parent.right
        anchors.left: undefined
    }
}

Transition {
    AnchorAnimation {}  // 自动动画化锚定变化
}
```

## 动画选择建议

- **简单属性平滑过渡**：使用 `Behavior`
- **多状态切换**：使用 `State` + `Transition`
- **一次性动画**：使用独立动画对象
- **高性能场景**：使用 `Animator`（渲染线程执行）
- **复杂序列**：使用 `SequentialAnimation` + `ParallelAnimation` 组合