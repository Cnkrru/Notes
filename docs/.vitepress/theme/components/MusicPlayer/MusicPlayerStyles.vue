<script setup lang="ts">
</script>

<template></template>

<style>
/* ============================== 播放器主体 ============================== */
.global-music-player {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translate(-50%, calc(100% + 80px));
    width: calc(100% - 40px);
    max-width: 580px;
    z-index: 1001;
    transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.global-music-player.active {
    transform: translate(-50%, 0);
}

.player-content {
    width: 100%;
    margin: 0 auto;
    padding: 16px 20px 12px;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    backdrop-filter: blur(24px) saturate(180%);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
}

.player-content::before {
    display: none;
}

.player-content {
    flex-direction: column;
}

.player-top-row {
    display: flex;
    align-items: center;
    gap: 14px;
    width: 100%;
}

/* ============================== 封面 ============================== */
.player-cover {
    width: 52px;
    height: 52px;
    flex-shrink: 0;
    border-radius: 8px;
    overflow: hidden;
}

.player-cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
}

/* ============================== 歌曲信息 ============================== */
.player-meta {
    flex: 1;
    min-width: 0;
}

#player-title {
    font-size: 14px;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0 0 3px 0;
}

#player-artist {
    font-size: 12px;
    font-weight: 400;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0;
    opacity: 0.5;
}

/* ============================== 操控按钮 ============================== */
.player-controls {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
}

.control-btn {
    width: 36px;
    height: 36px;
    border: 1px solid var(--vp-c-border);
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background-color 0.2s ease, transform 0.2s ease;
}

.control-btn:hover {
    transform: scale(1.05);
    background-color: var(--vp-c-hover);
}

.control-btn:active {
    transform: scale(0.98);
}

.control-btn img {
    width: 16px;
    height: 16px;
    object-fit: contain;
    pointer-events: none;
    filter: var(--player-icon-filter);
}

.play-btn {
    width: 40px;
    height: 40px;
    border-radius: 8px;
}

.play-btn img {
    width: 18px;
    height: 18px;
    filter: brightness(0) invert(1);
}

.play-btn:hover {
    transform: scale(1.05);
}

/* ============================== 音量 + 列表 ============================== */
.player-extra {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
    margin-left: auto;
}

.player-volume {
    display: flex;
    align-items: center;
    gap: 6px;
}

.volume-bar {
    width: 64px;
    height: 3px;
    border-radius: 1.5px;
    cursor: pointer;
    position: relative;
    overflow: visible;
}

#volume-fill {
    height: 100%;
    border-radius: 1.5px;
    width: 80%;
    transition: width 0.1s linear;
}

#volume-handle {
    position: absolute;
    right: -5px;
    top: 50%;
    transform: translateY(-50%);
    width: 10px;
    height: 10px;
    border-radius: 50%;
    cursor: pointer;
    transition: transform 0.15s ease;
}

.volume-bar:hover #volume-handle {
    transform: translateY(-50%) scale(1.3);
}

.player-list {
    display: flex;
    align-items: center;
}

.volume-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 4px;
}

.volume-btn img {
    width: 16px;
    height: 16px;
    object-fit: contain;
    filter: var(--player-icon-filter);
}

/* ============================== 第二行：进度条 ============================== */
.player-progress {
    width: 100%;
}

.progress-bar {
    width: 100%;
    height: 4px;
    border-radius: 2px;
    cursor: pointer;
    position: relative;
    overflow: visible;
}

#progress-fill {
    height: 100%;
    border-radius: 2px;
    width: 0%;
    transition: width 0.1s linear;
    position: relative;
}

#progress-fill::after {
    content: '';
    position: absolute;
    right: -6px;
    top: 50%;
    transform: translateY(-50%);
    width: 12px;
    height: 12px;
    border-radius: 50%;
    opacity: 0;
    transition: opacity 0.15s ease, transform 0.15s ease;
}

.progress-bar:hover #progress-fill::after {
    opacity: 1;
    transform: translateY(-50%) scale(1.25);
}

.time-display {
    display: flex;
    justify-content: space-between;
    font-size: 10px;
    margin-top: 3px;
    font-family: -apple-system, BlinkMacSystemFont, "SF Mono", "Menlo", monospace;
    letter-spacing: 0.2px;
    opacity: 0.4;
}

