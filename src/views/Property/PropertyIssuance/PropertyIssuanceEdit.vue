<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/components/layouts/AppLayout.vue'
import { type BreadcrumbItem } from '@/types/api'
import axios from 'axios'
import TextArea from '@/components/ui/textarea/TextArea.vue'
import Input from '@/components/ui/input/Input.vue'
import { Label } from 'reka-ui'
import { Truck, PackageIcon, ScrollText } from 'lucide-vue-next'

const route = useRoute()
const issuance = ref<any>(null)
const loading = ref(true)
const error = ref<string | null>(null)

// Stepper state
const activeStep = ref(1)
const steps = [
  { title: 'Basic Info', description: 'General property info', icon: Truck },
  { title: 'Additional Details', description: 'Brand / Model', icon: PackageIcon },
  { title: 'Review', description: 'Verify the issuance', icon: ScrollText }
]
const totalSteps = steps.length
function nextStep() { if (activeStep.value < totalSteps) activeStep.value++ }
function prevStep() { if (activeStep.value > 1) activeStep.value-- }
function goToStep(index: number) { activeStep.value = index + 1 }

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Property Issuance', href: '/property-issuance' },
  { title: 'Edit', href: `/property-issuance/${route.params.id}` }
]

onMounted(async () => {
  try {
    const { data } = await axios.get(`/property-issuance/${route.params.id}?type=${route.params.type}`)
    issuance.value = data
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Failed to load record'
  } finally {
    loading.value = false
  }
})
</script>

