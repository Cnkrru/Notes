---
title: "JavaScript this对象"

description: "JavaScript this对象的使用方法，包括不同场景下this的指向。"

date: "2026-04-21"

tags: [JavaScript, this对象]

sidebar: auto

---


### this 对象

| 场景 | this 指向 |
|------|-----------|
| 普通函数 | 全局对象（window） |
| 箭头函数 | 定义时的上下文 |
| 对象方法 | 调用该方法的对象 |
| 事件处理函数 | 触发事件的元素 |
| 构造函数 | 新创建的实例 |

## 示例代码

```javascript
// 普通函数中的this
function test() {
  console.log(this); // 指向window
}
test();

// 对象方法中的this
const obj = {
  name: '张三',
  sayHello: function() {
    console.log(this.name); // 指向obj
  }
};
obj.sayHello();

// 箭头函数中的this
const arrowObj = {
  name: '李四',
  sayHello: () => {
    console.log(this); // 指向定义时的上下文（window）
  }
};
arrowObj.sayHello();

// 事件处理函数中的this
document.querySelector('button').addEventListener('click', function() {
  console.log(this); // 指向触发事件的按钮元素
});

// 构造函数中的this
function Person(name) {
  this.name = name;
  console.log(this); // 指向新创建的实例
}
const person = new Person('王五');
```