/* ============================== 图标显隐 ============================== */
.pause-icon,
.mute-icon,
.volume-low-icon {
    display: none;
}

.playing .pause-icon,
.muted .mute-icon,
.volume-low .volume-low-icon {
    display: block;
}

.playing .play-icon,
.muted .volume-icon,
.volume-low .volume-icon {
    display: none;
}

/* ============================== 播放列表弹窗 ============================== */
.player-playlist {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: none;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    padding: 20px;
    backdrop-filter: blur(10px);
}

.player-playlist.active {
    display: flex;
}

.playlist-container {
    border-radius: 16px;
    width: 100%;
    max-width: 420px;
    max-height: 70vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.playlist-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
}

.playlist-header h3 {
    font-size: 16px;
    font-weight: 600;
    margin: 0;
}

.close-btn {
    width: 30px;
    height: 30px;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    transition: background-color 0.2s ease, transform 0.2s ease;
}

.close-btn img {
    width: 18px;
    height: 18px;
    filter: brightness(0) invert(1);
}

.close-btn:hover {
    transform: scale(1.1) rotate(90deg);
}

.playlist-content {
    flex: 1;
    overflow-y: auto;
    padding: 8px 0;
}

.playlist-items {
    list-style: none;
    margin: 0;
    padding: 0;
}

.playlist-items li {
    display: flex;
    align-items: center;
    padding: 10px 20px;
    cursor: pointer;
    transition: background-color 0.15s ease;
}

.playlist-items li:first-child {
    padding-top: 12px;
}

.playlist-items li:last-child {
    padding-bottom: 12px;
}

.playlist-items img.cover {
    width: 40px;
    height: 40px;
    border-radius: 6px;
    object-fit: cover;
    margin-right: 12px;
    flex-shrink: 0;
}

.playlist-item-info {
    flex: 1;
    min-width: 0;
}

.playlist-item-title {
    font-size: 13px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 2px;
}

.playlist-item-artist {
    font-size: 11px;
    opacity: 0.5;
}

.playlist-item-status {
    font-size: 14px;
    margin-left: 10px;
    opacity: 0;
    transition: opacity 0.2s ease;
}

.playlist-item-status img {
    width: 16px;
    height: 16px;
    filter: var(--player-icon-filter);
}

.playlist-items li.active .playlist-item-status {
    opacity: 1;
}

/* ============================== 音乐播放器按钮 ============================== */
.music-player-btn {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 44px;
    height: 44px;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    z-index: 1000;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}

.music-player-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.16);
}

.music-player-btn.active {
    transform: scale(1.08);
}

.music-player-btn img {
    width: 22px;
    height: 22px;
    filter: brightness(0) invert(1);
}

.emoji-burst {
    position: absolute;
    font-size: 16px;
    animation: burst 0.6s ease-out forwards;
}

@keyframes burst {
    0% {
        opacity: 1;
        transform: scale(0);
    }
    100% {
        opacity: 0;
        transform: scale(2);
    }
}
</style>

<!-- ============================== 颜色 - 浅色主题 ============================== -->
<style>
:root {
    --player-icon-filter: none;
}

/* --- 面板 --- */
.player-content {
    background: rgba(255, 255, 255, 0.85);
    box-shadow:
        0 0 0 1px rgba(0, 0, 0, 0.06),
        0 4px 20px rgba(0, 0, 0, 0.08);
}

/* --- 封面 --- */
.player-cover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* --- 歌曲信息 --- */
#player-title {
    color: var(--vp-c-text-1);
}

#player-artist {
    color: var(--vp-c-text-1);
}

/* --- 进度条 --- */
.progress-bar {
    background: rgba(0, 0, 0, 0.06);
}

#progress-fill {
    background: var(--vp-c-brand);
}

#progress-fill::after {
    background: var(--vp-c-brand);
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.8), 0 2px 8px rgba(0, 0, 0, 0.2);
}

.time-display {
    color: var(--vp-c-text-1);
}

/* --- 操控按钮 --- */
.control-btn {
    background: transparent;
    color: var(--vp-c-text-1);
}

.control-btn:hover {
    background: rgba(0, 0, 0, 0.04);
}

.control-btn img {
    filter: none;
}

/* --- 播放按钮 --- */
.play-btn {
    background: var(--vp-c-brand);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.play-btn:hover {
    filter: brightness(1.05);
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
}

/* --- 音量条 --- */
.volume-bar {
    background: rgba(0, 0, 0, 0.06);
}

#volume-fill {
    background: var(--vp-c-brand);
}

