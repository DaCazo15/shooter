<script setup>
import { useAuthStore } from '../../../stores/authStore'

const props = defineProps({
  metricas: {
    type: Object,
    required: true
  }
})

const authStore = useAuthStore()
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <!-- 1. Total Productos -->
    <div class="bg-white p-5 rounded-2xl border border-[#EADBDE] shadow-xs flex items-center justify-between">
      <div>
        <span class="text-xs font-bold text-gray-500 uppercase tracking-wider block">Productos Registrados</span>
        <p class="text-2xl font-black text-[#1F1824] mt-1">
          {{ props.metricas.totalItems }}
        </p>
        <span class="text-[11px] text-gray-400">En catálogo activo</span>
      </div>
      <div class="w-11 h-11 rounded-xl bg-[#F7EFE9] text-[#9E5A78] flex items-center justify-center text-xl">
        <i class="bi bi-grid-fill"></i>
      </div>
    </div>

    <!-- 2. Valor de Venta del Catálogo -->
    <div class="bg-linear-to-br from-[#1F1824] to-[#2D2334] text-white p-5 rounded-2xl shadow-md flex items-center justify-between">
      <div>
        <span class="text-xs font-bold text-[#D99FB4] uppercase tracking-wider block">Valor de Venta Total</span>
        <p class="text-2xl font-black text-[#FAF8F6] mt-1">
          {{ authStore.user.currencySymbol || '$' }}{{ props.metricas.valorTotalVenta.toFixed(2) }}
        </p>
        <span class="text-[11px] text-gray-300">PVP acumulado de stock</span>
      </div>
      <div class="w-11 h-11 rounded-xl bg-white/10 text-[#D99FB4] flex items-center justify-center text-xl">
        <i class="bi bi-cash-stack"></i>
      </div>
    </div>

    <!-- 3. Costo de Inversión Total -->
    <div class="bg-white p-5 rounded-2xl border border-[#EADBDE] shadow-xs flex items-center justify-between">
      <div>
        <span class="text-xs font-bold text-gray-500 uppercase tracking-wider block">Inversión en Costos</span>
        <p class="text-2xl font-black text-gray-700 mt-1">
          {{ authStore.user.currencySymbol || '$' }}{{ props.metricas.costoTotalInversion.toFixed(2) }}
        </p>
        <span class="text-[11px] text-gray-400">Materiales + Producción</span>
      </div>
      <div class="w-11 h-11 rounded-xl bg-[#FAF8F6] text-gray-600 flex items-center justify-center text-xl border border-[#EADBDE]">
        <i class="bi bi-wallet-fill"></i>
      </div>
    </div>

    <!-- 4. Ganancia Proyectada -->
    <div class="bg-white p-5 rounded-2xl border border-[#EADBDE] shadow-xs flex items-center justify-between">
      <div>
        <span class="text-xs font-bold text-gray-500 uppercase tracking-wider block">Ganancia Proyectada</span>
        <p class="text-2xl font-black text-emerald-600 mt-1">
          +{{ authStore.user.currencySymbol || '$' }}{{ props.metricas.gananciaProyectada.toFixed(2) }}
        </p>
        <span class="text-[11px] text-emerald-700 font-semibold">
          Margen promedio: {{ props.metricas.margenGlobal.toFixed(1) }}%
        </span>
      </div>
      <div class="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl border border-emerald-100">
        <i class="bi bi-graph-up-arrow"></i>
      </div>
    </div>
  </div>
</template>
