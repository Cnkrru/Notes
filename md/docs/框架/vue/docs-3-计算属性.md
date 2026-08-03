## 计算属性

>示例代码来自官网

### 个人理解
>计算属性相当于一个可以写内置逻辑的响应式数据
>- Input为`<script setup>`内部的响应式变量
>- Output为计算属性的结果，该结果为响应式数据
---
### 与函数的区别
1. 计算属性是响应式的数据，而函数是普通函数
2. 计算属性的计算结果会缓存起来，而函数每次调用都会重新计算
    - 计算结果只看input的数据，如果input不变，返回上次的缓存值
---
### 计算属性的读写
>计算属性默认是只读的
>- 通过`get`方法获取计算属性的结果
>- 通过`set`方法设置计算属性的结果
```vue
<script setup>
import { ref, computed } from 'vue'

const firstName = ref('John')
const lastName = ref('Doe')

const fullName = computed({
  // getter
  get() {
    return firstName.value + ' ' + lastName.value
  },
  // setter
  set(newValue) {
    [firstName.value, lastName.value] = newValue.split(' ')
  }
})
</script>
```
---
### get到上次的值
>3.4+之后，可以给`computed`传参`previous`来获取上次的值
```vue
<script setup>
import { ref, computed } from 'vue'

const count = ref(2)

const alwaysSmall = computed((previous) => {
  if (count.value <= 3) {
    return count.value
  }

  return previous
})
</script>
```
---