<!-- 根组件 — 赛博朋克仪表盘 + 路由器驱动的覆盖层系统 -->
<script setup>
import { ref, provide, nextTick, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { NConfigProvider, NMessageProvider } from 'naive-ui'
import { cyberTheme } from './theme.js'
import gsap from 'gsap'

import CrosshairCursor from './components/CrosshairCursor.vue'
import OverlaySkills  from './views/OverlaySkills.vue'
import OverlayProjects from './views/OverlayProjects.vue'
import OverlayContact  from './views/OverlayContact.vue'
import OverlayAbout    from './views/OverlayAbout.vue'
import OverlayBlog     from './views/OverlayBlog.vue'

const router = useRouter()
const route  = useRoute()

const activeOverlay  = ref(null)
const transitionLock = ref(false)
const dashboardEl    = ref(null)
const loading        = ref(true)

/* ---- 加载屏 ---- */
onMounted(() => { setTimeout(() => { loading.value = false }, 2200) })

/* ---- 路由 → 覆盖层同步 ---- */
watch(() => route.meta.overlay, (val) => {
  if (val !== activeOverlay.value) {
    openOverlay(val || null, true)
  }
}, { immediate: true })

/* ---- 打开覆盖层 ---- */
function openOverlay(id, fromRoute = false) {
  if (!id) {
    // 关闭当前
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
  if (transitionLock.value || id === activeOverlay.value) return
  if (!fromRoute) router.push({ name: id })
  transitionLock.value = true
  activeOverlay.value = id
  nextTick(() => {
    if (dashboardEl.value) {
      gsap.to(dashboardEl.value, { scale: 0.92, filter: 'blur(4px) brightness(0.55)', duration: 0.45, ease: 'power3.out' })
    }
    setTimeout(() => { transitionLock.value = false }, 500)
  })
}

/* ---- 关闭覆盖层 ---- */
function closeOverlay() {
  if (transitionLock.value) return
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

provide('openOverlay', (id) => openOverlay(id))
provide('closeOverlay', closeOverlay)
</script>

<template>
  <NConfigProvider :theme-overrides="cyberTheme">
    <NMessageProvider>
      <div class="app-root">

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

        <canvas class="particle-canvas" id="particleCanvas"></canvas>
        <CrosshairCursor />
        <div class="scanlines"></div>

        <div ref="dashboardEl" class="dashboard-wrapper">
          <router-view />
        </div>

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
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@300;400;500;600;700&family=Orbitron:wght@400;500;600;700;800;900&display=swap');

*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
html { -webkit-font-smoothing: antialiased; }
body { font-family: 'Rajdhani','Inter',sans-serif; background:#08080c; color:#E8ECF0; line-height:1.5; overflow:hidden; height:100vh; cursor:none; }
#app { height:100vh; overflow:hidden; }
.app-root { position:relative; width:100%; height:100vh; }
.particle-canvas { position:fixed; inset:0; z-index:0; pointer-events:none; }
.dashboard-wrapper { position:relative; z-index:1; will-change:transform,filter; height:100vh; }

.scanlines {
  position:fixed; inset:0; pointer-events:none; z-index:9990;
  background: repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,.04) 3px,rgba(0,0,0,.04) 5px);
}
.scanlines::after {
  content:''; position:absolute; top:0; left:0; width:100%; height:2px;
  background:rgba(255,230,0,.06); animation:scanMove 6s linear infinite;
}
@keyframes scanMove { 0%{top:-2px} 100%{top:100%} }

.loader-screen { position:fixed; inset:0; z-index:99999; background:#08080c; display:flex; align-items:center; justify-content:center; }
.loader-center { text-align:center; }
.loader-logo { font-family:'Orbitron',monospace; font-size:2rem; margin-bottom:2rem; }
.loader-bracket { color:#FFE600; }
.loader-text { color:#FFE600; text-shadow:0 0 20px #FFE600; letter-spacing:.3em; }
.loader-bar-wrap { width:200px; height:3px; background:rgba(255,230,0,.15); margin:0 auto 1rem; overflow:hidden; }
.loader-bar { height:100%; width:0; background:#FFE600; box-shadow:0 0 10px #FFE600; animation:loadBar 2s ease-in-out forwards; }
@keyframes loadBar { 0%{width:0} 30%{width:40%} 60%{width:55%} 85%{width:90%} 100%{width:100%} }
.loader-status { font-family:'Share Tech Mono',monospace; font-size:.6rem; color:#5C6670; letter-spacing:.2em; animation:loadBlink .8s step-end infinite; }
@keyframes loadBlink { 50%{opacity:0} }

.overlay-enter-active { transition:opacity .3s ease; }
.overlay-leave-active { transition:opacity .2s ease; }
.overlay-enter-from,.overlay-leave-to { opacity:0; }
.fade-leave-active { transition:opacity .4s ease; }
.fade-leave-to { opacity:0; }
</style>
