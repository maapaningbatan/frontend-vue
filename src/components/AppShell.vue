<script setup lang="ts">
import { ref } from 'vue';
import { SidebarProvider } from '@/components/ui/sidebar';

interface Props {
  variant?: 'header' | 'sidebar';
  defaultOpen?: boolean; // added prop to control sidebar state
}

const props = defineProps<Props>();

// Local reactive state for sidebar open/closed
const isOpen = ref(props.defaultOpen ?? true);
</script>

<template>
  <div v-if="props.variant === 'header'" class="flex min-h-screen w-full flex-col">
    <slot />
  </div>
  <SidebarProvider v-else :default-open="isOpen">
    <slot />
  </SidebarProvider>
</template>
