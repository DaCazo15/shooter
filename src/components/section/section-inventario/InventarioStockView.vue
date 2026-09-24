<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  materiales: {
    type: Array,
    default: () => []
  },
  cargando: Boolean
})

const emit = defineEmits(['crear', 'editar', 'eliminar'])

const busqueda = ref('')
const categoriaFiltro = ref('todas')

// Categorías únicas detectadas
const categorias = computed(() => {
  const cats = new Set(props.materiales.map(m => m.categoria).filter(Boolean))
  return ['todas', ...Array.from(cats)]
})

// Filtrado de materiales
const materialesFiltrados = computed(() => {
  return props.materiales.filter(m => {
    const coincideTexto = !busqueda.value || 
      (m.nombre && m.nombre.toLowerCase().includes(busqueda.value.toLowerCase())) ||
      (m.proveedor && m.proveedor.toLowerCase().includes(busqueda.value.toLowerCase())) ||
      (m.notas && m.notas.toLowerCase().includes(busqueda.value.toLowerCase()))

    const coincideCat = categoriaFiltro.value === 'todas' || m.categoria === categoriaFiltro.value

    return coincideTexto && coincideCat
  })
})

// Estadísticas de inventario
const totalMateriales = computed(() => props.materiales.length)
const totalValorStock = computed(() => {
  return props.materiales.reduce((acc, m) => acc + ((Number(m.cantidad) || 0) * (Number(m.costoUnitario) || 0)), 0)
})
const materialesStockBajo = computed(() => {
  return props.materiales.filter(m => (Number(m.cantidad) || 0) <= (Number(m.stockMinimo) || 0)).length
})
</script>

