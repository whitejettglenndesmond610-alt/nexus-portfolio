/* ================================================================
   应用入口 — Vue + Naive UI + 粒子背景 + 音效
   这个文件是 Vue 应用的"启动文件"，它做了三件事：
   ① 创建 Vue 应用并挂载到 HTML 页面上
   ② 初始化 Canvas 粒子背景动画
   ③ 注册鼠标悬停/点击的音效

   什么是"入口"？就像电影的片头 —— 程序运行后最先执行的就是这个文件。
   ================================================================ */

/* ---------------------------------------------------
   第 1 步：导入依赖（import）
   就像盖房子需要钢筋水泥一样，先要把需要用到的"材料"搬进来
   --------------------------------------------------- */

// createApp 是 Vue 3 提供的函数，用来"创建一个 Vue 应用"
// 你可以把 createApp 理解为："Vue，请帮我在浏览器里启动一个应用"
import { createApp } from 'vue'

// naive-ui 是一个开箱即用的 UI 组件库（按钮、输入框、弹窗等）
// 导入后，我们就可以用 <n-button>、<n-modal> 这些组件
import naive from 'naive-ui'

// App.vue 是我们自己写的"根组件"（root component）
// 它就像一棵树的树干，所有其他组件都挂在它上面
import App from './App.vue'

// router 是我们自己写的"路由"配置文件（src/router.js）
// 路由的作用：决定用户访问不同 URL（如 /about、/home）时显示什么内容
import router from './router'

// 全局 CSS 样式文件，定义了赛博朋克风格的颜色、字体、背景等
// 导入后整个应用都会应用这些样式
import './styles/cyber.css'

/* ---------------------------------------------------
   第 2 步：创建 Vue 应用并注册插件
   --------------------------------------------------- */

// createApp(App) — 用 App.vue 作为根组件，创建一个 Vue 应用实例
// 返回值 app 就是我们的应用"对象"，可以继续对它进行操作
const app = createApp(App)

// app.use(...) — 给 Vue 应用"装上"一个插件
// app.use(naive) 的意思是：把 Naive UI 组件库注册到应用中
// 注册后，所有 Vue 组件里都可以直接用 Naive 的组件了（如 <n-button>）
app.use(naive)

// app.use(router) — 把路由系统注册到应用中
// 注册后，用户访问不同 URL 时，页面会自动切换显示对应的组件
// 就像给应用装了一个"导航系统"
app.use(router)

// app.mount('#app') — 把 Vue 应用"挂载"到 HTML 页面上
// '#app' 是一个 CSS 选择器，对应 index.html 里的 <div id="app"></div>
// 挂载后，Vue 会接管这个 div，在里面渲染出整个应用的界面
// 你可以理解为："Vue，请把界面画到 id='app' 的那个 div 里"
app.mount('#app')

/* ================================================================
   第 3 步：粒子背景 Canvas
   这是一个独立的 Canvas 动画系统，在网页背景上绘制飘浮的金色粒子
   粒子之间如果距离够近，会用半透明的线连接起来，形成"网格星空"效果

   整体工作流程：
   ① 创建 60 个粒子，每个粒子有随机位置、速度、大小
   ② 每帧（约 60 次/秒）更新所有粒子的位置，并重新绘制
   ③ 如果两个粒子距离 <100px，画一根半透明线连接它们
   ================================================================ */
