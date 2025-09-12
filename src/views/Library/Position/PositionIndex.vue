<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import AppLayout from '@/components/layouts/AppLayout.vue'
import { type BreadcrumbItem } from '@/types/api'
import { getPositions, type Position } from '@/services/positionService'
import PositionCreate from './PositionCreate.vue'
import PositionEdit from './PositionEdit.vue'
import ConfirmDelete from './ConfirmDelete.vue'
import Paginator from 'primevue/paginator'
import { Search } from 'lucide-vue-next';
import Input from '@/components/ui/Input.vue';
// Breadcrumbs
const breadcrumbs: BreadcrumbItem[] = [{ title: 'Positions', href: '/positions' }]

// State
const loading = ref(false)
const errorMsg = ref<string | null>(null)
const positions = ref<Position[]>([])

// Pagination
const first = ref(0)
const rows = ref(10)

// Search
const searchTerm = ref('')
const filteredPositions = computed(() => {
  if (!searchTerm.value.trim()) return positions.value
  const term = searchTerm.value.toLowerCase()
  return positions.value.filter(
    pos =>
      pos.Position.toLowerCase().includes(term) ||
      (pos.Position_Desc?.toLowerCase().includes(term) ?? false)
  )
})

// Computed for "Showing items X to Y of Z entries"
const totalRecords = computed(() => filteredPositions.value.length)
const startItem = computed(() => (totalRecords.value === 0 ? 0 : first.value + 1))
const endItem = computed(() => {
  const end = first.value + rows.value
  return end > totalRecords.value ? totalRecords.value : end
})

// Fetch positions
const fetchPositions = async () => {
  loading.value = true
  errorMsg.value = null
  try {
    positions.value = await getPositions()
  } catch (e: any) {
    errorMsg.value = e?.response?.data?.message || 'Failed to load positions.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchPositions)

// Modals
const isCreateModalOpen = ref(false)
const isEditModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const selectedPosition = ref<Position | null>(null)

const openCreateModal = () => (isCreateModalOpen.value = true)
const closeCreateModal = () => (isCreateModalOpen.value = false)

const openEditModal = (pos: Position) => {
  selectedPosition.value = pos
  isEditModalOpen.value = true
}
const closeEditModal = () => (isEditModalOpen.value = false)

const openDeleteModal = (pos: Position) => {
  selectedPosition.value = pos
  isDeleteModalOpen.value = true
}
const closeDeleteModal = () => isDeleteModalOpen.value = false
</script>

<template>
  <AppLayout :breadcrumbs="breadcrumbs">
    <div class="flex flex-col gap-6 p-6">

      <!-- Header created by boggz -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-800 text-center sm:text-left">
          List of Positions
        </h1>
      </div>

      <!-- Bottom actions (t) -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

        <!-- Left: Search + Dropdown -->
        <div class="flex items-center gap-3">
          <div class="relative w-full sm:w-64">
            <!-- Icon -->
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

            <!-- Input -->
            <Input type="text" v-model="searchTerm" placeholder="Search positions..."
              class="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <!-- Rows per page dropdown -->
          <Paginator v-model:first="first" v-model:rows="rows" :totalRecords="totalRecords"
            :rowsPerPageOptions="[10, 20, 30, 40, 50]" template="RowsPerPageDropdown" />
        </div>

        <!-- Bottom right Create button -->
        <div>
          <button
            class="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition duration-200"
            @click="openCreateModal">
            + Create Position
          </button>
        </div>

      </div>
      <!-- End of created by boggz -->

      <!-- Loading / Error -->
      <div v-if="loading" class="text-gray-500 text-center py-12">Loading positions...</div>
      <div v-else-if="errorMsg" class="text-red-600 text-center py-12">{{ errorMsg }}</div>

      <!-- Table -->
      <div v-else class="overflow-x-auto rounded-lg shadow border border-gray-200">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="pl-20 px-4 py-3 text-left text-sm font-semibold text-gray-600">ID</th>
              <th class="pl-30 pr-10 text-left text-sm font-semibold text-gray-600">Position</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Description</th>
              <th class="px-4 py-3 text-center text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="pos in filteredPositions.slice(first, first + rows)" :key="pos.Position_Id"
              class="hover:bg-blue-50 transition">
              <td class="pl-20 pr-5 text-sm text-gray-700 border-r border-gray-200">{{ pos.Position_Id }}</td>
              <td class="pl-30 pr-10 itemtext-sm text-gray-800 font-medium border-r border-gray-200">{{ pos.Position }}
              </td>
              <td class="px-4 py-3 text-sm text-gray-500 border-r border-gray-200">{{ pos.Position_Desc || '—' }}</td>
              <td class="px-4 py-3 text-center flex justify-center gap-2">
                <button class="px-3 py-1 bg-green-400 text-white rounded hover:bg-green-600 transition duration-200"
                  @click="openEditModal(pos)">
                  Edit
                </button>
                <button class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition duration-200"
                  @click="openDeleteModal(pos)">
                  Delete
                </button>
              </td>
            </tr>
            <tr v-if="!filteredPositions.length">
              <td colspan="4" class="p-6 text-center text-gray-400 italic">
                No positions found.
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Showing items info -->
        <div
          class="bg-gray-50 px-4 py-2 text-gray-700 text-sm rounded-b-lg border-t border-gray-200 flex justify-between items-center">
          <span>
            Showing items <strong>{{ startItem }}</strong> to <strong>{{ endItem }}</strong> of
            <strong>{{ totalRecords }}</strong> entries
          </span>
        </div>
      </div>

      <!-- Paginator -->
      <div class="mt-4 flex justify-center">
        <Paginator v-model:first="first" v-model:rows="rows" :totalRecords="totalRecords"
          :rowsPerPageOptions="[10, 20, 30]" class="shadow rounded-lg" />
      </div>

      <!-- Modals -->
      <PositionCreate v-if="isCreateModalOpen" @close="closeCreateModal" @created="fetchPositions" />
      <PositionEdit v-if="isEditModalOpen && selectedPosition" :position="selectedPosition" @close="closeEditModal"
        @updated="fetchPositions" />
      <ConfirmDelete v-if="isDeleteModalOpen && selectedPosition" :itemName="selectedPosition.Position"
        :itemId="selectedPosition.Position_Id" deleteApiEndpoint="/api/positions" @close="closeDeleteModal"
        @deleted="fetchPositions" />
    </div>
  </AppLayout>
</template>
