<!-- 主页仪表盘 — BIO 面板 + 导航矩阵 + 社交链接 -->
<script setup>
import { ref, onMounted } from 'vue'

// ref() 是 Vue 3 的响应式 API：包裹一个值，.value 读写，模板中自动解包
// 这里 sysTime 用来存储系统时间字符串，修改后模板会自动更新
const sysTime = ref('00:00:00')

// onMounted 是 Vue 生命周期钩子：组件 DOM 挂载后执行，适合启动定时器
onMounted(() => {
  // setInterval 每隔 1000ms（1秒）执行一次回调
  // new Date().toTimeString().slice(0,8) → 获取当前时间的 HH:MM:SS 部分
  // 赋值给 sysTime.value 触发响应式更新，模板中的 {{ sysTime }} 会同步刷新
  setInterval(() => { sysTime.value = new Date().toTimeString().slice(0, 8) }, 1000)
})
</script>

<template>
  <main class="dashboard">
    <div class="dash-inner">

      <!-- ===== 左侧：BIO 面板 ===== -->
      <div class="bio-panel">
        <div class="panel-header">
          <span class="header-dot"></span>
          <span class="header-label">系统·用户档案</span>
        </div>
        <div class="bio-content">
          <div class="bio-avatar">
            <!--
              内联 SVG 画一个极简头像：
              <defs> 定义可复用的资源（如下面的渐变色）
              <linearGradient> 线性渐变：x1/y1 起点 → x2/y2 终点，stop 定义颜色节点
              <circle> 画圆，cx/cy 圆心坐标，r 半径，stroke 描边色（引用上面渐变的 id）
              <path> 画曲线，d 属性用 SVG 路径语法，Q 是二次贝塞尔曲线
            -->
            <svg viewBox="0 0 160 160">
              <defs>
                <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stop-color="#FFE600"/>
                  <stop offset="100%" stop-color="#00E5FF"/>
                </linearGradient>
              </defs>
              <circle cx="80" cy="60" r="28" fill="none" stroke="url(#bgGrad)" stroke-width="1.5"/>
              <path d="M25 145 Q80 95 135 145" fill="none" stroke="url(#bgGrad)" stroke-width="1.5"/>
            </svg>
          </div>
          <div class="bio-text">
            <p class="bio-greeting">$ 正在初始化用户会话…</p>
            <h1 class="bio-name" data-text="灵枢">灵枢</h1>
            <p class="bio-role">// 数字建筑师 //</p>
            <div class="bio-terminal">
              <span>全栈架构师 · 数字工匠。</span><br>
              <span>像素为武器 · 代码为铠甲。</span>
            </div>
          </div>
        </div>
        <div class="bio-stats">
          <div class="bio-stat"><span class="bs-num">5+</span><span class="bs-lbl">年经验</span></div>
          <div class="bio-stat"><span class="bs-num">50+</span><span class="bs-lbl">已完成任务</span></div>
          <div class="bio-stat"><span class="bs-num">30+</span><span class="bs-lbl">合作客户</span></div>
        </div>

        <!-- ===== 社交链接 + 简历 ===== -->
        <!--
          这里用的是 <a> 标签而不是 <router-link>，因为 GitHub、邮箱、Twitter 都是外部链接
          需要 target="_blank" 在新标签页打开；/resume.pdf 是静态文件下载
          <router-link> 用于 SPA 内部页面跳转（不刷新浏览器），外部链接必须用 <a>
        -->
        <div class="bio-links">
          <a href="https://github.com/whitejettglenndesmond610-alt" target="_blank" class="bio-link">
            <span class="link-icon">◆</span> GitHub
          </a>
          <a href="mailto:whitejettglenndesmond610@gmail.com" class="bio-link">
            <span class="link-icon">✉</span> 邮箱
          </a>
          <a href="https://x.com/JWhite63262" target="_blank" class="bio-link">
            <span class="link-icon">⬡</span> Twitter
          </a>
          <a href="/resume.pdf" download class="bio-link resume-link">
            <span class="link-icon">↓</span> 下载简历
          </a>
        </div>
      </div>

      <!-- ===== 右侧：导航矩阵 2x3 ===== -->
      <!--
        router-link 是 Vue Router 提供的组件，编译后渲染成 <a> 标签
        :to 绑定目标路由对象，{name:'skills'} 按路由名跳转（比写路径更健壮）
        和普通 <a> 的区别：router-link 不会触发浏览器整页刷新，是 SPA 内局部切换
      -->
      <nav class="nav-matrix">
        <router-link :to="{name:'skills'}" class="nav-btn">
          <span class="btn-angle tl"></span><span class="btn-angle tr"></span>
          <span class="btn-angle bl"></span><span class="btn-angle br"></span>
          <span class="btn-id">01</span><span class="btn-title">技能树</span>
          <span class="btn-sub">加载模块</span>
        </router-link>
        <router-link :to="{name:'projects'}" class="nav-btn">
          <span class="btn-angle tl"></span><span class="btn-angle tr"></span>
          <span class="btn-angle bl"></span><span class="btn-angle br"></span>
          <span class="btn-id">02</span><span class="btn-title">任务档案</span>
          <span class="btn-sub">查看情报</span>
        </router-link>
        <router-link :to="{name:'blog'}" class="nav-btn">
          <span class="btn-angle tl"></span><span class="btn-angle tr"></span>
          <span class="btn-angle bl"></span><span class="btn-angle br"></span>
          <span class="btn-id">03</span><span class="btn-title">数据日志</span>
          <span class="btn-sub">读取记录</span>
        </router-link>
        <router-link :to="{name:'contact'}" class="nav-btn">
          <span class="btn-angle tl"></span><span class="btn-angle tr"></span>
          <span class="btn-angle bl"></span><span class="btn-angle br"></span>
          <span class="btn-id">04</span><span class="btn-title">通讯链路</span>
          <span class="btn-sub">建立连接</span>
        </router-link>
        <router-link :to="{name:'about'}" class="nav-btn">
          <span class="btn-angle tl"></span><span class="btn-angle tr"></span>
          <span class="btn-angle bl"></span><span class="btn-angle br"></span>
          <span class="btn-id">05</span><span class="btn-title">系统情报</span>
          <span class="btn-sub">解密档案</span>
        </router-link>
        <!-- 最后一个按钮用 <span> 而不是 router-link，加了 .disabled 类表示暂不可用 -->
        <span class="nav-btn disabled">
          <span class="btn-angle tl"></span><span class="btn-angle tr"></span>
          <span class="btn-angle bl"></span><span class="btn-angle br"></span>
          <span class="btn-id">06</span><span class="btn-title">即将解锁</span>
          <span class="btn-sub">更多模块</span>
        </span>
      </nav>
    </div>

    <!-- ===== 底部状态栏 ===== -->
    <!--
      双花括号 {{ }} 是 Vue 的插值语法，把 JS 表达式结果插入 DOM
      sysTime 是 ref 但在模板中自动解包，不用写 .value
    -->
    <div class="dash-footer">
      <span>系统时间: {{ sysTime }}</span>
      <span class="footer-sep">|</span>
      <span>信号强度: <span class="signal-bar">████████</span></span>
      <span class="footer-sep">|</span>
      <span>连接状态: 安全</span>
      <span class="footer-sep">|</span>
      <span>&copy; 2026 NEXUS.LAB</span>
    </div>
  </main>
