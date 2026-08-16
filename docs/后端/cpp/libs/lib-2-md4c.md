# md4c API 学习资料（Markdown 解析）

> 适用场景：AL 项目中的 Markdown 渲染（笔记、文档预览），把 Markdown 转成 HTML 或自定义渲染。
> 本文 API 与签名均来自 md4c 官方头文件 `src/md4c.h` 与 `src/md4c-html.h`（GitHub: https://github.com/mity/md4c）。

---

## 1. 核心概念：push 模型回调

md4c 不是“解析完返回一棵语法树”，而是采用 **push（回调）模型**：调用 `md_parse()` 解析整个文档，解析过程中每遇到一个块（block）的开始/结束、一个跨度（span）的开始/结束、以及一段文本，就调用一个你提供的回调函数。

```
Markdown 输入 ──> md_parse() ──> 逐个触发回调（enter_block / enter_span / text / leave_span / leave_block）
                                     │
                                     ▼
                              你的回调里拼接 HTML / 渲染到屏幕
```

- **块（Block）**：文档的结构单元，如段落 `<p>`、标题 `<h1>`、列表 `<ul>/<li>`、表格 `<table>`、代码块 `<pre><code>`、引用 `<blockquote>`。
- **跨度（Span）**：块内的行内样式单元，如 `<em>`、`<strong>`、`<code>`、链接 `<a>`、图片 `<img>`。
- **文本（Text）**：跨度里的实际文本内容，通过 `text` 回调逐段给出（可能带换行、实体等类型标记）。

这种模型的优点：单遍扫描、占用内存小、输出灵活（HTML/LaTeX/自定义控件都能做）。

---

## 2. 核心函数 `md_parse`

```c
int md_parse(const MD_CHAR* text, MD_SIZE size,
             const MD_PARSER* parser, void* userdata);
```

| 参数 | 说明 |
|------|------|
| `text` | Markdown 输入文本（**不要求以 `\0` 结尾**，靠 size 限定长度） |
| `size` | 输入文本字节数（`MD_SIZE` 即 `unsigned`） |
| `parser` | 一个 `MD_PARSER` 结构体，内含标志位与全部回调函数指针 |
| `userdata` | 任意用户数据指针，原样透传给所有回调，常用于传输出缓冲 |

返回值：

- `0`：解析成功；
- `-1`：运行时错误（如内存分配失败）；
- 其他正整数：某个回调返回了非零值导致解析被中止，此时返回该回调的返回值。

`MD_CHAR` 默认是 `char`（UTF-8）；若定义 `MD4C_USE_UTF16`（仅 Windows）则为 `WCHAR`。

---

## 3. `MD_PARSER` / `MD_RENDERER` 结构体

`MD_PARSER` 是解析器的配置 + 回调集合，所有字段都必须初始化：

```c
typedef struct MD_PARSER {
    unsigned abi_version;          /* 保留字段，必须置 0 */
    unsigned flags;                /* MD_FLAG_xxx 位掩码，见下 */
    int (*enter_block)(MD_BLOCKTYPE type, void* detail, void* userdata);
    int (*leave_block)(MD_BLOCKTYPE type, void* detail, void* userdata);
    int (*enter_span)(MD_SPANTYPE type, void* detail, void* userdata);
    int (*leave_span)(MD_SPANTYPE type, void* detail, void* userdata);
    int (*text)(MD_TEXTTYPE type, const MD_CHAR* text, MD_SIZE size, void* userdata);
    void (*debug_log)(const char* msg, void* userdata);  /* 可选，可传 NULL */
    void (*syntax)(void);           /* 保留字段，必须置 NULL */
} MD_PARSER;
```

各回调说明：

| 回调 | 触发时机 |
|------|----------|
| `enter_block` / `leave_block` | 某个块开始/结束，`type` 是 `MD_BLOCKTYPE` 枚举，`detail` 是该块类型的附加信息结构 |
| `enter_span` / `leave_span` | 某个跨度开始/结束，`type` 是 `MD_SPANTYPE` 枚举，`detail` 存放如链接 href、图片 src 等 |
| `text` | 一段文本，`type` 是 `MD_TEXTTYPE`（普通文本 / 换行 / 实体 / 代码文本等） |
| `debug_log` | 解析异常时调试输出（可选） |

