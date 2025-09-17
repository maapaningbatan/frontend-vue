<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Input from '@/components/ui/input/Input.vue'
import TextArea from '@/components/ui/textarea/TextArea.vue'
import { Label } from 'reka-ui'

// Props from parent
const props = defineProps({
  risData: {
    type: Object,
    required: true
  }
})

// Dropdown data
const region = ref('')
const office = ref('')
const employees = ref<{ id: number; name: string }[]>([])

// Loading state
const loading = ref(true)

// Load user info + employees under same office
onMounted(async () => {
  loading.value = true
  try {
    // 1️⃣ Get logged-in user
    const userRes = await axios.get('http://localhost:8000/api/user-profile', { withCredentials: true })
    const userData = userRes.data

    // 2️⃣ Fetch division name (for office)
    if (userData.Division) {
      try {
        const divisionRes = await axios.get(`http://localhost:8000/api/divisions/${userData.Division}`)
        office.value = divisionRes.data.Division_Desc
      } catch (err) {
        console.warn('Could not fetch division:', err)
      }

      // 3️⃣ Fetch employees in the same division
      try {
        const empRes = await axios.get(`http://localhost:8000/api/employees?division_id=${userData.Division}`)
        employees.value = empRes.data.map((emp: any) => ({
          id: emp.EmployeeID,
          name: `${emp.First_Name} ${emp.Last_Name}`
        }))
      } catch (err) {
        console.warn('Could not fetch employees:', err)
        employees.value = []
      }
    }

    // 4️⃣ Fetch region
    if (userData.Region) {
      try {
        const regionRes = await axios.get(`http://localhost:8000/api/regions/${userData.Region}`)
        region.value = regionRes.data.Region_Desc
      } catch (err) {
        console.warn('Could not fetch region:', err)
        region.value = ''
      }
    }

    // Initialize parent risData fields if empty
    props.risData.region = region.value
    props.risData.office = office.value

  } catch (error) {
    console.error('Error fetching user data:', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="space-y-4">
    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-12 text-gray-500 font-semibold text-lg">
      Loading...
    </div>

    <div v-else>
      <!-- First Row: Responsibility Center, Fund Cluster, RIS Date -->
      <div class="grid grid-cols-3 gap-4">
        <div>
          <Label>Responsibility Center</Label>
          <Input v-model="props.risData.responsibility_center" placeholder="Responsibility Center" />
        </div>

        <div>
          <Label>Fund Cluster</Label>
          <Input v-model="props.risData.fund_cluster" placeholder="Fund Cluster" />
        </div>

        <div>
          <Label>RIS Date</Label>
          <Input type="date" v-model="props.risData.ris_date" />
        </div>
      </div>

      <!-- Second Row: Region, Office (disabled) -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <Label>Region</Label>
          <Input v-model="props.risData.region" disabled />
        </div>
        <div>
          <Label>Office</Label>
          <Input v-model="props.risData.office" disabled />
        </div>
      </div>

      <!-- Purpose -->
      <div>
        <Label>Purpose</Label>
        <TextArea v-model="props.risData.purpose" />
      </div>

      <!-- Third Row: Requested By, Received By, Approved By -->
      <div class="grid grid-cols-3 gap-4">
        <div>
          <Label>Requested By</Label>
          <select v-model="props.risData.requested_by" class="w-full border border-gray-300 rounded-lg px-3 py-2">
            <option value="">-- Select --</option>
            <option v-for="emp in employees" :key="emp.id" :value="emp.name">{{ emp.name }}</option>
          </select>
        </div>

        <div>
          <Label>Received By</Label>
          <select v-model="props.risData.received_by" class="w-full border border-gray-300 rounded-lg px-3 py-2">
            <option value="">-- Select --</option>
            <option v-for="emp in employees" :key="emp.id" :value="emp.name">{{ emp.name }}</option>
          </select>
        </div>
        <div>
          <Label>Approved By</Label>
          <select v-model="props.risData.approved_by" class="w-full border border-gray-300 rounded-lg px-3 py-2">
            <option value="">-- Select --</option>
            <option v-for="emp in employees" :key="emp.id" :value="emp.name">{{ emp.name }}</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>
