# nlohmann/json 快速学习资料（C++ JSON 库）

> header-only：只需 `#include <nlohmann/json.hpp>`。
> 使用 `using json = nlohmann::json;` 简化类型名。
> 支持 C++11 以上，本资料按 C++17 使用（结构化绑定、string 字面量）。

---

## 一、核心概念

- 一个 `json` 值可表示：`null`、布尔、整数、浮点、字符串、数组（`std::vector`）、对象（`std::map`，键为 `std::string`）。
- 构造/赋值基本由**类型推导**自动完成：`j["key"] = value` 自动决定类型并建立对象。
- 默认对象是有序的 map；需要"保持插入顺序"时用 `nlohmann::ordered_json`。
- 解析与序列化是核心两个方向：文本（JSON）/ 二进制（CBOR、MessagePack、BSON、UBJSON）均可。

---

## 二、解析（文本）

```cpp
#include <nlohmann/json.hpp>
#include <fstream>
using json = nlohmann::json;

// 从字符串解析
json j1 = json::parse(R"({"pi": 3.141, "happy": true})");

// 从文件解析（std::istream 也可）
std::ifstream f("example.json");
json j2 = json::parse(f);

// 字符串字面量（需 using namespace nlohmann::literals;）
using namespace nlohmann::literals;
json j3 = R"({"pi": 3.141, "happy": true})"_json;

// 直接用花括号初始化构建对象
json j4 = {
    {"pi", 3.141},
    {"happy", true},
    {"name", "Niels"},
    {"answer", {{"everything", 42}}},
    {"list", {1, 0, 2}},
    {"object", {{"currency", "USD"}, {"value", 42.99}}}
};
```

> 解析失败会抛 `json::parse_error`，生产代码请包 try/catch。

---

## 三、读取值

### 1. `operator[]`（非 const 对象会"无中生有"）

```cpp
std::string name = j["name"];       // 若 j 非 const 且缺 key，会自动插入一个 null，不报错
double pi = j["pi"];
```

- 缺点：对 `const` 对象不可用；缺 key 时不报错而是插入 null，容易掩盖 bug。

### 2. `.at()`（越界/缺 key 抛异常）

```cpp
std::string name = j.at("name");    // 缺 key 抛 json::out_of_range
```

- 推荐用于"key 必须存在"的场景。

### 3. `.value(key, default)`（缺 key 返回默认值）

```cpp
int v = j.value("integer", 0);
std::string s = j.value("nonexisting", "oops");   // 缺 key -> "oops"
bool b = j.value("nonexisting", false);
```

- 不会像 `operator[]` 那样插入 null，对 `const` 对象也可用。
- 注意：返回类型由默认值推导，`j.value("uint64", 0)` 里的 `0` 是 `int`，大数会溢出；
  要写 `j.value("uint64", std::uint64_t(0))` 或 `j.value<std::uint64_t>("uint64", 0)`。

### 4. `.get<T>()` 与隐式转换

```cpp
auto p = j.get<ns::person>();   // 配合 NLOHMANN_DEFINE_* 宏互转自定义类型
std::vector<int> arr = j["list"];   // 隐式转 STL 容器
```

---

## 四、写值 / 修改

```cpp
json j;

j["pi"] = 3.141;                      // 数字
j["happy"] = true;                    // 布尔
j["name"] = "Niels";                  // 字符串
j["nothing"] = nullptr;               // null
j["answer"]["everything"] = 42;       // 自动嵌套对象
j["list"] = {1, 0, 2};                // 数组
j["object"] = {{"currency", "USD"}, {"value", 42.99}};

// 数组操作
j["list"].push_back(3);
j["list"].emplace_back(4);            // 在数组末尾就地构造

// 对象操作
j.emplace("new_key", 123);            // 插入键值（键存在则失败，不覆盖）
j["other"] = 5;                       // 直接赋值（键存在则覆盖）
j.erase("nothing");                   // 删除键
```

- 修改器清单：`clear`、`push_back`、`emplace_back`、`emplace`、`erase`、`insert`、`update`、`swap`。

---

## 五、序列化（文本输出）

```cpp
// 紧凑输出
std::string s = j.dump();             // {"happy":true,"pi":3.141}

// 带缩进的漂亮输出
std::cout << j.dump(4) << std::endl;
// {
//     "happy": true,
//     "pi": 3.141
// }
```

> `dump(缩进空格数)` 用于写配置文件/日志；`dump()` 紧凑形式用于网络传输。

---

## 六、类型检查

```cpp
j.is_null();       j.is_boolean();    j.is_number();
j.is_number_integer();  j.is_number_unsigned();   j.is_number_float();
j.is_object();     j.is_array();      j.is_string();
j.is_primitive();  j.is_structured(); j.type_name();   // 返回类型名的字符串，如 "object"
```

- 常用场景：解析外部输入前先 `is_object()` 判断根节点类型，再按 key 读取。

---

## 七、遍历

```cpp
// 对象：key/value（C++17 结构化绑定）
for (auto& [key, val] : j.items())
{
    std::cout << "key: " << key << ", value: " << val << '\n';
}

// 数组：key() 返回下标字符串
for (auto& item : j["list"].items())
{
    std::cout << item.key() << " -> " << item.value() << '\n';
}

// 普通迭代器（begin/end），值与 JSON 文本相同
for (auto it = j.begin(); it != j.end(); ++it)
{
    std::cout << *it << '\n';
}
```

> 不要对临时对象调用 `items()`；被遍历的 `json` 对象生命周期必须覆盖整个循环。

