<script setup lang="ts">
import { reactiveOmit } from "@vueuse/core";
import { SwitchRoot, SwitchThumb, useForwardPropsEmits } from "reka-ui";
import { cn } from "@/lib/utils";

const props = defineProps<{
  defaultValue?: boolean
  modelValue?: boolean | null
  disabled?: boolean
  id?: string
  value?: string
  asChild?: boolean
  as?: any
  name?: string
  required?: boolean
  class?: string
}>()

const emits = defineEmits<{
  (e: "update:modelValue", value: boolean): void
}>()

const delegatedProps = reactiveOmit(props, "class")
const forwarded = useForwardPropsEmits(delegatedProps, emits)

function handleChange(val: boolean) {
  emits("update:modelValue", val)
}
</script>

<template>
  <SwitchRoot
    v-bind="forwarded"
    :checked="props.modelValue ?? false"
    :disabled="props.disabled"
    @checked-change="handleChange"
    :class="
      cn(
        'peer inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] focus-visible:border-ring focus-visible:ring-ring/50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input dark:data-[state=unchecked]:bg-input/80 disabled:cursor-not-allowed disabled:opacity-50',
        props.class
      )
    "
  >
    <SwitchThumb
      :class="
        cn(
          'pointer-events-none block size-4 rounded-full bg-background ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0 dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground'
        )
      "
    >
      <slot name="thumb" />
    </SwitchThumb>
  </SwitchRoot>
</template>
