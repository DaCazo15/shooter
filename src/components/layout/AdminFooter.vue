<script setup>
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="mt-auto bg-[#1F1824] text-white/70 border-t border-[#2D2334] py-6 px-4 sm:px-6 lg:px-8 text-xs">
    <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
      <!-- Marca y Copyright -->
      <div class="flex items-center gap-2">
        <div class="w-5 h-5 rounded-md bg-[#9E5A78] flex items-center justify-center text-white text-xs">
          <i class="bi bi-bag-heart-fill text-[10px]"></i>
        </div>
        <span class="font-serif-title text-[#FAF8F6] font-bold text-sm">Pandibuy</span>
        <span class="text-gray-500">|</span>
        <span class="text-gray-400">© {{ currentYear }} Pandibuy Studio. Todos los derechos reservados.</span>
      </div>

      <!-- Estado y Enlaces Rápidos -->
      <div class="flex flex-wrap items-center gap-6">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span class="text-emerald-300 font-medium">Sistema Activo & Sincronizado</span>
        </div>

        <router-link to="/dashboard/configuracion" class="hover:text-[#D99FB4] transition">
          Políticas & Legal
        </router-link>

        <router-link to="/dashboard/perfil" class="hover:text-[#D99FB4] transition">
          Mi Negocio
        </router-link>

        <span class="px-2 py-0.5 rounded-full bg-[#2D2334] text-[10px] text-[#D99FB4] font-semibold">
          v2.0 Pro
        </span>
      </div>
    </div>
  </footer>
</template>
