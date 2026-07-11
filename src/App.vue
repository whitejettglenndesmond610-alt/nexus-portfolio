<!--
  根组件 — 赛博朋克仪表盘 + 路由器驱动的覆盖层系统
  App.vue 是整个 Vue 3 应用的"根"，所有其他组件都在它的肚子里渲染。
-->
<script setup>
/*
  setup 模式（<script setup>）是 Vue 3 的语法糖，代码更简洁。
  不需要写 export default，直接写逻辑即可。
*/

/*
  ============================================
  导入依赖
  ============================================
*/
// Vue 3 核心 API：
//   ref    → 创建响应式数据（数据变了，界面自动跟着变）
//   provide → 向所有子组件"提供"数据/方法，子组件用 inject 接收
//   nextTick → 等 Vue 把 DOM 更新完了再执行回调
//   onMounted → 组件挂载到页面后执行（类似 window.onload）
//   watch → 监听某个值的变化，变化时自动执行回调
import { ref, provide, nextTick, onMounted, watch } from 'vue'

// Vue Router：
//   useRouter → 获取路由器实例，用来跳转页面（router.push）
//   useRoute  → 获取当前路由信息（比如当前的 URL、meta 元数据等）
import { useRouter, useRoute } from 'vue-router'

// Naive UI 组件库：
//   NConfigProvider  → 主题配置的"容器"，包裹它之后所有子组件都使用统一主题
//   NMessageProvider → 消息/通知的"容器"，包裹后子组件可以弹出 Toast 通知
import { NConfigProvider, NMessageProvider } from 'naive-ui'

// 导入我们自定义的赛博朋克主题配色（在 theme.js 里定义的 token 对象）
import { cyberTheme } from './theme.js'

// GSAP — 一个强大的动画库，用来做流畅的缩放、模糊、淡入淡出等动效
import gsap from 'gsap'

// 导入子组件：
//   CrosshairCursor → 自定义的十字准星光标
//   OverlayXxx      → 各个覆盖层页面（技能、项目、博客、联系、关于）
import CrosshairCursor from './components/CrosshairCursor.vue'
import OverlaySkills  from './views/OverlaySkills.vue'
import OverlayProjects from './views/OverlayProjects.vue'
import OverlayContact  from './views/OverlayContact.vue'
import OverlayAbout    from './views/OverlayAbout.vue'
import OverlayBlog     from './views/OverlayBlog.vue'

/*
  ============================================
  路由实例
  ============================================
*/
const router = useRouter() // 路由器，用来执行页面跳转（比如回到首页）
const route  = useRoute()  // 当前路由对象，可以读取 route.meta、route.name 等

/*
  ============================================
  响应式状态（用 ref 包裹的值）
  ============================================
  ref() 是 Vue 3 创建响应式数据的方式。
  ref 就像一个"盒子"，把值装进去。读的时候用 .value，模板里自动解包不用写 .value
*/

// activeOverlay → 当前正在显示的覆盖层名称（'skills' / 'about' / null 等）
//    如果值为 null，表示没有覆盖层打开，用户看到的是仪表盘主页
const activeOverlay  = ref(null)

// transitionLock → 转场锁，防止双击或快速连点导致动画冲突
//    当为 true 时，新的覆盖层切换请求会被忽略掉
const transitionLock = ref(false)

// dashboardEl → 模板中 ref="dashboardEl" 的 DOM 元素引用
//    通过 ref 拿到 DOM 节点，之后用 GSAP 在这个元素上做动画
const dashboardEl    = ref(null)

// loading → 控制加载屏的显示/隐藏
//    初始为 true（显示加载屏），2200ms 后变为 false（隐藏）
const loading        = ref(true)

/*
  ============================================
  加载屏逻辑
  ============================================
  onMounted 是 Vue 的生命周期钩子，组件挂载到页面后执行一次。
  这里用 setTimeout 延迟 2200ms 后把 loading 设成 false，
  触发模板中 v-if="loading" 的加载屏消失。
*/
onMounted(() => { setTimeout(() => { loading.value = false }, 2200) })

