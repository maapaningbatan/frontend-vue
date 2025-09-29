<script setup>
import { cn } from "@/lib/utils";

const props = defineProps({
  class: { type: null, required: false },
  active: { type: Boolean, default: false }, // ✅ new prop to mark active item
});
</script>

<template>
  <li
    data-slot="sidebar-menu-sub-item"
    data-sidebar="menu-sub-item"
    :class="cn(
      'group/menu-sub-item relative rounded-lg transition-all duration-300 ease-in-out',
      'px-2 py-2 flex items-center gap-2 text-gray-700 cursor-pointer',
      props.class,
      // Hover and active styling
      props.active
        ? 'bg-gradient-to-r from-teal-500 to-blue-400 text-white scale-105 shadow-lg'
        : 'hover:bg-gradient-to-r from-blue-400/90 to-blue-500/90  hover:text-white hover:scale-105 hover:shadow-lg'
    )"
  >
    <slot />
    <!-- Animated indicator -->
    <span
      class="absolute left-0 top-0 h-full w-1 bg-blue-400 rounded-r-full transition-all duration-300"
      :class="props.active ? 'opacity-100' : 'opacity-0 group-hover/menu-sub-item:opacity-100'"
    ></span>
  </li>
</template>
