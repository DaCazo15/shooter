<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const volver = () => {
  if (authStore.isAuthenticated) {
    router.push({ name: 'dashboard-calculadora' })
  } else {
    router.push({ name: 'login' })
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-[#FAF8F6] p-6 text-[#1F1824]">
    <div class="max-w-md w-full text-center space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-[#EADBDE] shadow-xl">
      <!-- Icono de Error -->
      <div class="w-20 h-20 mx-auto rounded-2xl bg-[#F7EFE9] border border-[#EADBDE] flex items-center justify-center text-[#9E5A78] text-4xl shadow-sm">
        <i class="bi bi-compass"></i>
      </div>

      <div class="space-y-2">
        <span class="px-3 py-1 bg-rose-50 text-[#9E5A78] text-xs font-bold uppercase tracking-wider rounded-full border border-rose-100">
          Error 404 — Página no encontrada
        </span>
        <h1 class="text-2xl sm:text-3xl font-bold font-serif-title text-[#1F1824] pt-2">
          Ups, parece que te has perdido
        </h1>
        <p class="text-xs text-gray-500 leading-relaxed max-w-sm mx-auto">
          La dirección a la que intentas acceder no existe, ha sido trasladada o se encuentra temporalmente inaccesible.
        </p>
      </div>

      <div class="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
        <button
          @click="volver"
          class="px-6 py-2.5 bg-[#9E5A78] hover:bg-[#864662] text-white text-xs font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2"
        >
          <i class="bi bi-house-door-fill"></i>
          <span>{{ authStore.isAuthenticated ? 'Ir al Panel Principal' : 'Iniciar Sesión' }}</span>
        </button>

        <button
          @click="router.go(-1)"
          class="px-6 py-2.5 bg-[#FAF8F6] hover:bg-[#F7EFE9] text-gray-700 text-xs font-semibold rounded-xl border border-[#EADBDE] transition flex items-center justify-center gap-2"
        >
          <i class="bi bi-arrow-left"></i>
          <span>Volver Atrás</span>
        </button>
      </div>

      <div class="pt-4 border-t border-[#FAF8F6] text-[11px] text-gray-400">
        Pandibuy Business Suite
      </div>
    </div>
  </div>
</template>
