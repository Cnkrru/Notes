<script setup lang="ts">
interface Song {
  title: string
  artist: string
  cover: string
}

withDefaults(defineProps<{
  playlist?: Song[];
  currentIndex?: number;
  isVisible?: boolean
}>(), {
  playlist: () => [],
  currentIndex: 0,
  isVisible: false
})

const emit = defineEmits<{
  select: [index: number];
  close: []
}>()

const handleSelect = (index: number) => {
  emit('select', index)
}

const handleClose = () => {
  emit('close')
}

const onClickOutside = (e: MouseEvent) => {
  const container = document.querySelector('.playlist-container')
  if (container && !container.contains(e.target as Node)) {
    handleClose()
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      class="player-playlist"
      :class="{ active: isVisible }"
      @click="onClickOutside"
    >
      <div class="playlist-container" @click.stop>
        <div class="playlist-header">
          <h3>音乐列表</h3>
          <button
            type="button"
            class="close-btn"
            aria-label="关闭"
            title="关闭"
            @click="handleClose"
          >
            <img src="/img/svg/close.svg" alt="关闭" width="18" height="18" />
          </button>
        </div>
        <div class="playlist-content">
          <ul class="playlist-items">
            <li
              v-for="(song, index) in playlist"
              :key="index"
              :class="{ active: index === currentIndex }"
              @click="handleSelect(index)"
            >
              <img class="cover" :src="song.cover" :alt="song.title" />
              <div class="playlist-item-info">
                <div class="playlist-item-title">{{ song.title }}</div>
                <div class="playlist-item-artist">{{ song.artist }}</div>
              </div>
              <span class="playlist-item-status">
                <img v-if="index === currentIndex" src="/img/svg/play.svg" alt="播放中" width="16" height="16" />
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </Teleport>
</template>