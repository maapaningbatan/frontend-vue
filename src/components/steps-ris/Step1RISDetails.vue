<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Input from '@/components/ui/input/Input.vue'
import TextArea from '@/components/ui/textarea/TextArea.vue'
import { Label } from 'reka-ui'

// Form refs
const responsibilityCenter = ref('')
const fundCluster = ref('')
const risDate = ref('')
const purpose = ref('')
const requestedBy = ref('')
const receivedBy = ref('')
const approvedBy = ref('')

// Dropdown data
const region = ref('')
const office = ref('')
const employees = ref<{ id: number; name: string }[]>([])

// Load user info + employees under same office
onMounted(async () => {
  try {
    // 1️⃣ Get logged-in user
    const userRes = await axios.get('http://localhost:8000/api/user-profile')
    const userData = userRes.data
    console.log('Logged-in user data:', userData)

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
  } catch (error) {
    console.error('Error fetching user data:', error)
  }
})


</script>


<template>
  <div class="space-y-4">
    <div>
      <Label>Responsibility Center</Label>
      <Input v-model="responsibilityCenter" />
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <Label>Region</Label>
        <Input v-model="region" disabled />
      </div>
      <div>
        <Label>Office</Label>
        <Input v-model="office" disabled />
      </div>
    </div>

    <div>
      <Label>Fund Cluster</Label>
      <Input v-model="fundCluster" />
    </div>

    <div>
      <Label>RIS Date</Label>
      <Input type="date" v-model="risDate" />
    </div>

    <div>
      <Label>Purpose</Label>
      <TextArea v-model="purpose" />
    </div>

    <div class="grid grid-cols-3 gap-4">
      <div>
        <Label>Requested By</Label>
        <select
          v-model="requestedBy"
          class="w-full border rounded-lg p-2"
        >
          <option value="">-- Select --</option>
          <option v-for="emp in employees" :key="emp.id" :value="emp.name">
            {{ emp.name }}
          </option>
        </select>
      </div>

      <div>
        <Label>Received By</Label>
        <select
          v-model="receivedBy"
          class="w-full border rounded-lg p-2"
        >
          <option value="">-- Select --</option>
          <option v-for="emp in employees" :key="emp.id" :value="emp.name">
            {{ emp.name }}
          </option>
        </select>
      </div>

      <div>
        <Label>Approved By</Label>
        <Input v-model="approvedBy" />
      </div>
    </div>
  </div>
</template>
