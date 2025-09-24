<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/components/layouts/AppLayout.vue'
import { type BreadcrumbItem } from '@/types/api'
import axios from 'axios'

// Step Components
import Step1BasicInfo from '@/views/Property/PropertyIssuance/StepsEdit/Step1BasicInfo.vue'
import Step2SupplierDetails from '@/views/Property/PropertyIssuance/StepsEdit/Step2SupplierInvoice.vue'
import Step3Review from '@/views/Property/PropertyIssuance/StepsEdit/Step3Review.vue'

// Route
const route = useRoute()

// API Data
const issuance = ref<any>(null)
const loading = ref(true)
const error = ref<string | null>(null)

// Editable form state
const form = reactive({
  brand_id: undefined as number | undefined,
  unit_id: undefined as number | undefined,
  model_id: undefined as number | undefined,
  additional_description: '',
  article_id: undefined as number | undefined,
  supplier_id: undefined as number | undefined,
  acquisition_date: '',
  estimated_useful_life: undefined as number | undefined,
  account_code: '',
  fund_code: ''
})

// Dropdown options
const brands = ref<{ label: string; value: number }[]>([])
const units = ref<{ label: string; value: number }[]>([])
const models = ref<{ label: string; value: number }[]>([])
const articles = ref<{ label: string; value: number; Property_Type: string }[]>([])
const suppliers = ref<{ label: string; value: number }[]>([])

// Editable property type
const propertyType = ref('')

// Watch selected article to update Property_Type
watch(() => form.article_id, (newId) => {
  const selected = articles.value.find(a => a.value === newId)
  propertyType.value = selected?.Property_Type || ''
})

// Invoice / PO / DR / RIS / ORS / DV info
const invoiceNo = ref('')
const invoiceTotal = ref('')
const invoiceDate = ref('')
const poAmount = ref('')
const poDate = ref('')
const drNo = ref('')
const drDate = ref('')
const risNo = ref('')
const risDate = ref('')
const orsNo = ref('')
const orsDate = ref('')
const dvNo = ref('')
const dvDate = ref('')

// Stepper
const activeStep = ref(1)
const steps = [
  { title: 'Basic Info', description: 'General property info' },
  { title: 'Additional Details', description: 'Supplier / Invoice' },
  { title: 'Review', description: 'Verify the issuance' }
]
const totalSteps = steps.length
function nextStep() { if (activeStep.value < totalSteps) activeStep.value++ }
function prevStep() { if (activeStep.value > 1) activeStep.value-- }
function goToStep(index: number) { activeStep.value = index + 1 }

// Breadcrumbs
const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Property Issuance', href: '/property-issuance' },
  { title: 'Edit', href: `/property-issuance/${route.params.id}` }
]

