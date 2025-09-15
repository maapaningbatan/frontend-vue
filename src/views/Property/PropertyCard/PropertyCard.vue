<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// Reactive supplyId
const supplyId = ref(route.params.id as string)

// State
const propertyCard = ref<any>(null)
const fromDate = ref('')
const toDate = ref('')
const allTransactions = ref<any[]>([])
const transactions = ref<any[]>([])

// Fetch property card info by supplyId
async function fetchPropertyCard() {
  try {
    const res = await fetch(`http://localhost:8000/api/property-cards/${supplyId.value}`)
    if (!res.ok) throw new Error('Card not found')
    const data = await res.json()

    propertyCard.value = data.supply
    allTransactions.value = data.propertyCards ?? []
    transactions.value = [] // start empty
  } catch (err) {
    console.error(err)
    propertyCard.value = null
    allTransactions.value = []
    transactions.value = []
  }
}

// Watch route param changes
watch(
  () => route.params.id,
  (newId) => {
    if (newId !== supplyId.value) {
      supplyId.value = newId as string
      fetchPropertyCard()
    }
  }
)

// Navigation
function goToPropertyIndex() {
  router.push('/property-card')
}

// Filter by date
function generate() {
  if (!fromDate.value || !toDate.value) {
    transactions.value = []
    return
  }
  const from = new Date(fromDate.value)
  const to = new Date(toDate.value)

  transactions.value = allTransactions.value.filter(t => {
    const d = new Date(t.transaction_date)
    return d >= from && d <= to
  })
}

// Reset table & dates
function reset() {
  fromDate.value = ''
  toDate.value = ''
  transactions.value = []
}

// Print
function handlePrint() {
  window.print()
}

// Initial fetch
onMounted(fetchPropertyCard)
</script>

<template>
  <div class="p-6 bg-gray-100 text-gray-800">
    <!-- Actions -->
    <div class="no-print mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-6 bg-white p-6 rounded-xl shadow">
      <div class="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
        <div>
          <label class="text-sm font-semibold text-gray-700">From</label>
          <input v-model="fromDate" type="date" class="mt-1 w-full sm:w-48 px-3 py-2 border rounded-md shadow-sm focus:ring focus:ring-blue-500"/>
        </div>
        <div>
          <label class="text-sm font-semibold text-gray-700">To</label>
          <input v-model="toDate" type="date" class="mt-1 w-full sm:w-48 px-3 py-2 border rounded-md shadow-sm focus:ring focus:ring-blue-500"/>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row gap-3">
        <button @click="generate" class="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 shadow">Generate</button>
        <button @click="reset" class="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 shadow">Reset</button>
        <button @click="handlePrint" class="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 shadow">Print</button>
        <button @click="goToPropertyIndex" class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 shadow">Back</button>
      </div>
    </div>

    <!-- Header -->
    <div class="text-center font-bold text-lg">PROPERTY RECORDS AND EQUIPMENT MONITORING INVENTORY SYSTEM</div>
    <div class="text-center font-bold text-lg">PROPERTY CARD</div>
    <div class="text-center font-bold text-lg mb-6">
      as of {{ fromDate || '—' }} to {{ toDate || '—' }}
    </div>

    <!-- Details -->
    <div class="w-full px-2 text-sm flex flex-wrap gap-y-2 mb-2">
      <div class="flex items-center w-full md:w-1/2 pr-4">
        <span class="font-medium text-base mr-2 whitespace-nowrap">Entity Name:</span>
        <div class="flex-1 border-b border-gray-500 h-5">DSWD CENTRAL OFFICE</div>
      </div>
      <div class="flex items-center w-full md:w-1/2 pr-4">
        <span class="font-medium text-base mr-2 whitespace-nowrap">Fund Cluster:</span>
        <div class="flex-1 border-b border-gray-500 h-5">{{ propertyCard?.fund_cluster || '—' }}</div>
      </div>
    </div>

    <!-- Box -->
    <div class="border border-black text-sm w-full mb-4">
      <div class="border-b border-gray-800 px-2 py-2 font-medium">
        Property, Plant and Equipment: <strong>{{ propertyCard?.Supplies_Desc || '—' }}</strong>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full text-xs border-collapse border border-black">
        <thead class="bg-gray-200">
          <tr>
            <th>Date</th>
            <th>Reference No.</th>
            <th>Reference Type</th>
            <th>Quantity</th>
            <th>Unit Cost</th>
            <th>Total</th>
            <th>Balance</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="transactions.length === 0">
            <td colspan="8" class="text-center text-gray-500 py-4">No transactions to display.</td>
          </tr>
          <tr v-for="t in transactions" :key="t.supply_id">
            <td>{{ t.transaction_date }}</td>
            <td>{{ t.reference_no }}</td>
            <td>{{ t.entry_type }}</td>
            <td>{{ t.receipt_qty }}</td>
            <td>{{ t.unit_value ? Number(t.unit_value).toFixed(2) : '0.00' }}</td>
            <td>{{ t.total ? Number(t.total).toFixed(2) : '0.00' }}</td>
            <td>{{ t.balance }}</td>
            <td>{{ t.remarks }}</td>
          </tr>
          <tr v-if="transactions.length">
            <td colspan="8" class="text-center font-semibold text-gray-600 py-2">
              x-x-x-x-x-x-x-x-x-x-x-x-NOTHING FOLLOWS-x-x-x-x-x-x-x-x-x-x-x-x
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
table, th, td { border: 1px solid black; }
th, td { padding: 3px; text-align: center; }
@media print {
  @page { size: A4 landscape; }
  body { font-size: 11px; }
  .no-print { display: none !important; }
  table tr { page-break-inside: avoid; }
}
</style>
