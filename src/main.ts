import { createApp as createVueApp } from 'vue'
import { createHead } from '@vueuse/head'
import App from '@/App.vue'
import { createAppRouter } from '@/router'
import { pinia } from '@/stores'

/** vite-ssg 要求导出的 createApp：SSR 阶段用它预渲染每个路由 */
export function createApp() {
  const app = createVueApp(App)
  const head = createHead()
  const router = createAppRouter()

  app.use(head)
  app.use(router)
  app.use(pinia)

  return { app, router, head }
}

// 仅客户端挂载
if (!import.meta.env.SSR) {
  const { app } = createApp()
  app.mount('#app')
}