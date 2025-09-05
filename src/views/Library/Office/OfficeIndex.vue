<script setup lang="ts">
import AppLayout from '@/components/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types/api';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Office',
        href: '/office',
    },
];
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
            <p>Office content goes here</p>
        </div>
    </AppLayout>
</template>
