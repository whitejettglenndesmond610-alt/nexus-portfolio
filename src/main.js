/* 应用入口 — Vue + Naive UI + 粒子背景 + 音效 */
import { createApp } from 'vue'
import naive from 'naive-ui'
import App from './App.vue'
import router from './router'
import './styles/cyber.css'

const app = createApp(App)
app.use(naive)
app.use(router)
app.mount('#app')

/* ================================================================
   粒子背景 Canvas
   ================================================================ */
function initParticles() {
  const canvas = document.getElementById('particleCanvas')
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  let w, h
  const particles = []

  class Particle {
    constructor() {
      this.reset()
    }
    reset() {
      this.x = Math.random() * w
      this.y = Math.random() * h
      this.size = Math.random() * 1.2 + 0.4
      this.speedX = (Math.random() - 0.5) * 0.3
      this.speedY = (Math.random() - 0.5) * 0.3
      this.opacity = Math.random() * 0.25 + 0.05
    }
    update() {
      this.x += this.speedX; this.y += this.speedY
      if (this.x < -10) this.x = w + 10
      if (this.x > w + 10) this.x = -10
      if (this.y < -10) this.y = h + 10
      if (this.y > h + 10) this.y = -10
    }
    draw() {
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255,230,0,${this.opacity})`
      ctx.fill()
    }
  }

  function resize() {
    w = canvas.width = canvas.offsetWidth
    h = canvas.height = canvas.offsetHeight
  }

  function connect() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x
        const dy = particles[i].y - particles[j].y
        const d = Math.sqrt(dx * dx + dy * dy)
        if (d < 100) {
          ctx.beginPath()
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(particles[j].x, particles[j].y)
          ctx.strokeStyle = `rgba(255,230,0,${0.03 * (1 - d / 100)})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, w, h)
    particles.forEach(p => { p.update(); p.draw() })
    connect()
    requestAnimationFrame(animate)
  }

  resize()
  for (let i = 0; i < 60; i++) particles.push(new Particle())
  animate()
  window.addEventListener('resize', resize)
}

/* ================================================================
   音效引擎（Web Audio API 合成，无需外部文件）
   ================================================================ */
function initSound() {
  let ctx = null
  function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
    return ctx
  }

  function play(freq, type, dur, vol) {
    try {
      const c = getCtx()
      const osc = c.createOscillator()
      const gain = c.createGain()
      osc.type = type
      osc.frequency.value = freq
      gain.gain.value = vol
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur)
      osc.connect(gain)
      gain.connect(c.destination)
      osc.start(c.currentTime)
      osc.stop(c.currentTime + dur)
    } catch (_) {}
  }

  /* hover 音效 */
  document.addEventListener('mouseover', (e) => {
    const el = e.target.closest('.nav-btn, .oh-close, .tw-submit, .bio-link, .project-card')
    if (el) play(800, 'sine', 0.06, 0.04)
  })

  /* click 音效 */
  document.addEventListener('click', (e) => {
    const el = e.target.closest('.nav-btn, .oh-close, .tw-submit, button')
    if (el) play(200, 'triangle', 0.1, 0.06)
  })
}

/* 启动 */
setTimeout(initParticles, 100)
setTimeout(initSound, 300)
