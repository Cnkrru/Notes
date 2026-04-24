---
title: "Python math包"

description: "Python math包相关知识。"

date: "2026-04-21"

tags: [Python, math]

sidebar: auto

---


## Py-Math

## 1. 模块介绍

- **math包**提供了数学运算相关的函数和常量
- **适用场景**：科学计算、数据分析、工程计算等

---

## 2. 常用函数

### 2.1 基本运算
| 作用          | 函数名                   | 参数                  |
| ----------- | --------------------- | ------------------- |
| 平方根         | `math.sqrt(x)`        | x: 非负数              |
| 幂运算         | `math.pow(x, y)`      | x: 底数, y: 指数        |
| 绝对值         | `math.fabs(x)`        | x: 任意实数             |
| 阶乘          | `math.factorial(x)`   | x: 非负整数             |
| 最大公约数       | `math.gcd(a, b)`      | a, b: 非负整数          |
| 最小公倍数       | `math.lcm(a, b)`      | a, b: 正整数           |
| 分解小数和整数部分   | `math.modf(x)`        | x: 任意实数             |

### 2.2 对数运算
| 作用          | 函数名                   | 参数                  |
| ----------- | --------------------- | ------------------- |
| 指数函数(e^x)   | `math.exp(x)`         | x: 指数               |
| 对数          | `math.log(x[, base])` | x: 正数, base: 底数(可选) |
| 常用对数(log10) | `math.log10(x)`       | x: 正数               |
| 以2为底的对数     | `math.log2(x)`        | x: 正数               |

### 2.3 三角函数
| 作用          | 函数名                   | 参数                  |
| ----------- | --------------------- | ------------------- |
| 正弦          | `math.sin(x)`         | x: 弧度值              |
| 余弦          | `math.cos(x)`         | x: 弧度值              |
| 正切          | `math.tan(x)`         | x: 弧度值              |
| 反正弦         | `math.asin(x)`        | x: [-1, 1]之间的数     |
| 反余弦         | `math.acos(x)`        | x: [-1, 1]之间的数     |
| 反正切         | `math.atan(x)`        | x: 任意实数             |
| 象限反正切       | `math.atan2(y, x)`    | y: 分子, x: 分母        |
| 弧度转角度       | `math.degrees(x)`     | x: 弧度值              |
| 角度转弧度       | `math.radians(x)`     | x: 角度值              |

### 2.4 取整函数
| 作用          | 函数名                   | 参数                  |
| ----------- | --------------------- | ------------------- |
| 向上取整        | `math.ceil(x)`        | x: 任意实数             |
| 向下取整        | `math.floor(x)`       | x: 任意实数             |
| 向零取整        | `math.trunc(x)`       | x: 任意实数             |

### 2.5 数值判断
| 作用          | 函数名                   | 参数                  |
| ----------- | --------------------- | ------------------- |
| 判断有限数       | `math.isfinite(x)`    | x: 任意实数             |
| 判断无穷大       | `math.isinf(x)`       | x: 任意实数             |
| 判断NaN       | `math.isnan(x)`       | x: 任意实数             |

### 2.6 数学常量
| 作用          | 常量名                 | 说明                  |
| ----------- | --------------------- | ------------------- |
| 圆周率π        | `math.pi`             | 约等于3.1415926535     |
| 自然对数底e      | `math.e`              | 约等于2.7182818284     |
| 2π          | `math.tau`            | 约等于6.2831853071     |
| 正无穷大        | `math.inf`            | 表示正无穷大            |
| 非数字         | `math.nan`            | 表示非数字             |

---

## 3. 使用示例

### 3.1 基本运算
```python
import math

# 平方根
print(math.sqrt(16))  # 输出: 4.0

# 幂运算
print(math.pow(2, 3))  # 输出: 8.0

# 绝对值
print(math.fabs(-3.14))  # 输出: 3.14

# 阶乘
print(math.factorial(5))  # 输出: 120

# 最大公约数
print(math.gcd(12, 18))  # 输出: 6

# 最小公倍数
print(math.lcm(4, 6))  # 输出: 12
```

### 3.2 对数运算
```python
import math

# 指数函数
print(math.exp(1))  # 输出: 2.718281828459045

# 对数
print(math.log(10))  # 输出: 2.302585092994046
print(math.log(100, 10))  # 输出: 2.0

# 常用对数
print(math.log10(100))  # 输出: 2.0

# 以2为底的对数
print(math.log2(8))  # 输出: 3.0
```

### 3.3 三角函数
```python
import math

# 弧度值
angle = math.radians(45)  # 45度转弧度

# 正弦
print(math.sin(angle))  # 输出: 0.7071067811865475

# 余弦
print(math.cos(angle))  # 输出: 0.7071067811865476

# 正切
print(math.tan(angle))  # 输出: 0.9999999999999999

# 角度转弧度
print(math.degrees(math.pi))  # 输出: 180.0
```

### 3.4 取整函数
```python
import math

# 向上取整
print(math.ceil(3.14))  # 输出: 4

# 向下取整
print(math.floor(3.99))  # 输出: 3

# 向零取整
print(math.trunc(-3.99))  # 输出: -3
```