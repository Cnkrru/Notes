---
title: "XMLHttpRequest"

description: "XMLHttpRequest的使用方法，包括基础用法和高级用法。"

date: 2026-04-25

tags: [XMLHttpRequest, HTTP, AJAX, 基础, 高级]

sidebar: auto

---

# 后端

# XMLHttpRequest

## 1. XMLHttpRequest 基础

### 什么是 XMLHttpRequest
- **作用**：在后台与服务器交换数据，实现页面无刷新更新
- **特点**：
  - 不需要刷新整个页面
  - 可以在后台发送请求
  - 可以接收和处理服务器响应
  - 可以发送各种类型的数据

### 基本使用步骤

1. **创建 XMLHttpRequest 对象**
2. **配置请求**：设置请求方法、URL、是否异步等
3. **注册事件监听器**：监听请求状态变化
4. **发送请求**
5. **处理响应**

### 基础示例

#### 发起 GET 请求

```javascript
// 1. 创建 XMLHttpRequest 对象
const xhr = new XMLHttpRequest()

// 2. 配置请求
xhr.open('GET', 'http://hmajax.itheima.net/api/province', true)

// 3. 注册事件监听器
xhr.onreadystatechange = function() {
  if (xhr.readyState === 4 && xhr.status === 200) {
    // 4. 处理响应
    const response = JSON.parse(xhr.responseText)
    console.log('响应数据:', response)
  }
}

// 4. 发送请求
xhr.send()
```

#### 发起 POST 请求

```javascript
// 1. 创建 XMLHttpRequest 对象
const xhr = new XMLHttpRequest()

// 2. 配置请求
xhr.open('POST', 'http://hmajax.itheima.net/api/login', true)

// 设置请求头
xhr.setRequestHeader('Content-Type', 'application/json')

// 3. 注册事件监听器
xhr.onreadystatechange = function() {
  if (xhr.readyState === 4 && xhr.status === 200) {
    // 4. 处理响应
    const response = JSON.parse(xhr.responseText)
    console.log('响应数据:', response)
  }
}

// 4. 发送请求
const data = JSON.stringify({ username: 'admin', password: '123456' })
xhr.send(data)
```

### readyState 状态

| 值 | 状态 | 描述 |
|-----|------|------|
| 0 | UNSENT | 初始化状态，尚未调用 open() 方法 |
| 1 | OPENED | 已调用 open() 方法，尚未调用 send() 方法 |
| 2 | HEADERS_RECEIVED | 已调用 send() 方法，已收到响应头 |
| 3 | LOADING | 正在接收响应体 |
| 4 | DONE | 响应已完成 |

### 事件处理

| 事件 | 描述 |
|------|------|
| onreadystatechange | 当 readyState 发生变化时触发 |
| onload | 请求完成时触发 |
| onerror | 请求失败时触发 |
| onprogress | 接收响应数据时触发 |
| ontimeout | 请求超时时触发 |

---

## 2. XMLHttpRequest 高级用法

### 超时设置

```javascript
const xhr = new XMLHttpRequest()
xhr.open('GET', 'http://hmajax.itheima.net/api/province', true)

// 设置超时时间（毫秒）
xhr.timeout = 5000

// 超时回调
xhr.ontimeout = function() {
  console.error('请求超时')
}

xhr.onreadystatechange = function() {
  if (xhr.readyState === 4) {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText)
      console.log('响应数据:', response)
    } else {
      console.error('请求失败:', xhr.status)
    }
  }
}

xhr.send()
```

### 进度监控

```javascript
const xhr = new XMLHttpRequest()
xhr.open('GET', 'http://hmajax.itheima.net/api/large-file', true)

// 上传进度
xhr.upload.onprogress = function(event) {
  if (event.lengthComputable) {
    const percentComplete = (event.loaded / event.total) * 100
    console.log('上传进度:', percentComplete.toFixed(2) + '%')
  }
}

// 下载进度
xhr.onprogress = function(event) {
  if (event.lengthComputable) {
    const percentComplete = (event.loaded / event.total) * 100
    console.log('下载进度:', percentComplete.toFixed(2) + '%')
  }
}

xhr.onload = function() {
  console.log('请求完成')
}

xhr.send()
```

### 取消请求

