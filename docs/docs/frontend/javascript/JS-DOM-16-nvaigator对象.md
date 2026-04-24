---
title: "JavaScript navigator对象"

description: "JavaScript navigator对象的使用方法，包括通过userAgent检测浏览器的版本及平台。"

date: "2026-04-21"

tags: [JavaScript, DOM, navigator对象]

sidebar: auto

---


### navigator 对象

| 项目 | 内容 |
|------|------|
| 定义 | navigator 的数据类型是对象，该对象下记录了浏览器自身的相关信息 |
| 常用属性和方法 | 通过 userAgent 检测浏览器的版本及平台 |
| userAgent 属性 | 包含浏览器信息的字符串，可以用来检测浏览器类型和版本 |

## 示例代码

```javascript
// 检测 userAgent（浏览器信息）
(function() {
  const userAgent = navigator.userAgent
  // 验证是否为Android或iPhone
  const android = userAgent.match(/(Android);?[\s\/]+([\d.]+)?/)
  const iphone = userAgent.match(/(iPhone\sOS)\s([\d_]+)/)
  // 如果是Android或iPhone，则跳转至移动站点
  if (android || iphone) {
    location.href = 'http://m.itcast.cn'
  }
})()
```