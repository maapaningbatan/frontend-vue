<!-- Step 3 Items -->
<script setup lang="ts">
import { computed, watch } from 'vue'

interface Supply {
  SuppliesID: number
  Supplies_Desc: string
}
interface Unit {
  Unit_Id: number
  Unit_Type: string
}
interface Category {
  category_id: number
  category_desc: string
}
interface Brand {
  Brand_Id: number
  Brand_Description: string
}
interface Model {
  model_id: number
  model_desc: string
}

// ✅ Merge all props in one defineProps call
const props = defineProps<{
  items: any[]
  deliveryData: Record<string, any>
  supplies: Supply[]
  units: Unit[]
  categories: Category[]
  brands: Brand[]
  models: Model[]
}>()

const emit = defineEmits(['update:items'])

// Computed property for grand total
const grandTotal = computed(() => {
  return props.items
    .reduce((total, item) => total + item.quantity * item.unit_value, 0)
    .toFixed(2)
})

// Sync grand total into deliveryData
watch(grandTotal, (newVal) => {
  props.deliveryData.po_amount = newVal
})


function removeItem(index: number) {
  if (confirm('Are you sure you want to remove this item?')) {
    const updatedItems = [...props.items]
    updatedItems.splice(index, 1)
    emit('update:items', updatedItems)
  }
}

// Methods to get names from IDs
function getSupplyName(id: number) {
  const s = props.supplies?.find(x => x.SuppliesID === id)
  return s ? s.Supplies_Desc : id
}
function getUnitName(id: number) {
  const u = props.units?.find(x => x.Unit_Id === id)
  return u ? u.Unit_Type : id
}
function getCategoryName(id: number) {
  const c = props.categories?.find(x => x.category_id === id)
  return c ? c.category_desc : id
}
function getBrandName(id: number) {
  const b = props.brands?.find(x => x.Brand_Id === id)
  return b ? b.Brand_Description : id
}
function getModelName(id: number) {
  const m = props.models?.find(x => x.model_id === id)
  return m ? m.model_desc : id
}
</script>


<template>
  <Transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 translate-y-2"
    enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-2">
    <div>
      <h2 class="text-xl font-bold mb-4">Review Delivery Items</h2>
      <div class="overflow-auto border rounded-lg shadow-sm">
        <table class="min-w-full text-sm text-left table-auto">
          <thead class="bg-gray-100 text-xs uppercase">
            <tr>
              <th class="px-3 py-2">Action</th>
              <th class="px-3 py-2">Supplies</th>
              <th class="px-3 py-2">Item Type</th>
              <th class="px-3 py-2">Stock No.</th>
              <th class="px-3 py-2">Unit</th>
              <th class="px-3 py-2">Category</th>
              <th class="px-3 py-2">Brand</th>
              <th class="px-3 py-2">Model</th>
              <th class="px-3 py-2">Additional Description</th>
              <th class="px-3 py-2">Qty</th>
              <th class="px-3 py-2">Unit Cost</th>
              <th class="px-3 py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in items" :key="index" class="border-t hover:bg-gray-50">
              <td class="px-3 py-2">
                <button type="button" class="text-red-600 hover:underline" @click="removeItem(index)">
                  Remove
                </button>
              </td>
              <td>{{ getSupplyName(item.supply) }}</td>
              <td class="px-3 py-2">{{ item.item_type }}</td>
              <td class="px-3 py-2">{{ item.stock_number }}</td>
              <td class="px-3 py-2">{{ getUnitName(item.unit) }}</td>
              <td class="px-3 py-2">{{ getCategoryName(item.category) }}</td>
              <td class="px-3 py-2">{{ getBrandName(item.brand) }}</td>
              <td class="px-3 py-2">{{ getModelName(item.model) }}</td>
              <td class="px-3 py-2">{{ item.additional_description }}</td>
              <td class="px-3 py-2">{{ item.quantity }}</td>
              <td class="px-3 py-2">{{ item.unit_value }}</td>
              <td class="px-3 py-2">{{ (item.quantity * item.unit_value).toFixed(2) }}</td>
            </tr>
          </tbody>
          <tfoot class="bg-gray-100 font-semibold">
            <tr>
              <td colspan="11" class="py-2 text-right">Grand Total:</td>
              <td class="py-2">{{ grandTotal }}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </Transition>
</template>
