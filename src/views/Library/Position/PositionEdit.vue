<script setup lang="ts">
import { ref, watch } from 'vue'
import Input from '@/components/ui/Input.vue';
import { type Position, updatePosition } from '@/services/positionService'

const props = defineProps<{ position: Position }>()
const emit = defineEmits<{ (e: 'close'): void; (e: 'updated'): void }>()

const form = ref<Omit<Position, 'Position_Id'>>({
  Position: '',
  Position_Desc: ''
})
const loading = ref(false)
const errorMsg = ref<string | null>(null)

watch(() => props.position, (pos) => {
  form.value = { Position: pos.Position, Position_Desc: pos.Position_Desc || '' }
}, { immediate: true })

const closeModal = () => emit('close')

const submitForm = async () => {
  loading.value = true
  errorMsg.value = null
  try {
    await updatePosition(props.position.Position_Id, form.value)
    emit('updated')
    closeModal()
  } catch (e: any) {
    errorMsg.value = e?.response?.data?.message || 'Failed to update position.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
    <div class="bg-white rounded-lg p-6 w-96 relative">
      <h2 class="text-lg font-semibold mb-4">Edit Position</h2>

      <div class="flex flex-col gap-3">
        <div>
          <label class="block text-sm font-medium mb-1">Position</label>
          <Input v-model="form.Position" type="text" class="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Description</label>
          <Input v-model="form.Position_Desc" class="w-full border rounded px-3 py-2" />
        </div>

        <div class="flex justify-end gap-2 mt-4">
          <button class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400" @click="closeModal">Cancel</button>
          <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" @click="submitForm"
            :disabled="loading">
            {{ loading ? 'Saving...' : 'Save' }}
          </button>
        </div>

        <p v-if="errorMsg" class="text-red-600 text-sm mt-2">{{ errorMsg }}</p>
      </div>
    </div>
  </div>
</template>
