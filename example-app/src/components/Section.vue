<template>
  <div class="bg-gray-900 border border-gray-800 rounded-xl p-4">
    <div class="flex items-center gap-2 mb-4">
      <span class="text-base">{{ icon }}</span>
      <h2 class="text-sm font-semibold text-gray-200">{{ title }}</h2>
    </div>
    <slot />
  </div>
</template>

<script setup>
defineProps({ title: String, icon: String })
</script>
