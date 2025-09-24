<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import AppLayout from '@/components/layouts/AppLayout.vue'
import { type BreadcrumbItem } from '@/types/api'
import { useRouter } from 'vue-router'
import axios from 'axios'
import ActionButtons from '@/components/ui/button/ActionButtons.vue'
import { WalletCards, Search } from 'lucide-vue-next'
import Input from '@/components/ui/Input.vue'
import Paginator from 'primevue/paginator'
import Loading from '@/components/loading/Loading.vue'

// Router instance
const router = useRouter()

// Breadcrumbs
const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Supplies List', href: '/supplies' },
]

// State
const supplies = ref<any[]>([])
const loading = ref(false)
const errorMsg = ref<string | null>(null)

// Pagination
const first = ref(0)
const rows = ref(10)

// Search
const searchTerm = ref('')

// Active/Inactive filter
const filterStatus = ref<number>(0) // 0 = Active, 1 = Inactive

// Computed: filtered supplies
const filteredSupplies = computed(() => {
  return supplies.value
    .filter((s) => (filterStatus.value === 0 ? s.isActive : !s.isActive))
    .filter((s) => {
      if (!searchTerm.value.trim()) return true
      const term = searchTerm.value.toLowerCase()

      const stockNo = (s.StockNo || "").toLowerCase()
      const desc = (s.Supplies_Desc || "").toLowerCase()

      return stockNo.includes(term) || desc.includes(term)
    })
})


// Computed for "Showing items X to Y of Z entries"
const totalRecords = computed(() => filteredSupplies.value.length)
const startItem = computed(() => (totalRecords.value === 0 ? 0 : first.value + 1))
const endItem = computed(() => {
  const end = first.value + rows.value
  return end > totalRecords.value ? totalRecords.value : end
})

// Fetch supplies
const fetchSupplies = async () => {
  loading.value = true
  errorMsg.value = null
  try {
    const res = await axios.get('http://127.0.0.1:8000/api/supplies') // must include category/unit relations
    supplies.value = res.data
  } catch (err: any) {
    console.error(err)
    errorMsg.value = 'Failed to load supplies'
  } finally {
    loading.value = false
  }
}

onMounted(fetchSupplies)

// Navigate to Add/Edit
function goToAddSupply() {
  router.push('/stock/add')
}
function handleEdit(id: number) {
  router.push(`/stock/edit/${id}`)
}
</script>

<template>
  <AppLayout :breadcrumbs="breadcrumbs">
    <div class="flex flex-col gap-6 p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-800 text-center sm:text-left">List of Supplies</h1>
      </div>

      <!-- Filters + Add -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div class="flex flex-col sm:flex-row sm:items-center gap-4">
          <!-- Search -->
          <div class="relative w-full sm:w-64">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input v-model="searchTerm" type="text" placeholder="Search by Stock Number or Description..."
              class="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>

          <!-- Active/Inactive -->
          <div class="relative inline-flex bg-gray-200 rounded-full p-1 w-max">
            <!-- Active Only -->
            <label
              class="relative z-10 cursor-pointer px-5 py-2 rounded-full text-sm font-medium transition-colors duration-300 flex items-center justify-center"
              :class="filterStatus === 0 ? 'text-white' : 'text-gray-700'" @click="filterStatus = 0">
              Active Only
            </label>

            <!-- Inactive Only -->
            <label
              class="relative z-10 cursor-pointer px-5 py-2 rounded-full text-sm font-medium transition-colors duration-300 flex items-center justify-center"
              :class="filterStatus === 1 ? 'text-white' : 'text-gray-700'" @click="filterStatus = 1">
              Inactive Only
            </label>

            <!-- Sliding background -->
            <span class="absolute top-1 left-1 bg-blue-600 rounded-full w-1/2 h-full transition-transform duration-300"
              :class="filterStatus === 0 ? 'translate-x-0 bg-blue-600' : 'translate-x-full bg-red-600'"></span>
          </div>

        </div>

        <!-- Add button -->
        <div>
          <button
            class="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 hover:shadow-lg transition duration-300"
            @click="goToAddSupply">
            + Add Supply
          </button>
        </div>
      </div>

      <!-- Loading / Error -->
  <div v-if="loading" class="flex flex-col items-center justify-center h-64">
    <Loading :loading="loading" color="#0ea5e9" size="18px" margin="3px" />
    <span class="mt-4 text-gray-500 font-medium text-lg">Loading...</span>
  </div>

  <div v-else-if="errorMsg" class="text-center text-red-500 py-6">
    {{ errorMsg }}
  </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto rounded-lg shadow border border-gray-200">
        <table class="min-w-full divide-y divide-gray-200">
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
              <th class="px-4 py-3 text-center text-sm font-semibold text-gray-600">
                Non-Stockpile Qty
              </th>
              <th class="px-4 py-3 text-center text-sm font-semibold text-gray-600">
                Re-Order Point
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="supply in filteredSupplies.slice(first, first + rows)" :key="supply.SuppliesID"
              class="hover:bg-blue-50 transition duration-200">
              <td class="px-4 py-3 flex gap-2">
                <ActionButtons @edit="handleEdit(supply.SuppliesID)"
                  @delete="console.log('delete', supply.SuppliesID)" />
                <button @click="router.push(`/stock/card/${supply.SuppliesID}`)"
                  class="w-8 h-8 flex items-center justify-center rounded-full border border-blue-500 text-blue-500 hover:bg-blue-100 transition duration-200"
                  title="View Stock Card">
                  <WalletCards class="w-4 h-4" />
                </button>
              </td>
              <td class="px-4 py-3 text-sm text-gray-700 font-medium">{{ supply.SuppliesID }}</td>
              <td class="px-4 py-3 text-sm text-gray-800">{{ supply.StockNo }}</td>
              <td class="px-4 py-3 text-sm text-gray-500">
                {{ supply.category?.category_desc ?? '-' }}
              </td>
              <td class="px-4 py-3 text-sm text-gray-500">{{ supply.Supplies_Desc }}</td>
              <td class="px-4 py-3 text-sm text-gray-500">{{ supply.unit?.Unit_Type ?? '-' }}</td>
              <td class="px-4 py-3 text-sm text-gray-500">{{ supply.UnitValue }}</td>
              <td class="px-4 py-3 text-sm text-gray-500">{{ supply.Supplies_Qty }}</td>
              <td class="px-4 py-3 text-sm text-gray-500 text-center">
                {{ supply.supplies_nonstock_qty }}
              </td>
              <td class="px-4 py-3 text-sm text-gray-500 text-center">
                {{ supply.Supplies_ReOrder_PT }}
              </td>
            </tr>
            <tr v-if="!filteredSupplies.length">
              <td colspan="10" class="p-6 text-center text-gray-400 italic">No supplies found.</td>
            </tr>
          </tbody>
        </table>

        <!-- Footer: showing items -->
        <div
          class="bg-gray-50 px-4 py-2 text-gray-700 text-sm rounded-b-lg border-t border-gray-200 flex justify-between items-center">
          <span>Showing items <strong>{{ startItem }}</strong> to <strong>{{ endItem }}</strong> of
            <strong>{{ totalRecords }}</strong> entries</span>
        </div>

        <!-- Pagination -->
        <div class="mt-4 flex justify-center">
          <Paginator v-model:first="first" v-model:rows="rows" :totalRecords="totalRecords"
            :rowsPerPageOptions="[10, 20, 30, 40, 50]" class="shadow rounded-lg" />
        </div>
      </div>
    </div>
  </AppLayout>
</template>