```javascript
const xhr = new XMLHttpRequest()
xhr.open('GET', 'http://hmajax.itheima.net/api/province', true)

xhr.onreadystatechange = function() {
  if (xhr.readyState === 4) {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText)
      console.log('响应数据:', response)
    }
  }
}

xhr.send()

// 取消请求
setTimeout(function() {
  xhr.abort()
  console.log('请求已取消')
}, 1000)
```

### 跨域请求

```javascript
const xhr = new XMLHttpRequest()
xhr.open('GET', 'http://other-domain.com/api/data', true)

// 允许携带凭证（如Cookie）
xhr.withCredentials = true

xhr.onreadystatechange = function() {
  if (xhr.readyState === 4 && xhr.status === 200) {
    const response = JSON.parse(xhr.responseText)
    console.log('响应数据:', response)
  }
}

xhr.send()
```

### 表单数据提交

```javascript
const xhr = new XMLHttpRequest()
xhr.open('POST', 'http://hmajax.itheima.net/api/upload', true)

// 监听上传进度
xhr.upload.onprogress = function(event) {
  if (event.lengthComputable) {
    const percentComplete = (event.loaded / event.total) * 100
    console.log('上传进度:', percentComplete.toFixed(2) + '%')
  }
}

xhr.onreadystatechange = function() {
  if (xhr.readyState === 4) {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText)
      console.log('上传成功:', response)
    } else {
      console.error('上传失败:', xhr.status)
    }
  }
}

// 创建 FormData 对象
const formData = new FormData()
formData.append('username', 'admin')
formData.append('file', fileInput.files[0]) // 假设 fileInput 是文件输入元素

// 发送 FormData
xhr.send(formData)
```

### 响应类型设置

```javascript
const xhr = new XMLHttpRequest()
xhr.open('GET', 'http://hmajax.itheima.net/api/image', true)

// 设置响应类型为 blob（用于图片等二进制数据）
xhr.responseType = 'blob'

xhr.onload = function() {
  if (xhr.status === 200) {
    // 创建图片元素并显示
    const blob = xhr.response
    const imageUrl = URL.createObjectURL(blob)
    const img = document.createElement('img')
    img.src = imageUrl
    document.body.appendChild(img)
  }
}

xhr.send()
```

### 错误处理

```javascript
const xhr = new XMLHttpRequest()
xhr.open('GET', 'http://hmajax.itheima.net/api/province', true)

xhr.onload = function() {
  if (xhr.status === 200) {
    const response = JSON.parse(xhr.responseText)
    console.log('响应数据:', response)
  } else {
    console.error('请求失败:', xhr.status, xhr.statusText)
  }
}

xhr.onerror = function() {
  console.error('网络错误')
}

xhr.ontimeout = function() {
  console.error('请求超时')
}

xhr.send()
```

### 示例：封装 XMLHttpRequest

```javascript
/**
 * 封装 XMLHttpRequest
 * @param {Object} options - 配置选项
 * @returns {Promise} - 返回 Promise 对象
 */
function request(options) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    
    // 配置请求
    xhr.open(options.method || 'GET', options.url, true)
    
    // 设置请求头
    if (options.headers) {
      Object.keys(options.headers).forEach(key => {
        xhr.setRequestHeader(key, options.headers[key])
      })
    }
    
    // 设置超时
    if (options.timeout) {
      xhr.timeout = options.timeout
      xhr.ontimeout = () => reject(new Error('请求超时'))
    }
    
    // 处理响应
    xhr.onload = function() {
      if (xhr.status >= 200 && xhr.status < 300) {
        let response
        try {
          response = JSON.parse(xhr.responseText)
        } catch (e) {
          response = xhr.responseText
        }
        resolve(response)
      } else {
        reject(new Error(`请求失败: ${xhr.status} ${xhr.statusText}`))
      }
    }
    
    // 处理错误
    xhr.onerror = function() {
      reject(new Error('网络错误'))
    }
    
    // 发送请求
    xhr.send(options.data ? JSON.stringify(options.data) : null)
  })
}

// 使用示例
request({
  method: 'POST',
  url: 'http://hmajax.itheima.net/api/login',
  headers: {
    'Content-Type': 'application/json'
  },
  data: {
    username: 'admin',
    password: '123456'
  },
  timeout: 5000
})
.then(response => {
  console.log('请求成功:', response)
})
.catch(error => {
  console.error('请求失败:', error.message)
})
```