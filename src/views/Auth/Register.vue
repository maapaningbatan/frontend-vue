<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-blue-100 p-6"
  >
    <div class="flex w-full max-w-6xl bg-white shadow-2xl rounded-3xl overflow-hidden">
      <!-- LEFT SIDE (IMAGE, hidden on small) -->
<div class="hidden lg:flex w-1/3 items-center justify-center bg-blue-100">
        <img src="/images/image2.png" alt="Illustration" class="w-3/4" />
      </div>

      <!-- RIGHT SIDE (Form) -->
<div class="flex flex-col w-full lg:w-2/3 p-8">
        <!-- Logo + Title -->
        <div class="flex items-center space-x-4 mb-6">
          <img src="/images/logo.png" alt="Logo" class="w-12 sm:w-14 h-auto" />
          <div>
            <h1 class="text-xl sm:text-2xl font-bold text-cyan-800">
              PREMIS <span class="text-sm font-normal text-gray-500">Version.2</span>
            </h1>
          </div>
        </div>

        <!-- Stepper -->
        <div class="flex border-b mb-6">
          <button
            v-for="(step, index) in steps"
            :key="index"
            @click="currentStep = index"
            class="flex-1 py-2 text-center font-medium transition"
            :class="
              currentStep === index
                ? 'border-b-4 border-sky-500 text-sky-600'
                : 'text-gray-500 hover:text-sky-500'
            "
          >
            {{ step }}
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="register" class="flex flex-col flex-1 min-h-[600px]">
          <!-- Step 1: User Credentials -->
          <div v-if="currentStep === 0" class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Username -->
              <div>
                <label class="block text-sm font-medium mb-1">
                  Username <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <User
                    class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                  />
                  <Input
                    v-model="form.username"
                    type="text"
                    class="input w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-600 text-sm"
                    placeholder="Enter your Username"
                  />
                  <p v-if="errors?.username" class="text-red-500 text-sm mt-1">
                    {{ errors.username }}
                  </p>
                </div>
              </div>

              <!-- Email -->
              <div>
                <label class="block text-sm font-medium mb-1">
                  Email <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <Mail
                    class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                  />
                  <Input
                    v-model="form.email"
                    type="email"
                    class="input w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-600 text-sm"
                    placeholder="Enter your Email"
                  />
                </div>
              </div>

              <!-- Password -->
              <div>
                <label class="block text-sm font-medium mb-1">
                  Password <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <Lock
                    class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                  />
                  <Input
                    v-model="form.password"
                    type="password"
                    class="input w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-600 text-sm"
                    placeholder="Enter your Password"
                  />
                </div>
              </div>

              <!-- Confirm Password -->
              <div>
                <label class="block text-sm font-medium mb-1">
                  Confirm Password <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <Lock
                    class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                  />
                  <Input
                    v-model="form.password_confirmation"
                    type="password"
                    class="input w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-600 text-sm"
                    placeholder="Confirm your Password"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Step 2: Personal Information -->
          <div v-if="currentStep === 1" class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Honorifics -->
              <div>
                <label class="block text-sm font-medium mb-1">Honorifics</label>
                <div class="relative">
                  <UserStar
                    class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                  />
                  <Input
                    v-model="form.honorifics"
                    type="text"
                    placeholder="Mr./Ms./Atty./Dir."
                    class="input w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-600 text-sm"
                  />
                </div>
              </div>

              <!-- First Name -->
              <div>
                <label class="block text-sm font-medium mb-1">
                  First Name <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <FolderPen
                    class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                  />
                  <Input
                    v-model="form.first_name"
                    type="text"
                    class="input w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-600 text-sm"
                    placeholder="First Name"
                  />
                </div>
              </div>

              <!-- Middle Name -->
              <div>
                <label class="block text-sm font-medium mb-1">Middle Name</label>
                <div class="relative">
                  <FolderPen
                    class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                  />
                  <Input
                    v-model="form.middle_name"
                    type="text"
                    class="input w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-600 text-sm"
                    placeholder="Middle Name"
                  />
                </div>
              </div>

              <!-- Last Name -->
              <div>
                <label class="block text-sm font-medium mb-1">
                  Last Name <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <FolderPen
                    class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                  />
                  <Input
                    v-model="form.last_name"
                    type="text"
                    class="input w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-600 text-sm"
                    placeholder="Last Name"
                  />
                </div>
              </div>

              <!-- Suffix -->
              <div>
                <label class="block text-sm font-medium mb-1">Suffix</label>
                <div class="relative">
                  <FolderPen
                    class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                  />
                  <Input
                    v-model="form.suffix"
                    type="text"
                    class="input w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-600 text-sm"
                    placeholder="Jr./Sr."
                  />
                </div>
              </div>

              <!-- Title -->
              <div>
                <label class="block text-sm font-medium mb-1">Title</label>
                <div class="relative">
                  <FolderPen
                    class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                  />
                  <Input
                    v-model="form.title"
                    type="text"
                    class="input w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-600 text-sm"
                    placeholder="Title"
                  />
                </div>
              </div>

              <!-- Sex -->
              <div>
                <label class="block text-sm font-medium mb-1">
                  Sex <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <VenusAndMars
                    class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                  />
                  <Select
                    class="input w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-600 text-sm"
                    v-model="form.sex"
                    :options="[
                      { value: 0, label: 'Male' },
                      { value: 1, label: 'Female' },
                    ]"
                    placeholder="Select Sex"
                  />
                </div>
              </div>

              <!-- Contact Number -->
              <div>
                <label class="block text-sm font-medium mb-1">
                  Contact Number <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <Phone
                    class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                  />
                  <Input
                    v-model="form.contact_number"
                    type="text"
                    class="input w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-600 text-sm"
                    placeholder="Contact Number"
                  />
                </div>
              </div>

              <!-- Address -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium mb-1">
                  Address <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <MapPinHouse
                    class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                  />
                  <Input
                    v-model="form.address"
                    type="text"
                    class="input w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-600 text-sm"
                    placeholder="Address"
                  />
                </div>
              </div>
            </div>
          </div>

