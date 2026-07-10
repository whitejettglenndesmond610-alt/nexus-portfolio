<!--
  ============================================================================
  任务档案覆盖层 — OverlayProjects.vue
  ============================================================================
  横向滚动的项目卡片墙，hover 时图片放大 + 边框高亮
  ============================================================================
-->

<script setup>
/* 任务档案覆盖层 — 横向滚动卡片墙 */
defineEmits(['close'])

const missions = [
  { id: 'M-01', status: '进行中', cls: 'active', title: '星云数据平台', desc: '实时数据可视化中枢 · WebGL 渲染引擎' },
  { id: 'M-02', status: '已完成', cls: 'done',   title: '流光品牌实验室', desc: '沉浸式品牌体验站点 · GSAP 叙事驱动' },
  { id: 'M-03', status: '进行中', cls: 'active', title: '密链区块链浏览器', desc: '多链数据聚合 · 智能合约可视化分析' },
  { id: 'M-04', status: '进行中', cls: 'active', title: '以太 AI 创作工坊', desc: 'AI 生成内容平台 · 大语言模型 + 图像生成' },
  { id: 'M-05', status: '开发中', cls: 'dev',    title: '流形效率套件', desc: '跨平台效率工具 · 离线优先同步引擎' },
]
</script>

<template>
  <div class="overlay-container active" @click.self="$emit('close')">
    <div class="overlay-bg"></div>
    <div class="overlay-inner">
      <div class="overlay-header">
        <span class="oh-id">02</span>
        <h2 class="oh-title"><span class="oh-slash">//</span> 任务档案</h2>
        <button class="oh-close" @click="$emit('close')">断开连接</button>
      </div>

      <!-- 横向滚动的卡片列表 -->
      <div class="projects-scroll">
        <div v-for="m in missions" :key="m.id" class="project-card">
          <!-- 卡片图片区域（占位） -->
          <div class="pc-img">
            <span class="pc-code">{{ m.id }}</span>           <!-- 任务编号 M-01 等 -->
            <div class="pc-overlay"><span>查看详情</span></div> <!-- hover 浮现 -->
          </div>
          <!-- 卡片信息 -->
          <div class="pc-info">
            <span class="pc-status" :class="m.cls">{{ m.status }}</span>  <!-- 状态标签 -->
            <h3>{{ m.title }}</h3>
            <p>{{ m.desc }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
