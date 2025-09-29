<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import AppLayout from '@/components/layouts/AppLayout.vue'
import { type BreadcrumbItem } from '@/types/api'
import { useRouter } from 'vue-router'
import axios from 'axios'
import EditButton from '@/components/ui/button/EditButton.vue'
import DeleteButton from '@/components/ui/button/DeleteButton.vue'
import CardButton from '@/components/ui/button/CardButton.vue'
import Loading from '@/components/loading/Loading.vue'
import BaseTable from '@/components/ui/table/BaseTable.vue'
import AddButton from '@/components/ui/button/AddButton.vue'
import Pagination from '@/components/ui/pagination/Pagination.vue'
import SearchInput from '@/components/ui/search/SearchInput.vue'

// Router instance
const router = useRouter()

// Breadcrumbs
const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Supply Management', href: '#' },
  { title: 'Supplies List', href: '/supplies' },
]

// State
const supplies = ref<any[]>([])
const loading = ref(false)
const errorMsg = ref<string | null>(null)

// Pagination
const currentPage = ref(1)
const perPage = ref(10)

// Search
const searchSupply = ref('')

// Active/Inactive filter
const filterStatus = ref<number>(0) // 0 = Active, 1 = Inactive

// Computed: filtered supplies
const filteredSupplies = computed(() => {
  return supplies.value
    .filter((s) => (filterStatus.value === 0 ? s.isActive : !s.isActive))
    .filter((s) => {
      if (!searchSupply.value.trim()) return true
      const term = searchSupply.value.toLowerCase()

      const stockNo = (s.StockNo || '').toLowerCase()
      const desc = (s.Supplies_Desc || '').toLowerCase()

      return stockNo.includes(term) || desc.includes(term)
    })
})

const columns = [
  { key: 'actions', label: 'Actions', align: 'center' },
  { key: 'SuppliesID', label: 'Supplies ID' },
  { key: 'StockNo', label: 'Stock Number' },
  { key: 'category', label: 'Category' },
  { key: 'Supplies_Desc', label: 'Description' },
  { key: 'unit', label: 'Unit' },
  { key: 'UnitValue', label: 'Unit Value', align: 'right' },
  { key: 'Supplies_Qty', label: 'Stockpile Qty', align: 'right' },
  { key: 'supplies_nonstock_qty', label: 'Non-Stockpile Qty', align: 'right' },
  { key: 'Supplies_ReOrder_PT', label: 'Re-Order Point', align: 'right' },
] as const

// Pagination computed
const totalRecords = computed(() => filteredSupplies.value.length)
const first = computed(() => (currentPage.value - 1) * perPage.value)
const startItem = computed(() => (totalRecords.value === 0 ? 0 : first.value + 1))
const endItem = computed(() => {
  const end = first.value + perPage.value
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

// Navigate
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
      <!-- Title + Subtitle + Actions -->
      <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
        <!-- Left: Title + Subtitle + Filter -->
        <div class="flex flex-col sm:flex-row sm:items-center gap-4 w-full sm:w-auto">
          <div class="text-center sm:text-left">
            <h1 class="text-xl font-bold text-gray-800 flex items-center gap-2">Supplies List</h1>
            <p class="text-sm text-gray-500 mt-1">Manage and monitor all available supplies.</p>
          </div>

          <!-- Active/Inactive filter -->
          <div
            class="relative inline-flex bg-gray-200 rounded-full p-1 w-max self-center sm:self-auto"
          >
            <!-- Active Only -->
            <label
              class="relative z-10 cursor-pointer px-5 py-2 rounded-full text-sm font-medium transition-colors duration-300 flex items-center justify-center"
              :class="filterStatus === 0 ? 'text-white' : 'text-gray-700'"
              @click="filterStatus = 0"
            >
              Active
            </label>

            <!-- Inactive Only -->
            <label
              class="relative z-10 cursor-pointer px-5 py-2 rounded-full text-sm font-medium transition-colors duration-300 flex items-center justify-center"
              :class="filterStatus === 1 ? 'text-white' : 'text-gray-700'"
              @click="filterStatus = 1"
            >
              Inactive
            </label>

            <!-- Sliding background -->
            <span
              class="absolute top-1 left-1 rounded-full w-1/2 h-full transition-transform duration-300"
              :class="
                filterStatus === 0 ? 'translate-x-0 bg-blue-600' : 'translate-x-full bg-red-600'
              "
            ></span>
          </div>
        </div>

        <!-- Right: Search + Add -->
        <div class="flex items-center gap-3 w-full sm:w-auto justify-end">
          <SearchInput v-model="searchSupply" placeholder="Search" class="w-full sm:w-64" />
          <AddButton label="New Supplies" @click="goToAddSupply" />
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
        <BaseTable
          :items="filteredSupplies.slice(first, first + perPage)"
          :columns="columns"
          striped
        >
          <!-- Actions column -->
          <template #actions="{ row }">
            <div class="flex gap-2">
              <EditButton @click="handleEdit(row.SuppliesID)" size="sm" tooltip="Edit Supply" />
              <DeleteButton
                @delete="console.log('delete', row.SuppliesID)"
                size="sm"
                tooltip="Delete Supply"
              />
              <CardButton
                @click="router.push(`/stock/card/${row.SuppliesID}`)"
                size="sm"
                tooltip="View Stock Card"
              />
            </div>
          </template>

          <!-- Category column -->
          <template #category="{ row }">
            {{ row.category?.category_desc ?? '-' }}
          </template>

          <!-- Unit column -->
          <template #unit="{ row }">
            {{ row.unit?.Unit_Type ?? '-' }}
          </template>

          <!-- Footer -->
          <template #footer>
             <div class="relative bg-gray-50 border-t border-gray-200 rounded-b-lg">
              <div
                class="absolute left-4 mt-3 -translate-y-1/2 text-gray-700 text-sm md:text-small"
              >
                Showing items <strong>{{ startItem }}</strong> to <strong>{{ endItem }}</strong> of
                <strong>{{ totalRecords }}</strong> entries
              </div>

              <div class="flex justify-center">
                <Pagination
                  :total="totalRecords"
                  v-model:perPage="perPage"
                  v-model:currentPage="currentPage"
                  :perPageOptions="[10, 20, 30, 50, 100]"
                />
              </div>
            </div>
          </template>
        </BaseTable>
      </div>
    </div>
  </AppLayout>
</template>