// Fetch issuance & dropdowns
onMounted(async () => {
  try {
    const { data } = await axios.get(`/property-issuance/${route.params.id}?type=${route.params.type}`)
    issuance.value = data

    // Prefill form
    form.brand_id = data.brand_id ?? undefined
    form.unit_id = data.unit_id ?? undefined
    form.model_id = data.model_id ?? undefined
    form.additional_description = data.additional_description ?? ''
    form.article_id = data.article_id ?? undefined
    form.supplier_id = data.supplier_id ?? undefined
    form.acquisition_date = data.acquisition_date ?? ''
    form.estimated_useful_life = data.estimated_useful_life ?? undefined
    form.account_code = data.account_code ?? ''
    form.fund_code = data.fund_code ?? ''

    invoiceNo.value = data.invoice_no ?? ''
    invoiceTotal.value = data.invoice_total_amount ?? ''
    invoiceDate.value = data.invoice_date ?? ''
    poAmount.value = data.po_amount ?? ''
    poDate.value = data.po_date ?? ''
    drNo.value = data.dr_no ?? ''
    drDate.value = data.dr_date ?? ''
    risNo.value = data.ris_no ?? ''
    risDate.value = data.ris_date ?? ''
    orsNo.value = data.ors_no ?? ''
    orsDate.value = data.ors_date ?? ''
    dvNo.value = data.dv_no ?? ''
    dvDate.value = data.dv_date ?? ''

    // Load dropdowns
    const [resBrands, resUnits, resModels, resArticles, resSuppliers] = await Promise.all([
      axios.get('/brands'),
      axios.get('/units'),
      axios.get('/models'),
      axios.get('/articles'),
      axios.get('/suppliers')
    ])
    brands.value = resBrands.data.map((b: any) => ({ label: b.Brand_Description, value: b.Brand_Id }))
    units.value = resUnits.data.map((u: any) => ({ label: u.Unit_Type, value: u.Unit_Id }))
    models.value = resModels.data.map((m: any) => ({ label: m.model_desc, value: m.model_id }))
    articles.value = resArticles.data.map((a: any) => ({
      label: `${a.Article_Desc} (${a.Property_Type})`,
      value: a.Article_Id,
      Property_Type: a.Property_Type
    }))
    suppliers.value = resSuppliers.data.map((s: any) => ({ label: s.Supplier_Name, value: s.Supplier_Id }))
  } catch (e: any) {
    console.error(e)
    error.value = e.response?.data?.message || 'Failed to load record'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <AppLayout :breadcrumbs="breadcrumbs">
    <div class="p-6 space-y-10">

      <!-- Loading & Error -->
      <div v-if="loading" class="flex items-center justify-center h-40">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-600"></div>
      </div>
      <div v-else-if="error" class="text-red-600 font-medium text-center bg-red-50 p-4 rounded-lg shadow">
        {{ error }}
      </div>

      <div v-else class="space-y-10">
        <h2 class="text-3xl font-extrabold text-gray-900 text-center">
          Property Issuance #{{ issuance?.id }}
        </h2>

        <!-- Stepper -->
        <div class="flex items-center justify-center w-full max-w-6xl mx-auto mb-8">
          <template v-for="(step, index) in steps" :key="index">
            <div class="flex items-center w-full">
              <!-- Step Circle -->
              <div class="flex flex-col items-center relative cursor-pointer group" @click="goToStep(index)">
                <div
                  class="w-12 h-12 flex items-center justify-center rounded-full text-white shadow-lg transition-all duration-500 group-hover:scale-110"
                  :class="{
                    'bg-gradient-to-r from-cyan-500 to-cyan-700 scale-110 ring-4 ring-blue-200': activeStep === index + 1,
                    'bg-gradient-to-r from-cyan-400 to-cyan-600': activeStep > index + 1,
                    'bg-gray-300': activeStep < index + 1
                  }"
                >
                  {{ index + 1 }}
                </div>
                <div class="mt-3 text-center">
                  <div class="font-semibold text-sm md:text-base transition-colors"
                       :class="{ 'text-cyan-600': activeStep === index + 1 }">
                    {{ step.title }}
                  </div>
                  <div class="text-gray-500 text-xs md:text-sm">{{ step.description }}</div>
                </div>
              </div>

              <!-- Connector line -->
              <div v-if="index < steps.length - 1" class="flex-1 h-1 mx-3 bg-gray-300 rounded relative">
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
          <div>
            <Step1BasicInfo
              v-if="activeStep === 1"
              :form="form"
              :issuance="issuance"
              :brands="brands"
              :units="units"
              :models="models"
              :articles="articles"
              :property-type="propertyType"
            />
            <Step2SupplierDetails
              v-if="activeStep === 2"
              :form="form"
              :invoice-no="invoiceNo"
              :invoice-total="invoiceTotal"
              :invoice-date="invoiceDate"
              :po-amount="poAmount"
              :po-date="poDate"
              :dr-no="drNo"
              :dr-date="drDate"
              :ris-no="risNo"
              :ris-date="risDate"
              :ors-no="orsNo"
              :ors-date="orsDate"
              :dv-no="dvNo"
              :dv-date="dvDate"
              :suppliers="suppliers"
            />
            <Step3Review
              v-if="activeStep === 3"
              v-bind="{
                form,
                issuance,
                invoiceNo,
                invoiceTotal,
                invoiceDate,
                poAmount,
                poDate,
                drNo,
                drDate,
                risNo,
                risDate,
                orsNo,
                orsDate,
                dvNo,
                dvDate,
                propertyType
              }"
            />
          </div>
        </transition>

        <!-- Navigation Buttons -->
        <div class="flex justify-between max-w-4xl mx-auto mt-6 gap-2">
          <button
            @click="prevStep"
            :disabled="activeStep === 1"
            class="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 disabled:opacity-50 transition"
          >
            Back
          </button>

          <button
            v-if="activeStep < totalSteps"
            @click="nextStep"
            class="px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-700 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-cyan-800 transition"
          >
            Next
          </button>

          <button
            v-else
            class="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Finish
          </button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
