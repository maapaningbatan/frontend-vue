<template>
  <div class="relative w-full max-w-md sm:max-w-full">
    <!-- Input with arrow -->
    <div class="relative">
      <input
        v-model="search"
        @focus="openDropdown = true"
        @blur="onBlur"
        @keydown.down.prevent="highlightNext"
        @keydown.up.prevent="highlightPrev"
        @keydown.enter.prevent="selectHighlighted"
        type="text"
        :placeholder="placeholder"
        :class="cn(
          'w-full h-11 sm:h-10 rounded-xl border border-gray-300 bg-gray-50 px-4 pr-10 text-base sm:text-sm text-gray-700 shadow-sm outline-none transition-all duration-200 ease-in-out',
          'focus:border-blue-500 focus:ring-1 focus:ring-blue-400 focus:ring-offset-0 hover:border-blue-400',
          'placeholder:text-gray-400',
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100',
          className
        )"
        data-slot="input"
      />

      <!-- Chevron icon -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 sm:h-4 sm:w-4 text-gray-400 transition-transform duration-200"
        :class="{ 'rotate-180': openDropdown }"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M19 9l-7 7-7-7" />
      </svg>
    </div>

    <!-- Dropdown -->
    <ul
      v-show="openDropdown && filteredOptions.length"
      class="absolute z-20 w-full sm:max-w-full max-h-64 sm:max-h-48 overflow-y-auto mt-1 bg-white border border-gray-300 rounded-lg shadow-lg text-sm sm:text-xs"
    >
      <li
        v-for="(option, index) in visibleOptions"
        :key="option.value"
        @mousedown.prevent="select(option)"
        :class="[
          'px-4 py-2 cursor-pointer transition-colors',
          index + startIndex === highlightedIndex
            ? 'bg-blue-500 text-white'
            : 'hover:bg-gray-100'
        ]"
      >
        {{ option.label }}
      </li>
      <li v-if="filteredOptions.length === 0" class="px-4 py-2 text-gray-400 italic">
        No results found.
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useVModel } from "@vueuse/core";
import { cn } from "@/lib/utils";

const props = defineProps({
  options: { type: Array, required: true },
  modelValue: [String, Number],
  defaultValue: [String, Number],
  placeholder: { type: String, default: "Select..." },
  class: { type: String, default: "" },
  visibleCount: { type: Number, default: 50 },
});

const emit = defineEmits(["update:modelValue"]);

const className = props.class;

const modelValue = useVModel(props, "modelValue", emit, {
  defaultValue: props.defaultValue,
  passive: true,
});

const search = ref("");
const openDropdown = ref(false);
const highlightedIndex = ref(0);
const startIndex = ref(0);

const filteredOptions = computed(() =>
  (props.options || []).filter((opt) =>
    (opt?.label ?? "").toString().toLowerCase().includes((search.value ?? "").toLowerCase())
  )
);


const visibleOptions = computed(() =>
  filteredOptions.value.slice(startIndex.value, startIndex.value + props.visibleCount)
);

watch(
  () => modelValue.value,
  (val) => {
    const selected = props.options.find((opt) => opt.value === val);
    search.value = selected ? selected.label : "";
    highlightedIndex.value = 0;
    startIndex.value = 0;
  },
  { immediate: true }
);

function select(option) {
  modelValue.value = option.value;
  search.value = option.label;
  openDropdown.value = false;
}

function onBlur() {
  setTimeout(() => (openDropdown.value = false), 150);
}

function highlightNext() {
  if (highlightedIndex.value < filteredOptions.value.length - 1) {
    highlightedIndex.value++;
    if (highlightedIndex.value >= startIndex.value + props.visibleCount) startIndex.value++;
  }
}

function highlightPrev() {
  if (highlightedIndex.value > 0) {
    highlightedIndex.value--;
    if (highlightedIndex.value < startIndex.value) startIndex.value--;
  }
}

function selectHighlighted() {
  const option = filteredOptions.value[highlightedIndex.value];
  if (option) select(option);
}
</script>

<style scoped>
ul::-webkit-scrollbar {
  width: 6px;
}
ul::-webkit-scrollbar-thumb {
  background-color: rgba(107, 114, 128, 0.5);
  border-radius: 4px;
}
ul::-webkit-scrollbar-thumb:hover {
  background-color: rgba(107, 114, 128, 0.8);
}
</style>
