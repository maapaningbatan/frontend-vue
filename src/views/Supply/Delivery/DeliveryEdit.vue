<script setup lang="ts">
import AppLayout from '@/components/layouts/AppLayout.vue'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Truck, ScrollText, CheckCircle2Icon } from 'lucide-vue-next'

import Step1Edit from '@/components/steps/edit/Step1Edit.vue'
import Step2Edit from '@/components/steps/edit/Step2Edit.vue'
import Step3Edit from '@/components/steps/edit/Step3Edit.vue'

import axios from 'axios'

// ROUTER
const router = useRouter()
const route = useRoute()
const itemTypes = ref<any[]>([])

// Get route param as number
const routeId = Number(route.params.id)
if (!routeId || isNaN(routeId)) {
  alert('Invalid delivery ID in URL')
  router.push({ name: 'Delivery' })
}

// Stepper state
const activeStep = ref(1)
const totalSteps = 3

// DELIVERY DATA
const deliveryData = ref<any>({
  delivery_id: null,
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
  invoice_no: '',
  invoice_total_amount: 0,
  invoice_date: '',
  po_amount: 0,
  po_date: '',
  dr_no: '',
  dr_date: '',
  ris_no: '',
  ris_date: '',
  ors_no: '',
  ors_date: '',
  dv_no: '',
  dv_date: ''
})

// ITEMS

const items = ref<any[]>([])

// Dropdowns for Step 2
const supplies = ref<any[]>([])
const units = ref<any[]>([])
const categories = ref<any[]>([])
const brands = ref<any[]>([])
const models = ref<any[]>([])

// Breadcrumbs
const breadcrumbs = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Delivery', href: '/delivery' },
  { title: 'Edit Delivery', href: '/delivery/edit' }
]

// Steps
const steps = [
  { title: 'Delivery Details', description: 'Order details', icon: Truck, component: Step1Edit },
  { title: 'Items', description: 'Check the items', icon: ScrollText, component: Step2Edit },
  { title: 'Supplier Info', description: 'Supplier details', icon: CheckCircle2Icon, component: Step3Edit }
]

// --- Fetch delivery and dropdown data ---
onMounted(async () => {
  try {

      const id = route.params.id
  if (!id) return
    // 1. Fetch delivery data
  const res = await axios.get(`http://localhost:8000/api/delivery/${id}`)
    deliveryData.value = {
      ...res.data,
      delivery_id: res.data.delivery_id ?? res.data.id
    }
    items.value = res.data.items ?? []

    // 2. Fetch dropdown data
const [suppliesRes, unitsRes, categoriesRes, brandsRes, modelsRes, itemTypesRes] = await Promise.all([
  axios.get('http://localhost:8000/api/supplies'),
  axios.get('http://localhost:8000/api/units'),
  axios.get('http://localhost:8000/api/categories'),
  axios.get('http://localhost:8000/api/brands'),
  axios.get('http://localhost:8000/api/models'),
  axios.get('http://localhost:8000/api/itemtypes')  // 👈 add this
])

supplies.value = suppliesRes.data
units.value = unitsRes.data
categories.value = categoriesRes.data
brands.value = brandsRes.data
models.value = modelsRes.data
itemTypes.value = itemTypesRes.data 
  } catch (error) {
    console.error('Failed to fetch delivery or dropdown data:', error)
    alert('Failed to load delivery details.')
  }
})

// --- Stepper navigation ---
function nextStep() { if (activeStep.value < totalSteps) activeStep.value++ }
function prevStep() { if (activeStep.value > 1) activeStep.value-- }
function goToStep(index: number) { activeStep.value = index + 1 }

