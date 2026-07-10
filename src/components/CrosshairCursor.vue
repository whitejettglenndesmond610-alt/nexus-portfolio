<!--
  ============================================================================
  游戏准星光标 — CrosshairCursor.vue
  ============================================================================
  隐藏浏览器默认鼠标，显示一个 CP2077 风格的八角形瞄准器：
  - 外圈：金色 clip-path 多边形环
  - 中心点：金色发光小方块
  - 十字线：横竖两根金色细线
  通过 mousemove 事件实时跟踪鼠标位置
  ============================================================================
-->

<script setup>
/* 游戏准星光标 — 隐藏原生鼠标，显示 CP2077 八角形瞄准器 */
import { onMounted, onUnmounted, ref } from 'vue'

const cursorEl = ref(null)

/* 鼠标移动 → 更新光标位置（-18 = 半宽偏移） */
function onMove(e) {
  if (cursorEl.value) {
    cursorEl.value.style.left = (e.clientX - 18) + 'px'
    cursorEl.value.style.top  = (e.clientY - 18) + 'px'
  }
}
function onEnter() { if (cursorEl.value) cursorEl.value.style.opacity = '1' }
function onLeave() { if (cursorEl.value) cursorEl.value.style.opacity = '0' }

onMounted(() => {
  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseenter', onEnter)
  document.addEventListener('mouseleave', onLeave)
})
onUnmounted(() => {
  document.removeEventListener('mousemove', onMove)
  document.removeEventListener('mouseenter', onEnter)
  document.removeEventListener('mouseleave', onLeave)
})
</script>

<template>
  <!-- 光标本身：position:fixed + z-index:99999 确保在最顶层 -->
  <div ref="cursorEl" class="crosshair">
    <!-- 外圈：clip-path 切出八角形 -->
    <span class="ch-ring"></span>
    <!-- 中心点 -->
    <span class="ch-dot"></span>
    <!-- 水平线 -->
    <span class="ch-h"></span>
    <!-- 垂直线 -->
    <span class="ch-v"></span>
  </div>
</template>

<style scoped>
/* ===== 光标容器 ===== */
.crosshair {
  position: fixed; pointer-events: none; z-index: 99999;
  width: 36px; height: 36px; top: 0; left: 0; opacity: 1;
  will-change: left, top;                /* 硬件加速 left/top 变化 */
}

/* ===== 外圈：金色八角形边框 ===== */
.ch-ring {
  position: absolute; inset: 0;
  border: 1.5px solid #FFE600;
  /* clip-path: polygon 切出八角形 */
  clip-path: polygon(
    8px 0, calc(100% - 8px) 0,
    100% 8px, 100% calc(100% - 8px),
    calc(100% - 8px) 100%, 8px 100%,
    0 calc(100% - 8px), 0 8px
  );
  /* 双层阴影：外发光 + 内发光 */
  box-shadow: 0 0 8px rgba(255,230,0,.5), inset 0 0 4px rgba(255,230,0,.15);
}

/* ===== 中心点 ===== */
.ch-dot {
  position: absolute; top: 50%; left: 50%;
  width: 4px; height: 4px; background: #FFE600;
  transform: translate(-50%,-50%);       /* 居中自身 */
  box-shadow: 0 0 10px #FFE600;
}

/* ===== 十字线 ===== */
.ch-h, .ch-v {
  position: absolute; background: #FFE600;
  box-shadow: 0 0 6px rgba(255,230,0,.6);
}
.ch-h { top: 50%; left: -2px; right: -2px; height: 1px; transform: translateY(-50%); }
.ch-v { left: 50%; top: -2px; bottom: -2px; width: 1px; transform: translateX(-50%); }
</style>