注意点：

- 回调中拿到的字符串**一般不是 `\0` 结尾的**，必须按传入的 `size`/长度处理。
- 任何一个渲染回调返回非零，会**中止整个解析**。
- `MD_RENDERER` 是历史名称，现在只是 `typedef MD_PARSER MD_RENDERER;`（向后兼容），新代码直接用 `MD_PARSER`。

常用块/跨度枚举值（用于在回调里判断 `type`）：

- 块：`MD_BLOCK_DOC`（整个文档）、`MD_BLOCK_P`、`MD_BLOCK_H`、`MD_BLOCK_UL`、`MD_BLOCK_OL`、`MD_BLOCK_LI`、`MD_BLOCK_CODE`、`MD_BLOCK_HTML`、`MD_BLOCK_QUOTE`、`MD_BLOCK_HR`、表格相关的 `MD_BLOCK_TABLE/THEAD/TBODY/TR/TH/TD`（需开启 `MD_FLAG_TABLES`）。
- 跨度：`MD_SPAN_EM`、`MD_SPAN_STRONG`、`MD_SPAN_A`、`MD_SPAN_IMG`、`MD_SPAN_CODE`、`MD_SPAN_DEL`（需 `MD_FLAG_STRIKETHROUGH`）。
- 文本：`MD_TEXT_NORMAL`、`MD_TEXT_BR`（硬换行 `<br>`）、`MD_TEXT_SOFTBR`（软换行）、`MD_TEXT_ENTITY`、`MD_TEXT_CODE`、`MD_TEXT_HTML`。

---

## 4. 常用 parse flags（扩展语法开关）

`MD_PARSER.flags` 是以下宏的按位或，默认 `0` 时完全遵循 CommonMark。

| 标志 | 值 | 作用 |
|------|-----|------|
| `MD_FLAG_COLLAPSEWHITESPACE` | `0x1` | 普通文本中把连续空白折叠为单个空格 |
| `MD_FLAG_PERMISSIVEATXHEADERS` | `0x2` | 标题 `###header` 不要求 `#` 后有空格 |
| `MD_FLAG_PERMISSIVEURLAUTOLINKS` | `0x4` | 不带尖括号的 URL 也识别为自动链接 |
| `MD_FLAG_PERMISSIVEEMAILAUTOLINKS` | `0x8` | 不带尖括号的邮箱也识别为自动链接 |
| `MD_FLAG_NOINDENTEDCODEBLOCKS` | `0x10` | 禁用缩进代码块（只保留围栏代码块） |
| `MD_FLAG_NOHTMLBLOCKS` | `0x20` | 禁用原始 HTML 块 |
| `MD_FLAG_NOHTMLSPANS` | `0x40` | 禁用行内原始 HTML |
| `MD_FLAG_TABLES` | `0x100` | **启用 GitHub 风格表格** |
| `MD_FLAG_STRIKETHROUGH` | `0x200` | 启用删除线 `~~text~~` |
| `MD_FLAG_PERMISSIVEWWWAUTOLINKS` | `0x400` | 以 `www.` 开头的自动链接 |
| `MD_FLAG_TASKLISTS` | `0x800` | **启用任务列表** `- [x]` |
| `MD_FLAG_LATEXMATHSPANS` | `0x1000` | 启用 `$...$` 数学公式 |
| `MD_FLAG_WIKILINKS` | `0x2000` | 启用 `[[wiki]]` 链接 |
| `MD_FLAG_UNDERLINE` | `0x4000` | 启用下划线（同时关闭 `_` 的强调作用） |
| `MD_FLAG_HARD_SOFT_BREAKS` | `0x8000` | 所有软换行强制为硬换行 |
| `MD_FLAG_SPOILERS` | `0x10000` | 启用 `||hidden||` 剧透 |
| `MD_FLAG_SUPERSCRIPTS` | `0x20000` | 启用 `^上标^` |
| `MD_FLAG_SUBSCRIPTS` | `0x40000` | 启用 `~下标~` |
| `MD_FLAG_ADMONITIONS` | `0x80000` | 启用提示块 `> [!NOTE]` 等 |
| `MD_FLAG_FOOTNOTES` | `0x100000` | 启用 `[^label]` 脚注 |
| `MD_FLAG_HIGHLIGHT` | `0x200000` | 启用 `==高亮==` |

