import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from './views/DashboardView.vue'

/* 所有路由共享 DashboardView 作为背景，
   路径带 overlay 参数时覆盖层显示在 Dashboard 上方 */
const routes = [
  {
    path: '/',
    name: 'home',
    component: DashboardView,
  },
  {
    path: '/skills',
    name: 'skills',
    component: DashboardView,
    meta: { overlay: 'skills' },
  },
  {
    path: '/projects',
    name: 'projects',
    component: DashboardView,
    meta: { overlay: 'projects' },
  },
  {
    path: '/blog',
    name: 'blog',
    component: DashboardView,
    meta: { overlay: 'blog' },
  },
  {
    path: '/contact',
    name: 'contact',
    component: DashboardView,
    meta: { overlay: 'contact' },
  },
  {
    path: '/about',
    name: 'about',
    component: DashboardView,
    meta: { overlay: 'about' },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
