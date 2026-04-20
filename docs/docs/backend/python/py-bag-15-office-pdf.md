---
title: "Python pdfplumber包"
description: "Python pdfplumber包相关知识。"
date: 2026-04-21
tags: [Python, pdfplumber]
sidebar: auto
---


| 分类   | 函数名                                                   | 必选参数                  | 作用          |
| ---- | ----------------------------------------------------- | --------------------- | ----------- |
| 文档操作 | `pdfplumber.open(path_or_fp)`                         | path_or_fp: 文件路径或文件对象 | 打开PDF文件     |
|      | `pdf.pages`                                           | 无                     | 获取PDF所有页面   |
|      | `pdf.pages[i]`                                        | i: 页面索引               | 获取指定页面      |
| 内容提取 | `page.extract_text([x_tolerance, y_tolerance, ...])`  | 无                     | 提取页面文本      |
|      | `page.extract_words([x_tolerance, y_tolerance, ...])` | 无                     | 提取页面单词      |
|      | `page.extract_tables([table_settings])`               | 无                     | 提取页面表格      |
| 页面操作 | `page.crop(bbox)`                                     | bbox: 边界框             | 裁剪页面区域      |
|      | `page.within_bbox(bbox)`                              | bbox: 边界框             | 获取指定边界框内的内容 |
|      | `page.search(text)`                                   | text: 搜索文本            | 搜索页面中的文本    |
| 图像操作 | `page.to_image([resolution])`                         | 无                     | 转换页面为图像对象   |
|      | `image.save(filename)`                                | filename: 保存路径        | 保存图像        |

### extract_text/extract_words参数
| 参数名 | 类型 | 作用 |
|-------|------|------|
| `x_tolerance` | float | 水平方向文本合并 tolerance |
| `y_tolerance` | float | 垂直方向文本合并 tolerance |
| `keep_blank_chars` | bool | 是否保留空白字符 |
| `use_text_flow` | bool | 是否使用文本流分析 |

### extract_tables参数
| 参数名 | 类型 | 作用 |
|-------|------|------|
| `table_settings` | dict | 表格提取设置 |
| `vertical_strategy` | str | 垂直分割策略 |
| `horizontal_strategy` | str | 水平分割策略 |
| `snap_tolerance` | float | 线条对齐 tolerance |
| `join_tolerance` | float | 线条连接 tolerance |

### to_image参数
| 参数名          | 类型  | 作用    |
| ------------ | --- | ----- |
| `resolution` | int | 图像分辨率 |

## 操作步骤

### 1. 读取PDF文件
- 打开PDF文件
  - 使用 `pdfplumber.open()`
  ```python
  import pdfplumber
  with pdfplumber.open('example.pdf') as pdf:
      # 操作PDF文件
  ```

### 2. 提取文本
- 提取整个页面的文本
  ```python
  with pdfplumber.open('example.pdf') as pdf:
      # 获取第一页
      page = pdf.pages[0]
      # 提取文本
      text = page.extract_text()
      print(text)
  ```

### 3. 提取表格
- 提取页面中的表格
  ```python
  with pdfplumber.open('example.pdf') as pdf:
      # 获取第一页
      page = pdf.pages[0]
      # 提取表格
      tables = page.extract_tables()
      # 处理表格数据
      for table in tables:
          for row in table:
              print(row)
  ```

### 4. 搜索文本
- 在页面中搜索特定文本
  ```python
  with pdfplumber.open('example.pdf') as pdf:
      # 获取第一页
      page = pdf.pages[0]
      # 搜索文本
      results = page.search('关键词')
      print(f"找到 {len(results)} 个匹配")
  ```

### 5. 页面裁剪
- 裁剪页面的特定区域
  ```python
  with pdfplumber.open('example.pdf') as pdf:
      # 获取第一页
      page = pdf.pages[0]
      # 裁剪区域 (x0, top, x1, bottom)
      bbox = (100, 100, 500, 500)
      cropped_page = page.crop(bbox)
      # 提取裁剪区域的文本
      text = cropped_page.extract_text()
      print(text)
  ```

### 6. 转换为图像
- 将页面转换为图像并保存
  ```python
  with pdfplumber.open('example.pdf') as pdf:
      # 获取第一页
      page = pdf.pages[0]
      # 转换为图像
      image = page.to_image(resolution=150)
      # 保存图像
      image.save('page_1.png')
  ```

