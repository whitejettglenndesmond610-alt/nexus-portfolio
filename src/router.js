/*
 * ============================================================================
 * router.js — Vue Router 路由配置文件
 * ============================================================================
 *
 * 【什么是 vue-router？】
 * vue-router 是 Vue 官方的路由库，负责管理“URL”和“页面组件”之间的对应关系。
 * 简单说：用户在浏览器地址栏输入不同的路径（如 /skills），vue-router 就帮我们
 * 显示对应的组件内容，而不用刷新整个页面。这就是 SPA（单页应用）的核心。
 *
 * 【为什么要用 vue-router 而不是直接操作 DOM？】
 * 如果用原生 JS 手动切换页面内容（document.createElement、innerHTML 等），
 * 代码会又乱又难维护，而且浏览器的“前进/后退”按钮也会失效。
 * vue-router 自动处理了这些，还提供了编程式导航（router.push）、
 * 路由守卫、懒加载等高级功能。
 */

import { createRouter, createWebHistory } from 'vue-router'
/*
 * createRouter —— 创建一个路由实例（核心控制器）
 * createWebHistory —— 使用 HTML5 的 History 模式（URL 像正常网站，没有 # 号）
 *
 * 对比：如果使用 createWebHashHistory，URL 会变成 /#/skills 这种带 # 的形式。
 * 这里用 createWebHistory 是为了让 URL 看起来干净，像传统多页网站一样。
 */

import DashboardView from './views/DashboardView.vue'
/*
 * 引入主页面组件。
 * 注意：这里不是懒加载（import()），是直接导入的。
 * 因为 DashboardView 是所有路由共用的背景组件，每个页面都需要它，
 * 所以直接导入没问题。
 */

/*
 * ============================================================================
 * routes 路由表
 * ============================================================================
 *
 * 【为什么所有路由都用同一个 DashboardView 组件？】
 * 这是本项目的核心设计模式 —— “覆盖层系统”（Overlay System）。
 *
 * 想象一下：DashboardView 就像一张永远存在的“桌面壁纸”，上面有粒子特效、
 * 网格线等背景元素。不同的页面（技能、项目、博客等）以“浮窗/覆盖层”的形式
 * 悬浮在这张壁纸上方，而不是完全替换它。
 *
 * 这样做的好处：
 * 1. 切换页面时，背景（粒子、动画）不会被打断或重新初始化
 * 2. 页面切换有 GSAP 平滑过渡效果
 * 3. 用户始终有“在一个连贯空间里浏览”的沉浸感
 */

