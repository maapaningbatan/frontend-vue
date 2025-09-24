<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { Label } from 'reka-ui'
import Input from '@/components/ui/input/Input.vue'
import SelectSearch from '@/components/ui/select/SelectSearch.vue'
import TextArea from '@/components/ui/textarea/TextArea.vue'
import axios from 'axios'

// Props
const props = defineProps<{
  form: any
  brands: any[]
  models: any[]
  units: any[]
  articles: any[]
  propertyType: string
  issuance: any
}>()

// Emit update for propertyType
const emit = defineEmits<{
  (e: 'update:propertyType', value: string): void
}>()

// Internal state for propertyType
const internalPropertyType = ref(props.propertyType)

// Sync prop -> internal
watch(() => props.propertyType, (val) => {
  internalPropertyType.value = val
})

// Sync internal -> emit
watch(internalPropertyType, (val) => {
  emit('update:propertyType', val)
})

// 🔹 Funds list with concatenated label
const funds = ref<any[]>([])

onMounted(async () => {
  try {
    const response = await axios.get('/funds') // Make sure this matches your route
    funds.value = response.data.map((f: any) => ({
      ...f,
      label: `${f.Fund_Code} - ${f.Fund_Description}`,
      value: f.Fund_Id
    }))
  } catch (error) {
    console.error('Failed to fetch funds:', error)
  }
})

// 🔹 Watch Article selection and update fields (EUL + Property Type)
watch(() => props.form.article_id, (newArticleId) => {
  if (!newArticleId) return

  const selectedArticle = props.articles.find((a: any) => a.value == newArticleId)

  if (selectedArticle) {
    props.form.estimated_useful_life = selectedArticle.EUL_YR || ''
    internalPropertyType.value = selectedArticle.Property_Type || ''
  }
})
</script>

<template>
  <div class="col-span-2 bg-white shadow-lg rounded-xl p-8 border border-gray-100 space-y-6">
    <h3 class="text-lg font-semibold text-cyan-700">
      Basic Property Information
    </h3>

    <!-- Type, PO, Brand, Model -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div>
        <Label>Type</Label>
        <Input v-model="props.issuance.type" readonly class="w-full h-12 bg-gray-50" />
      </div>
      <div>
        <Label>Purchase Order Number</Label>
        <Input v-model="props.issuance.reference_no" readonly class="w-full h-12 bg-gray-50" />
      </div>
      <div>
        <Label>Brand</Label>
        <SelectSearch v-model="props.form.brand_id" :options="props.brands" placeholder="Select brand" />
      </div>
      <div>
        <Label>Model</Label>
        <SelectSearch v-model="props.form.model_id" :options="props.models" placeholder="Select model" />
      </div>
    </div>

    <!-- Quantity, Unit, Unit Cost, Fund -->
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-6">
      <div>
        <Label>Quantity</Label>
        <Input v-model="props.issuance.receipt_qty" readonly class="w-full h-12 bg-gray-50" />
      </div>
      <div>
        <Label>Unit</Label>
        <SelectSearch v-model="props.form.unit_id" :options="props.units" placeholder="Select unit" />
      </div>
      <div>
        <Label>Unit Cost</Label>
        <Input v-model="props.issuance.unit_value" readonly class="w-full h-12 bg-gray-50" />
      </div>
    </div>

    <!-- Acquisition, EUL, Account Code -->
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-6">
      <div>
        <Label>Acquisition Date</Label>
        <Input v-model="props.form.acquisition_date" type="date" />
      </div>
      <div>
        <Label>Estimated Useful Life (years)</Label>
        <Input v-model="props.form.estimated_useful_life" type="number" min="0" readonly class="w-full h-12 bg-gray-50" />
      </div>
      <div>
        <Label>Account Code</Label>
        <Input v-model="props.form.account_code" readonly />
      </div>
      <div>
        <Label>Fund Code</Label>
       <SelectSearch 
  v-model="props.form.fund_id" 
  :options="funds" 
  option-label="label" 
  option-value="value" 
  placeholder="Select a fund" 
/>

      </div>
    </div>

    <!-- Article, Property Type, Additional Description -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div>
        <Label>Article Description</Label>
        <SelectSearch v-model="props.form.article_id" :options="props.articles" option-label="label" option-value="value" placeholder="Select an article" />
      </div>
      <div>
        <Label>Property Type</Label>
        <TextArea v-model="internalPropertyType" :rows="3" readonly />
      </div>
      <div class="sm:col-span-2">
        <Label>Additional Description</Label>
        <TextArea v-model="props.form.additional_description" :rows="3" />
      </div>
    </div>
  </div>
</template>
