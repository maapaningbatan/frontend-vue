<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import TextArea from '@/components/ui/textarea/TextArea.vue'
import Input from '@/components/ui/input/Input.vue'
import SelectSearch from '@/components/ui/select/SelectSearch.vue'
import DatePicker from '@/components/ui/datepicker/DatePicker.vue'
import { Label } from 'reka-ui'
import AppLayout from '@/components/layouts/AppLayout.vue'
import { type BreadcrumbItem } from '@/types/api'

// Interfaces
interface User {
  Employee_PK: number
  First_Name: string
  Middle_Name?: string
  Last_Name: string
}

interface DeliveryItem {
  id?: number
  supply: number | string
  item_type: string
  stock_number: string
  unit: number | string
  category: number | string
  quantity: number
  unit_value: number
  total_amount: number
  brand: number | string
  model: number | string
  additional_description?: string
  remarks?: string
}

interface DeliveryData {
  iar_number: string
  supplier: number | string
  purchase_order_number: string
  purchase_date?: string
  pr_number: string
  pr_date?: string
  receiving_office: string
  warehouse: number | string
  code_number: string
  purpose: string
  items: DeliveryItem[]
  invoice_no?: string
  invoice_total_amount?: number
  po_date?: string
  po_amount?: number
  dr_no?: string
  dr_date?: string
  ris_no?: string
  ris_date?: string
  ors_no?: string
  ors_date?: string
  dv_no?: string
  dv_date?: string
}

// Router & route
const route = useRoute()
const router = useRouter()
const deliveryId = Number(route.params.id)

// Reactive state
const deliveryData = reactive<DeliveryData>({
  iar_number: '',
  supplier: '',
  purchase_order_number: '',
  purchase_date: undefined,
  pr_number: '',
  pr_date: undefined,
  receiving_office: '',
  warehouse: '',
  code_number: '',
  purpose: '',
  items: []
})

const suppliers = ref<any[]>([])
const warehouses = ref<any[]>([])
const units = ref<any[]>([])
const categories = ref<any[]>([])
const brands = ref<any[]>([])
const models = ref<any[]>([])
const user = ref<User | null>(null)

// Computed options
const suppliersOptions = computed(() =>
  suppliers.value.map(s => ({ label: s.Supplier_Name, value: s.Supplier_Id }))
)
const warehousesOptions = computed(() =>
  warehouses.value.map(w => ({ label: w.Warehouse_Description, value: w.Warehouse_ID }))
)

// Breadcrumbs
const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Delivery', href: '/delivery' },
  { title: 'Edit Delivery', href: `/delivery/${deliveryId}` }
]

// Computed properties
const grandTotal = computed(() =>
  deliveryData.items.reduce((total, item) => total + item.quantity * item.unit_value, 0).toFixed(2)
)