<template>
  <div class="space-y-5">
    <!-- Métricas del Inventario -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-white p-4 rounded-2xl border border-[#EADBDE] shadow-xs flex items-center gap-3">
        <div class="w-11 h-11 rounded-xl bg-[#F7EFE9] text-[#9E5A78] flex items-center justify-center text-xl shrink-0">
          <i class="bi bi-boxes"></i>
        </div>
        <div>
          <p class="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Insumos Registrados</p>
          <p class="text-xl font-bold text-[#1F1824]">{{ totalMateriales }}</p>
        </div>
      </div>

      <div class="bg-white p-4 rounded-2xl border border-[#EADBDE] shadow-xs flex items-center gap-3">
        <div class="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shrink-0">
          <i class="bi bi-cash-stack"></i>
        </div>
        <div>
          <p class="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Valor Estimado en Stock</p>
          <p class="text-xl font-bold text-emerald-700">${{ totalValorStock.toFixed(2) }}</p>
        </div>
      </div>

      <div class="bg-white p-4 rounded-2xl border border-[#EADBDE] shadow-xs flex items-center gap-3">
        <div
          class="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
          :class="materialesStockBajo > 0 ? 'bg-amber-50 text-amber-600' : 'bg-gray-100 text-gray-400'"
        >
          <i class="bi bi-exclamation-triangle"></i>
        </div>
        <div>
          <p class="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Stock Bajo / Crítico</p>
          <p
            class="text-xl font-bold"
            :class="materialesStockBajo > 0 ? 'text-amber-600' : 'text-gray-600'"
          >
            {{ materialesStockBajo }}
          </p>
        </div>
      </div>
    </div>

    <!-- Barra de Filtros y Búsqueda -->
    <div class="bg-white p-4 rounded-2xl border border-[#EADBDE] shadow-xs flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
      <div class="relative flex-1 max-w-md">
        <i class="bi bi-search absolute left-3.5 top-2.5 text-gray-400 text-xs"></i>
        <input
          v-model="busqueda"
          type="text"
          placeholder="Buscar insumo por nombre, proveedor..."
          class="w-full pl-9 pr-3.5 py-2 text-xs bg-[#FAF8F6] border border-[#EADBDE] rounded-xl focus:ring-2 focus:ring-[#9E5A78] focus:outline-none"
        />
      </div>

      <div class="flex items-center gap-2">
        <select
          v-model="categoriaFiltro"
          class="px-3.5 py-2 text-xs bg-[#FAF8F6] border border-[#EADBDE] rounded-xl focus:ring-2 focus:ring-[#9E5A78] focus:outline-none capitalize"
        >
          <option value="todas">Todas las categorías</option>
          <option v-for="cat in categorias.filter(c => c !== 'todas')" :key="cat" :value="cat">
            {{ cat }}
          </option>
        </select>

        <button
          @click="emit('crear')"
          class="px-4 py-2 bg-[#9E5A78] hover:bg-[#864662] text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 shrink-0"
        >
          <i class="bi bi-plus-lg"></i> Insumo
        </button>
      </div>
    </div>

    <!-- Estado Cargando -->
    <div v-if="cargando && !materiales.length" class="text-center py-12">
      <i class="bi bi-arrow-repeat animate-spin text-2xl text-[#9E5A78]"></i>
      <p class="text-xs text-gray-500 mt-2">Cargando inventario de materiales...</p>
    </div>

    <!-- Estado Vacío -->
    <div v-else-if="!materialesFiltrados.length" class="text-center py-16 bg-white rounded-2xl border border-dashed border-[#EADBDE] space-y-3">
      <div class="w-14 h-14 mx-auto rounded-2xl bg-[#F7EFE9] text-[#9E5A78] flex items-center justify-center text-2xl">
        <i class="bi bi-box-seam"></i>
      </div>
      <h3 class="font-bold text-sm text-[#1F1824]">
        {{ busqueda || categoriaFiltro !== 'todas' ? 'No se encontraron insumos' : 'Sin materiales en inventario' }}
      </h3>
      <p class="text-xs text-gray-500 max-w-sm mx-auto">
        {{ busqueda || categoriaFiltro !== 'todas' ? 'Prueba cambiando los filtros de búsqueda.' : 'Lleva el control de tus existencias de materia prima, empaques y suministros.' }}
      </p>
      <button
        v-if="!busqueda && categoriaFiltro === 'todas'"
        @click="emit('crear')"
        class="mt-2 px-5 py-2 bg-[#9E5A78] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#864662] transition inline-flex items-center gap-1.5"
      >
        <i class="bi bi-plus-circle"></i> Registrar primer insumo
      </button>
    </div>

    <!-- Tabla / Listado de Inventario -->
    <div v-else class="bg-white rounded-2xl border border-[#EADBDE] shadow-xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[#FAF8F6] border-b border-[#EADBDE] text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              <th class="py-3 px-4">Material / Insumo</th>
              <th class="py-3 px-4">Categoría</th>
              <th class="py-3 px-4 text-center">Stock Actual</th>
              <th class="py-3 px-4 text-right">Costo Unit.</th>
              <th class="py-3 px-4 text-right">Valor Total</th>
              <th class="py-3 px-4">Proveedor</th>
              <th class="py-3 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#FAF8F6] text-xs">
            <tr
              v-for="mat in materialesFiltrados"
              :key="mat.id"
              class="hover:bg-[#FAF8F6]/60 transition"
            >
              <!-- Nombre y Notas -->
              <td class="py-3 px-4">
                <div class="font-bold text-[#1F1824]">{{ mat.nombre }}</div>
                <div v-if="mat.notas" class="text-[10px] text-gray-400 truncate max-w-xs">{{ mat.notas }}</div>
              </td>

              <!-- Categoría -->
              <td class="py-3 px-4">
                <span class="px-2.5 py-1 bg-[#F7EFE9] text-[#9E5A78] text-[10px] font-bold rounded-lg inline-block">
                  {{ mat.categoria || 'General' }}
                </span>
              </td>

              <!-- Stock Actual y Estado -->
              <td class="py-3 px-4 text-center">
                <div class="inline-flex items-center gap-1.5">
                  <span
                    class="font-bold px-2 py-0.5 rounded-md text-xs"
                    :class="(Number(mat.cantidad) || 0) <= (Number(mat.stockMinimo) || 0)
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'"
                  >
                    {{ mat.cantidad }} {{ mat.unidad }}
                  </span>
                  <span
                    v-if="(Number(mat.cantidad) || 0) <= (Number(mat.stockMinimo) || 0)"
                    title="Stock bajo el mínimo sugerido"
                    class="text-amber-500 text-xs"
                  >
                    <i class="bi bi-exclamation-circle-fill"></i>
                  </span>
                </div>
              </td>

              <!-- Costo Unitario -->
              <td class="py-3 px-4 text-right font-medium text-gray-600">
                ${{ (Number(mat.costoUnitario) || 0).toFixed(2) }}
              </td>

              <!-- Valor Total -->
              <td class="py-3 px-4 text-right font-bold text-[#1F1824]">
                ${{ ((Number(mat.cantidad) || 0) * (Number(mat.costoUnitario) || 0)).toFixed(2) }}
              </td>

              <!-- Proveedor -->
              <td class="py-3 px-4 text-gray-600">
                <span v-if="mat.proveedor" class="inline-flex items-center gap-1 text-[11px]">
                  <i class="bi bi-truck text-gray-400"></i> {{ mat.proveedor }}
                </span>
                <span v-else class="text-gray-400 text-[11px] italic">No asignado</span>
              </td>

              <!-- Acciones -->
              <td class="py-3 px-4 text-center">
                <div class="inline-flex items-center gap-1">
                  <button
                    type="button"
                    @click="emit('editar', mat)"
                    title="Editar material"
                    class="p-1.5 text-[#9E5A78] hover:bg-[#F7EFE9] rounded-lg transition"
                  >
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button
                    type="button"
                    @click="emit('eliminar', mat.id)"
                    title="Eliminar material"
                    class="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
