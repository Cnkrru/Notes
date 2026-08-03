---
title: "axios 使用"

description: "axios库的使用方法，包括URL查询参数处理、axios配置、错误处理等。"

date: 2026-04-25

tags: [axios, HTTP, 请求, 配置, 错误处理]

sidebar: auto

---

# 后端

# axios 使用

## 1. URL 查询参数与 axios 使用

### 什么是查询参数
- **作用**：在 URL 中传递额外的参数信息
- **格式**：`?key1=value1&key2=value2`
- **示例**：`http://hmajax.itheima.net/api/province?name=北京&page=1`

### axios 基本使用

#### 安装 axios
```bash
npm install axios
```

#### 引入 axios
```javascript
import axios from 'axios'
```

#### 发起 GET 请求

```javascript
// 方法1：直接在 URL 中添加查询参数
axios.get('http://hmajax.itheima.net/api/province?name=北京')
  .then(response => {
    console.log(response.data)
  })
  .catch(error => {
    console.error(error)
  })

// 方法2：使用 params 选项
axios.get('http://hmajax.itheima.net/api/province', {
  params: {
    name: '北京',
    page: 1
  }
})
  .then(response => {
    console.log(response.data)
  })
  .catch(error => {
    console.error(error)
  })
```

#### 发起 POST 请求

```javascript
axios.post('http://hmajax.itheima.net/api/login', {
  username: 'admin',
  password: '123456'
})
  .then(response => {
    console.log(response.data)
  })
  .catch(error => {
    console.error(error)
  })
```

---

## 2. HTTP 请求方法与 axios 配置

### 支持的请求方法

| 方法 | 语法 | 说明 |
|------|------|------|
| GET | `axios.get(url, config)` | 获取资源 |
| POST | `axios.post(url, data, config)` | 提交数据 |
| PUT | `axios.put(url, data, config)` | 更新资源 |
| DELETE | `axios.delete(url, config)` | 删除资源 |
| PATCH | `axios.patch(url, data, config)` | 部分更新资源 |
| HEAD | `axios.head(url, config)` | 获取响应头 |
| OPTIONS | `axios.options(url, config)` | 预检请求 |

### 配置选项

| 选项 | 类型 | 说明 |
|------|------|------|
| baseURL | string | 基础URL，会自动拼接到请求URL前 |
| headers | object | 请求头配置 |
| params | object | 查询参数 |
| data | object | 请求体数据 |
| timeout | number | 请求超时时间（毫秒） |
| withCredentials | boolean | 是否携带Cookie |
| auth | object | 认证信息 |
| responseType | string | 响应类型，如 'json', 'blob' |

### 全局配置

```javascript
// 设置全局配置
axios.defaults.baseURL = 'http://hmajax.itheima.net'
axios.defaults.timeout = 10000
axios.defaults.headers.common['Authorization'] = 'Bearer token'
axios.defaults.headers.post['Content-Type'] = 'application/json'
```

### 创建实例

```javascript
// 创建 axios 实例
const instance = axios.create({
  baseURL: 'http://hmajax.itheima.net',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 使用实例发起请求
instance.get('/api/province')
  .then(response => {
    console.log(response.data)
  })
  .catch(error => {
    console.error(error)
  })
```

---

## 3. axios 错误处理

### 错误类型

| 类型 | 说明 | 示例 |
|------|------|------|
| 网络错误 | 网络连接问题 | 断网、服务器无响应 |
| 超时错误 | 请求超时 | 请求超过设定的timeout时间 |
| 4xx错误 | 客户端错误 | 400、401、404等 |
| 5xx错误 | 服务器错误 | 500、502、503等 |

### 错误处理方法

#### 基本错误处理

```javascript
axios.get('/api/province')
  .then(response => {
    console.log(response.data)
  })
  .catch(error => {
    // 处理错误
    if (error.response) {
      // 服务器返回错误状态码
      console.error('状态码:', error.response.status)
      console.error('响应数据:', error.response.data)
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      console.error('没有收到响应:', error.request)
    } else {
      // 请求配置出错
      console.error('请求配置错误:', error.message)
    }
  })
```

#### 拦截器错误处理

```javascript
// 请求拦截器
axios.interceptors.request.use(
  config => {
    // 在发送请求前做些什么
    return config
  },
  error => {
    // 处理请求错误
    return Promise.reject(error)
  }
)

// 响应拦截器
axios.interceptors.response.use(
  response => {
    // 对响应数据做点什么
    return response
  },
  error => {
    // 处理响应错误
    if (error.response) {
      // 服务器返回错误状态码
      switch (error.response.status) {
        case 401:
          // 未授权，跳转到登录页
          window.location.href = '/login'
          break
        case 404:
          // 资源不存在
          console.error('请求的资源不存在')
          break
        case 500:
          // 服务器内部错误
          console.error('服务器内部错误')
          break
        default:
          console.error('请求失败:', error.response.data)
      }
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      console.error('网络错误，请检查网络连接')
    } else {
      // 请求配置出错
      console.error('请求配置错误:', error.message)
    }
    return Promise.reject(error)
  }
)
```

### 错误处理最佳实践

1. **统一错误处理**：使用响应拦截器统一处理错误
2. **友好的错误提示**：根据错误类型显示不同的提示信息
3. **重试机制**：对于网络错误，可以实现自动重试
4. **日志记录**：记录错误信息，便于排查问题
5. **用户体验**：在请求过程中显示加载状态，错误时显示友好提示

### 示例：完整的错误处理

```javascript
// 创建 axios 实例
const api = axios.create({
  baseURL: 'http://hmajax.itheima.net',
  timeout: 10000
})

// 响应拦截器
api.interceptors.response.use(
  response => {
    // 对响应数据做点什么
    return response
  },
  error => {
    // 处理响应错误
    let errorMessage = '请求失败'
    
    if (error.response) {
      // 服务器返回错误状态码
      switch (error.response.status) {
        case 400:
          errorMessage = '请求参数错误'
          break
        case 401:
          errorMessage = '未授权，请重新登录'
          // 跳转到登录页
          // window.location.href = '/login'
          break
        case 403:
          errorMessage = '禁止访问'
          break
        case 404:
          errorMessage = '请求的资源不存在'
          break
        case 500:
          errorMessage = '服务器内部错误'
          break
        case 502:
          errorMessage = '网关错误'
          break
        case 503:
          errorMessage = '服务不可用'
          break
        default:
          errorMessage = error.response.data.message || '请求失败'
      }
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      errorMessage = '网络错误，请检查网络连接'
    } else {
      // 请求配置出错
      errorMessage = error.message
    }
    
    // 显示错误提示
    console.error(errorMessage)
    // 可以在这里调用 UI 库的提示组件，如 ElMessage.error(errorMessage)
    
    return Promise.reject(error)
  }
)

// 使用 api 实例发起请求
api.get('/api/province')
  .then(response => {
    console.log('请求成功:', response.data)
  })
  .catch(error => {
    // 这里可以处理特殊的错误情况
    console.error('请求失败:', error)
  })
```