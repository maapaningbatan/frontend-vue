<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'
import SelectSearch from '@/components/ui/select/SelectSearch.vue'
import TextArea from '@/components/ui/textarea/TextArea.vue'
import Input from '@/components/ui/input/Input.vue'
import { Label } from 'reka-ui'

interface Supply {
  SuppliesID: number
  Supplies_Desc: string
  StockNo: string
  UnitID: number
  CategoryID: number
  isActive: number
  UnitValue?: number
}

interface Unit {
  Unit_Id: number
  Unit_Type: string
}

interface Category {
  category_id: number
  category_desc: string
  category_code: string
}

interface Brand {
  Brand_Id: number
  Brand_Description: string
}

interface Model {
  model_id: number
  model_desc: string
}

// State
const item_type = ref<string>('')
const quantity = ref<number>(0)
const supplies = ref<Supply[]>([])
const units = ref<Unit[]>([])
const categories = ref<Category[]>([])
const brands = ref<Brand[]>([])
const models = ref<Model[]>([])

const selectedSupply = ref<number | undefined>(undefined)
const selectedUnit = ref<number | undefined>(undefined)
const selectedCategory = ref<number | undefined>(undefined)
const selectedBrand = ref<number | undefined>(undefined)
const selectedModel = ref<number | undefined>(undefined)

const filterStatus = ref<number>(0)
const unitCost = ref<number>(0)
const additional_description = ref<string>('')
const remarks = ref<string>('')

// Computed
const filteredSupplies = computed(() => {
  const filtered = supplies.value.filter(s => s.isActive === filterStatus.value)
  if (!filtered.find(s => s.SuppliesID === selectedSupply.value)) {
    selectedSupply.value = undefined
  }
  return filtered
})

const selectedSupplyStockNo = computed(() => {
  const supply = supplies.value.find(s => s.SuppliesID === selectedSupply.value)
  return supply ? supply.StockNo : ''
})

const total_amountAmount = computed(() => (unitCost.value || 0) * (quantity.value || 0))

// Fetch data
onMounted(async () => {
  try {
    const [suppliesRes, unitsRes, categoriesRes, brandsRes, modelsRes] = await Promise.all([
      axios.get('http://localhost:8000/api/supplies'),
      axios.get('http://localhost:8000/api/units'),
      axios.get('http://localhost:8000/api/categories'),
      axios.get('http://localhost:8000/api/brands'),
      axios.get('http://localhost:8000/api/models')
    ])

    supplies.value = Array.isArray(suppliesRes.data)
      ? suppliesRes.data.map(s => ({
          ...s,
          isActive: Number(s.isActive),
          UnitID: Number(s.UnitID),
          CategoryID: Number(s.CategoryID),
          UnitValue: Number(s.UnitValue ?? 0)
        }))
      : []

    units.value = Array.isArray(unitsRes.data) ? unitsRes.data : []
    categories.value = Array.isArray(categoriesRes.data) ? categoriesRes.data : []
    brands.value = Array.isArray(brandsRes.data) ? brandsRes.data : []
    models.value = Array.isArray(modelsRes.data) ? modelsRes.data : []
  } catch (error) {
    console.error('Error fetching data:', error)
  }
})

// Watch
watch(selectedSupply, (newVal) => {
  if (!newVal) {
    selectedUnit.value = undefined
    selectedCategory.value = undefined
    unitCost.value = 0
    return
  }
  const supply = supplies.value.find(s => s.SuppliesID === newVal)
  if (supply) {
    selectedUnit.value = supply.UnitID || undefined
    selectedCategory.value = supply.CategoryID || undefined
    unitCost.value = supply.UnitValue || 0
  }
})

// Props & emits
const props = defineProps<{ items: any[] }>()
const emit = defineEmits(['update:items'])

// Add Item
function addItem() {
  const supply = supplies.value.find(s => s.SuppliesID === selectedSupply.value)

  const newItem = {
    supply: selectedSupply.value,
    item_type: item_type.value,
    stock_number: supply?.StockNo || '',
    unit: selectedUnit.value,
    category: selectedCategory.value,
    brand: selectedBrand.value,
    model: selectedModel.value,
    additional_description: additional_description.value,
    remarks: remarks.value,
    quantity: quantity.value,
    unit_value: unitCost.value,
    total_amount: total_amountAmount.value
  }

  console.log('🆕 Adding item:', newItem)
  emit('update:items', [...props.items, newItem])

  // Reset fields
  item_type.value = ''
  selectedSupply.value = undefined
  selectedUnit.value = undefined
  selectedCategory.value = undefined
  selectedBrand.value = undefined
  selectedModel.value = undefined
  unitCost.value = 0
  quantity.value = 0
  additional_description.value = ''
  remarks.value = ''
  filterStatus.value = 0
}
</script>

