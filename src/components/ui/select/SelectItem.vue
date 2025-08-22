<script setup>
import { reactiveOmit } from "@vueuse/core";
import { Check } from "lucide-vue-next";
import {
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  useForwardProps,
} from "reka-ui";
import { cn } from "@/lib/utils";

const props = defineProps({
  value: { type: null, required: true },
  disabled: { type: Boolean, required: false },
  textValue: { type: String, required: false },
  asChild: { type: Boolean, required: false },
  as: { type: null, required: false },
  class: { type: null, required: false },
});

const delegatedProps = reactiveOmit(props, "class");
const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <SelectItem
    v-bind="forwardedProps"
    :class="
      cn(
        'relative flex w-full cursor-pointer select-none items-center rounded-md px-3 py-2 text-sm text-gray-700 transition-colors',
        'hover:bg-blue-50 hover:text-blue-600 focus:bg-blue-100 focus:text-blue-700',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        props.class,
      )
    "
  >
    <!-- Checkmark indicator (on right side) -->
    <span class="absolute right-3 flex items-center justify-center">
      <SelectItemIndicator>
        <Check class="w-4 h-4 text-blue-600" />
      </SelectItemIndicator>
    </span>

    <!-- Item text -->
    <SelectItemText>
      <slot />
    </SelectItemText>
  </SelectItem>
</template>
