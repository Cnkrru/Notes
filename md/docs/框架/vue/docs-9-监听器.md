## 监听器

### 分类
> `watch`

> `watchEffect`

- 监听器用于监听状态变化执行回调函数

---

### 监听数据类型
1. ref
2. reactive
3. get()
4. 多个数据源

---

### watch配置参数
>`watch`内部分为三部分:数据，函数，配置
1. 深度监听
    >对于对象类型数据，直接监听无法获取内层数据，需要开启深层监听
    >`deep: true`可以开启深度监听
    ```js
    watch(obj, (newVal, oldVal) => {console.log(newVal, oldVal)}, {deep: true})
    ```
2. 立刻执行
    >有时我们希望`watch`内部的函数可以在初始化时立马执行一次
    >`immediate: true`可以开启立即执行
    ```js
    watch(obj, (newVal, oldVal) => {console.log(newVal, oldVal)}, {immediate: true})
    ```
3. 一次性监听
    >有时我们希望`watch`内部的函数只能执行一次
    >`once: true`可以开启一次性监听
    ```js
    watch(obj, (newVal, oldVal) => {console.log(newVal, oldVal)}, {once: true})
    ```

---

### watchEffect
>`watchEffect`是简化版的监听器，自动判断参数，默认开启深度监听
>`watchEffect`是`watch`的简化自动版本

---

未完……
