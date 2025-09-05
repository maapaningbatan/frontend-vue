<template>
  <Transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 translate-y-2"
    enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-2">
    <div>
      <h3 class="text-xl font-bold mb-4">Supporting Documents</h3>

      <!-- Invoice -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <Label class="block text-gray-700">
            Sales Invoice Number <span class="text-red-500">*</span>
          </Label>
          <Input type="text" placeholder="Enter Sales Invoice Number" v-model="props.deliveryData.invoice_no"
            class="form-input w-full border-gray-300 rounded-md p-2" />
        </div>


        <div>
          <Label class="block text-gray-700">Sales Invoice total_amount Amount</Label>
          <Input type="number" placeholder="Enter Sales Invoice total_amount Amount"
            v-model="props.deliveryData.invoice_total_amount"
            class="form-input w-full border-gray-300 rounded-md p-2" />
        </div>

        <div>
  <Label class="block text-gray-700">Purchase Order Date</Label>
  <DatePicker
    v-model="props.deliveryData.po_date" placeholder="Select Purchase Order Date"
    class="w-full border-gray-300 rounded-md p-2"
  />
</div>

      </div>

      <!-- Purchase Order -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <Label class="block text-gray-700">Purchase Order Amount</Label>
          <Input type="text" v-model="props.deliveryData.po_amount" readonly
            class="form-input w-full border-gray-300 rounded-md p-2 bg-gray-100" />
        </div>

        <div>
  <Label class="block text-gray-700">Purchase Order Date</Label>
  <DatePicker
    v-model="props.deliveryData.po_date" placeholder="Select Purchase Order Date"
    class="w-full border-gray-300 rounded-md p-2"
  />
</div>

      </div>

      <!-- Delivery Receipt -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <Label class="block text-gray-700">Delivery Receipt Number</Label>
          <Input type="text" placeholder="Enter Delivery Receipt Number" v-model="props.deliveryData.dr_no"
            class="form-input w-full border-gray-300 rounded-md p-2" />
        </div>

        <div>
  <Label class="block text-gray-700">Delivery Receipt Date</Label>
  <DatePicker
    v-model="props.deliveryData.dr_date" placeholder="Select Delivery Receipt Date"
    class="w-full border-gray-300 rounded-md p-2"
  />
</div>

      </div>

      <!-- RIS -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <Label class="block text-gray-700">RIS Number</Label>
          <Input type="text" placeholder="Enter RIS Number" v-model="props.deliveryData.ris_no"
            class="form-input w-full border-gray-300 rounded-md p-2" />
        </div>

        <div>
  <Label class="block text-gray-700">RIS Date</Label>
  <DatePicker
    v-model="props.deliveryData.ris_date" placeholder="Select RIS Date"
    class="w-full border-gray-300 rounded-md p-2"
  />
</div>

      </div>

      <!-- ORS -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <Label class="block text-gray-700">ORS Number</Label>
          <Input type="text" placeholder="Enter ORS Number" v-model="props.deliveryData.ors_no"
            class="form-input w-full border-gray-300 rounded-md p-2" />
        </div>

        <div>
  <Label class="block text-gray-700">ORS Date</Label>
  <DatePicker
    v-model="props.deliveryData.ors_date" placeholder="Select ORS Date"
    class="w-full border-gray-300 rounded-md p-2"
  />
</div>

      </div>

      <!-- DV -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <Label class="block text-gray-700">Disbursement Voucher Number</Label>
          <Input type="text" placeholder="Enter Disbursement Voucher Number" v-model="props.deliveryData.dv_no"
            class="form-input w-full border-gray-300 rounded-md p-2" />
        </div>

        <div>
  <Label class="block text-gray-700">Disbursement Voucher Date</Label>
  <DatePicker
    v-model="props.deliveryData.dv_date" placeholder="Select Disbursement Voucher Date"
    class="w-full border-gray-300 rounded-md p-2"
  />
</div>


      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import DatePicker from '@/components/ui/datepicker/DatePicker.vue'
import Input from '@/components/ui/input/Input.vue'
import { Label } from 'reka-ui'


const props = defineProps<{
  deliveryData: Record<string, any>
}>()

const emit = defineEmits(['update:deliveryData'])

</script>
