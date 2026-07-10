<!-- 数据日志覆盖层 — 技术博客文章列表 -->
<script setup>
defineEmits(['close'])

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
  <div class="overlay-container active" @click.self="$emit('close')">
    <div class="overlay-bg"></div>
    <div class="overlay-inner">
      <div class="overlay-header">
        <span class="oh-id">03</span>
        <h2 class="oh-title"><span class="oh-slash">//</span> 数据日志</h2>
        <button class="oh-close" @click="$emit('close')">断开连接</button>
      </div>
      <div class="blog-grid">
        <div v-for="p in posts" :key="p.title" class="blog-card">
          <span class="blog-tag">{{ p.tag }}</span>
          <span class="blog-date">{{ p.date }}</span>
          <h3 class="blog-title">{{ p.title }}</h3>
          <p class="blog-desc">{{ p.desc }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.blog-grid {
  display: flex; flex-direction: column; gap: 1rem;
}
.blog-card {
  padding: 1.4rem;
  border: 1.5px solid rgba(255,230,0,.12);
  background: rgba(12,12,20,.5);
  clip-path: polygon(0 8px, 8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%);
  transition: border-color .25s, box-shadow .25s, transform .25s;
  cursor: default;
}
.blog-card:hover {
  border-color: #FFE600;
  box-shadow: 0 0 16px rgba(255,230,0,.08);
  transform: translateX(4px);
}
.blog-tag {
  font-family: 'Share Tech Mono', monospace; font-size: .5rem;
  color: #00E5FF; letter-spacing: .15em;
  border: 1px solid rgba(0,229,255,.2); padding: 2px 8px;
}
.blog-date {
  font-family: 'Orbitron', monospace; font-size: .6rem;
  color: #FFE600; letter-spacing: .1em; margin-left: 1rem;
}
.blog-title {
  font-family: 'Rajdhani', sans-serif; font-size: .95rem; font-weight: 700;
  letter-spacing: .04em; margin: .5rem 0;
}
.blog-desc {
  font-size: .75rem; color: #5C6670; line-height: 1.6;
}
</style>
