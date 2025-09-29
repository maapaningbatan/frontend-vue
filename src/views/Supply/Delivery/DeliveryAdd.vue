<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { type BreadcrumbItem } from '@/types/api'
import { PackageIcon, ScrollText, Truck, CheckCircle2Icon } from 'lucide-vue-next'
import AppLayout from '@/components/layouts/AppLayout.vue'
import { useNotificationStore } from '@/stores/notification'

import StepDeliveryDetails from '@/components/steps/Step1DeliveryDetails.vue'
import StepItemsDetails from '@/components/steps/Step2ItemsDetails.vue'
import StepItems from '@/components/steps/Step3Items.vue'
import StepSupplierInfo from '@/components/steps/Step4SupplierInfo.vue'
import axios from 'axios'

const router = useRouter()
const notify = useNotificationStore()

function goToDeliveryList() {
  router.push({ name: 'Delivery' })
}

// Stepper state
const activeStep = ref(1)
const total_amountSteps = 4

// Delivery data
const deliveryData = ref({
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

// Items shared across steps
const items = ref<any[]>([])

// Dropdown refs for Step 3
const supplies = ref<any[]>([])
const units = ref<any[]>([])
const categories = ref<any[]>([])
const brands = ref<any[]>([])
const models = ref<any[]>([])
const itemTypes = ref<any[]>([])

// Fetch dropdown data
onMounted(async () => {
  try {
    const [suppliesRes, unitsRes, categoriesRes, brandsRes, modelsRes, itemTypesRes] = await Promise.all([
      axios.get('http://localhost:8000/api/supplies'),
      axios.get('http://localhost:8000/api/units'),
      axios.get('http://localhost:8000/api/categories'),
      axios.get('http://localhost:8000/api/brands'),
      axios.get('http://localhost:8000/api/models'),
      axios.get('http://localhost:8000/api/itemtypes')
    ])
    supplies.value = suppliesRes.data
    units.value = unitsRes.data
    categories.value = categoriesRes.data
    brands.value = brandsRes.data
    models.value = modelsRes.data
    itemTypes.value = itemTypesRes.data
  } catch (error) {
    notify.show('error', 'Loading Failed', 'Could not load dropdown data.', 5000)
    console.error('Failed to fetch dropdown data', error)
  }
})

// Breadcrumbs
const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Supply Management', href: '#' },
  { title: 'Delivery', href: '/delivery' },
  { title: 'New Delivery', href: '/delivery/add' }
]

// Steps
const steps = [
  { title: 'Delivery Details', description: 'Order details', icon: Truck, component: StepDeliveryDetails },
  { title: 'Items Details', description: 'Add your items here', icon: PackageIcon, component: StepItemsDetails },
  { title: 'Items', description: 'Review the items', icon: ScrollText, component: StepItems },
  { title: 'Supplier Info', description: 'Supplier details', icon: CheckCircle2Icon, component: StepSupplierInfo }
]

// Stepper actions
function nextStep() { if (activeStep.value < total_amountSteps) activeStep.value++ }
function prevStep() { if (activeStep.value > 1) activeStep.value-- }
function goToStep(index: number) { activeStep.value = index + 1 }

// Submit delivery
async function SubmitDelivery() {
  // Show immediate "submitting" notification (no auto-dismiss)
  const submittingId = Date.now()
  notify.notifications.push({
    id: submittingId,
    type: 'info',
    title: 'Submitting...',
    message: 'Please wait while we process your delivery.',
    duration: 0
  })

  try {
    const payload = {
      ...deliveryData.value,
      supplier: String(deliveryData.value.supplier),
      warehouse: String(deliveryData.value.warehouse),
      items: items.value.map(item => ({
        ...item,
        supply: Number(item.supply),
        quantity: Number(item.quantity),
        unit_value: Number(item.unit_value),
        total_amount: Number(item.total_amount)
      }))
    }

    await axios.post('http://localhost:8000/api/delivery/add', payload, { withCredentials: true })

    // Remove "submitting..." and show success
    notify.dismiss(submittingId)
    notify.show('success', 'Delivery Submitted!', 'Your delivery was submitted successfully.', 5000)

    router.push({ name: 'Delivery' })

    // Reset form & stepper
    activeStep.value = 1
    deliveryData.value = {
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
    }
    items.value = []
  } catch (error) {
    notify.dismiss(submittingId)
    notify.show('error', 'Submission Failed', 'Something went wrong while submitting the delivery.', 5000)
    console.error('Failed to submit delivery', error)
  }
}
</script>


<template>
  <AppLayout :breadcrumbs="breadcrumbs">
    <div class="relative flex flex-col h-full w-full p-6 gap-8">

      <!-- Cancel Button -->
      <div class="absolute top-6 right-6">
        <button @click="goToDeliveryList"
          class="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold shadow hover:bg-red-700 transition transform hover:scale-105">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" stroke-width="2">
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
              <div
                class="w-12 h-12 flex items-center justify-center rounded-full text-white shadow-lg transition-all duration-500 group-hover:scale-110"
                :class="{
                  'bg-gradient-to-r from-cyan-500 to-cyan-700 scale-110 ring-4 ring-blue-200': activeStep === index + 1,
                  'bg-gradient-to-r from-cyan-400 to-cyan-600': activeStep > index + 1,
                  'bg-gray-300': activeStep < index + 1
                }">
                <component :is="step.icon" class="w-7 h-7" />
              </div>
              <div class="mt-3 text-center">
                <div class="font-semibold text-sm md:text-base transition-colors"
                  :class="{ 'text-cyan-600': activeStep === index + 1 }">
                  {{ step.title }}
                </div>
                <div class="text-gray-500 text-xs md:text-sm">
                  {{ step.description }}
                </div>
              </div>
            </div>

            <!-- Connector line -->
            <div v-if="index < steps.length - 1" class="flex-1 h-1 mx-3 bg-gray-300 rounded relative">
              <div
                class="absolute top-0 left-0 h-1 rounded bg-gradient-to-r from-cyan-500 to-cyan-700 transition-all duration-500"
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
        <button @click="prevStep" :disabled="activeStep === 1"
          class="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 disabled:opacity-50 transition">
          Back
        </button>

        <button v-if="activeStep < total_amountSteps" @click="nextStep"
          class="px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-700 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-cyan-800 transition">
          Next
        </button>

        <button v-else @click="SubmitDelivery"
          class="px-6 py-3 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg font-semibold hover:bg-green-700 transition">
          Submit
        </button>
      </div>
    </div>
  </AppLayout>
</template>
