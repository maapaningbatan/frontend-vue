<template>
  <div class="relative w-full max-w-md sm:max-w-full">
    <!-- Input with clear + dropdown -->
    <div class="relative">
      <input v-model="search" @focus="openDropdown = true" @blur="onBlur" @keydown.down.prevent="highlightNext"
        @keydown.up.prevent="highlightPrev" @keydown.enter.prevent="selectHighlighted"
        @keydown.esc.prevent="clearSelection" type="text" :placeholder="placeholder"
        :class="cn(baseInputClass, 'pr-10', className)" data-slot="input"
        :disabled="!props.options || props.options.length === 0" />

      <!-- Clear button -->
      <button v-if="search" type="button" @mousedown.prevent="clearSelection"
        class="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
        ✕
      </button>

      <!-- Chevron -->
      <svg xmlns="http://www.w3.org/2000/svg"
        class="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 sm:h-4 sm:w-4 text-gray-400 transition-transform duration-200"
        :class="{ 'rotate-180': openDropdown }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>

    <!-- Dropdown -->
    <ul v-show="openDropdown && filteredOptions.length"
      class="absolute z-20 w-full sm:max-w-full max-h-64 sm:max-h-48 overflow-y-auto mt-1 bg-white border border-gray-300 rounded-lg shadow-lg text-sm sm:text-xs">
      <li v-for="(option, index) in visibleOptions" :key="option.value" @mousedown.prevent="select(option)" :class="[
        'px-4 py-2 cursor-pointer transition-colors',
        index + startIndex === highlightedIndex
          ? 'bg-blue-500 text-white'
          : 'hover:bg-gray-100'
      ]">
        {{ option.label }}
      </li>
      <li v-if="filteredOptions.length === 0" class="px-4 py-2 text-gray-400 italic">
        No results found.
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue"
import { useVModel } from "@vueuse/core"
import { cn } from "@/lib/utils"
import { baseInputClass } from "@/lib/inputStyles"

interface Option {
  value: string | number
  label: string
}

const props = defineProps<{
  options: Option[]
  modelValue?: string | number | null
  defaultValue?: string | number | null
  placeholder?: string
  class?: string
  visibleCount?: number
}>()

const emit = defineEmits<{
  (e: "update:modelValue", value: string | number | null): void
}>()

const className = props.class ?? ""
const placeholder = props.placeholder ?? "Select..."
const visibleCount = props.visibleCount ?? 50

const modelValue = useVModel(props, "modelValue", emit, {
  defaultValue: props.defaultValue,
  passive: true,
})

const search = ref("")
const openDropdown = ref(false)
const highlightedIndex = ref(0)
const startIndex = ref(0)

const filteredOptions = computed(() =>
  (props.options || []).filter((opt) =>
    (opt?.label ?? "")
      .toString()
      .toLowerCase()
      .includes((search.value ?? "").toLowerCase())
  )
)

const visibleOptions = computed(() =>
  filteredOptions.value.slice(startIndex.value, startIndex.value + visibleCount)
)

watch(
  () => modelValue.value,
  (val) => {
    const selected = props.options.find((opt) => opt.value === val)
    search.value = selected ? selected.label : ""
    highlightedIndex.value = 0
    startIndex.value = 0
  },
  { immediate: true }
)

function select(option: Option) {
  modelValue.value = option.value
  search.value = option.label
  openDropdown.value = false
}

function clearSelection() {
  modelValue.value = null
  search.value = ""
  highlightedIndex.value = 0
  startIndex.value = 0
  openDropdown.value = false
}

function onBlur() {
  setTimeout(() => (openDropdown.value = false), 150)
}

function highlightNext() {
  if (highlightedIndex.value < filteredOptions.value.length - 1) {
    highlightedIndex.value++
    if (highlightedIndex.value >= startIndex.value + visibleCount) startIndex.value++
  }
}

function highlightPrev() {
  if (highlightedIndex.value > 0) {
    highlightedIndex.value--
    if (highlightedIndex.value < startIndex.value) startIndex.value--
  }
}

function selectHighlighted() {
  const option = filteredOptions.value[highlightedIndex.value]
  if (option) select(option)
}
</script>