<template>
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0 translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-2"
  >
    <div>
      <h3 class="text-xl font-bold mb-4">Items Details</h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <!-- Item Type -->
        <div>
          <Label class="block text-sm font-medium text-gray-700">Item Type</Label>
          <SelectSearch
            v-model="item_type"
            :options="[
              { label: 'PPE', value: 'PPE' },
              { label: 'Semi-expandable', value: 'Semi-expandable' },
              { label: 'Supplies (Consumable)', value: 'Supplies (Consumable)' },
              { label: 'Semi-expandable Supplies (Non-Consumable)', value: 'Semi-expandable Supplies (Non-Consumable)' }
            ]"
            placeholder="Select Item Type"
            class="mt-1 w-full h-11"
          />
        </div>

        <!-- Supplies Section -->
<div>
  <div class="flex items-center justify-start space-x-4 mb-2">
    <Label class="text-sm font-medium">Supplies</Label>
    <label class="inline-flex items-center space-x-1">
      <input type="radio" :value="0" v-model.number="filterStatus" class="form-radio text-blue-600" />
      <span class="text-sm">Active Only</span>
    </label>
    <label class="inline-flex items-center space-x-1">
      <input type="radio" :value="1" v-model.number="filterStatus" class="form-radio text-blue-600" />
      <span class="text-sm">Inactive Only</span>
    </label>
  </div>

  <!-- Supplies Dropdown -->
  <SelectSearch
    v-model="selectedSupply"
    :options="filteredSupplies.map(s => ({ label: s.Supplies_Desc, value: s.SuppliesID }))"
    placeholder="Select Supply"
    class="w-full h-11"
  />
</div>


        <!-- Stock Number -->
        <div>
          <Label class="block text-sm font-medium">Stock Number</Label>
          <Input
            type="text"
            placeholder="Enter Stock Number"
            readonly
            :value="selectedSupplyStockNo"
            class="mt-1 p-2 bg-gray-100 rounded-sm w-full h-9 border-gray-300 text-sm"
          />
        </div>

        <!-- Unit -->
        <div>
          <Label class="block text-sm font-medium">Unit</Label>
          <SelectSearch
            v-model="selectedUnit"
            :options="units.map(unit => ({ label: unit.Unit_Type, value: unit.Unit_Id }))"
            placeholder="Select Unit"
            class="mt-1 w-full h-11"
          />
        </div>

        <!-- Category -->
        <div>
          <Label class="block text-sm font-medium">Category</Label>
          <SelectSearch
            v-model="selectedCategory"
            :options="categories.map(cat => ({ label: cat.category_desc, value: cat.category_id }))"
            placeholder="Select Category"
            class="mt-1 w-full h-11"
          />
        </div>

        <!-- Unit Cost -->
        <div>
          <Label for="unit_value" class="block text-sm font-medium">Unit Cost</Label>
          <input
            type="number"
            id="unit_value"
            name="unit_value"
            v-model.number="unitCost"
            class="mt-1 p-2 bg-gray-100 rounded-sm dark:bg-gray-800 dark:text-white w-full h-9 border-gray-300 text-sm"
          />
        </div>

        <!-- Quantity -->
        <div>
          <Label class="block text-sm font-medium text-gray-700">Quantity</Label>
          <Input
            v-model.number="quantity"
            type="number"
            placeholder="Enter Quantity"
            class="mt-1 block w-full border rounded-lg px-3 py-2"
          />
        </div>

        <!-- Total Amount -->
        <div>
          <Label>Total Amount</Label>
          <Input
            type="number"
            readonly
            :value="total_amountAmount"
            class="mt-1 p-2 bg-gray-100 rounded-sm dark:bg-gray-800 dark:text-white w-full h-9 border-gray-300 text-sm"
          />
        </div>

        <!-- Brand -->
        <div>
          <Label class="block text-sm font-medium">Brand</Label>
          <SelectSearch
            v-model="selectedBrand"
            :options="brands.map(brand => ({ label: brand.Brand_Description, value: brand.Brand_Id }))"
            placeholder="Select Brand"
            class="mt-1 w-full h-11"
          />
        </div>

        <!-- Model -->
        <div>
          <Label class="block text-sm font-medium">Model</Label>
          <SelectSearch
            v-model="selectedModel"
            :options="models.map(model => ({ label: model.model_desc, value: model.model_id }))"
            placeholder="Select Model"
            class="mt-1 w-full h-11"
          />
        </div>
      </div>

      <!-- Additional Description & Remarks -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <Label class="block text-sm font-medium">Additional Description</Label>
          <TextArea
            v-model="additional_description"
            placeholder="Additional Description"
            :rows="3"
            class="mt-1 w-full border border-gray-300 rounded-lg bg-gray-50 shadow-sm focus:ring-1 focus:ring-blue-400 focus:border-blue-500 text-sm text-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>

        <div>
          <Label class="block text-sm font-medium">Remarks</Label>
          <TextArea
            v-model="remarks"
            placeholder="Remarks"
            :rows="3"
            class="mt-1 w-full border border-gray-300 rounded-lg bg-gray-50 shadow-sm focus:ring-1 focus:ring-blue-400 focus:border-blue-500 text-sm text-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>

        <div class="mt-4 flex justify-end md:col-span-2">
          <button
            type="button"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            @click="addItem"
          >
            ➕ Add Item
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>
