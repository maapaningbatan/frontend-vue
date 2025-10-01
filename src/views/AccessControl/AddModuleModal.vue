```vue
<template>
  <!-- Add Module Modal -->
  <transition name="fade">
    <div
      class="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-white/30"
    >
      <div class="bg-white rounded-lg shadow-lg w-3/4 max-w-3xl p-6 relative">
        <h2 class="text-lg font-semibold mb-4">Add New Module</h2>

        <!-- Module Name -->
        <div class="mb-3">
          <label class="block text-sm font-medium mb-1">Module Name</label>
          <input
            type="text"
            v-model="newModule.module_name"
            class="w-full border rounded px-3 py-2"
          />
        </div>

        <!-- Table Name -->
        <div class="mb-3">
          <label class="block text-sm font-medium mb-1">Table Name</label>
          <input
            type="text"
            v-model="newModule.table_name"
            class="w-full border rounded px-3 py-2"
          />
        </div>

        <!-- User Level Assignments -->
        <div class="mb-3">
          <label class="block text-sm font-medium mb-1">
            Assign Permissions to User Levels
          </label>
          <div
            v-for="level in userLevels"
            :key="level.id"
            class="border p-2 rounded mb-2"
          >
            <label class="inline-flex items-center mb-1">
              <input
                type="checkbox"
                v-model="selectedUserLevels[level.id]"
                class="mr-2"
              />
              {{ level.userlevel }}
            </label>

            <div
              v-if="selectedUserLevels[level.id]"
              class="flex gap-4 ml-6 mt-1"
            >
              <label><input type="checkbox" v-model="userLevelPermissions[level.id].add" /> Add</label>
              <label><input type="checkbox" v-model="userLevelPermissions[level.id].edit" /> Edit</label>
              <label><input type="checkbox" v-model="userLevelPermissions[level.id].view" /> View</label>
              <label><input type="checkbox" v-model="userLevelPermissions[level.id].delete" /> Delete</label>
            </div>
          </div>
        </div>

        <!-- Modal Buttons -->
        <div class="flex justify-end gap-2 mt-4">
          <button
            class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            @click="emit('close')"
          >
            Cancel
          </button>
          <button
            class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            @click="addModuleWithPermissions"
          >
            Save
          </button>
        </div>

        <!-- Close icon -->
        <button
          class="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          @click="emit('close')"
        >
          ✕
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import axios from 'axios'

const props = defineProps<{ userLevels: any[] }>()
const emit = defineEmits(['close', 'saved'])

// State
const newModule = reactive({
  module_name: '',
  table_name: '',
})

const selectedUserLevels = reactive<Record<number, boolean>>({})
const userLevelPermissions = reactive<
  Record<number, { add: boolean; edit: boolean; view: boolean; delete: boolean }>
>({})

// Initialize permissions when userLevels change
watch(
  () => props.userLevels,
  (levels) => {
    if (!levels) return
    levels.forEach((lvl) => {
      if (!userLevelPermissions[lvl.id]) {
        userLevelPermissions[lvl.id] = {
          add: false,
          edit: false,
          view: false,
          delete: false,
        }
      }
      if (selectedUserLevels[lvl.id] === undefined) {
        selectedUserLevels[lvl.id] = false
      }
    })
  },
  { immediate: true }
)

const addModuleWithPermissions = async () => {
  if (!newModule.module_name || !newModule.table_name) {
    alert('Please fill module name and table name.')
    return
  }

  const assignedLevels = Object.keys(selectedUserLevels)
    .map(id => Number(id))
    .filter(id => selectedUserLevels[id])

  if (!assignedLevels.length) {
    alert('Please select at least one user level.')
    return
  }

  const permissionsPayload = assignedLevels.map(levelId => {
    const perms = userLevelPermissions[levelId]
    return {
      userlevel_id: levelId,
      can_add: perms.add ? 1 : 0,
      can_edit: perms.edit ? 1 : 0,
      can_view: perms.view ? 1 : 0,
      can_delete: perms.delete ? 1 : 0,
    }
  })

  try {
    await axios.post('http://localhost:8000/api/addModuleWithPermissions', {
      module_name: newModule.module_name,
      table_name: newModule.table_name,
      permissions: permissionsPayload,
    })

    alert('✅ Module and permissions created!')
    emit('saved')
    emit('close')
  } catch (err) {
    console.error('❌ Add module error:', err)
    alert('Failed to add module.')
  }
}
</script>
```
