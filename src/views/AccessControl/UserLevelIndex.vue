
<template>
  <AppLayout :breadcrumbs="breadcrumbs">
    <div class="flex flex-col gap-6 p-6">
      <!-- Header -->
      <header class="mb-6 text-center sm:text-left">
        <h1 class="text-3xl font-bold text-gray-800">User Levels</h1>
      </header>

      <!-- Top Actions -->
      <section class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <!-- Search & Rows per Page -->
        <div class="flex items-center gap-3 w-full sm:w-auto">
          <div class="relative w-full sm:w-64">
            <Search
              class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"
            />
            <Input
              v-model="searchTerm"
              type="text"
              autocomplete="off"
              placeholder="Search levels..."
              class="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Paginator
            v-model:first="first"
            v-model:rows="rows"
            :totalRecords="totalRecords"
            :rowsPerPageOptions="[10, 20, 30, 40, 50]"
            template="RowsPerPageDropdown"
          />
        </div>

        <!-- Create Button -->
        <button
          class="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition"
          @click="openCreateModal"
        >
          + Create Level
        </button>
      </section>

      <!-- Loading / Error States -->
      <div v-if="loading" class="text-gray-500 text-center py-12">
        Loading user levels...
      </div>
      <div v-else-if="errorMsg" class="text-red-600 text-center py-12">
        {{ errorMsg }}
      </div>

      <!-- Table -->
      <div
        v-else
        class="overflow-x-auto rounded-lg shadow border border-gray-200"
      >
        <table class="min-w-full divide-y divide-gray-200">
<thead class="bg-gray-50">
  <tr>
    <th
      v-for="col in ['Name','Permissions','Actions']"
      :key="col"
      class="px-4 py-3 text-left text-sm font-semibold text-gray-600"
    >
      {{ col }}
    </th>
  </tr>
</thead>
<tbody class="bg-white divide-y divide-gray-200">
  <tr v-for="level in paginatedLevels" :key="level.id" class="hover:bg-blue-50 transition">
    <!-- Name -->
    <td class="px-4 py-3 text-sm font-medium text-gray-800">
      {{ level.userlevel }}
    </td>

<!-- Permissions Column -->
<td class="px-4 py-3 text-sm">
  <router-link
    :to="`/access-control/user-levels/${level.id}/permissions`"
    class="px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
  >
    Manage
  </router-link>
</td>

    <!-- Actions -->
    <td class="px-4 py-3 flex justify-center gap-2">
      <button
        class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
        @click="openEditModal(level)"
      >
        Edit
      </button>
      <button
        class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
        @click="openDeleteModal(level)"
      >
        Delete
      </button>
    </td>
  </tr>

  <tr v-if="!filteredLevels.length">
    <td colspan="5" class="p-6 text-center text-gray-400 italic">
      No user levels found.
    </td>
  </tr>
</tbody>


        </table>

        <!-- Footer Info -->
        <div class="bg-gray-50 px-4 py-2 text-sm text-gray-700 border-t flex justify-between">
          <span>
            Showing <strong>{{ startItem }}</strong> to <strong>{{ endItem }}</strong> of
            <strong>{{ totalRecords }}</strong> entries
          </span>
        </div>
      </div>

      <!-- Paginator -->
      <div class="mt-4 flex justify-center">
        <Paginator
          v-model:first="first"
          v-model:rows="rows"
          :totalRecords="totalRecords"
          :rowsPerPageOptions="[10, 20, 30]"
          class="shadow rounded-lg"
        />
      </div>

      <!-- Modals -->
      <UserLevelEdit
        v-if="isEditModalOpen && selectedLevel"
        :level="selectedLevel"
        @close="closeEditModal"
        @updated="fetchLevels"
      />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import AppLayout from '@/components/layouts/AppLayout.vue'
import { type BreadcrumbItem } from '@/types/api'
import Paginator from 'primevue/paginator'
import { Search } from 'lucide-vue-next'
import Input from '@/components/ui/Input.vue'
// import UserLevelEdit from './UserLevelEdit.vue'
import axios from 'axios'

// Breadcrumbs
const breadcrumbs: BreadcrumbItem[] = [{ title: 'User Levels', href: '/user-levels' }]

// State
const loading = ref(false)
const errorMsg = ref<string | null>(null)
const levels = ref<any[]>([])

// Pagination
const first = ref(0)
const rows = ref(10)

// Search
const searchTerm = ref('')
const filteredLevels = computed(() => {
  if (!searchTerm.value.trim()) return levels.value
  const term = searchTerm.value.toLowerCase()
  return levels.value.filter(
    l =>
      l.userlevel.toLowerCase().includes(term) ||
      (l.permissions ?? '').toLowerCase().includes(term)
  )
})

// Paginated levels
const paginatedLevels = computed(() => {
  return filteredLevels.value.slice(first.value, first.value + rows.value)
})

// Computed for "Showing items"
const totalRecords = computed(() => filteredLevels.value.length)
const startItem = computed(() => (totalRecords.value === 0 ? 0 : first.value + 1))
const endItem = computed(() => {
  const end = first.value + rows.value
  return end > totalRecords.value ? totalRecords.value : end
})

// Fetch levels
const fetchLevels = async () => {
  loading.value = true
  errorMsg.value = null
  try {
await axios.get('http://localhost:8000/api/user-levels')
  .then(res => {
    levels.value = res.data
  })
  } catch (e: any) {
    errorMsg.value = e?.response?.data?.message || 'Failed to load user levels.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchLevels)

// Modals
const isCreateModalOpen = ref(false)
const isEditModalOpen = ref(false)
const selectedLevel = ref<any | null>(null)

const openCreateModal = () => (isCreateModalOpen.value = true)
const openEditModal = (level: any) => {
  selectedLevel.value = level
  isEditModalOpen.value = true
}
const closeEditModal = () => (isEditModalOpen.value = false)

const openDeleteModal = (level: any) => {
  if (confirm(`Are you sure you want to delete "${level.name}"?`)) {
    axios.delete(`http://localhost:8000/api/user-levels/${level.id}`).then(fetchLevels)
  }
}
</script>
