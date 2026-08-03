## 响应式数据

### 类型
>绑定响应式数据两种：

>- ref()

>- reactive()

---
### 区别
1. 数据类型
   - ref支持基础类型和对象类型
   - reactive只支持对象类型
   >- 基础类型：数字、字符串、布尔值、null、undefined
   >- 对象类型：对象、数组等
2. 深度查询
   - ref需要手动deep开启深度查询
   - reactive自动深度查询且无法关闭
3. 写法差异
   - ref在js/ts部分需要些`变量.value`来操作数据
   - reactive直接`变量`操作数据
4. 适用场景
   - ref适合基础类型，reactive适合对象类型
---
### 数据解构 (toRefs/toRef)
>指的是从规定好的对象类型里拿出基础类型来操作
- toRefs:批量转换
- toRef:单个转换