<!-- 数据日志覆盖层 — 技术博客文章列表 -->
<script setup>
// defineEmits 声明组件可以触发哪些事件（子传父）
// 这里声明了 'close' 事件，父组件可以用 @close="handleClose" 监听
// 子组件通过 $emit('close') 触发，通知父组件"该关闭了"
defineEmits(['close'])

// posts 是博客文章数据数组，每个元素是一个对象，包含：
//   date  - 发布日期（显示在卡片右上角）
//   title - 文章标题
//   desc  - 简短描述
//   tag   - 分类标签（显示在卡片左上角，有特殊样式）
// 这是本地静态数据，真实项目通常会从 API 请求获取
const posts = [
  {
    date: '2026.06',
    title: '从零构建本地 RAG 问答系统：LangChain + FAISS 实战',
    desc: '记录从文档解析、向量化存储到多轮对话的完整实现过程，踩过的坑和解决方案。',
    tag: 'AI',
  },
  {
    date: '2026.04',
    title: 'Ollama 本地大模型部署指南：Qwen / Mistral 选型对比',
    desc: '在消费级硬件上运行开源大模型的实操记录，模型选型、性能优化与常见问题。',
    tag: 'AI',
  },
  {
    date: '2026.02',
    title: '用 Gradio 搭建 AI 应用 Web 界面：从入门到自定义主题',
    desc: 'Gradio 基础组件、布局系统、CSS 主题定制，打造类 ChatGPT 交互体验。',
    tag: '前端',
  },
  {
    date: '2025.12',
    title: '个人作品集网站开发记录：从零到部署',
    desc: 'HTML/CSS/JS 基础 → Swiper.js 轮播 → ScrollReveal 动效 → Vercel 一键部署。',
    tag: '前端',
  },
  {
    date: '2025.10',
    title: '计算机专业入门笔记：操作系统与网络那些事',
    desc: '整理操作系统核心概念与 TCP/IP 协议栈的学习笔记，新手友好的理解方式。',
    tag: '基础',
  },
]
</script>

<template>
  <!--
    @click.self="$emit('close')" 是一个常用的"点击遮罩关闭"模式：
    .self 修饰符表示只有点击 div 本身（而非内部子元素）才触发
    这样点击博客卡片内部不会意外关闭，只有点击到外层空白背景才关闭
  -->
  <div class="overlay-container active" @click.self="$emit('close')">
    <div class="overlay-bg"></div>
    <div class="overlay-inner">
      <div class="overlay-header">
        <span class="oh-id">03</span>
        <h2 class="oh-title"><span class="oh-slash">//</span> 数据日志</h2>
        <!-- 关闭按钮直接 $emit('close')，通知父组件关闭覆盖层 -->
        <button class="oh-close" @click="$emit('close')">断开连接</button>
      </div>

      <!--
        v-for 遍历 posts 数组渲染多张博客卡片
        :key="p.title" 是 Vue 要求的唯一标识，帮助 Vue 高效追踪每个列表项
        这里用 title 作为 key（假设标题不重复），真实项目最好用 id
      -->
      <div class="blog-grid">
        <div v-for="p in posts" :key="p.title" class="blog-card">
          <!-- 左上角：分类标签 -->
          <span class="blog-tag">{{ p.tag }}</span>
          <!-- 日期，用 margin-left 推到标签右边 -->
          <span class="blog-date">{{ p.date }}</span>
          <!-- 标题和描述 -->
          <h3 class="blog-title">{{ p.title }}</h3>
          <p class="blog-desc">{{ p.desc }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* blog-grid 是纵向布局容器，卡片之间间隔 1rem */
.blog-grid {
  display: flex; flex-direction: column; gap: 1rem;
}

/* blog-card 每张博客卡片：
   clip-path 用 polygon 切出右上/左下的小斜角，模拟"切角"赛博朋克风格
   8px 是切角大小：左上角从 (0,8px) 开始而非 (0,0)，形成斜切效果 */
.blog-card {
  padding: 1.4rem;
  border: 1.5px solid rgba(255,230,0,.12);
  background: rgba(12,12,20,.5);
  clip-path: polygon(0 8px, 8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%);
  transition: border-color .25s, box-shadow .25s, transform .25s;
  cursor: default;
}

/* hover 时：边框变黄、加霓虹阴影、卡片向右微移 4px */
.blog-card:hover {
  border-color: #FFE600;
  box-shadow: 0 0 16px rgba(255,230,0,.08);
  transform: translateX(4px);
}

/* 标签：小号等宽字体，青色边框包裹 */
.blog-tag {
  font-family: 'Share Tech Mono', monospace; font-size: .5rem;
  color: #00E5FF; letter-spacing: .15em;
  border: 1px solid rgba(0,229,255,.2); padding: 2px 8px;
}

/* 日期：用 Orbitron 字体，黄色，靠右 */
.blog-date {
  font-family: 'Orbitron', monospace; font-size: .6rem;
  color: #FFE600; letter-spacing: .1em; margin-left: 1rem;
}

/* 标题：Rajdhani 粗体 */
.blog-title {
  font-family: 'Rajdhani', sans-serif; font-size: .95rem; font-weight: 700;
  letter-spacing: .04em; margin: .5rem 0;
}

/* 描述文字：灰色小字，行高 1.6 提升可读性 */
.blog-desc {
  font-size: .75rem; color: #5C6670; line-height: 1.6;
}
</style>
