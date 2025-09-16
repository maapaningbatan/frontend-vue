<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'
import SelectSearch from '@/components/ui/select/SelectSearch.vue'
import TextArea from '@/components/ui/textarea/TextArea.vue'
import Input from '@/components/ui/input/Input.vue'
import { Label } from 'reka-ui'

// Interfaces
interface Supply {
  SuppliesID: number
  Supplies_Desc: string
  StockNo: string
  UnitID: number
  isActive: number
  Image_Url?: string
}

interface Unit {
  Unit_Id: number
  Unit_Type: string
}

// State
const supplies = ref<Supply[]>([])
const units = ref<Unit[]>([])
const items = ref<any[]>([])

const selectedSupply = ref<number | undefined>(undefined)
const selectedUnit = ref<number | undefined>(undefined)
const quantity = ref<number>(0)
const additional_description = ref<string>('')
const remarks = ref<string>('')

const errorMessage = ref('')
const previewSupply = ref<Supply | null>(null)

// Fetch data
onMounted(async () => {
  try {
    const [suppliesRes, unitsRes] = await Promise.all([
      axios.get('http://localhost:8000/api/supplies'),
      axios.get('http://localhost:8000/api/units')
    ])
    supplies.value = Array.isArray(suppliesRes.data)
      ? suppliesRes.data.filter(s => Number(s.isActive) === 0)
      : []
    units.value = Array.isArray(unitsRes.data) ? unitsRes.data : []
  } catch (error) {
    console.error('Error fetching data:', error)
  }
})

// Computed
const grandTotal = computed(() =>
  items.value.reduce((total, item) => total + item.quantity, 0)
)

// Watch supply → auto-set unit + preview
watch(selectedSupply, (newVal) => {
  if (!newVal) {
    selectedUnit.value = undefined
    previewSupply.value = null
    return
  }
  const supply = supplies.value.find(s => s.SuppliesID === newVal)
  if (supply) {
    selectedUnit.value = supply.UnitID || undefined
    previewSupply.value = supply
  }
})

// Methods
function addItem() {
  if (!selectedSupply.value) {
    errorMessage.value = 'Please select a supply.'
    return
  }
  if (!quantity.value || quantity.value <= 0) {
    errorMessage.value = 'Please enter a valid quantity.'
    return
  }
  const duplicate = items.value.find(item => item.supply === selectedSupply.value)
  if (duplicate) {
    errorMessage.value = `The supply "${duplicate.supply_name}" is already added.`
    return
  }
  const supply = supplies.value.find(s => s.SuppliesID === selectedSupply.value)
  items.value.push({
    supply: selectedSupply.value,
    supply_name: supply?.Supplies_Desc || '',
    stock_number: supply?.StockNo || '',
    unit: selectedUnit.value,
    unit_name: units.value.find(u => u.Unit_Id === selectedUnit.value)?.Unit_Type || '',
    quantity: quantity.value,
    additional_description: additional_description.value,
    remarks: remarks.value,
    image_url: supply?.Image_Url || ''
  })
  // Reset form
  selectedSupply.value = undefined
  selectedUnit.value = undefined
  quantity.value = 0
  additional_description.value = ''
  remarks.value = ''
  previewSupply.value = null
  errorMessage.value = ''
}

function removeItem(index: number) {
  if (confirm('Are you sure you want to remove this item?')) {
    items.value.splice(index, 1)
  }
}
</script>

