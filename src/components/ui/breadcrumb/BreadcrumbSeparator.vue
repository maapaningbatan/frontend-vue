<script setup>
import { ChevronRight } from "lucide-vue-next";
import { cn } from "@/lib/utils";

const props = defineProps({
  class: { type: null, required: false },
});
</script>

<template>
  <li
    data-slot="breadcrumb-separator"
    role="presentation"
    aria-hidden="true"
    :class="cn('flex items-center', props.class)"
  >
    <slot>
      <ChevronRight 
        class="w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-200 hover:text-blue-500 hover:scale-110"
      />
    </slot>
  </li>
</template>
