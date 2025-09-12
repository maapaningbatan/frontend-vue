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
  { title: 'Semi-Expandable', href: '/semi-expandable' },
]

// Table state
const semiExpandables = ref<any[]>([])
const totalRecords = ref(0)
const loading = ref(true)
const currentPage = ref(1)
const rowsPerPage = ref(10)
const searchQuery = ref('')
const activeFilter = ref<'active' | 'inactive' | 'all'>('active')

// Fetch semi-expandable cards from API
async function fetchSemiExpandables(page = 1, rows = 10) {
  loading.value = true
  try {
    const url = new URL('http://127.0.0.1:8000/api/semi-expandable-cards')
    url.searchParams.set('page', page.toString())
    url.searchParams.set('per_page', rows.toString())
    if (searchQuery.value) url.searchParams.set('search', searchQuery.value)
    if (activeFilter.value !== 'all') url.searchParams.set('status', activeFilter.value)

    const res = await fetch(url.toString())
    if (!res.ok) throw new Error('Failed to fetch data')
    const data = await res.json()

    // Reduce to unique supply_id and get latest balance
    const latestMap = new Map<number, any>()
    data.data.forEach((card: any) => {
      const existing = latestMap.get(card.supply_id)
      if (!existing || new Date(card.created_at) > new Date(existing.created_at)) {
        latestMap.set(card.supply_id, {
          ...card,
          latest_balance: card.balance,
        })
      }
    })

    semiExpandables.value = Array.from(latestMap.values())
    totalRecords.value = semiExpandables.value.length
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

// Watchers for search or filter changes
watch([searchQuery, activeFilter], () => {
  fetchSemiExpandables(1, rowsPerPage.value)
})

// Pagination handler
function onPageChange(event: { page: number; rows: number }) {
  currentPage.value = event.page + 1
  rowsPerPage.value = event.rows
  fetchSemiExpandables(currentPage.value, rowsPerPage.value)
}

// Toggle Active/Inactive filter
function setFilter(filter: 'active' | 'inactive' | 'all') {
  activeFilter.value = filter
}

// Edit / Delete handlers
function handleEdit(supplyId: number) {
  router.push(`/semi-expandable/edit/${supplyId}`)
}

function handleDelete(supplyId: number) {
  console.log('Delete supply:', supplyId)
  // Add delete logic here
}

// Initial load
onMounted(() => {
  fetchSemiExpandables(currentPage.value, rowsPerPage.value)
})
</script>

<template>
<AppLayout :breadcrumbs="breadcrumbs">
  <div class="flex flex-col gap-6 p-6">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-800 text-center sm:text-left">
        List of Semi-Expandable
      </h1>
    </div>

    <!-- Filters + Add -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
      <div class="flex flex-col sm:flex-row sm:items-center gap-4">
        <!-- Search -->
        <div class="relative w-full sm:w-64">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            v-model="searchQuery"
            type="text"
            placeholder="Search by Stock Number or Description..."
            class="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <!-- Active/Inactive -->
        <div class="relative inline-flex bg-gray-200 rounded-full p-1 w-max">
          <label
            @click="setFilter('active')"
            class="relative z-10 cursor-pointer px-5 py-2 rounded-full text-sm font-medium transition-colors duration-300 flex items-center justify-center"
            :class="activeFilter==='active' ? 'text-white' : 'text-gray-700'"
          >
            Active Only
          </label>

          <label
            @click="setFilter('inactive')"
            class="relative z-10 cursor-pointer px-5 py-2 rounded-full text-sm font-medium transition-colors duration-300 flex items-center justify-center"
            :class="activeFilter==='inactive' ? 'text-white' : 'text-gray-700'"
          >
            Inactive Only
          </label>

          <!-- Sliding background -->
          <span
            class="absolute top-1 left-1 bg-blue-600 rounded-full w-1/2 h-full transition-transform duration-300"
            :style="{ transform: activeFilter==='active' ? 'translateX(0%)' : 'translateX(100%)' }"
          ></span>
        </div>
      </div>

      <!-- Add button -->
      <div>
        <button
          class="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 hover:shadow-lg transition duration-300"
        >
          + Add Semi-Expandable
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
          <tr v-for="card in semiExpandables" :key="card.supply_id" class="hover:bg-blue-50 transition duration-200">
            <!-- Actions -->
            <td class="px-4 py-3 flex gap-2">
              <ActionButtons
                @edit="handleEdit(card.supply_id)"
                @delete="handleDelete(card.supply_id)"
              />
              <button
                @click="router.push(`/semi-expandable/${card.supply_id}`)"
                class="w-8 h-8 flex items-center justify-center rounded-full border border-blue-500 text-blue-500 hover:bg-blue-100 transition duration-200"
                title="View Semi-Expandable Card"
              >
                <WalletCards class="w-4 h-4" />
              </button>
            </td>

            <!-- Supplies Info -->
            <td class="px-4 py-3 text-sm text-gray-700 font-medium">{{ card.supply_id }}</td>
            <td class="px-4 py-3 text-sm text-gray-800">{{ card.supply?.StockNo }}</td>
            <td class="px-4 py-3 text-sm text-gray-500">{{ card.supply?.category?.category_desc }}</td>
            <td class="px-4 py-3 text-sm text-gray-500">{{ card.supply?.Supplies_Desc }}</td>
            <td class="px-4 py-3 text-sm text-gray-500">{{ card.supply?.UnitID }}</td>
            <td class="px-4 py-3 text-sm text-gray-500">{{ card.supply?.UnitValue }}</td>
            <td class="px-4 py-3 text-sm text-gray-500">{{ card.latest_balance ?? 0 }}</td>
            <td class="px-4 py-3 text-sm text-gray-500 text-center">{{ card.supply?.Non_Stockpile_Qty ?? 0 }}</td>
            <td class="px-4 py-3 text-sm text-gray-500 text-center">{{ card.supply?.Supplies_ReOrder_PT ?? '-' }}</td>
          </tr>

          <tr v-if="!loading && semiExpandables.length === 0">
            <td colspan="10" class="p-6 text-center text-gray-400 italic">
              No supplies found.
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Footer: showing items -->
      <div class="bg-gray-50 px-4 py-2 text-gray-700 text-sm rounded-b-lg border-t border-gray-200 flex justify-between items-center">
        <span>
          Showing items <strong>{{ (currentPage-1)*rowsPerPage + 1 }}</strong> to
          <strong>{{ Math.min(currentPage*rowsPerPage, totalRecords) }}</strong> of
          <strong>{{ totalRecords }}</strong> entries
        </span>
      </div>

      <!-- Pagination -->
      <div class="mt-4 flex justify-center">
        <Paginator
          :totalRecords="totalRecords"
          :rows="rowsPerPage"
          :rowsPerPageOptions="[10, 20, 30, 40, 50]"
          @page="onPageChange"
          class="shadow rounded-lg"
        />
      </div>
    </div>
  </div>
</AppLayout>
</template>
