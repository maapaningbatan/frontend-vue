<script setup lang="ts">
import { reactive, toRefs, watch } from 'vue'
import Input from '@/components/ui/input/Input.vue'
import DatePicker from '@/components/ui/datepicker/DatePicker.vue'
import { Label } from 'reka-ui'

// Props & Emits
const props = defineProps<{ deliveryData: Record<string, any> }>()
const emit = defineEmits(['update:deliveryData'])

// Reactive local copy
const local = reactive({ ...props.deliveryData })

watch(
  () => props.deliveryData,
  (newVal) => {
    if (newVal) Object.assign(local, newVal)
  },
  { immediate: true }
)

// Emit updates
function emitUpdate() {
  emit('update:deliveryData', { ...local })
}

const { invoice_no, invoice_total_amount, po_amount, po_date, dr_no, dr_date, ris_no, ris_date, ors_no, ors_date, dv_no, dv_date, prepared_by } = toRefs(local)
</script>

<template>
  <div>
    <h2 class="text-xl font-bold mb-6">Supporting Documents / Supplier Info</h2>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div>
        <Label>Sales Invoice Number</Label>
        <Input v-model="local.invoice_no" @input="emitUpdate" placeholder="Enter Sales Invoice Number" />
      </div>
      <div>
        <Label>Sales Invoice Total Amount</Label>
        <Input type="number" v-model.number="local.invoice_total_amount" @input="emitUpdate" />
      </div>
      <div>
        <Label>Purchase Order Amount</Label>
        <Input type="number" v-model.number="local.po_amount" readonly />
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div>
        <Label>PO Date</Label>
        <DatePicker v-model="local.po_date" @update:modelValue="emitUpdate" />
      </div>
      <div>
        <Label>Delivery Receipt Number</Label>
        <Input v-model="local.dr_no" @input="emitUpdate" />
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div>
        <Label>Delivery Receipt Date</Label>
        <DatePicker v-model="local.dr_date" @update:modelValue="emitUpdate" />
      </div>
      <div>
        <Label>RIS Number</Label>
        <Input v-model="local.ris_no" @input="emitUpdate" />
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div>
        <Label>RIS Date</Label>
        <DatePicker v-model="local.ris_date" @update:modelValue="emitUpdate" />
      </div>
      <div>
        <Label>ORS Number</Label>
        <Input v-model="local.ors_no" @input="emitUpdate" />
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div>
        <Label>ORS Date</Label>
        <DatePicker v-model="local.ors_date" @update:modelValue="emitUpdate" />
      </div>
      <div>
        <Label>DV Number</Label>
        <Input v-model="local.dv_no" @input="emitUpdate" />
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div>
        <Label>DV Date</Label>
        <DatePicker v-model="local.dv_date" @update:modelValue="emitUpdate" />
      </div>
      <div>
        <Label>Prepared By</Label>
        <Input v-model="local.prepared_by" @input="emitUpdate" />
      </div>
    </div>
  </div>
</template>
