<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../../../stores/authStore'

const emit = defineEmits(['aplicar-precio', 'cerrar'])

const authStore = useAuthStore()

const costoMateriales = ref(12)
const horasTrabajo = ref(1)
const precioHora = ref(8)
const costoEmpaque = ref(2)
const margenDeseado = ref(40)

// Cálculos
const costoManoObra = computed(() => {
  return (parseFloat(horasTrabajo.value) || 0) * (parseFloat(precioHora.value) || 0)
})

const costoTotalProduccion = computed(() => {
  const mat = parseFloat(costoMateriales.value) || 0
  const emp = parseFloat(costoEmpaque.value) || 0
  return mat + costoManoObra.value + emp
})

const pvpCalculado = computed(() => {
  const costo = costoTotalProduccion.value
  const margen = parseFloat(margenDeseado.value) || 0
  return costo * (1 + (margen / 100))
})

const gananciaCalculada = computed(() => {
  return pvpCalculado.value - costoTotalProduccion.value
})

const transferirAlProducto = () => {
  emit('aplicar-precio', {
    precio: parseFloat(pvpCalculado.value.toFixed(2)),
    costo: parseFloat(costoTotalProduccion.value.toFixed(2))
  })
}
</script>

<template>
  <div class="bg-[#FAF8F6] p-4 sm:p-5 rounded-2xl border border-[#9E5A78]/30 space-y-4 shadow-inner">
    <div class="flex items-center justify-between border-b border-[#EADBDE] pb-2 text-[#9E5A78]">
      <div class="flex items-center gap-2 font-bold text-xs">
        <i class="bi bi-calculator-fill text-base"></i>
        <span>Calculadora de Precios Integrada</span>
      </div>
      <button
        type="button"
        @click="emit('cerrar')"
        class="text-gray-400 hover:text-gray-600 text-xs"
      >
        <i class="bi bi-x-circle"></i> Ocultar
      </button>
    </div>

    <!-- Parámetros de Costeo -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
      <div>
        <label class="block font-bold text-gray-600 mb-1">Costo Materiales ($)</label>
        <input
          v-model.number="costoMateriales"
          type="number"
          step="0.5"
          min="0"
          class="w-full px-2.5 py-1.5 bg-white border border-[#EADBDE] rounded-lg font-semibold"
        />
      </div>

      <div>
        <label class="block font-bold text-gray-600 mb-1">Horas Trabajo (h)</label>
        <input
          v-model.number="horasTrabajo"
          type="number"
          step="0.25"
          min="0"
          class="w-full px-2.5 py-1.5 bg-white border border-[#EADBDE] rounded-lg"
        />
      </div>

      <div>
        <label class="block font-bold text-gray-600 mb-1">Precio Hora ($)</label>
        <input
          v-model.number="precioHora"
          type="number"
          step="0.5"
          min="0"
          class="w-full px-2.5 py-1.5 bg-white border border-[#EADBDE] rounded-lg"
        />
      </div>

      <div>
        <label class="block font-bold text-gray-600 mb-1">Empaque ($)</label>
        <input
          v-model.number="costoEmpaque"
          type="number"
          step="0.5"
          min="0"
          class="w-full px-2.5 py-1.5 bg-white border border-[#EADBDE] rounded-lg"
        />
      </div>
    </div>

    <!-- Margen y Resumen -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center pt-2">
      <div>
        <label class="block text-xs font-bold text-[#9E5A78] mb-1">Margen Ganancia (%)</label>
        <div class="relative">
          <input
            v-model.number="margenDeseado"
            type="number"
            min="0"
            class="w-full px-2.5 py-1.5 bg-white border border-[#EADBDE] rounded-lg text-xs font-bold text-[#9E5A78]"
          />
          <span class="absolute right-3 top-1.5 text-xs text-gray-400 font-bold">%</span>
        </div>
      </div>

      <div class="bg-white p-2.5 rounded-xl border border-[#EADBDE] text-center">
        <span class="text-[10px] uppercase font-bold text-gray-400 block">Costo Total Base</span>
        <span class="text-sm font-black text-gray-800">
          {{ authStore.user.currencySymbol || '$' }}{{ costoTotalProduccion.toFixed(2) }}
        </span>
      </div>

      <div class="bg-[#9E5A78] text-white p-2.5 rounded-xl text-center shadow-xs">
        <span class="text-[10px] uppercase font-bold text-rose-200 block">PVP Sugerido</span>
        <span class="text-base font-black">
          {{ authStore.user.currencySymbol || '$' }}{{ pvpCalculado.toFixed(2) }}
        </span>
      </div>
    </div>

    <!-- Botón de Inserción -->
    <div class="flex justify-end pt-1">
      <button
        type="button"
        @click="transferirAlProducto"
        class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
      >
        <i class="bi bi-arrow-down-circle-fill"></i>
        <span>Aplicar Costo y PVP a este Producto</span>
      </button>
    </div>
  </div>
</template>
