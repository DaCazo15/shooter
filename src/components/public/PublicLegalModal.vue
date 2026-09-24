<script setup>
import { useSettingsStore } from '../../stores/settingsStore'

const settingsStore = useSettingsStore()

const props = defineProps({
  abierto: {
    type: Boolean,
    default: false
  },
  tipo: {
    type: String,
    default: 'terminos',
    validator: (v) => ['terminos', 'devoluciones'].includes(v)
  }
})

const emit = defineEmits(['cerrar'])

const tituloModal = {
  terminos: 'Términos y Condiciones',
  devoluciones: 'Políticas de Cambio y Devolución'
}
</script>

<template>
  <div
    v-if="abierto"
    class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    @click.self="emit('cerrar')"
  >
    <div class="bg-white max-w-lg w-full rounded-2xl p-6 shadow-2xl space-y-4 max-h-[80vh] overflow-y-auto">
      <div class="flex justify-between items-center border-b border-[#EADBDE] pb-3">
        <h3 class="font-bold text-base text-[#1F1824]">
          {{ tituloModal[tipo] }}
        </h3>
        <button @click="emit('cerrar')" class="text-gray-400 hover:text-gray-700">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <div class="text-xs text-gray-600 whitespace-pre-line leading-relaxed">
        {{ tipo === 'terminos' ? settingsStore.legalSettings.terminosYCondiciones : settingsStore.legalSettings.politicaDevoluciones }}
      </div>

      <div class="pt-2 text-right">
        <button
          @click="emit('cerrar')"
          class="px-4 py-2 bg-[#9E5A78] text-white text-xs font-bold rounded-xl"
        >
          Entendido
        </button>
      </div>
    </div>
  </div>
</template>
