# 前端

---

## 一、输入输出

### 1. 输出

| 方法 | 说明 | 示例 |
| :- | :- | :- |
| **console.log()** | 控制台打印 | `console.log('Hello');` |
| **alert()** | 弹窗 | `alert('Hello');` |
| **document.write()** | 页面写入 | `document.write('Hello');` |

---

### 2. 输入

| 方法 | 说明 | 示例 |
| :- | :- | :- |
| **prompt()** | 弹窗输入 | `const name = prompt('请输入姓名:');` |
| **confirm()** | 确认框 | `const isOk = confirm('确定吗？');` |
| **表单输入** | 获取表单值 | `const value = document.getElementById('id').value;` |

---

## 二、函数

### 1. 基本函数

| 属性 | 说明 | 示例 |
| :- | :- | :- |
| **定义** | 函数声明 | `function add(a, b) { return a + b; }` |
| **调用** | 函数调用 | `const sum = add(1, 2); // 3` |
| **默认参数** | 参数默认值 | `function greet(name = '张三') { ... }` |
| **剩余参数** | 收集多余参数 | `function sum(...nums) { ... }` |

---

### 2. 匿名函数

| 属性 | 说明 |
| :- | :- |
| **基本形式** | `const func = function(a, b) { return a + b; };` |
| **类比 Python** | 类似 Python 的 lambda 函数，但更灵活 |

Python 对比：`lambda a, b: a + b` vs JavaScript: `function(a, b) { return a + b; }`

**使用场景：**

```javascript
// 1. 作为参数传递
setTimeout(function() {
  console.log('延迟执行');
}, 1000);

// 2. 立即执行函数表达式 (IIFE)
(function() {
  console.log('立即执行');
})();

// 3. 事件监听器
document.getElementById('btn').addEventListener('click', function() {
  console.log('点击了按钮');
});
```

---

## 三、控制流程

### 1. 条件语句
- if 语句
- switch 语句

### 2. 循环
- while 循环
- for 循环

### 3. 循环控制
- continue（跳过当前循环）
- break（结束循环）

---

## 四、库函数

### 1. 数学相关

| 方法 | 说明 | 示例 |
| :- | :- | :- |
| **Math.PI** | 圆周率 | `3.14159` |
| **Math.round()** | 四舍五入 | `Math.round(3.6); // 4` |
| **Math.abs()** | 绝对值 | `Math.abs(-5); // 5` |
| **Math.max()** | 最大值 | `Math.max(1, 2, 3); // 3` |
| **Math.min()** | 最小值 | `Math.min(1, 2, 3); // 1` |
| **Math.pow()** | 幂运算 | `Math.pow(2, 3); // 8` |
| **Math.sqrt()** | 平方根 | `Math.sqrt(9); // 3` |
| **Math.random()** | 生成 0-1 随机数 | `Math.random();` |

**生成指定范围随机数：**

```javascript
function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
const num = getRandom(1, 10); // 1-10 之间的随机数
```

---

### 2. 日期时间（时间戳）

| 操作 | 方法 | 示例 |
| :- | :- | :- |
| **创建** | `new Date()` | 当前时间 |
| **创建** | `new Date('2024-01-01')` | 指定时间 |
| **获取年份** | `date.getFullYear()` | 年份 |
| **获取月份** | `date.getMonth() + 1` | 月份（0-11） |
| **获取日期** | `date.getDate()` | 日期 |
| **获取小时** | `date.getHours()` | 小时 |
| **获取分钟** | `date.getMinutes()` | 分钟 |
| **获取秒** | `date.getSeconds()` | 秒 |
| **设置年份** | `date.setFullYear(2025)` | 设置年份 |
| **设置月份** | `date.setMonth(11)` | 设置月份（12月） |

---

### 3. 数据结构

**Array（数组）：**

| 方法 | 说明 | 示例 |
| :- | :- | :- |
| **Array.from()** | 类数组转换 | `Array.from('abc'); // ['a', 'b', 'c']` |
| **Array.of()** | 创建数组 | `Array.of(1, 2, 3); // [1, 2, 3]` |
| **find()** | 查找元素 | `[1, 2, 3].find(item => item > 1); // 2` |
| **findIndex()** | 查找索引 | `[1, 2, 3].findIndex(item => item > 1); // 1` |

**Map（字典）：**

| 方法 | 说明 | 示例 |
| :- | :- | :- |
| **set()** | 添加键值对 | `map.set('name', '张三');` |
| **get()** | 获取值 | `map.get('name'); // '张三'` |
| **has()** | 检查键 | `map.has('name'); // true` |
| **size** | 大小 | `map.size; // 2` |

**Set（集合）：**

| 方法 | 说明 | 示例 |
| :- | :- | :- |
| **add()** | 添加元素 | `set.add(4);` |
| **has()** | 检查元素 | `set.has(2); // true` |
| **delete()** | 删除元素 | `set.delete(3);` |
| **size** | 大小 | `set.size; // 4` |

**String（字符串）：**

| 方法 | 说明 | 示例 |
| :- | :- | :- |
| **includes()** | 检查是否包含 | `'Hello'.includes('e'); // true` |
| **startsWith()** | 检查开头 | `'Hello'.startsWith('H'); // true` |
| **endsWith()** | 检查结尾 | `'Hello'.endsWith('o'); // true` |
| **toUpperCase()** | 转大写 | `'hello'.toUpperCase(); // 'HELLO'` |
| **toLowerCase()** | 转小写 | `'HELLO'.toLowerCase(); // 'hello'` |
| **模板字符串** | 字符串插值 | `` `你好，${name}！` `` |

---

### 4. 正则

| 方法 | 说明 | 示例 |
| :- | :- | :- |
| **创建** | 字面量 | `const reg = /\d+/;` |
| **创建** | 构造函数 | `const reg2 = new RegExp('\\d+');` |
| **test()** | 测试匹配 | `reg.test('123'); // true` |
| **match()** | 匹配结果 | `'abc123def'.match(reg); // ['123']` |

---

### 5. 对象和 JSON

**Object：**

| 方法 | 说明 | 示例 |
| :- | :- | :- |
| **Object.keys()** | 获取键数组 | `Object.keys({name: '张三', age: 18}); // ['name', 'age']` |
| **Object.values()** | 获取值数组 | `Object.values({name: '张三', age: 18}); // ['张三', 18]` |
| **Object.entries()** | 获取键值对数组 | `Object.entries({name: '张三', age: 18}); // [['name', '张三'], ['age', 18]]` |
| **Object.assign()** | 合并对象 | `Object.assign({}, {a: 1}, {b: 2}); // {a: 1, b: 2}` |

**JSON：**

| 方法 | 说明 | 示例 |
| :- | :- | :- |
| **JSON.stringify()** | 对象转 JSON | `JSON.stringify({name: '张三', age: 18});` |
| **JSON.parse()** | JSON 转对象 | `JSON.parse('{"name":"张三","age":18}');` |

---

### 6. 异步操作

**Promise：**

```javascript
// 创建
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('成功');
  }, 1000);
});
// 使用
promise.then(result => {
  console.log(result); // '成功'
});
```