<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue'
import { useMusicStore } from '../useMusicStore'
import PlayerControls from './PlayerControls.vue'
import PlayerProgress from './PlayerProgress.vue'
import PlayerVolume from './PlayerVolume.vue'
import PlayerPlaylist from './PlayerPlaylist.vue'
import MusicPlayerStyles from './MusicPlayerStyles.vue'

const playerRef = ref(null)
const toggleBtnRef = ref(null)
const playerCoverRef = ref(null)

const {
  state,
  currentSong,
  progressPercent,
  togglePlay,
  prevSong,
  nextSong,
  togglePlaylist,
  closePlaylist,
  selectSong,
  seek,
  setVolume,
  toggleMute,
  loadMusicConfig,
  cleanup,
  setPlayerVisible
} = useMusicStore()

const playlist = computed(() => state.playlist)
const currentIndex = computed(() => state.currentIndex)
const isPlaying = computed(() => state.isPlaying)
const isPlaylistVisible = computed(() => state.isPlaylistVisible)
const volume = computed(() => state.volume)
const isMuted = computed(() => state.isMuted)
const currentTime = computed(() => state.currentTime)
const duration = computed(() => state.duration)

const togglePlayer = () => {
  if (!playerRef.value) return
  playerRef.value.classList.toggle('active')
  if (toggleBtnRef.value) {
    toggleBtnRef.value.classList.toggle('active')
  }
  setPlayerVisible(playerRef.value.classList.contains('active'))
}

const handleSeek = (percent: number) => {
  seek(percent)
}

const handleVolumeChange = (percent: number) => {
  setVolume(percent)
}

const handleSelectSong = (index: number) => {
  selectSong(index)
}

const onClickOutside = (e: MouseEvent) => {
  if (isPlaylistVisible.value && playerRef.value &&
      !playerRef.value.contains(e.target as Node) &&
      toggleBtnRef.value && !toggleBtnRef.value.contains(e.target as Node)) {
    closePlaylist()
  }
}

onMounted(() => {
  nextTick(() => {
    playerRef.value = document.getElementById('global-music-player')
    toggleBtnRef.value = document.getElementById('music-player-btn')
    playerCoverRef.value = document.getElementById('player-cover')

    if (typeof document !== 'undefined') {
      document.addEventListener('click', onClickOutside)
    }

    loadMusicConfig()
  })
})

watch(currentSong, (song) => {
  if (song && playerCoverRef.value) {
    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      if (playerCoverRef.value) {
        playerCoverRef.value.src = song.cover
      }
    }
    img.src = song.cover
  }

  if (song) {
    const titleEl = document.getElementById('player-title')
    const artistEl = document.getElementById('player-artist')
    const coverEl = document.getElementById('player-cover')
    if (titleEl) titleEl.textContent = song.title
    if (artistEl) artistEl.textContent = song.artist
    if (coverEl) coverEl.src = song.cover
  }
}, { immediate: true })

watch(isPlaying, (playing) => {
  if (playerRef.value) {
    playerRef.value.classList.toggle('playing', playing)
  }
  if (playerCoverRef.value && playerCoverRef.value.parentElement) {
    playerCoverRef.value.parentElement.classList.toggle('playing', playing)
  }
})

onUnmounted(() => {
  cleanup()
  if (typeof document !== 'undefined') {
    document.removeEventListener('click', onClickOutside)
  }
})
</script>

<template>
  <MusicPlayerStyles />
  <div>
    <div
      class="music-player-btn"
      id="music-player-btn"
      title="音乐播放"
      role="button"
      tabindex="0"
      aria-label="打开音乐播放器"
      @keydown.enter="togglePlayer"
      @keydown.space.prevent="togglePlayer"
      @click="togglePlayer"
    >
      <img src="/img/svg/music-player.svg" alt="音乐播放" width="22" height="22" />
    </div>

    <Teleport to="body">
      <div id="global-music-player" class="global-music-player" ref="playerRef">
        <div class="player-content">
          <div class="player-top-row">
            <div class="player-cover">
              <img id="player-cover" src="" alt="封面">
            </div>
            <div class="player-meta">
              <h4 id="player-title">未选择歌曲</h4>
              <p id="player-artist">未知艺术家</p>
            </div>
            <PlayerControls
              :is-playing="isPlaying"
              :current-song="currentSong"
              @toggle-play="togglePlay"
              @prev="prevSong"
              @next="nextSong"
            />
            <div class="player-extra">
              <PlayerVolume
                :volume="volume"
                :is-muted="isMuted"
                @adjust-volume="handleVolumeChange"
                @toggle-mute="toggleMute"
              />
              <div class="player-list">
                <button
                  type="button"
                  class="control-btn list-btn"
                  aria-label="音乐列表"
                  title="音乐列表"
                  @click="togglePlaylist"
                >
                  <img src="/img/svg/playlist.svg" alt="音乐列表" width="16" height="16" />
                </button>
              </div>
            </div>
          </div>

          <PlayerProgress
            :current-time="currentTime"
            :duration="duration"
            :progress-percent="progressPercent"
            @seek="handleSeek"
          />
        </div>
      </div>

      <PlayerPlaylist
        :playlist="playlist"
        :current-index="currentIndex"
        :is-visible="isPlaylistVisible"
        @select="handleSelectSong"
        @close="closePlaylist"
      />
    </Teleport>
  </div>
</template>