import { ref } from 'vue'
import { defineStore } from 'pinia'

export type NotificationType = 'success' | 'error' | 'info'

export interface Notification {
  id: number
  type: NotificationType
  title: string
  message: string
  duration: number
}

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<Notification[]>([])

  function show(
    type: NotificationType,
    title: string,
    message: string,
    duration = 3000
  ) {
    const id = Date.now()
    notifications.value.push({ id, type, title, message, duration })

    // Auto-remove after `duration`
    setTimeout(() => {
      dismiss(id)
    }, duration)
  }

  function dismiss(id: number) {
    notifications.value = notifications.value.filter((n) => n.id !== id)
  }

  return { notifications, show, dismiss }
})
