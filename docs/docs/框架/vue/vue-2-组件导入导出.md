---
title: "Vue 3 组件导入导出"

description: "Vue 3 子组件和根组件的导入导出关系。"

date: "2026-04-26"

tags: [Vue, 组件, 导入导出]

sidebar: auto

---


#Vue

---
## 子组件定义

### Person.vue（子组件）

```vue
<script lang="ts">
export default {
  name: 'Person',
  data() {
    return {
      name: '张三',
      age: 18,
      tel: '13888888888'
    }
  },
  methods: {
    showTel() {
      alert(this.tel)
    }
  }
}
</script>
```

---

## 根组件导入子组件

### App.vue（根组件）

```vue
<script lang="ts">
import Person from './components/Person.vue'

export default {
  name: 'App',
  components: {
    Person
  }
}
</script>
```

---

## 导入导出关系

### 1. 子组件导出

- 子组件通过 `export default` 导出组件对象
- 组件对象包含 `name`、`data`、`methods` 等属性
- 子组件文件通常放在 `components` 目录中

### 2. 根组件导入

- 根组件通过 `import 组件名 from '组件路径'` 导入子组件
- 在 `components` 选项中注册导入的组件
- 注册后可以在模板中使用组件标签

### 3. 组件使用

- 在模板中使用 `<组件名>` 标签引用子组件
- 子组件的样式通过 `scoped` 属性隔离，只作用于当前组件

---

## 执行流程

1. 定义子组件 Person.vue，包含模板、脚本和样式
2. 子组件通过 `export default` 导出
3. 根组件 App.vue 通过 `import` 导入 Person 组件
4. 根组件在 `components` 选项中注册 Person 组件
5. 根组件在模板中使用 `<Person />` 标签
6. 应用挂载时，Vue 会渲染根组件及其子组件
