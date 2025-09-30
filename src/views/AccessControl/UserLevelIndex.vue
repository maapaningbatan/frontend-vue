
<template>
  <AppLayout :breadcrumbs="breadcrumbs">
    <div class="flex flex-col gap-6 p-6">
      <!-- Header -->
      <header class="mb-6 text-center sm:text-left">
        <h1 class="text-3xl font-bold text-gray-800">User Levels</h1>
      </header>

      <!-- Top Actions -->
      <section class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <!-- Search & Rows per Page -->
        <div class="flex items-center gap-3 w-full sm:w-auto">
          <div class="relative w-full sm:w-64">
            <Search
              class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"
            />
            <Input
              v-model="searchTerm"
              type="text"
              autocomplete="off"
              placeholder="Search levels..."
              class="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Paginator
            v-model:first="first"
            v-model:rows="rows"
            :totalRecords="totalRecords"
            :rowsPerPageOptions="[10, 20, 30, 40, 50]"
            template="RowsPerPageDropdown"
          />
        </div>
<!-- Create Module Button -->
<button
  class="px-6 py-2 bg-green-600 text-white font-medium rounded-lg shadow hover:bg-green-700 transition"
  @click="showAddModuleModal = true"
>
  + Add Module
</button>
        <!-- Create Button -->
        <button
          class="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition"
          @click="openCreateModal"
        >
          + Create Level
        </button>
<!-- Add Module Modal -->
<transition name="fade">
  <div
    v-if="showAddModuleModal"
    class="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-white/30"
  >
    <div class="bg-white rounded-lg shadow-lg w-3/4 max-w-3xl p-6 relative">
      <h2 class="text-lg font-semibold mb-4">Add New Module</h2>

      <!-- Module Name -->
      <div class="mb-3">
        <label class="block text-sm font-medium mb-1">Module Name</label>
        <input
          type="text"
          v-model="newModule.module_name"
          class="w-full border rounded px-3 py-2"
        />
      </div>

      <!-- Table Name -->
      <div class="mb-3">
        <label class="block text-sm font-medium mb-1">Table Name</label>
        <input
          type="text"
          v-model="newModule.table_name"
          class="w-full border rounded px-3 py-2"
        />
      </div>

      <!-- User Level Assignments -->
      <div class="mb-3">
        <label class="block text-sm font-medium mb-1">
          Assign Permissions to User Levels
        </label>
        <div
          v-for="level in userLevels"
          :key="level.id"
          class="border p-2 rounded mb-2"
        >
          <label class="inline-flex items-center mb-1">
            <input type="checkbox" v-model="selectedUserLevels[level.id]" class="mr-2" />
            {{ level.userlevel }}
          </label>
          <div
            v-if="selectedUserLevels[level.id]"
            class="flex gap-4 ml-6 mt-1"
          >
            <label><input type="checkbox" v-model="userLevelPermissions[level.id].add" /> Add</label>
            <label><input type="checkbox" v-model="userLevelPermissions[level.id].edit" /> Edit</label>
            <label><input type="checkbox" v-model="userLevelPermissions[level.id].view" /> View</label>
            <label><input type="checkbox" v-model="userLevelPermissions[level.id].delete" /> Delete</label>
          </div>
        </div>
      </div>

      <!-- Modal Buttons -->
      <div class="flex justify-end gap-2 mt-4">
        <button
          class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          @click="closeModuleModal"
        >
          Cancel
        </button>
        <button
          class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          @click="addModuleWithPermissions"
        >
          Save
        </button>
      </div>

      <!-- Close icon -->
      <button
        class="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        @click="closeModuleModal"
      >
        ✕
      </button>
    </div>
  </div>
</transition>

