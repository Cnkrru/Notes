# 前端

---

## 变量和常量

### 1. 变量

| 声明方式 | 说明 |
| :- | :- |
| let（块级） | 块级作用域变量声明 |
| const（不可改） | 常量声明，不可修改引用 |
| var（函数级） | 函数级作用域变量声明 |

```javascript
let name = '张三';
```

| 操作 | 示例 |
| :- | :- |
| **解构** | `let [a, b] = [1, 2];` |

---

### 2. 常量

| 属性 | 说明 |
| :- | :- |
| **声明** | 使用 const |
| **特点** | 不可修改引用，对象/数组内部可改 |

```javascript
const PI = 3.14;

const obj = {name: '张三'};
obj.age = 18; // 可以
```

---

## 数据类型（Python中没有的）

### 1. undefined

| 属性 | 说明 |
| :- | :- |
| **说明** | 表示未定义的值，变量声明但未赋值时的默认值 |
| **类型检测** | `typeof undefined; // 'undefined'` |

```javascript
let x;
console.log(x); // undefined
```

### 2. Symbol

| 属性 | 说明 |
| :- | :- |
| **说明** | ES6新增，表示唯一的、不可变的值，用于对象属性的键 |
| **类型检测** | `typeof Symbol(); // 'symbol'` |

```javascript
const sym1 = Symbol('description');
const sym2 = Symbol('description');
console.log(sym1 === sym2); // false
```

### 3. BigInt

| 属性 | 说明 |
| :- | :- |
| **说明** | ES6新增，表示任意精度的整数 |
| **类型检测** | `typeof 1n; // 'bigint'` |

```javascript
const bigInt = 9007199254740991n;
const anotherBigInt = BigInt(9007199254740991);
```

---

### 2. 数组

| 操作 | 方法 | 说明 |
| :- | :- | :- |
| **创建** | `const arr = [1, 2, 3];` | 创建数组 |
| **访问** | `arr[0]; // 1` | 通过索引访问 |
| **增** | `arr.push(4)` | 末尾添加 |
| **增** | `arr.unshift(0)` | 开头添加 |
| **增** | `arr.splice(2, 0, 2.5)` | 中间插入 |
| **删** | `arr.pop()` | 末尾删除 |
| **删** | `arr.shift()` | 开头删除 |
| **删** | `arr.splice(1, 1)` | 中间删除 |
| **改** | `arr[0] = 10` | 直接修改 |
| **查** | `arr.indexOf(2)` | 查找索引 |
| **查** | `arr.includes(3)` | 检查是否包含 |

**遍历：**

```javascript
for (let i = 0; i < arr.length; i++) {
  console.log(arr[i]);
}
```

---

### 3. 字符串

| 属性 | 说明 |
| :- | :- |
| **创建** | 单引号、双引号、反引号 |
| **方法** | length（长度）、slice（截取）、split（分割） |

```javascript
const str = 'Hello';
str.length; // 5
```

---

### 4. 对象

| 操作 | 方法 | 说明 |
| :- | :- | :- |
| **创建** | `const obj = {name: '张三', age: 18};` | 创建对象 |
| **增** | `obj.gender = '男';` | 添加属性 |
| **删** | `delete obj.gender;` | 删除属性 |
| **改** | `obj.age = 19;` | 修改属性 |
| **查** | `obj.name;` | 访问属性 |
| **查** | `obj['age'];` | 访问属性（方括号） |

**方法定义：**

```javascript
// 方法 1：直接在对象创建时定义
const obj = {
  name: '张三',
  age: 18,
  // 传统写法
  sayHi: function() {
    console.log(`你好，我是${this.name}`);
  },
  // ES6 简写
  sayHello() {
    console.log('Hello!');
  }
};
// 方法 2：后续添加
obj.sayBye = function() {
  console.log('Bye!');
};
// 调用方法
obj.sayHi(); // 你好，我是张三
```

**遍历：**

```javascript
for (const key in obj) {
  console.log(key, obj[key]);
}
```