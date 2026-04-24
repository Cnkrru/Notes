---
title: "C 语言 IO 与流程控制"

description: "C 语言输入输出函数与流程控制语句相关知识。"

date: "2026-04-21"

tags: [C语言, IO, 流程控制]

sidebar: auto

---


# 后端

# C语言IO与流程控制

## 1. 输入输出函数
- C语言采用占位符方式实现格式化输入输出

### printf() 函数
```c
int printf(const char *format, ...);
```


### scanf() 函数
```c
int scanf(const char *format, ...);
```

---

## 2. 流程控制语句（Python中没有的）

### switch 语句
```c
switch (表达式) {
    case 值1:
        语句块1;
        break;
    case 值2:
        语句块2;
        break;
    ...
    default:
        语句块n;
}
```

### do-while 语句
```c
do {
    循环体
} while (条件);
```

### goto 语句
```c
goto 标签;
...
标签:
    语句块
```