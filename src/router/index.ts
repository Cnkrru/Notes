import { createRouter, createWebHistory, createMemoryHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../pages/Home.vue')
  },
  {
    path: '/doc/:pathMatch(.*)*',
    name: 'Doc',
    component: () => import('../pages/Doc.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../pages/NotFound.vue')
  }
]

export function createAppRouter() {
  const router = createRouter({
    // SSR 阶段无 location，使用内存历史；客户端用浏览器历史
    history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
    routes,
    scrollBehavior() {
      if (import.meta.env.SSR) return { top: 0 }
      const el = document.querySelector('.doc-wrap')
      if (el) {
        el.scrollTo({ top: 0, behavior: 'smooth' })
      }
      return { top: 0 }
    }
  })
  return router
}

export default createAppRouter