便捷组合：

```c
#define MD_DIALECT_COMMONMARK  0
#define MD_DIALECT_GITHUB \
    (MD_FLAG_PERMISSIVEAUTOLINKS | MD_FLAG_TABLES | MD_FLAG_STRIKETHROUGH | \
     MD_FLAG_TASKLISTS | MD_FLAG_ADMONITIONS | MD_FLAG_FOOTNOTES)
```

本项目做 Markdown 预览时，推荐直接使用 `MD_DIALECT_GITHUB`（表格、任务列表、删除线都有了）。

---

## 5. 渲染成 HTML

md4c 提供了两个途径：

### 途径 A：`md_html()` 一站式转 HTML（最简单）

单独提供 `src/md4c-html.h` 与 `md4c-html.c`，内部替你实现了完整的 HTML 渲染回调：

```c
int md_html(const MD_CHAR* input, MD_SIZE input_size,
            void (*process_output)(const MD_CHAR*, MD_SIZE, void*),
            void* userdata,
            unsigned parser_flags,    /* MD_FLAG_xxx，透传给 md_parse */
            unsigned renderer_flags); /* MD_HTML_FLAG_xxx */
```

- `process_output`：每生成一段 HTML 就调用一次，把那段文本追加到你的缓冲或文件里。
- 注意：**只生成 `<body>` 的内容**，`<html>/<head>/<body>` 外壳需要你自己写。

`renderer_flags` 可选：

```c
#define MD_HTML_FLAG_DEBUG               0x0001  /* 调试输出到 stderr */
#define MD_HTML_FLAG_VERBATIM_ENTITIES   0x0002  /* 原样输出实体，不转义 */
#define MD_HTML_FLAG_SKIP_UTF8_BOM       0x0004  /* 跳过输入开头的 UTF-8 BOM */
#define MD_HTML_FLAG_XHTML               0x0008  /* 输出 XHTML 风格（自闭合标签写 <br/>） */
```

### 途径 B：`md_parse()` + 自定义回调

如果不想用现成 HTML 渲染器，或要渲染成 Qt 富文本 / 自绘控件，就自己实现 `MD_PARSER` 里的回调。下面示例就是这种模式。

---

## 6. 完整示例：把 Markdown 转成 HTML

### 6.1 用 `md_html()`（推荐，最省事）

```c
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include "md4c.h"
#include "md4c-html.h"

/* 每收到一段 HTML 输出就追加到动态缓冲 */
static void append_html(const MD_CHAR* s, MD_SIZE n, void* userdata)
{
    /* 不保证以 '\0' 结尾，必须用长度 n */
    fwrite(s, 1, n, (FILE*) userdata);
}

int main(int argc, char** argv)
{
    /* 读入 Markdown 文件 */
    FILE* in = fopen(argv[1], "rb");
    fseek(in, 0, SEEK_END);
    long sz = ftell(in);
    fseek(in, 0, SEEK_SET);
    char* md = (char*) malloc((size_t)sz);
    fread(md, 1, (size_t)sz, in);
    fclose(in);

    /* 输出到 stdout（换成一个文件指针即可落盘） */
    fputs("<html><head><meta charset=\"utf-8\"></head><body>\n", stdout);
    md_html(md, (MD_SIZE)sz,
            append_html, stdout,          /* userdata 传 stdout，回调里直接写 */
            MD_DIALECT_GITHUB,            /* 开启表格、任务列表等 */
            0);                           /* 常规 HTML，不用 XHTML */
    fputs("\n</body></html>\n", stdout);

    free(md);
    return 0;
}
```

编译链接（md4c 是单文件实现）：

```
# 需要 md4c.c 和 md4c-html.c 一起编译；md4c-html.c 内部依赖 entity.c（或内置）
gcc -o md2html md2html.c src/md4c.c src/md4c-html.c -I src
```

### 6.2 用 `md_parse()` + 自定义回调（演示回调机制）

