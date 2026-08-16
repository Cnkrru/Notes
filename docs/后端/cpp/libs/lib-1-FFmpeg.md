# FFmpeg API 学习资料（libavformat / libavcodec / libswscale）

> 适用场景：AL 项目中的媒体播放、缩略图生成、音视频剪切/合并/格式转换。
> 本文基于 FFmpeg 官方 Doxygen（trunk）与 `libavformat/avformat.h`、`libavcodec/avcodec.h`、`libswscale/swscale.h` 整理，函数签名均来自官方头文件。

---

## 1. 核心概念：format / stream / codec / packet / frame 的关系

FFmpeg 的数据层次可以理解为“容器 → 流 → 压缩数据包 → 解码帧”：

```
AVFormatContext (封装容器, 对应 .mp4/.mkv 等文件或网络流)
  │
  ├─ AVStream[0] (视频流) ──> AVCodecParameters (编码参数)
  │      │
  │      └─ AVPacket 队列（压缩后的数据，如 H.264 NALU）
  │             │
  │             ▼  avcodec_send_packet / avcodec_receive_frame
  │          AVFrame（解码后的原始像素，如 YUV420P）
  │
  ├─ AVStream[1] (音频流) ──> AVCodecContext（解码器上下文）
  └─ AVStream[2] (字幕流)
```

各对象职责：

| 对象 | 所属库 | 作用 |
|------|--------|------|
| `AVFormatContext` | libavformat | 封装容器（demuxer/muxer）的句柄，保存所有流信息 |
| `AVStream` | libavformat | 一条流（视频/音频/字幕），保存 timebase、编码参数等 |
| `AVCodecParameters` | libavcodec | 流的编码参数（codec_id、分辨率、采样率等），只读描述 |
| `AVCodecContext` | libavcodec | 解码/编码工作上下文，保存解码器运行时状态 |
| `AVPacket` | libavcodec | 一份压缩的数据（一帧视频或若干帧音频），存放在 `AVFormatContext` 里读出 |
| `AVFrame` | libavutil | 一份解码后的原始数据（YUV/RGB 图像或 PCM 音频） |
| `SwsContext` | libswscale | 像素格式转换 / 缩放上下文（如 YUV420P → RGB24） |

关键的内存生命周期约定：

- `AVFormatContext` 用 `avformat_open_input` 创建，用 `avformat_close_input` 销毁（一次调用完成关闭与释放）。
- `AVCodecContext` 用 `avcodec_alloc_context3` 分配，用 `avcodec_free_context` 释放。
- `AVPacket` 用 `av_packet_alloc` 分配；每次读包后要用 `av_packet_unref` 清理；最终 `av_packet_free`。
- `AVFrame` 用 `av_frame_alloc` 分配；每次收帧后要用 `av_frame_unref` 清理；最终 `av_frame_free`。
- 解码后的 `AVFrame` 是**引用计数**的，`avcodec_receive_frame` 内部会先 `av_frame_unref`。

---

## 2. 解码流程 API 列表（打开 → 解码 → 像素转换）

### 2.1 打开媒体文件

```c
// 打开文件/URL，自动探测封装格式（fmt 传 NULL 表示自动检测）
int avformat_open_input(AVFormatContext **ps, const char *url,
                        const AVInputFormat *fmt, AVDictionary **options);
// 返回 0 成功；失败时内部会释放 ps 并置为 NULL

// 读取流信息（对无头格式如 MPEG 尤其必要；也会探测帧率、参数）
int avformat_find_stream_info(AVFormatContext *ic, AVDictionary **options);
// 返回 >=0 成功
```

### 2.2 找流

```c
// 按媒体类型（AVMEDIA_TYPE_VIDEO/AUDIO/SUBTITLE）自动挑“最佳”流
// decoder_ret 非空时返回该流对应的解码器
int av_find_best_stream(AVFormatContext *ic,
                        enum AVMediaType type,
                        int wanted_stream_nb,   // -1 表示自动选择
                        int related_stream,     // 通常传 -1
                        const struct AVCodec **decoder_ret,
                        int flags);             // 当前无 flag，传 0
// 返回流序号（>=0）；AVERROR_STREAM_NOT_FOUND 找不到，AVERROR_DECODER_NOT_FOUND 有流但无解码器
```

