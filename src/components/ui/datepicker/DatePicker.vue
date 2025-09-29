<template>
  <div class="relative w-full max-w-sm sm:max-w-full">
    <!-- Input with calendar icon -->
    <div class="relative">
      <input
        type="text"
        v-model="displayValue"
        @focus="toggleDropdown(true)"
        readonly
        :placeholder="placeholder"
        :class="cn(baseInputClass, className, 'cursor-pointer pr-10')"
      />
      <!-- Calendar Icon -->
      <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
      </span>
    </div>

    <!-- Calendar dropdown -->
    <div
      v-show="open"
      class="absolute z-30 mt-1 w-full sm:max-w-md bg-white rounded-lg shadow-lg ring-1 ring-black/5 p-4 flex flex-col border border-gray-200"
    >
      <!-- Header with navigation -->
      <div class="flex justify-between items-center mb-3">
        <button type="button" @click="prevMonth"
          class="p-1.5 rounded-md hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition">
          ‹
        </button>
        <span class="text-gray-800 text-sm">
          {{ monthNames[currentMonth] }} {{ currentYear }}
        </span>
        <button type="button" @click="nextMonth"
          class="p-1.5 rounded-md hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition">
          ›
        </button>
      </div>

      <!-- Weekdays -->
      <div class="grid grid-cols-7 text-center text-gray-500 text-xs mb-1">
        <span v-for="day in weekDays" :key="day">{{ day }}</span>
      </div>

      <!-- Dates -->
      <div class="grid grid-cols-7 text-center gap-1 mb-3">
        <span v-for="(day, index) in blanks" :key="'b' + index"
          class="py-2 text-gray-300 text-xs"></span>
        <button
          v-for="day in daysInMonth"
          :key="day"
          type="button"
          @click="selectDate(day)"
          class="py-2 text-sm rounded-full w-9 h-9 mx-auto flex items-center justify-center transition-colors duration-150"
          :class="{
            'bg-blue-500 text-white shadow-sm': isSelected(day),
            'border border-blue-400 text-blue-600': isToday(day) && !isSelected(day),
            'text-gray-700 hover:bg-blue-50 hover:text-blue-600': !isSelected(day) && !isToday(day)
          }"
        >
          {{ day }}
        </button>
      </div>

      <!-- Quick actions -->
      <div class="flex justify-end gap-2 pt-2 border-t border-gray-100">
        <button type="button" @click="selectToday" class="quick-btn">Today</button>
        <button type="button" @click="selectLast7Days" class="quick-btn">Last 7 Days</button>
        <button type="button" @click="selectThisMonth" class="quick-btn">This Month</button>
        <button type="button" @click="clearDate"
          class="quick-btn text-red-600 border-red-200 hover:bg-red-50">Clear</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { cn } from "@/lib/utils";
import { baseInputClass } from "@/lib/inputStyles";

interface Props {
  modelValue?: string;
  placeholder?: string;
  class?: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>();

const open = ref(false);
const selectedDate = ref<Date | null>(props.modelValue ? new Date(props.modelValue) : null);
const className = props.class ?? "";

const displayValue = computed(() =>
  selectedDate.value ? selectedDate.value.toLocaleDateString() : ""
);

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
  currentMonth.value = currentMonth.value === 0 ? 11 : currentMonth.value - 1;
  if (currentMonth.value === 11) currentYear.value--;
}
function nextMonth() {
  currentMonth.value = currentMonth.value === 11 ? 0 : currentMonth.value + 1;
  if (currentMonth.value === 0) currentYear.value++;
}

function selectDate(day: number) {
  const date = new Date(currentYear.value, currentMonth.value, day);
  selectedDate.value = date;
  emit("update:modelValue", date.toISOString().split("T")[0]);
  open.value = false;
}
function isSelected(day: number) {
  return selectedDate.value &&
    selectedDate.value.getDate() === day &&
    selectedDate.value.getMonth() === currentMonth.value &&
    selectedDate.value.getFullYear() === currentYear.value;
}
function isToday(day: number) {
  return today.getDate() === day &&
    today.getMonth() === currentMonth.value &&
    today.getFullYear() === currentYear.value;
}

function selectToday() {
  selectedDate.value = new Date();
  emit("update:modelValue", selectedDate.value.toISOString().split("T")[0]);
  open.value = false;
}
function selectLast7Days() {
  const lastWeek = new Date();
  lastWeek.setDate(today.getDate() - 7);
  selectedDate.value = lastWeek;
  emit("update:modelValue", lastWeek.toISOString().split("T")[0]);
  open.value = false;
}
function selectThisMonth() {
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  selectedDate.value = firstDay;
  emit("update:modelValue", firstDay.toISOString().split("T")[0]);
  open.value = false;
}
function clearDate() {
  selectedDate.value = null;
  emit("update:modelValue", "");
  open.value = false;
}
function toggleDropdown(force?: boolean) {
  open.value = force ?? !open.value;
}

document.addEventListener("click", (e) => {
  if (!(e.target as HTMLElement).closest(".relative")) open.value = false;
});

watch(() => props.modelValue, (val) => {
  if (val) selectedDate.value = new Date(val);
});
</script>

<style scoped>
.quick-btn {
  @apply text-xs px-2 py-1 rounded-md border border-gray-200 bg-gray-50 hover:bg-gray-100 font-normal transition-all;
}
</style>