// Fetch data on mount
onMounted(async () => {
  try {
    const [supRes, whRes, codeRes, deliveryRes, userRes] = await Promise.all([
      axios.get('http://127.0.0.1:8000/api/suppliers'),
      axios.get('http://127.0.0.1:8000/api/warehouses'),
      axios.get('http://127.0.0.1:8000/api/delivery/next-code'),
      axios.get(`http://127.0.0.1:8000/api/delivery/${deliveryId}`),
      axios.get('http://127.0.0.1:8000/api/user', {
        headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` }
      })
    ])

    suppliers.value = supRes.data
    warehouses.value = whRes.data
    user.value = userRes.data

    deliveryData.code_number = String(codeRes.data.nextCode || '0000').padStart(4, '0')

    const delivery = deliveryRes.data

    deliveryData.iar_number = delivery.iar_number || ''
    deliveryData.supplier = delivery.supplier?.Supplier_Id ?? delivery.supplier ?? ''
    deliveryData.purchase_order_number = delivery.purchase_order_number || ''
    deliveryData.purchase_date = delivery.purchase_date ?? undefined
    deliveryData.pr_number = delivery.pr_number || ''
    deliveryData.pr_date = delivery.pr_date ?? undefined
    deliveryData.receiving_office = delivery.receiving_office || ''
    deliveryData.warehouse = delivery.warehouse?.Warehouse_ID ?? delivery.warehouse ?? ''
    deliveryData.purpose = delivery.purpose || ''
    deliveryData.items = delivery.items || []
    deliveryData.invoice_no = delivery.invoice_no ?? ''
    deliveryData.invoice_total_amount = delivery.invoice_total_amount ?? 0
    deliveryData.po_date = delivery.po_date ?? undefined
    deliveryData.po_amount = delivery.po_amount ?? 0
    deliveryData.dr_no = delivery.dr_no ?? ''
    deliveryData.dr_date = delivery.dr_date ?? undefined
    deliveryData.ris_no = delivery.ris_no ?? ''
    deliveryData.ris_date = delivery.ris_date ?? undefined
    deliveryData.ors_no = delivery.ors_no ?? ''
    deliveryData.ors_date = delivery.ors_date ?? undefined
    deliveryData.dv_no = delivery.dv_no ?? ''
    deliveryData.dv_date = delivery.dv_date ?? undefined
  } catch (err) {
    console.error('Failed to fetch data:', err)
  }
})

// Methods
function updateField<K extends keyof DeliveryData>(
  field: K,
  value: DeliveryData[K]
) {
  deliveryData[field] = value
}


function removeItem(index: number) {
  if (confirm('Are you sure you want to remove this item?')) {
    deliveryData.items.splice(index, 1)
  }
}

function getSupplyName(id: number | string) {
  const s = suppliers.value.find(x => x.Supplier_Id === id)
  return s ? s.Supplier_Name : id
}
function getUnitName(id: number | string) {
  const u = units.value.find(x => x.Unit_Id === id)
  return u ? u.Unit_Type : id
}
function getCategoryName(id: number | string) {
  const c = categories.value.find(x => x.category_id === id)
  return c ? c.category_desc : id
}
function getBrandName(id: number | string) {
  const b = brands.value.find(x => x.Brand_Id === id)
  return b ? b.Brand_Description : id
}
function getModelName(id: number | string) {
  const m = models.value.find(x => x.model_id === id)
  return m ? m.model_desc : id
}

async function updateDelivery() {
  try {
    await axios.patch(`http://127.0.0.1:8000/api/delivery/edit/${deliveryId}`, deliveryData, {
      headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` }
    })
    router.push('/delivery')
  } catch (err) {
    console.error('Failed to update delivery:', err)
  }
}
</script>


<template>
  <AppLayout :breadcrumbs="breadcrumbs">
    <Transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-2">
      <div class="relative flex flex-col h-full w-full p-6 gap-8">
        <!-- Title -->
        <h2 class="text-3xl font-extrabold mb-6 text-gray-900">Edit Delivery</h2>

        <!-- Form Section -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
          <!-- Left Column -->
          <div class="md:col-span-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <h3 class="text-2xl font-bold mb-4 md:col-span-3 text-gray-800">Edit Delivery</h3>

            <div>
              <Label>IAR Number</Label>
              <Input v-model="deliveryData.iar_number" placeholder="Enter IAR Number"
                class="mt-1 w-full h-11 rounded-md border-gray-300 shadow-sm focus:ring focus:ring-blue-200" />
            </div>

            <div>
              <Label>Supplier</Label>
              <SelectSearch v-model="deliveryData.supplier" :options="suppliersOptions" placeholder="Select Supplier"
                class="mt-1 w-full h-11 rounded-md border-gray-300 shadow-sm focus:ring focus:ring-blue-200" />
            </div>

            <div>
              <Label>Purchase Order Number</Label>
              <Input v-model="deliveryData.purchase_order_number" placeholder="Enter Purchase Order Number"
                class="mt-1 w-full h-11 rounded-md border-gray-300 shadow-sm focus:ring focus:ring-blue-200" />
            </div>

            <div>
              <Label>Purchase Date</Label>
              <DatePicker v-model="deliveryData.purchase_date" placeholder="Select Purchase Date"
                class="mt-1 w-full h-11 rounded-md border-gray-300 shadow-sm focus:ring focus:ring-blue-200" />
            </div>

            <div>
              <Label>PR Number</Label>
              <Input v-model="deliveryData.pr_number" placeholder="Enter PR Number"
                class="mt-1 w-full h-11 rounded-md border-gray-300 shadow-sm focus:ring focus:ring-blue-200" />
            </div>

            <div>
              <Label>PR Date</Label>
              <DatePicker v-model="deliveryData.pr_date" placeholder="Select PR Date"
                class="mt-1 w-full h-11 rounded-md border-gray-300 shadow-sm focus:ring focus:ring-blue-200" />
            </div>

            <div>
              <Label>Receiving Office</Label>
              <Input v-model="deliveryData.receiving_office" readonly
                class="mt-1 w-full h-11 bg-gray-100 rounded-md border-gray-300" />
            </div>

            <div>
              <Label>Warehouse</Label>
              <SelectSearch v-model="deliveryData.warehouse" :options="warehousesOptions" placeholder="Select Warehouse"
                class="mt-1 w-full h-11 rounded-md border-gray-300 shadow-sm focus:ring focus:ring-blue-200" />
            </div>

            <div>
              <Label>Code Number</Label>
              <Input v-model="deliveryData.code_number" readonly
                class="mt-1 w-full h-11 bg-gray-100 rounded-md border-gray-300" />
            </div>

            <div class="md:col-span-3">
              <Label>Purpose</Label>
              <TextArea v-model="deliveryData.purpose" :rows="3" placeholder="Purpose"
                class="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-blue-200" />
            </div>
          </div>

          <!-- Separator -->
          <div class="hidden md:flex md:col-span-1 justify-center">
            <div class="w-px bg-gray-300 mx-auto"></div>
          </div>

          <!-- Right Column: Supporting Documents -->
          <div class="md:col-span-5 grid grid-cols-1 md:grid-cols-3 gap-4">
            <h3 class="text-2xl font-bold mb-4 md:col-span-3 text-gray-800">Supporting Documents</h3>

            <div>
              <Label>Sales Invoice Number <span class="text-red-500">*</span></Label>
              <Input type="text" placeholder="Enter Sales Invoice Number" :value="deliveryData.invoice_no"
                @input="updateField('invoice_no', $event)"
                class="mt-1 w-full h-11 rounded-md border-gray-300 shadow-sm focus:ring focus:ring-blue-200" />
            </div>

            <div>
              <Label>Sales Invoice Total Amount</Label>
              <Input type="number" placeholder="Enter Sales Invoice Total Amount"
                :value="deliveryData.invoice_total_amount" @input="updateField('invoice_total_amount', $event)"
                class="mt-1 w-full h-11 rounded-md border-gray-300 shadow-sm focus:ring focus:ring-blue-200" />
            </div>

            <div>
              <Label>Purchase Order Date</Label>
              <DatePicker :model-value="deliveryData.po_date" @update:model-value="updateField('po_date', $event)"
                placeholder="Select Purchase Order Date"
                class="mt-1 w-full h-11 rounded-md border-gray-300 shadow-sm focus:ring focus:ring-blue-200" />
            </div>

            <!-- Delivery Receipt -->
            <div>
              <Label>Delivery Receipt Number</Label>
              <Input type="text" placeholder="Enter Delivery Receipt Number" :value="deliveryData.dr_no"
                @input="updateField('dr_no', $event)"
                class="mt-1 w-full h-11 rounded-md border-gray-300 shadow-sm focus:ring focus:ring-blue-200" />
            </div>

            <div>
              <Label>Delivery Receipt Date</Label>
              <DatePicker :model-value="deliveryData.dr_date" @update:model-value="updateField('dr_date', $event)"
                placeholder="Select Delivery Receipt Date"
                class="mt-1 w-full h-11 rounded-md border-gray-300 shadow-sm focus:ring focus:ring-blue-200" />
            </div>

            <div>
              <Label>RIS Number</Label>
              <Input type="text" placeholder="Enter RIS Number" :value="deliveryData.ris_no"
                @input="updateField('ris_no', $event)"
                class="mt-1 w-full h-11 rounded-md border-gray-300 shadow-sm focus:ring focus:ring-blue-200" />
            </div>

            <div>
              <Label>RIS Date</Label>
              <DatePicker :model-value="deliveryData.ris_date" @update:model-value="updateField('ris_date', $event)"
                placeholder="Select RIS Date"
                class="mt-1 w-full h-11 rounded-md border-gray-300 shadow-sm focus:ring focus:ring-blue-200" />
            </div>

            <div>
              <Label>ORS Number</Label>
              <Input type="text" placeholder="Enter ORS Number" :value="deliveryData.ors_no"
                @input="updateField('ors_no', $event)"
                class="mt-1 w-full h-11 rounded-md border-gray-300 shadow-sm focus:ring focus:ring-blue-200" />
            </div>

            <div>
              <Label>ORS Date</Label>
              <DatePicker :model-value="deliveryData.ors_date" @update:model-value="updateField('ors_date', $event)"
                placeholder="Select ORS Date"
                class="mt-1 w-full h-11 rounded-md border-gray-300 shadow-sm focus:ring focus:ring-blue-200" />
            </div>

            <div>
              <Label>Disbursement Voucher</Label>
              <Input type="text" placeholder="Enter Disbursement Voucher Number" :value="deliveryData.dv_no"
                @input="updateField('dv_no', $event)"
                class="mt-1 w-full h-11 rounded-md border-gray-300 shadow-sm focus:ring focus:ring-blue-200" />
            </div>

            <div>
              <Label>Disbursement Voucher Date</Label>
              <DatePicker :model-value="deliveryData.dv_date" @update:model-value="updateField('dv_date', $event)"
                placeholder="Select Disbursement Voucher Date"
                class="mt-1 w-full h-11 rounded-md border-gray-300 shadow-sm focus:ring focus:ring-blue-200" />
            </div>

            <div></div> <!-- empty div to fill the third column -->
          </div>
        </div>

        <!-- Review Delivery Items -->
        <div class="mt-1">
          <h2 class="text-2xl font-bold mb-4 text-gray-800">Review Delivery Items</h2>
          <div class="overflow-auto border rounded-lg shadow-md">
            <table class="min-w-full text-sm text-left table-auto">
              <thead class="bg-gray-50 text-xs uppercase tracking-wider text-gray-600">
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
                <tr v-for="(item, index) in deliveryData.items" :key="index"
                  class="border-t hover:bg-gray-50 transition">
                  <td>
                    <button type="button" class="text-red-600 hover:underline"
                      @click="removeItem(index)">Remove</button>
                  </td>
                  <td>{{ getSupplyName(item.supply) }}</td>
                  <td>{{ item.item_type }}</td>
                  <td>{{ item.stock_number }}</td>
                  <td>{{ getUnitName(item.unit) }}</td>
                  <td>{{ getCategoryName(item.category) }}</td>
                  <td>{{ getBrandName(item.brand) }}</td>
                  <td>{{ getModelName(item.model) }}</td>
                  <td>{{ item.additional_description }}</td>
                  <td>{{ item.quantity }}</td>
                  <td>{{ item.unit_value }}</td>
                  <td>{{ (item.quantity * item.unit_value).toFixed(2) }}</td>
                </tr>
              </tbody>
              <tfoot class="bg-gray-100 font-semibold text-gray-800">
                <tr>
                  <td colspan="11" class="py-2 text-right">Grand Total:</td>
                  <td class="py-2 text-green-700 text-lg font-bold">{{ grandTotal }}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        <!-- Save Button -->
        <div class="md:col-span-12 flex justify-end mt-4">
          <button type="button" @click="updateDelivery"
            class="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition">
            Save Changes
          </button>
        </div>
      </div>
    </Transition>
  </AppLayout>
</template>
