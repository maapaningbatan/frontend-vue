<template>
  <AppLayout :breadcrumbs="breadcrumbs">
    <div class="p-6">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-xl font-semibold text-gray-800">
          Manage Permissions for: 
          <span class="text-blue-600">{{ level?.userlevel }}</span>
        </h1>
        <button
          class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow hover:bg-blue-700 focus:outline-none"
          @click="savePermissions"
        >
          Save Permissions
        </button>
      </div>

      <!-- Card -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left text-gray-600">
            <thead class="bg-gray-100 text-gray-700 uppercase text-xs font-semibold">
              <tr>
                <th class="px-6 py-3 border-b">Module</th>
                <th class="px-6 py-3 border-b text-center">Table Name</th>
                <th class="px-6 py-3 border-b text-center">Add</th>
                <th class="px-6 py-3 border-b text-center">Edit</th>
                <th class="px-6 py-3 border-b text-center">View</th>
                <th class="px-6 py-3 border-b text-center">Delete</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="module in modules"
                :key="module.id"
                class="hover:bg-gray-50"
              >
                <td class="px-6 py-3 border-b font-medium text-gray-800">
                  {{ module.module_name }}
                </td>
                <td class="px-6 py-3 border-b font-medium text-gray-800">
                  {{ module.table_name }}
                </td>
                <td class="px-6 py-3 border-b text-center">
                  <input
                    type="checkbox"
                    v-model="permissions[module.id].add"
                    class="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                </td>
                <td class="px-6 py-3 border-b text-center">
                  <input
                    type="checkbox"
                    v-model="permissions[module.id].edit"
                    class="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                </td>
                <td class="px-6 py-3 border-b text-center">
                  <input
                    type="checkbox"
                    v-model="permissions[module.id].view"
                    class="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                </td>
                <td class="px-6 py-3 border-b text-center">
                  <input
                    type="checkbox"
                    v-model="permissions[module.id].delete"
                    class="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </AppLayout>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import AppLayout from '@/components/layouts/AppLayout.vue'

const breadcrumbs = [
  { title: 'Access Control', href: '/access-control' },
  { title: 'User Levels', href: '/access-control/user-levels' },
  { title: 'Permissions', href: '#' }
]

const route = useRoute()
const levelId = route.params.id

const level = ref<any>(null)
const modules = ref<any[]>([])
const permissions = ref<{ [key: string]: any }>({})

onMounted(async () => {
  try {
    // Fetch level
    const resLevel = await axios.get(`http://localhost:8000/api/user-levels/${levelId}`)
    level.value = resLevel.data

    // Fetch modules
    const resModules = await axios.get('http://localhost:8000/api/modules')
    modules.value = resModules.data

    // Initialize permissions object
    permissions.value = {}
    modules.value.forEach((m: any) => {
      permissions.value[m.id] = {
        add: false,
        edit: false,
        view: false,
        delete: false,
      }
    })

    // Fetch existing permissions for the level
    const resPerms = await axios.get(`http://localhost:8000/api/user-levels/${levelId}/permissions`)

    const permsArray = Array.isArray(resPerms.data)
      ? resPerms.data
      : Object.values(resPerms.data)

    permsArray.forEach((p: any) => {
      if (permissions.value[p.module_id]) {
        permissions.value[p.module_id] = {
          add: p.can_add === 1,
          edit: p.can_edit === 1,
          view: p.can_view === 1,
          delete: p.can_delete === 1,
        }
      }
    })
  } catch (err) {
    console.error(err)
  }
})





// Save
const savePermissions = async () => {
  try {
    await axios.put(`http://localhost:8000/api/user-levels/${levelId}/permissions`, {
      permissions: permissions.value
    })
    alert('Permissions saved!')
  } catch (err) {
    console.error(err)
    alert('Failed to save permissions')
  }
}
</script>

