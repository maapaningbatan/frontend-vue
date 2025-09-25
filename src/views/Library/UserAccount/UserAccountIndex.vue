<template>
  <AppLayout :breadcrumbs="breadcrumbs">
    <div class="flex flex-col gap-6 p-6">
      <!-- Header -->
      <header class="mb-6 text-center sm:text-left">
        <h1 class="text-3xl font-bold text-gray-800">User Accounts</h1>
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
              placeholder="Search users..."
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

        <!-- Create Button -->
        <button
          class="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition"
          @click="openCreateModal"
        >
          + Create User
        </button>
      </section>

      <!-- Loading / Error States -->
      <div v-if="loading" class="text-gray-500 text-center py-12">
        Loading users...
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
              <th v-for="col in ['Username','Full Name','Email','Position','Office','Status','Actions']"
                  :key="col"
                  class="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                {{ col }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="user in paginatedUsers"
              :key="user.User_Id"
              class="hover:bg-blue-50 transition"
            >
              <td class="px-4 py-3 text-sm font-medium text-gray-800">{{ user.Username }}</td>
              <td class="px-4 py-3 text-sm text-gray-500">
                {{ user.First_Name }}
                {{ user.Middle_Name ? user.Middle_Name.charAt(0) + '.' : '' }}
                {{ user.Last_Name }}
              </td>
              <td class="px-4 py-3 text-sm text-gray-500">{{ user.Email_Address }}</td>
              <td class="px-4 py-3 text-sm text-gray-500">{{ user.position_desc ?? '—' }}</td>
              <td class="px-4 py-3 text-sm text-gray-500">{{ user.office_desc ?? '—' }}</td>

              <!-- Status Toggle -->
              <td class="px-4 py-3 text-sm">
                <label class="relative inline-flex items-center cursor-pointer gap-2">
                  <input
                    type="checkbox"
                    class="sr-only peer"
                    :checked="user.Activated === 1"
                    @change.prevent="confirmToggleStatus(user)"
                  />
                  <div class="w-12 h-7 bg-red-300 rounded-full peer-checked:bg-green-500 transition-colors"></div>
                  <div class="absolute left-0.5 top-0.5 w-6 h-6 bg-white rounded-full shadow-md transform transition peer-checked:translate-x-5"></div>
                  <span
                    class="text-sm font-medium px-2 py-1 rounded select-none"
                    :class="user.Activated ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                  >
                    {{ user.Activated ? 'Active' : 'Inactive' }}
                  </span>
                </label>
              </td>

              <!-- Actions -->
              <td class="px-4 py-3 flex justify-center gap-2">
                <button
                  class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                  @click="openEditModal(user)"
                >
                  Edit
                </button>
                <button
                  class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                  @click="openDeleteModal(user)"
                >
                  Delete
                </button>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="!filteredUsers.length">
              <td colspan="7" class="p-6 text-center text-gray-400 italic">
                No users found.
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
      <UserEdit
        v-if="isEditModalOpen && selectedUser"
        :user="selectedUser"
        @close="closeEditModal"
        @updated="fetchUsers"
      />

      <!-- Status Confirmation Modal -->
      <div v-if="showStatusModal" class="fixed inset-0 flex items-center justify-center z-50">
        <!-- Blurred Backdrop -->
        <div
          class="absolute inset-0 bg-black/30 backdrop-blur-sm"
          @click="handleStatusCanceled"
        ></div>

        <!-- Modal Box -->
        <div class="relative bg-white p-6 rounded-lg shadow-lg w-96 text-center z-10">
          <h2 class="text-lg font-semibold mb-4">
            Confirm {{ statusAction === 'activate' ? 'Activation' : 'Deactivation' }}
          </h2>
          <p class="text-gray-600 mb-6">
            Are you sure you want to {{ statusAction }} this user?
          </p>
          <div class="flex justify-center gap-4">
            <button
              @click="handleStatusConfirmed"
              class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Yes
            </button>
            <button
              @click="handleStatusCanceled"
              class="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
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
import UserEdit from './UserAccountEdit.vue'
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

// Paginated users
const paginatedUsers = computed(() => {
  return filteredUsers.value.slice(first.value, first.value + rows.value)
})

// Computed for "Showing items"
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
const selectedUser = ref<any | null>(null)

const statusAction = ref('') // 'activate' or 'deactivate'
const showStatusModal = ref(false)
const statusUser = ref<any | null>(null)

const openCreateModal = () => (isCreateModalOpen.value = true)
const openEditModal = (user: any) => {
  selectedUser.value = user
  isEditModalOpen.value = true
}
const closeEditModal = () => (isEditModalOpen.value = false)

const confirmToggleStatus = (user: any) => {
  statusUser.value = user
  statusAction.value = user.Activated ? 'deactivate' : 'activate'
  showStatusModal.value = true
}

const handleStatusConfirmed = async () => {
  if (!statusUser.value) return
  try {
    const newStatus = statusUser.value.Activated ? 0 : 1
    await axios.patch(`http://localhost:8000/api/users/${statusUser.value.User_Id}/toggle`, {
      Activated: newStatus
    })
    statusUser.value.Activated = newStatus
  } catch (err: any) {
    console.error('Failed to update status:', err)
    alert('Failed to update user status.')
  } finally {
    showStatusModal.value = false
    statusUser.value = null
    statusAction.value = ''
  }
}

const handleStatusCanceled = () => {
  showStatusModal.value = false
  statusUser.value = null
  statusAction.value = ''
}
</script>
