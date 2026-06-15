## 列表渲染

### 个人理解
>列表渲染`v-for`是vue设计专门用于列表渲染的指令，把原本的js逻辑简化
- `v-for`和后端的for循环一样，都是遍历数组，根据数组的每个元素渲染对应的HTML
- `v-for`的语法是`v-for="item in array"`，`item`是数组的每个元素，`array`是数组

### 内置方法
>vue给对象类型专门配置一套类似数组操作的方法:
- push()
- pop()
- shift()
- unshift()
- splice()
- sort()
- reverse()
