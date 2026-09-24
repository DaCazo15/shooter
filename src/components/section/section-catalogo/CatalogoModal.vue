<script setup>
import { ref, watch } from 'vue'
import CatalogoCalculadoraEmbed from './CatalogoCalculadoraEmbed.vue'

const props = defineProps({
  mostrar: {
    type: Boolean,
    default: false
  },
  productoEditar: {
    type: Object,
    default: null
  },
  cargando: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['cerrar', 'guardar'])

const mostrarCalculadora = ref(false)

const form = ref({
  titulo: '',
  categoria: 'Bolsos & Accesorios',
  descripcion: '',
  imagen: '',
  precio: 0,
  costo: 0,
  stock: 1,
  destacado: false
})

const categoriasDisponibles = [
  'Bolsos & Accesorios',
  'Joyería & Bisutería',
  'Ropa & Calzado',
  'Hogar & Decoración',
  'Papelería & Regalos',
  'Repostería & Gourmet',
  'Belleza & Cuidado Personal',
  'General'
]

watch(
  () => props.productoEditar,
  (nuevo) => {
    if (nuevo) {
      form.value = {
        titulo: nuevo.titulo || '',
        categoria: nuevo.categoria || 'General',
        descripcion: nuevo.descripcion || '',
        imagen: nuevo.imagen || '',
        precio: nuevo.precio || 0,
        costo: nuevo.costo || 0,
        stock: nuevo.stock ?? 1,
        destacado: !!nuevo.destacado
      }
    } else {
      form.value = {
        titulo: '',
        categoria: 'Bolsos & Accesorios',
        descripcion: '',
        imagen: '',
        precio: 0,
        costo: 0,
        stock: 1,
        destacado: false
      }
      mostrarCalculadora.value = false
    }
  },
  { immediate: true }
)

const aplicarCalculo = ({ precio, costo }) => {
  form.value.precio = precio
  form.value.costo = costo
  mostrarCalculadora.value = false
}

const handleSubmit = () => {
  emit('guardar', { ...form.value })
}
</script>

<template>
  <div
    v-if="mostrar"
    class="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto"
    @click.self="emit('cerrar')"
  >
    <div class="bg-white max-w-2xl w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#EADBDE] space-y-6 my-8 animate-in fade-in zoom-in-95 duration-150">
      <!-- Modal Header -->
      <div class="flex justify-between items-center border-b border-[#FAF8F6] pb-4">
        <div class="flex items-center gap-2.5 text-[#9E5A78]">
          <i class="bi bi-box-seam text-xl"></i>
          <div>
            <h2 class="text-lg font-bold text-[#1F1824]">
              {{ productoEditar ? 'Editar Producto' : 'Agregar Nuevo Producto al Catálogo' }}
            </h2>
            <p class="text-xs text-gray-500">Completa la ficha técnica y fija el precio de venta al público</p>
          </div>
        </div>
        <button
          type="button"
          @click="emit('cerrar')"
          class="text-gray-400 hover:text-gray-600 transition"
        >
          <i class="bi bi-x-lg text-lg"></i>
        </button>
      </div>

      <!-- Formulario Principal -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Título -->
          <div class="sm:col-span-2">
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Nombre / Título del Producto *</label>
            <input
              v-model="form.titulo"
              type="text"
              required
              placeholder="Ej: Bolso Tote de Cuero Vegano"
              class="w-full px-3.5 py-2 text-xs bg-[#FAF8F6] border border-[#EADBDE] rounded-xl focus:ring-2 focus:ring-[#9E5A78] focus:outline-none font-semibold"
            />
          </div>

          <!-- Categoría -->
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Categoría</label>
            <select
              v-model="form.categoria"
              class="w-full px-3.5 py-2 text-xs bg-[#FAF8F6] border border-[#EADBDE] rounded-xl focus:ring-2 focus:ring-[#9E5A78] focus:outline-none font-medium cursor-pointer"
            >
              <option v-for="cat in categoriasDisponibles" :key="cat" :value="cat">
                {{ cat }}
              </option>
            </select>
          </div>

          <!-- Stock -->
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Stock / Cantidad Disponible</label>
            <input
              v-model.number="form.stock"
              type="number"
              min="0"
              required
              class="w-full px-3.5 py-2 text-xs bg-[#FAF8F6] border border-[#EADBDE] rounded-xl focus:ring-2 focus:ring-[#9E5A78] focus:outline-none font-bold"
            />
          </div>

          <!-- Imagen URL -->
          <div class="sm:col-span-2">
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">URL de la Fotografía del Producto</label>
            <input
              v-model="form.imagen"
              type="url"
              placeholder="https://ejemplo.com/foto-producto.jpg"
              class="w-full px-3.5 py-2 text-xs bg-[#FAF8F6] border border-[#EADBDE] rounded-xl focus:ring-2 focus:ring-[#9E5A78] focus:outline-none"
            />
          </div>

          <!-- Descripción -->
          <div class="sm:col-span-2">
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Descripción Comercial</label>
            <textarea
              v-model="form.descripcion"
              rows="2"
              placeholder="Detalles sobre materiales, medidas, colores disponibles..."
              class="w-full px-3.5 py-2 text-xs bg-[#FAF8F6] border border-[#EADBDE] rounded-xl focus:ring-2 focus:ring-[#9E5A78] focus:outline-none"
            ></textarea>
          </div>
        </div>

        <!-- SECCIÓN DE PRECIO & ACCESO A LA CALCULADORA -->
        <div class="p-4 bg-[#F7EFE9] rounded-2xl border border-[#EADBDE] space-y-3">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <span class="text-xs font-bold text-[#9E5A78] uppercase tracking-wider block">Fijación de Precios & Costos</span>
              <span class="text-[11px] text-gray-500">¿No sabes cuánto cobrar? Usa la calculadora automática</span>
            </div>
            <button
              type="button"
              @click="mostrarCalculadora = !mostrarCalculadora"
              class="px-3.5 py-1.5 bg-[#9E5A78] hover:bg-[#864662] text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-xs"
            >
              <i class="bi bi-calculator-fill"></i>
              <span>{{ mostrarCalculadora ? 'Ocultar Calculadora' : 'Calcular con Calculadora' }}</span>
            </button>
          </div>

          <!-- Calculadora Embebida -->
          <CatalogoCalculadoraEmbed
            v-if="mostrarCalculadora"
            @aplicar-precio="aplicarCalculo"
            @cerrar="mostrarCalculadora = false"
          />

          <!-- Campos de Precio y Costo Directo -->
          <div class="grid grid-cols-2 gap-4 pt-1">
            <div>
              <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Costo Base ($)</label>
              <input
                v-model.number="form.costo"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                class="w-full px-3.5 py-2 text-xs bg-white border border-[#EADBDE] rounded-xl font-bold text-gray-700"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-[#9E5A78] uppercase mb-1">Precio de Venta PVP ($) *</label>
              <input
                v-model.number="form.precio"
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="0.00"
                class="w-full px-3.5 py-2 text-xs bg-white border border-[#EADBDE] rounded-xl font-bold text-[#9E5A78] focus:ring-2 focus:ring-[#9E5A78]"
              />
            </div>
          </div>
        </div>

        <!-- Botones de Acción -->
        <div class="flex justify-end gap-3 pt-4 border-t border-[#FAF8F6]">
          <button
            type="button"
            @click="emit('cerrar')"
            class="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="cargando"
            class="px-7 py-2.5 bg-[#9E5A78] hover:bg-[#864662] text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2"
          >
            <i v-if="cargando" class="bi bi-arrow-repeat animate-spin"></i>
            <i v-else class="bi bi-check2-circle"></i>
            <span>{{ productoEditar ? 'Guardar Cambios' : 'Registrar Producto' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
