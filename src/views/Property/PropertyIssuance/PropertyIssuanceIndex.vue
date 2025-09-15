<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AppLayout from '@/components/layouts/AppLayout.vue'
import { type BreadcrumbItem } from '@/types/api'
import axios from 'axios'
import { Search, WalletCards } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()

// Breadcrumbs
const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Property Issuance', href: '/property-issuance' },
]

// Navigate to edit page
const goToEdit = (card: any) => {
  const id = card.type === 'PPE' ? card.property_card_id : card.semi_expandable_card_id
  if (!id) {
    console.error('Missing ID for edit', card)
    return
  }
  router.push({ name: 'PropertyIssuanceEdit', params: { id, type: card.type } })
}

// State
const issuance = ref<any[]>([])
const loading = ref(true)

// Fetch issuance data
const fetchIssuance = async () => {
  try {
    const { data } = await axios.get('/property-issuance')

    // Map IDs for frontend
    issuance.value = data.map((item: any) => ({
      ...item,
      property_card_id: item.type === 'PPE' ? item.id : null,
      semi_expandable_card_id: item.type === 'ICS' ? item.id : null,
    }))
  } catch (error) {
    console.error('Failed to fetch issuance:', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchIssuance)
</script>

<template>
  <AppLayout :breadcrumbs="breadcrumbs">
    <div class="flex flex-col gap-6 p-6">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-gray-800">Property Issuance</h1>
        <button
          class="px-5 py-2 rounded-lg bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition"
        >
          + New Issuance
        </button>
      </div>

      <!-- Filters -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div class="relative w-full sm:w-72">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by Reference No or Description..."
            class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto rounded-xl shadow border border-gray-200 bg-white">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Issuance #</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">PO Number</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Description</th>
              <th class="px-4 py-3 text-center text-sm font-semibold text-gray-600">Quantity</th>
              <th class="px-4 py-3 text-center text-sm font-semibold text-gray-600">Type</th>
              <th class="px-4 py-3 text-center text-sm font-semibold text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <!-- Loading -->
            <tr v-if="loading">
              <td colspan="7" class="p-6 text-center text-gray-400 italic">
                Loading data...
              </td>
            </tr>

            <!-- Data Rows -->
            <tr
              v-for="(card, index) in issuance"
              :key="index"
              class="hover:bg-blue-50 transition duration-200"
            >
              <!-- Actions -->
              <td class="px-4 py-3 flex gap-2">
                <button
                  @click="goToEdit(card)"
                  class="px-3 py-1 bg-yellow-500 text-white rounded-md text-xs hover:bg-yellow-600"
                >
                  Edit
                </button>

                <button class="px-3 py-1 bg-red-600 text-white rounded-md text-xs hover:bg-red-700">
                  Delete
                </button>
                <button
                  class="w-8 h-8 flex items-center justify-center rounded-full border border-blue-500 text-blue-500 hover:bg-blue-100 transition"
                  :title="`View ${card.type} Card`"
                >
                  <WalletCards class="w-4 h-4" />
                </button>
              </td>

              <!-- Issuance # (placeholder) -->
              <td class="px-4 py-3 text-sm font-medium text-gray-700">-</td>

              <!-- PO Number -->
              <td class="px-4 py-3 text-sm text-gray-700">{{ card.reference_no }}</td>

              <!-- Description -->
              <td class="px-4 py-3 text-sm text-gray-800">{{ card.Supplies_Desc }}</td>

              <!-- Quantity -->
              <td class="px-4 py-3 text-sm text-center text-gray-500">{{ card.receipt_qty }}</td>

              <!-- Type -->
              <td
                class="px-4 py-3 text-sm font-semibold text-center"
                :class="card.type === 'PPE' ? 'text-blue-600' : 'text-green-600'"
              >
                {{ card.type }}
              </td>

              <!-- Status Badge -->
              <td class="px-4 py-3 text-sm text-center">
                <span
                  class="px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700"
                >
                  Pending
                </span>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="!loading && issuance.length === 0">
              <td colspan="7" class="p-6 text-center text-gray-400 italic">
                No issuance records found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AppLayout>
</template>
