<script setup lang="ts">
import { ref, watch } from 'vue'
import SelectSearch from '@/components/ui/select/SelectSearch.vue'
import TextArea from '@/components/ui/textarea/TextArea.vue'
import Input from '@/components/ui/input/Input.vue'
import { Label } from 'reka-ui'

// --------------------
// Interfaces
// --------------------
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

interface Item {
  supply_id: number
  supply_name: string
  stock_number: string
  unit_id?: number
  unit_name?: string
  quantity_requested: number
  quantity_issued?: number | null
  description: string
  remarks: string
  image_url?: string
}

// --------------------
// Props & Emits
// --------------------
const props = defineProps<{
  modelValue?: Item[]
  supplies?: Supply[]
  units?: Unit[]
}>()

const emit = defineEmits(['update:items'])

// --------------------
// Reactive State
// --------------------
const items = ref<Item[]>([...(props.modelValue ?? [])])
const selectedSupply = ref<number | undefined>()
const selectedUnit = ref<number | undefined>()
const quantity = ref<number>(0)
const additional_description = ref<string>('')
const remarks = ref<string>('')
const errorMessage = ref<string>('')
const previewSupply = ref<Supply | null>(null)
const editingIndex = ref<number | null>(null)

// --------------------
// Watchers
// --------------------
watch(items, val => emit('update:items', val), { deep: true })

watch(() => props.modelValue, val => {
  items.value = [...(val ?? [])]
}, { deep: true })

watch(selectedSupply, val => {
  if (!val) {
    selectedUnit.value = undefined
    previewSupply.value = null
    return
  }
  const supply = props.supplies?.find(s => s.SuppliesID === val)
  if (supply) {
    selectedUnit.value = supply.UnitID || undefined
    previewSupply.value = supply
  }
})

// --------------------
// Methods
// --------------------
function addItem() {
  if (!selectedSupply.value) {
    errorMessage.value = 'Please select a supply.'
    return
  }
  if (!quantity.value || quantity.value <= 0) {
    errorMessage.value = 'Please enter a valid quantity.'
    return
  }

  const supply = props.supplies?.find(s => s.SuppliesID === selectedSupply.value)
  const unitName = props.units?.find(u => u.Unit_Id === selectedUnit.value)?.Unit_Type ?? ''

  const newItem: Item = {
    supply_id: selectedSupply.value!,
    supply_name: supply?.Supplies_Desc ?? '',
    stock_number: supply?.StockNo ?? '',
    unit_id: selectedUnit.value,
    unit_name: unitName,
    quantity_requested: quantity.value,
    quantity_issued: null, // default when creating RIS
    description: additional_description.value,
    remarks: remarks.value,
    image_url: supply?.Image_Url ?? ''
  }

  if (editingIndex.value !== null) {
    // Update existing item
    items.value[editingIndex.value] = newItem
    editingIndex.value = null
  } else {
    // Add new item
    const duplicate = items.value.find(i => i.supply_id === selectedSupply.value)
    if (duplicate) {
      errorMessage.value = `The supply "${duplicate.supply_name}" is already added.`
      return
    }
    items.value.push(newItem)
  }

  emit('update:items', items.value)

  resetForm()
}

function editItem(index: number) {
  const item = items.value[index]
  selectedSupply.value = item.supply_id
  selectedUnit.value = item.unit_id
  quantity.value = item.quantity_requested
  additional_description.value = item.description
  remarks.value = item.remarks
  previewSupply.value = props.supplies?.find(s => s.SuppliesID === item.supply_id) ?? null
  editingIndex.value = index
}

function removeItem(index: number) {
  if (confirm('Are you sure you want to remove this item?')) {
    items.value.splice(index, 1)
    emit('update:items', items.value)
    if (editingIndex.value === index) {
      resetForm()
    }
  }
}

function resetForm() {
  selectedSupply.value = undefined
  selectedUnit.value = undefined
  quantity.value = 0
  additional_description.value = ''
  remarks.value = ''
  previewSupply.value = null
  errorMessage.value = ''
  editingIndex.value = null
}
</script>

