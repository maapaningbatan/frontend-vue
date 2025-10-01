<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AppLayout from '@/components/layouts/AppLayout.vue'
import { type BreadcrumbItem } from '@/types/api'
import { useRouter } from 'vue-router'
import axios from 'axios'
import Loading from '@/components/loading/Loading.vue'
import { useNotificationStore } from '@/stores/notification'
import { useConfirmDialog } from '@/composables/useConfirmDialog'
import Pagination from '@/components/ui/pagination/Pagination.vue'
import AddButton from '@/components/ui/button/AddButton.vue'
import BaseTable from '@/components/ui/table/BaseTable.vue'
import EditButton from '@/components/ui/button/EditButton.vue'
import DeleteButton from '@/components/ui/button/DeleteButton.vue'
import ApproveButton from '@/components/ui/button/ApproveButton.vue'
import SearchInput from '@/components/ui/search/SearchInput.vue'

// Router instance
const router = useRouter()

// Notification + confirm
const notificationStore = useNotificationStore()
const confirmDialog = useConfirmDialog()
const searchQuery = ref('')

// Breadcrumbs
const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Supply Management', href: '#' },
  { title: 'Delivery', href: '/delivery' },
]

// Data
const deliveries = ref<any[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

// Pagination state
const currentPage = ref(1)
const perPage = ref(10)

// Table columns
const columns: { key: string; label: string; align?: 'center' | 'left' | 'right' }[] = [
  { key: 'actions', label: 'Action', align: 'center' },
  { key: 'delivery_id', label: 'Delivery ID', align: 'left' },
  { key: 'purchase_order_number', label: 'Purchase Order', align: 'left' },
  { key: 'iar_number', label: 'IAR Number', align: 'left' },
  { key: 'purchase_date', label: 'Purchase Date', align: 'left' },
  { key: 'supplier', label: 'Supplier', align: 'left' },
  { key: 'po_amount', label: 'Amount', align: 'left' },
  { key: 'code_number', label: 'Code Number', align: 'left' },
  { key: 'created_at', label: 'Date Created', align: 'center' },
  { key: 'status', label: 'Status', align: 'center' },
]

// Filter deliveries with search (including nested fields)
const filteredDeliveries = computed(() => {
  if (!searchQuery.value) return deliveries.value
  const query = searchQuery.value.toLowerCase()
  return deliveries.value.filter((d) => {
    const values = [
      d.delivery_id,
      d.purchase_order_number,
      d.iar_number,
      d.purchase_date,
      d.po_amount,
      d.code_number,
      d.status,
      d.supplier_info?.Supplier_Name,
    ]
    return values.some((val) => val && String(val).toLowerCase().includes(query))
  })
})

// Paginated deliveries
const paginatedDeliveries = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  const end = start + perPage.value
  return filteredDeliveries.value.slice(start, end)
})

const startItem = computed(() => {
  return total.value === 0 ? 0 : (currentPage.value - 1) * perPage.value + 1
})

const endItem = computed(() => {
  const end = currentPage.value * perPage.value
  return end > total.value ? total.value : end
})

// Total records for pagination
const total = computed(() => filteredDeliveries.value.length)

// Helpers
function goToAddDelivery() {
  router.push('/delivery/add')
}
function handleEdit(id: number) {
  router.push(`/delivery/edit/${id}`)
}
function formatDate(dateString: string): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Fetch deliveries from API
async function fetchDeliveries() {
  try {
    const res = await axios.get('http://127.0.0.1:8000/api/delivery')
    deliveries.value = res.data
  } catch (err: any) {
    console.error(err)
    error.value = 'Failed to load deliveries'
  } finally {
    loading.value = false
  }
}
onMounted(fetchDeliveries)

