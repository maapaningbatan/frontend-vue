<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-6">
    <div class="w-full max-w-5xl bg-white rounded-lg shadow-lg p-8 space-y-10">
      <h2 class="text-3xl font-bold text-blue-600 text-center">Register</h2>

      <form @submit.prevent="register" enctype="multipart/form-data" class="space-y-8">
        
        <!-- User Credentials -->
        <div>
          <h3 class="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">User Credentials</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium mb-1">Username <span class="text-red-500">*</span>
              </label>
              <Input v-model="form.username" type="text" />
                <p v-if="errors.username" class="text-red-500 text-sm mt-1">{{ errors.username }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Email</label>
              <Input v-model="form.email_address" type="email" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Password</label>
              <Input v-model="form.password" type="password" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Confirm Password</label>
              <Input v-model="form.password_confirmation" type="password" />
            </div>
          </div>
        </div>

        <!-- Personal Information -->
        <div>
          <h3 class="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Personal Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium mb-1">Honorifics</label>
              <Input v-model="form.honorifics" type="text" placeholder="Mr./Ms./Dr." />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">First Name</label>
              <Input v-model="form.first_name" type="text" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Middle Name</label>
              <Input v-model="form.middle_name" type="text" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Last Name</label>
              <Input v-model="form.last_name" type="text" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Suffix</label>
              <Input v-model="form.suffix" type="text" placeholder="Jr./Sr." />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Title</label>
              <Input v-model="form.title" type="text" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Sex</label>
             <Select
  v-model="form.sex"
  :options="[
    { value: 0, label: 'Male' },
    { value: 1, label: 'Female' }
  ]"
  placeholder="Select Sex"
/>
            
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Contact Number</label>
              <Input v-model="form.contact_number" type="text" />
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium mb-1">Address</label>
              <Input v-model="form.address" type="text" />
            </div>
          </div>
        </div>

        <!-- Employee Details -->
        <div>
          <h3 class="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Employee Details</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium mb-1">Employee ID</label>
              <Input v-model="form.employee_id" type="text" />
            </div>
            <div>
    <label class="block text-sm font-medium mb-1">Position</label>
    <Select
      v-model="form.position"
      :options="positions.map(pos => ({ value: pos.Position_Id, label: pos.Position }))"
      placeholder="Select Position"
    />
  </div>

   <div>
      <label class="block text-sm font-medium mb-1">Region</label>
      <Select
        v-model="form.region"
        :options="regions.map(r => ({ value: r.Region_Id, label: r.Region }))"
        placeholder="Select Region"
      />
    </div>

    <!-- Office -->
    <div>
      <label class="block text-sm font-medium mb-1">Office</label>
      <Select
        v-model="form.office"
        :options="offices.map(o => ({ value: o.Office_Id, label: o.Office_Desc }))"
        placeholder="Select Office"
        :disabled="!form.region"
      />
    </div>

    <!-- Division -->
    <div>
      <label class="block text-sm font-medium mb-1">Division</label>
      <Select
        v-model="form.division"
        :options="divisions.map(d => ({ value: d.Division_Id, label: d.Division_Desc }))"
        placeholder="Select Division"
        :disabled="!form.office"
      />
    </div>

  <div>
    <label class="block text-sm font-medium mb-1">Cluster</label>
    <Select
      v-model="form.cluster"
      :options="clusters.map(c => ({ value: c.Cluster_Id, label: c.Cluster_Desc }))"
      placeholder="Select Cluster"
    />
  </div>

  <div>
    <label class="block text-sm font-medium mb-1">SOA</label>
    <Select
      v-model="form.soa"
      :options="soas.map(s => ({ value: s.SOA_Id, label: s.Status_of_Appointment }))"
      placeholder="Select SOA"
    />
  </div>

 

  <div>
    <label class="block text-sm font-medium mb-1">User Level</label>
    <Select
      v-model="form.user_level"
      :options="user_levels.map(u => ({ value: u.Userlevel_Id, label: u.Userlevel }))"
      placeholder="Select User Level"
    />
  </div>
</div>
          
        </div>

        <!-- File Upload -->
        <div>
          <h3 class="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Upload</h3>
          <label class="block text-sm font-medium mb-1">Upload Contract</label>
          <input type="file" @change="handleFileUpload" class="input" />
        </div>

        <!-- Submit -->
        <div>
          <button
            type="submit"
            class="w-full bg-sky-500 text-white font-semibold py-3 px-6 rounded-lg shadow hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-300"
          >
            Register
          </button>
        </div>
        <p v-if="errorMessage" class="text-red-600">{{ errorMessage }}</p>
      </form>
    </div>
  </div>