function initParticles() {
  // 从 HTML 中找到 id="particleCanvas" 的 <canvas> 元素
  // 如果找不到（比如页面还没加载完），直接返回不执行
  const canvas = document.getElementById('particleCanvas')
  if (!canvas) return

  // getContext('2d') — 获取 Canvas 的"2D 画笔"
  // 拿到画笔后，就可以调用 ctx.arc()、ctx.fill() 等方法在画布上画东西了
  const ctx = canvas.getContext('2d')

  // w 和 h 存储画布当前的宽高，会在 resize() 中动态计算
  let w, h

  // particles 数组存储所有的粒子对象（Particle 类的实例）
  const particles = []

  /* ---------------------------------------------------
     Particle 类 — 粒子的"蓝图"
     class 就像一个"模具"，定义了每个粒子有什么属性（数据）和能做什么行为（方法）
     new Particle() 就是"用这个模具制造一个具体的粒子"
     --------------------------------------------------- */
  class Particle {
    // constructor() 是构造器，每次 new Particle() 时自动调用
    // 作用：给新出生的粒子设置初始属性
    constructor() {
      this.reset() // 随机初始化粒子的位置、速度等
    }

    // reset() — 把粒子"重置"到画布上的一个随机位置
    // 给它随机的大小、速度、透明度，让每个粒子看起来都不同
    reset() {
      // Math.random() 返回 0 到 1 之间的随机小数
      // this.x — 粒子在画布上的 X 坐标（水平位置）
      this.x = Math.random() * w    // 随机出现 0 ~ 画布宽度的任意位置

      // this.y — 粒子在画布上的 Y 坐标（垂直位置）
      this.y = Math.random() * h    // 随机出现在 0 ~ 画布高度的任意位置

      // this.size — 粒子的半径（单位 px）
      // Math.random() * 1.2 + 0.4 → 0.4 到 1.6 之间的随机值
      // 这样粒子有大有小，看起来更自然
      this.size = Math.random() * 1.2 + 0.4

      // this.speedX — 粒子在 X 方向的移动速度
      // (Math.random() - 0.5) → -0.5 到 +0.5 之间
      // 乘以 0.3 → -0.15 到 +0.15 px/帧
      // 正数向右飘，负数向左飘
      this.speedX = (Math.random() - 0.5) * 0.3

      // this.speedY — 粒子在 Y 方向的移动速度，同上
      this.speedY = (Math.random() - 0.5) * 0.3

      // this.opacity — 粒子的透明度，0.05 到 0.3 之间
      // 越小越透明（越暗），越大越亮
      this.opacity = Math.random() * 0.25 + 0.05
    }

    // update() — 每一帧都要调用，更新粒子的位置
    // 同时做"边界环绕"：粒子飞出画布后，从对面重新出现
    update() {
      // 把速度加到当前位置上 = 粒子移动了一小段距离
      this.x += this.speedX
      this.y += this.speedY

      // 边界环绕（wrap-around）：飞出画布后就从另一侧回来
      // 这样粒子永远不会丢失，始终在画布上
      // 飞出左边(-10px) → 从右侧重新出现
      if (this.x < -10) this.x = w + 10
      // 飞出右边 → 从左侧重新出现
      if (this.x > w + 10) this.x = -10
      // 飞出上边 → 从下边重新出现
      if (this.y < -10) this.y = h + 10
      // 飞出下边 → 从上边重新出现
      if (this.y > h + 10) this.y = -10
    }

    // draw() — 把粒子"画"到 Canvas 上
    // 画一个小圆点，颜色是带透明度的金色
    draw() {
      // beginPath() — 告诉画笔"我要开始画一个新的图形了"
      ctx.beginPath()

      // arc(x, y, 半径, 起始角度, 结束角度)
      // arc(this.x, this.y, this.size, 0, Math.PI * 2) — 画一个完整的圆
      // 0 到 Math.PI*2 就是一整圈（360度）
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)

      // fillStyle — 设置填充颜色
      // `rgba(255,230,0,${this.opacity})` — 金色（红255 绿230 蓝0）+ 透明度
      // 255,230,0 是 RGB 金色，最后一个参数控制透明度
      ctx.fillStyle = `rgba(255,230,0,${this.opacity})`

      // fill() — 用上面设置的颜色，填充刚才画的圆
      // 这一步才真正把圆画到屏幕上
      ctx.fill()
    }
  }

  /* ---------------------------------------------------
     resize() — 当窗口大小变化时，同步更新 Canvas 尺寸
     canvas.width 和 canvas.height 是 Canvas 的实际像素尺寸
     canvas.offsetWidth 和 offsetHeight 是 Canvas 在页面上的显示尺寸
     把它们设为一致，避免画面拉伸变形
     --------------------------------------------------- */
  function resize() {
    w = canvas.width = canvas.offsetWidth
    h = canvas.height = canvas.offsetHeight
  }

  /* ---------------------------------------------------
     connect() — 遍历所有粒子，画连接线
     如果两个粒子之间的距离 < 100px，就在它们之间画一条半透明线
     距离越远，线越透明（直到完全看不见）
     这创造了"网格/星座"的视觉效果
     --------------------------------------------------- */
  function connect() {
    // 双重循环：比较每一对粒子（i 和 j，其中 j > i）
    // 这种写法可以避免重复比较（比如比较了 A-B 就不会再比较 B-A）
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        // 计算两个粒子在 X 轴和 Y 轴上的距离差
        const dx = particles[i].x - particles[j].x
        const dy = particles[i].y - particles[j].y

        // 勾股定理：计算两个粒子之间的直线距离
        // Math.sqrt(a² + b²) = 斜边长度
        const d = Math.sqrt(dx * dx + dy * dy)

        // 只连接距离小于 100px 的粒子
        if (d < 100) {
          ctx.beginPath()
          // moveTo(x, y) — 把画笔移到起点位置
          ctx.moveTo(particles[i].x, particles[i].y)
          // lineTo(x, y) — 从起点画一条线到终点
          ctx.lineTo(particles[j].x, particles[j].y)

          // strokeStyle — 线条颜色，同样是金色 + 动态透明度
          // (1 - d / 100)：距离越近 (d 小)，透明度越高
          // d = 0 时透明度 = 0.03（最亮）
          // d = 100 时透明度 = 0（完全看不见）
          ctx.strokeStyle = `rgba(255,230,0,${0.03 * (1 - d / 100)})`

          // lineWidth — 线条粗细
          ctx.lineWidth = 0.5

          // stroke() — 真正画出这条线
          ctx.stroke()
        }
      }
    }
  }

  /* ---------------------------------------------------
     animate() — 动画循环（游戏循环 / game loop）
     这是粒子系统的"心脏"，每帧都要执行一次
     requestAnimationFrame 是浏览器提供的函数，
     它会在下一帧（约 16ms 后）自动调用 animate

     流程：
     ① 清空画布（擦掉上一帧的画面）
     ② 更新所有粒子位置 → 画出所有粒子
     ③ 画出连接线
     ④ 请求下一帧 → 无限循环

     为什么要 clear？
     如果不擦，粒子的旧位置也会留在画布上，看起来像"拖尾"。
     擦了再画，就像是翻页动画 —— 每次都是全新的画面。
     --------------------------------------------------- */
  function animate() {
    // clearRect(x, y, w, h) — 擦掉画布上指定矩形区域的所有内容
    // (0, 0, w, h) 就是擦掉整个画布
    ctx.clearRect(0, 0, w, h)

    // 遍历所有粒子，先更新位置，再画出来
    particles.forEach(p => {
      p.update()  // 移动粒子
      p.draw()    // 画出粒子
    })

    // 画粒子之间的连接线
    connect()

    // requestAnimationFrame(animate) — 告诉浏览器："下一帧准备好了就调用 animate"
    // 浏览器会尽量以 60fps（每秒 60 帧）的速度调用
    // 这就是驱动整个动画持续运行的关键
    requestAnimationFrame(animate)
  }

  /* ---------------------------------------------------
     初始化粒子系统
     --------------------------------------------------- */

  // 第一步：设置画布大小（同步 canvas 宽高）
  resize()

  // 第二步：创建 60 个粒子，放入 particles 数组
  // new Particle() 调用 constructor → 调用 reset() → 每个粒子随机初始化
  for (let i = 0; i < 60; i++) particles.push(new Particle())

  // 第三步：启动动画循环
  animate()

  // 第四步：监听窗口大小变化事件
  // 用户拖动浏览器窗口时，自动重新设置画布大小，粒子和线不会变形
  window.addEventListener('resize', resize)
}

