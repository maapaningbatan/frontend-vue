  <script setup lang="ts">
  import AppLayout from '@/components/layouts/AppLayout.vue';
  import { type BreadcrumbItem } from '@/types/api';


  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Dashboard',
      href: '/dashboard',
    },
  ];
  </script>

  <template>
    <AppLayout :breadcrumbs="breadcrumbs">
      <div class="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
      
      </div>
    </AppLayout>
  </template>