#volume-handle {
    background: var(--vp-c-brand);
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.8), 0 2px 8px rgba(0, 0, 0, 0.2);
}

/* --- 音量按钮 --- */
.volume-btn {
    color: var(--vp-c-text-1);
}

.volume-btn img {
    filter: none;
}

/* --- 音乐按钮 --- */
.music-player-btn {
    background: var(--vp-c-brand);
}

/* --- 播放列表弹窗 --- */
.player-playlist {
    background: rgba(0, 0, 0, 0.3);
}

.playlist-container {
    background: rgba(255, 255, 255, 0.96);
    backdrop-filter: blur(24px) saturate(180%);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.playlist-header {
    background: var(--vp-c-brand);
    border-radius: 16px 16px 0 0;
}

.playlist-header h3 {
    color: #fff;
}

.close-btn {
    background: rgba(255, 255, 255, 0.2);
}

.close-btn:hover {
    background: rgba(255, 255, 255, 0.3);
}

.playlist-items li {
    border-bottom: 1px solid rgba(0, 0, 0, 0.04);
    color: var(--vp-c-text-1);
}

.playlist-items li:hover {
    background: rgba(0, 0, 0, 0.02);
}

.playlist-items li.active {
    background: rgba(0, 0, 0, 0.03);
}

.playlist-item-title {
    color: var(--vp-c-text-1);
}

.playlist-item-artist {
    color: var(--vp-c-text-1);
}

.playlist-item-status {
    color: var(--vp-c-brand);
}

.playlist-item-status img {
    filter: none;
}
</style>

<!-- ============================== 颜色 - 暗色主题 ============================== -->
<style>
.dark {
    --player-icon-filter: brightness(0) invert(1);
}

.dark .player-content {
    background: rgba(22, 22, 30, 0.92);
    box-shadow:
        0 0 0 1px rgba(255, 255, 255, 0.06),
        0 4px 20px rgba(0, 0, 0, 0.3);
}

.dark .player-cover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.dark #player-title {
    color: var(--vp-c-text-1);
}

.dark #player-artist {
    color: var(--vp-c-text-1);
}

.dark .progress-bar {
    background: rgba(255, 255, 255, 0.08);
}

.dark .time-display {
    color: var(--vp-c-text-1);
}

.dark .control-btn:hover {
    background: rgba(255, 255, 255, 0.06);
}

.dark .control-btn img {
    filter: brightness(0) invert(1);
}

.dark .volume-bar {
    background: rgba(255, 255, 255, 0.08);
}

.dark .volume-btn img {
    filter: brightness(0) invert(1);
}

.dark .player-playlist {
    background: rgba(0, 0, 0, 0.5);
}

.dark .playlist-container {
    background: rgba(22, 22, 30, 0.96);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
}

.dark .playlist-items li {
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.dark .playlist-items li:hover {
    background: rgba(255, 255, 255, 0.03);
}

.dark .playlist-items li.active {
    background: rgba(255, 255, 255, 0.04);
}

.dark .playlist-item-status img {
    filter: brightness(0) invert(1);
}
</style>

<!-- ============================== 响应式 ============================== -->
<style>
@media (max-width: 768px) {
    .global-music-player {
        bottom: 12px;
        width: calc(100% - 24px);
        max-width: 100%;
    }

    .player-content {
        padding: 12px 14px 10px;
        gap: 10px;
        border-radius: 14px;
    }

    .player-cover {
        width: 44px;
        height: 44px;
    }

    .control-btn {
        width: 32px;
        height: 32px;
    }

    .control-btn img {
        width: 14px;
        height: 14px;
    }

    .play-btn {
        width: 36px;
        height: 36px;
    }

    .play-btn img {
        width: 16px;
        height: 16px;
    }

    .volume-bar { width: 48px; }

    .music-player-btn {
        bottom: 72px;
        right: 12px;
        width: 40px;
        height: 40px;
    }

    .music-player-btn img {
        width: 20px;
        height: 20px;
    }
}

@media (max-width: 640px) {
    .global-music-player {
        bottom: 64px;
    }

    .player-content {
        padding: 10px 12px;
        border-radius: 12px;
    }

    .player-volume { display: none; }
}
</style>