<script setup lang="ts">
import { ref } from 'vue'
import dayjs from 'dayjs'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'


const router = useRouter()
const route = useRoute()

const supply = ref<any>({})
const stockcards = ref<any[]>([])

const fromDate = ref('')
const toDate = ref('')
const hasGenerated = ref(false) // 🚩 track if user clicked Generate

// Navigate back
function goToSuppliesList() {
  router.push('/supplies')
}

// Print stock card
function printStockCard() {
  window.print()
}

// Reset dates
function resetDates() {
  fromDate.value = ''
  toDate.value = ''
  stockcards.value = []
  hasGenerated.value = false
}

// Fetch data from API
async function fetchStockCard() {
  const supplyId = route.params.id
  if (!supplyId) {
    console.error('No supply ID found in route.')
    return
  }

  try {
    const { data } = await axios.get(`/stock-card/${supplyId}`, {
      params: {
        from: fromDate.value || undefined,
        to: toDate.value || undefined,
      },
    })

    supply.value = data.supply || {}
    stockcards.value = (data.stockcards || []).map((c: any) => ({
      ...c,
      unit_value: Number(c.unit_value) || 0,
      balance: Number(c.balance) || 0,
      receipt_qty: Number(c.receipt_qty) || 0,
      issued_qty: Number(c.issued_qty) || 0,
    }))
  } catch (error) {
    console.error('Failed to fetch stock card:', error)
  }
}

// Generate filtered report
function generateReport() {
  hasGenerated.value = true
  fetchStockCard()
}

// Update single stock card row
async function updateStockCard(card: any) {
  try {
    await axios.put(`/stock-card/${card.stock_card_id}`, {
      receipt_qty: card.receipt_qty,
      issued_qty: card.issued_qty,
      remarks: card.remarks,
    })
    alert('✅ Updated successfully')
  } catch (error) {
    console.error('Update failed:', error)
    alert('❌ Failed to update')
  }
}
</script>

