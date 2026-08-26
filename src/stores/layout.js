import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLayoutStore = defineStore('layout', () => {
  const sidebarCollapsed = ref(false)
  const tocCollapsed = ref(false)

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
    savePreference()
  }

  function toggleToc() {
    tocCollapsed.value = !tocCollapsed.value
    savePreference()
  }

  function savePreference() {
    try {
      localStorage.setItem('notes-layout', JSON.stringify({
        sidebar: sidebarCollapsed.value,
        toc: tocCollapsed.value
      }))
    } catch (e) {
      // ignore
    }
  }

  function initLayout() {
    try {
      const saved = localStorage.getItem('notes-layout')
      if (saved) {
        const data = JSON.parse(saved)
        if (typeof data.sidebar === 'boolean') sidebarCollapsed.value = data.sidebar
        if (typeof data.toc === 'boolean') tocCollapsed.value = data.toc
      }
    } catch (e) {
      // ignore
    }
  }

  return {
    sidebarCollapsed,
    tocCollapsed,
    toggleSidebar,
    toggleToc,
    initLayout
  }
})