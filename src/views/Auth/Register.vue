<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-blue-100 p-6">
    <div class="flex w-full max-w-7xl bg-white shadow-2xl rounded-3xl overflow-hidden">

      <!-- LEFT SIDE (Illustration) -->
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



       
        <!-- Register Form (locked until agreement) -->
        <form 
          @submit.prevent="register" 
          class="flex flex-col gap-4 mt-6 relative z-0"
        >
          <!-- USER INFO GRID -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Username <span class="text-red-500">*</span></label>
              <Input v-model="form.username" type="text" placeholder="Username" class="input" />
              <p v-if="errors.username" class="text-red-500 text-sm mt-1">{{ errors.username }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Email <span class="text-red-500">*</span></label>
              <Input v-model="form.email" type="email" placeholder="Email" class="input" />
              <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Password <span class="text-red-500">*</span></label>
              <Input v-model="form.password" type="password" placeholder="Password" class="input" />
              <p v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Confirm Password <span class="text-red-500">*</span></label>
              <Input v-model="form.password_confirmation" type="password" placeholder="Confirm Password" class="input" />
              <p v-if="errors.password_confirmation" class="text-red-500 text-sm mt-1">{{ errors.password_confirmation }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">First Name <span class="text-red-500">*</span></label>
              <Input v-model="form.first_name" type="text" placeholder="First Name" class="input" />
              <p v-if="errors.first_name" class="text-red-500 text-sm mt-1">{{ errors.first_name }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Middle Name</label>
              <Input v-model="form.middle_name" type="text" placeholder="Middle Name" class="input" />
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Last Name <span class="text-red-500">*</span></label>
              <Input v-model="form.last_name" type="text" placeholder="Last Name" class="input" />
              <p v-if="errors.last_name" class="text-red-500 text-sm mt-1">{{ errors.last_name }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Extension Name</label>
              <Input v-model="form.suffix" type="text" placeholder="Jr./Sr." class="input" />
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Position <span class="text-red-500">*</span></label>
              <SelectSearch v-model="form.position_id" :options="positions.map(p => ({ value: p.id, label: p.position_desc }))" placeholder="Select Position" class="input" />
              <p v-if="errors.position_id" class="text-red-500 text-sm mt-1">{{ errors.position_id }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Region <span class="text-red-500">*</span></label>
              <SelectSearch v-model="form.region_id" :options="regions.map(r => ({ value: r.id, label: r.region_code }))" placeholder="Select Region" class="input" />
              <p v-if="errors.region_id" class="text-red-500 text-sm mt-1">{{ errors.region_id }}</p>
            </div>
          </div>

          <!-- Office -->
          <div class="mt-4">
            <label class="block text-sm font-medium mb-1">Office <span class="text-red-500">*</span></label>
            <SelectSearch
              v-model="form.office_id"
              :options="offices.map(o => ({ value: o.id, label: o.office_desc }))"
              placeholder="Select Office"
              class="input"
              :disabled="!form.region_id"
            />
            <p v-if="errors.office_id" class="text-red-500 text-sm mt-1">{{ errors.office_id }}</p>
          </div>

          <!-- Division -->
          <div class="mt-4">
            <label class="block text-sm font-medium mb-1">Division <span class="text-red-500">*</span></label>
            <SelectSearch
              v-model="form.division_id"
              :options="divisions.length ? divisions.map(d => ({ value: d.id, label: d.division_desc })) : []"
              placeholder="Select a division"
              class="input"
              :disabled="!form.office_id || divisions.length === 0"
            />
            <p v-if="errors.division_id" class="text-red-500 text-sm mt-1">{{ errors.division_id }}</p>
          </div>

          <button type="submit" class="mt-4 px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-700 text-white">
            Register
          </button>
 <p class="text-center mt-6">
  Already have an account?
  <router-link to="/auth/login" class="text-cyan-600 font-semibold hover:underline">
    Return to Login Page
  </router-link>
</p>
          <p v-if="successMessage" class="text-green-600 text-center mt-2">{{ successMessage }}</p>
          <p v-if="errorMessage" class="text-red-600 text-center mt-2">{{ errorMessage }}</p>
        </form>


        <!-- Modal -->
<transition name="fade">
  <div
    v-if="showAgreementModal"
    class="absolute inset-0 flex items-center justify-center z-50"
  >
    <!-- Blurred background -->
    <div class="absolute inset-0 backdrop-blur-sm bg-white/30"></div>

    <!-- Modal content -->
    <div class="bg-white p-6 rounded-xl w-full max-w-md relative z-10 shadow-lg">
      <h2 class="text-lg font-bold mb-4">Data Privacy Agreement</h2>
      <p class="text-sm mb-4">
DATA PRIVACY STATEMENT
By accomplishing this attendance form, you consent to the collection and use of the following personal information: 
Full name, office, position, sex, email address, contact number; and
The date and time when the participants submitted the form.
Your personal data will be kept confidential and will only be accessed by authorized personnel of the Administrative Service's Knowledge Management Team (Focal, Alternate Focal, Team Members from AS divisions) to ensure the protection of the client's personal data. It will not be shared with third parties without your consent, except as required by law.

By submitting this form, you acknowledge and agree to the terms outlined in this consent notice.      </p>
      <div class="flex items-center mb-4">
        <input type="checkbox" id="agree" v-model="agreed" class="mr-2" />
        <label for="agree" class="text-sm">
          I have read and agree to the Data Privacy Act
        </label>
      </div>
      <div class="flex justify-end">
        <!-- Cancel button now redirects to login -->
        <button 
          @click="router.push('/auth/login')" 
          class="mr-2 px-4 py-2 bg-gray-200 rounded"
        >
          Cancel
        </button>
        <!-- OK button unlocks form -->
        <button
          @click="unlockForm"
          :disabled="!agreed"
          class="px-4 py-2 bg-cyan-600 text-white rounded disabled:opacity-50"
        >
          OK
        </button>
      </div>
    </div>
  </div>
</transition>
      </div>
    </div>
  </div>

</template>

<script setup>
import { reactive, ref, watch, onMounted } from 'vue'
import axios from 'axios'
import Input from '@/components/ui/input/Input.vue'
import { useRouter } from 'vue-router'
import SelectSearch from '@/components/ui/select/SelectSearch.vue'

const router = useRouter()

// Form
const form = reactive({
  username: '',
  email: '',
  password: '',
  password_confirmation: '',
  first_name: '',
  middle_name: '',
  last_name: '',
  suffix: '',
  position_id: '',
  region_id: '',
  office_id: '',
  division_id: '',
})

const positions = ref([])
const regions = ref([])
const offices = ref([])
const divisions = ref([])

const successMessage = ref('')
const errorMessage = ref('')
const errors = reactive({})

// Modal & agreement
const showAgreementModal = ref(false)
const agreed = ref(false)


// Fetch positions and regions
onMounted(async () => {
  try {
    const [posRes, regRes] = await Promise.all([
      axios.get('/positions'),
      axios.get('/regions'),
    ])
    positions.value = posRes.data
    regions.value = regRes.data
  } catch (err) {
    console.error(err)
  }
})

// Watch region → fetch offices
watch(() => form.region_id, async (regionId) => {
  offices.value = []
  divisions.value = []
  form.office_id = null
  form.division_id = null

  if (!regionId) return
  try {
    const res = await axios.get(`/offices/region/${regionId}`)
    offices.value = res.data
  } catch (err) {
    console.error(err)
  }
})

// Watch office → fetch divisions
watch(() => form.office_id, async (officeId) => {
  form.division_id = null
  divisions.value = []
  if (!officeId) return
  try {
    const res = await axios.get(`/divisions/office/${officeId}`)
    divisions.value = res.data || []
  } catch (err) {
    console.error(err)
  }
})

onMounted(() => {
  // Show modal automatically when entering register.vue
  showAgreementModal.value = true
})

// Unlock form and close modal
function unlockForm() {
  if (agreed.value) showAgreementModal.value = false
}

// Validation
function validateForm() {
  Object.keys(errors).forEach(k => delete errors[k])
  if (!form.username) errors.username = 'Please enter username'
  if (!form.email) errors.email = 'Please enter email address'
  if (!form.password) errors.password = 'Please enter password'
  if (form.password !== form.password_confirmation)
    errors.password_confirmation = 'Passwords do not match'
  if (!form.first_name) errors.first_name = 'Please enter First Name'
  if (!form.last_name) errors.last_name = 'Please enter Last Name'
  if (!form.position_id) errors.position_id = 'Please enter Position'
  if (!form.region_id) errors.region_id = 'Please enter Region'
  if (!form.office_id) errors.office_id = 'Please enter Office'
  if (!form.division_id) errors.division_id = 'Please enter Division'

  return Object.keys(errors).length === 0
}

// Register
async function register() {
  if (!validateForm()) return

  try {
    const res = await axios.post('/register', { ...form })
    if (res.status === 200 || res.status === 201) {
      sessionStorage.setItem('registerSuccess', 'Account created! Wait for admin activation.')
      router.push('/auth/login')
    }
  } catch (err) {
    if (err.response?.status === 422) {
      Object.assign(errors, err.response.data.errors)
    } else {
      errorMessage.value = err.response?.data?.message || 'Registration failed'
    }
    console.error(err)
  }
}
</script>

<style scoped>
.input {
  @apply w-full rounded-xl border border-gray-300 px-4 py-2 text-gray-700 focus:ring-2 focus:ring-cyan-500 outline-none;
}
</style>
