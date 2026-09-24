<script setup>
import { useClientes } from '../../../composable/useClientes'
import ClienteModal from './ClienteModal.vue'

const {
  clientes,
  cargando,
  esModalAbierta,
  clienteSeleccionado,
  abrirModalCrear,
  abrirModalEditar,
  cerrarModal,
  guardarCliente,
  eliminarCliente,
  abrirWhatsApp
} = useClientes()
</script>

<template>
  <div class="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
    <!-- Encabezado de la Sección -->
    <div class="flex justify-between items-center mb-6 border-b pb-4">
      <div>
        <h1 class="text-2xl font-black text-gray-800">Gestión de Clientes</h1>
        <p class="text-sm text-gray-500">Registra, edita y contacta a tus clientes</p>
      </div>
      <button
        type="button"
        @click="abrirModalCrear"
        class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg transition flex items-center gap-2 shadow-sm"
      >
        <i class="bi bi-person-plus-fill"></i> Registrar Cliente
      </button>
    </div>

    <!-- Lista / Tabla de Clientes -->
    <div v-if="clientes.length > 0" class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-gray-100 text-gray-700 uppercase text-xs">
            <th class="p-3 border-b">Cliente</th>
            <th class="p-3 border-b">Contacto</th>
            <th class="p-3 border-b">Dirección</th>
            <th class="p-3 border-b text-center">Pedidos</th>
            <th class="p-3 border-b text-center">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 text-sm">
          <tr v-for="cliente in clientes" :key="cliente.id" class="hover:bg-gray-50">
            <td class="p-3 font-semibold text-gray-800">
              {{ cliente.nombre }} {{ cliente.apellido }}
            </td>
            <td class="p-3">
              <div class="text-gray-700">{{ cliente.telefono }}</div>
              <div class="text-xs text-gray-400">{{ cliente.correo || 'Sin correo' }}</div>
            </td>
            <td class="p-3 text-gray-600">
              {{ cliente.direccion || 'No especificada' }}
            </td>
            <td class="p-3 text-center">
              <span class="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full">
                {{ cliente.cantidadPedidos }}
              </span>
            </td>
            <td class="p-3">
              <div class="flex items-center justify-center gap-2">
                <!-- Botón WhatsApp -->
                <button
                  type="button"
                  @click="abrirWhatsApp(cliente.telefono)"
                  class="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition"
                  title="Chat por WhatsApp"
                >
                  <i class="bi bi-whatsapp"></i>
                </button>

                <!-- Botón Editar -->
                <button
                  type="button"
                  @click="abrirModalEditar(cliente)"
                  class="bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-lg transition"
                  title="Editar datos"
                >
                  <i class="bi bi-pencil-square"></i>
                </button>

                <!-- Botón Eliminar -->
                <button
                  type="button"
                  @click="eliminarCliente(cliente.id)"
                  class="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition"
                  title="Eliminar cliente"
                >
                  <i class="bi bi-trash-fill"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Estado Vacío -->
    <div v-else class="text-center py-12 text-gray-500">
      <i class="bi bi-people text-4xl mb-2 block"></i>
      <p class="text-lg">No hay clientes registrados aún.</p>
    </div>

    <!-- Modal Component -->
    <ClienteModal
      :mostrar="esModalAbierta"
      :cliente="clienteSeleccionado"
      :cargando="cargando"
      @cerrar="cerrarModal"
      @guardar="guardarCliente"
    />
  </div>
</template>