</template>

<!--
  scoped 是 Vue 单文件组件的样式隔离机制
  加上 scoped 后，这里写的 CSS 只影响当前组件内的元素，不会泄露到其他组件
  原理：Vue 编译时给组件内元素和 CSS 选择器添加唯一的 data-v-xxx 属性
-->
<style scoped>
/* BIO 面板底部社交链接 */
.bio-links {
  display: flex; gap: .8rem; margin-top: 1.2rem;
  padding-top: 1rem; flex-wrap: wrap;
}
.bio-link {
  display: flex; align-items: center; gap: .3rem;
  font-family: 'Share Tech Mono', monospace; font-size: .55rem;
  color: #5C6670; text-decoration: none; letter-spacing: .06em;
  padding: .25rem .6rem; border: 1px solid rgba(255,230,0,.12);
  transition: all .25s; cursor: none;
}
.bio-link:hover { color: #FFE600; border-color: #FFE600; text-shadow: 0 0 8px rgba(255,230,0,.5); }
.link-icon { font-size: .7rem; }
.resume-link { border-color: rgba(0,229,255,.3); color: #00E5FF; }
.resume-link:hover { border-color: #00E5FF; text-shadow: 0 0 8px rgba(0,229,255,.5); box-shadow: 0 0 12px rgba(0,229,255,.2); }
</style>
