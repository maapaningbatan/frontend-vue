<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps<{
  label: string
}>()
</script>

<template>
  <button
    class="inline-flex items-center gap-2 rounded-lg
           bg-gradient-to-r from-blue-400/90 to-blue-500/90 
           hover:from-blue-500/90 hover:to-blue-600/90
           px-5 py-2.5 text-white text-sm font-semibold
           shadow-lg shadow-blue-200/30
           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400
           transition duration-200 ease-in-out
           transform hover:scale-105"
  >
    <!-- Plus Icon -->
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
    </svg>

    <!-- Label -->
    <span>{{ label }}</span>
  </button>
</template>

