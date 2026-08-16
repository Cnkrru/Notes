/**
 * 全局 Toast 通知系统
 * 通过 window.toast 暴露，供 Markdown 内 <msg:info>... 按钮等触发
 */

type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastItem {
  id: number
  type: ToastType
  text: string
  leaving: boolean
}

let items: ToastItem[] = []
let listeners: Array<(list: ToastItem[]) => void> = []
let nextId = 1

function emit() {
  listeners.forEach((fn) => fn(items))
}

/** 订阅当前 toast 列表，返回取消订阅函数 */
export function subscribeToast(fn: (list: ToastItem[]) => void): () => void {
  listeners.push(fn)
  return () => {
    listeners = listeners.filter((f) => f !== fn)
  }
}

function remove(id: number) {
  const idx = items.findIndex((t) => t.id === id)
  if (idx === -1) return
  items[idx].leaving = true
  emit()
  setTimeout(() => {
    items = items.filter((t) => t.id !== id)
    emit()
  }, 200)
}

export function showToast(text: string, type: ToastType = 'info', duration: number = 2600) {
  const item: ToastItem = { id: nextId++, type, text, leaving: false }
  items.push(item)
  emit()
  setTimeout(() => remove(item.id), duration)
}

/** 注册到 window，供 v-html 内容中的内联调用使用 */
export function initToast() {
  if ((window as any).toast) return
  ;(window as any).toast = {
    success: (t: string) => showToast(t, 'success'),
    error: (t: string) => showToast(t, 'error'),
    warning: (t: string) => showToast(t, 'warning'),
    info: (t: string) => showToast(t, 'info'),
    add: (t: string, opts?: { type?: ToastType }) => showToast(t, opts?.type || 'info')
  }
}