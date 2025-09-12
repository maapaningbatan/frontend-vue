<script setup lang="ts">
import AppLayout from '@/components/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types/api';
import { User, Box, Home } from 'lucide-vue-next';


const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
];

// Sample data
const stats = [
  {
    title: 'Inventory Items',
    value: 1245,
    icon: Box,
    color: 'bg-blue-600',
  },
  {
    title: 'Supplies',
    value: 856,
    icon: User,
    color: 'bg-green-600',
  },
  {
    title: 'Properties',
    value: 320,
    icon: Home,
    color: 'bg-purple-600',
  },
];
</script>

<template>
  <AppLayout :breadcrumbs="breadcrumbs">
    <div class="flex h-full flex-1 flex-col gap-6 p-4">
      
      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(stat, index) in stats"
          :key="index"
          class="flex items-center justify-between p-6 rounded-xl shadow-lg bg-gray-800 hover:bg-gray-700 transition-all duration-200"
        >
          <div>
            <h3 class="text-gray-300 text-sm font-medium">{{ stat.title }}</h3>
            <p class="text-white text-2xl font-bold mt-2">{{ stat.value }}</p>
          </div>
          <div
            :class="['p-4 rounded-lg text-white', stat.color]"
          >
            <component :is="stat.icon" class="w-8 h-8"/>
          </div>
        </div>
      </div>

      <!-- Demographic / Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div class="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 class="text-white text-lg font-semibold mb-4">Inventory Demographics</h3>
          <!-- Placeholder for chart -->
          <div class="h-64 flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-600 rounded-lg">
            Chart Placeholder
          </div>
        </div>

        <div class="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 class="text-white text-lg font-semibold mb-4">Supplies & Property Stats</h3>
          <div class="h-64 flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-600 rounded-lg">
            Chart Placeholder
          </div>
        </div>
      </div>

      <!-- Recent Activity Table -->
      <div class="bg-gray-800 p-6 rounded-xl shadow-lg overflow-x-auto">
        <h3 class="text-white text-lg font-semibold mb-4">Recent Inventory Activity</h3>
        <table class="min-w-full text-gray-300">
          <thead class="border-b border-gray-700">
            <tr>
              <th class="py-2 px-4 text-left text-sm font-medium">Item</th>
              <th class="py-2 px-4 text-left text-sm font-medium">Type</th>
              <th class="py-2 px-4 text-left text-sm font-medium">Quantity</th>
              <th class="py-2 px-4 text-left text-sm font-medium">Date Added</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="i in 5" :key="i" class="hover:bg-gray-700 transition-colors">
              <td class="py-2 px-4">Item {{ i }}</td>
              <td class="py-2 px-4">Supply</td>
              <td class="py-2 px-4">10</td>
              <td class="py-2 px-4">2025-09-10</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </AppLayout>
</template>
