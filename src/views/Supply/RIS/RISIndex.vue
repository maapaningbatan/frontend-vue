<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AppLayout from '@/components/layouts/AppLayout.vue'
import { type BreadcrumbItem } from '@/types/api'
import { useRouter } from 'vue-router'
import axios from 'axios'
import ActionButtons from '@/components/ui/button/ActionButtons.vue'
import { Check } from 'lucide-vue-next'

// Router instance
const router = useRouter()

// Breadcrumbs
const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'RIS', href: '/ris' },
]

// Reactive state
const risList = ref<any[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

// Navigate to RISAdd.vue
function goToAddRIS() {
  router.push('/ris/add')
}
function handleEdit(id: number) {
  router.push(`/ris/edit/${id}`)
}

// ✅ Format date helper
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
    // Refresh list
    await fetchRIS()
    alert('RIS approved successfully!')
  } catch (err) {
    console.error('Failed to approve RIS:', err)
    alert('Failed to approve RIS. Check console for details.')
  }
}
</script>

<template>
  <AppLayout :breadcrumbs="breadcrumbs">
    <div class="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
      <!-- Top Actions -->
      <div class="flex justify-end mb-4">
        <button
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          @click="goToAddRIS"
        >
          + Add RIS
        </button>
      </div>

      <!-- Loading / Error -->
      <div v-if="loading" class="text-center text-gray-500 py-6">Loading...</div>
      <div v-else-if="error" class="text-center text-red-500 py-6">{{ error }}</div>

      <!-- Table -->
      <div v-else class="overflow-x-auto rounded-lg shadow border border-gray-200">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-center text-sm font-semibold text-gray-600">Action</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">RIS Number</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Office</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Purpose</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Requested By</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">RIS Date</th>
              <th class="px-4 py-3 text-center text-sm font-semibold text-gray-600">RIS Status</th>
              <th class="px-4 py-3 text-center text-sm font-semibold text-gray-600">Date Created</th>
              <th class="px-4 py-3 text-center text-sm font-semibold text-gray-600">Created By</th>
            </tr>
          </thead>

          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="ris in risList"
              :key="ris.ris_id"
              class="hover:bg-blue-50 transition"
            >
              <td class="px-4 py-3 text-center flex justify-center gap-2">
                <!-- Action Buttons -->
                <ActionButtons
                  @edit="handleEdit(ris.ris_id)"
                  @delete="deleteRIS(ris.ris_id)"
                />

                <!-- Approve Button -->
                <button
                  @click="approveRIS(ris.ris_id)"
                  :disabled="ris.ris_status === 'Approved'"
                  class="p-2 rounded-full border flex items-center justify-center transition
                         hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed
                         border-blue-700 text-blue-500 hover:bg-blue-100"
                >
                  <Check class="w-4 h-4" />
                </button>
              </td>

              <td class="px-4 py-3 text-sm text-gray-700">{{ ris.ris_number }}</td>
              <td class="px-4 py-3 text-sm text-gray-500">{{ ris.office_info?.Office_Desc || 'N/A' }}</td>
              <td class="px-4 py-3 text-sm text-gray-500">{{ ris.purpose }}</td>
              <td class="px-4 py-3 text-sm text-gray-500">{{ ris.requested_by_employee?.full_name || 'N/A' }}</td>
              <td class="px-4 py-3 text-sm text-gray-500">{{ formatDate(ris.ris_date) }}</td>
              <td class="px-4 py-3 text-sm font-semibold">
                <span
                  class="px-2 py-1 rounded text-xs"
                  :class="ris.ris_status === 'Approved'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'"
                >
                  {{ ris.ris_status }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm text-gray-500">{{ formatDate(ris.created_at) }}</td>
              <td class="px-4 py-3 text-sm text-gray-500">{{ ris.created_by_employee?.full_name || 'N/A' }}</td>
            </tr>

            <!-- Empty state -->
            <tr v-if="!risList.length">
              <td colspan="9" class="p-6 text-center text-gray-400 italic">
                No RIS records found.
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Footer -->
        <div
          class="bg-gray-50 px-4 py-2 text-gray-700 text-sm rounded-b-lg border-t border-gray-200 flex justify-between items-center"
        >
          <span>
            Showing <strong>{{ risList.length }}</strong> entries
          </span>

          <!-- Static Pagination -->
          <div class="flex items-center gap-2">
            <button class="px-3 py-1 border rounded hover:bg-gray-100">&laquo;</button>
            <button class="px-3 py-1 border rounded bg-blue-500 text-white">1</button>
            <button class="px-3 py-1 border rounded hover:bg-gray-100">&raquo;</button>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>
