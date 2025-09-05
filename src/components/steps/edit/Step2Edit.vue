<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue'
import Input from '@/components/ui/input/Input.vue'
import TextArea from '@/components/ui/textarea/TextArea.vue'
import SelectSearch from '@/components/ui/select/SelectSearch.vue'
import ActionButtons from '@/components/ui/button/ActionButtons.vue'
import { Label } from 'reka-ui'

// Props
const props = defineProps<{
  items: any[]
  supplies?: any[]
  units?: any[]
  categories?: any[]
  brands?: any[]
  models?: any[]
}>()

const emit = defineEmits(['update:items'])

// Modal state
const isEditModalOpen = ref(false)
const editingItemIndex = ref<number | null>(null)
const editingItem = reactive<any>({
  supply: null,
  item_type: '', // use string to match saved data
  stock_number: '',
  unit: null,
  category: null,
  quantity: 0,
  unit_value: 0,
  total_amount: 0, // store as number
  brand: null,
  model: null,
  additional_description: '',
  remarks: '',
})

// Options
const suppliesOptions = computed(() =>
  props.supplies?.map(s => ({ label: s.Supplies_Desc, value: s.SuppliesID })) || []
)
const unitsOptions = computed(() =>
  props.units?.map(u => ({ label: u.Unit_Type, value: u.Unit_Id })) || []
)
const categoriesOptions = computed(() =>
  props.categories?.map(c => ({ label: c.category_desc, value: c.category_id })) || []
)
const brandsOptions = computed(() =>
  props.brands?.map(b => ({ label: b.Brand_Description, value: b.Brand_Id })) || []
)
const modelsOptions = computed(() =>
  props.models?.map(m => ({ label: m.model_desc, value: m.model_id })) || []
)

const itemTypeOptions = [
  { label: 'PPE', value: 'PPE' },
  { label: 'Semi-expandable', value: 'Semi-expandable' },
  { label: 'Supplies (Consumable)', value: 'Supplies (Consumable)' },
  { label: 'Semi-expandable Supplies (Non-Consumable)', value: 'Semi-expandable Supplies (Non-Consumable)' },
]

// Computed grand total
const grandTotal = computed(() =>
  props.items
    .reduce((sum, item) => sum + (item.quantity || 0) * (item.unit_value || 0), 0)
    .toFixed(2)
)

// Computed total for editing modal
const editingItemTotal = computed(() => {
  const total = (editingItem.quantity || 0) * (editingItem.unit_value || 0)
  editingItem.total_amount = total // assign as number
  return total.toFixed(2)
})

// Open modal
function editItem(index: number) {
  editingItemIndex.value = index
  const item = props.items[index]
  Object.assign(editingItem, { ...item })

  // Ensure item_type is valid string for SelectSearch
  const validOption = itemTypeOptions.find(opt => opt.value === item.item_type)
  editingItem.item_type = validOption ? validOption.value : 'Supplies (Consumable)'

  isEditModalOpen.value = true
}

// Save modal edits
function saveItem() {
  if (editingItemIndex.value !== null) {
    editingItem.total_amount = Number(editingItemTotal.value)
    const updatedItems = [...props.items]
    updatedItems[editingItemIndex.value] = { ...editingItem }
    emit('update:items', updatedItems)
    isEditModalOpen.value = false
  }
}

// Remove item
function removeItem(index: number) {
  const updatedItems = [...props.items]
  updatedItems.splice(index, 1)
  emit('update:items', updatedItems)
}

// Auto-fill when supply changes
watch(() => editingItem.supply, (supplyId) => {
  const supply = props.supplies?.find(s => s.SuppliesID === supplyId)
  if (supply) {
    editingItem.stock_number = supply.StockNo
    editingItem.unit = supply.UnitID
    editingItem.category = supply.CategoryID
    editingItem.unit_value = supply.UnitValue
  } else {
    editingItem.stock_number = ''
    editingItem.unit = null
    editingItem.category = null
    editingItem.unit_value = 0
  }
})

// Reset modal on close
watch(isEditModalOpen, (val) => {
  if (!val) {
    Object.assign(editingItem, {
      supply: null,
      item_type: 3,
      stock_number: '',
      unit: null,
      category: null,
      quantity: 0,
      unit_value: 0,
      total_amount: 0,
      brand: null,
      model: null,
      additional_description: '',
      remarks: '',
    })
    editingItemIndex.value = null
  }
})
</script>

