<script setup>
import { cn } from "@/lib/utils";

const props = defineProps({
  class: { type: null, required: false },
});
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0 translate-y-1"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-1"
  >
    <!-- Use key based on slot content to trigger transition -->
    <span
      :key="$slots.default?.()[0]?.children ?? 'breadcrumb'"
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      :class="cn(
        'text-gray-700 dark:text-gray-300 font-medium px-2 py-1 rounded transition-colors duration-200',
        'hover:bg-blue-100 dark:hover:bg-blue-700 hover:text-blue-700 dark:hover:text-white cursor-pointer text-xl',
        props.class
      )"
    >
      <slot />
    </span>
  </Transition>
</template>