<!-- Create User Level Modal -->
<transition name="fade">
  <div
    v-if="isCreateModalOpen"
    class="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-white/30"
  >
    <div class="bg-white rounded-lg shadow-lg w-1/2 max-w-lg p-6 relative">
      <h2 class="text-lg font-semibold mb-4">Create User Level</h2>

      <!-- User Level Name -->
      <div class="mb-3">
        <label class="block text-sm font-medium mb-1">User Level Name</label>
        <input
          type="text"
          v-model="newLevel.userlevel"
          class="w-full border rounded px-3 py-2"
        />
      </div>

      <!-- Modal Buttons -->
      <div class="flex justify-end gap-2 mt-4">
        <button
          class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          @click="closeCreateModal"
        >
          Cancel
        </button>
        <button
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          @click="createLevel"
        >
          Save
        </button>
      </div>

      <!-- Close icon -->
      <button
        class="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        @click="closeCreateModal"
      >
        ✕
      </button>
    </div>
  </div>
</transition>

      </section>

      <!-- Loading / Error States -->
      <div v-if="loading" class="text-gray-500 text-center py-12">
        Loading user levels...
      </div>
      <div v-else-if="errorMsg" class="text-red-600 text-center py-12">
        {{ errorMsg }}
      </div>

      <!-- Table -->
      <div
        v-else
        class="overflow-x-auto rounded-lg shadow border border-gray-200"
      >
        <table class="min-w-full divide-y divide-gray-200">
<thead class="bg-gray-50">
  <tr>
    <th
      v-for="col in ['Name','Permissions','Actions']"
      :key="col"
      class="px-4 py-3 text-left text-sm font-semibold text-gray-600"
    >
      {{ col }}
    </th>
  </tr>
</thead>
<tbody class="bg-white divide-y divide-gray-200">
  <tr v-for="level in paginatedLevels" :key="level.id" class="hover:bg-blue-50 transition">
    <!-- Name -->
    <td class="px-4 py-3 text-sm font-medium text-gray-800">
      {{ level.userlevel }}
    </td>

<!-- Permissions Column -->
<td class="px-4 py-3 text-sm">
  <router-link
    :to="`/access-control/user-levels/${level.id}/permissions`"
    class="px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
  >
    Manage
  </router-link>
</td>

    <!-- Actions -->
    <td class="px-4 py-3 flex justify-center gap-2">
      <button
        class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
        @click="openEditModal(level)"
      >
        Edit
      </button>
      <button
        class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
        @click="openDeleteModal(level)"
      >
        Delete
      </button>
    </td>
  </tr>

  <tr v-if="!filteredLevels.length">
    <td colspan="5" class="p-6 text-center text-gray-400 italic">
      No user levels found.
    </td>
  </tr>
</tbody>


        </table>

        <!-- Footer Info -->
        <div class="bg-gray-50 px-4 py-2 text-sm text-gray-700 border-t flex justify-between">
          <span>
            Showing <strong>{{ startItem }}</strong> to <strong>{{ endItem }}</strong> of
            <strong>{{ totalRecords }}</strong> entries
          </span>
        </div>
      </div>

      <!-- Paginator -->
      <div class="mt-4 flex justify-center">
        <Paginator
          v-model:first="first"
          v-model:rows="rows"
          :totalRecords="totalRecords"
          :rowsPerPageOptions="[10, 20, 30]"
          class="shadow rounded-lg"
        />
      </div>

      <!-- Modals -->
      <UserLevelEdit
        v-if="isEditModalOpen && selectedLevel"
        :level="selectedLevel"
        @close="closeEditModal"
        @updated="fetchLevels"
      />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import AppLayout from '@/components/layouts/AppLayout.vue'
import { type BreadcrumbItem } from '@/types/api'
import Paginator from 'primevue/paginator'
import { Search } from 'lucide-vue-next'
import Input from '@/components/ui/Input.vue'
import axios from 'axios'

// Breadcrumbs
const breadcrumbs: BreadcrumbItem[] = [{ title: 'User Levels', href: '/user-levels' }]

// State
const loading = ref(false)
const errorMsg = ref<string | null>(null)
const levels = ref<any[]>([])