/*
  ============================================
  路由 → 覆盖层同步
  ============================================
  watch 用于监听某个值的变化。这里监听 route.meta.overlay。
  每个路由在 router.js 里都配置了 meta.overlay 字段，比如：
    { name: 'skills', meta: { overlay: 'skills' } }
    { name: 'home',   meta: { overlay: null }      }

  当用户点击导航或浏览器前进/后退，路由变化时：
    1. 读取 route.meta.overlay 的新值
    2. 如果和当前 activeOverlay 不同，调用 openOverlay 更新
    3. immediate: true → 组件一挂载就立刻执行一次（不是等到变化才执行）
*/
watch(() => route.meta.overlay, (val) => {
  if (val !== activeOverlay.value) {
    openOverlay(val || null, true)
  }
}, { immediate: true })

/*
  ============================================
  打开覆盖层
  ============================================
  openOverlay(id, fromRoute)：
    id        → 覆盖层的名称（'skills', 'about' 等）
    fromRoute → 是否由路由变化触发（true 表示来自 watch，false 表示用户直接调用）

  逻辑：
    1. 如果 id 为空（null），说明要关闭当前覆盖层 → 执行关闭动画
    2. 如果转场锁锁着，或者要打开的已经是当前覆盖层 → 忽略
    3. 如果来自用户点击（不是路由触发），则先调用 router.push 更新 URL
    4. 锁住转场，更新 activeOverlay
    5. 等 nextTick（DOM 更新后）用 GSAP 把仪表盘缩小、模糊、变暗
       → 制造"覆盖层从仪表盘上方弹出"的景深效果
    6. 500ms 后解锁转场
*/
function openOverlay(id, fromRoute = false) {
  if (!id) {
    // 关闭当前覆盖层：GSAP 动画恢复仪表盘 → 动画完成后把 activeOverlay 置 null
    if (activeOverlay.value) {
      const el = dashboardEl.value
      if (el) {
        gsap.to(el, { scale: 1, filter: 'blur(0px) brightness(1)', duration: 0.4, ease: 'power3.out',
          onComplete: () => { activeOverlay.value = null }
        })
      } else { activeOverlay.value = null }
    }
    return
  }

  // 如果转场被锁，或要打开的已经打开 → 直接返回，不做重复操作
  if (transitionLock.value || id === activeOverlay.value) return

  // 如果这次调用不是由路由变化触发的（是用户点击导航按钮触发的），
  // 则需要手动更新 URL，让浏览器地址栏同步
  if (!fromRoute) router.push({ name: id })

  // 上锁，防止快速点击导致动画冲突
  transitionLock.value = true
  activeOverlay.value = id

  // nextTick：等 Vue 更新完 DOM（覆盖层组件渲染出来）后再执行动画
  nextTick(() => {
    if (dashboardEl.value) {
      // GSAP 动画：仪表盘缩小到 92%，加模糊 + 变暗，模拟景深效果
      gsap.to(dashboardEl.value, { scale: 0.92, filter: 'blur(4px) brightness(0.55)', duration: 0.45, ease: 'power3.out' })
    }
    // 500ms 后释放转场锁，允许下一次切换
    setTimeout(() => { transitionLock.value = false }, 500)
  })
}

/*
  ============================================
  关闭覆盖层
  ============================================
  closeOverlay() 被覆盖层组件通过 @close 事件触发。
  流程：
    1. 如果转场锁锁着 → 忽略
    2. router.push({ name: 'home' }) → 回到首页路由（不是直接操作 DOM）
    3. 上锁
    4. GSAP 动画恢复仪表盘：scale 回 1，去掉模糊和暗角
    5. 动画完成后把 activeOverlay 置 null（覆盖层消失），释放锁
*/
function closeOverlay() {
  if (transitionLock.value) return

  // 通过路由跳转回到首页，这会触发 watch 同步关闭覆盖层
  router.push({ name: 'home' })
  transitionLock.value = true

  const el = dashboardEl.value
  if (el) {
    gsap.to(el, { scale: 1, filter: 'blur(0px) brightness(1)', duration: 0.4, ease: 'power3.out',
      onComplete: () => { activeOverlay.value = null; transitionLock.value = false }
    })
  } else {
    activeOverlay.value = null; transitionLock.value = false
  }
}

