<script setup lang="ts">
import { ref } from "vue";
import { cn } from "@/lib/utils";

const { class: className } = defineProps({
  class: { type: null, required: false },
});

const isOpen = ref(false);

function open() {
  isOpen.value = true;
}
function close() {
  isOpen.value = false;
}
</script>

<template>
  <li data-slot="sidebar-menu-item" data-sidebar="menu-item" @mouseenter="open" @mouseleave="close" :class="cn(
    'group/menu-item relative rounded-md transition-colors duration-200',
    'hover:bg-gradient-to-r hover:from-cyan-500 hover:to-cyan-700 hover:text-white',
    className
  )">
    <slot />

    <!-- Submenu with smooth transition -->
    <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-2">
      <ul v-show="isOpen && $slots.submenu"
        class="absolute left-full top-0 mt-0 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md overflow-hidden">
        <slot name="submenu" />
      </ul>
    </Transition>
  </li>
</template>