const routes = [
  /*
   * 首页路由
   * 路径：/
   * 没有 meta.overlay 字段 → 不显示任何覆盖层，只显示纯 Dashboard
   */
  {
    path: '/',           // URL 路径，用户访问 http://xxx.com/ 时匹配
    name: 'home',        // 路由名称，方便用 router.push({ name: 'home' }) 跳转
    component: DashboardView,
  },

  /*
   * 技能页路由
   * 路径：/skills
   * meta.overlay: 'skills' → App.vue 检测到后，会在 Dashboard 上方
   *                         显示 OverlaySkills 覆盖层组件
   */
  {
    path: '/skills',
    name: 'skills',
    component: DashboardView,
    meta: { overlay: 'skills' },
    /*
     * meta（元信息）是一个可以放任意自定义数据的对象。
     * 这里的 overlay 字段是本项目约定的“覆盖层标识”。
     * App.vue 里会读取 route.meta.overlay 来决定显示哪个浮窗组件。
     * 映射关系（在 App.vue 中处理）：
     *   'skills'   → OverlaySkills.vue
     *   'projects' → OverlayProjects.vue
     *   'blog'     → OverlayBlog.vue
     *   'contact'  → OverlayContact.vue
     *   'about'    → OverlayAbout.vue
     */
  },

  /*
   * 项目页路由
   */
  {
    path: '/projects',
    name: 'projects',
    component: DashboardView,
    meta: { overlay: 'projects' },
  },

  /*
   * 博客页路由
   */
  {
    path: '/blog',
    name: 'blog',
    component: DashboardView,
    meta: { overlay: 'blog' },
  },

  /*
   * 联系方式页路由
   */
  {
    path: '/contact',
    name: 'contact',
    component: DashboardView,
    meta: { overlay: 'contact' },
  },

  /*
   * 关于我页面路由
   */
  {
    path: '/about',
    name: 'about',
    component: DashboardView,
    meta: { overlay: 'about' },
  },

  /*
   * =========================================================================
   * 兜底路由（Catch-all / 404 处理）
   * =========================================================================
   *
   * 路径：/:pathMatch(.*)*
   * 这个正则表达式匹配“所有上面没匹配到的路径”。
   *
   * 拆解：
   *   :pathMatch  → 动态路由参数名（可以随便取名，这里叫 pathMatch）
   *   (.*)        → 正则：匹配任意字符，任意次数
   *   *           → 表示这个参数可以包含多个路径段（如 a/b/c）
   *
   * 例如用户访问 /asdf、/xyz/123 等不存在的路径，都会被这个路由捕获，
   * 然后重定向（redirect）到首页 /。
   *
   * 如果不加这个，用户访问不存在的路径时会看到空白页面。
   */
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',       // redirect 是 vue-router 内置的重定向功能
  },
]

/*
 * ============================================================================
 * 创建路由实例
 * ============================================================================
 */

const router = createRouter({
  /*
   * history: createWebHistory()
   * 使用 HTML5 History API。URL 看起来是这样的：
   *   https://example.com/skills （干净，没有 # 号）
   *
   * 注意事项：
   *   部署时需要服务器配置支持（如 nginx try_files、vercel rewrites），
   *   把所有路径都指向 index.html，否则刷新页面会 404。
   *   本项目在 vercel.json 中已经配置了 SPA 重写规则。
   */
  history: createWebHistory(),

  /*
   * 路由表
   * 把上面定义好的 routes 数组传进去
   */
  routes,

  /*
   * scrollBehavior（滚动行为）
   * 每次路由切换时，页面滚动位置会回到顶部 (top: 0)。
   *
   * 为什么需要这个？
   * SPA 切换页面时，浏览器不会自动重置滚动位置（不像传统页面那样）。
   * 如果不处理的话，用户在 /skills 往下滚了一段距离，然后跳到 /contact，
   * 页面可能还停在之前滚动的位置，体验很差。
   *
   * 这里返回 { top: 0 } 表示每次切换路由都滚回最顶部。
   * 也可以返回 savedPosition（保留之前的滚动位置）或自定义位置。
   *
   * 完整的 scrollBehavior 签名：
   *   scrollBehavior(to, from, savedPosition) { ... }
   *   - to：目标路由
   *   - from：来源路由
   *   - savedPosition：浏览器记录的位置（前进/后退时可用）
   */
  scrollBehavior() {
    return { top: 0 }
  },
})

/*
 * ============================================================================
 * 导出路由实例
 * ============================================================================
 *
 * 这个 router 会被 main.js 导入，然后通过 app.use(router) 注册到 Vue 应用中。
 *
 * 【router.push 是什么？】
 * router.push('/skills') 等同于点击一个 <router-link to="/skills">，
 * 会改变浏览器地址并触发对应的组件渲染，但不刷新整页。
 *
 * 【为什么不直接操作 DOM 来切换页面？】
 * 想象你写了一堆 document.querySelector('.page').innerHTML 来换内容：
 *   - 浏览器地址栏的 URL 不会变
 *   - 用户点“后退”按钮回不去
 *   - 搜索引擎无法索引你的页面
 *   - 代码散落各地，难以维护
 * vue-router 通过统一的路由表解决了这些问题。
 */

export default router
