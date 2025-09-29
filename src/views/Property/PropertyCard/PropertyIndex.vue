<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AppLayout from '@/components/layouts/AppLayout.vue'
import { type BreadcrumbItem } from '@/types/api'
import { useRouter } from 'vue-router'
import axios from 'axios'
import Loading from '@/components/loading/Loading.vue'
import Pagination from '@/components/ui/pagination/Pagination.vue'
import AddButton from '@/components/ui/button/AddButton.vue'
import BaseTable from '@/components/ui/table/BaseTable.vue'
import EditButton from '@/components/ui/button/EditButton.vue'
import DeleteButton from '@/components/ui/button/DeleteButton.vue'
import CardButton from '@/components/ui/button/CardButton.vue'
import SearchInput from '@/components/ui/search/SearchInput.vue'

// Router
const router = useRouter()

// Breadcrumbs
const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Property Management', href: '#' },
  { title: 'Property Card', href: '/property-card' },
]

// State
const propertyCards = ref<any[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const searchQuery = ref('')

// Pagination
const currentPage = ref(1)
const perPage = ref(10)

// Columns
const columns: { key: string; label: string; align?: 'left' | 'center' | 'right' }[] = [
  { key: 'actions', label: 'Actions', align: 'center' },
  { key: 'supply_id', label: 'Supplies ID', align: 'left' },
  { key: 'stock_no', label: 'Stock Number', align: 'left' },
  { key: 'category', label: 'Category', align: 'left' },
  { key: 'description', label: 'Description', align: 'left' },
  { key: 'unit', label: 'Unit', align: 'center' },
  { key: 'unit_value', label: 'Unit Value', align: 'right' },
  { key: 'balance', label: 'Stockpile Qty', align: 'center' },
  { key: 'non_stockpile', label: 'Non-Stockpile Qty', align: 'center' },
  { key: 'reorder_point', label: 'Re-Order Point', align: 'center' },
]

// Computed search filter
const filteredCards = computed(() => {
  if (!searchQuery.value) return propertyCards.value
  const query = searchQuery.value.toLowerCase()
  return propertyCards.value.filter((card) => {
    const values = [
      card.supply_id,
      card.stock_no,
      card.category,
      card.description,
      card.unit,
      card.unit_value,
      card.balance,
      card.non_stockpile,
      card.reorder_point,
    ]
    return values.some((val) => val && String(val).toLowerCase().includes(query))
  })
})

// Paginated
const paginatedCards = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  const end = start + perPage.value
  return filteredCards.value.slice(start, end)
})

// Helpers for footer
const total = computed(() => filteredCards.value.length)
const startItem = computed(() => (total.value === 0 ? 0 : (currentPage.value - 1) * perPage.value + 1))
const endItem = computed(() => Math.min(currentPage.value * perPage.value, total.value))

// Fetch API
async function fetchPropertyCards() {
  try {
    const res = await axios.get('http://127.0.0.1:8000/api/property-cards')
    propertyCards.value = res.data.data.map((card: any) => ({
      ...card,
      stock_no: card.supply?.StockNo ?? '-',
      category: card.supply?.category?.category_desc ?? '-',
      description: card.supply?.Supplies_Desc ?? '-',
      unit: card.supply?.unit?.Unit_Type ?? '-',
      unit_value: card.supply?.UnitValue ?? '-',
      balance: card.balance ?? 0,
      non_stockpile: card.supply?.supplies_nonstock_qty ?? 0,
      reorder_point: card.supply?.Supplies_ReOrder_PT ?? '-',
    }))
  } catch (err) {
    console.error(err)
    error.value = 'Failed to load property cards'
  } finally {
    loading.value = false
  }
}
onMounted(fetchPropertyCards)

// Handlers
function addPropertyCard() {
  router.push('/property-card/add')
}
function handleEdit(id: number) {
  router.push(`/property-card/edit/${id}`)
}
function handleDelete(id: number) {
  console.log('Delete property card:', id)
}
</script>

<template>
  <AppLayout :breadcrumbs="breadcrumbs">
    <div class="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div class="text-center sm:text-left">
          <h1 class="text-xl font-bold text-gray-800">Property Card</h1>
          <p class="text-sm text-gray-500 mt-1">Manage property items - track allocation, status, and details.</p>
        </div>
        <div class="flex items-center gap-3 w-full sm:w-auto justify-end">
          <SearchInput v-model="searchQuery" placeholder="Search" class="w-full sm:w-64" />
          <AddButton label="+ Add Property Card" @click="addPropertyCard" />
        </div>
      </div>

      <!-- Loading / Error -->
      <div v-if="loading" class="flex flex-col items-center justify-center h-64">
        <Loading :loading="loading" color="#0ea5e9" size="18px" margin="3px" />
        <span class="mt-4 text-gray-500 font-medium text-lg">Loading...</span>
      </div>
      <div v-else-if="error" class="text-center text-red-500 py-6">{{ error }}</div>

      <!-- Table -->
      <div v-else class="overflow-x-auto rounded-lg shadow border border-gray-200">
        <BaseTable :columns="columns" :items="paginatedCards" striped>
          <!-- Actions -->
          <template #actions="{ row }">
            <div class="flex justify-center gap-2">
              <EditButton @click="handleEdit(row.property_card_id)" size="sm" tooltip="Edit" />
              <DeleteButton @delete="handleDelete(row.property_card_id)" size="sm" tooltip="Delete" />
              <CardButton @click="router.push(`/property-card/${row.supply_id}`)" size="sm" tooltip="View Card" />
            </div>
          </template>

          <!-- Footer -->
          <template #footer>
            <div class="relative bg-gray-50 border-t border-gray-200 rounded-b-lg">
              <div class="absolute left-4 mt-3 -translate-y-1/2 text-gray-700 text-sm">
                Showing <strong>{{ startItem }}</strong> to <strong>{{ endItem }}</strong> of
                <strong>{{ total }}</strong> entries
              </div>
              <div class="flex justify-center">
                <Pagination
                  :total="total"
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
