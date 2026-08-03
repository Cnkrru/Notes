---
title: "Python beautifulsoup4包"

description: "Python beautifulsoup4包常用函数参考，包括HTML解析、标签查找、内容提取等功能。"

date: "2026-04-21"

tags: [Python, beautifulsoup4, 爬虫, HTML解析]

sidebar: auto

---


# Python beautifulsoup4包常用函数参考

| 函数名 | 必选参数 | 作用 |
|-------|---------|------|
| `BeautifulSoup(markup, features)` | markup: HTML/XML字符串, features: 解析器 | 创建BeautifulSoup对象 |
| `soup.find(name[, attrs, recursive, string, **kwargs])` | name: 标签名 | 查找第一个匹配的标签 |
| `soup.find_all(name[, attrs, recursive, string, limit, **kwargs])` | name: 标签名 | 查找所有匹配的标签 |
| `soup.select(selector)` | selector: CSS选择器 | 使用CSS选择器查找元素 |
| `soup.select_one(selector)` | selector: CSS选择器 | 使用CSS选择器查找第一个元素 |
| `soup.get_text([separator, strip, types])` | 无 | 获取所有文本内容 |
| `tag.name` | 无 | 获取标签名 |
| `tag.attrs` | 无 | 获取标签属性 |
| `tag['attribute']` | attribute: 属性名 | 获取标签的指定属性 |
| `tag.get(attribute[, default])` | attribute: 属性名 | 获取标签的指定属性（带默认值） |
| `tag.string` | 无 | 获取标签的文本内容 |
| `tag.strings` | 无 | 获取标签及其子标签的文本内容 |
| `tag.stripped_strings` | 无 | 获取标签及其子标签的文本内容（去除空白） |
| `tag.contents` | 无 | 获取标签的直接子节点 |
| `tag.children` | 无 | 获取标签的直接子节点（迭代器） |
| `tag.descendants` | 无 | 获取标签的所有后代节点（迭代器） |
| `tag.parent` | 无 | 获取标签的父节点 |
| `tag.parents` | 无 | 获取标签的所有父节点（迭代器） |
| `tag.previous_sibling` | 无 | 获取标签的前一个兄弟节点 |
| `tag.next_sibling` | 无 | 获取标签的后一个兄弟节点 |
| `tag.extract()` | 无 | 从文档中移除标签 |
| `tag.decompose()` | 无 | 从文档中移除标签及其内容 |
| `tag.replace_with(replacement)` | replacement: 替换内容 | 替换标签 |
| `tag.wrap(wrapper)` | wrapper: 包装标签 | 用指定标签包装当前标签 |
| `tag.unwrap()` | 无 | 移除标签，保留其内容 |

## 常用参数说明

### 核心参数
| 参数名 | 类型 | 作用 |
|-------|------|------|
| `markup` | str | HTML或XML字符串 |
| `features` | str | 解析器，如'html.parser', 'lxml', 'html5lib' |
| `name` | str | 标签名，如'div', 'a'等 |
| `attrs` | dict | 标签属性，如{'class': 'container'} |
| `string` | str | 标签文本内容 |
| `limit` | int | 限制返回结果数量 |
| `selector` | str | CSS选择器，如'div.class' |
| `attribute` | str | 标签属性名 |
| `default` | any | 属性不存在时的默认值 |
| `replacement` | Tag/str | 替换标签的内容 |
| `wrapper` | Tag | 用于包装的标签 |

### 解析器选择
| 解析器           | 优势          | 劣势         |
| ------------- | ----------- | ---------- |
| `html.parser` | 内置，无需额外安装   | 速度较慢，容错性一般 |
| `lxml`        | 速度快，容错性好    | 需要额外安装     |
| `html5lib`    | 最接近浏览器的解析方式 | 速度慢        |