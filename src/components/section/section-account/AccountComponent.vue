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

const simboloMoneda = (moneda) => {
  const map = { USD: '$', VES: 'Bs.', EUR: '€' }
  return map[moneda] || moneda
}

const colorMoneda = (moneda) => {
  const map = {
    USD: 'bg-emerald-50 text-emerald-700',
    VES: 'bg-blue-50 text-blue-700',
    EUR: 'bg-amber-50 text-amber-700'
  }
  return map[moneda] || 'bg-gray-50 text-gray-700'
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-[#EADBDE] shadow-xs">
      <div>
        <h1 class="text-2xl font-bold font-serif-title text-[#1F1824]">Gestión de Cuentas</h1>
        <p class="text-xs text-gray-500 mt-1">Administra tus fondos, ingresos y egresos por cuenta</p>
      </div>
      <button
        @click="abrirModalCrear"
        class="px-5 py-2.5 bg-[#9E5A78] hover:bg-[#864662] text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
      >
        <i class="bi bi-plus-circle"></i> Nueva Cuenta
      </button>
    </div>

    <!-- Estado Vacío -->
    <div v-if="!cuentas.length && !cargando" class="text-center py-16 bg-white rounded-2xl border border-dashed border-[#EADBDE] space-y-3">
      <div class="w-14 h-14 mx-auto rounded-2xl bg-[#F7EFE9] text-[#9E5A78] flex items-center justify-center text-2xl">
        <i class="bi bi-wallet2"></i>
      </div>
      <h3 class="font-bold text-sm text-[#1F1824]">Sin cuentas registradas</h3>
      <p class="text-xs text-gray-500 max-w-sm mx-auto">Registra tus cuentas para llevar un control organizado de tus fondos e ingresos.</p>
      <button
        @click="abrirModalCrear"
        class="mt-2 px-5 py-2 bg-[#9E5A78] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#864662] transition inline-flex items-center gap-1.5"
      >
        <i class="bi bi-plus-circle"></i> Registra tu primera cuenta
      </button>
    </div>

    <!-- Grilla de Cuentas -->
    <div v-else-if="cuentas.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="cuenta in cuentas"
        :key="cuenta.id"
        class="bg-white rounded-2xl border border-[#EADBDE] shadow-xs p-5 hover:shadow-md transition flex justify-between items-start"
      >
        <div class="space-y-2">
          <span
            class="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider"
            :class="colorMoneda(cuenta.moneda)"
          >
            {{ cuenta.moneda }}
          </span>
          <h2 class="text-sm font-bold text-[#1F1824]">{{ cuenta.nombre }}</h2>
          <p class="text-2xl font-black text-[#1F1824]">
            {{ simboloMoneda(cuenta.moneda) }}{{ (cuenta.saldoActual ?? cuenta.saldoInicial ?? 0).toFixed(2) }}
          </p>
          <p class="text-[11px] text-gray-400">
            Saldo inicial: {{ simboloMoneda(cuenta.moneda) }}{{ (cuenta.saldoInicial ?? 0).toFixed(2) }}
          </p>
        </div>

        <div class="flex gap-1.5">
          <button
            @click="abrirModalEditar(cuenta)"
            class="p-2 text-[#9E5A78] hover:bg-[#F7EFE9] rounded-lg transition"
            title="Editar"
          >
            <i class="bi bi-pencil"></i>
          </button>
          <button
            @click="eliminarCuenta(cuenta.id)"
            class="p-2 text-red-400 hover:bg-red-50 rounded-lg transition"
            title="Eliminar"
          >
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal -->
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