<!-- Step 3: Employee Details --> <div v-if="currentStep === 2" class="p-6"> <div> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"> <!-- Employee ID --> <div> <label class="block text-sm font-medium mb-1"> Employee ID <span class="text-red-500">*</span> </label> <div class="relative"> <FolderPen class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /> <Input v-model="form.employee_no" type="text" class="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-600 text-sm" placeholder="Employee ID" /> </div> </div> <!-- Position --> <div> <label class="block text-sm font-medium mb-1"> Position <span class="text-red-500">*</span> </label> <div class="relative"> <BriefcaseBusiness class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /> <Select v-model="form.position_id" class="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-600 text-sm" :options=" positions.map((pos) => ({ value: pos.id, label: pos.position_desc })) " placeholder="Select Position" /> </div> </div> <!-- Region --> <div> <label class="block text-sm font-medium mb-1"> Region <span class="text-red-500">*</span> </label> <div class="relative"> <Globe class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /> <Select v-model="form.region_id" class="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-600 text-sm" :options="regions.map((r) => ({ value: r.id, label: r.region_code }))" placeholder="Select Region" /> </div> </div> <!-- Office --> <div> <label class="block text-sm font-medium mb-1"> Office <span class="text-red-500">*</span> </label> <div class="relative"> <Building2 class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /> <Select v-model="form.office_id" class="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-600 text-sm" :options="offices.map((o) => ({ value: o.id, label: o.office_desc }))" placeholder="Select Office" :disabled="!form.region_id" /> </div> </div> <!-- Division --> <div> <label class="block text-sm font-medium mb-1"> Division <span class="text-red-500">*</span> </label> <div class="relative"> <Building class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /> <Select v-model="form.division_id" class="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-600 text-sm" :options=" divisions.map((d) => ({ value: d.id, label: d.division_desc })) " placeholder="Select Division" :disabled="!form.office_id" /> </div> </div> <!-- Cluster --> <div> <label class="block text-sm font-medium mb-1"> Cluster <span class="text-red-500">*</span> </label> <div class="relative"> <IdCardLanyard class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /> <Select v-model="form.cluster_id" class="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-600 text-sm" :options=" clusters.map((c) => ({ value: c.Cluster_Id, label: c.Cluster_Desc })) " placeholder="Select Cluster" /> </div> </div> <div> <label class="block text-sm font-medium mb-1"> Center <span class="text-red-500">*</span> </label> <div class="relative"> <Building2 class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /> <Select v-model="form.center_id" class="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-600 text-sm" :options="centers.map((c) => ({ value: c.center_id, label: c.center_desc }))" placeholder="Select Center" /> </div> </div> <!-- SOA --> <div> <label class="block text-sm font-medium mb-1"> SOA <span class="text-red-500">*</span> </label> <div class="relative"> <UserCog class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /> <Select v-model="form.soa_id" class="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-600 text-sm" :options=" soas.map((s) => ({ value: s.SOA_Id, label: s.Status_of_Appointment })) " placeholder="Select SOA" /> </div> </div> </div> </div> </div>


          <!-- Step 4: Upload -->
          <div v-if="currentStep === 3" class="space-y-4">
            <label class="block text-sm font-medium mb-1"
              >Upload Contract<span class="text-red-500">*</span></label
            >
            <div class="relative flex items-center">
              <!-- 🔹 Icon -->
              <Upload class="absolute left-3 text-gray-400 w-5 h-5 pointer-events-none" />
              <input
                type="file"
                @change="handleFileUpload"
                class="file-input w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-600 text-sm cursor-pointer"
              />
            </div>
          </div>

          <!-- Navigation Buttons -->
          <div class="flex justify-between mt-8">
            <button
              v-if="currentStep > 0"
              type="button"
              @click="prevStep"
              class="px-6 py-2 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              Back
            </button>

            <button
              v-if="currentStep < steps.length - 1"
              type="button"
              @click="nextStep"
              class="ml-auto px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-700 transition-all duration-500"
            >
              Next
            </button>

            <button
              v-else
              type="submit"
              class="ml-auto px-6 py-2 rounded-xl bg-green-600 text-black hover:bg-green-700"
            >
              Register
            </button>
          </div>
          <p class="text-sm text-gray-600 text-center mt-6">
            Already have an account?
            <router-link to="/auth/login" class="text-cyan-600 font-semibold hover:underline"
              >Go to Login</router-link
            >
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import axios from 'axios'
import Input from '@/components/ui/input/Input.vue'
import Select from '@/components/ui/select/Select.vue'
import { useRouter } from 'vue-router'
import {
  User,
  Mail,
  Lock,
  Upload,
  FolderPen,
  MapPinHouse,
  UserStar,
  VenusAndMars,
  Phone,
  BriefcaseBusiness,
  Globe,
  Building2,
  Building,
  IdCardLanyard,
  UserCog,
} from 'lucide-vue-next'

