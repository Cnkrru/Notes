<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = withDefaults(defineProps<{
  volume?: number;
  isMuted?: boolean
}>(), {
  volume: 0.7,
  isMuted: false
})

const emit = defineEmits<{
  'adjust-volume': [percent: number];
  'toggle-mute': []
}>()

const volumeBarRef = ref(null)
let isDragging = false

const handleVolumeChange = (e: MouseEvent) => {
  if (!volumeBarRef.value) return
  const rect = volumeBarRef.value.getBoundingClientRect()
  const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
  emit('adjust-volume', percent)
}

const onMouseMove = (e: MouseEvent) => {
  if (!isDragging || !volumeBarRef.value) return
  const rect = volumeBarRef.value.getBoundingClientRect()
  const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
  emit('adjust-volume', percent)
}

const onMouseUp = () => {
  isDragging = false
}

const onMouseDown = () => {
  isDragging = true
}

watch(() => props.volume, (val) => {
  const fill = document.getElementById('volume-fill')
  const handle = document.getElementById('volume-handle')
  if (fill) fill.style.width = `${val * 100}%`
  if (handle) handle.style.right = `-${5 - val * 5}px`
})

watch(() => props.isMuted, (val) => {
  const container = document.querySelector('.player-volume')
  if (container) {
    container.classList.toggle('muted', val)
    container.classList.toggle('volume-low', !val && props.volume < 0.3)
  }
})

onMounted(() => {
  if (typeof document !== 'undefined') {
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }
})

onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }
})
</script>

<template>
  <div class="player-volume" :class="{ muted: isMuted, 'volume-low': !isMuted && volume < 0.3 }">
    <button
      type="button"
      class="volume-btn"
      aria-label="静音"
      title="静音"
      @click="emit('toggle-mute')"
    >
      <img class="volume-icon" src="/img/svg/volume.svg" alt="音量" width="16" height="16" />
      <img class="mute-icon" src="/img/svg/mute.svg" alt="静音" width="16" height="16" />
      <img class="volume-low-icon" src="/img/svg/volume-low.svg" alt="低音量" width="16" height="16" />
    </button>
    <div
      class="volume-bar"
      ref="volumeBarRef"
      @click="handleVolumeChange"
      @mousedown="onMouseDown"
    >
      <div id="volume-fill" class="volume-fill" :style="{ width: `${volume * 100}%` }"></div>
      <div id="volume-handle" class="volume-handle"></div>
    </div>
  </div>
</template>