<script setup lang="ts">
import AppLogoIcon from '@/components/AppLogoIcon.vue';
</script>

<template>
    <div
        class="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
        <AppLogoIcon class="size-5 fill-current text-white dark:text-black" />
    </div>
    <div class="ml-1 grid flex-1 text-left text-sm">
        <span class="mb-0.5 truncate leading-tight font-semibold text-2xl">PREMIS<span
                class="text-xs font-medium text-gray-500 truncate inline-block version-label">
                Version 2
            </span>
        </span>
    </div>
</template>
<style scoped>
.version-label {
  display: inline-block;
  /* Fully visible from the start */
  opacity: 1;
  /* Smooth floating motion */
  animation: floatSmooth 3s ease-in-out infinite alternate;
}

@keyframes floatSmooth {
  0% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-3px) scale(1.02);
  }
  100% {
    transform: translateY(0) scale(1);
  }
}
</style>
