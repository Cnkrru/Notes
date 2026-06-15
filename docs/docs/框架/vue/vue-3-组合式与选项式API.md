---
title: "Vue 3 组合式与选项式 API"

description: "Vue 3 组合式 API 与选项式 API 的写法及关系。"

date: "2026-04-26"

tags: [Vue, 组合式API, 选项式API]

sidebar: auto

---


#Vue

---
###  Options API
- 数据、方法、计算属性等，是分散在：`data`、`methods`、`computed`中
- 若想新增或者修改一个需求，就需要分别修改：`data`、`methods`、`computed`，不便于维护和复用。
```vue

<script>
export default {
  name:'OptionsAPI',
  data(){
    return {
      a: 100
    }
  },
  methods:{
    changeA(){
      this.a += 10
    }
  }
}
</script>
```

---

### Composition API
- 可以用函数的方式，更加优雅的组织代码，让相关功能的代码更加有序的组织在一起。
```vue
<script setup>
import { ref, computed } from 'vue'

const a = ref(100)
const doubleA = computed(() => a.value * 2)
</script>
```
--- 

### 两者差异
- `Vue2` 的配置（`data`、`methos`......）中**可以访问到** `setup`中的属性、方法。
- 但在`setup`中**不能访问到**`Vue2`的配置（`data`、`methos`......）。
- 如果与`Vue2`冲突，则`setup`优先。

---
