# 后端

---

## 1. HTTP URL 组成部分

| 组成部分 | 作用 | 示例 |
| :- | :- | :- |
| **协议** | 规定浏览器和服务器之间传输数据的格式 | `http://` 或 `https://` |
| **域名** | 标记服务器在互联网中的方位 | `hmajax.itheima.net`、`baidu.com` |
| **资源路径** | 标记资源在服务器下的具体位置 | `/api/province`、`/api/books` |

### 完整结构

```http
http://hmajax.itheima.net/api/province
└──┬──┘ └──────┬──────┘ └──────┬──────┘
  协议        域名        资源路径
```

---

## 2. HTTP 请求方法

| 方法 | 描述 | 适用场景 |
|------|------|----------|
| GET | 请求获取资源 | 一般用于查询操作，如获取列表、详情 |
| POST | 提交数据 | 一般用于创建操作，如新增用户、提交表单 |
| PUT | 更新资源 | 一般用于更新操作，如更新用户信息 |
| DELETE | 删除资源 | 一般用于删除操作，如删除用户 |
| PATCH | 部分更新资源 | 一般用于部分更新操作，如更新用户的某个字段 |
| HEAD | 获取响应头 | 仅获取响应头信息，不获取响应体 |
| OPTIONS | 预检请求 | 检查服务器支持的HTTP方法 |
| CONNECT | 建立隧道 | 用于HTTPS连接 |

---

## 3. HTTP 请求报文

### 请求行

| 属性 | 说明 |
| :- | :- |
| **格式** | `方法 路径 协议版本` |
| **示例** | `GET /api/province HTTP/1.1` |

### 请求头

| 属性 | 说明 |
| :- | :- |
| **作用** | 描述客户端的请求信息 |
| **常见请求头** | `Host`、`User-Agent`、`Content-Type`、`Content-Length`、`Authorization`、`Accept` |

### 请求体

| 属性 | 说明 |
| :- | :- |
| **作用** | 携带请求数据 |
| **常见格式** | `application/json`（JSON格式）、`application/x-www-form-urlencoded`（表单格式）、`multipart/form-data`（文件上传格式） |

### 示例

```http
POST /api/login HTTP/1.1
Host: example.com
Content-Type: application/json
Content-Length: 42

{"username": "admin", "password": "123456"}
```

---

## 4. HTTP 响应报文与状态码

### 状态行

| 属性 | 说明 |
| :- | :- |
| **格式** | `协议版本 状态码 状态文本` |
| **示例** | `HTTP/1.1 200 OK` |

### 响应头

| 属性 | 说明 |
| :- | :- |
| **作用** | 描述服务器的响应信息 |
| **常见响应头** | `Content-Type`、`Content-Length`、`Date`、`Server`、`Set-Cookie` |

### 响应体

| 属性 | 说明 |
| :- | :- |
| **作用** | 携带响应数据 |
| **常见格式** | `application/json`（JSON格式）、`text/html`（HTML格式）、`text/plain`（纯文本格式） |

### 状态码

| 状态码 | 描述 | 常见场景 |
|--------|------|----------|
| 200 | OK | 请求成功 |
| 201 | Created | 创建成功 |
| 204 | No Content | 无内容 |
| 301 | Moved Permanently | 永久重定向 |
| 302 | Found | 临时重定向 |
| 400 | Bad Request | 请求错误 |
| 401 | Unauthorized | 未授权 |
| 403 | Forbidden | 禁止访问 |
| 404 | Not Found | 资源不存在 |
| 500 | Internal Server Error | 服务器内部错误 |
| 502 | Bad Gateway | 网关错误 |
| 503 | Service Unavailable | 服务不可用 |

### 示例

```http
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 36
Date: Fri, 25 Apr 2026 00:00:00 GMT

{"code": 200, "message": "success", "data": []}
```