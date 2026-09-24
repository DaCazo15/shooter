<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useCuentas } from '../../../composable/useCuentas'
import CuentaModal from './AccountModal.vue'

const {
  cuentas,
  cargando,
  monedasDisponibles,
  cargarCuentas,
  guardarCuenta,
  eliminarCuenta
} = useCuentas()

const modalAbierto = ref(false)
const cuentaSeleccionada = ref(null)
let unsubscribe = null

onMounted(() => {
  unsubscribe = cargarCuentas()
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})

const abrirModalCrear = () => {
  cuentaSeleccionada.value = null
  modalAbierto.value = true
}

const abrirModalEditar = (cuenta) => {
  cuentaSeleccionada.value = cuenta
  modalAbierto.value = true
}

const cerrarModal = () => {
  modalAbierto.value = false
  cuentaSeleccionada.value = null
}

const handleGuardar = async (datos) => {
  try {
    await guardarCuenta(datos)
    cerrarModal()
  } catch (error) {
    alert('Ocurrió un error al procesar la cuenta.')
  }
}
</script>

<template>
  <div class="max-w-6xl mx-auto p-6">
    <!-- Encabezado -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Gestión de Cuentas</h1>
        <p class="text-sm text-gray-500">Administra tus fondos, ingresos y egresos por cuenta</p>
      </div>
      <button
        @click="abrirModalCrear"
        class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 shadow-sm"
      >
        <i class="bi bi-plus-circle"></i> Nueva Cuenta
      </button>
    </div>

    <!-- Lista / Grilla de Cuentas -->
    <div v-if="cuentas.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="cuenta in cuentas"
        :key="cuenta.id"
        class="bg-white border border-gray-100 rounded-xl shadow-sm p-5 flex justify-between items-start hover:shadow-md transition"
      >
        <div>
          <span class="text-xs font-semibold px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md">
            {{ cuenta.moneda }}
          </span>
          <h2 class="text-lg font-bold text-gray-800 mt-2">{{ cuenta.nombre }}</h2>
          <p class="text-2xl font-black text-slate-800 mt-1">
            {{ cuenta.moneda === 'USD' ? '$' : cuenta.moneda === 'VES' ? 'Bs.' : '€' }}
            {{ (cuenta.saldoActual ?? cuenta.saldoInicial ?? 0).toFixed(2) }}
          </p>
        </div>

        <div class="flex gap-2">
          <button
            @click="abrirModalEditar(cuenta)"
            class="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
            title="Editar"
          >
            <i class="bi bi-pencil"></i>
          </button>
          <button
            @click="eliminarCuenta(cuenta.id)"
            class="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
            title="Eliminar"
          >
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Estado vacío -->
    <div v-else-if="!cargando" class="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
      <i class="bi bi-wallet2 text-4xl text-gray-400"></i>
      <p class="text-gray-500 mt-2 font-medium">No tienes cuentas registradas aún.</p>
      <button
        @click="abrirModalCrear"
        class="mt-4 text-emerald-600 font-bold hover:underline"
      >
        Registra tu primera cuenta
      </button>
    </div>

    <!-- Modal Formulario -->
    <CuentaModal
      :mostrar="modalAbierto"
      :cuentaEditar="cuentaSeleccionada"
      :monedas="monedasDisponibles"
      :cargando="cargando"
      @cerrar="cerrarModal"
      @guardar="handleGuardar"
    />
  </div>
</template>
