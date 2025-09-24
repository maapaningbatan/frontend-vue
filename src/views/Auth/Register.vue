<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-blue-100 p-6">
    <div class="flex w-full max-w-7xl bg-white shadow-2xl rounded-3xl overflow-hidden">
      
      <!-- LEFT SIDE (Illustration, hidden on small) -->
      <div class="hidden lg:flex w-1/3 items-center justify-center bg-blue-100">
        <img src="/images/image2.png" alt="Illustration" class="w-3/4" />
      </div>

      <!-- RIGHT SIDE (Form) -->
      <div class="flex flex-col w-full lg:w-2/3 p-8">
        <!-- Logo + Title -->
        <div class="flex items-center space-x-4 mb-6">
          <img src="/images/logo.png" alt="Logo" class="w-12 sm:w-14 h-auto" />
          <h1 class="text-xl sm:text-2xl font-bold text-cyan-800">
            PREMIS <span class="text-sm font-normal text-gray-500">Version.2</span>
          </h1>
        </div>

        <!-- Form -->
        <form @submit.prevent="register" class="flex flex-col gap-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Username -->
            <div>
              <label class="block text-sm font-medium mb-1">Username <span class="text-red-500">*</span></label>
              <Input v-model="form.username" type="text" placeholder="Username" class="input"/>
            </div>

            <!-- Email -->
            <div>
              <label class="block text-sm font-medium mb-1">Email <span class="text-red-500">*</span></label>
              <Input v-model="form.email" type="email" placeholder="Email" class="input"/>
            </div>

            <!-- Password -->
            <div>
              <label class="block text-sm font-medium mb-1">Password <span class="text-red-500">*</span></label>
              <Input v-model="form.password" type="password" placeholder="Password" class="input"/>
            </div>

            <!-- Confirm Password -->
            <div>
              <label class="block text-sm font-medium mb-1">Confirm Password <span class="text-red-500">*</span></label>
              <Input v-model="form.password_confirmation" type="password" placeholder="Confirm Password" class="input"/>
            </div>

            <!-- First Name -->
            <div>
              <label class="block text-sm font-medium mb-1">First Name <span class="text-red-500">*</span></label>
              <Input v-model="form.first_name" type="text" placeholder="First Name" class="input"/>
            </div>

            <!-- Middle Name -->
            <div>
              <label class="block text-sm font-medium mb-1">Middle Name</label>
              <Input v-model="form.middle_name" type="text" placeholder="Middle Name" class="input"/>
            </div>

            <!-- Last Name -->
            <div>
              <label class="block text-sm font-medium mb-1">Last Name <span class="text-red-500">*</span></label>
              <Input v-model="form.last_name" type="text" placeholder="Last Name" class="input"/>
            </div>

            <!-- Extension Name -->
            <div>
              <label class="block text-sm font-medium mb-1">Extension Name</label>
              <Input v-model="form.suffix" type="text" placeholder="Jr./Sr." class="input"/>
            </div>

            <!-- Position -->
            <div>
              <label class="block text-sm font-medium mb-1">Position <span class="text-red-500">*</span></label>
              <Select v-model="form.position_id" :options="positions.map(p => ({ value: p.id, label: p.position_desc }))" placeholder="Select Position" class="input"/>
            </div>

            <!-- Region -->
            <div>
              <label class="block text-sm font-medium mb-1">Region <span class="text-red-500">*</span></label>
              <Select v-model="form.region_id" :options="regions.map(r => ({ value: r.id, label: r.region_code }))" placeholder="Select Region" class="input"/>
            </div>
</div>
            <!-- Office (full-width row) -->
<div class="mt-4">
  <label class="block text-sm font-medium mb-1">Office <span class="text-red-500">*</span></label>
  <Select
    v-model="form.office_id"
    :options="offices.map(o => ({ value: o.id, label: o.office_desc }))"
    placeholder="Select Office"
    class="input"
    :disabled="!form.region_id"
  />
</div>