// Delete
async function deleteDelivery(id: number) {
  const confirmed = await confirmDialog.open({
    title: 'Delete Delivery',
    message: `Are you sure you want to delete delivery #${id}?`,
    type: 'danger',
    confirmText: 'Delete',
  })
  if (!confirmed) return
  try {
    await axios.delete(`http://127.0.0.1:8000/api/delivery/${id}`)
    deliveries.value = deliveries.value.filter((d) => d.delivery_id !== id)
    notificationStore.show(
      'success',
      'Delivery Deleted',
      `Delivery #${id} has been deleted successfully.`,
    )
  } catch (err) {
    console.error('Failed to delete delivery:', err)
    notificationStore.show('error', 'Delete Failed', `Unable to delete delivery #${id}.`)
  }
}

// Approve
async function approveDelivery(id: number) {
  const confirmed = await confirmDialog.open({
    title: 'Approve Delivery',
    message: `Do you want to approve delivery #${id}? Once approved, it will be locked.`,
    type: 'info',
    confirmText: 'Approve',
  })
  if (!confirmed) return
  try {
    await axios.post(`http://127.0.0.1:8000/api/delivery/${id}/approve`)
    await fetchDeliveries()
    notificationStore.show(
      'success',
      'Delivery Approved',
      `Delivery #${id} has been approved successfully.`,
    )
  } catch (err) {
    console.error('Failed to approve delivery:', err)
    notificationStore.show('error', 'Approval Failed', `Unable to approve delivery #${id}.`)
  }
}
</script>

<template>
  <AppLayout :breadcrumbs="breadcrumbs">
    <div class="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
      <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div class="text-center sm:text-left">
          <h1 class="text-xl font-bold text-gray-800 flex items-center gap-2">Delivery Records</h1>
          <p class="text-sm text-gray-500 mt-1">Manage and track Delivery Records</p>
        </div>

        <div class="flex items-center gap-3 w-full sm:w-auto justify-end">
          <SearchInput v-model="searchQuery" placeholder="Search" class="w-full sm:w-64" />
          <AddButton label="New Delivery" @click="goToAddDelivery" />
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
        <BaseTable :items="paginatedDeliveries" :columns="columns" striped>
          <!-- Actions -->
          <template #actions="{ row }">
            <div class="flex justify-center gap-2">
              <EditButton @click="handleEdit(row.delivery_id)" tooltip="Edit" size="sm" />
              <DeleteButton @delete="deleteDelivery(row.delivery_id)" tooltip="Delete" size="sm" />
              <ApproveButton @click.stop="approveDelivery(row.delivery_id)" :disabled="row.status === 'Approved'"
                tooltip="Approve" size="sm" />
            </div>
          </template>

          <!-- Supplier -->
          <template #supplier="{ row }">
            {{ row.supplier_info?.supplier_name || 'N/A' }}
          </template>

          <!-- Prepared By -->
          <template #prepared_by="{ row }">
          </template>

          <!-- Date Created -->
          <template #created_at="{ row }">
            {{ formatDate(row.created_at) }}
          </template>

          <!-- Status -->
          <template #status="{ row }">
            <span
              class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium shadow-sm transition-all border"
              :class="row.status === 'Approved'
                ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200'
                : 'bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200'
                ">
              <span class="w-2 h-2 rounded-full mr-2"
                :class="row.status === 'Approved' ? 'bg-green-500' : 'bg-yellow-500'"></span>
              {{ row.status }}
            </span>
          </template>

          <!-- Footer -->
          <template #footer>
            <div class="relative bg-gray-50 border-t border-gray-200 rounded-b-lg">
              <div class="absolute left-4 mt-3 -translate-y-1/2 text-gray-700 text-sm md:text-small">
                Showing items <strong>{{ startItem }}</strong> to <strong>{{ endItem }}</strong> of
                <strong>{{ total }}</strong> entries
              </div>

              <div class="flex justify-center">
                <Pagination :total="total" v-model:perPage="perPage" v-model:currentPage="currentPage"
                  :perPageOptions="[10, 20, 30, 50, 100]" />
              </div>
            </div>
          </template>
        </BaseTable>
      </div>
    </div>
  </AppLayout>
</template>
