<script setup>
import { ref } from 'vue'
import { useSettingsStore } from '../../stores/settingsStore'

const settingsStore = useSettingsStore()

const formData = ref({ ...settingsStore.legalSettings })
const guardadoExitoso = ref(false)

const handleGuardar = () => {
  settingsStore.guardarAjustesLegales(formData.value)
  guardadoExitoso.value = true
  setTimeout(() => {
    guardadoExitoso.value = false
  }, 3000)
}
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-[#EADBDE] shadow-xs">
      <div>
        <h1 class="text-2xl font-bold font-serif-title text-[#1F1824]">Configuración Legal & Términos del Sitio</h1>
        <p class="text-xs text-gray-500 mt-1">Establece las reglas de compra, políticas de devolución y avisos de privacidad para tu negocio</p>
      </div>
      <div v-if="guardadoExitoso" class="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-xs font-bold border border-emerald-200 flex items-center gap-2">
        <i class="bi bi-check-circle-fill"></i> ¡Políticas actualizadas!
      </div>
    </div>

    <form @submit.prevent="handleGuardar" class="space-y-6">
      <!-- Datos de Registro Fiscal / Empresa -->
      <div class="bg-white p-6 rounded-2xl border border-[#EADBDE] shadow-xs space-y-4">
        <div class="flex items-center gap-2 border-b border-[#FAF8F6] pb-3 text-[#9E5A78]">
          <i class="bi bi-file-earmark-ruled text-lg"></i>
          <h2 class="text-base font-bold text-[#1F1824]">Datos Fiscales del Negocio</h2>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Razón Social / Nombre Legal</label>
            <input
              v-model="formData.nombreLegal"
              type="text"
              class="w-full px-3.5 py-2 text-xs bg-[#FAF8F6] border border-[#EADBDE] rounded-xl focus:ring-2 focus:ring-[#9E5A78] focus:outline-none"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Identificación Fiscal (RIF / RFC / CIF / NIF)</label>
            <input
              v-model="formData.identificacionFiscal"
              type="text"
              class="w-full px-3.5 py-2 text-xs bg-[#FAF8F6] border border-[#EADBDE] rounded-xl focus:ring-2 focus:ring-[#9E5A78] focus:outline-none"
            />
          </div>

          <div class="sm:col-span-2">
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Dirección Fiscal / Despacho</label>
            <input
              v-model="formData.direccionFisica"
              type="text"
              class="w-full px-3.5 py-2 text-xs bg-[#FAF8F6] border border-[#EADBDE] rounded-xl focus:ring-2 focus:ring-[#9E5A78] focus:outline-none"
            />
          </div>
        </div>
      </div>

      <!-- Términos y Condiciones -->
      <div class="bg-white p-6 rounded-2xl border border-[#EADBDE] shadow-xs space-y-4">
        <div class="flex items-center gap-2 border-b border-[#FAF8F6] pb-3 text-[#9E5A78]">
          <i class="bi bi-journal-text text-lg"></i>
          <h2 class="text-base font-bold text-[#1F1824]">Términos y Condiciones de Venta</h2>
        </div>
        <p class="text-xs text-gray-500">Estos términos se mostrarán a tus compradores en el footer y al consultar pedidos especiales.</p>
        <textarea
          v-model="formData.terminosYCondiciones"
          rows="6"
          class="w-full p-4 text-xs font-mono bg-[#FAF8F6] border border-[#EADBDE] rounded-xl focus:ring-2 focus:ring-[#9E5A78] focus:outline-none leading-relaxed"
        ></textarea>
      </div>

      <!-- Políticas de Cambio y Devolución -->
      <div class="bg-white p-6 rounded-2xl border border-[#EADBDE] shadow-xs space-y-4">
        <div class="flex items-center gap-2 border-b border-[#FAF8F6] pb-3 text-[#9E5A78]">
          <i class="bi bi-arrow-repeat text-lg"></i>
          <h2 class="text-base font-bold text-[#1F1824]">Políticas de Cambio & Garantías</h2>
        </div>
        <textarea
          v-model="formData.politicaDevoluciones"
          rows="5"
          class="w-full p-4 text-xs font-mono bg-[#FAF8F6] border border-[#EADBDE] rounded-xl focus:ring-2 focus:ring-[#9E5A78] focus:outline-none leading-relaxed"
        ></textarea>
      </div>

      <!-- Política de Privacidad & Propiedad Intelectual -->
      <div class="bg-white p-6 rounded-2xl border border-[#EADBDE] shadow-xs space-y-4">
        <div class="flex items-center gap-2 border-b border-[#FAF8F6] pb-3 text-[#9E5A78]">
          <i class="bi bi-shield-check text-lg"></i>
          <h2 class="text-base font-bold text-[#1F1824]">Política de Privacidad & Propiedad Intelectual</h2>
        </div>
        <textarea
          v-model="formData.politicaPrivacidad"
          rows="4"
          class="w-full p-4 text-xs font-mono bg-[#FAF8F6] border border-[#EADBDE] rounded-xl focus:ring-2 focus:ring-[#9E5A78] focus:outline-none leading-relaxed"
        ></textarea>
      </div>

      <!-- Botón Guardar -->
      <div class="flex justify-end">
        <button
          type="submit"
          class="px-8 py-3 bg-[#9E5A78] hover:bg-[#864662] text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition flex items-center gap-2"
        >
          <i class="bi bi-shield-fill-check"></i>
          <span>Publicar Textos Legales</span>
        </button>
      </div>
    </form>
  </div>
</template>
