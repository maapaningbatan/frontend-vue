<script setup lang="ts">
import { ref, defineProps, watch } from 'vue'

const props = defineProps<{
  modelValue?: string
  placeholder?: string
}>()

const emit = defineEmits(['update:modelValue'])

const searchText = ref(props.modelValue || '')

// Sync with parent v-model
watch(searchText, (val) => emit('update:modelValue', val))
watch(() => props.modelValue, (val) => {
  if (val !== searchText.value) searchText.value = val || ''
})

// Handle Esc key
const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    searchText.value = ''
  }
}

// Clear button click
const clearSearch = () => {
  searchText.value = ''
}
</script>

<template>
  <div class="relative w-full max-w-sm">
    <!-- Input -->
    <input
      type="text"
      v-model="searchText"
      @keydown="onKeyDown"
      :placeholder="placeholder || 'Search...'"
      class="
        w-full pr-10 pl-4 py-2 rounded-lg border border-gray-300 
        text-gray-700 placeholder-gray-400
        outline-none
        transition-all duration-300 ease-in-out
        focus:ring-2 focus:ring-blue-400 focus:border-blue-400
        hover:border-gray-400
        shadow-sm
      "
    />

    <!-- Search Icon -->
    <div
      class="
        absolute right-0 top-0 h-full flex items-center px-3
        bg-gradient-to-r from-blue-400/90 to-blue-500/90 
           hover:from-blue-500/90 hover:to-blue-600/90 rounded-r-lg
        pointer-events-none
        transition-all duration-300
      "
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"/>
      </svg>
    </div>

    <!-- Clear Button -->
    <button
      v-if="searchText"
      @click="clearSearch"
      class="
        absolute right-11 top-0 h-full flex items-center px-3
        text-gray-400 hover:text-white hover:bg-gray-600
        transition-all duration-200 ease-in-out
      "
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
      </svg>
    </button>
  </div>
</template>
