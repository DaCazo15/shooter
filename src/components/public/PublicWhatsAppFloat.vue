<script setup>
import { onMounted, nextTick } from 'vue'
import { useWhatsApp } from '../../composable/useWhatsApp'
import gsap from 'gsap'

const { contactarWhatsApp } = useWhatsApp()

onMounted(() => {
  nextTick(() => {
    gsap.to('.gsap-float-wa', {
      y: -6,
      repeat: -1,
      yoyo: true,
      duration: 1.5,
      ease: 'sine.inOut'
    })
  })
})
</script>

<template>
  <button
    @click="contactarWhatsApp()"
    class="gsap-float-wa fixed bottom-6 right-6 w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center text-2xl shadow-xl z-50 transition"
    title="Escríbenos por WhatsApp"
  >
    <i class="bi bi-whatsapp"></i>
  </button>
</template>
