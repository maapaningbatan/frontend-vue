<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import AppLayout from '@/components/layouts/AppLayout.vue'
import { type BreadcrumbItem } from '@/types/api'
import { useRouter } from 'vue-router'
import axios from 'axios'
import EditButton from '@/components/ui/button/EditButton.vue'
import DeleteButton from '@/components/ui/button/DeleteButton.vue'
import ApproveButton from '@/components/ui/button/ApproveButton.vue'
import BaseTable from '@/components/ui/table/BaseTable.vue'
import AddButton from '@/components/ui/button/AddButton.vue'
import SearchInput from '@/components/ui/search/SearchInput.vue'
import Pagination from '@/components/ui/pagination/Pagination.vue'

// Router instance
const router = useRouter()

// Breadcrumbs
const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Supply Management', href: '#' },
  { title: 'RIS', href: '/ris' },
]

// Table columns
const columns: {
  key: string
  label: string
  align?: 'left' | 'center' | 'right'
}[] = [
  { key: 'actions', label: 'Action', align: 'center' },
  { key: 'ris_number', label: 'RIS Number' },
  { key: 'office', label: 'Office' },
  { key: 'purpose', label: 'Purpose' },
  { key: 'requested_by', label: 'Requested By' },
  { key: 'ris_date', label: 'RIS Date' },
  { key: 'ris_status', label: 'RIS Status', align: 'center' },
  { key: 'created_at', label: 'Date Created', align: 'center' },
  { key: 'created_by', label: 'Created By', align: 'center' },
]

// Search state
const searchRIS = ref('')

// Reactive state
const risList = ref<any[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

// Pagination state
const currentPage = ref(1)
const perPage = ref(10)

// Navigate to Add/Edit
function goToAddRIS() {
  router.push('/ris/add')
}
function handleEdit(id: number) {
  router.push(`/ris/edit/${id}`)
}

// Format date helper
function formatDate(dateString: string): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Fetch RIS from API
async function fetchRIS() {
  try {
    const res = await axios.get('http://127.0.0.1:8000/api/ris')
    risList.value = res.data
  } catch (err: any) {
    console.error(err)
    error.value = 'Failed to load RIS records'
  } finally {
    loading.value = false
  }
}

onMounted(fetchRIS)

// Delete RIS
async function deleteRIS(id: number) {
  if (!confirm('Are you sure you want to delete this RIS?')) return

  try {
    await axios.delete(`http://127.0.0.1:8000/api/ris/${id}`)
    risList.value = risList.value.filter((r) => r.ris_id !== id)
  } catch (err) {
    console.error('Failed to delete RIS:', err)
    alert('Failed to delete RIS. Check console for details.')
  }
}

// Approve RIS
async function approveRIS(id: number) {
  if (!confirm('Approve this RIS? Once approved, it will be locked.')) return

  try {
    await axios.post(`http://127.0.0.1:8000/api/ris/${id}/approve`)
    await fetchRIS()
    alert('RIS approved successfully!')
  } catch (err) {
    console.error('Failed to approve RIS:', err)
    alert('Failed to approve RIS. Check console for details.')
  }
}

// Filtered RIS list
const filteredRIS = computed(() => {
  const term = searchRIS.value.toLowerCase()
  if (!term) return risList.value
  return risList.value.filter((r) =>
    (r.ris_number?.toLowerCase() || '').includes(term) ||
    (r.office_info?.Office_Desc?.toLowerCase() || '').includes(term) ||
    (r.purpose?.toLowerCase() || '').includes(term) ||
    (r.requested_by_employee?.full_name?.toLowerCase() || '').includes(term)
  )
})

// Pagination calculations
const totalRIS = computed(() => filteredRIS.value.length)
const startItem = computed(() => (currentPage.value - 1) * perPage.value + 1)
const endItem = computed(() => {
  const last = currentPage.value * perPage.value
  return last > totalRIS.value ? totalRIS.value : last
})
</script>

<template>
  <AppLayout :breadcrumbs="breadcrumbs">
    <div class="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
      <!-- Top Actions -->
      <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div class="text-center sm:text-left">
          <h1 class="text-xl font-bold text-gray-800 flex items-center gap-2">
            Requisition and Issue Slip
          </h1>
          <p class="text-sm text-gray-500 mt-1">
            Requisition and Issue Slips - Track requests, approvals, and issued items.
          </p>
        </div>

        <div class="flex items-center gap-3 w-full sm:w-auto justify-end">
          <SearchInput v-model="searchRIS" placeholder="Search" class="w-full sm:w-64" />
          <AddButton label="Request RIS" @click="goToAddRIS" />
        </div>
      </div>

      <!-- Loading / Error -->
      <div v-if="loading" class="text-center text-gray-500 py-6">Loading...</div>
      <div v-else-if="error" class="text-center text-red-500 py-6">{{ error }}</div>

      <!-- Table -->
      <div v-else class="overflow-x-auto rounded-lg shadow border border-gray-200">
        <BaseTable :items="filteredRIS" :columns="columns" striped>
          <!-- Actions column -->
          <template #actions="{ row }">
            <div class="flex gap-2">
              <EditButton @click="handleEdit(row.ris_id)" size="sm" tooltip="Edit RIS" />
              <DeleteButton @delete="deleteRIS(row.ris_id)" size="sm" tooltip="Delete RIS" />
              <ApproveButton
                @click="approveRIS(row.ris_id)"
                :disabled="row.ris_status === 'Approved'"
                size="sm"
                tooltip="Approve RIS"
              />
            </div>
          </template>

          <!-- Office column -->
          <template #office="{ row }">
            {{ row.office_info?.Office_Desc || 'N/A' }}
          </template>

          <!-- Requested By column -->
          <template #requested_by="{ row }">
            {{ row.requested_by_employee?.full_name || 'N/A' }}
          </template>

          <!-- RIS Date -->
          <template #ris_date="{ row }">
            {{ formatDate(row.ris_date) }}
          </template>

          <!-- RIS Status -->
          <template #ris_status="{ row }">
             <span
              class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium shadow-sm transition-all border"
              :class="
                row.status === 'Approved'
                  ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200'
                  : 'bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200'
              "
            >
              <span
                class="w-2 h-2 rounded-full mr-2"
                :class="row.status === 'Approved' ? 'bg-green-500' : 'bg-yellow-500'"
              ></span>
              {{ row.status }}
            </span>
          </template>

          <!-- Created At -->
          <template #created_at="{ row }">
            {{ formatDate(row.created_at) }}
          </template>

          <!-- Created By -->
          <template #created_by="{ row }">
            {{ row.created_by_employee?.full_name || 'N/A' }}
          </template>

          <!-- Footer -->
          <template #footer>
            <div class="relative bg-gray-50 border-t border-gray-200 rounded-b-lg">
              <div
                class="absolute left-4 mt-3 -translate-y-1/2 text-gray-700 text-sm md:text-small"
              >
                Showing items <strong>{{ startItem }}</strong> to <strong>{{ endItem }}</strong> of
                <strong>{{ totalRIS }}</strong> entries
              </div>

              <div class="flex justify-center">
                <Pagination
                  :total="totalRIS"
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