// Pagination
const first = ref(0)
const rows = ref(10)

// Search
const searchTerm = ref('')
const filteredLevels = computed(() => {
  if (!searchTerm.value.trim()) return levels.value
  const term = searchTerm.value.toLowerCase()
  return levels.value.filter(
    l =>
      l.userlevel.toLowerCase().includes(term) ||
      (l.permissions ?? '').toLowerCase().includes(term)
  )
})

// Paginated levels
const paginatedLevels = computed(() => {
  return filteredLevels.value.slice(first.value, first.value + rows.value)
})

// Computed for "Showing items"
const totalRecords = computed(() => filteredLevels.value.length)
const startItem = computed(() => (totalRecords.value === 0 ? 0 : first.value + 1))
const endItem = computed(() => {
  const end = first.value + rows.value
  return end > totalRecords.value ? totalRecords.value : end
})

// Fetch levels
const fetchLevels = async () => {
  loading.value = true
  errorMsg.value = null
  try {
    const res = await axios.get('http://localhost:8000/api/user-levels')
    levels.value = res.data
    // also hydrate userLevels state for module modal
    userLevels.value = res.data
    res.data.forEach((level: any) => {
      selectedUserLevels.value[level.id] = false
      userLevelPermissions.value[level.id] = { add: false, edit: false, view: false, delete: false }
    })
  } catch (e: any) {
    errorMsg.value = e?.response?.data?.message || 'Failed to load user levels.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchLevels)

// Modals
const isCreateModalOpen = ref(false)
const isEditModalOpen = ref(false)
const selectedLevel = ref<any | null>(null)

const openCreateModal = () => (isCreateModalOpen.value = true)
const openEditModal = (level: any) => {
  selectedLevel.value = level
  isEditModalOpen.value = true
}
const closeEditModal = () => (isEditModalOpen.value = false)

const openDeleteModal = (level: any) => {
  if (confirm(`Are you sure you want to delete "${level.userlevel}"?`)) {
    axios.delete(`http://localhost:8000/api/user-levels/${level.id}`).then(fetchLevels)
  }
}

// Module modal state
const showAddModuleModal = ref(false)
const newModule = ref({ module_name: '', table_name: '' })

const userLevels = ref<any[]>([])
const selectedUserLevels = ref<{ [key: number]: boolean }>({})
const userLevelPermissions = ref<{ [key: number]: any }>({})

const closeModuleModal = () => {
  showAddModuleModal.value = false
  newModule.value = { module_name: '', table_name: '' }
  userLevels.value.forEach((level: any) => {
    selectedUserLevels.value[level.id] = false
    userLevelPermissions.value[level.id] = { add: false, edit: false, view: false, delete: false }
  })
}

const addModuleWithPermissions = async () => {
  if (!newModule.value.module_name || !newModule.value.table_name) {
    alert('Please fill module name and table name.')
    return
  }

  const assignedLevels = Object.keys(selectedUserLevels.value)
    .map(id => Number(id))
    .filter(id => selectedUserLevels.value[id])

  if (!assignedLevels.length) {
    alert('Please select at least one user level.')
    return
  }

  const permissionsPayload = assignedLevels.map(levelId => {
    const perms = userLevelPermissions.value[levelId]
    return {
      userlevel_id: levelId,
      can_add: perms.add ? 1 : 0,
      can_edit: perms.edit ? 1 : 0,
      can_view: perms.view ? 1 : 0,
      can_delete: perms.delete ? 1 : 0,
    }
  })

  try {
    await axios.post('http://localhost:8000/api/addModuleWithPermissions', {
      module_name: newModule.value.module_name,
      table_name: newModule.value.table_name,
      permissions: permissionsPayload,
    })

    alert('✅ Module and permissions created!')
    closeModuleModal()
    fetchLevels()
  } catch (err) {
    console.error('❌ Add module error:', err)
    alert('Failed to add module.')
  }
}
</script>

