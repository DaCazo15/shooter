<script setup>
import { useCalculadora } from '../../../composable/useCalculadora.js'

const {
  items,
  cargando,
  formData,
  totalFinal,
  agregarItem,
  eliminarItem,
  calcularPrecioUnitario,
  calcularSubtotalFila,
  guardarCalculo
} = useCalculadora()

const handleSubmit = (data) => {
  guardarCalculo(data)
}
</script>

<template>
  <div class="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
    <FormKit
      type="form"
      v-model="formData"
      :actions="false"
      @submit="handleSubmit"
      incomplete-message="Por favor, completa todos los campos requeridos correctamente."
    >
      <!-- Configuración General -->
      <div class="grid grid-cols-1 gap-4 rounded-xl bg-gray-700 text-white font-medium px-5 py-4 mb-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormKit
            type="text"
            name="nombre"
            label="Nombre"
            placeholder="Escribe el nombre"
            validation="required|length:3"
          />
          <FormKit
            type="number"
            name="cantidad"
            label="Cantidad a producir"
            placeholder="1"
            value="1"
            validation="required|numeric|min:1"
          />
          <FormKit
            type="number"
            name="customPorcentaje"
            label="Porcentaje de ganancia"
            placeholder="0"
            value="15"
            validation="numeric|min:0"
          />
        </div>
      </div>

      <!-- Lista de Ítems Dinámica -->
      <div
        v-for="(item, index) in items" 
        :key="item.id"
        class="grid grid-cols-12 gap-4 items-center bg-gray-50 rounded-xl p-4 mb-4"
      >
        <div class="w-full col-span-10 grid grid-cols-3 gap-4 text-gray-700 font-medium">
          <FormKit
            type="text"
            :name="`nombreItem_${index}`"
            :label="`Nombre del ítem ${index + 1}`"
            placeholder="Silicon"
            validation="required|length:2"
          />
          <FormKit
            type="number"
            :name="`cantidadPaquete_${index}`"
            label="Unidades por paquete"
            placeholder="20"
            validation="required|numeric|min:1"
          />
          <FormKit
            type="number"
            :name="`cantidadUso_${index}`"
            label="Unidades a usar"
            placeholder="2"
            validation="required|numeric|min:0"
          />
          <FormKit
            type="number"
            :name="`precioItem_${index}`"
            label="Precio del paquete ($)"
            placeholder="20"
            validation="required|numeric|min:0"
          />
          <FormKit
            type="number"
            :name="`cantidadItem_${index}`"
            label="Paquetes comprados"
            placeholder="1"
            validation="numeric|min:1"
          />
          
          <!-- Desglose del gasto por fila -->
          <div class="col-span-3 flex justify-between items-center bg-gray-200/70 p-3 rounded-lg mt-2">
            <span class="text-sm text-gray-600 font-medium">
              Costo Unitario: <strong>${{ calcularPrecioUnitario(index).toFixed(2) }}</strong>
            </span>
            <span class="text-base font-bold text-emerald-800">
              Gasto Uso: ${{ calcularSubtotalFila(index).toFixed(2) }}
            </span>
          </div>
        </div>

        <!-- Botón para quitar ítem -->
        <div class="col-span-2 flex justify-center">
          <button
            v-if="items.length > 1"
            type="button"
            class="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition flex items-center gap-1"
            @click="eliminarItem(index)"
          >
            <i class="bi bi-trash"></i> Eliminar
          </button>
        </div>
      </div>

      <!-- Acciones y Resumen Global -->
      <div class="flex justify-between items-center mb-6">
        <div class="text-xl font-black text-slate-800">
          Total Inversión Utilizada: ${{ totalFinal.toFixed(2) }}
        </div>
        <button
          type="button"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition flex items-center gap-1"
          @click="agregarItem"
        >
          <i class="bi bi-plus-lg"></i> Agregar ítem
        </button>
      </div>

      <button
        type="submit"
        :disabled="cargando"
        class="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold py-3 px-6 rounded transition duration-200 shadow-md"
      >
        {{ cargando ? 'Guardando...' : 'Guardar' }}
      </button>
    </FormKit>
  </div>
</template>
