<template>
  <transition name="dialog">
    <div
      v-if="visible"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <div
        class="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl max-w-md w-full p-8 relative transform transition-all"
      >
        <!-- Close button -->
        <button
          @click="cancel"
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          ✕
        </button>

        <!-- Icon -->
        <div class="flex justify-center">
          <div
            :class="[
              'flex items-center justify-center w-16 h-16 rounded-full mb-5',
              typeClass
            ]"
          >
            <span v-html="iconSvg" class="h-7 w-7 text-white"></span>
          </div>
        </div>

        <!-- Title -->
        <h3 class="text-xl font-semibold text-center text-gray-900">
          {{ title }}
        </h3>

        <!-- Message -->
        <p class="mt-3 text-center text-gray-600 text-base leading-relaxed">
          {{ message }}
        </p>

        <!-- Buttons -->
        <div class="mt-8 flex justify-center gap-4">
          <button
            class="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-600 bg-white/70 hover:bg-gray-100 transition-all shadow-sm"
            @click="cancel"
          >
            Cancel
          </button>
          <button
            :class="[
              'px-5 py-2.5 rounded-lg text-white font-medium shadow-md hover:shadow-lg transition-all',
              confirmClass
            ]"
            @click="confirmAction"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const visible = ref(false)
const title = ref('')
const message = ref('')
const confirmText = ref('Confirm')
const type = ref<'danger' | 'success' | 'info'>('info')

let resolveFn: (value: boolean) => void

// Type classes for icon + button
const typeClass = computed(() => {
  switch (type.value) {
    case 'danger':
      return 'bg-red-500 shadow-lg shadow-red-300'
    case 'success':
      return 'bg-green-500 shadow-lg shadow-green-300'
    case 'info':
    default:
      return 'bg-blue-500 shadow-lg shadow-blue-300'
  }
})

const confirmClass = computed(() => {
  switch (type.value) {
    case 'danger':
      return 'bg-red-500 hover:bg-red-600'
    case 'success':
      return 'bg-green-500 hover:bg-green-600'
    case 'info':
    default:
      return 'bg-blue-600 hover:bg-blue-700'
  }
})

const iconSvg = computed(() => {
  switch (type.value) {
    case 'danger':
      return `<svg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' d='M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'/></svg>`
    case 'success':
      return `<svg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' d='M5 13l4 4L19 7'/></svg>`
    case 'info':
    default:
      return `<svg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' d='M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z'/></svg>`
  }
})

// Open dialog
function open(opts: {
  title: string
  message: string
  confirmText?: string
  type?: 'danger' | 'success' | 'info'
}): Promise<boolean> {
  title.value = opts.title
  message.value = opts.message
  confirmText.value = opts.confirmText || 'Confirm'
  type.value = opts.type || 'info'

  visible.value = true

  return new Promise((resolve) => {
    resolveFn = resolve
  })
}

function confirmAction() {
  visible.value = false
  resolveFn(true)
}

function cancel() {
  visible.value = false
  resolveFn(false)
}

// Expose open function for global use
defineExpose({ open })
</script>

<style>
.dialog-enter-active,
.dialog-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
