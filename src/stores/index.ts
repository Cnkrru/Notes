import { createPinia } from 'pinia'
export { useThemeStore } from './theme'
export { useLayoutStore } from './layout'
const pinia = createPinia()
export { pinia }