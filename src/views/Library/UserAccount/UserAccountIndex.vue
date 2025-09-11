<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import AppLayout from '@/components/layouts/AppLayout.vue'
import { type BreadcrumbItem } from '@/types/api'
import Paginator from 'primevue/paginator'
import { Search } from 'lucide-vue-next'
import Input from '@/components/ui/Input.vue'
// import UserCreate from './UserCreate.vue'
// import UserEdit from './UserEdit.vue'
// import ConfirmDelete from './ConfirmDelete.vue'
import axios from 'axios'

// Breadcrumbs
const breadcrumbs: BreadcrumbItem[] = [{ title: 'User Accounts', href: '/users' }]

// State
const loading = ref(false)
const errorMsg = ref<string | null>(null)
const users = ref<any[]>([])

// Pagination
const first = ref(0)
const rows = ref(10)

// Search
const searchTerm = ref('')
const filteredUsers = computed(() => {
  if (!searchTerm.value.trim()) return users.value
  const term = searchTerm.value.toLowerCase()
  return users.value.filter(
    u =>
      u.Username.toLowerCase().includes(term) ||
      u.Email_Address.toLowerCase().includes(term) ||
      `${u.First_Name} ${u.Last_Name}`.toLowerCase().includes(term)
  )
})

// Computed for "Showing items X to Y of Z entries"
const totalRecords = computed(() => filteredUsers.value.length)
const startItem = computed(() => (totalRecords.value === 0 ? 0 : first.value + 1))
const endItem = computed(() => {
  const end = first.value + rows.value
  return end > totalRecords.value ? totalRecords.value : end
})

// Fetch users
const fetchUsers = async () => {
  loading.value = true
  errorMsg.value = null
  try {
    const res = await axios.get('http://localhost:8000/api/users')
    users.value = res.data
  } catch (e: any) {
    errorMsg.value = e?.response?.data?.message || 'Failed to load users.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchUsers)

// Modals
const isCreateModalOpen = ref(false)
const isEditModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const selectedUser = ref<any | null>(null)

const openCreateModal = () => (isCreateModalOpen.value = true)
const closeCreateModal = () => (isCreateModalOpen.value = false)

const openEditModal = (user: any) => {
  selectedUser.value = user
  isEditModalOpen.value = true
}
const closeEditModal = () => (isEditModalOpen.value = false)

const openDeleteModal = (user: any) => {
  selectedUser.value = user
  isDeleteModalOpen.value = true
}
const closeDeleteModal = () => (isDeleteModalOpen.value = false)
</script>

<template>
  <AppLayout :breadcrumbs="breadcrumbs">
    <div class="flex flex-col gap-6 p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-800 text-center sm:text-left">
          User Accounts
        </h1>
      </div>

      <!-- Top Actions -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <!-- Search -->
        <div class="flex items-center gap-3">
          <div class="relative w-full sm:w-64">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              v-model="searchTerm"
              placeholder="Search users..."
              class="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Rows per page -->
          <Paginator
            v-model:first="first"
            v-model:rows="rows"
            :totalRecords="totalRecords"
            :rowsPerPageOptions="[10, 20, 30, 40, 50]"
            template="RowsPerPageDropdown"
          />
        </div>

        <!-- Create button -->
        <div>
          <button
            class="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition duration-200"
            @click="openCreateModal"
          >
            + Create User
          </button>
        </div>
      </div>

      <!-- Loading / Error -->
      <div v-if="loading" class="text-gray-500 text-center py-12">Loading users...</div>
      <div v-else-if="errorMsg" class="text-red-600 text-center py-12">{{ errorMsg }}</div>

      <!-- Table -->
      <div v-else class="overflow-x-auto rounded-lg shadow border border-gray-200">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="pl-10 px-4 py-3 text-left text-sm font-semibold text-gray-600">#</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Username</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Full Name</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Email</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Position</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Office</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600 text-center">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="(user, index) in filteredUsers.slice(first, first + rows)"
              :key="user.User_Id"
              class="hover:bg-blue-50 transition"
            >
              <td class="pl-10 pr-5 text-sm text-gray-700">{{ index + 1 }}</td>
              <td class="px-4 py-3 text-sm text-gray-800 font-medium">{{ user.Username }}</td>
              <td class="px-4 py-3 text-sm text-gray-500">
                {{ user.First_Name }} {{ user.Middle_Name ? user.Middle_Name.charAt(0) + '.' : '' }}
                {{ user.Last_Name }}
              </td>
              <td class="px-4 py-3 text-sm text-gray-500">{{ user.Email_Address }}</td>
              <td class="px-4 py-3 text-sm text-gray-500">{{ user.Position ?? '—' }}</td>
              <td class="px-4 py-3 text-sm text-gray-500">{{ user.Office ?? '—' }}</td>
              <td class="px-4 py-3">
                <span
                  class="px-2 py-1 rounded text-xs font-medium"
                  :class="user.Activated ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                >
                  {{ user.Activated ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-4 py-3 text-center flex justify-center gap-2">
                <button
                  class="px-3 py-1 bg-green-400 text-white rounded hover:bg-green-600 transition duration-200"
                  @click="openEditModal(user)"
                >
                  Edit
                </button>
                <button
                  class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition duration-200"
                  @click="openDeleteModal(user)"
                >
                  Delete
                </button>
              </td>
            </tr>

            <tr v-if="!filteredUsers.length">
              <td colspan="8" class="p-6 text-center text-gray-400 italic">
                No users found.
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Showing items info -->
        <div
          class="bg-gray-50 px-4 py-2 text-gray-700 text-sm rounded-b-lg border-t border-gray-200 flex justify-between items-center"
        >
          <span>
            Showing items <strong>{{ startItem }}</strong> to <strong>{{ endItem }}</strong> of
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
      <!-- <UserCreate v-if="isCreateModalOpen" @close="closeCreateModal" @created="fetchUsers" />
      <UserEdit v-if="isEditModalOpen && selectedUser" :user="selectedUser" @close="closeEditModal" @updated="fetchUsers" />
      <ConfirmDelete
        v-if="isDeleteModalOpen && selectedUser"
        :itemName="selectedUser.Username"
        :itemId="selectedUser.User_Id"
        deleteApiEndpoint="/api/users"
        @close="closeDeleteModal"
        @deleted="fetchUsers"
      /> -->
    </div>
  </AppLayout>
</template>
