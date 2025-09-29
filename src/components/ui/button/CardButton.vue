<script setup lang="ts">
import { WalletCards } from "lucide-vue-next";
import { type Component, computed } from "vue";

const emit = defineEmits(["click"]);

// Assign defineProps to a variable
const props = defineProps<{           
  color?: string;              // Tailwind color class e.g., "bg-blue-500"
  size?: "sm" | "md" | "lg";  // Button size
  tooltip?: string;            // Tooltip text
}>()

const sizes = {
  sm: "w-9 h-9",
  md: "w-12 h-12",
  lg: "w-14 h-14",
}

// Default color if not provided
const bgColor = computed(() => props.color || "bg-gray-500")
</script>

<template>
  <div class="relative group inline-flex">
    <button
      :class="[
        'flex items-center justify-center rounded-full text-white shadow-lg transition-all duration-200',
        'hover:translate-y-[-4px] hover:shadow-2xl active:translate-y-[1px] active:shadow-md',
        sizes[props.size || 'md'],
        bgColor
      ]"
      @click.stop="emit('click')"
    >
      <WalletCards class="w-5 h-5" />
    </button>

    <!-- Tooltip -->
    <span
      v-if="props.tooltip"
      class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50
             px-2 py-1 text-xs font-medium text-white bg-gray-800 rounded-md shadow-lg
             opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap"
    >
      {{ props.tooltip }}
    </span>
  </div>
</template>
