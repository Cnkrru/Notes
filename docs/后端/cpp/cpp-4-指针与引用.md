# C++

---

## 1. 指针

```cpp
int a = 42;
int* p = &a;           // 指针声明 & 取地址
cout << *p;            // 解引用 → 42
*p = 100;              // 通过指针修改
cout << a;             // 100

int* q = nullptr;      // 空指针（C++11，推荐替代 NULL）
```

### 指针运算

```cpp
int arr[3] = {10, 20, 30};
int* p = arr;
p++;                   // 指向下一个元素
cout << *p;            // 20
```

---

## 2. 引用（C++ 特有）

引用是变量的别名，声明时必须初始化，不能重新绑定。

```cpp
int a = 42;
int& ref = a;           // ref 是 a 的引用
ref = 100;              // 修改 ref 等价于修改 a
cout << a;              // 100
```

| 特性 | 指针 | 引用 |
| :- | :- | :- |
| 初始化 | 可以不初始化，可重新赋值 | 必须初始化，不可重新绑定 |
| 空值 | 可为 `nullptr` | 不能为空 |
| 语法 | 需要 `*` 解引用 | 直接使用 |
| 适用 | 动态分配、数组、可选值 | 函数参数传递、操作符重载 |

---

## 3. 引用与参数传递

```cpp
// 引用传参（修改原值）
void swap(int& a, int& b) {
    int tmp = a; a = b; b = tmp;
}

// const 引用传参（只读，不拷贝，高效）
void print(const vector<int>& v) {
    for (int x : v) cout << x;
}

// 返回引用（避免拷贝）
const string& getTitle(const Document& doc) {
    return doc.title;
}
```

---

## 4. 智能指针（C++11）

自动管理内存，避免手动 `new/delete`。

```cpp
#include <memory>

// unique_ptr — 独占所有权
unique_ptr<int> p = make_unique<int>(42);
// 不能拷贝，只能移动

// shared_ptr — 共享所有权（引用计数）
shared_ptr<int> p1 = make_shared<int>(42);
shared_ptr<int> p2 = p1;        // 引用计数 +1
// 最后一个 shared_ptr 析构时自动释放

// weak_ptr — 弱引用，避免循环引用
weak_ptr<int> wp = p1;          // 不影响引用计数
if (auto sp = wp.lock()) {      // 提升为 shared_ptr
    cout << *sp;
}
```

### 对比

| 类型 | 所有权 | 开销 | 适用场景 |
| :- | :- | :- | :- |
| 裸指针 | 无 | 无 | 非拥有关系、观察者 |
| `unique_ptr` | 独占 | 无额外开销 | 资源独占 |
| `shared_ptr` | 共享 | 引用计数（原子操作） | 多对象共享资源 |
| `weak_ptr` | 弱引用 | 少量 | 打破循环引用、缓存 |