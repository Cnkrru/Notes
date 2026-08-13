# C++

---

## 1. 输入输出（C++ 风格）

### 标准输出

```cpp
#include <iostream>
using namespace std;

cout << "Hello, world!" << endl;
int x = 42;
cout << "x = " << x << endl;   // 链式输出
```

### 标准输入

```cpp
int age;
string name;
cin >> age;                    // 读取整数
cin >> name;                   // 读取字符串（遇空格停止）
getline(cin, name);            // 读取一行（含空格）
```

### 格式化输出

```cpp
#include <iomanip>

cout << fixed << setprecision(2) << 3.14159;     // 3.14
cout << setw(8) << setfill('0') << 42;            // 00000042
cout << hex << 255 << " " << dec << 255;         // ff 255
```

---

## 2. 流程控制

### 条件语句

```cpp
if (条件) { ... }
else if (条件) { ... }
else { ... }
```

### switch 语句

```cpp
switch (表达式) {
    case 值1: ...; break;
    case 值2: ...; break;
    default: ...;
}
```

### 循环语句

```cpp
for (int i = 0; i < 10; i++) { ... }             // 传统 for
while (条件) { ... }                              // while
do { ... } while (条件);                          // do-while

// 范围 for（C++11）
vector<int> v = {1, 2, 3};
for (int x : v) { cout << x; }                   // 值拷贝
for (int& x : v) { x *= 2; }                     // 引用修改
for (const auto& x : v) { ... }                  // 只读引用（推荐）
```