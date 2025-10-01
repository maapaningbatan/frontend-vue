```vue
<template>
  <div class="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
    <div class="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
      <h2 class="text-xl font-bold mb-4">Edit User Level</h2>

      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">User Level Name</label>
        <input
          v-model="form.userlevel"
          type="text"
          class="w-full border rounded-lg px-3 py-2"
        />
      </div>

      <div class="flex justify-end gap-3">
        <button
          class="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
          @click="$emit('close')"
        >
          Cancel
        </button>
        <button
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          @click="updateLevel"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import axios from 'axios'

const props = defineProps<{ level: any }>()
const emit = defineEmits(['close', 'updated'])

const form = reactive({ id: null as number | null, userlevel: '' })

watch(
  () => props.level,
  newVal => {
    if (newVal) {
      form.id = newVal.id
      form.userlevel = newVal.userlevel || newVal.name || ''
    }
  },
  { immediate: true }
)

const updateLevel = async () => {
  if (!form.userlevel.trim()) {
    alert('User level name is required.')
    return
  }
  try {
    await axios.put(`http://localhost:8000/api/user-levels/${form.id}`, {
      userlevel: form.userlevel,
    })
    emit('updated')
  } catch (err) {
    console.error('❌ Update level error:', err)
    alert('Failed to update user level.')
  }
}
</script>
```
