<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { type BreadcrumbItem } from '@/types/api'
import { ClipboardList, PackageIcon } from 'lucide-vue-next'
import AppLayout from '@/components/layouts/AppLayout.vue'

import StepRISDetails from '@/components/steps-ris/Step1RISDetails.vue'
import StepRISItemsDetails from '@/components/steps-ris/Step2RISItemsDetails.vue'
import axios from 'axios'

// Router
const router = useRouter()

// Stepper
const activeStep = ref(1)
const totalSteps = 2

// RIS Data
const risData = ref({
  ris_number: '',
  responsibility_center: '',
  region: '',       // display
  region_id: null,  // backend
  office: '',
  office_id: null,
  fund_cluster: '',
  ris_date: new Date().toISOString().slice(0, 10),
  purpose: '',
  requested_by: '',       // display
  requested_by_id: null,  // backend
  received_by: '',
  received_by_id: null,
  approved_by: '',
  approved_by_id: null
})

// Items for Step 2
const items = ref<any[]>([])

// Dropdowns
const regions = ref<any[]>([])
const offices = ref<any[]>([])
const employees = ref<any[]>([])
const supplies = ref<any[]>([])
const units = ref<any[]>([])
const itemTypes = ref<any[]>([])

const loading = ref(false)

// Breadcrumbs
const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Supply Management', href: '#' },
  { title: 'RIS', href: '/ris' },
  { title: 'Request RIS', href: '/ris/add' }
]

// Stepper definition
const steps = [
  { title: 'RIS Details', description: 'Request details', icon: ClipboardList, component: StepRISDetails },
  { title: 'RIS Items', description: 'Add requested items', icon: PackageIcon, component: StepRISItemsDetails }
]

// Navigation
function nextStep() {
  if (activeStep.value < totalSteps) activeStep.value++
}
function prevStep() {
  if (activeStep.value > 1) activeStep.value--
}
function goToStep(index: number) {
  activeStep.value = index + 1
}

// --- Fetch logged-in user and dropdowns for Step 1 ---
onMounted(async () => {
  loading.value = true
  try {
    const userRes = await axios.get('http://localhost:8000/api/user-profile', { withCredentials: true })
    const user = userRes.data

    // Pre-fill logged-in user's region, office, requested_by
    risData.value.region = user.Region_Desc
    risData.value.region_id = user.Region
    risData.value.office = user.Office_Desc
    risData.value.office_id = user.Office
    risData.value.requested_by = `${user.First_Name} ${user.Last_Name}`
    risData.value.requested_by_id = user.User_Id

    // Fetch other dropdowns
    const [regionsRes, officesRes, employeesRes] = await Promise.all([
      axios.get('http://localhost:8000/api/regions'),
      axios.get(`http://localhost:8000/api/offices/region/${user.Region}`),
      axios.get(`http://localhost:8000/api/employees?division_id=${user.Division}`)
    ])
    regions.value = regionsRes.data
    offices.value = officesRes.data
    employees.value = employeesRes.data

    // Optionally pre-fill received_by / approved_by with current user
    risData.value.received_by = `${user.First_Name} ${user.Last_Name}`
    risData.value.received_by_id = user.User_Id
    risData.value.approved_by = `${user.First_Name} ${user.Last_Name}`
    risData.value.approved_by_id = user.User_Id

  } catch (error) {
    console.error('Failed to fetch user or dropdown data', error)
  } finally {
    loading.value = false
  }
})

// Lazy-load Step 2 dropdowns
watch(activeStep, async (step) => {
  if (step === 2 && supplies.value.length === 0) {
    loading.value = true
    try {
      const [suppliesRes, unitsRes, itemTypesRes] = await Promise.all([
        axios.get('http://localhost:8000/api/supplies'),
        axios.get('http://localhost:8000/api/units'),
        axios.get('http://localhost:8000/api/itemtypes')
      ])
      supplies.value = suppliesRes.data
      units.value = unitsRes.data
      itemTypes.value = itemTypesRes.data
    } catch (error) {
      console.error('Failed to fetch Step 2 dropdowns', error)
    } finally {
      loading.value = false
    }
  }
})

