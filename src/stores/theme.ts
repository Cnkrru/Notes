import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const currentTheme = ref<'light' | 'dark'>('light')

  const isDark = ref(false)

  function applyTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme.value)
    if (currentTheme.value === 'dark') {
      document.body.classList.add('dark-theme')
    } else {
      document.body.classList.remove('dark-theme')
    }
    isDark.value = currentTheme.value === 'dark'
  }

  function toggleTheme() {
    currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light'
    applyTheme()
    savePreference()
  }

  function setTheme(theme: 'light' | 'dark') {
    currentTheme.value = theme
    applyTheme()
    savePreference()
  }

  function savePreference() {
    try {
      localStorage.setItem('notes-theme', currentTheme.value)
    } catch (e) {
      // ignore
    }
  }

  function initTheme() {
    const saved = localStorage.getItem('notes-theme')
    if (saved === 'dark' || saved === 'light') {
      currentTheme.value = saved
    } else {
      currentTheme.value = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    applyTheme()
  }

  return {
    currentTheme,
    isDark,
    toggleTheme,
    setTheme,
    initTheme
  }
})