```c
#include <stdio.h>
#include <string.h>
#include "md4c.h"

/* 输出缓冲 */
static char outbuf[1 << 16];
static size_t outlen = 0;

static void emit(const char* s, size_t n)
{
    if (outlen + n < sizeof(outbuf)) {
        memcpy(outbuf + outlen, s, n);
        outlen += n;
    }
}
static void emit_str(const char* s) { emit(s, strlen(s)); }

/* ---- 回调实现：只做最简单的 HTML 渲染 ---- */
static int enter_block(MD_BLOCKTYPE type, void* detail, void* userdata)
{
    switch (type) {
        case MD_BLOCK_P:      emit_str("<p>"); break;
        case MD_BLOCK_H:      emit_str("<h1>"); break;   /* 简化：一律 h1 */
        case MD_BLOCK_CODE:   emit_str("<pre><code>"); break;
        case MD_BLOCK_UL:     emit_str("<ul>"); break;
        case MD_BLOCK_LI:     emit_str("<li>"); break;
        default: break;
    }
    return 0;   /* 返回非零会中止解析 */
}

static int leave_block(MD_BLOCKTYPE type, void* detail, void* userdata)
{
    switch (type) {
        case MD_BLOCK_P:      emit_str("</p>"); break;
        case MD_BLOCK_H:      emit_str("</h1>"); break;
        case MD_BLOCK_CODE:   emit_str("</code></pre>"); break;
        case MD_BLOCK_UL:     emit_str("</ul>"); break;
        case MD_BLOCK_LI:     emit_str("</li>"); break;
        default: break;
    }
    return 0;
}

static int enter_span(MD_SPANTYPE type, void* detail, void* userdata)
{
    switch (type) {
        case MD_SPAN_EM:      emit_str("<em>"); break;
        case MD_SPAN_STRONG:  emit_str("<strong>"); break;
        case MD_SPAN_CODE:    emit_str("<code>"); break;
        default: break;
    }
    return 0;
}

static int leave_span(MD_SPANTYPE type, void* detail, void* userdata)
{
    switch (type) {
        case MD_SPAN_EM:      emit_str("</em>"); break;
        case MD_SPAN_STRONG:  emit_str("</strong>"); break;
        case MD_SPAN_CODE:    emit_str("</code>"); break;
        default: break;
    }
    return 0;
}

static int text_cb(MD_TEXTTYPE type, const MD_CHAR* text, MD_SIZE size, void* userdata)
{
    switch (type) {
        case MD_TEXT_NORMAL: emit(text, size); break;   /* 原文输出 */
        case MD_TEXT_BR:     emit_str("<br>\n"); break;
        case MD_TEXT_SOFTBR: emit_str("\n"); break;
        default:             emit(text, size); break;   /* 实体/代码等原样输出 */
    }
    return 0;
}

int main(void)
{
    const char* mdtext = "# Hello\n\nThis is **bold** and `code`.\n\n- item 1\n- item 2\n";

    MD_PARSER parser;
    memset(&parser, 0, sizeof(parser));
    parser.flags = MD_DIALECT_GITHUB;
    parser.enter_block = enter_block;
    parser.leave_block = leave_block;
    parser.enter_span  = enter_span;
    parser.leave_span  = leave_span;
    parser.text        = text_cb;

    md_parse(mdtext, (MD_SIZE)strlen(mdtext), &parser, NULL);

    fwrite(outbuf, 1, outlen, stdout);
    return 0;
}
```

---

## 7. 项目落地建议（Qt6）

- 简单场景：直接 `md_html()` 生成 HTML，用 `QTextBrowser::setHtml()` 显示。
- 高级场景：自己实现回调，把渲染结果接到 `QTextDocument`（例如 `enter_block` 里 `QTextCursor::insertBlock`，`text` 里 `insertText`），即可完全摆脱 HTML，得到原生控件表现力。
- 注意 md4c 输出的字符串不保证 `\0` 结尾，Qt 侧拼接时用 `QString::fromUtf8(ptr, len)` 显式传长度。
- 文件就两个 `.c`（`md4c.c` + `md4c-html.c`，另外 `entity.c` 可被 `md4c-html.c` 使用），放入 CMake `add_library` 一起编译即可，无外部依赖。

参考文档：
- README: https://github.com/mity/md4c
- API 头文件: `src/md4c.h`、`src/md4c-html.h`