### 2.3 创建并打开解码器

```c
// 按编码 ID 查找注册的解码器
const AVCodec *avcodec_find_decoder(enum AVCodecID id);

// 分配解码上下文（字段默认值）
AVCodecContext *avcodec_alloc_context3(const AVCodec *codec);

// 把流的编码参数拷入解码上下文（参数来自 AVStream 的 codecpar）
int avcodec_parameters_to_context(AVCodecContext *avctx,
                                  const AVCodecParameters *par);

// 真正打开解码器，options 传 NULL 即可
int avcodec_open2(AVCodecContext *avctx, const AVCodec *codec,
                  AVDictionary **options);

// 释放解码上下文
void avcodec_free_context(AVCodecContext **avctx);
```

### 2.4 送包取帧（推荐的新 API）

```c
// 送一个压缩包给解码器；pkt 为 NULL（或 data=NULL,size=0）表示 flush
// 返回值：0 成功；AVERROR(EAGAIN) 说明要先把已解出的帧取走；AVERROR_EOF 解码器已排空
int avcodec_send_packet(AVCodecContext *avctx, const AVPacket *avpkt);

// 取一帧解码后的图像/音频
// 返回值：0 成功；AVERROR(EAGAIN) 说明当前无输出，需继续送包；AVERROR_EOF 已取完
int avcodec_receive_frame(AVCodecContext *avctx, AVFrame *frame);
```

典型循环：

```c
while (av_read_frame(fmtCtx, pkt) >= 0) {          // 从容器读一个压缩包
    if (pkt->stream_index == videoStreamIndex) {
        if (avcodec_send_packet(codecCtx, pkt) == 0) {
            while (avcodec_receive_frame(codecCtx, frame) == 0) {
                // 这里得到一帧 AVFrame，做格式转换或送去显示/保存
            }
        }
    }
    av_packet_unref(pkt);                          // 重要：清理包引用
}
// 可选：flush 解码器
avcodec_send_packet(codecCtx, NULL);
while (avcodec_receive_frame(codecCtx, frame) == 0) { /* 处理剩余帧 */ }
```

### 2.5 像素格式转换（YUV → RGB，用于显示/缩略图）

```c
// 创建转换上下文（src 为解码器输出的像素格式，dst 为想要的，如 AV_PIX_FMT_RGB24）
// flags 常用 SWS_BILINEAR / SWS_BICUBIC / SWS_LANCZOS
struct SwsContext *sws_getContext(int srcW, int srcH, enum AVPixelFormat srcFormat,
                                  int dstW, int dstH, enum AVPixelFormat dstFormat,
                                  int flags, SwsFilter *srcFilter,
                                  SwsFilter *dstFilter, const double *param);

// 执行转换；srcSliceY/srcSliceH 常用 0 和 srcH（一次整幅转换）
int sws_scale(struct SwsContext *c,
              const uint8_t *const srcSlice[], const int srcStride[],
              int srcSliceY, int srcSliceH,
              uint8_t *const dst[], const int dstStride[]);
// 返回输出切片高度

// 释放
void sws_freeContext(struct SwsContext *swsContext);
```

配合 `AVFrame` 的用法：

```c
// 假设已经解出 videoFrame（YUV），把输出帧的 data/stride 喂给 sws_scale
uint8_t *rgbData = (uint8_t*)malloc(dstW * dstH * 3);
int rgbStride = dstW * 3;
uint8_t *dstPlanes[4] = { rgbData, nullptr, nullptr, nullptr };
int dstStrides[4]   = { rgbStride, 0, 0, 0 };
sws_scale(swsCtx,
          videoFrame->data, videoFrame->linesize,
          0, videoFrame->height,
          dstPlanes, dstStrides);
```

### 2.6 内存管理函数

