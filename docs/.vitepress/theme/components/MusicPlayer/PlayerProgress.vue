<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = withDefaults(defineProps<{
  currentTime?: number;
  duration?: number;
  progressPercent?: number 
}>(), {
  currentTime: 0,
  duration: 0,
  progressPercent: 0
})

const emit = defineEmits<{ seek: [percent: number] }>()

const progressBarRef = ref(null)
let isDragging = false

const handleSeek = (e: MouseEvent) => {
  if (!progressBarRef.value) return
  const rect = progressBarRef.value.getBoundingClientRect()
  const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
  emit('seek', percent)
}

const onMouseMove = (e: MouseEvent) => {
  if (!isDragging || !progressBarRef.value) return
  const rect = progressBarRef.value.getBoundingClientRect()
  const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
  emit('seek', percent)
}

const onMouseUp = () => {
  isDragging = false
}

const onMouseDown = () => {
  isDragging = true
}

watch(() => props.progressPercent, (val) => {
  const fill = document.getElementById('progress-fill')
  if (fill) {
    fill.style.width = `${val}%`
  }
})

watch(() => props.currentTime, (val) => {
  const el = document.getElementById('current-time')
  if (el) {
    const minutes = Math.floor(val / 60)
    const seconds = Math.floor(val % 60)
    el.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }
})

watch(() => props.duration, (val) => {
  const el = document.getElementById('total-time')
  if (el) {
    const minutes = Math.floor(val / 60)
    const seconds = Math.floor(val % 60)
    el.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
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
  <div class="player-progress">
    <div
      class="progress-bar"
      ref="progressBarRef"
      @click="handleSeek"
      @mousedown="onMouseDown"
    >
      <div id="progress-fill" class="progress-fill" :style="{ width: `${progressPercent}%` }"></div>
    </div>
    <div class="time-display">
      <span id="current-time">{{ Math.floor(currentTime / 60) }}:{{ String(Math.floor(currentTime % 60)).padStart(2, '0') }}</span>
      <span id="total-time">{{ Math.floor(duration / 60) }}:{{ String(Math.floor(duration % 60)).padStart(2, '0') }}</span>
    </div>
  </div>
</template>