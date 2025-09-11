<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import AppLayout from '@/components/layouts/AppLayout.vue'
import { type BreadcrumbItem } from '@/types/api'

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Settings', href: '/settings' },
]

const user = ref<any | null>(null)
const loading = ref(false)
const errorMsg = ref<string | null>(null)
const currentTab = ref(0)

const tabs = ['User Credentials', 'Personal Information', 'Employee Details', 'Uploaded Contract']

const fetchUser = async () => {
  loading.value = true
  errorMsg.value = null
  try {
    const res = await axios.get('http://localhost:8000/api/user-profile', {
      withCredentials: true,
    })
    user.value = res.data
  } catch (e: any) {
    errorMsg.value = e?.response?.data?.message || 'Failed to fetch user'
  } finally {
    loading.value = false
  }
}

onMounted(fetchUser)
</script>

<template>
  <AppLayout :breadcrumbs="breadcrumbs">
    <div class="flex h-full flex-1 flex-col gap-6 rounded-xl p-6 bg-gray-50">
      <h2 class="text-2xl font-bold text-gray-800">User Profile</h2>

      <!-- Tabs -->
      <div class="flex gap-3 border-b">
        <button
          v-for="(tab, idx) in tabs"
          :key="idx"
          @click="currentTab = idx"
          class="px-5 py-2 rounded-t-lg transition-all duration-200"
          :class="
            currentTab === idx
              ? 'bg-cyan-600 text-white shadow-md'
              : 'text-gray-600 hover:text-cyan-600 hover:bg-gray-100'
          "
        >
          {{ tab }}
        </button>
      </div>

      <!-- Loading / Error -->
      <div v-if="loading" class="p-6 text-gray-500 text-center">Loading user profile...</div>
      <div v-else-if="errorMsg" class="p-6 text-red-500 text-center">{{ errorMsg }}</div>

      <!-- Tab Content -->
      <div v-else-if="user" class="mt-4">
        <div class="bg-white rounded-xl shadow-md p-6 space-y-3">
          <!-- Tab 1: User Credentials -->
          <template v-if="currentTab === 0">
            <h3 class="text-lg font-semibold text-cyan-700 mb-2">User Credentials</h3>
            <p><span class="font-medium">Username:</span> {{ user.Username }}</p>
            <p><span class="font-medium">Email:</span> {{ user.Email_Address }}</p>
          </template>

          <!-- Tab 2: Personal Information -->
          <template v-else-if="currentTab === 1">
            <h3 class="text-lg font-semibold text-cyan-700 mb-2">Personal Information</h3>
            <p><span class="font-medium">Honorifics:</span> {{ user.Honorifics }}</p>
            <p><span class="font-medium">Full Name:</span> {{ user.First_Name }} {{ user.Middle_Name }} {{ user.Last_Name }} {{ user.Suffix }}</p>
            <p><span class="font-medium">Title:</span> {{ user.Title }}</p>
            <p>
              <span class="font-medium">Sex:</span>
              {{ user.Sex === 0 ? 'Male' : user.Sex === 1 ? 'Female' : 'Not Specified' }}
            </p>
            <p><span class="font-medium">Contact:</span> {{ user.Contact_Number }}</p>
            <p><span class="font-medium">Address:</span> {{ user.Address }}</p>
          </template>

          <!-- Tab 3: Employee Details -->
          <template v-else-if="currentTab === 2">
            <h3 class="text-lg font-semibold text-cyan-700 mb-2">Employee Details</h3>
            <p><span class="font-medium">Employee ID:</span> {{ user.Employee_Id }}</p>
            <p><span class="font-medium">Position:</span> {{ user.Position }}</p>
            <p><span class="font-medium">Region:</span> {{ user.Region }}</p>
            <p><span class="font-medium">Office:</span> {{ user.Office }}</p>
            <p><span class="font-medium">Division:</span> {{ user.Division }}</p>
            <p><span class="font-medium">Cluster:</span> {{ user.Cluster }}</p>
            <p><span class="font-medium">User Level:</span> {{ user.User_Level }}</p>
          </template>

          <!-- Tab 4: Uploaded Contract -->
          <template v-else-if="currentTab === 3">
            <h3 class="text-lg font-semibold text-cyan-700 mb-2">Uploaded Contract</h3>
            <div v-if="user.Upload_Contract" class="mt-2">
              <a
                :href="`http://localhost:8000/storage/${user.Upload_Contract}`"
                target="_blank"
                class="inline-block bg-cyan-600 text-white px-4 py-2 rounded-lg shadow hover:bg-cyan-700 transition"
              >
                View Contract
              </a>
            </div>
            <p v-else class="text-gray-500">No contract uploaded.</p>
          </template>
        </div>
      </div>
    </div>
  </AppLayout>
</template>
