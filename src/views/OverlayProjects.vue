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
  { id: 'P-01', status: '已完成', cls: 'done',   title: '个人作品集网页',        desc: 'HTML5/CSS3/JS · Swiper.js · ScrollReveal · 响应式布局 · Vercel 部署' },
  { id: 'P-02', status: '已完成', cls: 'done',   title: '多知识库 AI 问答系统',  desc: 'Python · LangChain · FAISS · Ollama · Gradio · 本地 RAG' },
  { id: 'P-03', status: '开发中', cls: 'dev',    title: '离线知识库管理工具',     desc: '基于 SQLite 的本地文档管理 · 增量索引 · OCR 预处理' },
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