```c
AVFrame  *av_frame_alloc(void);                       // 分配帧结构本身（不含数据缓冲）
void      av_frame_free(AVFrame **frame);             // 释放帧及引用
void      av_frame_unref(AVFrame *frame);             // 仅释放引用、保留结构，便于复用
int       av_frame_get_buffer(AVFrame *frame, int align); // 按 width/height/format 分配数据缓冲

AVPacket  *av_packet_alloc(void);                     // 分配包结构本身
void      av_packet_free(AVPacket **pkt);             // 释放包
void      av_packet_unref(AVPacket *pkt);             // 清理包引用并复位字段
int       av_new_packet(AVPacket *pkt, int size);     // 给包分配 size 字节数据

void      avformat_close_input(AVFormatContext **s);  // 关闭输入文件并释放上下文（置 NULL）
```

---

## 3. 转封装 / 转码（剪切、合并、格式转换）

转封装（remux）只改容器不改编码，速度快；转码（transcode）需要加编码器，慢但可改变编码格式。

### 3.1 输出上下文创建

```c
// 创建输出容器上下文。oformat / format_name / filename 传一个即可（其余传 NULL）
// 例：avformat_alloc_output_context2(&outCtx, NULL, NULL, "out.mp4");
int avformat_alloc_output_context2(AVFormatContext **ctx,
                                   const AVOutputFormat *oformat,
                                   const char *format_name,
                                   const char *filename);

// 打开输出文件（先把 outCtx->pb 打开）
// flags 常用 AVIO_FLAG_WRITE
int avio_open2(AVIOContext **s, const char *url, int flags,
               const AVIOInterruptCB *int_cb, AVDictionary **options);

// 新建输出流（把输入流参数拷过来）
AVStream *avformat_new_stream(AVFormatContext *s, const struct AVCodec *c);

// 写容器头部
int avformat_write_header(AVFormatContext *s, AVDictionary **options);
// 返回 0（AVSTREAM_INIT_IN_WRITE_HEADER）或 1（AVSTREAM_INIT_IN_INIT_OUTPUT）表示成功

// 交错写包（内部做时间戳排序缓冲，输出文件 DTS 递增）
int av_interleaved_write_frame(AVFormatContext *s, AVPacket *pkt);
// pkt 传 NULL 表示 flush 缓冲；包需正确设置 stream_index、pts、dts（按流的 timebase）

// 写尾部，结束文件
int av_write_trailer(AVFormatContext *s);

// 释放
void avformat_free_context(AVFormatContext *s);
```

### 3.2 转封装最小流程

```c
// 1. 打开输入
AVFormatContext *inCtx = nullptr;
avformat_open_input(&inCtx, inFile, nullptr, nullptr);
avformat_find_stream_info(inCtx, nullptr);

// 2. 打开输出
AVFormatContext *outCtx = nullptr;
avformat_alloc_output_context2(&outCtx, nullptr, nullptr, outFile);

// 3. 为每个需要的输入流创建输出流并拷贝参数
for (int i = 0; i < inCtx->nb_streams; i++) {
    AVStream *outStream = avformat_new_stream(outCtx, nullptr);
    avcodec_parameters_copy(outStream->codecpar, inCtx->streams[i]->codecpar);
}

// 4. 打开输出文件、写头
avio_open2(&outCtx->pb, outFile, AVIO_FLAG_WRITE, nullptr, nullptr);
avformat_write_header(outCtx, nullptr);

// 5. 逐包拷贝（转封装不改编码，只需重写时间戳为输出 timebase）
AVPacket *pkt = av_packet_alloc();
while (av_read_frame(inCtx, pkt) >= 0) {
    pkt->pts = av_rescale_q_rnd(pkt->pts, inCtx->streams[pkt->stream_index]->time_base,
                                outCtx->streams[pkt->stream_index]->time_base,
                                AV_ROUND_NEAR_INF | AV_ROUND_PASS_MINMAX);
    pkt->dts = av_rescale_q_rnd(pkt->dts, /* 同上 */);
    pkt->duration = av_rescale_q(pkt->duration, /* 同上 */);
    av_interleaved_write_frame(outCtx, pkt);
    av_packet_unref(pkt);
}
av_interleaved_write_frame(outCtx, nullptr);   // flush
av_write_trailer(outCtx);

// 6. 清理
av_packet_free(&pkt);
avformat_close_input(&inCtx);
avio_close(outCtx->pb);
avformat_free_context(outCtx);
```