<template>
  <div class="space-y-6">
    <h3 class="text-xl font-bold">Items Details</h3>

    <div v-if="errorMessage" class="text-red-600 font-medium">{{ errorMessage }}</div>

    <!-- Add Item Section: full-width form + image -->
    <div class="flex flex-col md:flex-row gap-4 w-full">
      
      <!-- Left: Form -->
      <div class="flex-1 bg-white p-4 rounded shadow-sm space-y-4">
        <!-- Row 1: Supplies / Unit / Quantity (full width) -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          <div>
            <Label class="block text-sm font-medium">Supplies</Label>
            <SelectSearch
              v-model="selectedSupply"
              :options="supplies.map(s => ({ label: `${s.Supplies_Desc} / ${s.StockNo}`, value: s.SuppliesID }))"
              placeholder="Select Supply"
              class="mt-1 w-full h-11"
            />
          </div>
          <div>
            <Label class="block text-sm font-medium">Unit</Label>
            <SelectSearch
              v-model="selectedUnit"
              :options="units.map(u => ({ label: u.Unit_Type, value: u.Unit_Id }))"
              placeholder="Select Unit"
              class="mt-1 w-full h-11"
            />
          </div>
          <div>
            <Label class="block text-sm font-medium">Quantity</Label>
            <Input
              v-model.number="quantity"
              type="number"
              placeholder="Enter Quantity"
              class="mt-1 w-full border rounded-lg px-3 py-2"
            />
          </div>
        </div>

        <!-- Row 2: Additional Description / Remarks -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <div>
            <Label class="block text-sm font-medium">Additional Description</Label>
            <TextArea
              v-model="additional_description"
              placeholder="Additional Description"
              :rows="2"
              class="mt-1 w-full border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <Label class="block text-sm font-medium">Remarks</Label>
            <TextArea
              v-model="remarks"
              placeholder="Remarks"
              :rows="2"
              class="mt-1 w-full border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <!-- Add Item Button -->
        <div class="flex justify-start">
          <button
            type="button"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            @click="addItem"
          >
            ➕ Add Item
          </button>
        </div>
      </div>

      <!-- Right: Image Preview -->
      <div class="w-48 md:w-64 flex-shrink-0 flex items-start">
        <div class="w-full h-[184px] border-2 border-gray-300 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50">
          <img
            v-if="previewSupply?.Image_Url"
            :src="previewSupply.Image_Url"
            alt="Supply Image"
            class="object-cover w-full h-full"
          />
          <span v-else class="text-gray-400 text-xs text-center px-2">
            No uploaded image
          </span>
        </div>
      </div>
    </div>

    <!-- Review Items Table -->
    <div class="pt-4 border-t-2 border-gray-300">
      <h2 class="text-lg font-semibold mb-2">Review Items</h2>
      <div class="overflow-auto border rounded-lg shadow-sm">
        <table class="min-w-full text-sm text-left table-auto">
          <thead class="bg-gray-100 text-xs uppercase">
            <tr>
              <th class="px-3 py-2">Action</th>
              <th class="px-3 py-2">Image</th>
              <th class="px-3 py-2">Supplies</th>
              <th class="px-3 py-2">Stock No.</th>
              <th class="px-3 py-2">Unit</th>
              <th class="px-3 py-2">Qty</th>
              <th class="px-3 py-2">Additional Description</th>
              <th class="px-3 py-2">Remarks</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in items" :key="index" class="border-t hover:bg-gray-50">
              <td class="px-3 py-2">
                <button type="button" class="text-red-600 hover:underline" @click="removeItem(index)">
                  Remove
                </button>
              </td>
              <td class="px-3 py-2">
                <div class="w-16 h-16 border border-gray-300 rounded flex items-center justify-center overflow-hidden bg-gray-50">
                  <img v-if="item.image_url" :src="item.image_url" alt="Item Image" class="object-cover w-full h-full" />
                  <span v-else class="text-gray-400 text-xs text-center">No uploaded image</span>
                </div>
              </td>
              <td class="px-3 py-2">{{ item.supply_name }}</td>
              <td class="px-3 py-2">{{ item.stock_number }}</td>
              <td class="px-3 py-2">{{ item.unit_name }}</td>
              <td class="px-3 py-2">{{ item.quantity }}</td>
              <td class="px-3 py-2">{{ item.additional_description }}</td>
              <td class="px-3 py-2">{{ item.remarks }}</td>
            </tr>
          </tbody>
          <tfoot class="bg-gray-100 font-semibold">
            <tr>
              <td colspan="5" class="py-2 text-right">Total Quantity:</td>
              <td colspan="3" class="py-2">{{ grandTotal }}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</template>