// --- Submit RIS ---
const showSuccessModal = ref(false)
const successMessage = ref('')

async function SubmitRIS() {
  loading.value = true;

  try {
    // Prepare payload to send to backend
    const payload = {
      responsibility_center: risData.value.responsibility_center,
      region_id: risData.value.region_id,
      office_id: risData.value.office_id,
      fund_cluster: risData.value.fund_cluster,
      ris_date: risData.value.ris_date,
      purpose: risData.value.purpose,
      requested_by_id: risData.value.requested_by_id,
      received_by_id: risData.value.received_by_id,
      approved_by_id: risData.value.approved_by_id,
      items: items.value.map(i => ({
        supply_id: i.supply_id,
        unit_id: i.unit_id,
        quantity_requested: i.quantity_requested,
        quantity_issued: i.quantity_issued ?? null,
        description: i.description ?? null,
        remarks: i.remarks ?? null,
      })),
    };

    console.log('RIS Payload:', JSON.stringify(payload, null, 2));

    // Submit to API
    const res = await axios.post('http://localhost:8000/api/ris', payload, { withCredentials: true });

    // Show success message
    successMessage.value = `✅ RIS submitted successfully! Number: ${res.data.data.ris_number}`;
    showSuccessModal.value = true;

    // Reset form after submission
    resetForm();

    // Redirect to RIS index after short delay
    setTimeout(() => {
      showSuccessModal.value = false;
      router.push({ name: 'RISIndex' });
    }, 1500);

  } catch (error: any) {
    console.error('Failed to submit RIS', error);

    if (error.response?.status === 422) {
      const validationErrors = error.response.data.errors;
      const messages = Object.values(validationErrors).flat().join(' | ');
      successMessage.value = `❌ Validation failed: ${messages}`;
    } else {
      successMessage.value = error.response?.data?.message ?? '❌ Failed to submit RIS.';
    }

    showSuccessModal.value = true;

  } finally {
    loading.value = false;
  }
}

// Optional helper function to reset form data
function resetForm() {
  activeStep.value = 1;
  risData.value = {
    ris_number: '',
    responsibility_center: '',
    region: '',
    region_id: null,
    office: '',
    office_id: null,
    fund_cluster: '',
    ris_date: new Date().toISOString().slice(0, 10),
    purpose: '',
    requested_by: '',
    requested_by_id: null,
    received_by: '',
    received_by_id: null,
    approved_by: '',
    approved_by_id: null,
  };
  items.value = [];
}


watch(showSuccessModal, (val) => {
  if (val) setTimeout(() => { showSuccessModal.value = false }, 3000)
})
</script>


<template>
  <AppLayout :breadcrumbs="breadcrumbs">
    <div class="relative flex flex-col h-full w-full p-6 gap-8">

      <!-- Loading Overlay -->
      <transition name="fade">
        <div v-if="loading" class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div class="text-white font-semibold text-lg animate-pulse">Loading...</div>
        </div>
      </transition>

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
                <div class="font-semibold text-sm md:text-base" :class="{ 'text-cyan-600': activeStep === index + 1 }">
                  {{ step.title }}
                </div>
                <div class="text-gray-500 text-xs md:text-sm">{{ step.description }}</div>
              </div>
            </div>

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
          <component :is="steps[activeStep - 1].component" v-model:items="items" v-model:ris-data="risData"
            v-bind="activeStep === 2 ? { supplies, units, itemTypes } : { regions, offices }" />
        </keep-alive>
      </div>

      <!-- Navigation -->
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
        <div v-if="showSuccessModal"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm text-center">
            <div class="flex justify-center mb-4">
              <svg class="w-12 h-12 text-green-500" fill="none" stroke="currentColor" stroke-width="2"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-4">{{ successMessage }}</h3>
            <p class="text-gray-500 mb-6">Your action has been successfully completed.</p>
            <button @click="showSuccessModal = false"
              class="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition">Close</button>
          </div>
        </div>
      </transition>
    </div>
  </AppLayout>
</template>
