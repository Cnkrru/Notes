import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

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
    history: createWebHistory(),
    routes,
    scrollBehavior() {
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