# stb_image API 学习资料（图片解码）

> 适用场景：AL 项目中的图片缩略图、图片预览、文件图标生成。
> 本文基于 stb_image.h v2.30 官方头文件注释整理（GitHub: https://github.com/nothings/stb，文件：`stb_image.h`）。

---

## 1. 核心概念：单头文件、零依赖

stb_image 是**单头文件库**：只有 `stb_image.h` 一个文件，不依赖任何第三方库，解码器（JPEG/PNG/WebP/TGA/BMP/PSD/GIF/HDR/PIC）全部内置。

使用方式（关键点）：在**恰好一个** `.c/.cpp` 文件里先定义 `STB_IMAGE_IMPLEMENTATION` 再包含头文件，这样那个文件里才会生成函数实现；其他文件正常 `#include "stb_image.h"` 即可。

```c
/* thumbnails.cpp —— 整个项目里只有这一个文件这么做 */
#define STB_IMAGE_IMPLEMENTATION
#include "stb_image.h"
```

> 注意：`STB_IMAGE_IMPLEMENTATION` 必须只在**一个**编译单元里定义，否则会重复定义符号。

解码结果是像素数组：`unsigned char*`，第 `y` 行第 `x` 列像素从 `data[(y * width + x) * channels]` 开始；**第一个像素是左上角**，行与行之间**无填充**。

---

## 2. 核心函数

### 2.1 从文件加载

```c
STBIDEF stbi_uc *stbi_load(char const *filename,
                           int *x, int *y,
                           int *channels_in_file,
                           int desired_channels);
```

### 2.2 从内存加载（本项目重点：磁盘/网络数据已在内存）

```c
STBIDEF stbi_uc *stbi_load_from_memory(stbi_uc const *buffer, int len,
                                       int *x, int *y,
                                       int *channels_in_file,
                                       int desired_channels);
```

### 2.3 释放

```c
STBIDEF void stbi_image_free(void *retval_from_stbi_load);
```

### 2.4 只读尺寸信息（不解码像素，适合做缩略图前快速判断）

```c
STBIDEF int stbi_info(char const *filename, int *x, int *y, int *comp);
STBIDEF int stbi_info_from_memory(stbi_uc const *buffer, int len,
                                  int *x, int *y, int *comp);
/* 返回 1 表示成功并填充宽/高/通道数；0 表示不支持或解码失败 */
```

### 2.5 参数含义

| 参数 | 方向 | 说明 |
|------|------|------|
| `x` | 输出 | 图像宽度（像素） |
| `y` | 输出 | 图像高度（像素） |
| `channels_in_file` | 输出 | 图像文件原本的通道数（不因 desired_channels 改变） |
| `desired_channels` | 输入 | 希望输出数据的通道数，0 表示保持原样；1..4 会强制转换 |

`desired_channels` 与通道常量的对应关系：

| 常量 | 值 | 含义 |
|------|-----|------|
| `STBI_default` | `0` | 保持文件原始通道数 |
| `STBI_grey` | `1` | 灰度 |
| `STBI_grey_alpha` | `2` | 灰度 + alpha |
| `STBI_rgb` | `3` | 红绿蓝 |
| `STBI_rgb_alpha` | `4` | 红绿蓝 + alpha |

各通道数下像素内数据排列：

```
1 通道: grey
2 通道: grey, alpha
3 通道: red, green, blue
4 通道: red, green, blue, alpha
```

要点：

- `desired_channels` 传非零值时，若与源通道数不同，加载器会自动转换（如 RGB→灰度按亮度系数加权、补 alpha=255 等）。
- 即使 `desired_channels=4`，`channels_in_file` 里仍是**源文件实际通道数**，可用于判断原图是否自带透明通道。
- 返回 `NULL` 表示失败（分配失败或图片损坏/非法）；此时可用 `stbi_failure_reason()` 拿到简短错误说明。失败时 `x/y/channels_in_file` **不会被修改**。
- stb_image 内部用 `int` 表示尺寸，单边超过 `STBI_MAX_DIMENSIONS`（默认 `1<<24` = 16,777,216 像素）会被拒掉，防止畸形/恶意图片吃光内存。

---

## 3. 常用辅助函数

```c
/* 上下翻转：置 1 后加载得到的第一个像素是左下角。
   Qt/OpenGL 纹理坐标习惯用这个。 */
STBIDEF void stbi_set_flip_vertically_on_load(int flag_true_if_should_flip);

/* 失败原因：返回一个描述错误的静态字符串，例如 "can't fopen" */
STBIDEF const char *stbi_failure_reason(void);
```

---

## 4. 完整示例（C++，Qt6 配合 QImage）

```cpp
// thumbnails.cpp —— 唯一一个定义 STB_IMAGE_IMPLEMENTATION 的文件
#define STB_IMAGE_IMPLEMENTATION
#include "stb_image.h"

#include <QImage>
#include <QByteArray>

// 从内存数据解码为 QImage（RGBA）
QImage LoadImageFromMemory(const QByteArray& data)
{
    int w = 0, h = 0, comp = 0;
    unsigned char* pixels = stbi_load_from_memory(
        reinterpret_cast<const unsigned char*>(data.constData()),
        static_cast<int>(data.size()),
        &w, &h, &comp,
        STBI_rgb_alpha);              // 强制转成 RGBA，Qt 侧处理最简单

    if (!pixels) {
        qWarning("stbi failed: %s", stbi_failure_reason());
        return {};
    }

    QImage img(pixels, w, h, w * 4, QImage::Format_RGBA8888);
    QImage copy = img.copy();          // 深拷贝：stbi 缓冲随后会被释放
    stbi_image_free(pixels);           // 释放 stb 分配的内存
    return copy;
}

// 只读尺寸，解码缩略图前先做快速判断
bool ProbeImageSize(const QByteArray& data, int* w, int* h)
{
    int comp = 0;
    return stbi_info_from_memory(
        reinterpret_cast<const unsigned char*>(data.constData()),
        static_cast<int>(data.size()), w, h, &comp) == 1;
}
```

### 4.1 从文件加载的对比写法

```c
int x, y, n;
unsigned char *data = stbi_load("photo.jpg", &x, &y, &n, 0);
if (data) {
    /* 使用 data，每像素 n 个通道 */
    stbi_image_free(data);
}
```

---

## 5. 项目落地建议（Qt6）

- 缩略图流程：`stbi_info_from_memory` 先拿宽高判断是否超限 → `stbi_load_from_memory(..., STBI_rgb_alpha)` 解码 → `QImage::scaled()` 缩放 → 缓存。
- stb 解码后的内存要 `stbi_image_free` 释放；Qt 侧需要保留像素时务必做 `QImage` 的深拷贝（见上例），否则 stb 内存释放后 QImage 就是悬空指针。
- `stbi_set_flip_vertically_on_load(1)` 在 OpenGL 纹理或某些坐标系下有用；普通 Qt 显示（行 0 在顶部）不需要翻转。
- 与 FFmpeg 的分工：视频帧缩略图用 FFmpeg（解码视频帧再 `sws_scale` 转 RGB），单张图片直接用 stb_image（更轻、更快、无 FFmpeg 依赖）。

参考文档：
- stb 仓库: https://github.com/nothings/stb （`stb_image.h` 头部注释即权威文档）
