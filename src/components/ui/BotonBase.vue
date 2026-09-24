<script setup>
const emit = defineEmits(['click'])
const props = defineProps({
  title: { type: String, default: 'Name - Title'},
  color: { type: String, default: 'gray'},
  icon: { type: String },
})
const colorClasses = {
  blue: 'bg-blue-700 hover:bg-blue-800',
  green: 'bg-green-700 hover:bg-green-800',
  yellow: 'bg-yellow-700 hover:bg-yellow-800',
  red: 'bg-red-700 hover:bg-red-800',
  purple: 'bg-purple-700 hover:bg-purple-800',
  orange: 'bg-orange-700 hover:bg-orange-800',
  gray: 'bg-gray-700 hover:bg-gray-800',
}
</script>

<template>
  <button
    class="cursor-pointer font-semibold text-white transform transition duration-300 ease-in-out"
    :class="['px-4 py-3 rounded-lg', colorClasses[color] || colorClasses.gray]"
    @click="emit('click', $event)"
  >
    <span v-if="icon" class="mr-2">
      <i :class="icon"></i>
    </span>
    {{ title }}
  </button>
</template>
