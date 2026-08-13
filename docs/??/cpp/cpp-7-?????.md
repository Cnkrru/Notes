# C++

---

## 1. 基本操作

```cpp
#include <string>
using namespace std;

string s = "hello";
s += " world";                          // 拼接
cout << s.size();                       // 11（长度）
cout << s.empty();                      // false（是否为空）
```

---

## 2. 查找与截取

| 方法 | 说明 | 示例 |
| :- | :- | :- |
| `find(str)` | 查找子串，返回索引（未找到返回 `npos`） | `s.find("world")` → 6 |
| `rfind(str)` | 从右向左查找 | `s.rfind("l")` → 9 |
| `substr(pos, n)` | 截取从 pos 开始的 n 个字符 | `s.substr(6, 5)` → "world" |
| `find_first_of(chars)` | 查找任一字符首次出现 | `s.find_first_of("aeiou")` → 2 |

```cpp
string s = "hello world";
if (s.find("world") != string::npos) {
    cout << "found at " << s.find("world");  // found at 6
}
```

---

## 3. 修改操作

| 方法 | 说明 | 示例 |
| :- | :- | :- |
| `insert(pos, str)` | 在 pos 位置插入 | `s.insert(5, "xxx")` |
| `erase(pos, n)` | 删除从 pos 开始的 n 个字符 | `s.erase(5, 3)` |
| `replace(pos, n, str)` | 替换从 pos 开始的 n 个字符为 str | `s.replace(6, 5, "C++")` |
| `push_back(c)` | 末尾追加字符 | `s.push_back('!')` |
| `pop_back()` | 删除末尾字符（C++11） | `s.pop_back()` |
| `clear()` | 清空字符串 | `s.clear()` |

```cpp
string s = "I like C";
s.replace(7, 1, "C++");                // "I like C++"
s.insert(0, "Yeah, ");                 // "Yeah, I like C++"
s.erase(0, 6);                         // "I like C++"
```

---

## 4. 转换

```cpp
// 数字 ←→ 字符串
string s = to_string(3.14);            // "3.140000"
int i = stoi("42");                    // 42
double d = stod("3.14");               // 3.14
long l = stol("10000000000");          // 10000000000

// C 风格字符串
string s = "hello";
const char* cstr = s.c_str();          // 获取 C 风格字符串（只读）
char* data = s.data();                 // 获取可变缓冲区（C++17）
```

---

## 5. 字符串视图（C++17）

```cpp
#include <string_view>

string_view sv = "hello world";        // 不拷贝，只读引用
string_view part = sv.substr(0, 5);    // 轻量截取，无拷贝
cout << part;                          // "hello"

// 适用于函数参数，替代 const string&
void process(string_view sv) { ... }
```