<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

// Props
const props = defineProps<{
  user: any
}>()

// Emits
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'updated'): void
}>()

// Local copy so we don’t mutate parent data directly
const formUser = ref({ ...props.user })

// Update function
const updateUser = async () => {
  try {
    await axios.put(
      `http://localhost:8000/api/users/${formUser.value.User_Id}`,
      formUser.value
    )
    emit('updated') // notify parent
    emit('close')   // close modal
  } catch (e: any) {
    console.error('Update failed:', e.response?.data || e.message)
    alert('Failed to update user.')
  }
}
</script>

<template>
  <!-- Blurred Background -->
  <div class="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/20 z-50">
    <!-- Modal Box -->
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
      <h2 class="text-xl font-semibold mb-4">Edit User</h2>

      <form @submit.prevent="updateUser">
        <div class="grid gap-4">
          <!-- Username -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Username</label>
            <input
              v-model="formUser.Username"
              type="text"
              class="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-500"
            />
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input
              v-model="formUser.Email_Address"
              type="email"
              class="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-500"
            />
          </div>

          <!-- Status -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Status</label>
            <select
              v-model="formUser.Activated"
              class="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-500"
            >
              <option :value="1">Active</option>
              <option :value="0">Inactive</option>
            </select>
          </div>
        </div>

        <!-- Actions -->
        <div class="mt-6 flex justify-end gap-3">
          <button
            type="button"
            class="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
            @click="emit('close')"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
