<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import axios from 'axios'
import SelectSearch from '@/components/ui/select/SelectSearch.vue'
import DatePicker from '@/components/ui/datepicker/DatePicker.vue'
import TextArea from '@/components/ui/textarea/TextArea.vue'
import Input from '@/components/ui/input/Input.vue'
import { Label } from 'reka-ui'

interface User {
  Employee_PK: number
  First_Name: string
  Middle_Name?: string
  Last_Name: string
  officeDetails?: {
    Office_Desc: string
  }
}

const props = defineProps<{ deliveryData: Record<string, any> }>()
const emit = defineEmits(['update:deliveryData'])

const suppliers = ref<any[]>([])
const warehouses = ref<any[]>([])
const user = ref<User | null>(null)

const suppliersOptions = computed(() =>
  suppliers.value.map((sup) => ({ label: sup.Supplier_Name, value: sup.Supplier_Id })),
)
const warehousesOptions = computed(() =>
  warehouses.value.map((wh) => ({ label: wh.Warehouse_Description, value: wh.Warehouse_ID })),
)

onMounted(async () => {
  try {
    const [supRes, whRes, codeRes] = await Promise.all([
      axios.get('http://127.0.0.1:8000/api/suppliers'),
      axios.get('http://127.0.0.1:8000/api/warehouses'),
      axios.get('http://localhost:8000/api/delivery/next-code'),
    ])

    suppliers.value = supRes.data
    warehouses.value = whRes.data

    const code = codeRes.data.nextCode || codeRes.data.next_code || '0000'
    emit('update:deliveryData', {
      ...props.deliveryData,
      code_number: String(code).padStart(4, '0'),
    })

    const token = localStorage.getItem('auth_token')
    if (token) {
      const userRes = await axios.get('http://localhost:8000/api/user-profile', {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      })

      user.value = userRes.data
      emit('update:deliveryData', {
        ...props.deliveryData,
        prepared_by: user.value?.Employee_PK ?? '',
      })
    } else {
      emit('update:deliveryData', {
        ...props.deliveryData,
        prepared_by: '',
      })
    }
  } catch (error) {
    console.error('Failed to fetch initial data:', error)
  }
})

const formattedPurchaseDate = computed(() =>
  props.deliveryData.purchase_date
    ? new Date(props.deliveryData.purchase_date).toLocaleDateString()
    : null,
)

const formattedPrDate = computed(() =>
  props.deliveryData.pr_date ? new Date(props.deliveryData.pr_date).toLocaleDateString() : null,
)
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
      <h2 class="text-2xl font-bold mb-6 text-gray-800">Delivery Details</h2>

      <form class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- IAR Number -->
        <div>
          <Label class="block text-sm font-medium text-gray-700">IAR Number</Label>
          <Input
            v-model="props.deliveryData.iar_number"
            type="text"
            placeholder="Enter IAR Number"
            required
          />
        </div>

        <!-- Supplier -->
        <div>
          <Label class="block text-sm font-medium text-gray-700">Supplier</Label>
          <SelectSearch
            v-model="props.deliveryData.supplier"
            :options="suppliersOptions"
            placeholder="Select Supplier"
          />
        </div>

        <!-- Purchase Order Number -->
        <div>
          <Label class="block text-sm font-medium text-gray-700">Purchase Order Number</Label>
          <Input
            v-model="props.deliveryData.purchase_order_number"
            type="text"
            placeholder="Enter Purchase Order Number"
          />
        </div>

        <!-- Purchase Date -->
        <div>
          <Label class="block text-sm font-medium text-gray-700">Purchase Date</Label>
          <DatePicker
            v-model="props.deliveryData.purchase_date"
            placeholder="Select Purchase Date"
          />
        </div>

        <!-- PR Number -->
        <div>
          <Label class="block text-sm font-medium text-gray-700">PR Number</Label>
          <Input v-model="props.deliveryData.pr_number" type="text" placeholder="Enter PR Number" />
        </div>

        <!-- PR Date -->
        <div>
          <Label class="block text-sm font-medium text-gray-700">PR Date</Label>
          <DatePicker v-model="props.deliveryData.pr_date" placeholder="Select PR Date" />
        </div>

        <!-- Receiving Office -->
        <div>
          <Label class="block text-sm font-medium text-gray-700">Receiving Office</Label>
          <Input
            v-model="props.deliveryData.receiving_office"
            readonly
            class="bg-gray-100 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <!-- Warehouse -->
        <div>
          <Label class="block text-sm font-medium text-gray-700">Warehouse</Label>
          <SelectSearch
            v-model="props.deliveryData.warehouse"
            :options="warehousesOptions"
            placeholder="Select Warehouse"
          />
        </div>

        <!-- Code Number -->
        <div>
          <Label class="block text-sm font-medium text-gray-700">Code Number</Label>
          <Input
            v-model="props.deliveryData.code_number"
            readonly
            placeholder="-"
            class="bg-gray-100 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <!-- Prepared By -->
        <div>
          <Label class="block text-sm font-medium text-gray-700">Prepared By</Label>
          <Input
            type="text"
            :value="
              user?.First_Name
                ? `${user.First_Name} ${user.Middle_Name ?? ''} ${user.Last_Name}`.trim()
                : 'Loading...'
            "
            readonly
          />
        </div>

        <!-- Purpose -->
        <div class="md:col-span-2">
          <Label for="purpose" class="block text-sm font-medium text-gray-700">Purpose</Label>
          <TextArea
            id="purpose"
            placeholder="Purpose"
            v-model="props.deliveryData.purpose"
            :rows="3"
          />
        </div>
      </form>
    </div>
  </Transition>
</template>
