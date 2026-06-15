<script setup lang="ts">
withDefaults(defineProps<{ isPlaying?: boolean; currentSong?: any }>(), {
  isPlaying: false,
  currentSong: null
})

const emit = defineEmits<{
  'toggle-play': [];
  prev: [];
  next: [] 
}>()

const handleTogglePlay = () => {
  emit('toggle-play')
}

const handlePrev = () => {
  emit('prev')
}

const handleNext = () => {
  emit('next')
}
</script>

<template>
  <div class="player-controls">
    <button
      type="button"
      class="control-btn"
      aria-label="上一首"
      title="上一首"
      @click="handlePrev"
    >
      <img src="/img/svg/prev.svg" alt="上一首" width="16" height="16" />
    </button>

    <button
      type="button"
      class="control-btn play-btn"
      :class="{ playing: isPlaying }"
      aria-label="播放"
      title="播放/暂停"
      @click="handleTogglePlay"
    >
      <img class="play-icon" src="/img/svg/play.svg" alt="播放" width="18" height="18" />
      <img class="pause-icon" src="/img/svg/pause.svg" alt="暂停" width="18" height="18" />
    </button>

    <button
      type="button"
      class="control-btn"
      aria-label="下一首"
      title="下一首"
      @click="handleNext"
    >
      <img src="/img/svg/next.svg" alt="下一首" width="16" height="16" />
    </button>
  </div>
</template>