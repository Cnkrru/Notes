---
title: "Python requests包"

description: "Python requests包常用函数参考，包括HTTP请求发送、响应处理等功能。"

date: "2026-04-21"

tags: [Python, requests, 爬虫, HTTP]

sidebar: auto

---


# Python requests包常用函数参考

- 学习爬虫前，先学习前端和HTTP

| 函数名 | 必选参数 | 作用 |
|-------|---------|------|
| `requests.get(url[, params, headers, ...])` | url: 请求URL | 发送GET请求 |
| `requests.post(url[, data, json, headers, ...])` | url: 请求URL | 发送POST请求 |
| `requests.put(url[, data, headers, ...])` | url: 请求URL | 发送PUT请求 |
| `requests.delete(url[, headers, ...])` | url: 请求URL | 发送DELETE请求 |
| `requests.head(url[, headers, ...])` | url: 请求URL | 发送HEAD请求 |
| `requests.patch(url[, data, headers, ...])` | url: 请求URL | 发送PATCH请求 |
| `requests.request(method, url[, **kwargs])` | method: 请求方法, url: 请求URL | 发送指定方法的请求 |
| `requests.Session()` | 无 | 创建会话对象 |
| `session.get(url[, **kwargs])` | url: 请求URL | 通过会话发送GET请求 |
| `session.post(url[, **kwargs])` | url: 请求URL | 通过会话发送POST请求 |
| `response.status_code` | 无 | 获取响应状态码 |
| `response.text` | 无 | 获取响应文本 |
| `response.content` | 无 | 获取响应内容（字节形式） |
| `response.json()` | 无 | 解析JSON响应 |
| `response.headers` | 无 | 获取响应头 |
| `response.cookies` | 无 | 获取响应 cookies |
| `response.url` | 无 | 获取最终请求 URL |
| `response.history` | 无 | 获取重定向历史 |

## 常用参数说明

### 核心参数
| 参数名 | 类型 | 作用 |
|-------|------|------|
| `url` | str | 请求的目标 URL |
| `method` | str | HTTP 请求方法，如 'GET', 'POST' 等 |
| `params` | dict | URL 查询参数 |
| `data` | dict/bytes/str | 请求体数据 |
| `json` | dict | JSON 格式的请求体数据 |
| `headers` | dict | 请求头信息 |
| `cookies` | dict/CookieJar | 请求 cookies |
| `files` | dict | 要上传的文件 |
| `auth` | tuple/callable | 认证信息 |
| `timeout` | float/tuple | 请求超时时间 |
| `allow_redirects` | bool | 是否允许重定向 |
| `proxies` | dict | 代理设置 |
| `verify` | bool | 是否验证 SSL 证书 |
| `stream` | bool | 是否流式下载 |

### 会话对象参数
| 参数名 | 类型 | 作用 |
|-------|------|------|
| `session.auth` | tuple/callable | 会话级认证信息 |
| `session.headers` | dict | 会话级请求头 |
| `session.cookies` | CookieJar | 会话级 cookies |
| `session.proxies` | dict | 会话级代理设置 |

### 响应对象属性
| 属性名 | 类型 | 作用 |
|-------|------|------|
| `status_code` | int | HTTP 状态码 |
| `text` | str | 响应文本内容 |
| `content` | bytes | 响应字节内容 |
| `json()` | function | 解析 JSON 响应 |
| `headers` | dict | 响应头信息 |
| `cookies` | CookieJar | 响应 cookies |
| `url` | str | 最终请求的 URL |
| `history` | list | 重定向历史 |
| `elapsed` | timedelta | 请求耗时 |
| `ok` | bool | 状态码是否在 200-400 之间 |