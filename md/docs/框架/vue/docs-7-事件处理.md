## 事件处理

### on
>`v-on`用于替代JavaScript原本烦杂的事件绑定方式

---

### 两种写法
- 直接在HTML标签上写逻辑(内联)
    ```html
    // 常规写法
    <button @click="say('hello')">Say hello</button>
    // 箭头函数
    <button @click="(event) => warn('Form cannot be submitted yet.', event)">
    Submit
    </button>
    ```
- 在`<script setup>`中定义事件处理函数
    ```js
    import { ref } from 'vue'

    const count = ref(0)

    function say(msg) {
        console.log(msg)
    }
    ```
    
--- 

### 事件修饰符
>事件修饰符可以便捷限制事件
- .stop
- .prevent
- .self
- .capture
- .once
- .passive
```html
<!-- 单击事件将停止传递 -->
<a @click.stop="doThis"></a>

<!-- 提交事件将不再重新加载页面 -->
<form @submit.prevent="onSubmit"></form>

<!-- 修饰语可以使用链式书写 -->
<a @click.stop.prevent="doThat"></a>

<!-- 仅当 event.target 是元素本身时才会触发事件处理器 -->
<div @click.self="doThat">...</div>

<!-- 添加事件监听器时，使用 `capture` 捕获模式 -->
<div @click.capture="doThis">...</div>

<!-- 点击事件最多被触发一次 -->
<a @click.once="doThis"></a>

<!-- 滚动事件的默认行为 (scrolling) 将立即发生而非等待 `onScroll` 完成 -->
<div @scroll.passive="onScroll">...</div>
```

---

### 按键修饰符
> 用于便捷绑定键盘按键事件
- .enter
- .tab
- .delete (捕获“Delete”和“Backspace”两个按键)
- .esc
- .space
- .up
- .down
- .left
- .right
- .ctrl
- .alt
- .shift
- .meta

---

### 鼠标按键修饰符
> 用于便捷绑定鼠标按键事件
- .left
- .right
- .middle
