# C++

---

## 1. fstream 文件流

C++ 使用 `<fstream>` 进行文件操作，代替 C 的 `FILE*`。

```cpp
#include <fstream>
#include <string>
using namespace std;
```

---

## 2. 文件读写

### 写入文件

```cpp
ofstream fout("data.txt");          // 打开（默认覆盖写入）
if (!fout) { cerr << "打开失败"; return; }

fout << "Hello, file!" << endl;
fout << 42 << " " << 3.14 << endl;
fout.close();                        // 关闭（析构时自动关闭）
```

### 读取文件

```cpp
ifstream fin("data.txt");
if (!fin) { cerr << "打开失败"; return; }

string s;
int i;
double d;
fin >> s >> i >> d;                  // 按空格分隔读取

string line;
getline(fin, line);                  // 读取一行

while (getline(fin, line)) {         // 逐行读取
    cout << line << endl;
}
```

### 追加模式

```cpp
ofstream fout("log.txt", ios::app);  // 追加写入
fout << "new log entry" << endl;
```

---

## 3. 文件模式

| 模式 | 含义 |
| :- | :- |
| `ios::in` | 读取（默认 for ifstream） |
| `ios::out` | 写入（默认 for ofstream，覆盖） |
| `ios::app` | 追加写入 |
| `ios::ate` | 打开后定位到文件尾 |
| `ios::trunc` | 清空文件内容 |
| `ios::binary` | 二进制模式 |

```cpp
fstream f("file", ios::in | ios::out | ios::binary);
```

---

## 4. 二进制读写

```cpp
// 写入二进制
struct Record { int id; double score; };
Record r = {1, 95.5};

ofstream fout("data.bin", ios::binary);
fout.write(reinterpret_cast<const char*>(&r), sizeof(r));

// 读取二进制
Record r2;
ifstream fin("data.bin", ios::binary);
fin.read(reinterpret_cast<char*>(&r2), sizeof(r2));
```

---

## 5. 文件状态

```cpp
ifstream fin("test.txt");
fin.is_open();          // 是否成功打开
fin.good();             // 流是否正常
fin.fail();             // 上次操作是否失败
fin.eof();              // 是否到达文件尾
fin.bad();              // 流是否损坏
```