<!-- Division (full-width row) -->
<div class="mt-4">
  <label class="block text-sm font-medium mb-1">Division <span class="text-red-500">*</span></label>
  <Select
    v-model="form.division_id"
    :options="divisions.map(d => ({ value: d.id, label: d.division_desc }))"
    placeholder="Select Division"
    class="input"
    :disabled="!form.office_id"
  />
</div>


          

          <button type="submit" class="mt-4 px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-700 text-white">
            Register
          </button>

          <p class="text-sm text-gray-600 text-center mt-4">
            Already have an account?
            <router-link to="/auth/login" class="text-cyan-600 font-semibold hover:underline">Go to Login</router-link>
          </p>

          <p v-if="successMessage" class="text-green-600 text-center mt-2">{{ successMessage }}</p>
          <p v-if="errorMessage" class="text-red-600 text-center mt-2">{{ errorMessage }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch, onMounted } from 'vue'
import axios from 'axios'
import Input from '@/components/ui/input/Input.vue'
import Select from '@/components/ui/select/Select.vue'
import { useRouter } from 'vue-router'

axios.defaults.baseURL = 'http://localhost:8000/api'

const router = useRouter()
const form = reactive({
  username: '', email: '', password: '', password_confirmation: '',
  first_name: '', middle_name: '', last_name: '', suffix: '',
  position_id: '', region_id: '', office_id: ''
})
const positions = ref([])
const regions = ref([])
const offices = ref([])
const successMessage = ref('')
const errorMessage = ref('')
const errors = reactive({})
const divisions = ref([])

// Fetch positions and regions
onMounted(async () => {
  try {
    const [posRes, regRes] = await Promise.all([
      axios.get('/positions'),
      axios.get('/regions')
    ])
    positions.value = posRes.data
    regions.value = regRes.data
  } catch (err) {
    console.error(err)
  }
})

// Watch Region → fetch Offices
watch(() => form.region_id, async (regionId) => {
  offices.value = []
  form.office_id = null
  if (!regionId) return
  try {
    const res = await axios.get(`/offices/region/${regionId}`)
    offices.value = res.data
  } catch (err) {
    console.error(err)
  }
})

// Watch Office → fetch Divisions
watch(() => form.office_id, async (officeId) => {
  divisions.value = []
  form.division_id = null
  if (!officeId) return
  try {
    const res = await axios.get(`/divisions/office/${officeId}`)
    divisions.value = res.data
  } catch (err) {
    console.error(err)
  }
})

function validateForm() {
  Object.keys(errors).forEach(k => delete errors[k])
  if (!form.username) errors.username = 'Required'
  if (!form.first_name) errors.first_name = 'Required'
  if (!form.last_name) errors.last_name = 'Required'
  if (!form.email) errors.email = 'Required'
  if (!form.password) errors.password = 'Required'
  if (form.password !== form.password_confirmation) errors.password_confirmation = 'Passwords do not match'
  if (!form.position_id) errors.position_id = 'Required'
  if (!form.region_id) errors.region_id = 'Required'
  if (!form.office_id) errors.office_id = 'Required'
  if (!form.division_id) errors.division_id = 'Required'
  return Object.keys(errors).length === 0
}

async function register() {
  if (!validateForm()) return

  try {
    // If using api.php routes, add /api prefix
    const res = await axios.post('/register', { ...form })

    if (res.status === 200 || res.status === 201) {
      successMessage.value = 'Account created! Wait for admin activation.'
      setTimeout(() => router.push('/auth/login'), 1500)
    }
  } catch (err) {
    if (err.response?.status === 422) {
      // Validation errors from backend
      Object.assign(errors, err.response.data.errors)
    } else {
      errorMessage.value = err.response?.data?.message || 'Registration failed'
    }
    console.error(err)
  }
}
</script>

<style scoped>
.input { @apply w-full rounded-xl border border-gray-300 px-4 py-2 text-gray-700 focus:ring-2 focus:ring-cyan-500 outline-none; }
</style>
