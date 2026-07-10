<!--
  ============================================================================
  加密通讯覆盖层 — OverlayContact.vue
  ============================================================================
  模拟命令行终端风格的联系表单
  - useMessage() 是 Naive UI 的消息 API，比手写 Toast 简单得多
  - v-model 双向绑定表单数据
  - errors 响应式对象驱动验证状态
  ============================================================================
-->

<script setup>
/* 加密通讯覆盖层 — 终端风格联系表单，用 Naive UI useMessage 做提示 */
import { ref } from 'vue'
import { useMessage } from 'naive-ui'

const emit = defineEmits(['close'])
const message = useMessage()

/* 表单数据 + 状态 */
const form    = ref({ name: '', email: '', message: '' })
const loading = ref(false)
const errors  = ref({})

/* 终端风格验证 */
function validate() {
  errors.value = {}
  if (!form.value.name.trim())         errors.value.name    = '错误：代号不能为空'
  else if (form.value.name.trim().length < 2) errors.value.name = '错误：代号过短'

  if (!form.value.email.trim())        errors.value.email   = '错误：加密链路不能为空'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email.trim()))
    errors.value.email = '错误：链路格式无效'

  if (!form.value.message.trim())      errors.value.message = '错误：任务简述不能为空'
  else if (form.value.message.trim().length < 6)
    errors.value.message = '错误：信息不足'

  return Object.keys(errors.value).length === 0
}

/* 提交到 Formspree——替换 YOUR_FORM_ID 为你的真实 ID */
const FORMSPREE_URL = 'https://formspree.io/f/YOUR_FORM_ID'

async function submit() {
  if (!validate()) return
  loading.value = true

  try {
    const res = await fetch(FORMSPREE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.value.name,
        email: form.value.email,
        message: form.value.message,
      }),
    })
    if (res.ok) {
      form.value = { name: '', email: '', message: '' }
      message.success('[系统] 消息已加密传输 — 确认收到', { duration: 4000 })
    } else {
      message.error('[系统] 传输失败 — 请稍后重试', { duration: 4000 })
    }
  } catch (_) {
    message.error('[系统] 传输失败 — 请稍后重试', { duration: 4000 })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="overlay-container active" @click.self="$emit('close')">
    <div class="overlay-bg"></div>
    <div class="overlay-inner">
      <div class="overlay-header">
        <span class="oh-id">03</span>
        <h2 class="oh-title"><span class="oh-slash">//</span> 加密通讯</h2>
        <button class="oh-close" @click="$emit('close')">断开连接</button>
      </div>

      <!-- 终端窗口 -->
      <div class="terminal-window">
        <!-- 终端顶栏：三色圆点 + 标题 -->
        <div class="tw-header">
          <span class="tw-dot r"></span>    <!-- 红点：关闭 -->
          <span class="tw-dot y"></span>    <!-- 黄点：最小化 -->
          <span class="tw-dot g"></span>    <!-- 绿点：全屏 -->
          <span class="tw-title">加密信道_v3.7</span>
        </div>

        <div class="tw-body">
          <!-- 模拟终端输出 -->
          <p class="tw-line"><span class="tw-prompt">root@nexus:~$</span> 初始化安全传输协议…</p>
          <p class="tw-line dim"><span class="tw-prompt">root@nexus:~$</span> RSA_4096 握手完成。</p>
          <p class="tw-line dim"><span class="tw-prompt">root@nexus:~$</span> 等待输入指令…</p>

          <!-- 表单 -->
          <form class="tw-form" @submit.prevent="submit">
            <!-- 字段：代号 -->
            <div class="tw-field" :class="{ error: errors.name }">
              <label>$ 设置代号:</label>
              <input v-model="form.name" placeholder="输入你的代号…" />
              <span class="tw-err">{{ errors.name }}</span>
            </div>
            <!-- 字段：加密链路（邮箱） -->
            <div class="tw-field" :class="{ error: errors.email }">
              <label>$ 加密链路:</label>
              <input v-model="form.email" placeholder="输入加密通讯链路…" />
              <span class="tw-err">{{ errors.email }}</span>
            </div>
            <!-- 字段：任务简述 -->
            <div class="tw-field" :class="{ error: errors.message }">
              <label>$ 任务简述:</label>
              <textarea v-model="form.message" rows="3" placeholder="简述你的任务需求…"></textarea>
              <span class="tw-err">{{ errors.message }}</span>
            </div>

            <!-- 提交按钮 -->
            <button type="submit" class="tw-submit" :class="{ loading }">
              <span class="tw-btn-label">[ 执行加密传输 ]</span>
              <!-- loading 态：三个金色三角形跳动 -->
              <span class="tw-btn-loader"><i></i><i></i><i></i></span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
