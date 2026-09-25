<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useCatalogo } from '../../../composable/useCatalogo'
import CatalogoStats from './CatalogoStats.vue'
import CatalogoCard from './CatalogoCard.vue'
import CatalogoModal from './CatalogoModal.vue'

const {
  catalogo,
  cargando,
  metricasCatalogo,
  iniciarEscuchaCatalogo,
  detenerEscucha,
  agregarProducto,
  actualizarProducto,
  eliminarProducto
} = useCatalogo()

const modalAbierto = ref(false)
const productoSeleccionado = ref(null)
const busqueda = ref('')
const categoriaFiltro = ref('Todos')

onMounted(() => {
  iniciarEscuchaCatalogo()
})

onUnmounted(() => {
  detenerEscucha()
})

const abrirModalCrear = () => {
  productoSeleccionado.value = null
  modalAbierto.value = true
}

const abrirModalEditar = (producto) => {
  productoSeleccionado.value = producto
  modalAbierto.value = true
}

const cerrarModal = () => {
  modalAbierto.value = false
  productoSeleccionado.value = null
}

const handleGuardar = async (datos) => {
  try {
    if (productoSeleccionado.value) {
      await actualizarProducto(productoSeleccionado.value.id, datos)
    } else {
      await agregarProducto(datos)
    }
    cerrarModal()
  } catch (err) {
    alert('No se pudo guardar el producto en el servidor: ' + (err.message || 'Error de conexión o permisos'))
  }
}

const handleEliminar = async (id) => {
  if (confirm('¿Estás segura de eliminar este producto del catálogo?')) {
    try {
      await eliminarProducto(id)
    } catch (err) {
      alert('No se pudo eliminar el producto del servidor: ' + (err.message || 'Error de conexión o permisos'))
    }
  }
}

const productosFiltrados = computed(() => {
  return (catalogo.value || []).filter(p => {
    const matchCat = categoriaFiltro.value === 'Todos' || p.categoria === categoriaFiltro.value
    const matchBusq = (p.titulo || '').toLowerCase().includes(busqueda.value.toLowerCase())
    return matchCat && matchBusq
  })
})

const categorias = computed(() => {
  const set = new Set((catalogo.value || []).map(p => p.categoria).filter(Boolean))
  return ['Todos', ...Array.from(set)]
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header Principal -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-[#EADBDE] shadow-xs">
      <div>
        <h1 class="text-2xl font-bold font-serif-title text-[#1F1824]">Catálogo de Productos</h1>
        <p class="text-xs text-gray-500 mt-1">Administra tu inventario de productos terminados, precios de venta y margen comercial</p>
      </div>

      <button
        @click="abrirModalCrear"
        class="px-5 py-2.5 bg-[#9E5A78] hover:bg-[#864662] text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
      >
        <i class="bi bi-plus-circle-fill"></i>
        <span>Agregar Producto</span>
      </button>
    </div>

    <!-- 1. Métricas / Valor del Catálogo -->
    <CatalogoStats :metricas="metricasCatalogo" />

    <!-- 2. Filtros y Búsqueda -->
    <div class="bg-white p-4 rounded-2xl border border-[#EADBDE] shadow-xs flex flex-col md:flex-row justify-between items-center gap-4">
      <!-- Búsqueda -->
      <div class="w-full md:w-72 relative">
        <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
          <i class="bi bi-search text-xs"></i>
        </span>
        <input
          v-model="busqueda"
          type="text"
          placeholder="Buscar producto por nombre..."
          class="w-full pl-9 pr-3.5 py-2 text-xs bg-[#FAF8F6] border border-[#EADBDE] rounded-xl focus:ring-2 focus:ring-[#9E5A78] focus:outline-none"
        />
      </div>

      <!-- Filtros por Categoría -->
      <div class="flex flex-wrap gap-2 w-full md:w-auto">
        <button
          v-for="cat in categorias"
          :key="cat"
          @click="categoriaFiltro = cat"
          class="px-3 py-1.5 rounded-lg text-xs font-semibold transition"
          :class="categoriaFiltro === cat ? 'bg-[#9E5A78] text-white shadow-xs' : 'bg-[#FAF8F6] text-gray-600 hover:bg-[#F7EFE9]'"
        >
          {{ cat }}
        </button>
      </div>
    </div>

    <!-- 3. Lista / Grilla de Productos -->
    <div v-if="cargando" class="text-center py-16 text-gray-400 text-xs font-semibold">
      <i class="bi bi-arrow-repeat animate-spin text-2xl block mb-2 text-[#9E5A78]"></i>
      Cargando catálogo...
    </div>

    <div v-else-if="productosFiltrados.length === 0" class="text-center py-16 bg-white rounded-2xl border border-dashed border-[#EADBDE] p-8 space-y-3">
      <div class="w-14 h-14 mx-auto rounded-2xl bg-[#F7EFE9] text-[#9E5A78] flex items-center justify-center text-2xl">
        <i class="bi bi-bag-plus"></i>
      </div>
      <h3 class="font-bold text-sm text-[#1F1824]">No hay productos en el catálogo</h3>
      <p class="text-xs text-gray-500 max-w-sm mx-auto">
        Registra tu primer producto para comenzar a vender en tu vitrina web y calcular la rentabilidad de tu stock.
      </p>
      <button
        @click="abrirModalCrear"
        class="mt-2 px-5 py-2 bg-[#9E5A78] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#864662] transition inline-flex items-center gap-1.5"
      >
        <i class="bi bi-plus-lg"></i>
        <span>Agregar Producto Ahora</span>
      </button>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <CatalogoCard
        v-for="(item, index) in productosFiltrados"
        :key="item.id"
        :item="item"
        :index="index"
        @editar="abrirModalEditar"
        @eliminar="handleEliminar"
      />
    </div>

    <!-- 4. Modal de Creación / Edición -->
    <CatalogoModal
      :mostrar="modalAbierto"
      :productoEditar="productoSeleccionado"
      :cargando="cargando"
      @cerrar="cerrarModal"
      @guardar="handleGuardar"
    />
  </div>
</template>
