import { createPinia } from 'pinia'
export { useThemeStore } from '@/stores/theme'
export { useLayoutStore } from '@/stores/layout'
const pinia = createPinia()
export { pinia }