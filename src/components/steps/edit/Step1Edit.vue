<script setup lang="ts">
import { ref, watch, onMounted ,computed} from 'vue'
import SelectSearch from '@/components/ui/select/SelectSearch.vue'
import DatePicker from '@/components/ui/datepicker/DatePicker.vue'
import TextArea from '@/components/ui/textarea/TextArea.vue'
import Input from '@/components/ui/input/Input.vue'
import { Label } from 'reka-ui'

// -----------------------------
// Types
// -----------------------------
interface DeliveryData {
  id?: number        // <- preserve ID
  delivery_id?: number
  iar_number: string
  purchase_order_number: string
  purchase_date: string
  pr_number: string
  pr_date: string
  supplier: string | number
  warehouse: string | number
  receiving_office: string
  code_number: string
  purpose: string
  [key: string]: any
}

// -----------------------------
// Props & Emits
// -----------------------------
const props = defineProps<{ deliveryData: any }>()
const emit = defineEmits<{
  (e: 'update:deliveryData', value: DeliveryData): void
}>()

// -----------------------------
// Local reactive copy (includes id/delivery_id)
// -----------------------------
const localDeliveryData = ref<DeliveryData>({
  id: undefined,
  delivery_id: undefined,
  iar_number: '',
  purchase_order_number: '',
  purchase_date: '',
  pr_number: '',
  pr_date: '',
  supplier: '',
  warehouse: '',
  receiving_office: '',
  code_number: '',
  purpose: ''
})


// Update localDeliveryData when prop changes
watch(
  () => props.deliveryData,
  (newVal) => {
    if (newVal) {
      localDeliveryData.value = {
        ...newVal,
        id: newVal.id ?? newVal.delivery_id,
        delivery_id: newVal.delivery_id ?? newVal.id,
        supplier: String(newVal.supplier),
        warehouse: String(newVal.warehouse)
      }
    }
  },
  { immediate: true }
)

// Emit changes whenever localDeliveryData changes
watch(
  localDeliveryData,
  (val) => {
    // Always preserve ID when emitting
    emit('update:deliveryData', {
      ...val,
      id: val.id ?? val.delivery_id,
      delivery_id: val.delivery_id ?? val.id
    })
  },
  { deep: true }
)

// -----------------------------
// Dropdowns
// -----------------------------
const suppliers = ref<any[]>([])
const warehouses = ref<any[]>([])

const suppliersOptions = computed(() =>
  suppliers.value.map((s) => ({ label: s.Supplier_Name, value: String(s.Supplier_Id) }))
)
const warehousesOptions = computed(() =>
  warehouses.value.map((w) => ({ label: w.Warehouse_Description, value: String(w.Warehouse_ID) }))
)

// -----------------------------
// Fetch dropdown data
// -----------------------------
onMounted(async () => {
  try {
    const [supRes, whRes] = await Promise.all([
      fetch('http://127.0.0.1:8000/api/suppliers').then(res => res.json()),
      fetch('http://127.0.0.1:8000/api/warehouses').then(res => res.json())
    ])
    suppliers.value = supRes
    warehouses.value = whRes
  } catch (err) {
    console.error('Failed to fetch dropdowns', err)
  }
})
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-6 text-gray-800">Delivery Details</h2>

    <form class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- IAR Number -->
      <div>
        <Label>IAR Number</Label>
        <Input v-model="localDeliveryData.iar_number" placeholder="Enter IAR Number" class="mt-1 w-full h-11" />
      </div>

      <!-- Supplier -->
      <div>
        <Label>Supplier</Label>
        <SelectSearch
          v-model="localDeliveryData.supplier"
          :options="suppliersOptions"
          placeholder="Select Supplier"
          class="mt-1 w-full h-11"
        />
      </div>

      <!-- Purchase Order Number -->
      <div>
        <Label>Purchase Order Number</Label>
        <Input v-model="localDeliveryData.purchase_order_number" placeholder="Enter Purchase Order Number" class="mt-1 w-full h-11" />
      </div>

      <!-- Purchase Date -->
      <div>
        <Label>Purchase Date</Label>
        <DatePicker v-model="localDeliveryData.purchase_date" placeholder="Select Purchase Date" class="mt-1 w-full h-11" />
      </div>

      <!-- PR Number -->
      <div>
        <Label>PR Number</Label>
        <Input v-model="localDeliveryData.pr_number" placeholder="Enter PR Number" class="mt-1 w-full h-11" />
      </div>

      <!-- PR Date -->
      <div>
        <Label>PR Date</Label>
        <DatePicker v-model="localDeliveryData.pr_date" placeholder="Select PR Date" class="mt-1 w-full h-11" />
      </div>

      <!-- Receiving Office -->
      <div>
        <Label>Receiving Office</Label>
        <Input v-model="localDeliveryData.receiving_office" readonly class="mt-1 w-full h-11 bg-gray-100" />
      </div>

      <!-- Warehouse -->
      <div>
        <Label>Warehouse</Label>
        <SelectSearch
          v-model="localDeliveryData.warehouse"
          :options="warehousesOptions"
          placeholder="Select Warehouse"
          class="mt-1 w-full h-11"
        />
      </div>

      <!-- Code Number -->
      <div>
        <Label>Code Number</Label>
        <Input v-model="localDeliveryData.code_number" readonly class="mt-1 w-full h-11 bg-gray-100" />
      </div>

      <!-- Purpose -->
      <div class="md:col-span-2">
        <Label>Purpose</Label>
        <TextArea v-model="localDeliveryData.purpose" :rows="3" placeholder="Purpose" class="mt-1 w-full" />
      </div>
    </form>
  </div>
</template>
