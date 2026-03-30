<template>
  <div :class="$attrs.class">
    <label class="block text-xs text-gray-400 mb-1">{{ label }}</label>
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="placeholder"
      class="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
    />
  </div>
</template>

<script setup>
defineProps({ label: String, modelValue: String, placeholder: String })
defineEmits(['update:modelValue'])
</script>
