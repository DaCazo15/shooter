<script setup>
import { useWhatsApp } from '../../composable/useWhatsApp'

defineProps({
  bloque: {
    type: Object,
    default: null
  }
})

const { contactarWhatsApp } = useWhatsApp()
</script>

<template>
  <section v-if="bloque && bloque.activo" class="bg-[#F7EFE9] border-y border-[#EADBDE] py-14 px-4 sm:px-6">
    <div class="max-w-4xl mx-auto text-center space-y-4">
      <h2 class="text-2xl sm:text-3xl font-serif-title font-bold text-[#1F1824]">
        {{ bloque.contenido.titulo }}
      </h2>
      <p class="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto leading-relaxed">
        {{ bloque.contenido.descripcion }}
      </p>
      <div class="pt-2">
        <button
          @click="contactarWhatsApp()"
          class="px-8 py-3.5 bg-[#9E5A78] hover:bg-[#864662] text-white font-bold text-xs rounded-full shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 flex items-center gap-2 mx-auto"
        >
          <i class="bi bi-whatsapp"></i>
          <span>{{ bloque.contenido.textoBoton }}</span>
        </button>
      </div>
    </div>
  </section>
</template>
