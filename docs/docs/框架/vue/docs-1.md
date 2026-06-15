# Vue 模板语法

Vue 使用基于 HTML 的模板语法，允许声明式地将组件实例的数据绑定到 DOM 上。

## 文本插值

最基本的数据绑定形式，使用双大括号 `{{ }}`（Mustache 语法）：

```vue
<span>Message: {{ msg }}</span>
```

双大括号会被替换为组件实例中对应属性的值，当数据变更时会自动同步更新。

## 原始 HTML

双大括号会将数据解释为纯文本。如需插入 HTML，使用 `v-html` 指令：

```vue
<p>Using v-html directive: <span v-html="rawHtml"></span></p>
```

::: warning 安全警告
在网站上动态渲染任意 HTML 非常危险，容易造成 XSS 漏洞。请仅在内容可信时使用，切勿使用用户提供的 HTML 内容。
:::

## Attribute 绑定

双大括号不能在 HTML attributes 中使用，需使用 `v-bind` 指令：

```vue
<div v-bind:id="dynamicId"></div>
```

### 简写

`v-bind` 非常常用，可简写为 `:`：

```vue
<div :id="dynamicId"></div>
```

### 同名简写（Vue 3.4+）

当 attribute 名称与变量名相同时：

```vue
<!-- 与 :id="id" 相同 -->
<div :id></div>
```

### 布尔型 Attribute

```vue
<button :disabled="isButtonDisabled">Button</button>
```

当值为真值或空字符串时，attribute 会被渲染；其他假值时将被忽略。

### 动态绑定多个值

```js
const objectOfAttrs = {
  id: 'container',
  class: 'wrapper',
  style: 'background-color:green'
}
```

```vue
<div v-bind="objectOfAttrs"></div>
```

## JavaScript 表达式

模板中支持完整的 JavaScript 表达式：

```vue
{{ number + 1 }}
{{ ok ? 'YES' : 'NO' }}
{{ message.split('').reverse().join('') }}
<div :id="`list-${id}`"></div>
```

::: tip 注意
每个绑定仅支持**单一表达式**（能被求值的 JavaScript 代码），不支持语句或条件控制。
:::

## 指令 Directives

指令是带有 `v-` 前缀的特殊 attribute，如 `v-bind` 和 `v-html`。指令会在表达式值变化时响应式地更新 DOM：

```vue
<p v-if="seen">Now you see me</p>
```

## 参数 Arguments

某些指令需要参数，通过冒号 `:` 连接：

```vue
<!-- 绑定 HTML attribute -->
<a v-bind:href="url">...</a>
<a :href="url">...</a>

<!-- 监听 DOM 事件 -->
<a v-on:click="doSomething">...</a>
<a @click="doSomething">...</a>
```

## 动态参数

使用方括号 `[]` 包裹 JavaScript 表达式：

```vue
<!-- 动态 attribute 名 -->
<a :[attributeName]="url">...</a>

<!-- 动态事件名 -->
<a @[eventName]="doSomething">...</a>
```

::: warning 限制
- 动态参数值应为字符串或 `null`
- 表达式中不能包含空格和引号（HTML attribute 名称不合法）
- DOM 内嵌模板中避免使用大写字母（会被转为小写）
:::

## 修饰符 Modifiers

修饰符以点 `.` 开头，表示指令以特殊方式绑定：

```vue
<form @submit.prevent="onSubmit">...</form>
```

`.prevent` 告知指令调用 `event.preventDefault()`。