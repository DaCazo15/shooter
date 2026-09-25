<script setup>
import { useSettingsStore } from '../../../stores/settingsStore'

const settingsStore = useSettingsStore()
</script>

<template>
  <div class="bg-white p-6 rounded-2xl border border-[#EADBDE] shadow-xs space-y-6">
    <!-- Encabezado de la Sección -->
    <div class="flex items-center justify-between border-b border-[#FAF8F6] pb-3 text-[#9E5A78]">
      <div class="flex items-center gap-2">
        <i class="bi bi-shield-check text-lg"></i>
        <div>
          <h2 class="text-base font-bold text-[#1F1824]">Términos, Privacidad & Textos Legales</h2>
          <p class="text-[11px] text-gray-500 font-normal">Estos textos se presentarán a los clientes en el pie de página y en los modales de compra.</p>
        </div>
      </div>
    </div>

    <!-- 1. Datos Fiscales del Negocio -->
    <div class="space-y-3">
      <h3 class="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
        <i class="bi bi-file-earmark-ruled text-[#9E5A78]"></i>
        Datos de Identificación del Negocio
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-[11px] font-bold text-gray-600 uppercase mb-1">Razón Social / Nombre Comercial</label>
          <input
            v-model="settingsStore.legalSettings.nombreLegal"
            type="text"
            placeholder="Pandibuy Atelier C.A."
            class="w-full px-3.5 py-2 text-xs bg-[#FAF8F6] border border-[#EADBDE] rounded-xl font-medium focus:ring-1 focus:ring-[#9E5A78]"
          />
        </div>

        <div>
          <label class="block text-[11px] font-bold text-gray-600 uppercase mb-1">Identificación Fiscal (RIF / RFC / CIF / RUT)</label>
          <input
            v-model="settingsStore.legalSettings.identificacionFiscal"
            type="text"
            placeholder="J-50123984-1"
            class="w-full px-3.5 py-2 text-xs bg-[#FAF8F6] border border-[#EADBDE] rounded-xl font-medium focus:ring-1 focus:ring-[#9E5A78]"
          />
        </div>

        <div>
          <label class="block text-[11px] font-bold text-gray-600 uppercase mb-1">Correo de Contacto Legal</label>
          <input
            v-model="settingsStore.legalSettings.emailContacto"
            type="email"
            placeholder="legal@mitienda.com"
            class="w-full px-3.5 py-2 text-xs bg-[#FAF8F6] border border-[#EADBDE] rounded-xl font-medium focus:ring-1 focus:ring-[#9E5A78]"
          />
        </div>

        <div>
          <label class="block text-[11px] font-bold text-gray-600 uppercase mb-1">Dirección Física / Sede</label>
          <input
            v-model="settingsStore.legalSettings.direccionFisica"
            type="text"
            placeholder="Ciudad, Estado, País"
            class="w-full px-3.5 py-2 text-xs bg-[#FAF8F6] border border-[#EADBDE] rounded-xl font-medium focus:ring-1 focus:ring-[#9E5A78]"
          />
        </div>
      </div>
    </div>

    <!-- 2. Términos y Condiciones -->
    <div class="space-y-2 pt-2 border-t border-[#FAF8F6]">
      <div class="flex justify-between items-center">
        <label class="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
          <i class="bi bi-journal-text text-[#9E5A78]"></i>
          Términos y Condiciones de Compra
        </label>
        <span class="text-[10px] text-gray-400">Modal público</span>
      </div>
      <p class="text-[11px] text-gray-500">Reglas de pago, confirmación de pedidos, tiempos de elaboración y entregas.</p>
      <textarea
        v-model="settingsStore.legalSettings.terminosYCondiciones"
        rows="5"
        class="w-full p-3.5 text-xs font-mono bg-[#FAF8F6] border border-[#EADBDE] rounded-xl focus:ring-1 focus:ring-[#9E5A78] leading-relaxed"
      ></textarea>
    </div>

    <!-- 3. Políticas de Cambio y Devolución -->
    <div class="space-y-2 pt-2 border-t border-[#FAF8F6]">
      <div class="flex justify-between items-center">
        <label class="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
          <i class="bi bi-arrow-repeat text-[#9E5A78]"></i>
          Políticas de Cambio, Garantía & Devoluciones
        </label>
        <span class="text-[10px] text-gray-400">Modal público</span>
      </div>
      <p class="text-[11px] text-gray-500">Condiciones bajo las cuales aceptas cambios, garantías o reembolsos.</p>
      <textarea
        v-model="settingsStore.legalSettings.politicaDevoluciones"
        rows="5"
        class="w-full p-3.5 text-xs font-mono bg-[#FAF8F6] border border-[#EADBDE] rounded-xl focus:ring-1 focus:ring-[#9E5A78] leading-relaxed"
      ></textarea>
    </div>

    <!-- 4. Política de Privacidad & Propiedad Intelectual -->
    <div class="space-y-2 pt-2 border-t border-[#FAF8F6]">
      <label class="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
        <i class="bi bi-shield-lock text-[#9E5A78]"></i>
        Política de Privacidad y Tratamiento de Datos
      </label>
      <textarea
        v-model="settingsStore.legalSettings.politicaPrivacidad"
        rows="4"
        class="w-full p-3.5 text-xs font-mono bg-[#FAF8F6] border border-[#EADBDE] rounded-xl focus:ring-1 focus:ring-[#9E5A78] leading-relaxed"
      ></textarea>
    </div>
  </div>
</template>
