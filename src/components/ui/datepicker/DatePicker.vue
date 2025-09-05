<template>
  <div class="relative w-full max-w-sm sm:max-w-full">
    <!-- Input with icon -->
    <div class="relative">
      <input
        type="text"
        v-model="displayValue"
        @focus="toggleDropdown(true)"
        readonly
        :placeholder="placeholder"
        :class="cn(
          'w-full h-11 rounded-xl border border-gray-300 bg-gray-50 px-4 pr-10 text-base sm:text-sm text-gray-700 shadow-sm outline-none transition-all duration-200 ease-in-out',
          'focus:border-blue-500 focus:ring-1 focus:ring-blue-400 focus:ring-offset-0 hover:border-blue-400',
          'placeholder:text-gray-400',
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100',
          className
        )"
      />
      <!-- Calendar icon -->
      <span
        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer transition-transform duration-200"
        :class="{ 'rotate-180': open }"
        @click="toggleDropdown()"
      >
        📅
      </span>
    </div>

    <!-- Smaller Calendar dropdown -->
    <div
      v-show="open"
      class="absolute z-20 mt-1 w-full sm:max-w-xs bg-white border border-gray-300 rounded-lg shadow-lg p-2 sm:p-1 overflow-auto"
    >
      <!-- Month navigation -->
      <div class="flex justify-between items-center mb-1 px-2">
        <button type="button" @click="prevMonth" class="p-1 hover:bg-gray-100 rounded text-sm sm:text-xs">
          ‹
        </button>
        <span class="font-medium text-sm sm:text-xs">{{ monthNames[currentMonth] }} {{ currentYear }}</span>
        <button type="button" @click="nextMonth" class="p-1 hover:bg-gray-100 rounded text-sm sm:text-xs">
          ›
        </button>
      </div>

      <!-- Weekdays -->
      <div class="grid grid-cols-7 text-center text-gray-500 text-xs sm:text-[10px] mb-1">
        <span v-for="day in weekDays" :key="day">{{ day }}</span>
      </div>

      <!-- Dates -->
      <div class="grid grid-cols-7 text-center gap-0.5 sm:gap-0">
        <span v-for="(day, index) in blanks" :key="'b' + index" class="py-1 text-gray-300 text-xs sm:text-[10px]"></span>
        <button
          v-for="day in daysInMonth"
          :key="day"
          @click="selectDate(day)"
          type="button"
          class="py-1 rounded transition-colors text-xs sm:text-[10px]"
          :class="{
            'bg-blue-500 text-white': isSelected(day),
            'text-gray-700 hover:bg-blue-100': !isSelected(day)
          }"
        >
          {{ day }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps({
  modelValue: { type: String, default: "" },
  placeholder: { type: String, default: "Select date" },
  class: { type: String, default: "" },
});

const emit = defineEmits(["update:modelValue"]);

const open = ref(false);
const selectedDate = ref(props.modelValue ? new Date(props.modelValue) : null);
const className = props.class;

// Display value in input
const displayValue = computed(() => selectedDate.value ? selectedDate.value.toLocaleDateString() : "");

// Month & year
const today = new Date();
const currentMonth = ref(today.getMonth());
const currentYear = ref(today.getFullYear());
const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const weekDays = ["Su","Mo","Tu","We","Th","Fr","Sa"];

const daysInMonth = computed(() =>
  Array.from({ length: new Date(currentYear.value, currentMonth.value + 1, 0).getDate() }, (_, i) => i + 1)
);

const blanks = computed(() => {
  const firstDay = new Date(currentYear.value, currentMonth.value, 1).getDay();
  return Array.from({ length: firstDay }, () => 0);
});


function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else currentMonth.value--;
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else currentMonth.value++;
}

function selectDate(day) {
  const date = new Date(currentYear.value, currentMonth.value, day);
  selectedDate.value = date;
  emit("update:modelValue", date.toISOString().split("T")[0]);
  open.value = false;
}

function isSelected(day) {
  return selectedDate.value &&
    selectedDate.value.getDate() === day &&
    selectedDate.value.getMonth() === currentMonth.value &&
    selectedDate.value.getFullYear() === currentYear.value;
}

function toggleDropdown(force) {
  open.value = force !== undefined ? force : !open.value;
}

// Close when clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".relative")) open.value = false;
});

watch(() => props.modelValue, val => {
  if (val) selectedDate.value = new Date(val);
});
</script>

<style scoped>
div::-webkit-scrollbar {
  width: 6px;
}
div::-webkit-scrollbar-thumb {
  background-color: rgba(107, 114, 128, 0.5);
  border-radius: 4px;
}
</style>
