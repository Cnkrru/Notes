# C++

---

## 1. 函数基础

```cpp
// 函数定义
int add(int a, int b) {
    return a + b;
}

// 函数声明（原型）
int add(int a, int b);

// 函数调用
int result = add(3, 4);
```

---

## 2. C++ 函数特性

### 函数重载（同名不同参）

```cpp
int max(int a, int b) { return a > b ? a : b; }
double max(double a, double b) { return a > b ? a : b; }
// 编译时根据参数类型决定调用哪个
```

### 默认参数

```cpp
void print(string msg, int times = 1, char prefix = '>') {
    for (int i = 0; i < times; i++)
        cout << prefix << msg << endl;
}
print("hello");           // >hello
print("hi", 3, '*');      // *hi 三行
```

### 内联函数

```cpp
inline int square(int x) { return x * x; }
// 建议编译器将函数体展开，减少调用开销（适合短小函数）
```

### 函数模板

```cpp
template <typename T>
T max(T a, T b) {
    return a > b ? a : b;
}
max<int>(3, 4);        // 显式指定类型
max(3.0, 4.0);          // 隐式推导
```

---

## 3. 参数传递方式

| 方式 | 语法 | 特点 | 适用场景 |
| :- | :- | :- | :- |
| **值传递** | `void f(T x)` | 拷贝副本，不影响原值 | 小对象、不需要修改 |
| **引用传递** | `void f(T& x)` | 直接操作原值，可修改 | 需要修改原值 |
| **const 引用** | `void f(const T& x)` | 不拷贝，不修改 | 大对象只读传递（推荐） |
| **右值引用** | `void f(T&& x)` | 移动语义，避免拷贝 | 临时对象、移动构造 |

```cpp
void by_value(string s) { ... }           // 拷贝
void by_ref(string& s) { s += "!"; }      // 修改原值
void by_cref(const string& s) { ... }     // 只读，不拷贝（高效）
void by_move(vector<int>&& v) { ... }     // 移动语义
```

---

## 4. Lambda 表达式（C++11）

```cpp
// 基本语法：[捕获列表](参数) -> 返回类型 { 函数体 }

auto add = [](int a, int b) -> int { return a + b; };
cout << add(3, 4);                              // 7

// 值捕获
int x = 10;
auto f1 = [x]() { return x + 1; };              // 拷贝 x

// 引用捕获
auto f2 = [&x]() { x += 1; };                   // 引用 x

// 隐式捕获
auto f3 = [=]() { ... };                        // 全部值捕获
auto f4 = [&]() { ... };                        // 全部引用捕获

// 泛型 lambda（C++14）
auto generic = [](auto a, auto b) { return a + b; };
```