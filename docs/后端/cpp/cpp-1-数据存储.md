# C++

---

## 1. 基本数据类型

| 类型 | 描述 | 大小 | 取值范围 | 示例 |
| :- | :- | :- | :- | :- |
| **bool** | 布尔型 | 1字节 | true / false | `bool flag = true;` |
| **char** | 字符型 | 1字节 | -128 到 127 | `char c = 'A';` |
| **int** | 整型 | 4字节 | -2147483648 到 2147483647 | `int i = 100;` |
| **float** | 单精度浮点型 | 4字节 | ±3.4e-38 到 ±3.4e+38 | `float f = 3.14f;` |
| **double** | 双精度浮点型 | 8字节 | ±1.7e-308 到 ±1.7e+308 | `double d = 3.14;` |
| **auto** | 自动类型推导 | 取决于推导 | — | `auto x = 42;` // int |
| **decltype** | 声明类型 | 取决于推导 | — | `decltype(x) y = x;` |

---

## 2. 复合类型

| 类型 | 描述 | 语法 | 示例 |
| :- | :- | :- | :- |
| **数组** | 相同类型元素的集合 | `类型 数组名[大小]` | `int arr[5] = {1, 2, 3, 4, 5};` |
| **结构体** | 不同类型元素的集合 | `struct 名 { 成员 };` | `struct Point { int x; int y; };` |
| **联合体** | 共用内存的不同类型 | `union 名 { 成员 };` | `union Data { int i; float f; };` |
| **枚举** | 命名的整型常量 | `enum 名 { 常量 };` | `enum Color { RED, GREEN, BLUE };` |
| **枚举类** | 强类型枚举（C++11） | `enum class 名 { 常量 };` | `enum class Color { RED, GREEN };` |
| **类** | 面向对象封装 | `class 名 { 成员 };` | `class Student { ... };` |

---

## 3. 标准库容器

| 容器 | 头文件 | 描述 | 示例 |
| :- | :- | :- | :- |
| **string** | `<string>` | 字符串 | `string s = "hello";` |
| **vector** | `<vector>` | 动态数组 | `vector<int> v = {1, 2, 3};` |
| **map** | `<map>` | 键值对映射 | `map<string,int> m; m["a"] = 1;` |
| **unordered_map** | `<unordered_map>` | 哈希表 | `unordered_map<string,int> um;` |
| **set** | `<set>` | 有序集合 | `set<int> s = {3, 1, 2};` |

---

## 4. 类型转换

```cpp
// C++ 风格转换
static_cast<int>(3.14)           // 编译时类型转换
dynamic_cast<Derived*>(base)     // 运行时安全检查（多态）
const_cast<const T*>(ptr)        // 添加/移除 const
reinterpret_cast<int*>(addr)     // 底层位模式转换

// 列表初始化（C++11 起推荐）
int a{42};
vector<int> v{1, 2, 3};
```