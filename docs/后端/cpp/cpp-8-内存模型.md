# C++

---

## 1. 内存分区

| 区域 | 存放内容 | 特点 | 管理方式 |
| :- | :- | :- | :- |
| **代码区** | 程序代码 | 只读、共享 | 系统管理 |
| **全局区** | 全局变量、静态变量、常量 | 程序启动分配，结束释放 | 系统管理 |
| **栈区** | 局部变量、函数参数 | 自动分配释放，大小有限（通常 ~8MB） | 编译器管理 |
| **堆区** | 动态分配的内存 | 需手动管理，大内存分配 | 程序员管理 |

---

## 2. 动态内存分配

### new / delete（C++ 风格）

```cpp
// 单个对象
int* p = new int(42);                  // 分配并初始化
delete p;                              // 释放

// 数组
int* arr = new int[10];                // 分配数组
delete[] arr;                          // 释放数组（必须用 []）

// 对象
string* sp = new string("hello");
delete sp;                             // 先调用析构函数，再释放内存
```

### malloc / free（C 风格兼容）

```cpp
int* p = (int*)malloc(sizeof(int) * 10);
free(p);
```

### new 与 malloc 的区别

| 特性 | `new` | `malloc` |
| :- | :- | :- |
| 类型 | 运算符 | 函数 |
| 返回类型 | 类型安全 | `void*` |
| 调用构造函数 | 是 | 否 |
| 调用析构函数 | `delete` 是 | `free` 否 |
| 失败行为 | 抛出 `std::bad_alloc` | 返回 `NULL` |

---

## 3. RAII（资源获取即初始化）

C++ 核心思想：资源在构造函数中获取，在析构函数中释放。

```cpp
class File {
    FILE* fp;
public:
    File(const char* name) { fp = fopen(name, "r"); }
    ~File() { if (fp) fclose(fp); }     // 自动释放
    void read() { ... }
};

void func() {
    File f("data.txt");                  // 构造函数打开文件
    f.read();
}                                        // 析构函数自动关闭文件
```

---

## 4. 智能指针（C++11）

优先使用智能指针，避免手动 `new/delete`。

```cpp
#include <memory>

// unique_ptr — 独占所有权，零开销
auto p = make_unique<int>(42);

// shared_ptr — 共享所有权，引用计数
auto p1 = make_shared<MyClass>();
auto p2 = p1;                           // 引用计数 +1

// weak_ptr — 弱引用，避免循环引用
weak_ptr<MyClass> wp = p1;
```

---

## 5. 移动语义（C++11）

```cpp
vector<int> createVec() {
    vector<int> v(1000000);
    return v;                            // 移动而非拷贝（C++11）
}

vector<int> v1 = {1, 2, 3};
vector<int> v2 = move(v1);               // 显式移动，v1 变为空
```

| 语义 | 行为 | 开销 |
| :- | :- | :- |
| 拷贝 | 复制数据 | O(n) |
| 移动 | 转移所有权，原对象置空 | O(1) |

---

## 6. 内存泄漏预防

```cpp
// 坏：裸指针手动管理，可能遗漏 delete
int* p = new int(42);
// ... 如果中间抛出异常，delete 不会执行
delete p;

// 好：智能指针自动管理
auto p = make_unique<int>(42);
// 无论怎样退出作用域，都会自动释放

// 好：RAII 容器
vector<int> v(1000);                     // 自动管理堆内存
```