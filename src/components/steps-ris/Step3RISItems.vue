<script setup lang="ts">
import { ref } from "vue"

interface Item {
  supply_id: number | null
  description: string
  quantity: number
  unit: string
}

const props = defineProps<{ items: Item[] }>()
const emit = defineEmits(["remove-item"])

const removeItem = (index: number) => {
  emit("remove-item", index)
}
</script>

<template>
  <div>
    <h2 class="text-lg font-semibold mb-4">Requested Items</h2>

    <table class="w-full border text-sm">
      <thead>
        <tr class="bg-gray-100">
          <th class="border p-2">#</th>
          <th class="border p-2">Description</th>
          <th class="border p-2">Quantity</th>
          <th class="border p-2">Unit</th>
          <th class="border p-2">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, i) in props.items" :key="i">
          <td class="border p-2 text-center">{{ i + 1 }}</td>
          <td class="border p-2">{{ item.description }}</td>
          <td class="border p-2 text-center">{{ item.quantity }}</td>
          <td class="border p-2 text-center">{{ item.unit }}</td>
          <td class="border p-2 text-center">
            <button
              class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              @click="removeItem(i)"
            >
              Remove
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="props.items.length === 0" class="text-gray-500 mt-3">
      No items added yet.
    </p>
  </div>
</template>
