<template>
  <header class="h-16 bg-white shadow-md flex items-center px-6 justify-between">
    <h1 class="font-bold text-xl">Dashboard</h1>
    <div class="flex items-center space-x-4">
      <span class="text-gray-600">Welcome, {{ user?.Username }}</span>
    </div>
  </header>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  user: Object
});
</script>
