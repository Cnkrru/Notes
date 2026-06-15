---
title: "Vue 3 创建工程"

description: "Vue 3 工程创建相关知识，包括基于 Vite 创建工程和 main.ts 入口文件解析。"

date: "2026-04-26"

tags: [Vue, 工程创建, Vite]

sidebar: auto

---


#Vue

---
## 基于 vite 创建
`vite` 是新一代前端构建工具，官网地址：[https://vitejs.cn](https://vitejs.cn/)

* 具体操作如下（[官方文档](https://cn.vuejs.org/guide/quick-start.html#creating-a-vue-application)）

```powershell
## 1.创建命令
npm create vue@latest

## 2.具体配置
## 配置项目名称
√ Project name: vue3_test
## 是否添加TypeScript支持
√ Add TypeScript?  Yes
## 是否添加JSX支持
√ Add JSX Support?  No
## 是否添加路由环境
√ Add Vue Router for Single Page Application development?  No
## 是否添加pinia环境
√ Add Pinia for state management?  No
## 是否添加单元测试
√ Add Vitest for Unit Testing?  No
## 是否添加端到端测试方案
√ Add an End-to-End Testing Solution? » No
## 是否添加ESLint语法检查
√ Add ESLint for code quality?  Yes
## 是否添加Prettiert代码格式化
√ Add Prettier for code formatting?  No
```
---

## main.ts 入口文件

```typescript
import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
```

---
### 1. 引入全局样式

```typescript
import './assets/main.css'
```
- 导入全局样式文件，这些样式会应用到整个应用实例

### 2. 导入 createApp 函数

```typescript
import { createApp } from 'vue'
```
- 从 Vue 包中导入 createApp 函数
- createApp 是 Vue 3 中创建应用实例的核心函数
- 它接受一个根组件作为参数，返回一个应用实例

### 3. 导入根组件

```typescript
import App from './App.vue'
```
- 导入 App.vue 文件作为根组件
- App 是整个应用的顶层组件，包含了应用的所有内容

### 4. 创建并挂载应用

```typescript
createApp(App).mount('#app')
```
- `createApp(App)` 创建一个新的 Vue 应用实例，以 App 作为根组件
- `.mount('#app')` 将应用实例挂载到 DOM 中的 #app 元素上
- #app 是 HTML 中的一个元素，通常在 index.html 中定义为 `id="app"`
---

# Vue 3 组件三区域

---

## 组件结构

Vue 组件由三个核心区域组成：

1. `<template>` - 模板区域，定义组件的 HTML 结构
2. `<script>` - 脚本区域，定义组件的逻辑
    - lang="ts" - 指定脚本为 TypeScript 语言，开启 TypeScript类型检查
    - setup - 指定脚本为组合式 API，开启组合式 API 功能
3. `<style>` - 样式区域，定义组件的样式
    - scoped - 指定样式仅作用于当前组件，不影响其他组件的样式

---
