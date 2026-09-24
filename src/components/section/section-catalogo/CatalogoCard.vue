<script setup>
import { useAuthStore } from '../../../stores/authStore'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['editar', 'eliminar'])
const authStore = useAuthStore()

const margen = (item) => {
  const precio = parseFloat(item.precio) || 0
  const costo = parseFloat(item.costo) || 0
  if (precio <= 0) return 0
  return (((precio - costo) / precio) * 100).toFixed(0)
}
</script>

<template>
  <div class="bg-white rounded-2xl shadow-xs hover:shadow-md transition duration-200 border border-[#EADBDE] overflow-hidden flex flex-col justify-between group">
    <!-- Imagen / Header de Tarjeta -->
    <div class="relative h-44 bg-gray-100 overflow-hidden">
      <img
        v-if="item.imagen"
        :src="item.imagen"
        :alt="item.titulo"
        class="w-full h-full object-cover group-hover:scale-105 transition duration-500"
      />
      <div v-else class="w-full h-full bg-[#FAF8F6] flex flex-col items-center justify-center text-gray-400">
        <i class="bi bi-image text-3xl text-gray-300"></i>
        <span class="text-[11px] mt-1">Sin fotografía</span>
      </div>

      <!-- Badge de Categoría -->
      <span class="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-bold text-[#9E5A78] rounded-lg shadow-xs">
        {{ item.categoria || 'General' }}
      </span>

      <!-- Badge de Stock -->
      <span
        class="absolute top-3 right-3 px-2 py-0.5 text-[10px] font-bold rounded-lg shadow-xs"
        :class="(item.stock && item.stock > 0) ? 'bg-emerald-100/90 text-emerald-800' : 'bg-rose-100/90 text-rose-800'"
      >
        <i class="bi" :class="(item.stock && item.stock > 0) ? 'bi-check2' : 'bi-exclamation-triangle'"></i>
        {{ (item.stock && item.stock > 0) ? `Stock: ${item.stock}` : 'Agotado' }}
      </span>
    </div>

    <!-- Cuerpo de la Tarjeta -->
    <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
      <div>
        <h3 class="font-bold text-sm text-[#1F1824] group-hover:text-[#9E5A78] transition line-clamp-1">
          {{ item.titulo }}
        </h3>
        <p class="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
          {{ item.descripcion || 'Sin descripción detallada.' }}
        </p>
      </div>

      <!-- Resumen Financiero del Producto -->
      <div class="pt-3 border-t border-[#FAF8F6] space-y-2">
        <div class="flex items-center justify-between">
          <div>
            <span class="text-[10px] text-gray-400 uppercase font-semibold block">Precio Venta (PVP)</span>
            <span class="text-lg font-black text-[#1F1824]">
              {{ authStore.user.currencySymbol || '$' }}{{ Number(item.precio || 0).toFixed(2) }}
            </span>
          </div>

          <div class="text-right">
            <span class="text-[10px] text-gray-400 uppercase font-semibold block">Costo Base</span>
            <span class="text-xs font-bold text-gray-600">
              {{ authStore.user.currencySymbol || '$' }}{{ Number(item.costo || 0).toFixed(2) }}
            </span>
          </div>

          <div class="text-right pl-2 border-l border-[#FAF8F6]">
            <span class="text-[10px] text-emerald-700 uppercase font-bold block">Margen</span>
            <span class="text-xs font-bold text-emerald-600">
              {{ margen(item) }}%
            </span>
          </div>
        </div>

        <!-- Botones de Acción -->
        <div class="flex items-center justify-end gap-1.5 pt-2">
          <button
            @click="emit('editar', item)"
            class="px-3 py-1.5 bg-[#FAF8F6] hover:bg-[#F7EFE9] text-gray-700 hover:text-[#9E5A78] text-xs font-bold rounded-lg border border-[#EADBDE] transition flex items-center gap-1"
            title="Editar producto"
          >
            <i class="bi bi-pencil-square"></i>
            <span>Editar</span>
          </button>
          <button
            @click="emit('eliminar', item.id)"
            class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
            title="Eliminar producto"
          >
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
