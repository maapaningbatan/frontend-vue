<script setup lang="ts">
import AppLayout from '@/components/layouts/app/AppSidebarLayout.vue';
import type { BreadcrumbItem } from '@/types/api';

interface Props {
    breadcrumbs?: BreadcrumbItem[];
}

withDefaults(defineProps<Props>(), {
    breadcrumbs: () => [],
});
</script>

<template>
  <AppLayout :breadcrumbs="breadcrumbs">
    <!-- Wrap slot content with transition for breadcrumbs / page content -->
    <Transition
      name="breadcrumb-fade"
      mode="out-in"
      appear
    >
      <slot />
    </Transition>
  </AppLayout>
</template>

<style scoped>
.breadcrumb-fade-enter-active,
.breadcrumb-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.breadcrumb-fade-enter-from {
  opacity: 0;
  transform: translateY(-5px);
}
.breadcrumb-fade-enter-to {
  opacity: 1;
  transform: translateY(0);
}
.breadcrumb-fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.breadcrumb-fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
