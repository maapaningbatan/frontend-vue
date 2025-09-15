<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/layouts/AppLayout.vue'
import { type BreadcrumbItem } from '@/types/api'
import { WalletCards, Search } from 'lucide-vue-next'
import Input from '@/components/ui/Input.vue'
import Paginator from 'primevue/paginator'
import ActionButtons from '@/components/ui/button/ActionButtons.vue'

const router = useRouter()

// Breadcrumbs
const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Property Card', href: '/property-card' },
]

// Table state
const propertyCards = ref<any[]>([])
const totalRecords = ref(0)
const loading = ref(true)
const currentPage = ref(1)
const rowsPerPage = ref(10)
const searchQuery = ref('')
const activeFilter = ref<'active' | 'inactive' | 'all'>('all')

// Fetch property cards from API
async function fetchPropertyCards(page = 1, rows = 10) {
  loading.value = true
  try {
    const url = new URL('http://127.0.0.1:8000/api/property-cards')
    url.searchParams.set('page', page.toString())
    url.searchParams.set('per_page', rows.toString())
    if (searchQuery.value) url.searchParams.set('search', searchQuery.value)
    if (activeFilter.value !== 'all') url.searchParams.set('status', activeFilter.value)

    const res = await fetch(url.toString())
    if (!res.ok) throw new Error('Failed to fetch data')
    const data = await res.json()

    propertyCards.value = data.data
    totalRecords.value = data.total
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

// Watchers for search or filter changes
watch([searchQuery, activeFilter], () => {
  fetchPropertyCards(1, rowsPerPage.value)
})

// Pagination handler
function onPageChange(event: { page: number; rows: number }) {
  currentPage.value = event.page + 1
  rowsPerPage.value = event.rows
  fetchPropertyCards(currentPage.value, rowsPerPage.value)
}

// Toggle Active/Inactive filter
function setFilter(filter: 'active' | 'inactive' | 'all') {
  activeFilter.value = filter
}

// Edit / Delete handlers
function handleEdit(cardId: number) {
  router.push(`/property-card/edit/${cardId}`)
}

function handleDelete(cardId: number) {
  console.log('Delete property card:', cardId)
  // Add delete logic here
}

// Initial load
onMounted(() => {
  fetchPropertyCards(currentPage.value, rowsPerPage.value)
})
</script>

<template>
  <AppLayout :breadcrumbs="breadcrumbs">
    <div class="flex flex-col gap-6 p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-800 text-center sm:text-left">
          Property Card
        </h1>
      </div>

      <!-- Filters + Add -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div class="flex flex-col sm:flex-row sm:items-center gap-4">
          <!-- Search -->
          <div class="relative w-full sm:w-64">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input v-model="searchQuery" type="text" placeholder="Search by Stock Number or Description..."
              class="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>

          <!-- Active/Inactive -->
          <div class="relative inline-flex bg-gray-200 rounded-full p-1 w-max">
            <label @click="setFilter('active')"
              class="cursor-pointer px-5 py-2 rounded-full text-sm font-medium transition-colors duration-300 flex items-center justify-center"
              :class="activeFilter === 'active' ? 'text-white' : 'text-gray-700'">
              Active Only
            </label>
            <label @click="setFilter('inactive')"
              class="cursor-pointer px-5 py-2 rounded-full text-sm font-medium transition-colors duration-300 flex items-center justify-center"
              :class="activeFilter === 'inactive' ? 'text-white' : 'text-gray-700'">
              Inactive Only
            </label>
            <span class="absolute top-1 left-1 rounded-full w-1/2 h-full transition duration-300" :style="{
              transform: activeFilter === 'active' ? 'translateX(0%)' : 'translateX(100%)',
              backgroundColor: activeFilter === 'active' ? '#2563EB' : '#DC2626'
            }"></span>
          </div>
        </div>

        <!-- Add button -->
        <div>
          <button
            class="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 hover:shadow-lg transition duration-300">
            + Add Property Card
          </button>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto rounded-lg shadow border border-gray-200">
        <table class="min-w-full divide-y divide-gray-200" :class="{ 'opacity-50 pointer-events-none': loading }">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Supplies ID</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Stock Number</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Category</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Description</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Unit</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Unit Value</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Stockpile Qty</th>
              <th class="px-4 py-3 text-center text-sm font-semibold text-gray-600">Non-Stockpile Qty</th>
              <th class="px-4 py-3 text-center text-sm font-semibold text-gray-600">Re-Order Point</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="card in propertyCards" :key="card.property_card_id"
              class="hover:bg-blue-50 transition duration-200">
              <!-- Actions -->
              <td class="px-4 py-3 flex gap-2">
                <ActionButtons @edit="handleEdit(card.property_card_id)"
                  @delete="handleDelete(card.property_card_id)" />
                <button @click="router.push(`/property-card/${card.supply_id}`)"
                  class="w-8 h-8 flex items-center justify-center rounded-full border border-blue-500 text-blue-500 hover:bg-blue-100 transition duration-200"
                  title="View Property Card">
                  <WalletCards class="w-4 h-4" />
                </button>

              </td>

              <!-- Supply Info -->
              <td class="px-4 py-3 text-sm text-gray-700 font-medium">{{ card.supply_id }}</td>
              <td class="px-4 py-3 text-sm text-gray-800">{{ card.supply?.StockNo }}</td>
              <td class="px-4 py-3 text-sm text-gray-500">{{ card.supply?.category?.category_desc }}</td>
              <td class="px-4 py-3 text-sm text-gray-500">{{ card.supply?.Supplies_Desc }}</td>
              <td class="px-4 py-3 text-sm text-gray-500">{{ card.supply?.unit?.Unit_Type }}</td>
              <td class="px-4 py-3 text-sm text-gray-500">{{ card.supply?.UnitValue }}</td>
              <td class="px-4 py-3 text-sm text-gray-500">{{ card.balance }}</td>
              <td class="px-4 py-3 text-sm text-gray-500">{{ card.supply?.supplies_nonstock_qty }}</td>
              <td class="px-4 py-3 text-sm text-gray-500">{{ card.supply?.Supplies_ReOrder_PT }}</td>
            </tr>

            <tr v-if="!loading && propertyCards.length === 0">
              <td colspan="11" class="p-6 text-center text-gray-400 italic">
                No property cards found.
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Footer: showing items -->
        <div
          class="bg-gray-50 px-4 py-2 text-gray-700 text-sm rounded-b-lg border-t border-gray-200 flex justify-between items-center">
          <span>
            Showing items <strong>{{ (currentPage - 1) * rowsPerPage + 1 }}</strong> to
            <strong>{{ Math.min(currentPage * rowsPerPage, totalRecords) }}</strong> of
            <strong>{{ totalRecords }}</strong> entries
          </span>
        </div>

        <!-- Pagination -->
        <div class="mt-4 flex justify-center">
          <Paginator :totalRecords="totalRecords" :rows="rowsPerPage" :rowsPerPageOptions="[10, 20, 30, 40, 50]"
            @page="onPageChange" class="shadow rounded-lg" />
        </div>
      </div>
    </div>
  </AppLayout>
</template>
