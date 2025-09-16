<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { type BreadcrumbItem } from '@/types/api'
import { PackageIcon, ScrollText, ClipboardList } from 'lucide-vue-next'
import AppLayout from '@/components/layouts/AppLayout.vue'

import StepRISDetails from '@/components/steps-ris/Step1RISDetails.vue'
import StepRISItemsDetails from '@/components/steps-ris/Step2RISItemsDetails.vue'

import axios from 'axios'

const router = useRouter()

// Stepper state
const activeStep = ref(1)
const totalSteps = 2

// RIS Data
const risData = ref({
  ris_number: '',
  responsibility_center: '',
  region: '',
  office: '',
  fund_cluster: '',
  ris_date: new Date().toISOString().slice(0, 10),
  purpose: '',
  requested_by: '',
  received_by: '',
  approved_by: ''
})

// Items shared across steps
const items = ref<any[]>([])

// Dropdowns
const supplies = ref<any[]>([])
const units = ref<any[]>([])
const categories = ref<any[]>([])
const brands = ref<any[]>([])
const models = ref<any[]>([])
const itemTypes = ref<any[]>([])
const regions = ref<any[]>([])
const offices = ref<any[]>([])

// Fetch dropdown data
onMounted(async () => {
  try {
    const [
      suppliesRes, unitsRes, categoriesRes, brandsRes, modelsRes,
      itemTypesRes, regionsRes, officesRes
    ] = await Promise.all([
      axios.get('http://localhost:8000/api/supplies'),
      axios.get('http://localhost:8000/api/units'),
      axios.get('http://localhost:8000/api/categories'),
      axios.get('http://localhost:8000/api/brands'),
      axios.get('http://localhost:8000/api/models'),
      axios.get('http://localhost:8000/api/itemtypes'),
      axios.get('http://localhost:8000/api/regions'),
      axios.get('http://localhost:8000/api/offices/region/1') // replace with auth user's region
    ])
    supplies.value = suppliesRes.data
    units.value = unitsRes.data
    categories.value = categoriesRes.data
    brands.value = brandsRes.data
    models.value = modelsRes.data
    itemTypes.value = itemTypesRes.data
    regions.value = regionsRes.data
    offices.value = officesRes.data

    // Auto-generate RIS number
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const regionCode = regions.value[0]?.Region_Code ?? 'REG'
    const officeCode = offices.value[0]?.Office_Code ?? 'OFF'
    risData.value.ris_number = `${year}-${month}-${regionCode}-${officeCode}-0001`
  } catch (error) {
    console.error('Failed to fetch dropdown data', error)
  }
})

// Breadcrumbs
const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'RIS', href: '/ris' },
  { title: 'Add RIS', href: '/ris/add' }
]

// Steps
const steps = [
  { title: 'RIS Details', description: 'Request details', icon: ClipboardList, component: StepRISDetails },
  { title: 'RIS Items Details', description: 'Add requested items', icon: PackageIcon, component: StepRISItemsDetails },
]

// Navigation actions
function nextStep() { if (activeStep.value < totalSteps) activeStep.value++ }
function prevStep() { if (activeStep.value > 1) activeStep.value-- }
function goToStep(index: number) { activeStep.value = index + 1 }

// Submit RIS
const showSuccessModal = ref(false)
const successMessage = ref('')

async function SubmitRIS() {
  try {
    const payload = {
      ...risData.value,
      items: items.value.map(item => ({
        ...item,
        supply: Number(item.supply),
        quantity: Number(item.quantity),
        unit_value: Number(item.unit_value),
        total_amount: Number(item.total_amount)
      }))
    }

    await axios.post('http://localhost:8000/api/ris/add', payload, { withCredentials: true })
    successMessage.value = `✅ RIS submitted successfully!`
    showSuccessModal.value = true

    activeStep.value = 1
    risData.value = {
      ris_number: '',
      responsibility_center: '',
      region: '',
      office: '',
      fund_cluster: '',
      ris_date: new Date().toISOString().slice(0, 10),
      purpose: '',
      requested_by: '',
      received_by: '',
      approved_by: ''
    }
    items.value = []

    setTimeout(() => {
      showSuccessModal.value = false
      router.push({ name: 'RIS' })
    }, 1500)
  } catch (error) {
    console.error('Failed to submit RIS', error)
    successMessage.value = '❌ Failed to submit RIS.'
    showSuccessModal.value = true
  }
}

watch(showSuccessModal, (val) => {
  if (val) {
    setTimeout(() => { showSuccessModal.value = false }, 3000)
  }
})
</script>

<template>
  <AppLayout :breadcrumbs="breadcrumbs">
    <div class="relative flex flex-col h-full w-full p-6 gap-8">
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
              v-model:ris-data="risData"
v-bind="index + 1 === 2 ? { supplies, units } : { regions, offices }"

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

        <button v-if="activeStep < totalSteps" @click="nextStep"
          class="px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-700 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-cyan-800 transition">
          Next
        </button>

        <button v-else @click="SubmitRIS"
          class="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition">
          Submit
        </button>
      </div>

      <!-- Success Modal -->
      <transition name="fade-scale">
        <div
          v-if="showSuccessModal"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        >
          <div
            class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm text-center transform transition-all duration-300 scale-95"
          >
            <div class="flex justify-center mb-4">
              <svg class="w-12 h-12 text-green-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-4">{{ successMessage }}</h3>
            <p class="text-gray-500 mb-6">Your action has been successfully completed.</p>
            <button
              @click="showSuccessModal = false"
              class="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      </transition>
    </div>
  </AppLayout>
</template>
