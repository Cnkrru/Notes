import { createRouter, createWebHistory, createMemoryHistory } from 'vue-router'
import { siteConfig } from '@/config/site'

// 页面组件注册表：src/pages/ 下的 .vue 均可通过 docRoots[].mode 绑定
const pageModules = import.meta.glob('../pages/*.vue')

function resolvePage(mode) {
  const loader = pageModules[`../pages/${mode}`]
  return loader || (() => import('../pages/NotFound.vue'))
}

// 按配置为每个挂载目录生成路由，绑定对应页面类型（meta.root 供页面识别所在目录）
const docRoutes = siteConfig.docRoots.map(root => ({
  path: `/${root.dir}/:pathMatch(.*)*`,
  component: resolvePage(root.mode),
  meta: { root: root.dir }
}))

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../pages/Home.vue')
  },
  ...docRoutes,
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