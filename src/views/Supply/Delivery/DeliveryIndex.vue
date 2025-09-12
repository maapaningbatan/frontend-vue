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
  { title: 'Delivery', href: '/delivery' },
]

// Reactive state
const deliveries = ref<any[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

// Navigate to DeliveryAdd.vue
function goToAddDelivery() {
  router.push('/delivery/add')
}
function handleEdit(id: number) {
  router.push(`/delivery/edit/${id}`)
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

// Delete delivery
async function deleteDelivery(id: number) {
  if (!confirm('Are you sure you want to delete this delivery?')) return

  try {
    await axios.delete(`http://localhost:8000/api/delivery/${id}`)
    deliveries.value = deliveries.value.filter((d) => d.delivery_id !== id)
  } catch (err) {
    console.error('Failed to delete delivery:', err)
    alert('Failed to delete delivery. Check console for details.')
  }
}

// Approve delivery
async function approveDelivery(id: number) {
  if (!confirm('Approve this delivery? Once approved, it will be locked.')) return

  try {
    await axios.post(`http://127.0.0.1:8000/api/delivery/${id}/approve`)
    // Refresh list
    await fetchDeliveries()
    alert('Delivery approved successfully!')
  } catch (err) {
    console.error('Failed to approve delivery:', err)
    alert('Failed to approve delivery. Check console for details.')
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
          @click="goToAddDelivery"
        >
          + Add Delivery
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
              <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Delivery ID</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Purchase Order</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">IAR Number</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Purchase Date</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Supplier</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Amount</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Code Number</th>
              <th class="px-4 py-3 text-center text-sm font-semibold text-gray-600">Date Created</th>
              <th class="px-4 py-3 text-center text-sm font-semibold text-gray-600">Prepared By</th>
              <th class="px-4 py-3 text-center text-sm font-semibold text-gray-600">Status</th>
            </tr>
          </thead>

          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="delivery in deliveries"
              :key="delivery.delivery_id"
              class="hover:bg-blue-50 transition"
            >
             <td class="px-4 py-3 text-center flex justify-center gap-2">
  <!-- Existing Action Buttons -->
  <ActionButtons
    @edit="handleEdit(delivery.delivery_id)"
    @delete="deleteDelivery(delivery.delivery_id)"
  />

  <!-- ✅ New Approve Button -->
  <button
    @click="approveDelivery(delivery.delivery_id)"
    :disabled="delivery.status === 'Approved'"
    class="p-2 rounded-full border flex items-center justify-center transition
           hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed
           border-blue-700 text-blue-500 hover:bg-blue-100"
  >
    <Check class="w-4 h-4" />
  </button>
</td>


              <td class="px-4 py-3 text-sm text-gray-700">{{ delivery.delivery_id }}</td>
              <td class="px-4 py-3 text-sm font-medium text-gray-800">
                {{ delivery.purchase_order_number }}
              </td>
              <td class="px-4 py-3 text-sm text-gray-500">{{ delivery.iar_number }}</td>
              <td class="px-4 py-3 text-sm text-gray-500">{{ delivery.purchase_date }}</td>
              <td class="px-4 py-3 text-sm text-gray-500">
                {{ delivery.supplier_info?.Supplier_Name || 'N/A' }}
              </td>

              <td class="px-4 py-3 text-sm text-gray-500">{{ delivery.po_amount }}</td>
              <td class="px-4 py-3 text-sm text-gray-500">{{ delivery.code_number }}</td>
              <td class="px-4 py-3 text-sm text-gray-500">
                {{ formatDate(delivery.created_at) }}
              </td>
              <td class="px-4 py-3 text-sm text-gray-500">
                {{ delivery.prepared_by_employee?.full_name || 'N/A' }}
              </td>
              <td class="px-4 py-3 text-sm font-semibold">
                <span
                  class="px-2 py-1 rounded text-xs"
                  :class="delivery.status === 'Approved'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'"
                >
                  {{ delivery.status }}
                </span>
              </td>
            </tr>

            <!-- Empty state -->
            <tr v-if="!deliveries.length">
              <td colspan="11" class="p-6 text-center text-gray-400 italic">
                No deliveries found.
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Footer -->
        <div
          class="bg-gray-50 px-4 py-2 text-gray-700 text-sm rounded-b-lg border-t border-gray-200 flex justify-between items-center"
        >
          <span>
            Showing <strong>{{ deliveries.length }}</strong> entries
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
