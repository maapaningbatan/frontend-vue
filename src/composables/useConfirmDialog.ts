import { inject } from 'vue'

export function useConfirmDialog() {
  const confirmDialog = inject<any>('confirmDialog')

  if (!confirmDialog) {
    throw new Error('ConfirmDialog is not provided. Make sure it is included in App.vue')
  }

  return confirmDialog.value
}
