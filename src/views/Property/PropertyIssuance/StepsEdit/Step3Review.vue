<script setup lang="ts">
import { defineProps } from 'vue'
import { Label } from 'reka-ui'

defineProps<{
  form: any
  issuance: any
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
  propertyType: string
}>()
</script>

<template>
  <div class="col-span-2 bg-white shadow-lg rounded-xl p-8 border border-gray-100 space-y-6">
    <h3 class="text-lg font-semibold text-cyan-700">Review Property Issuance</h3>

    <!-- Basic Info -->
    <div class="space-y-2">
      <Label class="font-semibold">Type:</Label>
      <div>{{ issuance.type }}</div>

      <Label class="font-semibold">Reference No:</Label>
      <div>{{ issuance.reference_no }}</div>

      <Label class="font-semibold">Brand:</Label>
      <div>{{ form.brand_id }}</div>

      <Label class="font-semibold">Model:</Label>
      <div>{{ form.model_id }}</div>

      <Label class="font-semibold">Unit:</Label>
      <div>{{ form.unit_id }}</div>

      <Label class="font-semibold">Quantity:</Label>
      <div>{{ issuance.receipt_qty }}</div>

      <Label class="font-semibold">Unit Cost:</Label>
      <div>{{ issuance.unit_value }}</div>

      <Label class="font-semibold">Acquisition Date:</Label>
      <div>{{ form.acquisition_date }}</div>

      <Label class="font-semibold">Estimated Useful Life:</Label>
      <div>{{ form.estimated_useful_life }}</div>

      <Label class="font-semibold">Account Code:</Label>
      <div>{{ form.account_code }}</div>

      <Label class="font-semibold">Fund Code:</Label>
      <div>{{ form.fund_code }}</div>

      <Label class="font-semibold">Article Description:</Label>
      <div>{{ form.article_id }}</div>

      <Label class="font-semibold">Property Type:</Label>
      <div>{{ propertyType }}</div>

      <Label class="font-semibold">Additional Description:</Label>
      <div>{{ form.additional_description }}</div>
    </div>

    <!-- Supplier & Invoice Info -->
    <div class="space-y-2 mt-4">
      <Label class="font-semibold">Supplier:</Label>
      <div>{{ form.supplier_id }}</div>

      <Label class="font-semibold">Invoice Number:</Label>
      <div>{{ invoiceNo }}</div>

      <Label class="font-semibold">Total Amount:</Label>
      <div>{{ invoiceTotal }}</div>

      <Label class="font-semibold">Invoice Date:</Label>
      <div>{{ invoiceDate }}</div>

      <Label class="font-semibold">PO Amount:</Label>
      <div>{{ poAmount }}</div>

      <Label class="font-semibold">PO Date:</Label>
      <div>{{ poDate }}</div>

      <Label class="font-semibold">DR Number:</Label>
      <div>{{ drNo }}</div>

      <Label class="font-semibold">DR Date:</Label>
      <div>{{ drDate }}</div>

      <Label class="font-semibold">RIS Number:</Label>
      <div>{{ risNo }}</div>

      <Label class="font-semibold">RIS Date:</Label>
      <div>{{ risDate }}</div>

      <Label class="font-semibold">ORS Number:</Label>
      <div>{{ orsNo }}</div>

      <Label class="font-semibold">ORS Date:</Label>
      <div>{{ orsDate }}</div>

      <Label class="font-semibold">DV Number:</Label>
      <div>{{ dvNo }}</div>

      <Label class="font-semibold">DV Date:</Label>
      <div>{{ dvDate }}</div>
    </div>
  </div>
</template>