/* ================================================================
   第 4 步：音效引擎（Web Audio API 合成，无需外部文件）
   Web Audio API 是浏览器内置的声音引擎，可以实时合成各种声音
   这里用它来给鼠标悬停和点击添加短促的音效，提升交互体验
   不用任何 .mp3 或 .wav 文件，完全用代码合成声音
   ================================================================ */
function initSound() {
  // ctx — AudioContext 对象（音频上下文），Web Audio API 的总入口
  // 设为 null，等第一次需要播放时再创建（"懒加载"）
  // 原因：浏览器要求 AudioContext 必须在用户交互后创建，不能自动播放声音
  let ctx = null

  // getCtx() — 获取或创建 AudioContext
  // 第一次调用时创建，之后一直复用同一个实例
  function getCtx() {
    // 如果 ctx 还是 null（还没创建过），就创建一个新的 AudioContext
    // 兼容写法：旧浏览器可能用 webkitAudioContext 这个前缀名
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
    return ctx
  }

  /* ---------------------------------------------------
     play(freq, type, dur, vol) — 播放一个短音效
     参数：
       freq — 声音频率（Hz），数值越高音调越尖
             800Hz 约等于叮的一声，200Hz 约等于咚的一声
       type — 波形类型（'sine' / 'triangle' / 'square' / 'sawtooth'）
             'sine'（正弦波）听起来柔和圆润
             'triangle'（三角波）听起来清脆
             'square'（方波）听起来像 8-bit 游戏音
       dur  — 持续时间（秒），这里只需 0.06~0.1 秒，一闪而过
       vol  — 音量（0~1），0.04~0.06，很小声只是为了氛围
     --------------------------------------------------- */
  function play(freq, type, dur, vol) {
    try {
      const c = getCtx() // 获取 AudioContext

      // createOscillator() — 创建一个"振荡器"，它是声音的源头
      // 振荡器会以指定频率振动，产生声音信号
      const osc = c.createOscillator()

      // createGain() — 创建一个"增益器"（音量控制器）
      // 它像收音机的音量旋钮，控制声音通过时的大小
      const gain = c.createGain()

      // 设置振荡器的波形类型
      osc.type = type

      // 设置振荡器的频率（决定音高）
      osc.frequency.value = freq

      // 设置音量的初始值
      gain.gain.value = vol

      // exponentialRampToValueAtTime — 让音量呈指数曲线衰减到 0.001
      // 这是什么？简单说：音量不是突然关掉，而是在 dur 秒内平滑地"消失"
      // 指数衰减模拟了真实声音的自然衰减过程，听起来很舒服
      // 参数：目标值 = 0.001（几乎无声），时间 = 当前时间 + dur 秒
      // 如果不加这一行，声音会"咔"地一下断掉，非常生硬
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur)

      // 连接音频节点：
      // 振荡器(声音源) → 增益器(音量控制) → 扬声器(destination)
      // 就像水流过管道：源头 → 水阀 → 水龙头
      osc.connect(gain)       // 振荡器输出连接到增益器
      gain.connect(c.destination) // 增益器输出连接到扬声器

      // start() — 开始播放，从当前时间开始
      osc.start(c.currentTime)

      // stop() — 在 dur 秒后停止
      // 同时 stop 后振荡器会自动释放内存，不会残留
      osc.stop(c.currentTime + dur)
    } catch (_) {
      // 如果浏览器不支持 Web Audio API，静默忽略错误
      // 不会因为音效加载失败影响页面功能
    }
  }

  /* ---------------------------------------------------
     事件监听：在特定元素上触发音效
     --------------------------------------------------- */

  // mouseover — 鼠标悬停到指定元素时，播放高频叮声（800Hz，正弦波）
  // 持续时间 0.06 秒，音量 0.04 — 非常短促、轻柔
  // closest() — 从事件目标向上查找匹配的父元素
  // 例如：悬停在按钮内部的 <span> 上，也能通过 closest('.nav-btn') 找到外层按钮
  document.addEventListener('mouseover', (e) => {
    const el = e.target.closest('.nav-btn, .oh-close, .tw-submit, .bio-link, .project-card')
    if (el) play(800, 'sine', 0.06, 0.04)
  })

  // click — 鼠标点击指定元素时，播放低频咚声（200Hz，三角波）
  // 持续时间 0.1 秒，音量 0.06 — 比悬停音稍长稍响，模拟按键反馈
  document.addEventListener('click', (e) => {
    const el = e.target.closest('.nav-btn, .oh-close, .tw-submit, button')
    if (el) play(200, 'triangle', 0.1, 0.06)
  })
}

/* ---------------------------------------------------
   启动 — 用 setTimeout 延迟执行初始化
   为什么要延迟？
   Vue 的 app.mount() 挂载后，DOM 元素（如 <canvas>）可能还没完全渲染
   用 setTimeout 等待一小段时间，确保 DOM 已经准备好
   100ms 和 300ms 是经验值，足够 DOM 渲染完成但用户还感觉不到延迟
   --------------------------------------------------- */

// 100ms 后初始化粒子背景（挂载后等待 canvas 元素出现在 DOM 中）
setTimeout(initParticles, 100)

// 300ms 后初始化音效（稍微晚一点，等页面完全稳定）
// 延迟更久是因为 AudioContext 需要用户交互后才能使用
setTimeout(initSound, 300)
