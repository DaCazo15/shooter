<script setup>
defineProps({
  bloque: {
    type: Object,
    default: null
  }
})
</script>

<template>
  <div
    v-if="bloque && bloque.activo"
    :style="{ backgroundColor: bloque.contenido.bgColor || '#1F1824', color: bloque.contenido.textColor || '#FAF8F6' }"
    class="py-2 px-4 text-center text-xs font-semibold tracking-wide shadow-xs transition"
  >
    {{ bloque.contenido.texto }}
  </div>
</template>
