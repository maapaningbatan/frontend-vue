<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  total: number;
  perPage: number;
  currentPage: number;
  perPageOptions?: number[];
}>()

const emit = defineEmits(["update:currentPage", "update:perPage"]);

const totalPages = computed(() => Math.ceil(props.total / props.perPage));

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    emit("update:currentPage", page);
  }
};

const changePerPage = (event: Event) => {
  const value = Number((event.target as HTMLSelectElement).value);
  emit("update:perPage", value);
  emit("update:currentPage", 1);
};

const pages = computed(() => {
  const result: (number | string)[] = [];
  if (totalPages.value <= 7) {
    for (let i = 1; i <= totalPages.value; i++) result.push(i);
  } else {
    result.push(1);
    if (props.currentPage > 3) result.push("…");
    const start = Math.max(2, props.currentPage - 1);
    const end = Math.min(totalPages.value - 1, props.currentPage + 1);
    for (let i = start; i <= end; i++) result.push(i);
    if (props.currentPage < totalPages.value - 2) result.push("…");
    result.push(totalPages.value);
  }
  return result;
});
</script>

<template>
  <div class="w-full flex justify-center">
    <div class="flex items-center gap-3 px-4 py-3">
      <!-- First -->
      <button
        class="px-3 py-1.5 rounded-lg text-sm font-small 
               border border-gray-300/50 text-gray-700
               hover:bg-blue-100/40 hover:text-blue-600 hover:border-blue-400
               disabled:opacity-40 disabled:cursor-not-allowed"
        :disabled="currentPage === 1"
        @click="changePage(1)"
      >
        « First
      </button>

      <!-- Prev -->
      <button
        class="px-3 py-1.5 rounded-lg text-sm font-small 
               border border-gray-300/50 text-gray-700
               hover:bg-blue-100/40 hover:text-blue-600 hover:border-blue-400
               disabled:opacity-40 disabled:cursor-not-allowed"
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
      >
        ← Prev
      </button>

      <!-- Pages -->
      <div class="flex items-center gap-1">
        <button
          v-for="(page, i) in pages"
          :key="i"
          :disabled="page === '…'"
          @click="changePage(Number(page))"
          class="w-9 h-9 flex items-center justify-center rounded-lg text-sm font-small 
                 border transition-all duration-200"
          :class="[ 
            page === currentPage
              ? 'text-white shadow-md border-0 bg-gradient-to-r from-blue-400/90 to-blue-500/90 hover:from-blue-500/90 hover:to-blue-600/90'
              : 'border-gray-300/50 text-gray-700 hover:bg-blue-100/40 hover:text-blue-600 hover:border-blue-400'
          ]"
        >
          {{ page }}
        </button>
      </div>

      <!-- Next -->
      <button
        class="px-3 py-1.5 rounded-lg text-sm font-small 
               border border-gray-300/50 text-gray-700
               hover:bg-blue-100/40 hover:text-blue-600 hover:border-blue-400
               disabled:opacity-40 disabled:cursor-not-allowed"
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
      >
        Next →
      </button>

      <!-- Last -->
      <button
        class="px-3 py-1.5 rounded-lg text-sm font-small 
               border border-gray-300/50 text-gray-700
               hover:bg-blue-100/40 hover:text-blue-600 hover:border-blue-400
               disabled:opacity-40 disabled:cursor-not-allowed"
        :disabled="currentPage === totalPages"
        @click="changePage(totalPages)"
      >
        Last »
      </button>

      <!-- Per Page Selector -->
      <select
        class="ml-2 px-3 py-1.5 rounded-lg border border-gray-300/50 text-sm font-small text-gray-700 
               hover:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        :value="perPage"
        @change="changePerPage"
      >
        <option
          v-for="option in (perPageOptions || [10, 20, 30 , 50, 100])"
          :key="option"
          :value="option"
        >
          {{ option }}
        </option>
      </select>
    </div>
  </div>
</template>




