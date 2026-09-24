<script setup>
import { onMounted, ref } from 'vue'
import { useCalculadora } from '../../../composable/useCalculadora'
import { useAuthStore } from '../../../stores/authStore'

const authStore = useAuthStore()
const {
  nombreProyecto,
  cantidadProduccion,
  margenGanancia,
  horasTrabajo,
  precioHora,
  costoEmpaqueEnvio,
  items,
  historial,
  guardando,
  costoMaterialesUnitario,
  costoManoObraUnitario,
  costoIndirectoUnitario,
  costoTotalUnitario,
  costoTotalLote,
  pvpSugeridoUnitario,
  gananciaNetaUnitaria,
  gananciaTotalLote,
  facturacionTotalLote,
  agregarItem,
  eliminarItem,
  calcularCostoUnitario,
  calcularSubtotalItem,
  guardarCalculo,
  cargarHistorial
} = useCalculadora()

const guardadoExitoso = ref(false)

onMounted(() => {
  cargarHistorial()
})

const submitCalculo = async () => {
  const ok = await guardarCalculo()
  if (ok) {
    guardadoExitoso.value = true
    setTimeout(() => {
      guardadoExitoso.value = false
    }, 3000)
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-[#EADBDE] shadow-xs">
      <div>
        <h1 class="text-2xl font-bold font-serif-title text-[#1F1824]">Calculadora de Costos & Precios de Venta</h1>
        <p class="text-xs text-gray-500 mt-1">Calcula insumos, mano de obra, empaques y fija el PVP con el margen exacto de ganancia para tu negocio</p>
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="submitCalculo"
          :disabled="guardando"
          class="px-5 py-2.5 bg-[#9E5A78] hover:bg-[#864662] text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
        >
          <i v-if="guardando" class="bi bi-arrow-repeat animate-spin"></i>
          <i v-else class="bi bi-save2"></i>
          <span>{{ guardando ? 'Guardando...' : 'Guardar Presupuesto' }}</span>
        </button>
      </div>
    </div>

    <div v-if="guardadoExitoso" class="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2">
      <i class="bi bi-check-circle-fill text-emerald-600"></i>
      ¡Presupuesto y fórmula de costeo guardados exitosamente en tu historial!
    </div>

    <!-- Panel de KPI / Resumen Financiero -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white p-5 rounded-2xl border border-[#EADBDE] shadow-xs">
        <span class="text-xs font-bold text-gray-500 uppercase tracking-wider block">Costo Unitario Total</span>
        <p class="text-2xl font-black text-[#1F1824] mt-1">
          {{ authStore.user.currencySymbol || '$' }}{{ costoTotalUnitario.toFixed(2) }}
        </p>
        <div class="text-[11px] text-gray-500 mt-1 flex justify-between">
          <span>Mat: ${{ costoMaterialesUnitario.toFixed(2) }}</span>
          <span>Obra: ${{ costoManoObraUnitario.toFixed(2) }}</span>
        </div>
      </div>

      <div class="bg-linear-to-br from-[#9E5A78] to-[#733B53] text-white p-5 rounded-2xl shadow-md">
        <span class="text-xs font-bold text-[#D99FB4] uppercase tracking-wider block">PVP Sugerido (Unidad)</span>
        <p class="text-3xl font-black text-[#FAF8F6] mt-1">
          {{ authStore.user.currencySymbol || '$' }}{{ pvpSugeridoUnitario.toFixed(2) }}
        </p>
        <p class="text-[11px] text-rose-100 mt-1">
          Margen aplicado: {{ margenGanancia }}%
        </p>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-[#EADBDE] shadow-xs">
        <span class="text-xs font-bold text-gray-500 uppercase tracking-wider block">Ganancia Neta por Unidad</span>
        <p class="text-2xl font-black text-emerald-600 mt-1">
          +{{ authStore.user.currencySymbol || '$' }}{{ gananciaNetaUnitaria.toFixed(2) }}
        </p>
        <p class="text-[11px] text-gray-400 mt-1">
          Beneficio limpio por cada venta
        </p>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-[#EADBDE] shadow-xs">
        <span class="text-xs font-bold text-gray-500 uppercase tracking-wider block">Ganancia Total del Lote</span>
        <p class="text-2xl font-black text-[#2D6A4F] mt-1">
          +{{ authStore.user.currencySymbol || '$' }}{{ gananciaTotalLote.toFixed(2) }}
        </p>
        <p class="text-[11px] text-gray-500 mt-1">
          Facturación total: ${{ facturacionTotalLote.toFixed(2) }}
        </p>
      </div>
    </div>

    <!-- Formulario de Configuración de la Producción -->
    <div class="bg-white p-6 rounded-2xl border border-[#EADBDE] shadow-xs space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="md:col-span-2">
          <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Nombre del Producto o Proyecto</label>
          <input
            v-model="nombreProyecto"
            type="text"
            placeholder="Bolso Tote de Cuero / Collar Orquídea"
            class="w-full px-3.5 py-2 text-xs bg-[#FAF8F6] border border-[#EADBDE] rounded-xl focus:ring-2 focus:ring-[#9E5A78] focus:outline-none font-medium"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Cantidad a Producir (Lote)</label>
          <input
            v-model.number="cantidadProduccion"
            type="number"
            min="1"
            class="w-full px-3.5 py-2 text-xs bg-[#FAF8F6] border border-[#EADBDE] rounded-xl focus:ring-2 focus:ring-[#9E5A78] focus:outline-none font-bold"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">% Margen Ganancia Deseado</label>
          <div class="relative">
            <input
              v-model.number="margenGanancia"
              type="number"
              min="0"
              class="w-full px-3.5 py-2 text-xs bg-[#FAF8F6] border border-[#EADBDE] rounded-xl focus:ring-2 focus:ring-[#9E5A78] focus:outline-none font-bold text-[#9E5A78]"
            />
            <span class="absolute right-3 top-2 text-xs font-bold text-gray-400">%</span>
          </div>
        </div>
      </div>

      <!-- Costos de Mano de Obra y Empaque -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#FAF8F6] bg-[#FAF8F6]/60 p-4 rounded-xl">
        <div>
          <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Horas de Trabajo (Tiempo de Elaboración)</label>
          <input
            v-model.number="horasTrabajo"
            type="number"
            step="0.25"
            min="0"
            placeholder="Ej: 2.5 horas"
            class="w-full px-3 py-2 text-xs bg-white border border-[#EADBDE] rounded-xl focus:ring-2 focus:ring-[#9E5A78] focus:outline-none"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Tarifa por Hora de Mano de Obra ($)</label>
          <input
            v-model.number="precioHora"
            type="number"
            step="0.5"
            min="0"
            placeholder="10 $/h"
            class="w-full px-3 py-2 text-xs bg-white border border-[#EADBDE] rounded-xl focus:ring-2 focus:ring-[#9E5A78] focus:outline-none"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Costo de Empaque / Packaging ($/unidad)</label>
          <input
            v-model.number="costoEmpaqueEnvio"
            type="number"
            step="0.5"
            min="0"
            placeholder="Ej: 2 $"
            class="w-full px-3 py-2 text-xs bg-white border border-[#EADBDE] rounded-xl focus:ring-2 focus:ring-[#9E5A78] focus:outline-none"
          />
        </div>
      </div>

      <!-- Tabla de Insumos & Materiales -->
      <div class="space-y-3 pt-2">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-2 text-[#9E5A78] font-bold text-sm">
            <i class="bi bi-puzzle-fill"></i>
            <span>Materiales e Insumos Utilizados</span>
          </div>
          <button
            type="button"
            @click="agregarItem"
            class="px-3.5 py-1.5 bg-[#F7EFE9] hover:bg-[#EADBDE] text-[#9E5A78] text-xs font-bold rounded-xl transition flex items-center gap-1.5"
          >
            <i class="bi bi-plus-lg"></i> Agregar Insumo
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-[#FAF8F6] text-gray-600 uppercase tracking-wider font-semibold border-b border-[#EADBDE]">
              <tr>
                <th class="p-3">Nombre del Insumo</th>
                <th class="p-3">Precio Paquete ($)</th>
                <th class="p-3">Unid. por Paquete</th>
                <th class="p-3">Costo Unitario</th>
                <th class="p-3">Uso por Producto</th>
                <th class="p-3">Subtotal Insumo</th>
                <th class="p-3 text-center">Acción</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#FAF8F6]">
              <tr v-for="(item, idx) in items" :key="item.id" class="hover:bg-gray-50/70 transition">
                <td class="p-3 min-w-45">
                  <input
                    v-model="item.nombre"
                    type="text"
                    placeholder="Ej: Tela lino, Hilo, Cierre"
                    class="w-full px-2.5 py-1.5 bg-[#FAF8F6] border border-[#EADBDE] rounded-lg text-xs"
                  />
                </td>
                <td class="p-3 w-28">
                  <input
                    v-model.number="item.precioPaquete"
                    type="number"
                    step="0.1"
                    min="0"
                    class="w-full px-2.5 py-1.5 bg-[#FAF8F6] border border-[#EADBDE] rounded-lg text-xs font-semibold"
                  />
                </td>
                <td class="p-3 w-28">
                  <input
                    v-model.number="item.unidadesPaquete"
                    type="number"
                    min="1"
                    class="w-full px-2.5 py-1.5 bg-[#FAF8F6] border border-[#EADBDE] rounded-lg text-xs"
                  />
                </td>
                <td class="p-3 text-gray-600 font-medium whitespace-nowrap">
                  ${{ calcularCostoUnitario(item).toFixed(2) }}
                </td>
                <td class="p-3 w-28">
                  <input
                    v-model.number="item.cantidadUso"
                    type="number"
                    step="0.1"
                    min="0"
                    class="w-full px-2.5 py-1.5 bg-[#FAF8F6] border border-[#EADBDE] rounded-lg text-xs font-semibold text-[#9E5A78]"
                  />
                </td>
                <td class="p-3 font-bold text-gray-800 whitespace-nowrap">
                  ${{ calcularSubtotalItem(item).toFixed(2) }}
                </td>
                <td class="p-3 text-center">
                  <button
                    v-if="items.length > 1"
                    @click="eliminarItem(idx)"
                    type="button"
                    class="text-red-400 hover:text-red-600 p-1 transition"
                    title="Eliminar"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
