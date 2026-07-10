/* ============================================================================
 * 赛博朋克主题配置 — Naive UI 全局设计 Token
 * ============================================================================
 * NConfigProvider 读取这个对象，自动给所有 Naive UI 组件上色
 * 改了这里的数值，全站按钮/弹窗/表单颜色同步变化
 *
 * primaryColor  = 主色（金色 #FFE600）  → 按钮、链接、选中态
 * infoColor     = 信息色（青色）         → 提示框、信息图标
 * errorColor    = 错误色（红色）         → 表单验证失败、危险按钮
 * bodyColor     = 页面背景               → 弹窗/卡片内背景
 * textColor1    = 主文字                 → 标题、正文
 * textColor2    = 次要文字               → 辅助说明
 * borderColor   = 边框色                 → 所有组件的边框
 * ============================================================================ */

export const cyberTheme = {
  common: {
    // ---- 主色调（赛博朋克金色）----
    primaryColor: '#FFE600',
    primaryColorHover: '#FFED33',
    primaryColorPressed: '#E6CF00',
    primaryColorSuppl: '#FFE600',

    // ---- 辅助色 ----
    infoColor: '#00E5FF',
    infoColorHover: '#33EAFF',
    infoColorPressed: '#00CCE6',

    successColor: '#00E5FF',
    warningColor: '#FFE600',
    errorColor: '#FF0040',

    // ---- 背景色 ----
    bodyColor: '#08080c',
    cardColor: '#0c0c14',
    modalColor: '#0c0c14',
    popoverColor: '#0c0c14',
    tableColor: '#0c0c14',

    // ---- 边框 ----
    borderColor: 'rgba(255,230,0,0.12)',
    dividerColor: 'rgba(255,230,0,0.1)',

    // ---- 文字层级 ----
    textColor1: '#E8ECF0',
    textColor2: '#5C6670',
    textColor3: '#2A2E35',
    placeholderColor: '#2A2E35',

    // ---- 圆角 + 字号 ----
    borderRadius: '2px',
    fontSize: '14px',
    fontSizeSmall: '12px',
    fontSizeMedium: '14px',
    fontSizeLarge: '16px',

    // ---- 字体 ----
    fontFamily: "'Rajdhani', 'Inter', sans-serif",
    fontFamilyMono: "'Share Tech Mono', monospace",
    fontWeightStrong: '700',

    // ---- 阴影（霓虹发光）----
    boxShadow1: '0 0 12px rgba(255,230,0,0.4)',
    boxShadow2: '0 0 20px rgba(255,230,0,0.15)',
  },
}