/*
  ============================================
  provide — 依赖注入
  ============================================
  provide('名字', 值) 把数据/方法"提供"出去，所有子孙组件都能用 inject 拿到。
  这里提供两个方法：
    openOverlay → 子组件可以调用它来打开某个覆盖层
    closeOverlay → 子组件可以调用它来关闭覆盖层
  类似 React 的 Context，但不需要 Provider 组件包裹。
*/
provide('openOverlay', (id) => openOverlay(id))
provide('closeOverlay', closeOverlay)
</script>

<template>
  <!--
    NConfigProvider：Naive UI 的主题配置容器
      :theme-overrides="cyberTheme" →
        把 theme.js 中定义的自定义配色（赛博朋克风）注入到所有 Naive UI 组件中
        这样 n-button、n-modal 等组件都会自动使用我们的颜色方案
  -->
  <NConfigProvider :theme-overrides="cyberTheme">
    <!--
      NMessageProvider：Naive UI 的消息/通知容器
        包裹它之后，子组件可以用 useMessage() 弹出 Toast 通知条
    -->
    <NMessageProvider>
      <div class="app-root">

        <!--
          ========== 加载屏 ==========
          Transition 是 Vue 内置的过渡组件，name="fade" 对应下方 .fade-* 的 CSS 类
          v-if="loading" → 当 loading 为 true 时显示加载屏，false 时移除（触发离场动画）
        -->
        <Transition name="fade">
          <div v-if="loading" class="loader-screen">
            <div class="loader-center">
              <div class="loader-logo">
                <span class="loader-bracket">[</span>
                <span class="loader-text">NEXUS</span>
                <span class="loader-bracket">]</span>
              </div>
              <div class="loader-bar-wrap">
                <div class="loader-bar"></div>
              </div>
              <span class="loader-status">INITIALIZING_SYSTEM…</span>
            </div>
          </div>
        </Transition>

        <!--
          ========== 粒子画布 ==========
          canvas 元素，id="particleCanvas"，main.js 中会用 JS 在上面绘制粒子动画
          position:fixed + inset:0 → 覆盖整个屏幕
          z-index:0 → 最底层
          pointer-events:none → 不响应鼠标事件（点击会穿透到下面的元素）
        -->
        <canvas class="particle-canvas" id="particleCanvas"></canvas>

        <!-- 自定义十字准星光标组件（替代默认鼠标指针） -->
        <CrosshairCursor />

        <!--
          ========== 扫描线效果 ==========
          纯 CSS 的扫描线纹理层，覆盖在整个屏幕上
          z-index:9990 → 在最上层但低于加载屏
        -->
        <div class="scanlines"></div>

        <!--
          ========== 仪表盘容器 ==========
          ref="dashboardEl" → 在 script 中通过 dashboardEl.value 拿到这个 div 的 DOM 引用
          这个容器包裹 router-view，GSAP 动画就是作用在它上面的
          will-change: transform, filter → 提示浏览器预先为 GPU 加速做准备
        -->
        <div ref="dashboardEl" class="dashboard-wrapper">
          <!--
            router-view → Vue Router 的占位符
            根据当前 URL 动态渲染对应的页面组件（比如 DashboardView）
            所有路由共用一个 DashboardView，只是 meta.overlay 不同
          -->
          <router-view />
        </div>

        <!--
          ========== 覆盖层系统 ==========
          Transition name="overlay" → 对应 .overlay-enter-active 等 CSS 过渡类
          用 v-if / v-else-if 链来控制哪个覆盖层显示：
            - 只有 activeOverlay 匹配的组件会被渲染
            - 同一时间最多只有一个显示
            - @close="closeOverlay" → 子组件 emit('close') 时调用关闭方法

          覆盖层顺序：
            skills → 技能页面覆盖层
            projects → 项目页面覆盖层
            blog → 博客页面覆盖层
            contact → 联系方式覆盖层
            about → 关于页面覆盖层
        -->
        <Transition name="overlay">
          <OverlaySkills   v-if="activeOverlay === 'skills'"    @close="closeOverlay" />
          <OverlayProjects v-else-if="activeOverlay === 'projects'" @close="closeOverlay" />
          <OverlayBlog     v-else-if="activeOverlay === 'blog'"     @close="closeOverlay" />
          <OverlayContact  v-else-if="activeOverlay === 'contact'"  @close="closeOverlay" />
          <OverlayAbout    v-else-if="activeOverlay === 'about'"    @close="closeOverlay" />
        </Transition>

      </div>
    </NMessageProvider>
  </NConfigProvider>
