<script setup lang="ts">
import { ref, computed } from 'vue'
import AppLayout from '@/components/layouts/AppLayout.vue'
import { type BreadcrumbItem } from '@/types/api'
import AddButton from '@/components/ui/button/AddButton.vue'
import SearchInput from '@/components/ui/search/SearchInput.vue'
import Pagination from '@/components/ui/pagination/Pagination.vue'
import BaseTable from '@/components/ui/table/BaseTable.vue'

// --------------------
// Types
// --------------------
type User = { id: number; name: string; email: string; role: string }

// --------------------
// Breadcrumbs
// --------------------
const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Property Management', href: '#' },
  { title: 'ICS Record', href: '/ics-record' },
]

// --------------------
// Users data
// --------------------
const users = ref<User[]>([
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Editor' },
  { id: 3, name: 'Bob Lee', email: 'bob@example.com', role: 'Viewer' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Manager' },
  { id: 5, name: 'Chris Green', email: 'chris@example.com', role: 'User' },
  { id: 6, name: 'Diana White', email: 'diana@example.com', role: 'Admin' },
  { id: 7, name: 'Ethan Black', email: 'ethan@example.com', role: 'Editor' },
])

// --------------------
// Table columns
// --------------------
const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Full Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
]

// --------------------
// Search
// --------------------
const searchQuery = ref('')

// --------------------
// Sorting state
// --------------------
const sortKey = ref<keyof User | null>(null)
const sortOrder = ref<'asc' | 'desc'>('asc')

// --------------------
// Handle sort from BaseTable
// --------------------
const handleSort = (key: string, order: 'asc' | 'desc') => {
  if (['id', 'name', 'email', 'role'].includes(key)) {
    sortKey.value = key as keyof User
    sortOrder.value = order
    currentPage.value = 1 // reset page when sorting
  }
}

// --------------------
// Filtered & sorted users
// --------------------
const filteredUsers = computed(() => {
  let filtered = users.value.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.value.toLowerCase())
  )

  if (sortKey.value) {
    filtered = filtered.slice().sort((a, b) => {
      const valA = a[sortKey.value!]
      const valB = b[sortKey.value!]
      if (valA < valB) return sortOrder.value === 'asc' ? -1 : 1
      if (valA > valB) return sortOrder.value === 'asc' ? 1 : -1
      return 0
    })
  }

  return filtered
})

// --------------------
// Pagination
// --------------------
const currentPage = ref(1)
const perPage = ref(10)

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  return filteredUsers.value.slice(start, start + perPage.value)
})

// Total records
const total = computed(() => filteredUsers.value.length)
</script>

<template>
  <AppLayout :breadcrumbs="breadcrumbs">
    <div class="flex flex-col gap-6 p-6">
      <!-- Header + Controls -->
      <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div class="text-center sm:text-left">
          <h1 class="text-xl font-bold text-gray-800 flex items-center gap-2">ICS Record</h1>
          <p class="text-sm text-gray-500 mt-1">Manage and track Inventory Custody Slips (ICS)</p>
        </div>

        <div class="flex items-center gap-3 w-full sm:w-auto justify-end">
          <SearchInput v-model="searchQuery" placeholder="Search" class="w-full sm:w-64" />
          <AddButton label="Add New" />
        </div>
      </div>

      <!-- BaseTable -->
      <BaseTable
        :items="paginatedUsers"
        :columns="columns"
        striped
        class="mt-2"
        @rowClick="(row) => console.log('Clicked:', row)"
        @sort="handleSort"
      >
        <!-- Footer -->
        <template #footer>
          <div class="relative p-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
            <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700 text-sm md:text-base">
              Showing <strong>{{ paginatedUsers.length }}</strong> of <strong>{{ total }}</strong>
            </div>

            <div class="flex justify-center">
              <Pagination
                :total="total"
                v-model:perPage="perPage"
                v-model:currentPage="currentPage"
                :perPageOptions="[10, 20, 50, 100]"
                class="text-sm md:text-base"
              />
            </div>
          </div>
        </template>
      </BaseTable>
    </div>
  </AppLayout>
</template>
