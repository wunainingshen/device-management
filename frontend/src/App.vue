<template>
  <router-view />
</template>

<script setup>
</script>

<style>
/* ===== 全局设计系统 - Dark Aurora ===== */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  /* 主色调 - 青蓝渐变 */
  --primary-color: #06b6d4;
  --primary-light: #22d3ee;
  --primary-dark: #0891b2;
  --primary-gradient: linear-gradient(135deg, #06b6d4 0%, #0891b2 50%, #0e7490 100%);

  /* 辅助色 */
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --danger-color: #f43f5e;
  --info-color: #6366f1;

  /* 背景色系 */
  --bg-primary: #0a0e1a;
  --bg-secondary: #111827;
  --bg-tertiary: #1a1f2e;
  --bg-card: rgba(26, 31, 46, 0.8);
  --bg-elevated: rgba(30, 41, 59, 0.9);

  /* 边框 */
  --border-color: rgba(148, 163, 184, 0.1);
  --border-light: rgba(148, 163, 184, 0.06);

  /* 文本 */
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;

  /* 阴影 */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 20px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 8px 40px rgba(0, 0, 0, 0.5);
  --shadow-glow: 0 0 20px rgba(6, 182, 212, 0.15);

  /* 圆角 */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;

  /* 玻璃效果 */
  --glass-bg: rgba(26, 31, 46, 0.6);
  --glass-border: rgba(148, 163, 184, 0.08);
  --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);

  /* 过渡 */
  --transition-fast: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-normal: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

html, body, #app {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans SC", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: var(--bg-primary);
  color: var(--text-primary);
}

/* ===== Element Plus 主题覆盖 ===== */

/* 卡片 */
.el-card {
  background: var(--glass-bg) !important;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border) !important;
  border-radius: var(--radius-lg) !important;
  box-shadow: var(--glass-shadow) !important;
  transition: all var(--transition-normal);
}

.el-card:hover {
  border-color: rgba(6, 182, 212, 0.2) !important;
  box-shadow: var(--glass-shadow), var(--shadow-glow) !important;
}

.el-card__header {
  border-bottom: 1px solid var(--border-color) !important;
  padding: 18px 24px !important;
}

/* 表格 */
.el-table {
  background: transparent !important;
  color: var(--text-primary) !important;
  border-radius: var(--radius-md);
  overflow: hidden;
}

.el-table th.el-table__cell {
  background: rgba(6, 182, 212, 0.08) !important;
  color: var(--primary-light) !important;
  font-weight: 600 !important;
  border-bottom: 1px solid var(--border-color) !important;
}

.el-table__cell {
  background: transparent !important;
  color: var(--text-secondary) !important;
  border-bottom: 1px solid var(--border-light) !important;
}

.el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell {
  background: rgba(255, 255, 255, 0.02) !important;
}

.el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell {
  background: rgba(6, 182, 212, 0.05) !important;
}

/* 表单 */
.el-input__wrapper,
.el-select__wrapper,
.el-textarea__inner {
  background: rgba(15, 23, 42, 0.8) !important;
  border: 1px solid var(--border-color) !important;
  border-radius: var(--radius-sm) !important;
  box-shadow: none !important;
  transition: all var(--transition-fast);
}

.el-input__wrapper:hover,
.el-select__wrapper:hover,
.el-textarea__inner:hover {
  border-color: var(--primary-dark) !important;
}

.el-input__wrapper.is-focus,
.el-select__wrapper.is-focus {
  border-color: var(--primary-color) !important;
  box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1) !important;
}

.el-input__inner,
.el-select__placeholder,
.el-textarea__inner {
  color: var(--text-primary) !important;
}

.el-form-item__label {
  color: var(--text-secondary) !important;
  font-weight: 500 !important;
}

/* 按钮 */
.el-button {
  border-radius: var(--radius-sm) !important;
  font-weight: 600 !important;
  transition: all var(--transition-fast) !important;
}

.el-button--primary {
  background: var(--primary-gradient) !important;
  border: none !important;
}

.el-button--primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 20px rgba(6, 182, 212, 0.3) !important;
}

.el-button--danger {
  background: linear-gradient(135deg, #f43f5e, #e11d48) !important;
  border: none !important;
}

.el-button--success {
  background: linear-gradient(135deg, #10b981, #059669) !important;
  border: none !important;
}

.el-button--warning {
  background: linear-gradient(135deg, #f59e0b, #d97706) !important;
  border: none !important;
}

.el-button.is-link {
  background: transparent !important;
}

/* 标签 */
.el-tag {
  border: none !important;
  font-weight: 500 !important;
  border-radius: 6px !important;
}

.el-tag--success {
  background: rgba(16, 185, 129, 0.15) !important;
  color: #34d399 !important;
}

.el-tag--danger {
  background: rgba(244, 63, 94, 0.15) !important;
  color: #fb7185 !important;
}

.el-tag--warning {
  background: rgba(245, 158, 11, 0.15) !important;
  color: #fbbf24 !important;
}

.el-tag--info {
  background: rgba(100, 116, 139, 0.15) !important;
  color: #94a3b8 !important;
}

/* 对话框 */
.el-dialog {
  background: var(--bg-secondary) !important;
  border: 1px solid var(--border-color) !important;
  border-radius: var(--radius-xl) !important;
  box-shadow: var(--shadow-lg) !important;
}

.el-dialog__header {
  border-bottom: 1px solid var(--border-color) !important;
  padding: 20px 24px !important;
}

.el-dialog__title {
  color: var(--text-primary) !important;
  font-weight: 700 !important;
}

.el-dialog__body {
  padding: 24px !important;
}

.el-dialog__footer {
  border-top: 1px solid var(--border-color) !important;
  padding: 16px 24px !important;
}

/* 下拉菜单 */
.el-dropdown-menu {
  background: var(--bg-elevated) !important;
  border: 1px solid var(--border-color) !important;
  border-radius: var(--radius-md) !important;
  box-shadow: var(--shadow-lg) !important;
  backdrop-filter: blur(20px);
}

.el-dropdown-menu__item {
  color: var(--text-secondary) !important;
}

.el-dropdown-menu__item:hover {
  background: rgba(6, 182, 212, 0.1) !important;
  color: var(--primary-light) !important;
}

.el-dropdown-menu__item--divided {
  border-top-color: var(--border-color) !important;
}

/* 消息提示 */
.el-message {
  background: var(--bg-elevated) !important;
  border: 1px solid var(--border-color) !important;
  border-radius: var(--radius-md) !important;
  backdrop-filter: blur(20px) !important;
  color: var(--text-primary) !important;
}

/* 分页 */
.el-pagination {
  --el-pagination-text-color: var(--text-secondary);
  --el-pagination-hover-color: var(--primary-color);
}

.el-pagination button,
.el-pager li {
  background: transparent !important;
  color: var(--text-secondary) !important;
  border-radius: var(--radius-sm) !important;
}

.el-pager li.active {
  background: var(--primary-gradient) !important;
  color: #fff !important;
}

/* 空状态 */
.el-empty__description p {
  color: var(--text-muted) !important;
}

/* 滚动条 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.2);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.3);
}

/* 页面入口动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--transition-normal);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all var(--transition-normal);
}

.slide-fade-leave-active {
  transition: all var(--transition-fast);
}

.slide-fade-enter-from {
  transform: translateY(10px);
  opacity: 0;
}

.slide-fade-leave-to {
  opacity: 0;
}
</style>
