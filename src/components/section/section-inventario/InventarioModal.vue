<script setup>
import { computed } from 'vue'

const props = defineProps({
  mostrar: Boolean,
  proveedor: Object,
  cargando: Boolean
})

const emit = defineEmits(['cerrar', 'guardar'])

// Pre-llenar datos si es edición
const formDataInicial = computed(() => {
  if (props.proveedor) {
    return {
      nombre: props.proveedor.nombre || '',
      apellido: props.proveedor.apellido || '',
      telefono: props.proveedor.telefono || '',
      correo: props.proveedor.correo || '',
      mercancia: props.proveedor.mercancia || ''
    }
  }
  return {
    nombre: '',
    apellido: '',
    telefono: '',
    correo: '',
    mercancia: ''
  }
})

const handleSubmit = (data) => {
  emit('guardar', data)
}
</script>

<template>
  <div
    v-if="mostrar"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
  >
    <div class="w-full max-w-lg bg-white rounded-xl shadow-xl overflow-hidden">
      <!-- Encabezado Modal -->
      <div class="flex justify-between items-center px-6 py-4 bg-gray-800 text-white">
        <h3 class="text-lg font-bold">
          {{ proveedor ? 'Editar Proveedor' : 'Nuevo Proveedor' }}
        </h3>
        <button
          type="button"
          class="text-gray-400 hover:text-white text-xl"
          @click="emit('cerrar')"
        >
          &times;
        </button>
      </div>

      <!-- Formulario con FormKit -->
      <div class="p-6">
        <FormKit
          type="form"
          :value="formDataInicial"
          :actions="false"
          @submit="handleSubmit"
        >
          <div class="grid grid-cols-2 gap-4">
            <FormKit
              type="text"
              name="nombre"
              label="Nombre"
              placeholder="Ej. Carlos"
              validation="required|length:2"
            />
            <FormKit
              type="text"
              name="apellido"
              label="Apellido"
              placeholder="Ej. Pérez"
              validation="required|length:2"
            />
          </div>

          <div class="grid grid-cols-2 gap-4 mt-3">
            <FormKit
              type="text"
              name="telefono"
              label="Teléfono"
              placeholder="Ej. +584120000000"
              validation="required"
            />
            <FormKit
              type="email"
              name="correo"
              label="Correo electrónico"
              placeholder="proveedor@correo.com"
              validation="required|email"
            />
          </div>

          <div class="mt-3">
            <FormKit
              type="textarea"
              name="mercancia"
              label="Mercancía / Productos que suministra"
              placeholder="Ej. Silicón, Herramientas, Empaques"
              rows="3"
              validation="required"
            />
          </div>

          <!-- Botones de Acción -->
          <div class="flex justify-end gap-3 mt-6">
            <button
              type="button"
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              @click="emit('cerrar')"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="cargando"
              class="px-5 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 disabled:bg-emerald-400 transition"
            >
              {{ cargando ? 'Guardando...' : 'Guardar' }}
            </button>
          </div>
        </FormKit>
      </div>
    </div>
  </div>
</template>