</template>


<script setup>
const errors = reactive({})

function validateForm() {
  // reset errors
  Object.keys(errors).forEach(k => delete errors[k])

  if (!form.username) errors.username = "Please insert username"
  if (!form.email_address) errors.email_address = "Please insert email"
  if (!form.password) errors.password = "Please insert password"
  if (form.password !== form.password_confirmation) {
    errors.password_confirmation = "Passwords do not match"
  }
  if (!form.first_name) errors.first_name = "Please insert first name"
  if (!form.last_name) errors.last_name = "Please insert last name"
  if (!form.region) errors.region = "Please select region"
  if (!form.office) errors.office = "Please select office"
  if (divisions.value.length > 0 && !form.division) {
  errors.division = "Please select division"
}
  // return true if valid
  return Object.keys(errors).length === 0
}
import { ref, reactive, onMounted, watch } from 'vue'
import axios from 'axios'
import Input from "@/components/ui/input/Input.vue";
import Select from "@/components/ui/select/Select.vue";
import { useRouter } from 'vue-router'

const router = useRouter()

// Dropdown data
const positions = ref([])
const regions = ref([])
const offices = ref([])
const divisions = ref([])
const clusters = ref([])
const soas = ref([])
const user_levels = ref([])

// Form state
const form = reactive({
  username: '',
  email_address: '',
  password: '',
  password_confirmation: '',
  honorifics: '',
  first_name: '',
  middle_name: '',
  last_name: '',
  suffix: '',
  sex: '',
  title: '',
  contact_number: '',
  address: '',
  employee_id: '',
  position: '',
  region: '',
  office: '',
  division: '',
  cluster: '',
  user_level: '',
  soa: '',
  upload_contract: null,
})

const successMessage = ref('')
const errorMessage = ref('')


// Fetch initial dropdowns
onMounted(async () => {
  try {
    const [
      positionsRes,
      regionsRes,
      clustersRes,
      soasRes,
      userLevelsRes
    ] = await Promise.all([
      axios.get('http://localhost:8000/api/positions'),
      axios.get('http://localhost:8000/api/regions'),
      axios.get('http://localhost:8000/api/clusters'),
      axios.get('http://localhost:8000/api/status-of-appointments'),
      axios.get('http://localhost:8000/api/user-levels'),
    ]);

    positions.value = positionsRes.data
    regions.value = regionsRes.data
    clusters.value = clustersRes.data
    soas.value = soasRes.data
    user_levels.value = userLevelsRes.data
  } catch (error) {
    console.error('Error fetching dropdowns:', error)
  }
})

// Cascading: Region → Office


watch(() => form.region, async (newRegion) => {
  if (newRegion) {
    try {
      const res = await axios.get(`http://localhost:8000/api/offices/region/${newRegion}`)
      offices.value = res.data
      form.office = null
      divisions.value = []
      form.division = null
    } catch (error) {
      console.error('Error fetching offices for region:', error)
    }
  } else {
    offices.value = []
    form.office = null
    divisions.value = []
    form.division = null
  }
})
// Cascading: Office → Division
watch(() => form.office, async (newOffice) => {
  if (newOffice) {
    try {
      const res = await axios.get(`http://localhost:8000/api/divisions/office/${newOffice}`)
      divisions.value = res.data
      form.division = null
    } catch (error) {
      console.error('Error fetching divisions for office:', error)
    }
  } else {
    divisions.value = []
    form.division = null
  }
})

// File upload
function handleFileUpload(event) {
  form.upload_contract = event.target.files[0] || null
}

// Submit form
async function register() {
  if (!validateForm()) {
    return // stop if errors exist
  }

  if (!form.division) {
  form.division = null
}
  try {
    const formData = new FormData()
    Object.keys(form).forEach(key => {
  if (form[key] instanceof File) {
    formData.append(key, form[key])
  } else if (form[key] === null || form[key] === undefined) {
    formData.append(key, "") // let backend handle nullable conversion
  } else {
    formData.append(key, form[key])
  }
})
    const res = await axios.post('http://localhost:8000/api/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    successMessage.value = "Please contact Administrator for Activation of Account"

    // Save message temporarily before redirect
    localStorage.setItem("registerSuccess", successMessage.value)

    // Redirect immediately (no delay)
    router.push('/login')
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Registration failed'
  }
}

</script>





