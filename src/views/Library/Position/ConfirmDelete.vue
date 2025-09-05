<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

// Props
const props = defineProps<{
  itemName: string
  itemId: number
  deleteApiEndpoint: string // e.g., '/api/positions'
}>()

// Emits
const emit = defineEmits<{ (e: 'close'): void; (e: 'deleted'): void }>()

// State
const loading = ref(false)
const errorMsg = ref<string | null>(null)

// Delete function
const deleteItem = async () => {
  loading.value = true
  errorMsg.value = null
  try {
    // Use Vite environment variable
    const baseUrl = (import.meta.env as any).VITE_API_BASE_URL || 'http://localhost:8000'
    await axios.delete(`${baseUrl}${props.deleteApiEndpoint}/${props.itemId}`)
    emit('deleted')
    emit('close')
  } catch (e: any) {
    errorMsg.value = e?.response?.data?.message || 'Failed to delete item.'
  } finally {
    loading.value = false
  }
}

// Close modal
const closeModal = () => emit('close')
</script>

<template>
  <div class="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
    <div class="bg-white rounded-lg p-6 w-96">
      <h2 class="text-lg font-semibold mb-4">Confirm Delete</h2>
      <p>Are you sure you want to delete <strong>{{ props.itemName }}</strong>?</p>

      <div class="flex justify-end gap-2 mt-4">
        <button
          class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          @click="closeModal"
        >
          Cancel
        </button>
        <button
          class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          @click="deleteItem"
          :disabled="loading"
        >
          {{ loading ? 'Deleting...' : 'Delete' }}
        </button>
      </div>

      <p v-if="errorMsg" class="text-red-600 text-sm mt-2">{{ errorMsg }}</p>
    </div>
  </div>
</template>
