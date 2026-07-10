<!-- 系统情报覆盖层 — 时间轴 + 客户评价 -->
<script setup>
defineEmits(['close'])

const entries = [
  { date: '2021.08', title: '首次接入网络',   desc: '完成计算机科学学位，以全栈开发者身份进入数字领域。', side: 'left',  marker: '' },
  { date: '2022.03', title: '加入幽灵协议工作室', desc: '主导前端架构重构，引入组件化设计系统，团队效率提升 40%。', side: 'right', marker: '' },
  { date: '2023.06', title: '首个百万级用户产品', desc: '操刀核心产品交互升级，日活突破百万。首次接触 WebGL 与创意编程。', side: 'left',  marker: 'done' },
  { date: '2024.01', title: '数字建筑师认证',   desc: '获得全栈架构师资格。完成三项企业级系统的零故障迁移。', side: 'right', marker: 'done' },
  { date: '2025.03', title: '成立独立实验室',   desc: '创办个人数字工作室，专注沉浸式品牌体验与三维可视化。', side: 'left',  marker: 'active' },
  { date: '2026',     title: '持续探索边界',    desc: '深入 AI 生成内容、WebGPU 渲染与跨平台体验。', side: 'right', marker: 'active' },
]

const testimonials = [
  { quote: '灵枢对细节的追求令人震撼。他把我们的品牌网站变成了一个科幻艺术品。',  name: '陈远', role: '星云科技 CEO' },
  { quote: '三个月的项目，他两周搞定了核心架构。代码质量比我们内部团队高出一个量级。', name: 'James Liu', role: 'Aether Labs CTO' },
  { quote: '和他合作的体验就像在玩一个精心设计的开放世界游戏——每一处交互都经过深思熟虑。', name: 'Kai Zhang', role: '独立游戏制作人' },
]
</script>

<template>
  <div class="overlay-container active" @click.self="$emit('close')">
    <div class="overlay-bg"></div>
    <div class="overlay-inner">
      <div class="overlay-header">
        <span class="oh-id">05</span>
        <h2 class="oh-title"><span class="oh-slash">//</span> 系统情报</h2>
        <button class="oh-close" @click="$emit('close')">断开连接</button>
      </div>

      <div class="timeline">
        <div class="tl-line"></div>
        <div v-for="e in entries" :key="e.date" class="tl-entry">
          <div class="tl-marker" :class="e.marker"></div>
          <div class="tl-card" :class="e.side">
            <span class="tl-date">{{ e.date }}</span>
            <h3 class="tl-title">{{ e.title }}</h3>
            <p class="tl-desc">{{ e.desc }}</p>
          </div>
        </div>
      </div>

      <!-- ===== 客户评价 ===== -->
      <div class="testimonials-section">
        <h3 class="testimonials-heading"><span class="oh-slash">//</span> 合作者证言</h3>
        <div class="testimonials-grid">
          <div v-for="t in testimonials" :key="t.name" class="testimonial-card">
            <p class="testimonial-quote">"{{ t.quote }}"</p>
            <div class="testimonial-author">
              <span class="ta-name">{{ t.name }}</span>
              <span class="ta-role">{{ t.role }}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.testimonials-section { margin-top: 4rem; }
.testimonials-heading {
  font-family: 'Orbitron', monospace; font-size: 1rem; font-weight: 700;
  color: #FFE600; margin-bottom: 1.5rem; letter-spacing: .1em;
}
.testimonials-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
.testimonial-card {
  padding: 1.4rem;
  border: 1.5px solid rgba(255,230,0,.12);
  background: rgba(12,12,20,.4);
  clip-path: polygon(0 8px, 8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%);
  transition: border-color .25s, box-shadow .25s;
}
.testimonial-card:hover { border-color: #FFE600; box-shadow: 0 0 16px rgba(255,230,0,.06); }
.testimonial-quote {
  font-family: 'Rajdhani', sans-serif; font-size: .8rem; font-style: italic;
  color: #E8ECF0; line-height: 1.6; margin-bottom: 1rem;
}
.testimonial-author { display: flex; flex-direction: column; }
.ta-name {
  font-family: 'Rajdhani', sans-serif; font-size: .75rem; font-weight: 700; color: #FFE600;
}
.ta-role {
  font-family: 'Share Tech Mono', monospace; font-size: .5rem; color: #5C6670; letter-spacing: .08em; margin-top: .2rem;
}
</style>