<template>
<AppLayout :breadcrumbs="breadcrumbs">
  <div class="p-6 space-y-8">

    <div v-if="loading" class="text-gray-500 text-center">Loading...</div>
    <div v-else-if="error" class="text-red-600 font-medium text-center">{{ error }}</div>

    <div v-else class="space-y-8">

      <h2 class="text-3xl font-bold text-gray-900 text-center">Property Issuance #{{ issuance.id }}</h2>

      <!-- Stepper -->
      <div class="flex items-center justify-center max-w-5xl mx-auto">
        <template v-for="(step, index) in steps" :key="index">
          <div class="flex items-center w-full relative">
            <!-- Step Circle -->
            <div
              class="flex flex-col items-center cursor-pointer z-10"
              @click="goToStep(index)"
            >
              <div
                class="w-12 h-12 flex items-center justify-center rounded-full shadow-lg text-white transition-all duration-300 transform hover:scale-110"
                :class="{
                  'bg-gradient-to-r from-cyan-500 to-cyan-700 ring-4 ring-cyan-300': activeStep === index + 1,
                  'bg-cyan-400': activeStep > index + 1,
                  'bg-gray-300': activeStep < index + 1
                }"
              >
                <component :is="step.icon" class="w-6 h-6" />
              </div>
              <div class="mt-3 text-center">
                <div class="font-semibold text-sm md:text-base transition-colors"
                  :class="{ 'text-cyan-700': activeStep === index + 1, 'text-gray-700': activeStep !== index + 1 }">
                  {{ step.title }}
                </div>
                <div class="text-gray-500 text-xs md:text-sm">{{ step.description }}</div>
              </div>
            </div>

            <!-- Connector Line -->
            <div v-if="index < steps.length - 1" class="flex-1 h-1 mx-3 bg-gray-300 rounded relative mt-6">
              <div
                class="absolute top-0 left-0 h-1 rounded bg-gradient-to-r from-cyan-500 to-cyan-700 transition-all duration-500"
                :style="{ width: activeStep > index + 1 ? '100%' : '0%' }"
              ></div>
            </div>
          </div>
        </template>
      </div>

      <!-- Step Content -->
      <transition name="fade" mode="out-in">
        <div key="step-{{ activeStep }}" class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <!-- Step 1 -->
          <template v-if="activeStep === 1">
            <div class="flex flex-col p-6 bg-white shadow rounded-lg">
              <Label class="block text-sm font-medium text-gray-700 mb-2">Purchase Order Number</Label>
              <Input v-model="issuance.reference_no" readonly class="w-full h-12 border-gray-300 rounded-lg bg-gray-50 text-gray-700"/>
            </div>

            <div class="flex flex-col p-6 bg-white shadow rounded-lg">
              <Label class="block text-sm font-medium text-gray-700 mb-2">Type</Label>
              <Input v-model="issuance.type" readonly class="w-full h-12 border-gray-300 rounded-lg bg-gray-50 text-gray-700"/>
            </div>

            <div class="flex flex-col p-6 bg-white shadow rounded-lg">
              <Label class="block text-sm font-medium text-gray-700 mb-2">Quantity</Label>
              <Input v-model="issuance.receipt_qty" readonly class="w-full h-12 border-gray-300 rounded-lg bg-gray-50 text-gray-700"/>
            </div>
            <div class="flex flex-col sm:col-span-2 p-6 bg-white shadow rounded-lg">
              <Label class="block text-sm font-medium text-gray-700 mb-2">Additional Description</Label>
              <TextArea v-model="issuance.additional_description" readonly :rows="3" class="w-full border-gray-300 rounded-lg bg-gray-50 text-gray-700"/>
            </div>

            <div class="flex flex-col p-6 bg-white shadow rounded-lg">
              <Label class="block text-sm font-medium text-gray-700 mb-2">Brand</Label>
              <Input v-model="issuance.brand" readonly class="w-full h-12 border-gray-300 rounded-lg bg-gray-50 text-gray-700"/>
            </div>

            <div class="flex flex-col p-6 bg-white shadow rounded-lg">
              <Label class="block text-sm font-medium text-gray-700 mb-2">Model</Label>
              <Input v-model="issuance.model" readonly class="w-full h-12 border-gray-300 rounded-lg bg-gray-50 text-gray-700"/>
            </div>
            <div class="flex flex-col p-6 bg-white shadow rounded-lg">
              <Label class="block text-sm font-medium text-gray-700 mb-2">Unit</Label>
              <Input v-model="issuance.unit" readonly class="w-full h-12 border-gray-300 rounded-lg bg-gray-50 text-gray-700"/>
            </div>
            <div class="flex flex-col p-6 bg-white shadow rounded-lg">
              <Label class="block text-sm font-medium text-gray-700 mb-2">Unit Value</Label>
              <Input v-model="issuance.unit_value" readonly class="w-full h-12 border-gray-300 rounded-lg bg-gray-50 text-gray-700"/>
            </div>
          </template>

          <!-- Step 2 -->
          <template v-if="activeStep === 2">
            
          </template>

          <!-- Step 3 -->
          <template v-if="activeStep === 3">
            <div class="col-span-2 p-6 bg-gray-50 border border-gray-200 rounded-lg shadow">
              <h3 class="font-semibold text-lg text-gray-800 mb-4">Review Issuance</h3>
              <p class="mb-1"><strong>PO Number:</strong> {{ issuance.reference_no }}</p>
              <p class="mb-1"><strong>Type:</strong> {{ issuance.type }}</p>
              <p class="mb-1"><strong>Quantity:</strong> {{ issuance.receipt_qty }}</p>
              <p class="mb-1"><strong>Description:</strong> {{ issuance.additional_description }}</p>
              <p class="mb-1"><strong>Brand:</strong> {{ issuance.brand }}</p>
              <p class="mb-1"><strong>Model:</strong> {{ issuance.model }}</p>
            </div>
          </template>
        </div>
      </transition>

      <!-- Navigation Buttons -->
      <div class="flex justify-between max-w-3xl mx-auto mt-6">
        <button @click="prevStep" :disabled="activeStep === 1"
          class="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 disabled:opacity-50 transition">
          Back
        </button>

        <button v-if="activeStep < totalSteps" @click="nextStep"
          class="px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-700 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-cyan-800 transition">
          Next
        </button>

        <button v-else
          class="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition">
          Finish
        </button>
      </div>

    </div>
  </div>
</AppLayout>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
.fade-enter-to, .fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
