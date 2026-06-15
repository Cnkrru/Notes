---
title: "Vue 3 TypeScript 支持"

description: "Vue 3 TypeScript 支持相关知识，包括接口、泛型和自定义类型。"

date: "2026-04-26"

tags: [Vue, TypeScript, 接口, 泛型, 自定义类型]

sidebar: auto

---


#Vue

---
## 接口

### 接口定义

接口是 TypeScript 中用于定义对象类型的重要方式，在 Vue 3 中可以用于定义组件的 props、data 等类型。

```typescript
// 定义接口
interface User {
  id: number;
  name: string;
  age: number;
  email?: string; // 可选属性
}

// 使用接口
const user: User = {
  id: 1,
  name: '张三',
  age: 18
};
```

### 在 Vue 组件中使用接口

```vue
<template>
  <div class="user">
    <h2>{{ user.name }}</h2>
    <p>年龄：{{ user.age }}</p>
    <p v-if="user.email">邮箱：{{ user.email }}</p>
  </div>
</template>

<script lang="ts" setup name="UserComponent">
import { ref } from 'vue';

// 定义接口
interface User {
  id: number;
  name: string;
  age: number;
  email?: string;
}

// 使用接口定义数据
const user = ref<User>({
  id: 1,
  name: '张三',
  age: 18
});
</script>
```

---

## 泛型

### 泛型函数

泛型允许我们在定义函数、接口或类时使用类型参数，增加代码的灵活性和复用性。

```typescript
// 泛型函数
function identity<T>(value: T): T {
  return value;
}

// 使用泛型函数
const num = identity<number>(10);
const str = identity<string>('Hello');
```

### 泛型接口

```typescript
// 泛型接口
interface Container<T> {
  value: T;
  getValue(): T;
}

// 实现泛型接口
class NumberContainer implements Container<number> {
  constructor(public value: number) {}
  getValue(): number {
    return this.value;
  }
}

const container = new NumberContainer(42);
console.log(container.getValue()); // 42
```

### 在 Vue 中使用泛型

```vue
<template>
  <div class="list">
    <ul>
      <li v-for="item in list" :key="item.id">{{ item.name }}</li>
    </ul>
  </div>
</template>

<script lang="ts" setup name="ListComponent">
import { ref } from 'vue';

// 泛型接口
interface Item<T> {
  id: T;
  name: string;
}

// 使用泛型定义数据
const list = ref<Item<number>[]>([
  { id: 1, name: '项目1' },
  { id: 2, name: '项目2' },
  { id: 3, name: '项目3' }
]);
</script>
```

---

## 自定义类型

### 类型别名

类型别名允许我们为现有类型创建新名称，使代码更具可读性。

```typescript
// 类型别名
type Age = number;
type Name = string;
type UserInfo = {
  name: Name;
  age: Age;
};

// 使用类型别名
const user: UserInfo = {
  name: '李四',
  age: 20
};
```

### 联合类型

联合类型允许一个值可以是多种类型中的一种。

```typescript
// 联合类型
type Status = 'active' | 'inactive' | 'pending';

type Result = string | number | boolean;

// 使用联合类型
const status: Status = 'active';
const result: Result = 'Success';
```

### 交叉类型

交叉类型将多个类型合并为一个类型，包含所有类型的属性。

```typescript
// 交叉类型
interface Person {
  name: string;
  age: number;
}

interface Employee {
  id: number;
  position: string;
}

type Staff = Person & Employee;

// 使用交叉类型
const staff: Staff = {
  name: '王五',
  age: 25,
  id: 1001,
  position: '工程师'
};
```

### 在 Vue 中使用自定义类型

```vue
<template>
  <div class="staff">
    <h2>{{ staff.name }}</h2>
    <p>年龄：{{ staff.age }}</p>
    <p>工号：{{ staff.id }}</p>
    <p>职位：{{ staff.position }}</p>
  </div>
</template>

<script lang="ts" setup name="StaffComponent">
import { ref } from 'vue';

// 定义接口
interface Person {
  name: string;
  age: number;
}

interface Employee {
  id: number;
  position: string;
}

// 交叉类型
type Staff = Person & Employee;

// 使用自定义类型
const staff = ref<Staff>({
  name: '王五',
  age: 25,
  id: 1001,
  position: '工程师'
});
</script>
```