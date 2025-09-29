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

// Local copy to avoid mutating parent data directly
const formUser = ref({ ...props.user })

// Update function
const updateUser = async () => {
  try {
    await axios.put(
      `http://localhost:8000/api/users/${formUser.value.id}`,
      formUser.value
    )
    emit('updated')
    emit('close')
  } catch (e: any) {
    console.error('Update failed:', e.response?.data || e.message)
    alert('Failed to update user.')
  }
}
</script>

<template>
  <div class="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/20 z-50">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-6 overflow-auto max-h-[90vh]">
      <h2 class="text-xl font-semibold mb-4">Edit User</h2>

      <form @submit.prevent="updateUser" class="grid gap-4">
        <!-- Basic Info -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Username</label>
            <input v-model="formUser.username" type="text" class="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-500" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input v-model="formUser.email" type="email" class="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-500" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Status</label>
            <select v-model="formUser.activated" class="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-500">
              <option :value="1">Active</option>
              <option :value="0">Inactive</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">User Level</label>
            <input v-model="formUser.user_level_id" type="number" class="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-500" />
          </div>
        </div>

        <!-- Personal Info -->
        <div class="grid grid-cols-3 gap-4 mt-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Honorific</label>
            <input v-model="formUser.honorific" type="text" class="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-500" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">First Name</label>
            <input v-model="formUser.first_name" type="text" class="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-500" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Middle Name</label>
            <input v-model="formUser.middle_name" type="text" class="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-500" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Last Name</label>
            <input v-model="formUser.last_name" type="text" class="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-500" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Suffix</label>
            <input v-model="formUser.suffix" type="text" class="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-500" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Sex</label>
            <select v-model="formUser.sex" class="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-500">
              <option :value="1">Male</option>
              <option :value="0">Female</option>
            </select>
          </div>
        </div>

        <!-- Organizational Info -->
        <div class="grid grid-cols-3 gap-4 mt-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Position ID</label>
            <input v-model="formUser.position_id" type="number" class="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-500" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Region ID</label>
            <input v-model="formUser.region_id" type="number" class="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-500" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Office ID</label>
            <input v-model="formUser.office_id" type="number" class="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-500" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Division ID</label>
            <input v-model="formUser.division_id" type="number" class="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-500" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Cluster ID</label>
            <input v-model="formUser.cluster_id" type="number" class="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-500" />
          </div>
        </div>

        <!-- Contact Info -->
        <div class="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Contact Number</label>
            <input v-model="formUser.contact_number" type="text" class="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-500" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Address</label>
            <input v-model="formUser.address" type="text" class="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-500" />
          </div>
        </div>

        <!-- Actions -->
        <div class="mt-6 flex justify-end gap-3">
          <button type="button" class="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400" @click="emit('close')">Cancel</button>
          <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Changes</button>
        </div>
      </form>
    </div>
  </div>
</template>
