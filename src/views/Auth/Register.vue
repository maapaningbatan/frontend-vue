<template>
<div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100 p-6">
    <div class="w-full max-w-6xl bg-white rounded-2xl shadow-2xl p-10">
<div class="flex items-center space-x-4 mb-8">
        <img src="/images/logo.png" alt="Logo" class="w-14 h-auto" />
        <div>
          <h1 class="text-2xl font-bold text-cyan-800">WELCOME TO PREMIS</h1>
          <p class="text-sm text-gray-600">Please fill out this short form accurately to create your account.</p>
        </div>
      </div>
      <form @submit.prevent="register" enctype="multipart/form-data" class="space-y-8">
        
        <!-- User Credentials -->
        <div>
          <h3 class="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">User Credentials</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium mb-1">Username <span class="text-red-500">*</span></label>
                <div class="relative">
              <User class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input v-model="form.username" type="text" class="input w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-600 text-sm" 
                  placeholder="Enter your Username" />
                <p v-if="errors.username" class="text-red-500 text-sm mt-1">{{ errors.username }}</p>
                </div>
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Email<span class="text-red-500">*</span></label>
              <div class="relative">
              <Mail class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input v-model="form.email_address" type="email" class="input w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-600 text-sm"
                  placeholder="Enter your Email"/>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Password<span class="text-red-500">*</span></label>
              <div class="relative">
              <Lock class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input v-model="form.password" type="password" class="input w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-600 text-sm"
                  placeholder="Enter your Password" />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Confirm Password<span class="text-red-500">*</span></label>
              <div class="relative">
              <Lock class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input v-model="form.password_confirmation" type="password" class="input w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-600 text-sm"
                  placeholder="Confirm your Password" />
              </div>
            </div>
          </div>
        </div>

        <!-- Personal Information -->
        <div>
          <h3 class="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Personal Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium mb-1">Honorifics</label>
              <div class="relative">
              <UserStar  class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input v-model="form.honorifics" type="text" placeholder="Mr./Ms./Atty./Dir." class="input w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-600 text-sm" />
            </div>
          </div>

            <div>
              <label class="block text-sm font-medium mb-1">First Name<span class="text-red-500">*</span></label>
              <div class="relative">
              <FolderPen  class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input v-model="form.first_name" type="text" class="input w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-600 text-sm" placeholder="First Name"/>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Middle Name</label>
              <Input v-model="form.middle_name" type="text" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Last Name<span class="text-red-500">*</span></label>
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
              <label class="block text-sm font-medium mb-1">Sex<span class="text-red-500">*</span></label>
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
              <label class="block text-sm font-medium mb-1">Contact Number<span class="text-red-500">*</span></label>
              <Input v-model="form.contact_number" type="text" />
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium mb-1">Address<span class="text-red-500">*</span></label>
              <Input v-model="form.address" type="text" />
            </div>
          </div>
        </div>

        <!-- Employee Details -->
        <div>
          <h3 class="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Employee Details</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium mb-1">Employee ID<span class="text-red-500">*</span></label>
              <Input v-model="form.employee_id" type="text" />
            </div>
            <div>
    <label class="block text-sm font-medium mb-1">Position<span class="text-red-500">*</span></label>
    <Select
      v-model="form.position"
      :options="positions.map(pos => ({ value: pos.Position_Id, label: pos.Position }))"
      placeholder="Select Position"
    />
  </div>

   <div>
      <label class="block text-sm font-medium mb-1">Region<span class="text-red-500">*</span></label>
      <Select
        v-model="form.region"
        :options="regions.map(r => ({ value: r.Region_Id, label: r.Region }))"
        placeholder="Select Region"
      />
    </div>

    <!-- Office -->
    <div>
      <label class="block text-sm font-medium mb-1">Office<span class="text-red-500">*</span></label>
      <Select
        v-model="form.office"
        :options="offices.map(o => ({ value: o.Office_Id, label: o.Office_Desc }))"
        placeholder="Select Office"
        :disabled="!form.region"
      />
    </div>

    <!-- Division -->
    <div>
      <label class="block text-sm font-medium mb-1">Division<span class="text-red-500">*</span></label>
      <Select
        v-model="form.division"
        :options="divisions.map(d => ({ value: d.Division_Id, label: d.Division_Desc }))"
        placeholder="Select Division"
        :disabled="!form.office"
      />
    </div>

  <div>
    <label class="block text-sm font-medium mb-1">Cluster<span class="text-red-500">*</span></label>
    <Select
      v-model="form.cluster"
      :options="clusters.map(c => ({ value: c.Cluster_Id, label: c.Cluster_Desc }))"
      placeholder="Select Cluster"
    />
  </div>

  <div>
    <label class="block text-sm font-medium mb-1">SOA<span class="text-red-500">*</span></label>
    <Select
      v-model="form.soa"
      :options="soas.map(s => ({ value: s.SOA_Id, label: s.Status_of_Appointment }))"
      placeholder="Select SOA"
    />
  </div>

 

  <div>
    <label class="block text-sm font-medium mb-1">User Level<span class="text-red-500">*</span></label>
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
          <label class="block text-sm font-medium mb-1">Upload Contract<span class="text-red-500">*</span></label>
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
import { User , Mail ,Lock  ,Upload , FolderPen , MapPinHouse, UserStar , VenusAndMars, Phone , BriefcaseBusiness, Globe , Building2, Building  , Group ,IdCardLanyard ,UserCog,UserLock,} from 'lucide-vue-next';

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





