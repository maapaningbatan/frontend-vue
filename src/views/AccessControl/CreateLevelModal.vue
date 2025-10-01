```vue
<template>
  <div class="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
    <div class="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
      <h2 class="text-xl font-bold mb-4">Create User Level</h2>

      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">User Level Name</label>
        <input
          v-model="levelName"
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
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          @click="createLevel"
        >
          Create
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

const emit = defineEmits(['close', 'saved'])
const levelName = ref('')

const createLevel = async () => {
  if (!levelName.value.trim()) {
    alert('User level name is required.')
    return
  }
  try {
    await axios.post('http://localhost:8000/api/user-levels', {
      userlevel: levelName.value,
    })
    emit('saved')
  } catch (err) {
    console.error('❌ Create level error:', err)
    alert('Failed to create user level.')
  }
}
</script>
```
