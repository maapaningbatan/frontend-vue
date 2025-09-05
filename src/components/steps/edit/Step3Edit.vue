<script setup lang="ts">
import { reactive, watch } from 'vue'
import DatePicker from '@/components/ui/datepicker/DatePicker.vue'
import Input from '@/components/ui/input/Input.vue'
import { Label } from 'reka-ui'

// -----------------------------
// Props & Emits
// -----------------------------
const props = defineProps<{
  deliveryData: Record<string, any>
}>()
const emit = defineEmits(['update:deliveryData'])

// -----------------------------
// Reactive local copy
// -----------------------------
const localData = reactive({ ...props.deliveryData })

// Sync prop changes to localData
watch(
  () => props.deliveryData,
  (newData) => {
    if (newData) {
      Object.keys(localData).forEach((key) => delete localData[key])
      Object.assign(localData, newData)
    }
  },
  { deep: true, immediate: true }
)

// Emit changes whenever localData changes
watch(
  localData,
  (val) => emit('update:deliveryData', val),
  { deep: true }
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
      <h3 class="text-xl font-bold mb-4">Supporting Documents</h3>

      <!-- Sales Invoice -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <Label>Sales Invoice Number <span class="text-red-500">*</span></Label>
          <Input v-model="localData.invoice_no" placeholder="Enter Sales Invoice Number" class="w-full" />
        </div>
        <div>
          <Label>Sales Invoice Total Amount</Label>
          <Input type="number" v-model.number="localData.invoice_total_amount" placeholder="Enter Total Amount" class="w-full" />
        </div>
        <div>
          <Label>Purchase Order Date</Label>
          <DatePicker v-model="localData.po_date" placeholder="Select Purchase Order Date" class="w-full" />
        </div>
      </div>

      <!-- Purchase Order -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <Label>Purchase Order Amount</Label>
          <Input v-model="localData.po_amount" readonly class="w-full bg-gray-100" />
        </div>
        <div>
          <Label>Purchase Order Date</Label>
          <DatePicker v-model="localData.po_date" class="w-full" />
        </div>
      </div>

      <!-- Delivery Receipt -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <Label>Delivery Receipt Number</Label>
          <Input v-model="localData.dr_no" placeholder="Enter Delivery Receipt Number" class="w-full" />
        </div>
        <div>
          <Label>Delivery Receipt Date</Label>
          <DatePicker v-model="localData.dr_date" class="w-full" />
        </div>
      </div>

      <!-- RIS -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <Label>RIS Number</Label>
          <Input v-model="localData.ris_no" placeholder="Enter RIS Number" class="w-full" />
        </div>
        <div>
          <Label>RIS Date</Label>
          <DatePicker v-model="localData.ris_date" class="w-full" />
        </div>
      </div>

      <!-- ORS -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <Label>ORS Number</Label>
          <Input v-model="localData.ors_no" placeholder="Enter ORS Number" class="w-full" />
        </div>
        <div>
          <Label>ORS Date</Label>
          <DatePicker v-model="localData.ors_date" class="w-full" />
        </div>
      </div>

      <!-- DV -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <Label>Disbursement Voucher Number</Label>
          <Input v-model="localData.dv_no" placeholder="Enter DV Number" class="w-full" />
        </div>
        <div>
          <Label>Disbursement Voucher Date</Label>
          <DatePicker v-model="localData.dv_date" class="w-full" />
        </div>
      </div>
    </div>
  </Transition>
</template>
