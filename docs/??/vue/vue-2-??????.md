# Vue

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

| 项目 | 说明 |
|------|------|
| 导出方式 | 通过 `export default` 导出组件对象 |
| 组件对象 | 包含 `name`、`data`、`methods` 等属性 |
| 存放位置 | 通常放在 `components` 目录中 |

### 2. 根组件导入

| 项目 | 说明 |
|------|------|
| 导入方式 | 通过 `import 组件名 from '组件路径'` 导入子组件 |
| 注册方式 | 在 `components` 选项中注册导入的组件 |
| 使用方式 | 注册后可以在模板中使用组件标签 |

### 3. 组件使用

| 项目 | 说明 |
|------|------|
| 模板引用 | 在模板中使用 `<组件名>` 标签引用子组件 |
| 样式隔离 | 通过 `scoped` 属性隔离，只作用于当前组件 |

---

## 执行流程

| 步骤 | 操作 |
|------|------|
| 1 | 定义子组件 Person.vue，包含模板、脚本和样式 |
| 2 | 子组件通过 `export default` 导出 |
| 3 | 根组件 App.vue 通过 `import` 导入 Person 组件 |
| 4 | 根组件在 `components` 选项中注册 Person 组件 |
| 5 | 根组件在模板中使用 `<Person />` 标签 |
| 6 | 应用挂载时，Vue 会渲染根组件及其子组件 |
