<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue'
import Input from '@/components/ui/input/Input.vue'
import TextArea from '@/components/ui/textarea/TextArea.vue'
import SelectSearch from '@/components/ui/select/SelectSearch.vue'
import { Label } from 'reka-ui'
import EditButton from '@/components/ui/button/EditButton.vue'
import DeleteButton from '@/components/ui/button/DeleteButton.vue'

interface ItemType {
  itemtype_id: number
  itemtype_name: string
}

// Props
const props = defineProps<{
  items: any[]
  supplies?: any[]
  units?: any[]
  categories?: any[]
  brands?: any[]
  models?: any[]
  itemTypes?: ItemType[]
}>()

const emit = defineEmits(['update:items', 'update:poAmount'])



// Modal state
const isModalOpen = ref(false)
const modalMode = ref<'add' | 'edit'>('add')
const editingItemIndex = ref<number | null>(null)

// Reactive editing item
const editingItem = reactive<any>({
  supply: null,
  item_type: null,
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

// Local reactive items array
const localItems = ref([...props.items])

// Options
const suppliesOptions = computed(
  () => props.supplies?.map((s) => ({ label: s.Supplies_Desc, value: s.SuppliesID })) || [],
)
const unitsOptions = computed(
  () => props.units?.map((u) => ({ label: u.Unit_Type, value: u.Unit_Id })) || [],
)
const categoriesOptions = computed(
  () => props.categories?.map((c) => ({ label: c.category_desc, value: c.category_id })) || [],
)
const brandsOptions = computed(
  () => props.brands?.map((b) => ({ label: b.Brand_Description, value: b.Brand_Id })) || [],
)
const modelsOptions = computed(
  () => props.models?.map((m) => ({ label: m.model_desc, value: m.model_id })) || [],
)
const itemTypeOptions = computed(
  () => props.itemTypes?.map((t) => ({ label: t.itemtype_name, value: t.itemtype_id })) || [],
)

// Computed grand total
const grandTotal = computed(() =>
  localItems.value
    .reduce((sum, item) => sum + (item.quantity || 0) * (item.unit_value || 0), 0)
    .toFixed(2),
)

// Computed total for editing modal
const editingItemTotal = computed(() => {
  const total = (editingItem.quantity || 0) * (editingItem.unit_value || 0)
  editingItem.total_amount = total
  return total.toFixed(2)
})

const errorMessage = ref('') // <-- add this for modal errors

// Add item
function addItem() {
  modalMode.value = 'add'
  Object.assign(editingItem, {
    supply: null,
    item_type: props.itemTypes?.[0]?.itemtype_id ?? null,
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
  isModalOpen.value = true
}

// Edit item
function editItem(index: number) {
  modalMode.value = 'edit'
  editingItemIndex.value = index
  const item = localItems.value[index]
  Object.assign(editingItem, { ...item })
  editingItem.item_type = Number(item.item_type) || null
  isModalOpen.value = true
}

// Save modal edits
function saveItem() {
  const normalizedItem = { ...editingItem, item_type: Number(editingItem.item_type) }

  // ❌ Duplicate check (only for add mode)
  if (modalMode.value === 'add') {
    const duplicate = localItems.value.find((item) => item.supply === normalizedItem.supply)
    if (duplicate) {
      errorMessage.value = `The supply "${duplicate.stock_number}" is already added.`
      return // stop saving
    }
  }

  if (modalMode.value === 'edit' && editingItemIndex.value !== null) {
    localItems.value[editingItemIndex.value] = normalizedItem
  } else {
    localItems.value.push(normalizedItem)
  }

  emit('update:items', localItems.value)
  isModalOpen.value = false
  errorMessage.value = '' // clear error
}

// Remove item
function removeItem(index: number) {
  localItems.value.splice(index, 1)
  emit('update:items', localItems.value)
}

// Auto-fill when supply changes
watch(
  () => editingItem.supply,
  (supplyId) => {
    const supply = props.supplies?.find((s) => s.SuppliesID === supplyId)
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
  },
)

// Sync props.items -> localItems
watch(
  () => props.items,
  (newVal) => {
    localItems.value = [...newVal]
  },
)

// Helper to get item type name
function getItemTypeName(id: number) {
  const match = props.itemTypes?.find((t) => Number(t.itemtype_id) === Number(id))
  return match ? match.itemtype_name : 'N/A'
}
watch(grandTotal, (val) => {
  emit('update:poAmount', Number(val)) // parent gets latest grand total
})

</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold">Review Delivery Items</h2>
      <button
        @click="addItem"
        type="button"
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        + Add Item
      </button>
    </div>

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
          <tr v-for="(item, index) in localItems" :key="index" class="border-t hover:bg-gray-50">
            <td class="px-3 py-2">
              <EditButton @click="editItem(index)" size="sm" tooltip="Edit" class="mr-2" />
              <DeleteButton @click="removeItem(index)" size="sm" tooltip="Delete" />
            </td>

            <td>
              {{
                props.supplies?.find((s) => s.SuppliesID === item.supply)?.Supplies_Desc || 'N/A'
              }}
            </td>
            <td>{{ getItemTypeName(item.item_type) }}</td>
            <td>{{ item.stock_number }}</td>
            <td>{{ props.units?.find((u) => u.Unit_Id === item.unit)?.Unit_Type || 'N/A' }}</td>
            <td>
              {{
                props.categories?.find((c) => c.category_id === item.category)?.category_desc ||
                'N/A'
              }}
            </td>
            <td>
              {{ props.brands?.find((b) => b.Brand_Id === item.brand)?.Brand_Description || 'N/A' }}
            </td>
            <td>{{ props.models?.find((m) => m.model_id === item.model)?.model_desc || 'N/A' }}</td>
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

    <!-- Add/Edit Modal -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/10"
    >
      <div class="bg-white rounded-lg shadow-lg w-11/12 md:w-2/3 p-6 relative">
        <h3 class="text-lg font-bold mb-4">
          {{ modalMode === 'edit' ? 'Edit Item' : 'Add Item' }}
        </h3>
        <div v-if="errorMessage" class="mb-2 text-red-600 font-medium">
          {{ errorMessage }}
        </div>
        <form class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Supplies</Label>
            <SelectSearch
              v-model="editingItem.supply"
              :options="suppliesOptions"
              placeholder="Select Supplies"
            />
          </div>

          <div>
            <Label>Item Type</Label>
            <SelectSearch
              v-model="editingItem.item_type"
              :options="itemTypeOptions"
              placeholder="Select Item Type"
            />
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
            <TextArea v-model="editingItem.additional_description" :rows="2" />
          </div>

          <div class="md:col-span-2">
            <Label>Remarks</Label>
            <TextArea v-model="editingItem.remarks" :rows="2" />
          </div>
        </form>

        <div class="flex justify-end gap-2 mt-4">
          <button @click="isModalOpen = false" type="button" class="px-4 py-2 bg-gray-200 rounded">
            Cancel
          </button>
          <button @click="saveItem" type="button" class="px-4 py-2 bg-green-600 text-white rounded">
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