</template>

<style>
/*
  ============================================
  全局样式 & 赛博朋克视觉系统
  ============================================
*/

/*
  @import 引入 Google Fonts（网络字体）
    'Share Tech Mono' → 等宽技术风字体，用于状态文字
    'Rajdhani'        → 干净的无衬线字体，用于正文
    'Orbitron'        → 未来科技风字体，用于 Logo
  display=swap → 字体下载期间先用系统字体显示，下载完再切换（避免白屏）
*/
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@300;400;500;600;700&family=Orbitron:wght@400;500;600;700;800;900&display=swap');

/* ---- 全局重置 ---- */
/* box-sizing: border-box → padding 和 border 都算在元素的宽高内，布局更可控 */
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

/* -webkit-font-smoothing: antialiased → macOS 上文字渲染更平滑 */
html { -webkit-font-smoothing: antialiased; }

body {
  font-family: 'Rajdhani','Inter',sans-serif;
  background: #08080c;       /* 深色背景，接近纯黑 */
  color: #E8ECF0;            /* 浅色文字，在深色背景上高对比 */
  line-height: 1.5;
  overflow: hidden;           /* 禁止页面滚动，因为这是全屏 SPA 应用 */
  height: 100vh;              /* 占满整个视口高度 */
  cursor: none;               /* 隐藏默认鼠标指针，用自定义的 CrosshairCursor 替代 */
}

/* #app 是 Vue 挂载的根元素 */
#app { height: 100vh; overflow: hidden; }

/* .app-root 是应用的最外层容器 */
.app-root { position: relative; width: 100%; height: 100vh; }

/* ---- 粒子画布 ---- */
.particle-canvas {
  position: fixed;           /* 固定定位，不随滚动移动 */
  inset: 0;                  /* 等于 top:0; right:0; bottom:0; left:0; — 铺满全屏 */
  z-index: 0;                /* 最低层，其他元素都在它上面 */
  pointer-events: none;      /* 鼠标事件穿透，点击不会落在 canvas 上 */
}

/* ---- 仪表盘容器 ---- */
.dashboard-wrapper {
  position: relative;
  z-index: 1;                /* 在粒子 canvas 之上 */
  /*
    will-change: transform, filter →
      提前告诉浏览器"这个元素的 transform 和 filter 属性会频繁变化"，
      浏览器会为它启用 GPU 硬件加速，使 GSAP 动画更流畅
  */
  will-change: transform, filter;
  height: 100vh;
}

/* ---- 扫描线纹理效果 ---- */
.scanlines {
  position: fixed;
  inset: 0;
  pointer-events: none;     /* 不阻挡鼠标 */
  z-index: 9990;            /* 几乎最上层，覆盖所有内容但低于加载屏 */
  /*
    repeating-linear-gradient(0deg, ...) →
      垂直方向（从上到下）重复的线性渐变
      transparent 3px → 透明 3 像素
      rgba(0,0,0,.04) 3px-5px → 极淡的半透明黑色条纹
      效果：像老式 CRT 显示器的扫描线纹理
  */
  background: repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,.04) 3px, rgba(0,0,0,.04) 5px);
}

/* 扫描线的移动高亮条（模拟 CRT 刷新效果） */
.scanlines::after {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 100%;
  height: 2px;
  background: rgba(255, 230, 0, .06);  /* 极淡的黄色高亮线 */
  animation: scanMove 6s linear infinite;  /* 6 秒一次，线性匀速，无限循环 */
}

