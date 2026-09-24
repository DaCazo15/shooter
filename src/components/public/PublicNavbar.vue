<script setup>
import { useCmdStore } from '../../stores/cmdStore'
import { useWhatsApp } from '../../composable/useWhatsApp'

const cmdStore = useCmdStore()
const { contactarWhatsApp } = useWhatsApp()
</script>

<template>
  <header class="bg-white/80 backdrop-blur-md border-b border-[#EADBDE] sticky top-0 z-30">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-linear-to-tr from-[#9E5A78] to-[#D99FB4] flex items-center justify-center text-white text-base shadow-sm">
          <i class="bi bi-bag-heart-fill"></i>
        </div>
        <span class="font-serif-title text-xl font-bold tracking-tight text-[#1F1824]">
          {{ cmdStore.tituloSitio || 'Pandibuy Atelier' }}
        </span>
      </div>

      <div class="flex items-center gap-4">
        <a
          href="#catalogo"
          class="text-xs font-bold text-gray-700 hover:text-[#9E5A78] transition hidden sm:inline-block"
        >
          Catálogo
        </a>
        <router-link
          :to="{ name: 'public-linktree', params: { subdominio: cmdStore.subdominio || 'pandibuy' } }"
          class="text-xs font-bold text-gray-700 hover:text-[#9E5A78] transition hidden sm:inline-block"
        >
          Enlaces &amp; Redes
        </router-link>
        <button
          @click="contactarWhatsApp()"
          class="px-4 py-2 bg-[#9E5A78] hover:bg-[#864662] text-white text-xs font-bold rounded-full shadow-sm transition flex items-center gap-1.5"
        >
          <i class="bi bi-whatsapp"></i> Contactar
        </button>
      </div>
    </div>
  </header>
</template>
