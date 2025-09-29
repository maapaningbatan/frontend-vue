<template>
  <Transition name="pop-bounce" appear>
    <div
      v-if="visible"
      class="flex w-full max-w-md items-start gap-3 rounded-2xl p-5 shadow-xl relative overflow-hidden border border-white/20 backdrop-blur-lg"
      :style="bgGradient"
      role="status"
    >
      <!-- Icon -->
      <div :class="['flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-md text-white animate-pulse-slow', iconBgClass]">
        <span v-html="iconSvg" class="h-6 w-6"></span>
      </div>

      <!-- Content -->
      <div class="flex flex-col flex-1">
        <div class="font-semibold text-gray-900 text-base">{{ title }}</div>
        <div class="text-sm text-gray-600 mt-0.5 leading-snug">{{ message }}</div>
        <a
          v-if="actionText && actionLink"
          :href="actionLink"
          target="_blank"
          class="mt-2 text-sm font-medium text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
        >
          {{ actionText }}
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h6m0 0v6m0-6L10 16" />
          </svg>
        </a>
      </div>

      <!-- Close button -->
      <button
        v-if="dismissible"
        class="absolute top-3 right-3 h-7 w-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors"
        @click="close"
      >
        ×
      </button>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  type: { type: String, default: 'info' },
  title: { type: String, required: true },
  message: { type: String, required: true },
  actionText: { type: String, default: '' },
  actionLink: { type: String, default: '' },
  show: { type: Boolean, default: true },
  dismissible: { type: Boolean, default: true },
  duration: { type: Number, default: 3000 }
})

const emit = defineEmits(['update:show'])
const visible = ref(props.show)
let autoCloseTimeout = null

watch(visible, (v) => emit('update:show', v))
watch(
  () => props.show,
  (val) => {
    visible.value = val
    if (val && props.duration > 0) startAutoDismiss()
    else cleanup()
  }
)

const bgGradient = computed(() => {
  switch (props.type) {
    case 'success': return { background: 'linear-gradient(135deg, #dcfce7cc, #ffffffaa)' }
    case 'error':   return { background: 'linear-gradient(135deg, #fee2e2cc, #ffffffaa)' }
    case 'info':    return { background: 'linear-gradient(135deg, #dbeafecc, #ffffffaa)' }
    default:        return { background: 'linear-gradient(135deg, #f3f4f6cc, #ffffffaa)' }
  }
})

const iconBgClass = computed(() => {
  switch (props.type) {
    case 'success': return 'bg-green-500'
    case 'error':   return 'bg-red-500'
    case 'info':    return 'bg-blue-500'
    default:        return 'bg-gray-400'
  }
})

const iconSvg = computed(() => {
  const icons = {
    success: `<svg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' d='M5 13l4 4L19 7'/></svg>`,
    error:   `<svg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' d='M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z'/></svg>`,
    info:    `<svg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' d='M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z'/></svg>`
  }
  return icons[props.type] || icons.info
})

onMounted(() => { if (props.show && props.duration > 0) startAutoDismiss() })
onBeforeUnmount(() => cleanup())

function startAutoDismiss() {
  cleanup()
  autoCloseTimeout = setTimeout(() => { visible.value = false }, props.duration)
}
function cleanup() {
  if (autoCloseTimeout) {
    clearTimeout(autoCloseTimeout)
    autoCloseTimeout = null
  }
}
function close() {
  cleanup()
  visible.value = false
}
</script>

<style scoped>
/* Bounce animations */
@keyframes bounce-down-in {
  0%   { transform: scale(0.9) translateY(-100%); opacity: 0; }
  60%  { transform: scale(1.02) translateY(20px); opacity: 1; }
  80%  { transform: scale(0.98) translateY(-10px); }
  100% { transform: scale(1) translateY(0); }
}
@keyframes bounce-up-out {
  0%   { transform: scale(1) translateY(0); opacity: 1; }
  20%  { transform: scale(1.02) translateY(-10px); }
  40%  { transform: scale(0.95) translateY(20px); }
  100% { transform: scale(0.9) translateY(-100%); opacity: 0; }
}

.pop-bounce-enter-active {
  animation: bounce-down-in 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}
.pop-bounce-leave-active {
  animation: bounce-up-out 0.5s ease-in forwards;
}

/* Slow pulse for icon */
@keyframes pulse-slow {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.9; }
}
.animate-pulse-slow {
  animation: pulse-slow 2s infinite;
}
</style>
