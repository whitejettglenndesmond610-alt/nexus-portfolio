<!-- 系统情报覆盖层 — 时间轴 + 客户评价 -->
<script setup>
// 声明 close 事件，子组件通过 $emit('close') 通知父组件关闭覆盖层
defineEmits(['close'])

// entries 是时间轴的数据源，每个对象代表一个时间节点：
//   date   - 日期（显示在卡片上）
//   title  - 事件标题
//   desc   - 事件描述
//   side   - 卡片位置：'left' 靠左 / 'right' 靠右（实现左右交替布局）
//   marker - 节点状态：空字符串 = 未来/未激活，'done' = 已完成（绿色），'active' = 当前（青色发光）
const entries = [
  { date: '2021.08', title: '首次接入网络',   desc: '完成计算机科学学位，以全栈开发者身份进入数字领域。', side: 'left',  marker: '' },
  { date: '2022.03', title: '加入幽灵协议工作室', desc: '主导前端架构重构，引入组件化设计系统，团队效率提升 40%。', side: 'right', marker: '' },
  { date: '2023.06', title: '首个百万级用户产品', desc: '操刀核心产品交互升级，日活突破百万。首次接触 WebGL 与创意编程。', side: 'left',  marker: 'done' },
  { date: '2024.01', title: '数字建筑师认证',   desc: '获得全栈架构师资格。完成三项企业级系统的零故障迁移。', side: 'right', marker: 'done' },
  { date: '2025.03', title: '成立独立实验室',   desc: '创办个人数字工作室，专注沉浸式品牌体验与三维可视化。', side: 'left',  marker: 'active' },
  { date: '2026',     title: '持续探索边界',    desc: '深入 AI 生成内容、WebGPU 渲染与跨平台体验。', side: 'right', marker: 'active' },
]

// testimonials 是客户/合作者评价数组，每个对象包含：
//   quote - 引用内容（带双引号包裹）
//   name  - 评价者姓名
//   role  - 评价者职位/公司
const testimonials = [
  { quote: '灵枢对细节的追求令人震撼。他把我们的品牌网站变成了一个科幻艺术品。',  name: '陈远', role: '星云科技 CEO' },
  { quote: '三个月的项目，他两周搞定了核心架构。代码质量比我们内部团队高出一个量级。', name: 'James Liu', role: 'Aether Labs CTO' },
  { quote: '和他合作的体验就像在玩一个精心设计的开放世界游戏——每一处交互都经过深思熟虑。', name: 'Kai Zhang', role: '独立游戏制作人' },
]
</script>

<template>
  <!-- @click.self 只在点击容器本身（非子元素）时触发关闭 -->
  <div class="overlay-container active" @click.self="$emit('close')">
    <div class="overlay-bg"></div>
    <div class="overlay-inner">
      <div class="overlay-header">
        <span class="oh-id">05</span>
        <h2 class="oh-title"><span class="oh-slash">//</span> 系统情报</h2>
        <button class="oh-close" @click="$emit('close')">断开连接</button>
      </div>

      <!-- ===== 时间轴 ===== -->
      <!--
        tl-line 是贯穿中央的竖线，每个 tl-entry 由 tl-marker（圆点） + tl-card（内容卡片）组成
        v-for 遍历 entries 数组渲染所有时间节点
      -->
      <div class="timeline">
        <div class="tl-line"></div>
        <div v-for="e in entries" :key="e.date" class="tl-entry">
          <!--
            :class="e.marker" 动态绑定 CSS 类名
            当 e.marker = 'done' 时 → class="tl-marker done"
            当 e.marker = 'active' 时 → class="tl-marker active"
            当 e.marker = '' 时 → class="tl-marker"（无额外类，默认样式）
            不同类名在全局 CSS 中定义了不同的颜色和发光效果
          -->
          <div class="tl-marker" :class="e.marker"></div>
          <!--
            :class="e.side" 把 side 字段的值作为类名绑定
            e.side = 'left' → class="tl-card left"（卡片靠左排列）
            e.side = 'right' → class="tl-card right"（卡片靠右排列）
            这样实现了时间轴左右交替的视觉效果
          -->
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
        <!-- testimonials-grid 用 CSS Grid 3 列平铺评价卡片 -->
        <div class="testimonials-grid">
          <!-- v-for 遍历 testimonials 生成三张评价卡，每张显示引用、姓名、职位 -->
          <div v-for="t in testimonials" :key="t.name" class="testimonial-card">
            <!-- 引用文字用双引号包裹，增强视觉仪式感 -->
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
/* 评价区域，顶部间距隔开时间轴 */
.testimonials-section { margin-top: 4rem; }

/* 评价标题：Orbitron 字体，黄色 */
.testimonials-heading {
  font-family: 'Orbitron', monospace; font-size: 1rem; font-weight: 700;
  color: #FFE600; margin-bottom: 1.5rem; letter-spacing: .1em;
}

/* 三列网格布局，每列等宽（1fr），1rem 间距 */
.testimonials-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }

/* 评价卡片：和博客卡片类似，clip-path 切角营造赛博朋克风格 */
.testimonial-card {
  padding: 1.4rem;
  border: 1.5px solid rgba(255,230,0,.12);
  background: rgba(12,12,20,.4);
  clip-path: polygon(0 8px, 8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%);
  transition: border-color .25s, box-shadow .25s;
}

/* hover 时边框变亮黄 + 微弱的霓虹阴影 */
.testimonial-card:hover { border-color: #FFE600; box-shadow: 0 0 16px rgba(255,230,0,.06); }

/* 引用文字：Rajdhani 斜体，行高 1.6 保证可读性 */
.testimonial-quote {
  font-family: 'Rajdhani', sans-serif; font-size: .8rem; font-style: italic;
  color: #E8ECF0; line-height: 1.6; margin-bottom: 1rem;
}

/* 作者信息区域：纵向排列姓名在上，职位在下 */
.testimonial-author { display: flex; flex-direction: column; }

/* 作者姓名：Rajdhani 粗体黄色 */
.ta-name {
  font-family: 'Rajdhani', sans-serif; font-size: .75rem; font-weight: 700; color: #FFE600;
}

/* 作者职位：小号等宽字体灰色 */
.ta-role {
  font-family: 'Share Tech Mono', monospace; font-size: .5rem; color: #5C6670; letter-spacing: .08em; margin-top: .2rem;
}
</style>
