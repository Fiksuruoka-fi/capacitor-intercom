<template>
  <button
    @click="!disabled && $emit('click')"
    class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900"
    :class="[colorClasses, disabled ? 'opacity-40 cursor-not-allowed' : '']"
    :disabled="disabled"
  >
    {{ label }}
    <span
      v-if="disabled && disabledReason"
      class="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-white/20 text-white/70 text-[9px] leading-none"
      :title="disabledReason"
    >?</span>
  </button>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  label: String,
  color: { type: String, default: 'indigo' },
  disabled: { type: Boolean, default: false },
  disabledReason: { type: String, default: '' },
})
defineEmits(['click'])

const colorClasses = computed(() => ({
  indigo: 'bg-indigo-600 hover:bg-indigo-500 text-white focus:ring-indigo-500',
  green:  'bg-green-700 hover:bg-green-600 text-white focus:ring-green-500',
  red:    'bg-red-800 hover:bg-red-700 text-white focus:ring-red-500',
  yellow: 'bg-yellow-700 hover:bg-yellow-600 text-white focus:ring-yellow-500',
  blue:   'bg-blue-700 hover:bg-blue-600 text-white focus:ring-blue-500',
  gray:   'bg-gray-700 hover:bg-gray-600 text-gray-200 focus:ring-gray-500',
}[props.color]))
</script>
