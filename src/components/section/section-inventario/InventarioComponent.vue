<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useInventario } from '../../../composable/useInventario'
import { useProveedores } from '../../../composable/useProveedores'
import InventarioStockView from './InventarioStockView.vue'
import InventarioStockModal from './InventarioStockModal.vue'
import InventarioProveedoresView from './InventarioProveedoresView.vue'
import InventarioModal from './InventarioModal.vue'

// Pestaña activa ('inventario' | 'proveedores')
const pestañaActiva = ref('inventario')

// Composable de Inventario / Materiales
const {
  materiales,
  cargando: cargandoInventario,
  modalAbierto: modalInventarioAbierto,
  materialEditar,
  obtenerMateriales,
  abrirModalCrear: abrirModalCrearMaterial,
  abrirModalEditar: abrirModalEditarMaterial,
  cerrarModal: cerrarModalMaterial,
  guardarMaterial,
  eliminarMaterial
} = useInventario()

// Composable de Proveedores
const {
  proveedores,
  cargando: cargandoProveedores,
  modalAbierto: modalProveedorAbierto,
  proveedorEditar,
  obtenerProveedores,
  abrirModalCrear: abrirModalCrearProveedor,
  abrirModalEditar: abrirModalEditarProveedor,
  cerrarModal: cerrarModalProveedor,
  guardarProveedor,
  eliminarProveedor,
  generarLinkWhatsApp
} = useProveedores()

let desuscribirInventario = null
let desuscribirProveedores = null

const handleGuardarMaterial = async (datos) => {
  try {
    await guardarMaterial(datos)
  } catch (err) {
    alert('No se pudo guardar el material en el servidor: ' + (err.message || 'Error de conexión'))
  }
}

const handleEliminarMaterial = async (id) => {
  try {
    await eliminarMaterial(id)
  } catch (err) {
    alert('No se pudo eliminar el material del servidor: ' + (err.message || 'Error de conexión'))
  }
}

const handleGuardarProveedor = async (datos) => {
  try {
    await guardarProveedor(datos)
  } catch (err) {
    alert('No se pudo guardar el proveedor en el servidor: ' + (err.message || 'Error de conexión'))
  }
}

const handleEliminarProveedor = async (id) => {
  try {
    await eliminarProveedor(id)
  } catch (err) {
    alert('No se pudo eliminar el proveedor del servidor: ' + (err.message || 'Error de conexión'))
  }
}

onMounted(() => {
  desuscribirInventario = obtenerMateriales()
  desuscribirProveedores = obtenerProveedores()
})

onUnmounted(() => {
  if (desuscribirInventario) desuscribirInventario()
  if (desuscribirProveedores) desuscribirProveedores()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header Principal & Alternador de Pestañas -->
    <div class="bg-white p-6 rounded-2xl border border-[#EADBDE] shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold font-serif-title text-[#1F1824]">Inventario & Proveedores</h1>
        <p class="text-xs text-gray-500 mt-1">Control de stock de materiales, insumos y directorio de proveedores</p>
      </div>

      <!-- Selector de Pestañas / Tabs -->
      <div class="inline-flex p-1 bg-[#FAF8F6] border border-[#EADBDE] rounded-xl self-stretch md:self-auto">
        <button
          type="button"
          @click="pestañaActiva = 'inventario'"
          class="flex-1 md:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2"
          :class="pestañaActiva === 'inventario'
            ? 'bg-white text-[#9E5A78] shadow-xs border border-[#EADBDE]'
            : 'text-gray-500 hover:text-[#1F1824]'"
        >
          <i class="bi bi-box-seam"></i>
          <span>Stock de Insumos</span>
          <span
            class="px-1.5 py-0.5 rounded-full text-[10px]"
            :class="pestañaActiva === 'inventario' ? 'bg-[#F7EFE9] text-[#9E5A78]' : 'bg-gray-200 text-gray-600'"
          >
            {{ materiales.length }}
          </span>
        </button>

        <button
          type="button"
          @click="pestañaActiva = 'proveedores'"
          class="flex-1 md:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2"
          :class="pestañaActiva === 'proveedores'
            ? 'bg-white text-[#9E5A78] shadow-xs border border-[#EADBDE]'
            : 'text-gray-500 hover:text-[#1F1824]'"
        >
          <i class="bi bi-truck"></i>
          <span>Proveedores</span>
          <span
            class="px-1.5 py-0.5 rounded-full text-[10px]"
            :class="pestañaActiva === 'proveedores' ? 'bg-[#F7EFE9] text-[#9E5A78]' : 'bg-gray-200 text-gray-600'"
          >
            {{ proveedores.length }}
          </span>
        </button>
      </div>
    </div>

    <!-- Vista de Stock / Materiales -->
    <InventarioStockView
      v-if="pestañaActiva === 'inventario'"
      :materiales="materiales"
      :cargando="cargandoInventario"
      @crear="abrirModalCrearMaterial"
      @editar="abrirModalEditarMaterial"
      @eliminar="handleEliminarMaterial"
    />

    <!-- Vista de Proveedores -->
    <InventarioProveedoresView
      v-else-if="pestañaActiva === 'proveedores'"
      :proveedores="proveedores"
      :cargando="cargandoProveedores"
      :generar-link-whats-app="generarLinkWhatsApp"
      @crear="abrirModalCrearProveedor"
      @editar="abrirModalEditarProveedor"
      @eliminar="handleEliminarProveedor"
    />

    <!-- Modales -->
    <InventarioStockModal
      :mostrar="modalInventarioAbierto"
      :material="materialEditar"
      :proveedores="proveedores"
      :cargando="cargandoInventario"
      @cerrar="cerrarModalMaterial"
      @guardar="handleGuardarMaterial"
    />

    <InventarioModal
      :mostrar="modalProveedorAbierto"
      :proveedor="proveedorEditar"
      :cargando="cargandoProveedores"
      @cerrar="cerrarModalProveedor"
      @guardar="handleGuardarProveedor"
    />
  </div>
</template>
