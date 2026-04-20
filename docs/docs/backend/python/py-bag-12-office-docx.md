---
title: "Python docx包"
description: "Python docx包相关知识。"
date: 2026-04-21
tags: [Python, docx]
sidebar: auto
---



## 写入操作

| 分类 | 函数名 | 必选参数 | 作用 |
| ---- | ------ | -------- | ---- |
| 文档操作 | `Document([docx])` | docx: 文档路径(可选) | 创建或加载Word文档 |
|  | `document.save(path_or_stream)` | path_or_stream: 保存路径 | 保存文档 |
| 内容添加 | `document.add_heading(text, level=1)` | text: 标题文本 | 添加标题 |
|  | `document.add_paragraph(text[, style])` | text: 段落文本 | 添加段落 |
|  | `paragraph.add_run(text[, style])` | text: 文本内容 | 向段落添加文本 |
|  | `document.add_page_break()` | 无 | 添加分页符 |
|  | `document.add_picture(image_path[, width, height])` | image_path: 图片路径 | 添加图片 |
|  | `document.add_table(rows, cols[, style])` | rows: 行数, cols: 列数 | 添加表格 |
| 文本格式设置 | `run.bold = True/False` | 无 | 设置文本粗体 |
|  | `run.italic = True/False` | 无 | 设置文本斜体 |
|  | `run.underline = True/False` | 无 | 设置文本下划线 |
|  | `run.font.size = Pt(value)` | value: 字体大小 | 设置字体大小 |
| 表格操作 | `table.cell(row, col)` | row: 行索引, col: 列索引 | 获取表格单元格 |
|  | `cell.text = text` | text: 单元格文本 | 设置单元格文本 |
|  | `cell.merge(other_cell)` | other_cell: 目标单元格 | 合并单元格 |

## 读取操作

| 分类 | 函数名 | 必选参数 | 作用 |
| ---- | ------ | -------- | ---- |
| 文档结构 | `Document(docx)` | docx: 文档路径 | 加载Word文档 |
|  | `document.sections` | 无 | 获取文档所有节 |
| 文本内容 | `document.paragraphs` | 无 | 获取所有段落 |
|  | `paragraph.text` | 无 | 获取段落文本 |
| 表格内容 | `document.tables` | 无 | 获取所有表格 |
|  | `table.rows` | 无 | 获取表格所有行 |
|  | `table.columns` | 无 | 获取表格所有列 |
|  | `row.cells` | 无 | 获取行的所有单元格 |
|  | `cell.text` | 无 | 获取单元格文本 |

## 写入操作步骤

1. 创建文档
  - 使用 `Document()`
  ```python
  from docx import Document
  doc = Document()
  ```
2. 添加标题
  - 使用 `doc.add_heading(text, level)`
  ```python
  doc.add_heading('文档标题', level=0)
  doc.add_heading('一级标题', level=1)
  ```
3. 添加段落
  - 使用 `doc.add_paragraph(text)`
  ```python
  paragraph = doc.add_paragraph('这是一个段落。')
  ```
3. 添加带格式的文本
  - 使用 `paragraph.add_run(text)`
  ```python
  run = paragraph.add_run(' 这是粗体文本。')
  run.bold = True
  
  run = paragraph.add_run(' 这是斜体文本。')
  run.italic = True
  ```
3. 添加表格
  - 使用 `doc.add_table(rows, cols)`
  ```python
  table = doc.add_table(rows=1, cols=3)
  hdr_cells = table.rows[0].cells
  hdr_cells[0].text = '姓名'
  hdr_cells[1].text = '年龄'
  hdr_cells[2].text = '性别'
  
  # 添加数据行
  row_cells = table.add_row().cells
  row_cells[0].text = '张三'
  row_cells[1].text = '18'
  row_cells[2].text = '男'
  ```
4. 保存文档
  - 使用 `doc.save('文件路径')`
  ```python
  doc.save('example.docx')
  ```

## 读取操作步骤

1. 加载文档
  - 使用 `Document('文件路径')`
  ```python
  from docx import Document
  doc = Document('example.docx')
  ```
2. 读取段落
  - 使用 `doc.paragraphs`
  ```python
  for i, paragraph in enumerate(doc.paragraphs):
      print(f"段落 {i+1}: {paragraph.text}")
  ```
2. 读取表格
  - 使用 `doc.tables`
  ```python
  for i, table in enumerate(doc.tables):
      print(f"表格 {i+1}:")
      for row in table.rows:
          row_data = [cell.text for cell in row.cells]
          print(row_data)
  ```
3. 读取文档结构
  - 使用 `doc.sections`
  ```python
  print(f"文档节数: {len(doc.sections)}")
  ```