// Set base URL for all Axios requests
axios.defaults.baseURL = 'http://localhost:8000/api'

// Stepper
const steps = ['User Credentials', 'Personal Info', 'Employee Details', 'Upload']
const currentStep = ref(0)
const router = useRouter()

// Dropdown data
const positions = ref([])
const regions = ref([])
const offices = ref([])
const divisions = ref([])
const clusters = ref([])
const soas = ref([])
const userLevels = ref([])
const centers = ref([])

// Form data
const form = reactive({
  username: '',
  email: '',
  password: '',
  password_confirmation: '',
  honorifics: '',
  first_name: '',
  middle_name: '',
  last_name: '',
  suffix: '',
  title: '',
  sex: '',
  contact_number: '',
  address: '',
  employee_no: '',
  position_id: '',
  region_id: '',
  office_id: '',
  division_id: '',
  cluster_id: '',
  user_level_id: '',
  soa_id: '',
  upload_contract: null,
  center_id: '',
})

// Validation errors
const errors = reactive({})
const successMessage = ref('')
const errorMessage = ref('')
const loading = ref(false)

// Validate form before submission
function validateForm() {
  Object.keys(errors).forEach((k) => delete errors[k])

  if (!form.username) errors.username = 'Please enter username'
  if (!form.email) errors.email = 'Please enter email'
  if (!form.password) errors.password = 'Please enter password'
  if (form.password !== form.password_confirmation)
    errors.password_confirmation = 'Passwords do not match'
  if (!form.first_name) errors.first_name = 'Please enter first name'
  if (!form.last_name) errors.last_name = 'Please enter last name'
  if (!form.region_id) errors.region_id = 'Please select region'
  if (offices.value.length && !form.office_id) errors.office_id = 'Please select office'
  if (divisions.value.length && !form.division_id) errors.division_id = 'Please select division'

  return Object.keys(errors).length === 0
}

