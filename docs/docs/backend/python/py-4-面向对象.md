---
title: "Python 面向对象编程"

description: "Python 是一种高级编程语言，用于开发各种应用程序。"

date: "2026-04-21"

tags: [标签, 标签2]

sidebar: auto

---


# 后端
# Python基础
## 1.对象基础

### 1.1 概念
- **面向对象编程**：一种编程范式，通过类和对象来组织代码
- **类**：对象的模板，定义了对象的属性和方法
- **对象**：类的实例，具有类定义的属性和方法

## 2. 成员变量

### 2.1 定义方式
- **使用 `__init__` 方法定义**：初始化对象时自动设置属性
- **直接定义**：在类中直接定义类变量

### 2.2 使用 `__init__` 方法定义

#### 定义
```python
class ClassName:
    def __init__(self, id1, id2, id3):
        self.id1 = id1
        self.id2 = id2
        self.id3 = id3
```

#### 调用
```python
obj = ClassName(value1, value2, value3)
```

### 2.3 直接定义（不使用 `init`）

#### 定义
```python
class ClassName:
    id1 = value1
    id2 = value2
```

#### 赋值
```python
obj = ClassName()
obj.id1 = real_value1
obj.id2 = real_value2
```

## 3. 成员方法

### 3.1 定义
```python
def method_name(self, param1, param2):
    # 方法体
```

### 3.2 数据访问
- **变量**：`self.id`
- **形参**：方法定义时的参数

### 3.3 方法调用
```python
obj.method_name(parameter1, parameter2)
```

### 3.4 魔术方法

#### 3.4.1 `__str__`
```python
def __str__(self):
    return f"内容"
```
- **功能**：负责输出字符串
- **说明**：不使用该方法，会导致输出的是内存地址

#### 3.4.2 `__lt__`
```python
def __lt__(self, other):
    return self.id < other.id
```
- **功能**：负责比较操作 > / <

#### 3.4.3 `__le__`
```python
def __le__(self, other):
    return self.id <= other.id
```
- **功能**：负责比较操作 ≥ / ≤

#### 3.4.4 `__eq__`
```python
def __eq__(self, other):
    return self.id == other.id
```
- **功能**：负责比较操作 ==

## 4. 封装

### 4.1 私有属性和方法
- **定义**：在原变量/函数前增加 `__` 即可
- **特点**：
  - 相当于该类的局部变量/局部函数
  - 只能让当前类使用，其他类使用不了

## 5. 继承

### 5.1 直接继承
```python
class ChildClass(ParentClass1, ParentClass2):
    # 新类的内容
    pass
```

### 5.2 复写
- **方法**：直接在子类里重新写一遍就行(之后调用会优先调用复写的)
- **调用父类原代码**：
  ```python
  ParentClass.attribute
  ParentClass.method()
  ```

## 6. 多态

### 6.1 实现步骤
1. **先写一个父类模板**
2. **再写n个子类**
3. **给类赋值调用即可**

### 6.2 示例代码

#### 父类：
```python
class ParentClass():
    def action1(self):
        pass
    def action2(self):
        pass
```

#### 子类：
```python
class ChildClass1(ParentClass):
    def action1(self):
        # 函数体
        pass
    def action2(self):
        # 函数体
        pass

class ChildClass2(ParentClass):
    def action1(self):
        # 函数体
        pass
    def action2(self):
        # 函数体
        pass
```

#### 赋值调用
```python
# 1. 定义函数
def function_name(param: ParentClass):
    param.action1()
    param.action2()

# 2. 赋值子类
obj1 = ChildClass1()
obj2 = ChildClass2()

# 3. 调用
function_name(obj1)
function_name(obj2)
```