> 注意：真正转码（如把 H.264 转成 H.265）还需要创建编码器上下文、喂 `avcodec_send_frame`、用 `avcodec_receive_packet` 取编码后的包再写入，本文不展开。

---

## 4. 解码 + 缩略图完整示例（C++）

```cpp
#include <cstdio>
#include <cstdlib>
extern "C" {
#include <libavformat/avformat.h>
#include <libavcodec/avcodec.h>
#include <libswscale/swscale.h>
#include <libavutil/imgutils.h>
}

// 提取视频第 frameNo 帧，缩放到 thumbW x thumbH，输出 RGB24 数据到 outBuf
bool ExtractThumbnail(const char* file, int frameNo, int thumbW, int thumbH,
                      std::vector<uint8_t>& outBuf) {
    avformat_network_init();  // 需要网络流时才需要

    AVFormatContext* fmtCtx = nullptr;
    if (avformat_open_input(&fmtCtx, file, nullptr, nullptr) < 0) return false;
    if (avformat_find_stream_info(fmtCtx, nullptr) < 0) { avformat_close_input(&fmtCtx); return false; }

    // 找视频流
    const AVCodec* decoder = nullptr;
    int vs = av_find_best_stream(fmtCtx, AVMEDIA_TYPE_VIDEO, -1, -1, &decoder, 0);
    if (vs < 0) { avformat_close_input(&fmtCtx); return false; }

    // 建解码器
    AVCodecContext* codecCtx = avcodec_alloc_context3(decoder);
    avcodec_parameters_to_context(codecCtx, fmtCtx->streams[vs]->codecpar);
    if (avcodec_open2(codecCtx, decoder, nullptr) < 0) { /* 清理并返回 false */ }

    // 建缩放器
    SwsContext* sws = sws_getContext(codecCtx->width, codecCtx->height, codecCtx->pix_fmt,
                                     thumbW, thumbH, AV_PIX_FMT_RGB24,
                                     SWS_BILINEAR, nullptr, nullptr, nullptr);

    AVPacket* pkt = av_packet_alloc();
    AVFrame* frame = av_frame_alloc();
    bool ok = false;
    int got = 0;

    while (av_read_frame(fmtCtx, pkt) >= 0) {
        if (pkt->stream_index == vs && avcodec_send_packet(codecCtx, pkt) == 0) {
            while (avcodec_receive_frame(codecCtx, frame) == 0) {
                if (got++ == frameNo) {
                    outBuf.resize((size_t)thumbW * thumbH * 3);
                    uint8_t* dst[4] = { outBuf.data(), nullptr, nullptr, nullptr };
                    int dstStride[4] = { thumbW * 3, 0, 0, 0 };
                    sws_scale(sws, frame->data, frame->linesize, 0, frame->height,
                              dst, dstStride);
                    ok = true;
                    break;
                }
                av_frame_unref(frame);
            }
        }
        av_packet_unref(pkt);
        if (ok) break;
    }

    // 清理
    av_frame_free(&frame);
    av_packet_free(&pkt);
    sws_freeContext(sws);
    avcodec_free_context(&codecCtx);
    avformat_close_input(&fmtCtx);
    return ok;
}
```

---

## 5. 链接与头文件

- 头文件：`extern "C" { #include <libavformat/avformat.h> #include <libavcodec/avcodec.h> #include <libswscale/swscale.h> }`
- 链接库：`-lavformat -lavcodec -lavutil -lswscale`（Qt 的 `find_package(FFMPEG)` 或 vcpkg 的 `ffmpeg` 包）
- 版本说明：FFmpeg 保证同一 major 版本内 API/ABI 向后兼容；建议用 `avcodec_send_packet/receive_frame` 新 API 而非已被标记废弃的 `avcodec_decode_video2`。

参考文档：
- FFmpeg Doxygen: https://ffmpeg.org/doxygen/trunk/index.html
- libavformat demux: https://ffmpeg.org/doxygen/trunk/group__lavf__decoding.html
- libavformat mux: https://ffmpeg.org/doxygen/trunk/group__lavf__encoding.html
- libavcodec decode: https://ffmpeg.org/doxygen/trunk/group__lavc__decoding.html
- libswscale: https://ffmpeg.org/doxygen/trunk/group__libsws.html
