<script setup lang="ts">
import { Check } from "lucide-vue-next"

const props = defineProps<{
  size?: "sm" | "md" | "lg"
  tooltip?: string
  disabled?: boolean
}>()

const sizes = {
  sm: "w-9 h-9 text-[16px]",
  md: "w-14 h-14 text-[20px]",
  lg: "w-16 h-16 text-[24px]",
}
</script>

<template>
  <div class="relative group inline-flex">
    <button
      :disabled="props.disabled"
      :class="[
        'flex items-center justify-center rounded-full shadow-lg transition-all duration-200',
        props.disabled
          ? 'bg-gray-300 text-gray-500 opacity-40 cursor-not-allowed'
          : 'bg-green-500 text-white hover:translate-y-[-4px] hover:shadow-2xl active:translate-y-[1px] active:shadow-md',
        sizes[props.size || 'md']
      ]"
    >
      <Check class="w-5 h-5" />
    </button>

    <!-- Tooltip -->
    <span
      v-if="tooltip && !props.disabled"
      class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50
             px-2 py-1 text-xs font-medium text-white bg-gray-800 rounded-md shadow-lg
             opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap"
    >
      {{ tooltip }}
    </span>
  </div>
</template>