---

## 八、二进制格式（CBOR / MessagePack）

适合做跨语言二进制协议或紧凑存储。

```cpp
// 解析 CBOR 字节
std::vector<std::uint8_t> v = {0xa2, 0x67, 0x63, 0x6f, 0x6d, 0x70, 0x61, 0x63,
                               0x74, 0xf5, 0x66, 0x73, 0x63, 0x68, 0x65, 0x6d,
                               0x61, 0x00};
json j = json::from_cbor(v);

// 序列化到 CBOR（静态形式）
std::vector<std::uint8_t> bytes = json::to_cbor(j);
// 等价成员形式：auto bytes = j.to_cbor();

// MessagePack：API 完全对称
json jm = json::from_msgpack(msgpack_bytes);
std::vector<std::uint8_t> out = jm.to_msgpack();
```

- 完整矩阵：`from/to` + `cbor / msgpack / ubjson / bson / bjdata`。
- 注意：BSON 序列化不完整，顶层必须是对象。

---

## 九、与自定义类型互转（NLOHMANN_DEFINE_TYPE_NON_INTRUSIVE）

在**结构体外部**使用，为结构体自动生成 `to_json` / `from_json`：

```cpp
#include <nlohmann/json.hpp>
using json = nlohmann::json;

namespace ns {
    struct person {
        std::string name;
        std::string address;
        int age;
    };

    // 列出的成员就是参与序列化的成员
    NLOHMANN_DEFINE_TYPE_NON_INTRUSIVE(person, name, address, age)
}

ns::person p = {"Ned Flanders", "744 Evergreen Terrace", 60};

json j = p;                     // 结构体 -> json
std::cout << j.dump() << '\n';  // {"address":"744 Evergreen Terrace","age":60,"name":"Ned Flanders"}

auto p2 = j.get<ns::person>();  // json -> 结构体
```

配套宏：

| 宏 | 适用场景 |
| --- | --- |
| `NLOHMANN_DEFINE_TYPE_NON_INTRUSIVE` | 结构体外部，普通结构体 |
| `NLOHMANN_DEFINE_TYPE_INTRUSIVE` | 放在类内部，可访问 private 成员 |
| `..._WITH_NAMES` 变体 | 自定义 JSON 中的键名 |
| `..._WITH_DEFAULT` 变体 | 反序列化缺 key 时用成员默认值（不带此变体则抛异常） |

---

## 十、实战示例：读写配置文件

```cpp
#include <iostream>
#include <fstream>
#include <nlohmann/json.hpp>
using json = nlohmann::json;

// 0) 自定义配置结构
namespace app {
    struct Config {
        std::string appName;
        int logLevel = 2;
        int windowWidth = 1280;
        bool fullscreen = false;
    };
    NLOHMANN_DEFINE_TYPE_NON_INTRUSIVE(Config, appName, logLevel, windowWidth, fullscreen)
}

int main()
{
    // 1) 读取配置文件
    app::Config cfg;
    try {
        std::ifstream f("config.json");
        if (f.good()) {
            json j = json::parse(f);            // 解析
            cfg = j.get<app::Config>();         // 直接转成结构体
        }
    } catch (const json::parse_error& e) {
        std::cerr << "config parse error: " << e.what() << '\n';
    }

    // 2) 容错读取单个字段（缺 key 用默认值）
    cfg.logLevel = j_safe.value("logLevel", 2);

    // 3) 构建 / 修改配置对象
    json j;
    j["appName"] = cfg.appName;
    j["window"] = {{"width", cfg.windowWidth}, {"fullscreen", cfg.fullscreen}};
    j["levels"].push_back(1);

    // 4) 类型检查 + 遍历
    if (j.is_object()) {
        for (auto& [key, val] : j.items()) {
            std::cout << key << " => " << val << '\n';
        }
    }

    // 5) 写回文件（缩进 4 的漂亮格式）
    std::ofstream out("config.json");
    out << j.dump(4) << '\n';

    // 6) 可选：导出为 MessagePack 字节，用于网络传输
    std::vector<std::uint8_t> msg = json::to_msgpack(j);
    return 0;
}
```

---

## 十一、本项目最小可用 API 清单

| 场景 | API |
| --- | --- |
| 解析文本 | `json::parse(str / istream)`、`"... "_json` |
| 解析二进制 | `json::from_cbor(v)`、`json::from_msgpack(v)` |
| 读值（有默认） | `j.value("key", default)` |
| 读值（必存在） | `j.at("key")` |
| 读值（宽松） | `j["key"]`（非 const，缺 key 会插入 null） |
| 写值 | `j["key"] = value`、`j.emplace(k, v)`、`j.push_back(x)` |
| 序列化文本 | `j.dump()` / `j.dump(4)` |
| 序列化二进制 | `j.to_cbor()`、`j.to_msgpack()` |
| 自定义类型互转 | `NLOHMANN_DEFINE_TYPE_NON_INTRUSIVE(Struct, 成员...)` |
| 类型检查 | `is_object / is_array / is_string / is_null / is_number...` |
| 遍历 | `for (auto& [k, v] : j.items())` |

> 结论：桌面应用最常见的组合 = 启动时 `json::parse` 读配置文件（或
> `from_msgpack` 读缓存）→ `.value()` 容错取字段 → 修改/构建 `json` →
> 退出时 `dump(4)` 或 `to_cbor` 写回，配合 `NLOHMANN_DEFINE_TYPE_NON_INTRUSIVE`
> 把配置结构体与 JSON 直接互转。
