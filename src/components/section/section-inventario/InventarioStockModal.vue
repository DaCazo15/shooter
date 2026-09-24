<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  mostrar: Boolean,
  material: Object,
  proveedores: {
    type: Array,
    default: () => []
  },
  cargando: Boolean
})

const emit = defineEmits(['cerrar', 'guardar'])

const unidadesComunes = [
  'unidades',
  'gramos',
  'kg',
  'metros',
  'cm',
  'litros',
  'ml',
  'paquetes',
  'rollos',
  'cajas'
]

const categoriasComunes = [
  'Materia Prima',
  'Empaque & Envoltorio',
  'Herramientas',
  'Accesorios',
  'Químicos / Adhesivos',
  'Etiquetas / Papelería',
  'Otro'
]

const form = ref({
  nombre: '',
  categoria: 'Materia Prima',
  cantidad: 0,
  unidad: 'unidades',
  costoUnitario: 0,
  stockMinimo: 5,
  proveedor: '',
  notas: ''
})

watch(() => props.material, (mat) => {
  if (mat) {
    form.value = {
      nombre: mat.nombre || '',
      categoria: mat.categoria || 'Materia Prima',
      cantidad: mat.cantidad ?? 0,
      unidad: mat.unidad || 'unidades',
      costoUnitario: mat.costoUnitario ?? 0,
      stockMinimo: mat.stockMinimo ?? 5,
      proveedor: mat.proveedor || '',
      notas: mat.notas || ''
    }
  } else {
    form.value = {
      nombre: '',
      categoria: 'Materia Prima',
      cantidad: 0,
      unidad: 'unidades',
      costoUnitario: 0,
      stockMinimo: 5,
      proveedor: '',
      notas: ''
    }
  }
}, { immediate: true })

const handleSubmit = () => {
  if (!form.value.nombre) return
  emit('guardar', { ...form.value })
}
</script>

<template>
  <div
    v-if="mostrar"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
    @click.self="emit('cerrar')"
  >
    <div class="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
      <!-- Encabezado -->
      <div class="flex justify-between items-center px-6 py-4 bg-[#1F1824] shrink-0">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-[#9E5A78] flex items-center justify-center text-white text-sm">
            <i class="bi bi-box-seam"></i>
          </div>
          <h3 class="text-sm font-bold text-[#FAF8F6]">
            {{ material ? 'Editar Insumo / Material' : 'Nuevo Insumo al Inventario' }}
          </h3>
        </div>
        <button @click="emit('cerrar')" class="text-gray-400 hover:text-white transition">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <!-- Formulario -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-4 overflow-y-auto">
        <!-- Nombre y Categoría -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Nombre del Insumo *</label>
            <input
              v-model="form.nombre"
              type="text"
              placeholder="Resina Epóxica, Cinta Rosa"
              required
              class="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F6] border border-[#EADBDE] rounded-xl focus:ring-2 focus:ring-[#9E5A78] focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Categoría</label>
            <select
              v-model="form.categoria"
              class="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F6] border border-[#EADBDE] rounded-xl focus:ring-2 focus:ring-[#9E5A78] focus:outline-none"
            >
              <option v-for="cat in categoriasComunes" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>
        </div>

        <!-- Cantidad, Unidad y Stock Mínimo -->
        <div class="grid grid-cols-3 gap-3">
          <div>
            <label class="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">Stock Actual *</label>
            <input
              v-model.number="form.cantidad"
              type="number"
              min="0"
              step="any"
              required
              class="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F6] border border-[#EADBDE] rounded-xl focus:ring-2 focus:ring-[#9E5A78] focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">Unidad</label>
            <select
              v-model="form.unidad"
              class="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F6] border border-[#EADBDE] rounded-xl focus:ring-2 focus:ring-[#9E5A78] focus:outline-none"
            >
              <option v-for="u in unidadesComunes" :key="u" :value="u">{{ u }}</option>
            </select>
          </div>
          <div>
            <label class="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">Stock Mínimo</label>
            <input
              v-model.number="form.stockMinimo"
              type="number"
              min="0"
              step="any"
              placeholder="5"
              class="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F6] border border-[#EADBDE] rounded-xl focus:ring-2 focus:ring-[#9E5A78] focus:outline-none"
            />
          </div>
        </div>

        <!-- Costo Unitario y Proveedor -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Costo Unitario ($)</label>
            <div class="relative">
              <span class="absolute left-3.5 top-2.5 text-xs font-bold text-gray-400">$</span>
              <input
                v-model.number="form.costoUnitario"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                class="w-full pl-8 pr-3.5 py-2.5 text-xs bg-[#FAF8F6] border border-[#EADBDE] rounded-xl focus:ring-2 focus:ring-[#9E5A78] focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Proveedor Asociado</label>
            <select
              v-if="proveedores.length"
              v-model="form.proveedor"
              class="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F6] border border-[#EADBDE] rounded-xl focus:ring-2 focus:ring-[#9E5A78] focus:outline-none"
            >
              <option value="">-- Sin proveedor --</option>
              <option
                v-for="p in proveedores"
                :key="p.id"
                :value="`${p.nombre} ${p.apellido || ''}`.trim()"
              >
                {{ p.nombre }} {{ p.apellido || '' }}
              </option>
            </select>
            <input
              v-else
              v-model="form.proveedor"
              type="text"
              placeholder="Nombre del proveedor"
              class="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F6] border border-[#EADBDE] rounded-xl focus:ring-2 focus:ring-[#9E5A78] focus:outline-none"
            />
          </div>
        </div>

        <!-- Notas / Observaciones -->
        <div>
          <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Notas / Detalles adicionales</label>
          <textarea
            v-model="form.notas"
            placeholder="Ubicación en estante B, código de lote, etc."
            rows="2"
            class="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F6] border border-[#EADBDE] rounded-xl focus:ring-2 focus:ring-[#9E5A78] focus:outline-none resize-none"
          ></textarea>
        </div>

        <!-- Botones -->
        <div class="flex justify-end gap-3 pt-2">
          <button
            type="button"
            @click="emit('cerrar')"
            class="px-4 py-2.5 bg-gray-100 text-gray-600 text-xs font-bold rounded-xl hover:bg-gray-200 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="cargando"
            class="px-5 py-2.5 bg-[#9E5A78] hover:bg-[#864662] text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-2 disabled:opacity-50"
          >
            <i v-if="cargando" class="bi bi-arrow-repeat animate-spin"></i>
            <i v-else class="bi bi-check-lg"></i>
            <span>{{ cargando ? 'Guardando...' : 'Guardar en Inventario' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