// Fetch dropdowns on mount
onMounted(async () => {
  try {
    const [posRes, regRes, clusRes, soaRes, ulRes, cenRes] = await Promise.all([
      axios.get('/positions'),
      axios.get('/regions'),
      axios.get('/clusters'),
      axios.get('/status-of-appointments'),
      axios.get('/user-levels'),
      axios.get('/centers'),
    ])
    positions.value = posRes.data
    regions.value = regRes.data
    clusters.value = clusRes.data
    soas.value = soaRes.data
    userLevels.value = ulRes.data
    centers.value = cenRes.data
  } catch (err) {
    console.error('Error fetching dropdowns:', err)
  }
})

// Watch Region → fetch Offices
watch(() => form.region_id, async (regionId) => {
  offices.value = []
  form.office_id = null
  divisions.value = []
  form.division_id = null

  if (!regionId) return

  try {
    const res = await axios.get(`/offices/region/${regionId}`)
    offices.value = res.data
  } catch (err) {
    console.error('Error fetching offices:', err.response?.data || err.message)
  }
})

// Watch Office → fetch Divisions
watch(() => form.office_id, async (officeId) => {
    console.log("Selected office_id:", officeId)   // ✅ should log when you pick an office
  divisions.value = []
  form.division_id = null

  if (!officeId) return

  try {
    const res = await axios.get(`/divisions/office/${officeId}`)
        console.log("Division API response:", res.data)  // 👀 check this

    divisions.value = res.data
  } catch (err) {
    console.error('Error fetching divisions:', err.response?.data || err.message)
  }
})

// Handle file upload
function handleFileUpload(event) {
  form.upload_contract = event.target.files[0] || null
}

// Step navigation
const nextStep = () => {
  if (currentStep.value < steps.length - 1) currentStep.value++
}
const prevStep = () => {
  if (currentStep.value > 0) currentStep.value--
}

// Submit registration
async function register() {
  if (!validateForm()) return

  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const formData = new FormData()
    for (const key in form) {
      if (form[key] instanceof File) formData.append(key, form[key])
else if (form[key] !== null && form[key] !== '') {
  formData.append(key, form[key])
}    }

    const res = await axios.post('/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    if (res.status === 201 || res.status === 200) {
      successMessage.value = 'Registration successful! Contact admin for activation.'
      setTimeout(() => router.push({ path: '/auth/login' }), 1000)
    }
  } catch (err) {
    if (err.response?.status === 422) {
      Object.assign(errors, err.response.data.errors)
    } else {
      errorMessage.value = err.response?.data?.message || 'Registration failed'
    }
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>



<style scoped>
.input {
  @apply w-full rounded-xl border border-gray-300 px-4 py-2 text-gray-700 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none;
}
</style>
