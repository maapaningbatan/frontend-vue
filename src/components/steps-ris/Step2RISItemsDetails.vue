<script setup lang="ts">
import { ref } from "vue"
import SelectSearch from "@/components/ui/select/SelectSearch.vue"
import Input from "@/components/ui/input/Input.vue"
import { Label } from "reka-ui"

interface Item {
  supply_id: number | null
  description: string
  quantity: number
  unit: string
}

const newItem = ref<Item>({
  supply_id: null,
  description: "",
  quantity: 1,
  unit: "",
})

// Emits item to parent
const emit = defineEmits(["add-item"])

const addItem = () => {
  if (!newItem.value.description || !newItem.value.quantity) return
  emit("add-item", { ...newItem.value })
  newItem.value = { supply_id: null, description: "", quantity: 1, unit: "" }
}
</script>

<template>
  <div class="space-y-4">
    <h2 class="text-lg font-semibold">Add Item</h2>

    <div>
      <Label>Description</Label>
      <Input v-model="newItem.description" placeholder="Enter item description" />
    </div>

    <div>
      <Label>Quantity</Label>
      <Input type="number" v-model.number="newItem.quantity" min="1" />
    </div>

    <div>
      <Label>Unit</Label>
      <Input v-model="newItem.unit" placeholder="pcs / box / ream" />
    </div>

    <button
      class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      @click="addItem"
    >
      Add to List
    </button>
  </div>
</template>
