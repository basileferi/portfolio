import { reactive } from 'vue'
import { sfx } from '@/composables/useSound'

export const toasts = reactive([])
let id = 0

export function toast(message, type = 'success', ms = 3500) {
  const t = { id: ++id, message, type }
  toasts.push(t)
  if (type === 'error') sfx.error()
  else if (type === 'success') sfx.success()
  setTimeout(() => {
    const i = toasts.indexOf(t)
    if (i > -1) toasts.splice(i, 1)
  }, ms)
}
