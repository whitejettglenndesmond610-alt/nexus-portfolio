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
    title: 'WebGPU 入门：在浏览器里写 Shader 的 5 个陷阱',
    desc: '从 WebGL 迁移到 WebGPU 的真实踩坑记录，计算管线与渲染管线的区别。',
    tag: '图形学',
  },
  {
    date: '2026.04',
    title: 'GSAP 时间线进阶：用 ScrollTrigger 搭建叙事性页面',
    desc: '如何用 GSAP Timeline 管理复杂动画序列，避免回调地狱。',
    tag: '动效',
  },
  {
    date: '2026.02',
    title: '赛博朋克 UI 设计系统：从色彩到动效的完整指南',
    desc: '构建一套可复用的 HUD 组件库——配色 Token、clip-path 斜切、霓虹发光。',
    tag: '设计系统',
  },
  {
    date: '2025.12',
    title: '性能优化实战：把 FCP 从 3.8s 压到 0.9s',
    desc: '代码分割、资源预加载、字体子集化——一个企业级项目的完整优化路径。',
    tag: '性能',
  },
  {
    date: '2025.10',
    title: '用 Three.js 构建数据可视化仪表盘的 7 条经验',
    desc: '从相机控制到粒子系统，实战中总结的最佳实践。',
    tag: '3D',
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
