<template>
  <input
    v-model="modelValue"
    data-slot="input"
    :placeholder="placeholder"
    :class="cn(baseInputClass, props.class)"
  />
</template>

<script setup lang="ts">
import { useVModel } from "@vueuse/core"
import { cn } from "@/lib/utils"
import { baseInputClass } from "@/lib/inputStyles"


const props = defineProps({
  defaultValue: { type: [String, Number], required: false },
  modelValue: { type: [String, Number], required: false },
  class: { type: String, required: false },
  placeholder: { type: String, default: "" },
})

const emits = defineEmits(["update:modelValue"])

const modelValue = useVModel(props, "modelValue", emits, {
  passive: true,
  defaultValue: props.defaultValue,
})
</script>
