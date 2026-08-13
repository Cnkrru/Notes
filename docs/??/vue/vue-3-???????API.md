# Vue

---
### Options API

| 项目 | 说明 |
|------|------|
| 特点 | 数据、方法、计算属性等分散在 `data`、`methods`、`computed` 中 |
| 缺点 | 新增或修改需求需分别修改多处，不便于维护和复用 |
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

| 项目 | 说明 |
|------|------|
| 特点 | 可以用函数的方式更加优雅地组织代码，让相关功能的代码更加有序地组织在一起 |
```vue
<script setup>
import { ref, computed } from 'vue'

const a = ref(100)
const doubleA = computed(() => a.value * 2)
</script>
```
--- 

### 两者差异

| 差异点 | 说明 |
|--------|------|
| Vue2 访问 setup | Vue2 的配置（`data`、`methods`...）中**可以访问到** `setup` 中的属性、方法 |
| setup 访问 Vue2 | 在 `setup` 中**不能访问到** Vue2 的配置（`data`、`methods`...） |
| 冲突处理 | 如果与 Vue2 冲突，则 `setup` 优先 |

---
