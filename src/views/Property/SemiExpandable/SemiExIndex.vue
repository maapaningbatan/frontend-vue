<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/layouts/AppLayout.vue'
import { type BreadcrumbItem } from '@/types/api'
import EditButton from '@/components/ui/button/EditButton.vue'
import DeleteButton from '@/components/ui/button/DeleteButton.vue'
import AddButton from '@/components/ui/button/AddButton.vue'
import SearchInput from '@/components/ui/search/SearchInput.vue'
import CardButton from '@/components/ui/button/CardButton.vue'
import BaseTable from '@/components/ui/table/BaseTable.vue'
import Pagination from '@/components/ui/pagination/Pagination.vue'

const router = useRouter()

// Breadcrumbs
const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Property Management', href: '#' },
  { title: 'Semi-Expandable Card', href: '/semi-expandable' },
]

// Columns for BaseTable
const columns: { key: string; label: string; align?: 'left' | 'center' | 'right' }[] = [
  { key: 'actions', label: 'Actions', align: 'left' },
  { key: 'supply_id', label: 'Supplies ID', align: 'left' },
  { key: 'StockNo', label: 'Stock Number', align: 'left' },
  { key: 'category', label: 'Category', align: 'left' },
  { key: 'Supplies_Desc', label: 'Description', align: 'left' },
  { key: 'unit', label: 'Unit', align: 'left' },
  { key: 'UnitValue', label: 'Unit Value', align: 'left' },
  { key: 'latest_balance', label: 'Stockpile Qty', align: 'left' },
  { key: 'Non_Stockpile_Qty', label: 'Non-Stockpile Qty', align: 'center' },
  { key: 'Supplies_ReOrder_PT', label: 'Re-Order Point', align: 'center' },
]

// Table state
const semiExpandables = ref<any[]>([])
const totalSemi = ref(0)
const loading = ref(true)
const currentPage = ref(1)
const rowsPerPage = ref(10)
const searchQuery = ref('')
const activeFilter = ref<'active' | 'inactive' | 'all'>('active')

// Computed formatted array for nested fields
const formattedSemiExpandables = computed(() =>
  semiExpandables.value.map((card) => ({
    ...card,
    supply_id: card.supply_id ?? card.supply?.supply_id ?? '-',
    StockNo: card.supply?.StockNo ?? '-',
    category: card.supply?.category?.category_desc ?? '-',
    Supplies_Desc: card.supply?.Supplies_Desc ?? '-',
    unit: card.supply?.unit?.Unit_Type ?? '-',
    UnitValue: card.supply?.UnitValue ?? '-',
    Non_Stockpile_Qty: card.supply?.Non_Stockpile_Qty ?? 0,
    Supplies_ReOrder_PT: card.supply?.Supplies_ReOrder_PT ?? '-',
  }))
)


const startItem = computed(() =>
  totalSemi.value === 0 ? 0 : (currentPage.value - 1) * rowsPerPage.value + 1,
)

const endItem = computed(() => {
  const end = currentPage.value * rowsPerPage.value
  return end > totalSemi.value ? totalSemi.value : end
})

// Fetch API
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
    totalSemi.value = semiExpandables.value.length
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

// Watchers
watch([searchQuery, activeFilter], () => {
  fetchSemiExpandables(1, rowsPerPage.value)
})

// Pagination handler
function onPageChange(event: { page: number; rows: number }) {
  currentPage.value = event.page + 1
  rowsPerPage.value = event.rows
  fetchSemiExpandables(currentPage.value, rowsPerPage.value)
}

// Filter toggle
function setFilter(filter: 'active' | 'inactive' | 'all') {
  activeFilter.value = filter
}

// Edit / Delete
function handleEdit(supplyId: number) {
  router.push(`/semi-expandable/edit/${supplyId}`)
}
function handleDelete(supplyId: number) {
  console.log('Delete supply:', supplyId)
}

// Initial load
onMounted(() => {
  fetchSemiExpandables(currentPage.value, rowsPerPage.value)
})
</script>

<template>
  <AppLayout :breadcrumbs="breadcrumbs">
    <div class="flex flex-col gap-4 rounded-xl p-4 overflow-x-auto">
      <!-- Header + Filter + Add -->
      <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div class="flex flex-col sm:flex-row sm:items-center gap-4">
          <!-- Header -->
          <div class="text-center sm:text-left">
            <h1 class="text-xl font-bold text-gray-800">Semi-Expandable Cards</h1>
            <p class="text-sm text-gray-500 mt-1">
              Manage semi-expandable items - track allocation, status, and related details.
            </p>
          </div>

          <!-- Active/Inactive Toggle -->
          <div class="relative inline-flex bg-gray-200 rounded-full p-1 w-max">
            <label @click="setFilter('active')"
              class="relative z-10 cursor-pointer px-5 py-2 rounded-full text-sm font-medium transition-colors duration-300 flex items-center justify-center"
              :class="activeFilter === 'active' ? 'text-white' : 'text-gray-700'">
              Active
            </label>
            <label @click="setFilter('inactive')"
              class="relative z-10 cursor-pointer px-5 py-2 rounded-full text-sm font-medium transition-colors duration-300 flex items-center justify-center"
              :class="activeFilter === 'inactive' ? 'text-white' : 'text-gray-700'">
              Inactive
            </label>
            <span class="absolute top-1 left-1 rounded-full w-1/2 h-full transition duration-300" :style="{
              transform: activeFilter === 'active' ? 'translateX(0%)' : 'translateX(100%)',
              backgroundColor: activeFilter === 'active' ? '#2563EB' : '#DC2626',
            }"></span>
          </div>
        </div>

        <!-- Search + Add -->
        <div class="flex items-center gap-3 w-full sm:w-auto justify-end">
          <SearchInput v-model="searchQuery" placeholder="Search" class="w-full sm:w-64" />
          <AddButton label="New" @click="" />
        </div>
      </div>

      <!-- BaseTable -->
      <BaseTable :columns="columns" :items="formattedSemiExpandables" :loading="loading" :actions-slot="true">
        <template #actions="{ row }">
          <div class="flex gap-2">
            <EditButton @click="handleEdit(row.supply_id)" size="sm" tooltip="Edit" />
            <DeleteButton @delete="handleDelete(row.supply_id)" size="sm" tooltip="Delete" />
            <CardButton @click="router.push(`semi-expandable/${row.supply_id}`)" size="sm" tooltip="Semi-Card" />
          </div>
        </template>

        <template #footer>
          <div class="relative bg-gray-50 border-t border-gray-200 rounded-b-lg py-3">
            <div class="absolute left-4 mt-3 -translate-y-1/2 text-gray-700 text-sm md:text-small">
              Showing items <strong>{{ startItem }}</strong> to <strong>{{ endItem }}</strong> of
              <strong>{{ totalSemi }}</strong> entries
            </div>
            <div class="flex justify-center">
              <Pagination :total="totalSemi" v-model:perPage="rowsPerPage" v-model:currentPage="currentPage"
                :perPageOptions="[10, 20, 30, 50, 100]" />
            </div>
          </div>
        </template>
      </BaseTable>
    </div>
  </AppLayout>
</template>
