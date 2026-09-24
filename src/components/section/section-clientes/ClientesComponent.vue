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
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-[#EADBDE] shadow-xs">
      <div>
        <h1 class="text-2xl font-bold font-serif-title text-[#1F1824]">Gestión de Clientes</h1>
        <p class="text-xs text-gray-500 mt-1">Registra, edita y contacta a tus clientes directamente</p>
      </div>
      <button
        type="button"
        @click="abrirModalCrear"
        class="px-5 py-2.5 bg-[#9E5A78] hover:bg-[#864662] text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
      >
        <i class="bi bi-person-plus"></i> Registrar Cliente
      </button>
    </div>

    <!-- Estado Vacío -->
    <div v-if="!clientes.length && !cargando" class="text-center py-16 bg-white rounded-2xl border border-dashed border-[#EADBDE] space-y-3">
      <div class="w-14 h-14 mx-auto rounded-2xl bg-[#F7EFE9] text-[#9E5A78] flex items-center justify-center text-2xl">
        <i class="bi bi-people"></i>
      </div>
      <h3 class="font-bold text-sm text-[#1F1824]">Sin clientes registrados</h3>
      <p class="text-xs text-gray-500 max-w-sm mx-auto">Agrega tus clientes para gestionar pedidos y comunicarte de forma rápida por WhatsApp.</p>
      <button
        @click="abrirModalCrear"
        class="mt-2 px-5 py-2 bg-[#9E5A78] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#864662] transition inline-flex items-center gap-1.5"
      >
        <i class="bi bi-person-plus"></i> Agregar el primero
      </button>
    </div>

    <!-- Tabla de Clientes -->
    <div v-else-if="clientes.length > 0" class="bg-white rounded-2xl border border-[#EADBDE] shadow-xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-[#FAF8F6] text-[10px] text-gray-500 uppercase tracking-wider font-bold border-b border-[#EADBDE]">
              <th class="p-4">Cliente</th>
              <th class="p-4">Contacto</th>
              <th class="p-4">Dirección</th>
              <th class="p-4 text-center">Pedidos</th>
              <th class="p-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#FAF8F6] text-xs">
            <tr v-for="cliente in clientes" :key="cliente.id" class="hover:bg-[#FAF8F6]/60 transition">
              <td class="p-4">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-xl bg-[#F7EFE9] text-[#9E5A78] flex items-center justify-center text-sm font-bold shrink-0">
                    {{ (cliente.nombre || '?')[0].toUpperCase() }}
                  </div>
                  <span class="font-bold text-[#1F1824]">{{ cliente.nombre }} {{ cliente.apellido }}</span>
                </div>
              </td>
              <td class="p-4">
                <div class="text-[#1F1824] font-medium">{{ cliente.telefono }}</div>
                <div class="text-[11px] text-gray-400">{{ cliente.correo || 'Sin correo' }}</div>
              </td>
              <td class="p-4 text-gray-600">
                {{ cliente.direccion || 'No especificada' }}
              </td>
              <td class="p-4 text-center">
                <span class="px-2.5 py-1 bg-[#F7EFE9] text-[#9E5A78] text-[11px] font-bold rounded-full">
                  {{ cliente.cantidadPedidos }}
                </span>
              </td>
              <td class="p-4">
                <div class="flex items-center justify-center gap-1.5">
                  <button
                    type="button"
                    @click="abrirWhatsApp(cliente.telefono)"
                    class="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition"
                    title="Chat por WhatsApp"
                  >
                    <i class="bi bi-whatsapp"></i>
                  </button>
                  <button
                    type="button"
                    @click="abrirModalEditar(cliente)"
                    class="p-2 text-[#9E5A78] hover:bg-[#F7EFE9] rounded-lg transition"
                    title="Editar datos"
                  >
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button
                    type="button"
                    @click="eliminarCliente(cliente.id)"
                    class="p-2 text-red-400 hover:bg-red-50 rounded-lg transition"
                    title="Eliminar cliente"
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

    <!-- Modal -->
    <ClienteModal
      :mostrar="esModalAbierta"
      :cliente="clienteSeleccionado"
      :cargando="cargando"
      @cerrar="cerrarModal"
      @guardar="guardarCliente"
    />
  </div>
</template>
