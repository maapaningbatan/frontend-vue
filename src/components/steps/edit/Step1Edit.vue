<script setup lang="ts">
import { reactive, toRefs, watch, onMounted, computed, ref } from 'vue'
import SelectSearch from '@/components/ui/select/SelectSearch.vue'
import DatePicker from '@/components/ui/datepicker/DatePicker.vue'
import TextArea from '@/components/ui/textarea/TextArea.vue'
import Input from '@/components/ui/input/Input.vue'
import { Label } from 'reka-ui'

// -----------------------------
// Props & Emits
// -----------------------------
const props = defineProps<{ deliveryData: Record<string, any> }>()
const emit = defineEmits(['update:deliveryData'])

// -----------------------------
// Local reactive copy
// -----------------------------
const local = reactive({
  iar_number: '',
  purchase_order_number: '',
  purchase_date: '',
  pr_number: '',
  pr_date: '',
  supplier: '',
  warehouse: '',
  receiving_office: 'AS-PMD/CMD',
  code_number: '',
  purpose: '',
  ...props.deliveryData // override defaults with parent data
})

// -----------------------------
// Watch for parent updates
// -----------------------------
watch(
  () => props.deliveryData,
  (newVal) => {
    if (newVal) Object.assign(local, newVal)
  },
  { deep: true, immediate: true }
)

// -----------------------------
// Emit changes to parent
// -----------------------------
watch(
  local,
  (val) => {
    emit('update:deliveryData', { ...val })
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

// -----------------------------
// Convert local reactive to refs for v-model
// -----------------------------
const { iar_number, purchase_order_number, purchase_date, pr_number, pr_date, supplier, warehouse, receiving_office, code_number, purpose } = toRefs(local)
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-6 text-gray-800">Delivery Details</h2>

    <form class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- IAR Number -->
      <div>
        <Label>IAR Number</Label>
        <Input v-model="iar_number" placeholder="Enter IAR Number" class="mt-1 w-full h-11" />
      </div>

      <!-- Supplier -->
      <div>
        <Label>Supplier</Label>
        <SelectSearch
          v-model="supplier"
          :options="suppliersOptions"
          placeholder="Select Supplier"
          class="mt-1 w-full h-11"
        />
      </div>

      <!-- Purchase Order Number -->
      <div>
        <Label>Purchase Order Number</Label>
        <Input v-model="purchase_order_number" placeholder="Enter Purchase Order Number" class="mt-1 w-full h-11" />
      </div>

      <!-- Purchase Date -->
      <div>
        <Label>Purchase Date</Label>
        <DatePicker v-model="purchase_date" placeholder="Select Purchase Date" class="mt-1 w-full h-11" />
      </div>

      <!-- PR Number -->
      <div>
        <Label>PR Number</Label>
        <Input v-model="pr_number" placeholder="Enter PR Number" class="mt-1 w-full h-11" />
      </div>

      <!-- PR Date -->
      <div>
        <Label>PR Date</Label>
        <DatePicker v-model="pr_date" placeholder="Select PR Date" class="mt-1 w-full h-11" />
      </div>

      <!-- Receiving Office -->
      <div>
        <Label>Receiving Office</Label>
        <Input v-model="receiving_office" readonly class="mt-1 w-full h-11 bg-gray-100" />
      </div>

      <!-- Warehouse -->
      <div>
        <Label>Warehouse</Label>
        <SelectSearch
          v-model="warehouse"
          :options="warehousesOptions"
          placeholder="Select Warehouse"
          class="mt-1 w-full h-11"
        />
      </div>

      <!-- Code Number -->
      <div>
        <Label>Code Number</Label>
        <Input v-model="code_number" readonly class="mt-1 w-full h-11 bg-gray-100" />
      </div>

      <!-- Purpose -->
      <div class="md:col-span-2">
        <Label>Purpose</Label>
        <TextArea v-model="purpose" :rows="3" placeholder="Purpose" class="mt-1 w-full" />
      </div>
    </form>
  </div>
</template>
