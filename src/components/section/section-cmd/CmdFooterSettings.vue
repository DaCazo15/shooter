<script setup>
import { useCmdStore } from '../../../stores/cmdStore'

const cmdStore = useCmdStore()
</script>

<template>
  <div class="bg-white p-6 rounded-2xl border border-[#EADBDE] shadow-xs space-y-6">
    <div class="flex items-center gap-2 border-b border-[#FAF8F6] pb-3 text-[#9E5A78]">
      <i class="bi bi-symmetry-horizontal text-lg"></i>
      <h2 class="text-base font-bold text-[#1F1824]">Configuración del Footer de la Web</h2>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Nombre de la Marca en Footer</label>
        <input
          v-model="cmdStore.footerConfig.nombreMarca"
          type="text"
          class="w-full px-3.5 py-2 text-xs bg-[#FAF8F6] border border-[#EADBDE] rounded-xl"
        />
      </div>

      <div>
        <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Horario de Atención al Cliente</label>
        <input
          v-model="cmdStore.footerConfig.horario"
          type="text"
          placeholder="Lunes a Sábado: 9:00 AM - 6:00 PM"
          class="w-full px-3.5 py-2 text-xs bg-[#FAF8F6] border border-[#EADBDE] rounded-xl"
        />
      </div>

      <div class="sm:col-span-2">
        <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Texto de Presentación / Bio Footer</label>
        <textarea
          v-model="cmdStore.footerConfig.descripcion"
          rows="2"
          class="w-full px-3.5 py-2 text-xs bg-[#FAF8F6] border border-[#EADBDE] rounded-xl"
        ></textarea>
      </div>

      <div>
        <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Enlace de Instagram</label>
        <input
          v-model="cmdStore.footerConfig.instagram"
          type="text"
          placeholder="https://instagram.com/..."
          class="w-full px-3.5 py-2 text-xs bg-[#FAF8F6] border border-[#EADBDE] rounded-xl"
        />
      </div>

      <div>
        <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Enlace de WhatsApp</label>
        <input
          v-model="cmdStore.footerConfig.whatsapp"
          type="text"
          placeholder="https://wa.me/..."
          class="w-full px-3.5 py-2 text-xs bg-[#FAF8F6] border border-[#EADBDE] rounded-xl"
        />
      </div>

      <div class="sm:col-span-2">
        <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Texto de Copyright</label>
        <input
          v-model="cmdStore.footerConfig.textoCopyright"
          type="text"
          class="w-full px-3.5 py-2 text-xs bg-[#FAF8F6] border border-[#EADBDE] rounded-xl font-medium"
        />
      </div>

      <div class="sm:col-span-2 flex flex-wrap gap-6 pt-2">
        <label class="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
          <input type="checkbox" v-model="cmdStore.footerConfig.mostrarTerminos" class="rounded text-[#9E5A78]" />
          Mostrar enlace a Términos y Condiciones
        </label>
        <label class="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
          <input type="checkbox" v-model="cmdStore.footerConfig.mostrarPoliticaDevolucion" class="rounded text-[#9E5A78]" />
          Mostrar enlace a Políticas de Devolución
        </label>
        <label class="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
          <input type="checkbox" v-model="cmdStore.footerConfig.badgePandibuy" class="rounded text-[#9E5A78]" />
          Insignia "Hecho con Pandibuy"
        </label>
      </div>
    </div>
  </div>
</template>
