> 学习资料来源:MDN文档:(MDN-JS)[https://developer.mozilla.org/zh-CN/docs/Web/JavaScript]  
## 数据
---
### 定义数据
1. var
2. let
3. const
    - 不多管，关键词的意思，变量作用域，和其他语言的差不多
    - var有变量提升的问题，变量位置在解释前全部提前到文件开头解析
---
### 数据类型

|类型|值|
|---|---|
|boolean|true/false|
|Number|双浮点数|
|String|字符串|
|null|空值，返回object|
|undefined|自动赋值给刚创建的变量/没有实参的形参|
|BigInt|任意精度的整形|
|symbol|在其他语言没学过|
|object|对象|

---
### 类型转换
1. 数字转字符串
    - 直接给变量重新赋值
    - `+`转
2. 字符串转数字
    - parseInt()
    - parseFloat()
---
## 流程控制
1. 条件
    - if -> else if -> else
    - switch case
2. 循环
    - for
    - while
3. 错误处理
    - try catch
---
## 函数
1. function关键字
2. 闭包
3. 匿名函数(箭头函数)
4. 内置函数
    - 用到什么查什么，逐渐补充
---
## 运算符和优先级
- 基本和Cpp一样，懒得看了，有问题了现查
---
## 对象
### 创建对象

| 方式 | 语法 | 示例 |
|------|------|------|
| 字面量（最常用） | `{ key: value, ... }` | `const o = { a: 1, b: "x" }` |
| `new Object()` | 先建空对象再赋属性 | `const o = new Object(); o.a = 1` |
| 构造函数 + `new` | 定义类型批量创建 | `new Car("Eagle", "Talon", 1993)` |
| `Object.create(原型)` | 指定原型创建，不写构造函数 | `Object.create(Animal)` |

**构造函数**：

```js
function Car(make, model, year) {
  this.make = make;   // this 指代新创建的实例
  this.year = year;
}
const mycar = new Car("Eagle", "Talon TSi", 1993);
```
### 访问属性
- object.name
### 枚举属性

| 方式 | 范围 |
|------|------|
| `for...in` | 自身 + 原型链上所有**可枚举**属性 |
| `Object.keys(o)` | 自身所有可枚举属性的名（数组） |
| `Object.getOwnPropertyNames(o)` | 自身所有属性名，含不可枚举 |

### 方法
1. 不用function，直接写函数
2. object.fn，调方法
### this 关键字
- 面向对象编程的关键字
### getter 与 setter

字面量里用 `get` / `set` 定义属性存取钩子：getter 无参数、setter 单个参数。也可用 `Object.defineProperty(obj, "name", { get, set })` 给已有对象追加。
---
## Number 数字
### 类型与表示

| 表示方式 | 说明 |
|----------|------|
| 二进制 / 八进制 / 十进制 / 十六进制 | 支持多种进制 |
| 指数表示 | 支持 |
| `_` 分隔符 | 支持，便于阅读大数字 |

### 方法

| 方法 | 作用 |
|------|------|
| `parseInt()` | 转整形 |
| `parseFloat()` | 转浮点数 |
| `isFinite()` | 是否为有限数 |
| `isInteger()` | 是否为整形 |
| `isNaN()` | 是否为 NaN |
| `isSafeInteger()` | 是否为安全整形 |

---
## 容器
JS 的 4 类容器对应 Python 内置容器：

| Python | JS 容器 | 说明 |
|--------|---------|------|
| str | String | 字符串 |
| list | 数组 Array | 有序可变序列 |
| dict | Map | 键值映射 |
| set | Set | 唯一值集合 |
| tuple | 无 | JS 无元组，可用冻结数组近似 |

### 字符串 String（str）
**初始化**

| 方式 | 示例 | 说明 |
|------|------|------|
| 单引号 | `'str'` | 普通字符串 |
| 双引号 | `"str"` | 普通字符串 |
| 模板字符串 | `` `值:${x}` `` | 支持 `${}` 插值、换行 |

**常用方法**

| 方法 | 作用 |
|------|------|
| `at(i)` / `charAt(i)` | 取第 i 个字符 |
| `charCodeAt()` / `codePointAt()` | 取字符编码 |
| `indexOf()` / `lastIndexOf()` | 查找子串位置 |
| `startsWith()` / `endsWith()` | 是否以某串开头 / 结尾 |
| `includes()` | 是否包含子串 |
| `match()` / `matchAll()` | 正则匹配 |
| `search()` | 正则搜索位置 |
| `slice()` / `substring()` / `substr()` | 截取 |
| `split()` | 按分隔符拆成数组 |
| `trim()` / `trimStart()` / `trimEnd()` | 去空白 |
| `toLowerCase()` / `toUpperCase()` | 转大小写 |
| `toLocaleLowerCase()` / `toLocaleUpperCase()` | 按区域转大小写 |
| `padStart()` / `padEnd()` | 填充到指定长度 |
| `concat()` / `repeat()` | 拼接 / 重复 |
| `normalize()` / `toWellFormed()` | Unicode 正规化 / 校验 |

### 数组 Array（list）
**初始化**

| 方式 | 说明 | 示例 |
|------|------|------|
| 字面量 | 最常用 | `const a = [1, 2, 3]` |
| `new Array(n)` | 指定长度的空数组 | `new Array(10)` |
| `Array.from(可迭代)` | 从类数组 / Set 转型 | `Array.from(mySet)` |

> 给 `new Array()` 传**单个数字**会被当作长度而非元素，单元素用字面量 `[5]`。给 `arr.length` 赋值可截断数组。

**常用方法**

| 方法 | 作用 |
|------|------|
| `push(x)` / `pop()` | 末尾增 / 删 |
| `unshift(x)` / `shift()` | 开头增 / 删 |
| `concat(数组)` | 连接，返回新数组 |
| `join(分隔符)` | 连成字符串 |
| `slice(起, 止)` / `splice(起, 数, ...)` | 截取 / 删除替换 |
| `indexOf(x)` / `includes(x)` | 查找元素 |
| `reverse()` / `sort()` | 反转 / 排序 |

> `sort()` 对数字要传比较函数：`a.sort((x, y) => x - y)`。

**遍历**：`for...of` 逐个取值（最常用）；`forEach(cb)` 遍历执行。

**迭代方法**

| 方法 | 作用 |
|------|------|
| `map(cb)` | 回调返回值组成新数组 |
| `filter(cb)` | 保留回调为 `true` 的元素 |
| `find(cb)` / `findIndex(cb)` | 第一个满足的元素 / 索引 |
| `some(cb)` / `every(cb)` | 任一满足 / 全部满足 |
| `reduce(cb, 初值)` | 累积归约为单值 |

### 字典 Map（dict）
**初始化**

| 方式 | 示例 |
|------|------|
| 空建 | `new Map()` |
| 从键值对数组建 | `new Map([['k1','v1'], ['k2','v2']])` |

**常用方法**

| 方法 | 作用 |
|------|------|
| `set(k, v)` | 新增 / 覆盖键值 |
| `get(k)` | 取值，无则 `undefined` |
| `has(k)` | 键是否存在 |
| `delete(k)` / `clear()` | 删某键 / 清空 |
| `size` | 键值对数量 |

**遍历**：`for...of` 每次得 `[key, value]`：`for (const [k, v] of m) {...}`。

> 对比：`Object` 键只能是字符串 / Symbol，`Map` 键**任意类型**、有 `size`、按插入顺序遍历——做映射首选 `Map`。`WeakMap` 键必须对象且弱引用（对象回收时值一起回收）、不可枚举，用于存私有数据不泄漏内存。

### 集合 Set（set）
**初始化**

| 方式 | 示例 | 说明 |
|------|------|------|
| 空建 | `new Set()` | 后逐条 `add` |
| 从数组建 | `new Set([1, 2, 2, 3])` | 自动去重 |

**常用方法**

| 方法 | 作用 |
|------|------|
| `add(x)` | 添加（重复不生效） |
| `has(x)` | 是否包含某值 |
| `delete(x)` / `clear()` | 删某值 / 清空 |
| `size` | 元素个数 |

**遍历**：`for...of` 逐值；转数组 `[...s]` 或 `Array.from(s)`。

> **去重神器**：`[...new Set(arr)]` 一行去重。`Set` 按值删除、自动去重，比数组更合适做集合；`WeakSet` 值须对象且弱引用、不可枚举，常用于 DOM 标记。

> **键值相等**：Map / Set 判断相等用 SameValueZero，与 `===` 几乎一致，但 `NaN` 视为相等（`===` 不等）、`-0` 与 `+0` 相等。
---
## JSON
JSON 是数据交换格式；`JSON` 是命名空间对象（非构造函数，同 `Math`），只有两个静态方法：

| 方法 | 作用 |
|------|------|
| `JSON.parse(str)` | 把 JSON **字符串**解析成 JS 值 |
| `JSON.stringify(value)` | 把 JS 值**序列化**成 JSON 字符串 |

```js
const obj = JSON.parse('{"name":"张三","age":20}');
JSON.stringify(obj);            // '{"name":"张三","age":20}'
JSON.stringify(obj, null, 2);   // 第三参 = 缩进空格数，格式化输出
JSON.stringify(obj, ['name'], 2); // 第二参 = 键数组，只序列化这些键
```

> `JSON.parse` 解析非法 JSON 会抛 `SyntaxError`，需 try/catch。`stringify` 会**跳过**值为 `undefined`/函数/`Symbol` 的属性；对象含 `toJSON()` 会自动调用（如 `Date`）。**深拷贝简易版**：`JSON.parse(JSON.stringify(obj))`（会丢函数/`undefined`）。
---