<script setup lang="ts">
import { defineProps } from 'vue'
import { Label } from 'reka-ui'
import Input from '@/components/ui/input/Input.vue'
import SelectSearch from '@/components/ui/select/SelectSearch.vue'

defineProps<{
  form: any
  suppliers: any[]
  invoiceNo: any
  invoiceTotal: any
  invoiceDate: any
  poAmount: any
  poDate: any
  drNo: any
  drDate: any
  risNo: any
  risDate: any
  orsNo: any
  orsDate: any
  dvNo: any
  dvDate: any
}>()
</script>

<template>
  <div class="col-span-2 bg-white shadow-lg rounded-xl p-8 border border-gray-100 space-y-6">
    <h3 class="text-lg font-semibold text-cyan-700">Supplier & Invoice Details</h3>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div class="sm:col-span-2">
        <Label>Supplier</Label>
        <SelectSearch v-model="form.supplier_id" :options="suppliers" placeholder="Select Supplier" />
      </div>

      <template v-for="field in [
        { label: 'Invoice Number', model: invoiceNo },
        { label: 'Total Amount', model: invoiceTotal },
        { label: 'Invoice Date', model: invoiceDate },
        { label: 'PO Amount', model: poAmount },
        { label: 'PO Date', model: poDate },
        { label: 'DR Number', model: drNo },
        { label: 'DR Date', model: drDate },
        { label: 'RIS Number', model: risNo },
        { label: 'RIS Date', model: risDate },
        { label: 'ORS Number', model: orsNo },
        { label: 'ORS Date', model: orsDate },
        { label: 'DV Number', model: dvNo },
        { label: 'DV Date', model: dvDate }
      ]" :key="field.label">
        <div>
          <Label>{{ field.label }}</Label>
          <Input v-model="field.model" readonly class="w-full h-12 bg-gray-50" />
        </div>
      </template>
    </div>
  </div>
</template>
