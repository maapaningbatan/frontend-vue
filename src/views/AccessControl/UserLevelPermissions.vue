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

      <!-- Permissions Table -->
      <div class="bg-white rounded-lg shadow overflow-x-auto">
        <table class="w-full text-sm text-left text-gray-600">
          <thead class="bg-gray-100 text-gray-700 uppercase text-xs font-semibold">
            <tr>
              <th class="px-6 py-3 border-b">ID</th>
              <th class="px-6 py-3 border-b text-center">Module</th>
              <th class="px-6 py-3 border-b text-center">Table Name</th>
              <th class="px-6 py-3 border-b text-center">
                <input type="checkbox" v-model="selectAll.add" @change="toggleAll('add')" /> Add
              </th>
              <th class="px-6 py-3 border-b text-center">
                <input type="checkbox" v-model="selectAll.edit" @change="toggleAll('edit')" /> Edit
              </th>
              <th class="px-6 py-3 border-b text-center">
                <input type="checkbox" v-model="selectAll.view" @change="toggleAll('view')" /> View
              </th>
              <th class="px-6 py-3 border-b text-center">
                <input type="checkbox" v-model="selectAll.delete" @change="toggleAll('delete')" /> Delete
              </th>
              <th class="px-6 py-3 border-b text-center">All</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="module in modules" :key="module.id" class="hover:bg-gray-50">
              <td class="px-6 py-3 border-b font-medium text-gray-800">
                {{ permissions[module.id]?.id ?? '-' }}
              </td>
              <td class="px-6 py-3 border-b font-medium text-gray-800">{{ module.module_name }}</td>
              <td class="px-6 py-3 border-b font-medium text-gray-800 text-center">{{ module.table_name }}</td>
              
              <td class="px-6 py-3 border-b text-center">
                <input type="checkbox" v-model="permissions[module.id].add" @change="updateModuleAll(module.id)" />
              </td>
              <td class="px-6 py-3 border-b text-center">
                <input type="checkbox" v-model="permissions[module.id].edit" @change="updateModuleAll(module.id)" />
              </td>
              <td class="px-6 py-3 border-b text-center">
                <input type="checkbox" v-model="permissions[module.id].view" @change="updateModuleAll(module.id)" />
              </td>
              <td class="px-6 py-3 border-b text-center">
                <input type="checkbox" v-model="permissions[module.id].delete" @change="updateModuleAll(module.id)" />
              </td>

              <td class="px-6 py-3 border-b text-center">
                <input type="checkbox" v-model="permissions[module.id].all" @change="toggleModule(module.id)" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import AppLayout from '@/components/layouts/AppLayout.vue'

// Axios baseURL
axios.defaults.baseURL = 'http://localhost:8000/api'

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
const selectAll = ref({ add: false, edit: false, view: false, delete: false })

onMounted(async () => {
  try {
    // Fetch user level info
    const resLevel = await axios.get(`/user-levels/${levelId}`)
    level.value = resLevel.data

    // Fetch all modules
    const resModules = await axios.get('/modules')
    modules.value = resModules.data

    // Initialize permissions
    permissions.value = {}
    modules.value.forEach(m => {
      permissions.value[m.id] = { add: false, edit: false, view: false, delete: false, all: false, id: null }
    })

    // Fetch existing permissions
    const resPerms = await axios.get(`/user-levels/${levelId}/permissions`)
    resPerms.data.forEach((p: any) => {
      if (permissions.value[p.module_id]) {
        permissions.value[p.module_id] = {
          id: p.id,
          add: p.can_add === 1,
          edit: p.can_edit === 1,
          view: p.can_view === 1,
          delete: p.can_delete === 1,
          all: p.can_add && p.can_edit && p.can_view && p.can_delete
        }
      }
    })
  } catch (err) {
    console.error('Fetch data error:', err)
    alert('Failed to load permissions.')
  }
})

const toggleAll = (type: 'add' | 'edit' | 'view' | 'delete') => {
  modules.value.forEach(m => {
    permissions.value[m.id][type] = selectAll.value[type]
    updateModuleAll(m.id)
  })
}

const toggleModule = (moduleId: number) => {
  const all = permissions.value[moduleId].all
  permissions.value[moduleId].add = all
  permissions.value[moduleId].edit = all
  permissions.value[moduleId].view = all
  permissions.value[moduleId].delete = all
}

const updateModuleAll = (moduleId: number) => {
  const perms = permissions.value[moduleId]
  perms.all = perms.add && perms.edit && perms.view && perms.delete
}

const savePermissions = async () => {
  try {
    const payload = Object.entries(permissions.value).map(([moduleId, perm]) => ({
      module_id: Number(moduleId),
      id: perm.id,
      can_add: perm.add ? 1 : 0,
      can_edit: perm.edit ? 1 : 0,
      can_view: perm.view ? 1 : 0,
      can_delete: perm.delete ? 1 : 0
    }))

    await axios.put(`/user-levels/${levelId}/permissions`, { permissions: payload })
    alert('Permissions saved successfully!')
  } catch (err: any) {
    console.error('Save permissions error:', err.response || err)
    alert('Failed to save permissions. Make sure you are logged in.')
  }
}
</script>
