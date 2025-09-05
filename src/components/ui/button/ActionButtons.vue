<template>
  <div class="flex gap-2">
    <!-- Edit Button -->
    <button
      @click="$emit('edit')"
      class="p-2 rounded-full border border-green-500 text-green-500 hover:bg-green-50 transition"
      title="Edit"
    >
      <Edit class="w-4 h-4" />
    </button>

    <!-- Delete Button -->
    <button
      @click="$emit('delete')"
      class="p-2 rounded-full border border-red-500 text-red-500 hover:bg-red-50 transition"
      title="Delete"
    >
      <Trash class="w-4 h-4" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { Edit, Trash } from 'lucide-vue-next'
</script>

<style scoped>
button {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
</style>
