<script setup lang="ts">
import { Trash } from "lucide-vue-next"

const emit = defineEmits(["delete"])

defineProps<{
  size?: "sm" | "md" | "lg"
  tooltip?: string
}>()

const sizes = {
  sm: "w-9 h-9",
  md: "w-12 h-12",
  lg: "w-14 h-14",
}
</script>

<template>
  <div class="relative group inline-flex">
    <button
      :class="[ 
        'flex items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition-all duration-200',
        'hover:translate-y-[-4px] hover:shadow-2xl active:translate-y-[1px] active:shadow-md',
        sizes[size || 'md']
      ]"
      @click.stop="emit('delete')"
    >
      <Trash class="w-5 h-5" />
    </button>

    <!-- Tooltip -->
    <span
      v-if="tooltip"
      class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50
             px-2 py-1 text-xs font-medium text-white bg-gray-800 rounded-md shadow-lg
             opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap"
    >
      {{ tooltip }}
    </span>
  </div>
</template>