// --- Submit edited delivery ---
async function SubmitEditedDelivery() {
  try {
    const routeId = Number(route.params.id)
    const id = deliveryData.value.delivery_id || routeId
    if (!id) throw new Error("Delivery ID is missing")

    // Build payload
    const deliveryPayload = {
      iar_number: deliveryData.value.iar_number ?? null,
      supplier: deliveryData.value.supplier ?? null,
      purchase_order_number: deliveryData.value.purchase_order_number ?? null,
      purchase_date: deliveryData.value.purchase_date ?? null,
      pr_number: deliveryData.value.pr_number ?? null,
      pr_date: deliveryData.value.pr_date ?? null,
      warehouse: deliveryData.value.warehouse ?? null,
      receiving_office: deliveryData.value.receiving_office ?? null,
      purpose: deliveryData.value.purpose ?? null,
      invoice_no: deliveryData.value.invoice_no ?? null,
      invoice_total_amount: deliveryData.value.invoice_total_amount ?? 0,
      invoice_date: deliveryData.value.invoice_date ?? null,
      po_amount: deliveryData.value.po_amount ?? 0,
      po_date: deliveryData.value.po_date ?? null,
      dr_no: deliveryData.value.dr_no ?? null,
      dr_date: deliveryData.value.dr_date ?? null,
      ris_no: deliveryData.value.ris_no ?? null,
      ris_date: deliveryData.value.ris_date ?? null,
      ors_no: deliveryData.value.ors_no ?? null,
      ors_date: deliveryData.value.ors_date ?? null,
      dv_no: deliveryData.value.dv_no ?? null,
      dv_date: deliveryData.value.dv_date ?? null,
      code_number: deliveryData.value.code_number ?? null,
      prepared_by: deliveryData.value.prepared_by ?? null,
      updated_by: 1,
    }

    // Only map items, do NOT clear them
    const itemsPayload = items.value.map(item => ({
      item_delivery_id: item.item_delivery_id ?? null,
      supply: item.supply ?? null,
      item_type: item.item_type ?? 'Supplies (Consumable)',
      stock_number: item.stock_number ?? null,
      unit: item.unit ?? null,
      category: item.category ?? null,
      brand: item.brand ?? null,
      model: item.model ?? null,
      additional_description: item.additional_description ?? null,
      remarks: item.remarks ?? null,
      quantity: item.quantity ?? 0,
      unit_value: item.unit_value ?? 0,
      total_amount: item.total_amount ?? 0,
    }))

    const payload = {
      ...deliveryPayload,
      items: itemsPayload
    }

    await axios.patch(`http://localhost:8000/api/delivery/edit/${id}`, payload)

    alert(`✅ Delivery updated successfully!`)

    // Do NOT reset items here
    activeStep.value = 1 // optional: go back to step 1
    // items.value = [] <- remove this line!

    router.push({ name: 'Delivery' })
  } catch (error: any) {
    console.error("❌ Error updating delivery:", error.response?.data ?? error)
    alert(`Failed to update delivery: ${error.response?.data?.message ?? 'Unknown error'}`)
  }
}






// Go back to delivery list
function goToDeliveryList() {
  router.push({ name: 'Delivery' })
}
</script>

<template>
<AppLayout :breadcrumbs="breadcrumbs">
  <div class="relative flex flex-col h-full w-full p-6 gap-8">
    <!-- Cancel Button -->
    <div class="absolute top-6 right-6">
      <button @click="goToDeliveryList" class="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold shadow hover:bg-red-700 transition transform hover:scale-105">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
        Cancel
      </button>
    </div>

    <!-- Stepper -->
    <div class="flex items-center justify-center w-full max-w-6xl mx-auto">
      <template v-for="(step, index) in steps" :key="index">
        <div class="flex items-center w-full">
          <div class="flex flex-col items-center relative cursor-pointer group" @click="goToStep(index)">
            <div class="w-12 h-12 flex items-center justify-center rounded-full text-white shadow-lg transition-all duration-500 group-hover:scale-110"
              :class="{
                'bg-gradient-to-r from-cyan-500 to-cyan-700 scale-110 ring-4 ring-blue-200': activeStep === index + 1,
                'bg-gradient-to-r from-cyan-400 to-cyan-600': activeStep > index + 1,
                'bg-gray-300': activeStep < index + 1
              }">
              <component :is="step.icon" class="w-7 h-7" />
            </div>
            <div class="mt-3 text-center">
              <div class="font-semibold text-sm md:text-base transition-colors" :class="{ 'text-cyan-600': activeStep === index + 1 }">{{ step.title }}</div>
              <div class="text-gray-500 text-xs md:text-sm">{{ step.description }}</div>
            </div>
          </div>

          <!-- Connector line -->
          <div v-if="index < steps.length - 1" class="flex-1 h-1 mx-3 bg-gray-300 rounded relative">
            <div class="absolute top-0 left-0 h-1 rounded bg-gradient-to-r from-cyan-500 to-cyan-700 transition-all duration-500"
              :style="{ width: activeStep > index + 1 ? '100%' : '0%' }"></div>
          </div>
        </div>
      </template>
    </div>

    <!-- Step Content -->
    <div class="relative min-h-[200px]">
      <keep-alive>
        <div v-for="(step, index) in steps" :key="index">
<component 
  :is="step.component"
  v-show="activeStep === index + 1"
  v-model:items="items"
  v-model:delivery-data="deliveryData"
  v-bind="index + 1 === 2 || index + 1 === 3 ? {
    supplies,
    units,
    categories,
    brands,
    models,
    itemTypes
  } : {}"
/>
        </div>
      </keep-alive>
    </div>

    <!-- Navigation Buttons -->
    <div class="flex justify-between w-full max-w-4xl mx-auto gap-2 mt-8">
      <button @click="prevStep" :disabled="activeStep === 1" class="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 disabled:opacity-50 transition">Back</button>

      <button v-if="activeStep < totalSteps" @click="nextStep" class="px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-700 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-cyan-800 transition">Next</button>

      <button v-else @click="SubmitEditedDelivery" class="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition">Update</button>
    </div>
  </div>
</AppLayout>
</template>
