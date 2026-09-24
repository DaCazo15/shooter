<script setup>
import BotonBase from '../components/ui/BotonBase.vue'
const props = defineProps({
  title: { type: String, default: 'Name - Title' }
})
</script>

<template>
  <div class="flex justify-between items-center p-4 bg-gray-700 text-white">
    <div class="flex items-center gap-2">
      <!-- <img src="" alt=""> -->
      {{ title }}
    </div>
    <div class="flex gap-2">
      <BotonBase title="ver web" color="green" />
      <BotonBase title="cerrar" color="red" />
    </div>
  </div>
</template>
