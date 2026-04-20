---
title: "C 语言 IO 与流程控制"
description: "C 语言输入输出函数与流程控制语句相关知识。"
date: 2026-04-21
tags: [C语言, IO, 流程控制]
sidebar: auto
---

# 后端

# C语言IO与流程控制

## 1. 输入输出函数

- **printf()**：输出格式化数据到标准输出
  - 语法格式：`int printf(const char *format, ...);`
  - 示例：`printf("Hello, %s!\n", name);`

- **scanf()**：从标准输入读取格式化数据
  - 语法格式：`int scanf(const char *format, ...);`
  - 示例：`scanf("%d", &num);`

- **getchar()**：从标准输入读取单个字符
  - 语法格式：`int getchar(void);`
  - 示例：`char c = getchar();`

- **putchar()**：输出单个字符到标准输出
  - 语法格式：`int putchar(int c);`
  - 示例：`putchar('A');`

- **fgets()**：从流中读取字符串
  - 语法格式：`char *fgets(char *s, int size, FILE *stream);`
  - 示例：`fgets(buffer, 100, stdin);`

- **fputs()**：向流中写入字符串
  - 语法格式：`int fputs(const char *s, FILE *stream);`
  - 示例：`fputs("Hello", stdout);`

======================================================

## 2. 流程控制语句

- **if**：条件判断
  - 语法格式：`if (条件) { 语句块 }`
  - 示例：`if (x > 0) { printf("Positive\n"); }`

- **if-else**：条件判断与分支
  - 语法格式：`if (条件) { 语句块1 } else { 语句块2 }`
  - 示例：`if (x > 0) { printf("Positive\n"); } else { printf("Non-positive\n"); }`

- **if-else if-else**：多条件判断
  - 语法格式：`if (条件1) { 语句块1 } else if (条件2) { 语句块2 } else { 语句块3 }`
  - 示例：`if (x > 0) { printf("Positive\n"); } else if (x < 0) { printf("Negative\n"); } else { printf("Zero\n"); }`

- **switch**：多分支选择
  - 语法格式：`switch (表达式) { case 值1: 语句块1; break; case 值2: 语句块2; break; ... default: 语句块n; }`
  - 示例：`switch (grade) { case 'A': printf("Excellent\n"); break; case 'B': printf("Good\n"); break; default: printf("Pass\n"); }`

- **while**：当条件为真时循环
  - 语法格式：`while (条件) { 循环体 }`
  - 示例：`while (i < 10) { printf("%d\n", i); i++; }`

- **do-while**：先执行一次循环体，再判断条件
  - 语法格式：`do { 循环体 } while (条件);`
  - 示例：`do { printf("%d\n", i); i++; } while (i < 10);`

- **for**：初始化、条件、更新的循环
  - 语法格式：`for (初始化; 条件; 更新) { 循环体 }`
  - 示例：`for (int i = 0; i < 10; i++) { printf("%d\n", i); }`

- **break**：跳出当前循环或switch
  - 语法格式：`break;`
  - 示例：`for (int i = 0; i < 10; i++) { if (i == 5) break; printf("%d\n", i); }`

- **continue**：跳过本次循环，进入下一次循环
  - 语法格式：`continue;`
  - 示例：`for (int i = 0; i < 10; i++) { if (i % 2 == 0) continue; printf("%d\n", i); }`

- **return**：从函数返回值
  - 语法格式：`return 表达式;`
  - 示例：`int add(int a, int b) { return a + b; }`

- **goto**：无条件跳转到指定标签
  - 语法格式：`goto 标签;`
  - 示例：`goto end; ... end: printf("End\n");`