/*
  @keyframes scanMove →
    定义"扫描线从上往下移动"的关键帧动画
    0% 时 top 在 -2px（屏幕上方之外）
    100% 时 top 在 100%（屏幕最底部）
*/
@keyframes scanMove { 0% { top: -2px; } 100% { top: 100%; } }

/* ---- 加载屏 ---- */
.loader-screen {
  position: fixed;
  inset: 0;
  z-index: 99999;           /* 最顶层，覆盖所有内容甚至扫描线 */
  background: #08080c;      /* 和 body 背景一致 */
  display: flex;
  align-items: center;      /* 垂直居中 */
  justify-content: center;  /* 水平居中 */
}

.loader-center { text-align: center; }

/* Logo 字体使用 Orbitron 营造科技感 */
.loader-logo { font-family: 'Orbitron', monospace; font-size: 2rem; margin-bottom: 2rem; }
.loader-bracket { color: #FFE600; }  /* 黄色方括号 [ ] */
.loader-text {
  color: #FFE600;
  /*
    text-shadow → 文字发光效果
    0 0 20px #FFE600 → 水平偏移0 垂直偏移0 模糊半径20px 黄色光晕
  */
  text-shadow: 0 0 20px #FFE600;
  letter-spacing: .3em;     /* 字母间距加宽，更有设计感 */
}

/* 加载进度条的轨道 */
.loader-bar-wrap {
  width: 200px;
  height: 3px;
  background: rgba(255, 230, 0, .15);  /* 半透明黄色底色作为"轨道" */
  margin: 0 auto 1rem;
  overflow: hidden;         /* 隐藏超出部分，让加载条从 0 到 100% 自然展开 */
}

/* 加载进度条 */
.loader-bar {
  height: 100%;
  width: 0;                 /* 初始宽度为 0 */
  background: #FFE600;
  box-shadow: 0 0 10px #FFE600;  /* 发光效果 */
  animation: loadBar 2s ease-in-out forwards;
  /*
    loadBar 动画：2 秒完成，缓入缓出
    forwards → 动画结束后保持在最终状态（width: 100%）
  */
}

/*
  @keyframes loadBar →
    加载进度条从 0% 到 100% 的宽度变化
    不是均匀增长，而是模拟真实加载的节奏：
    0%→40% 快、40%→55% 慢、55%→90% 再加速、90%→100% 收尾
*/
@keyframes loadBar {
  0%   { width: 0; }
  30%  { width: 40%; }
  60%  { width: 55%; }
  85%  { width: 90%; }
  100% { width: 100%; }
}

/* 加载状态文字 */
.loader-status {
  font-family: 'Share Tech Mono', monospace;
  font-size: .6rem;
  color: #5C6670;           /* 灰色，低调不抢眼 */
  letter-spacing: .2em;
  /*
    loadBlink 闪烁动画：
    8s → 0.8 秒一个周期
    step-end → 不是平滑过渡，而是跳跃式（突然显示 → 突然消失）模拟终端光标闪烁
    50% 时 opacity 变为 0（消失），其他时候 opacity 为 1（显示）
  */
  animation: loadBlink .8s step-end infinite;
}
@keyframes loadBlink { 50% { opacity: 0; } }

/*
  ============================================
  Vue Transition 过渡动画的 CSS 类
  ============================================
  Vue 的 Transition 组件会根据 name 属性自动添加以下类：
    - {name}-enter-active / {name}-leave-active → 过渡进行中
    - {name}-enter-from / {name}-leave-to → 过渡开始/结束时的状态
*/

/* 覆盖层的过渡动画：淡入淡出 */
.overlay-enter-active { transition: opacity .3s ease; }   /* 进入动画 0.3 秒 */
.overlay-leave-active { transition: opacity .2s ease; }   /* 离开动画 0.2 秒 */
.overlay-enter-from, .overlay-leave-to { opacity: 0; }     /* 进入起点 = 离开终点 = 完全透明 */

/* 加载屏的过渡动画：只处理离场（进入加载屏是初始状态，不需要动画） */
.fade-leave-active { transition: opacity .4s ease; }       /* 消失动画 0.4 秒 */
.fade-leave-to { opacity: 0; }                             /* 消失终点 = 完全透明，页面渐隐 */
</style>
