<!-- 系统情报覆盖层 — 时间轴 + 自我评价 -->
<script setup>
// 声明 close 事件，子组件通过 $emit('close') 通知父组件关闭覆盖层
defineEmits(['close'])

const entries = [
  { date: '2025.09', title: '进入郑州工商学院',       desc: '计算机科学与技术专业本科，开始系统学习编程与计算机基础。',          side: 'left',  marker: 'done' },
  { date: '2025.12', title: '完成个人作品集网页',      desc: '独立开发响应式个人网站，集成 Swiper.js 轮播与 ScrollReveal 滚动动画。', side: 'right', marker: 'done' },
  { date: '2026.03', title: '探索 AI 应用开发',          desc: '学习 LangChain、FAISS、Ollama 等框架，构建本地 RAG 知识库问答系统。', side: 'left',  marker: 'done' },
  { date: '2026.06', title: '完成 AI 知识库问答系统',    desc: '实现多格式文档导入、语义检索、多轮对话与 Gradio 交互界面。',         side: 'right', marker: 'active' },
  { date: '2027.06', title: '预计毕业',                    desc: '完成计算机科学与技术本科学位，准备进入 AI 应用开发领域。',            side: 'left',  marker: '' },
]

const testimonials = [
  { quote: '注重动手实践与技术理解相结合，能通过课程项目理解核心概念，同时主动探索新技术。', name: '自我驱动', role: '学习态度' },
  { quote: '掌握 Python、C/C++、SQL 及前端开发基础，能将所学知识应用到实际项目中。',           name: '技术扎实', role: '核心能力' },
  { quote: '具备自主学习与团队协作意识，能通过文档和社区资源快速补充技能。',                   name: '快速学习', role: '软技能' },
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

      <!-- ===== 自我评价 ===== -->
      <div class="testimonials-section">
        <h3 class="testimonials-heading"><span class="oh-slash">//</span> 自我评价</h3>
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
