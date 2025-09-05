<script setup lang="ts">
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem } from '@/types/api';

withDefaults(
    defineProps<{
        breadcrumbs?: BreadcrumbItem[];
    }>(),
    {
        breadcrumbs: () => [],
    },
);
</script>

<template>
  <header
    class="flex h-16 shrink-0 items-center gap-3 border-b border-gray-200 bg-white px-6 shadow-sm transition-[width,height] ease-linear
           group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4"
  >
    <div class="flex items-center gap-3">
      <SidebarTrigger
        class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      />
      <template v-if="breadcrumbs && breadcrumbs.length > 0">
        <Breadcrumbs :breadcrumbs="breadcrumbs" />
      </template>
    </div>
  </header>
</template>