<template>
  <div>
    <h2 class="text-xl font-bold mb-4">Review Delivery Items</h2>

    <div class="overflow-auto border rounded-lg shadow-sm">
      <table class="min-w-full text-sm text-left table-auto">
        <thead class="bg-gray-100 text-xs uppercase">
          <tr>
            <th class="px-3 py-2">Actions</th>
            <th class="px-3 py-2">Supplies</th>
            <th class="px-3 py-2">Item Type</th>
            <th class="px-3 py-2">Stock No.</th>
            <th class="px-3 py-2">Unit</th>
            <th class="px-3 py-2">Category</th>
            <th class="px-3 py-2">Brand</th>
            <th class="px-3 py-2">Model</th>
            <th class="px-3 py-2">Qty</th>
            <th class="px-3 py-2">Unit Cost</th>
            <th class="px-3 py-2">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in items" :key="index" class="border-t hover:bg-gray-50">
            <td class="px-3 py-2">
              <ActionButtons @edit="editItem(index)" @delete="removeItem(index)" />
            </td>
            <td>{{ props.supplies?.find(s => s.SuppliesID === item.supply)?.Supplies_Desc || 'N/A' }}</td>
            <td>{{ itemTypeOptions.find(t => t.value === item.item_type)?.label || 'N/A' }}</td>
            <td>{{ item.stock_number }}</td>
            <td>{{ props.units?.find(u => u.Unit_Id === item.unit)?.Unit_Type || 'N/A' }}</td>
            <td>{{ props.categories?.find(c => c.category_id === item.category)?.category_desc || 'N/A' }}</td>
            <td>{{ props.brands?.find(b => b.Brand_Id === item.brand)?.Brand_Description || 'N/A' }}</td>
            <td>{{ props.models?.find(m => m.model_id === item.model)?.model_desc || 'N/A' }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ item.unit_value }}</td>
            <td>{{ (item.quantity * item.unit_value).toFixed(2) }}</td>
          </tr>
        </tbody>
        <tfoot class="bg-gray-100 font-semibold">
          <tr>
            <td colspan="10" class="py-2 text-right">Grand Total:</td>
            <td class="py-2">{{ grandTotal }}</td>
          </tr>
        </tfoot>
      </table>
    </div>

    <!-- Edit Modal -->
    <div v-if="isEditModalOpen" class="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/10">
      <div class="bg-white rounded-lg shadow-lg w-11/12 md:w-2/3 p-6 relative">
        <h3 class="text-lg font-bold mb-4">Edit Item</h3>

        <form class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Supplies</Label>
            <SelectSearch v-model="editingItem.supply" :options="suppliesOptions" placeholder="Select Supplies" />
          </div>

          <div>
            <Label>Item Type</Label>
            <SelectSearch v-model="editingItem.item_type" :options="itemTypeOptions" placeholder="Select Item Type" />
          </div>

          <div>
            <Label>Stock Number</Label>
            <Input v-model="editingItem.stock_number" readonly />
          </div>

          <div>
            <Label>Unit</Label>
            <SelectSearch v-model="editingItem.unit" :options="unitsOptions" />
          </div>

          <div>
            <Label>Category</Label>
            <SelectSearch v-model="editingItem.category" :options="categoriesOptions" />
          </div>

          <div>
            <Label>Brand</Label>
            <SelectSearch v-model="editingItem.brand" :options="brandsOptions" />
          </div>

          <div>
            <Label>Model</Label>
            <SelectSearch v-model="editingItem.model" :options="modelsOptions" />
          </div>

          <div>
            <Label>Quantity</Label>
            <Input type="number" v-model.number="editingItem.quantity" />
          </div>

          <div>
            <Label>Unit Cost</Label>
            <Input type="number" v-model.number="editingItem.unit_value" />
          </div>

          <div>
            <Label>Total Amount</Label>
            <Input :value="editingItemTotal" readonly />
          </div>

          <div class="md:col-span-2">
            <Label>Additional Description</Label>
            <TextArea v-model="editingItem.additional_description" rows="2" />
          </div>

          <div class="md:col-span-2">
            <Label>Remarks</Label>
            <TextArea v-model="editingItem.remarks" rows="2" />
          </div>
        </form>

        <div class="flex justify-end gap-2 mt-4">
          <button @click="isEditModalOpen = false" type="button" class="px-4 py-2 bg-gray-200 rounded">Cancel</button>
          <button @click="saveItem" type="button" class="px-4 py-2 bg-green-600 text-white rounded">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>
