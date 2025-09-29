<script setup lang="ts">
import { ref } from 'vue'

// Props
const props = defineProps<{
  items: any[]
  columns: ReadonlyArray<{ key: string; label: string; align?: 'left' | 'center' | 'right' }>
  striped?: boolean
}>()

// Emits
const emit = defineEmits<{
  (e: 'rowClick', row: any): void
  (e: 'sort', key: string, order: 'asc' | 'desc'): void
}>()
</script>

<template>
  <div class="overflow-x-auto rounded-lg shadow border border-gray-200 bg-white">
    <table class="min-w-full divide-y divide-gray-200">
      <!-- Header -->
      <thead class="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-10 shadow-sm">
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            :class="[ 
              'px-5 py-3 text-xs font-semibold tracking-wider text-gray-700 uppercase select-none cursor-pointer',
              col.align === 'center'
                ? 'text-center'
                : col.align === 'right'
                  ? 'text-right'
                  : 'text-left',
            ]"
          >
            <div
              class="flex items-center gap-1"
              :class=" 
                col.align === 'center'
                  ? 'justify-center'
                  : col.align === 'right'
                    ? 'justify-end'
                    : 'justify-start'
              "
            >
              {{ col.label }}
            </div>
          </th>
        </tr>
      </thead>

      <!-- Body -->
      <tbody class="bg-white divide-y divide-gray-200">
        <tr
          v-for="row in items"
          :key="row.id"
          :class="[ 
            'hover:bg-blue-50 hover:shadow-sm transition duration-200 cursor-pointer',
            props.striped ? 'odd:bg-white even:bg-gray-50' : '',
          ]"
        >
          <td
            v-for="col in columns"
            :key="col.key"
            :class="[ 
              'px-5 py-3 text-sm text-gray-700',
              col.align === 'center'
                ? 'text-center'
                : col.align === 'right'
                  ? 'text-right'
                  : 'text-left',
            ]"
          >
            <slot :name="col.key" :row="row">{{ row[col.key] }}</slot>
          </td>
        </tr>

        <!-- Empty state -->
        <tr v-if="!items.length">
          <td :colspan="columns.length" class="p-6 text-center text-gray-400 italic">
            No records found.
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Footer slot -->
    <div class="border-t border-gray-200 bg-gray-50 px-5 py-3">
      <slot name="footer" />
    </div>
  </div>
</template>
