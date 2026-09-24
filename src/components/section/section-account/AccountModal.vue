<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  mostrar: Boolean,
  cuentaEditar: Object,
  monedas: Array,
  cargando: Boolean
})

const emit = defineEmits(['cerrar', 'guardar'])

const formData = ref({
  nombre: '',
  moneda: 'USD',
  saldoInicial: 0
})

// Rellenar formulario si estamos editando
watch(() => props.cuentaEditar, (nuevaCuenta) => {
  if (nuevaCuenta) {
    formData.value = {
      id: nuevaCuenta.id,
      nombre: nuevaCuenta.nombre,
      moneda: nuevaCuenta.moneda,
      saldoInicial: nuevaCuenta.saldoInicial || 0
    }
  } else {
    formData.value = { nombre: '', moneda: 'USD', saldoInicial: 0 }
  }
}, { immediate: true })

const handleSubmit = (data) => {
  emit('guardar', { ...data, id: props.cuentaEditar?.id })
}
</script>

<template>
  <div v-if="mostrar" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-bold text-gray-800">
          {{ cuentaEditar ? 'Editar Cuenta' : 'Nueva Cuenta' }}
        </h3>
        <button @click="emit('cerrar')" class="text-gray-400 hover:text-gray-600">
          <i class="bi bi-x-lg text-xl"></i>
        </button>
      </div>

      <FormKit
        type="form"
        v-model="formData"
        :actions="false"
        @submit="handleSubmit"
      >
        <FormKit
          type="text"
          name="nombre"
          label="Nombre de la cuenta"
          placeholder="Ej. Banesco, PayPal, Efectivo"
          validation="required|length:2"
          class="mb-4"
        />

        <FormKit
          type="select"
          name="moneda"
          label="Moneda"
          :options="monedas"
          validation="required"
          class="mb-4"
        />

        <FormKit
          type="number"
          name="saldoInicial"
          label="Saldo inicial"
          placeholder="0.00"
          step="0.01"
          validation="numeric"
          class="mb-6"
        />

        <div class="flex justify-end gap-3 mt-6">
          <button
            type="button"
            @click="emit('cerrar')"
            class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="cargando"
            class="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold disabled:bg-emerald-300"
          >
            {{ cargando ? 'Guardando...' : 'Guardar Cuenta' }}
          </button>
        </div>
      </FormKit>
    </div>
  </div>
</template>
