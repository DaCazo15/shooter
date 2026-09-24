<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useProveedores } from '../../../composable/useProveedores'
import InventarioModal from './InventarioModal.vue'

const {
  proveedores,
  cargando,
  modalAbierto,
  proveedorEditar,
  obtenerProveedores,
  abrirModalCrear,
  abrirModalEditar,
  cerrarModal,
  guardarProveedor,
  eliminarProveedor,
  generarLinkWhatsApp
} = useProveedores()

let desuscribir = null

onMounted(() => {
  desuscribir = obtenerProveedores()
})

onUnmounted(() => {
  if (desuscribir) desuscribir()
})
</script>

<template>
  <div class="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
    <!-- Header de la sección -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Proveedores</h2>
        <p class="text-sm text-gray-500">Gestión de contactos y suministro de mercancía</p>
      </div>
      <button
        type="button"
        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition flex items-center gap-2"
        @click="abrirModalCrear"
      >
        <i class="bi bi-person-plus-fill"></i> Registrar Proveedor
      </button>
    </div>

    <!-- Lista de Proveedores -->
    <div v-if="cargando && !proveedores.length" class="text-center py-8 text-gray-500">
      Cargando proveedores...
    </div>

    <div v-else-if="!proveedores.length" class="text-center py-8 text-gray-400">
      No hay proveedores registrados aún.
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="prov in proveedores"
        :key="prov.id"
        class="border border-gray-200 rounded-xl p-5 bg-gray-50 hover:shadow-md transition flex flex-col justify-between"
      >
        <div>
          <div class="flex justify-between items-start mb-2">
            <div>
              <h3 class="text-lg font-bold text-gray-800">
                {{ prov.nombre }} {{ prov.apellido }}
              </h3>
              <p class="text-xs text-gray-500">{{ prov.correo }}</p>
            </div>
            <!-- Botón WhatsApp -->
            <a
              :href="generarLinkWhatsApp(prov.telefono, prov.nombre)"
              target="_blank"
              rel="noopener noreferrer"
              class="bg-emerald-500 hover:bg-emerald-600 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 font-medium transition"
            >
              <i class="bi bi-whatsapp"></i> Chat
            </a>
          </div>

          <div class="my-3">
            <span class="text-xs text-gray-400 font-semibold uppercase">Teléfono</span>
            <p class="text-sm text-gray-700 font-medium">{{ prov.telefono }}</p>
          </div>

          <div>
            <span class="text-xs text-gray-400 font-semibold uppercase">Mercancía</span>
            <p class="text-sm text-gray-600 bg-white p-2 rounded border border-gray-100 mt-1">
              {{ prov.mercancia }}
            </p>
          </div>
        </div>

        <!-- Acciones Editar / Eliminar -->
        <div class="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-200">
          <button
            type="button"
            class="text-blue-600 hover:text-blue-800 text-sm font-medium px-2 py-1 flex items-center gap-1"
            @click="abrirModalEditar(prov)"
          >
            <i class="bi bi-pencil"></i> Editar
          </button>
          <button
            type="button"
            class="text-red-600 hover:text-red-800 text-sm font-medium px-2 py-1 flex items-center gap-1"
            @click="eliminarProveedor(prov.id)"
          >
            <i class="bi bi-trash"></i> Eliminar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Formulario -->
    <ProveedorModal
      :mostrar="modalAbierto"
      :proveedor="proveedorEditar"
      :cargando="cargando"
      @cerrar="cerrarModal"
      @guardar="guardarProveedor"
    />
  </div>
</template>
