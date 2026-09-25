<script setup>
import { onMounted, nextTick } from 'vue'
import { useWhatsApp } from '../../composable/useWhatsApp'
import gsap from 'gsap'

defineProps({
  bloque: {
    type: Object,
    default: null
  }
})

const { contactarWhatsApp } = useWhatsApp()

onMounted(() => {
  nextTick(() => {
    gsap.from('.gsap-hero-title', {
      duration: 1,
      y: 40,
      opacity: 0,
      ease: 'power3.out'
    })

    gsap.from('.gsap-hero-sub', {
      duration: 1.2,
      y: 30,
      opacity: 0,
      delay: 0.2,
      ease: 'power3.out'
    })

    gsap.from('.gsap-hero-btn', {
      duration: 0.8,
      scale: 0.9,
      opacity: 0,
      delay: 0.4,
      ease: 'back.out(1.7)'
    })
  })
})
</script>

<template>
  <section
    v-if="bloque && bloque.activo"
    class="relative py-20 sm:py-28 px-4 sm:px-6 overflow-hidden flex items-center justify-center text-center text-white"
    :style="{
      backgroundImage: `linear-gradient(rgba(31, 24, 36, 0.72), rgba(31, 24, 36, 0.78)), url(${bloque.contenido.imagenFondo})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }"
  >
    <div class="max-w-3xl mx-auto space-y-6 relative z-10">
      <span class="px-3.5 py-1 rounded-full bg-[#FAF8F6]/15 backdrop-blur-md text-[#D99FB4] text-xs uppercase font-bold tracking-widest border border-[#FAF8F6]/20">
        Colección Oficial &amp; Confección 
      </span>
      <h1 class="gsap-hero-title text-3xl sm:text-5xl lg:text-6xl font-serif-title font-bold leading-tight">
        {{ bloque.contenido.titulo }}
      </h1>
      <p class="gsap-hero-sub text-sm sm:text-base text-gray-200 max-w-2xl mx-auto font-light leading-relaxed">
        {{ bloque.contenido.subtitulo }}
      </p>
      <div class="gsap-hero-btn flex flex-wrap justify-center items-center gap-4 pt-4">
        <a
          href="#catalogo"
          class="px-7 py-3.5 bg-[#9E5A78] hover:bg-[#864662] text-white font-bold text-xs rounded-full shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5"
        >
          {{ bloque.contenido.textoBoton || 'Explorar Colección' }}
        </a>
        <button
          @click="contactarWhatsApp()"
          class="px-7 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 font-bold text-xs rounded-full transition"
        >
          <i class="bi bi-whatsapp mr-1.5 text-emerald-400"></i> Pedidos Especiales
        </button>
      </div>
    </div>
  </section>
</template>