<template>
  <div class="p-6 bg-gray-100 text-gray-800">
    <!-- Actions -->
    <div class="mb-6 flex flex-wrap items-end justify-between gap-6 bg-white p-6 rounded-xl shadow no-print">
      <div class="flex gap-4">
        <div class="flex flex-col">
          <label class="text-sm font-semibold text-gray-700">From</label>
          <input type="date" v-model="fromDate" class="mt-1 w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:outline-none" />
        </div>
        <div class="flex flex-col">
          <label class="text-sm font-semibold text-gray-700">To</label>
          <input type="date" v-model="toDate" class="mt-1 w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:outline-none" />
        </div>
      </div>
      <div class="flex gap-3 items-end">
        <button @click="generateReport" class="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition shadow">Generate</button>
        <button @click="resetDates" class="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition shadow">Reset</button>
        <button @click="printStockCard" class="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition shadow">Print Stock Card</button>
        <button @click="goToSuppliesList" class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition shadow">Back to Supplies List</button>
      </div>
    </div>

    <!-- Page Title -->
    <div class="text-center font-bold text-lg">
      PROPERTY RECORDS AND EQUIPMENT MONITORING INVENTORY SYSTEM
    </div>
    <div class="text-center font-bold text-lg">STOCK CARD</div>
    <div class="text-center font-bold text-lg mb-6">
      as of {{ fromDate || '—' }} to {{ toDate || '—' }}
    </div>

    <!-- Supply Details -->
    <div class="overflow-x-auto">
      <table class="supply-details-table w-full mb-4 text-sm border-collapse border border-black">
        <tbody>
          <tr>
            <td class="text-left font-medium border border-black px-2 py-1">Item:</td>
            <td rowspan="2" colspan="2" class="text-left align-middle border border-black px-2 py-1 font-bold">
              {{ supply.Supplies_Desc }}
            </td>
            <td class="text-left font-medium border border-black px-2 py-1">BIN Number: <strong>{{ supply.StockNo }}</strong></td>
          </tr>
          <tr>
            <td class="text-left font-medium border border-black px-2 py-1">Description:</td>
            <td class="text-left font-medium border border-black px-2 py-1">Re-Order Point: <strong>{{ supply.Supplies_ReOrder_PT }}</strong></td>
          </tr>
          <tr>
            <td colspan="2" class="text-left border border-black px-2 py-1">Stockpile: <strong>{{ supply.Supplies_Qty }}</strong></td>
            <td colspan="2" class="text-left border border-black px-2 py-1">Non-stockpile: <strong>{{ supply.supplies_nonstock_qty }}</strong></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Stock Card Table -->
    <div class="overflow-x-auto">
      <table class="stockcard-table w-full text-xs border-collapse border border-black">
        <thead class="bg-gray-200">
          <tr>
            <th rowspan="2">Date</th>
            <th colspan="2">Reference</th>
            <th>Receipt</th>
            <th colspan="2">Issue/Transfer/Disposal</th>
            <th rowspan="2">Balance Quantity</th>
            <th colspan="2">Amount</th>
            <th rowspan="2">ICS Number</th>
            <th rowspan="2">Remarks</th>
            <th rowspan="2" class="no-print">Actions</th>
          </tr>
          <tr>
            <th>Transaction</th>
            <th>Reference No.</th>
            <th>Quantity</th>
            <th>Qty.</th>
            <th>Office/Officer</th>
            <th>Unit</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!hasGenerated">
            <td colspan="12" class="text-center text-gray-500 py-4">Please select a date range and click <strong>Generate</strong>.</td>
          </tr>
          <tr v-else-if="!stockcards.length">
            <td colspan="12" class="text-center text-gray-500 py-4">No stock card entries in this date range.</td>
          </tr>
          <tr v-else v-for="card in stockcards" :key="card.stock_card_id">
            <td class="border border-black">{{ dayjs(card.transaction_date).format('MMM-DD-YY') }}</td>
            <td class="border border-black">{{ card.entry_type }}</td>
            <td class="border border-black">{{ card.reference_no }}</td>

            <!-- Editable Receipt Qty -->
            <td class="border border-black">
              <input type="number" v-model.number="card.receipt_qty" class="w-20 px-1 border border-gray-300 rounded" />
            </td>

            <!-- Editable Issued Qty -->
            <td class="border border-black">
              <input type="number" v-model.number="card.issued_qty" class="w-20 px-1 border border-gray-300 rounded" />
            </td>

            <td class="border border-black">{{ card.office_id }}</td>
            <td class="border border-black">{{ card.balance }}</td>
            <td class="border border-black">{{ card.unit_value.toFixed(2) }}</td>
            <td class="border border-black">{{ (card.balance * card.unit_value).toFixed(2) }}</td>
            <td class="border border-black">{{ card.property_no }}</td>

            <!-- Editable Remarks -->
            <td class="border border-black">
              <input type="text" v-model="card.remarks" class="w-full px-1 border border-gray-300 rounded" />
            </td>

            <!-- Save button -->
            <td class="border border-black no-print">
              <button @click="updateStockCard(card)" class="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700">Save</button>
            </td>
          </tr>
          <tr v-if="hasGenerated && stockcards.length">
            <td colspan="12" class="text-center font-semibold text-gray-600 py-2">
              x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-NOTHING FOLLOWS-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
/* Supply details table */
.supply-details-table,
.supply-details-table th,
.supply-details-table td {
  border: 1px solid black;
  border-collapse: collapse;
}

.supply-details-table th,
.supply-details-table td {
  padding: 3px;
  text-align: left;
}

/* Stock card table */
.stockcard-table,
.stockcard-table th,
.stockcard-table td {
  border: 1px solid black;
  border-collapse: collapse;
}

.stockcard-table th,
.stockcard-table td {
  padding: 3px;
  text-align: center;
}

@media print {
  @page {
    size: A4 landscape;
  }
  body {
    font-size: 11px;
  }
  .no-print {
    display: none !important;
  }
  .stockcard-table tr,
  .supply-details-table tr {
    page-break-inside: avoid;
  }
}
</style>