<template>
  <div class="space-y-6">
    <h3 class="text-xl font-bold">Items Details</h3>

    <div v-if="errorMessage" class="text-red-600 font-medium">{{ errorMessage }}</div>

    <!-- Add/Edit Item Form + Image -->
    <div class="flex flex-col md:flex-row gap-4 w-full">
      <div class="flex-1 bg-white p-4 rounded shadow-sm space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          <div>
            <Label>Supplies</Label>
            <SelectSearch
              v-model="selectedSupply"
              :options="props.supplies?.map(s => ({ label: `${s.Supplies_Desc} / ${s.StockNo}`, value: s.SuppliesID })) ?? []"
              placeholder="Select Supply"
              class="mt-1 w-full h-11"
            />
          </div>
          <div>
            <Label>Unit</Label>
            <SelectSearch
              v-model="selectedUnit"
              :options="props.units?.map(u => ({ label: u.Unit_Type, value: u.Unit_Id })) ?? []"
              placeholder="Select Unit"
              class="mt-1 w-full h-11"
            />
          </div>
          <div>
            <Label>Quantity</Label>
            <Input v-model.number="quantity" type="number" placeholder="Enter Quantity" class="mt-1 w-full border rounded-lg px-3 py-2" />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <div>
            <Label>Additional Description</Label>
            <TextArea v-model="additional_description" placeholder="Additional Description" :rows="2" class="mt-1 w-full border border-gray-300 rounded-lg" />
          </div>
          <div>
            <Label>Remarks</Label>
            <TextArea v-model="remarks" placeholder="Remarks" :rows="2" class="mt-1 w-full border border-gray-300 rounded-lg" />
          </div>
        </div>

        <div class="flex justify-start">
          <button type="button" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" @click="addItem">
            {{ editingIndex !== null ? 'Update Item' : '➕ Add Item' }}
          </button>
        </div>
      </div>

      <!-- Image Preview -->
      <div class="w-48 md:w-64 flex-shrink-0 flex items-start">
        <div class="w-full h-[184px] border-2 border-gray-300 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50">
          <img v-if="previewSupply?.Image_Url" :src="previewSupply.Image_Url" alt="Supply Image" class="object-cover w-full h-full" />
          <span v-else class="text-gray-400 text-xs text-center px-2">No uploaded image</span>
        </div>
      </div>
    </div>

    <!-- Review Table -->
    <div class="pt-4 border-t-2 border-gray-300">
      <h2 class="text-lg font-semibold mb-2">Review Items</h2>
      <div class="overflow-auto border rounded-lg shadow-sm">
        <table class="min-w-full text-sm text-left table-auto">
          <thead class="bg-gray-100 text-xs uppercase">
            <tr>
              <th>Action</th>
              <th>Image</th>
              <th>Supplies</th>
              <th>Stock No.</th>
              <th>Unit</th>
              <th>Qty</th>
              <th>Additional Description</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in items" :key="index" class="border-t hover:bg-gray-50">
              <td class="flex gap-2">
                <button type="button" class="text-blue-600 hover:underline" @click="editItem(index)">Edit</button>
                <button type="button" class="text-red-600 hover:underline" @click="removeItem(index)">Remove</button>
              </td>
              <td>
                <div class="w-16 h-16 border border-gray-300 rounded flex items-center justify-center overflow-hidden bg-gray-50">
                  <img v-if="item.image_url" :src="item.image_url" alt="Item Image" class="object-cover w-full h-full" />
                  <span v-else class="text-gray-400 text-xs text-center">No uploaded image</span>
                </div>
              </td>
              <td>{{ item.supply_name }}</td>
              <td>{{ item.stock_number }}</td>
              <td>{{ item.unit_name }}</td>
              <td>{{ item.quantity_requested }}</td>
              <td>{{ item.description }}</td>
              <td>{{ item.remarks }}</td>
            </tr>
          </tbody>
          <tfoot class="bg-gray-100 font-semibold">
            <tr>
              <td colspan="5" class="py-2 text-right">Total Quantity:</td>
              <td colspan="3" class="py-2">{{ items.reduce((total, item) => total + item.quantity_requested, 0) }}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</template>
