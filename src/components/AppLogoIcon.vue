<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

defineOptions({
  inheritAttrs: false,
});

interface Props {
  className?: HTMLAttributes['class'];
}

defineProps<Props>();
</script>

<template>
  <div
    class="relative w-[40px] h-[42px] overflow-hidden"
    :class="className"
    v-bind="$attrs"
  >
    <img
      src="/images/logo.png"
      alt="Logo"
      class="w-full h-full object-contain"
    />
  </div>
</template>
