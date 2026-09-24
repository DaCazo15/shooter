<script setup>
import { watch } from 'vue'
import { formData } from './config/config' 

const props = defineProps({
  mostrar: Boolean,
  cliente: Object,
  cargando: Boolean
})

const emit = defineEmits(['cerrar', 'guardar'])

// Cargar datos en el formulario si estamos editando
watch(() => props.cliente, (nuevoCliente) => {
  if (nuevoCliente) {
    formData.value = { ...nuevoCliente }
  } else {
    formData.value = {
      nombre: '',
      apellido: '',
      telefono: '',
      correo: '',
      direccion: '',
      cantidadPedidos: 0
    }
  }
}, { immediate: true })

const handleSubmit = (data) => {
  emit('guardar', data)
}
</script>

<template>
  <div 
    v-if="mostrar" 
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
  >
    <div class="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
      <div class="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
        <h3 class="text-lg font-bold">
          {{ cliente ? 'Editar Cliente' : 'Nuevo Cliente' }}
        </h3>
        <button 
          type="button" 
          @click="emit('cerrar')" 
          class="text-gray-400 hover:text-white text-xl"
        >
          &times;
        </button>
      </div>

      <div class="p-6">
        <FormKit
          type="form"
          v-model="formData"
          :actions="false"
          @submit="handleSubmit"
        >
          <div class="grid grid-cols-2 gap-4">
            <FormKit
              type="text"
              name="nombre"
              label="Nombre"
              placeholder="Ej. Juan"
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

          <div class="grid grid-cols-2 gap-4">
            <FormKit
              type="tel"
              name="telefono"
              label="Teléfono (WhatsApp)"
              placeholder="Ej. 584120000000"
              validation="required"
            />
            <FormKit
              type="email"
              name="correo"
              label="Correo Electrónico"
              placeholder="juan@ejemplo.com"
              validation="email"
            />
          </div>

          <FormKit
            type="text"
            name="direccion"
            label="Dirección"
            placeholder="Escribe la dirección exacta"
          />

          <FormKit
            type="number"
            name="cantidadPedidos"
            label="Cantidad de Pedidos"
            placeholder="0"
            validation="numeric|min:0"
          />

          <div class="flex justify-end gap-3 mt-6">
            <button
              type="button"
              @click="emit('cerrar')"
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="cargando"
              class="px-5 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 disabled:bg-emerald-400 transition"
            >
              {{ cargando ? 'Guardando...' : (cliente ? 'Actualizar' : 'Registrar') }}
            </button>
          </div>
        </FormKit>
      </div>
    </div>
  </div>
</template>
