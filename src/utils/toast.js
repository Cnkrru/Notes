/**
 * 全局 Toast 通知系统
 * 通过 window.toast 暴露，供 Markdown 内 <msg:info>... 按钮等触发
 */

let items = []
let listeners = []
let nextId = 1

function emit() {
  listeners.forEach((fn) => fn(items))
}

/** 订阅当前 toast 列表，返回取消订阅函数 */
export function subscribeToast(fn) {
  listeners.push(fn)
  return () => {
    listeners = listeners.filter((f) => f !== fn)
  }
}

function remove(id) {
  const idx = items.findIndex((t) => t.id === id)
  if (idx === -1) return
  items[idx].leaving = true
  emit()
  setTimeout(() => {
    items = items.filter((t) => t.id !== id)
    emit()
  }, 200)
}

export function showToast(text, type = 'info', duration = 2600) {
  const item = { id: nextId++, type, text, leaving: false }
  items.push(item)
  emit()
  setTimeout(() => remove(item.id), duration)
}

/** 注册到 window，供 v-html 内容中的内联调用使用 */
export function initToast() {
  if (window.toast) return
  window.toast = {
    success: (t) => showToast(t, 'success'),
    error: (t) => showToast(t, 'error'),
    warning: (t) => showToast(t, 'warning'),
    info: (t) => showToast(t, 'info'),
    add: (t, opts) => showToast(t, opts?.type || 'info')
  }
}