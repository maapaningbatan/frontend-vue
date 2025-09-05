<template>
  <textarea
    v-model="modelValue"
    data-slot="input"
    :placeholder="placeholder"
    :rows="rows"
    :class="cn(
      'w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2 text-base text-gray-700 shadow-sm outline-none transition-all duration-200 ease-in-out',
      // Focus & hover effects
      'focus:border-blue-500 focus:ring-1 focus:ring-blue-400 focus:ring-offset-0 hover:border-blue-400',
      // Placeholder
      'placeholder:text-gray-400',
      // Disabled state
      'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100',
      // Invalid state
      'aria-invalid:border-red-500 aria-invalid:ring-2 aria-invalid:ring-red-300',
      props.class
    )"
  ></textarea>
</template>

<script setup>
import { useVModel } from "@vueuse/core";
import { cn } from "@/lib/utils";

const props = defineProps({
  modelValue: { type: [String, Number], required: false },
  defaultValue: { type: [String, Number], required: false },
  placeholder: { type: String, default: "" },
  rows: { type: Number, default: 4 },
  class: { type: null, required: false },
});

const emits = defineEmits(["update:modelValue"]);

const modelValue = useVModel(props, "modelValue", emits, {
  defaultValue: props.defaultValue,
  passive: true,
});
</script>
