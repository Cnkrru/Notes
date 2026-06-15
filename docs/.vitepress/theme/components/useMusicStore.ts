import { reactive, computed } from 'vue'

interface Song {
  title: string
  artist: string
  cover: string
  audio: string
  backupAudio?: string[]
}

interface PlayerState {
  currentIndex: number
  currentTime: number
  isPlaying: boolean
  volume: number
  isMuted: boolean
  duration: number
  isLoading: boolean
}

const state = reactive({
  playlist: [] as Song[],
  currentIndex: 0,
  isPlaying: false,
  isPlayerVisible: false,
  isPlaylistVisible: false,
  volume: 0.7,
  isMuted: false,
  currentTime: 0,
  duration: 0,
  isLoading: false
})

let audio: HTMLAudioElement | null = null
let saveStateInterval: ReturnType<typeof setInterval> | null = null

export function useMusicStore() {
  const currentSong = computed(() => state.playlist[state.currentIndex] || null)
  const progressPercent = computed(() => {
    if (state.duration <= 0) return 0
    return (state.currentTime / state.duration) * 100
  })

  const savePlayerState = () => {
    if (!audio) return
    const playerState: PlayerState = {
      currentIndex: state.currentIndex,
      currentTime: audio.currentTime || 0,
      isPlaying: !audio.paused,
      volume: audio.volume,
      isMuted: audio.muted,
      duration: audio.duration || 0,
      isLoading: state.isLoading
    }
    localStorage.setItem('notesMusicPlayerState', JSON.stringify(playerState))
  }

  const loadPlayerState = () => {
    try {
      const saved = localStorage.getItem('notesMusicPlayerState')
      if (saved) {
        const s: PlayerState = JSON.parse(saved)
        state.currentIndex = s.currentIndex ?? 0
        state.volume = s.volume ?? 0.7
        state.isMuted = s.isMuted ?? false
        return { currentTime: s.currentTime ?? 0, isPlaying: s.isPlaying ?? false }
      }
    } catch (e) { /* ignore */ }
    return { currentTime: 0, isPlaying: false }
  }

  const initializePlayer = () => {
    if (audio) return
    audio = new Audio()
    audio.crossOrigin = 'anonymous'
    audio.volume = state.volume
    audio.muted = state.isMuted
    
    audio.addEventListener('timeupdate', () => {
      if (audio) {
        state.currentTime = audio.currentTime || 0
        state.duration = audio.duration || 0
      }
    })
    audio.addEventListener('ended', () => nextSong())
    audio.addEventListener('loadedmetadata', () => {
      if (audio) state.duration = audio.duration || 0
    })
    audio.addEventListener('play', () => { state.isPlaying = true })
    audio.addEventListener('pause', () => { state.isPlaying = false })
    audio.addEventListener('canplay', () => { state.isLoading = false })
    
    const savedState = loadPlayerState()
    loadSong(state.currentIndex)
    if (savedState.currentTime > 0) {
      audio.addEventListener('loadedmetadata', () => {
        if (audio) audio.currentTime = savedState.currentTime
      }, { once: true })
    }
    saveStateInterval = setInterval(savePlayerState, 500)
  }

  const loadSong = (index: number) => {
    const song = state.playlist[index]
    if (!song || !audio) return
    state.isLoading = true
    
    const audioPath = song.audio
    const backups = song.backupAudio || []
    let backupIndex = 0
    
    const tryLoad = (url: string) => {
      audio!.src = url
    }
    
    const handleError = () => {
      if (backupIndex < backups.length) {
        backupIndex++
        tryLoad(backups[backupIndex - 1])
      } else {
        setTimeout(nextSong, 1000)
      }
    }
    
    audio.onerror = handleError
    tryLoad(audioPath)
  }

  const togglePlay = () => {
    if (!audio) return
    if (audio.paused) {
      audio.play().catch(() => {})
    } else {
      audio.pause()
    }
    savePlayerState()
  }

  const prevSong = () => {
    if (state.playlist.length === 0) return
    const wasPlaying = state.isPlaying
    state.currentIndex = (state.currentIndex - 1 + state.playlist.length) % state.playlist.length
    loadSong(state.currentIndex)
    if (wasPlaying && audio) {
      audio.addEventListener('canplay', () => { audio?.play().catch(() => {}) }, { once: true })
    }
    savePlayerState()
  }

  const nextSong = () => {
    if (state.playlist.length === 0) return
    const wasPlaying = state.isPlaying || audio?.paused === false
    state.currentIndex = (state.currentIndex + 1) % state.playlist.length
    loadSong(state.currentIndex)
    if (wasPlaying && audio) {
      const playOnLoaded = () => {
        audio?.play().catch(() => {})
        audio?.removeEventListener('canplay', playOnLoaded)
      }
      audio.addEventListener('canplay', playOnLoaded)
    }
    savePlayerState()
  }

  const selectSong = (index: number) => {
    if (!audio) initializePlayer()
    if (index !== state.currentIndex) {
      const wasPlaying = state.isPlaying
      state.currentIndex = index
      loadSong(state.currentIndex)
      if (wasPlaying && audio) {
        audio.addEventListener('canplay', () => { audio?.play().catch(() => {}) }, { once: true })
      }
      savePlayerState()
    } else if (audio?.paused) {
      audio.play().catch(() => {})
    } else if (audio) {
      audio.pause()
    }
  }

  const seek = (percent: number) => {
    if (!audio) return
    audio.currentTime = percent * state.duration
  }

  const setVolume = (percent: number) => {
    if (!audio) return
    audio.volume = percent
    state.volume = percent
    if (percent === 0) {
      audio.muted = true
      state.isMuted = true
    } else {
      audio.muted = false
      state.isMuted = false
    }
    savePlayerState()
  }

  const toggleMute = () => {
    if (!audio) return
    audio.muted = !audio.muted
    state.isMuted = audio.muted
    savePlayerState()
  }

  const loadMusicConfig = async () => {
    try {
      const res = await fetch('/config/music.json')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      state.playlist = data.songs
      initializePlayer()
    } catch (e) {
      console.error('[MusicPlayer] 加载音乐配置失败:', e)
    }
  }

  const cleanup = () => {
    if (saveStateInterval) clearInterval(saveStateInterval)
    audio?.pause()
  }

  return {
    state,
    currentSong,
    progressPercent,
    togglePlay,
    prevSong,
    nextSong,
    selectSong,
    seek,
    setVolume,
    toggleMute,
    loadMusicConfig,
    cleanup,
    setPlayerVisible: (visible: boolean) => { state.isPlayerVisible = visible },
    togglePlaylist: () => { state.isPlaylistVisible = !state.isPlaylistVisible },
    closePlaylist: () => { state.isPlaylistVisible = false }
  }
}