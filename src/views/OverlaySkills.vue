<!--
  ============================================================================
  技能树覆盖层 — OverlaySkills.vue
  ============================================================================
  点击主页「技能树」按钮后弹出。内容：
  - 3x2 技能卡片网格，每张卡片包含图标 + 名称 + 能量条 + 子技能标签
  - 打开后 GSAP 驱动能量条从 0% 充能到目标值，数字随机滚动
  关闭按钮 emit('close') 通知父组件收回覆盖层
  ============================================================================
-->

<script setup>
/* 技能树覆盖层 — 3x2 卡片 + GSAP 能量条充能动效 */
import { onMounted, ref } from 'vue'
import gsap from 'gsap'

const emit = defineEmits(['close'])
const skillsDone = ref(false)

/* 技能数据 */
const skillsList = [
  { icon: '{ }', name: '前端核心', val: 95, color: 'cy', subs: 'React / Vue / GSAP / Three.js' },
  { icon: '</>', name: '后端架构', val: 88, color: 'pk', subs: 'Node.js / Python / Go / GraphQL' },
  { icon: '◆',  name: '界面设计', val: 90, color: 'gl', subs: 'Figma / 动效 / 设计系统' },
  { icon: '◇',  name: '三维可视化', val: 82, color: 'cy', subs: 'WebGL / Three.js / Blender' },
  { icon: '⚙',  name: '运维部署', val: 85, color: 'pk', subs: 'Docker / K8s / CI/CD / AWS' },
  { icon: '✦',  name: '创意编程', val: 78, color: 'gl', subs: 'p5.js / 生成艺术 / GLSL' },
]

/* 打开后 GSAP 能量条充能 + 数字滚动 */
onMounted(() => {
  if (skillsDone.value) return
  skillsDone.value = true

  setTimeout(() => {
    document.querySelectorAll('.skill-node').forEach((node, i) => {
      const bar = node.querySelector('.sn-bar')
      const val = node.querySelector('.sn-val')
      const target = parseInt(bar?.dataset.value, 10)
      if (!bar || !val || isNaN(target)) return

      // 闪烁一下（通电）
      gsap.fromTo(bar, { opacity: 0 }, { opacity: 1, duration: .08, delay: i * .06, repeat: 1, yoyo: true })
      // 能量条从 0 延伸到目标值
      gsap.to(bar, { width: target + '%', duration: 1.2, delay: i * .07, ease: 'power3.out' })
      // 数字随机滚动后精确停靠
      const obj = { v: 0 }
      gsap.to(obj, {
        v: target, duration: 1.2, delay: i * .07, ease: 'power3.out',
        onUpdate: () => { val.textContent = Math.round(obj.v + (Math.random() - .5) * 12) + '%' },
        onComplete: () => { val.textContent = target + '%' },
      })
    })
  }, 300)
})
</script>

<template>
  <!-- 覆盖层容器，点击背景也可以关闭 -->
  <div class="overlay-container active" @click.self="$emit('close')">
    <!-- 毛玻璃背景 -->
    <div class="overlay-bg"></div>

    <!-- 内容滚动区 -->
    <div class="overlay-inner">

      <!-- 顶部标题栏 -->
      <div class="overlay-header">
        <span class="oh-id">01</span>
        <h2 class="oh-title"><span class="oh-slash">//</span> 技能树</h2>
        <button class="oh-close" @click="$emit('close')">断开连接</button>
      </div>

      <!-- 技能卡片网格 -->
      <div class="skills-grid">
        <!-- v-for 循环渲染 6 张卡片 -->
        <div v-for="s in skillsList" :key="s.name" class="skill-node">
          <!-- 图标：{ }  </> ◆ 等 -->
          <div class="sn-icon">{{ s.icon }}</div>

          <!-- 信息区 -->
          <div class="sn-info">
            <!-- 技能名称 -->
            <span class="sn-name">{{ s.name }}</span>

            <!-- 能量条 + 百分比 -->
            <div class="sn-bar-wrap">
              <!-- 能量条轨道 -->
              <div class="sn-bar-track">
                <!-- 能量条填充，:class 动态绑定颜色（cy=青/pk=粉/gl=金），data-value 存储目标百分比 -->
                <div class="sn-bar" :class="s.color" :data-value="s.val"></div>
              </div>
              <!-- 百分比文字，GSAP 动画目标 -->
              <span class="sn-val">0%</span>
            </div>

            <!-- 子技能标签 -->
            <span class="sn-subs">{{ s.subs }}</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
