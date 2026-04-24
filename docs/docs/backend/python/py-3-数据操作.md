---
title: "Python 数据操作"

description: "Python 是一种高级编程语言，用于开发各种应用程序。"

date: "2026-04-21"

tags: [标签, 标签2]

sidebar: auto

---


# 后端
# Python基础

## 1. 流程控制

### 1.1 判断结构

#### 1.1.1 基本判断
- **if 语句**：单一条件判断
- **if……else 语句**：二选一条件判断
- **if……elif……elif……else 语句**：多条件判断

### 1.2 循环结构

#### 1.2.1 while 循环
```python
while 条件:
    函数体
    break    # 终止循环
```

#### 1.2.2 for 循环
```python
for i in 数据体/range(a, b, step):
    函数体
```

### 1.3 中止语句

#### 1.3.1 break
- **功能**：中断循环，跳出本层循环，进入外层代码
- **使用场景**：当满足某个条件时，需要立即终止循环

#### 1.3.2 continue
- **功能**：中断当前迭代，返回循环开始处，继续下一次迭代
- **使用场景**：当需要跳过当前迭代，继续下一次循环时

#### 1.3.3 pass
- **功能**：空语句，用于占位
- **使用场景**：用于继承，给函数体留空，只继承变量

### 1.4 备注
- **可互相嵌套**：判断结构和循环结构可以相互嵌套
- **缩进**：4个空格决定从属关系，Python 使用缩进来表示代码块

## 2. 函数

### 2.1 变量作用域

#### 2.1.1 局部变量
- **定义**：定义在函数内部的变量
- **作用范围**：只作用于函数内部
- **生命周期**：函数执行结束后，局部变量被销毁

#### 2.1.2 全局变量
- **定义**：定义在程序头部的变量
- **作用范围**：作用于整个程序
- **生命周期**：程序运行期间一直存在

#### 2.1.3 修改全局变量
- **方法**：在函数内部使用 `global` 关键字声明变量
- **示例**：
  ```python
global variable_name
variable_name = new_value
  ```

### 2.2 函数定义与调用

#### 2.2.1 定义
```python
def function_name(parameters):
    # 函数体
    return return_value
```

#### 2.2.2 调用
```python
result = function_name(arguments)
```

#### 2.2.3 备注
- **参数数量**：不限制
- **返回值**：可以是值、变量或 None
  - 可以返回多个值（以元组形式）
  - 有返回值的函数，调用时可以用变量接收

### 2.3 函数传参方式

#### 2.3.1 固定参数
```python
def function_name(param1, param2, param3, ...):
    # 函数体
```

##### 2.3.1.1 位置传参
```python
function_name(arg1, arg2, arg3, ...)
# 参数位置与函数定义中的参数顺序一一对应
```

##### 2.3.1.2 关键字传参
```python
function_name(param3=arg3, param1=arg1, param2=arg2, ...)
# 使用键值对形式传参，参数顺序可以任意
```

##### 2.3.1.3 混合传参
```python
function_name(arg1, arg2, param3=arg3, ...)
# 前部分使用位置传参，后部分使用关键字传参
```

#### 2.3.2 不定参数

##### 2.3.2.1 可变位置参数
```python
def function_name(*args):
    # args 被视为元组
    # 接收参数不限制个数
```

##### 2.3.2.2 可变关键字参数
```python
def function_name(**kwargs):
    # kwargs 被视为字典
    # 接收参数不限制个数
    # 接收参数形式: key=value
```

#### 2.3.3 将函数作为参数
```python
def outer_function(inner_function):
    # 函数体
    result = inner_function()
    return result
```

**备注**：实际上就是函数嵌套

### 2.4 lambda 匿名函数

```python
lambda parameters: expression
```

**特点**：
- 函数体只能写一行
- 不需要使用 `return` 关键字，表达式的结果自动作为返回值
- 通常用于简单的、一次性的函数

**示例**：
```python
add = lambda x, y: x + y
result = add(3, 5)  # 结果为 8
```