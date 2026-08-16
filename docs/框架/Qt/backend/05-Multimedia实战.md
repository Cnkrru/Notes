AL 项目的核心功能之一是媒体保险库和播放器。Qt Multimedia 模块基于 FFmpeg 后端，支持全格式音视频播放。

## 架构变化

Qt6 相比 Qt5 的重要变化：**QAudioOutput 是独立对象，必须手动挂到 QMediaPlayer 上**，否则无声。

```
QMediaPlayer  ──setAudioOutput──▶  QAudioOutput
     │                                  │
     └──setVideoOutput──▶  QVideoWidget / QGraphicsVideoItem
```

## 音频播放

```cpp
#include <QMediaPlayer>
#include <QAudioOutput>

QMediaPlayer *player = new QMediaPlayer(this);
QAudioOutput *audio = new QAudioOutput(this);
player->setAudioOutput(audio);   // 必须设置，否则无声

audio->setVolume(0.6);  // 0.0 ~ 1.0

player->setSource(QUrl::fromLocalFile("C:/music/song.mp3"));
player->play();
```

关键 API：
- `play()` / `pause()` / `stop()`
- `position()` / `setPosition(ms)` / `duration()`
- `setPlaybackRate(1.0)` — 倍速播放
- `setLoops(QMediaPlayer::Infinite)` — 无限循环
- 信号：`positionChanged`、`durationChanged`、`playbackStateChanged`、`errorOccurred`

## 视频播放

```cpp
#include <QVideoWidget>
#include <QMediaPlayer>
#include <QAudioOutput>

class MediaWindow : public QMainWindow {
public:
    MediaWindow() {
        auto *central = new QWidget(this);
        auto *layout = new QVBoxLayout(central);

        m_video = new QVideoWidget;
        m_video->setAspectRatioMode(Qt::KeepAspectRatio);
        layout->addWidget(m_video);
        setCentralWidget(central);

        m_player = new QMediaPlayer(this);
        auto *audio = new QAudioOutput(this);
        m_player->setAudioOutput(audio);
        m_player->setVideoOutput(m_video);

        m_player->setSource(
            QUrl::fromLocalFile("C:/videos/movie.mp4"));
        m_player->play();
    }

private:
    QMediaPlayer *m_player = nullptr;
    QVideoWidget *m_video = nullptr;
};
```

## 视频缩略图截取

AL 项目需要为视频文件生成缩略图。Qt Multimedia 提供 `QVideoSink` 截帧，但更推荐直接用 FFmpeg（见后续章节）。

```cpp
// 使用 QVideoSink 截取当前帧
connect(player, &QMediaPlayer::positionChanged, [&](qint64 pos) {
    if (pos > 1000) {  // 播放 1 秒后截帧
        QVideoSink *sink = m_video->videoSink();
        QVideoFrame frame = sink->videoFrame();
        QImage img = frame.toImage();
        img.save("thumbnail.jpg");
        player->pause();
    }
});
```

## QML 播放器

```qml
import QtMultimedia

MediaPlayer {
    id: player
    source: "file:///" + filePath
    audioOutput: AudioOutput {}
    videoOutput: videoOutput
}

VideoOutput {
    id: videoOutput
    anchors.fill: parent
}
```

## 迷你播放器

AL 项目有独立窗口迷你播放器 + 系统托盘的需求：

```cpp
// 创建独立迷你播放器窗口
QWidget *miniPlayer = new QWidget;
miniPlayer->setWindowFlags(
    Qt::WindowStaysOnTopHint | Qt::FramelessWindowHint);
miniPlayer->setFixedSize(320, 60);

// 系统托盘
QSystemTrayIcon *tray = new QSystemTrayIcon(this);
tray->setIcon(QIcon(":/icons/app.png"));
tray->show();
connect(tray, &QSystemTrayIcon::activated,
    [](QSystemTrayIcon::ActivationReason reason) {
    // 处理点击
});
```

## CMake 配置

```cmake
find_package(Qt6 REQUIRED COMPONENTS Multimedia MultimediaWidgets)
target_link_libraries(app PRIVATE
    Qt6::Multimedia Qt6::MultimediaWidgets)
```

## 性能收益

与 Electron 原方案对比：

| 指标 | Electron (ffmpeg 子进程) | Qt6 C++ |
|------|--------------------------|---------|
| 首帧延迟 | ~300-500ms | ~100-200ms |
| 内存占用 | 需管道缓冲 | 零拷贝 |
| 格式支持 | 依赖 Chromium 解码器 | FFmpeg 全格式 |

## 注意事项

1. **QMediaPlayer 必须挂 QAudioOutput**，否则完全无声
2. 一个 QMediaPlayer 同一时间只能挂一个视频输出
3. 非原生格式自动通过 FFmpeg 后端解码
4. 缩略图生成建议用 FFmpeg C API 直调，比 QVideoSink 截帧更高效