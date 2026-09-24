<script setup>
import { formData } from './config/config'
import { useCalculadora } from '../../../composable/useCalculadora'
import CalculadoraItemRow from './CalculadoraItemRow.vue'

const {
  items,
  agregarItem,
  eliminarItem,
  calcularSubtotalItem,
  totalGeneral,
  handleSubmit
} = useCalculadora(formData)
</script>

<template>
  <div class="w-3/4 mx-auto p-6 bg-white rounded-lg shadow-md">
    <FormKit
      type="form"
      v-model="formData"
      :actions="false"
      @submit="handleSubmit"
      incomplete-message="Por favor, completa todos los campos requeridos correctamente."
    >
      <!-- Configuración General -->
      <div class="grid grid-cols-1 gap-4 rounded-xl bg-gray-700 text-white font-medium px-5 py-4 mb-4">
        <div class="grid grid-cols-2 gap-4">
          <FormKit
            type="checkbox"
            name="save"
            label="Guardar"
          />
          <FormKit
            type="checkbox"
            name="porcentaje"
            label="Porcentaje (30%)"
          />
          <FormKit
            type="text"
            name="nombre"
            label="Nombre"
            placeholder="Escribe tu nombre"
            validation="required|length:3"
          />
          <FormKit
            v-if="!formData.porcentaje"
            type="number"
            name="customPorcentaje"
            label="Porcentaje personalizado"
            placeholder="Escribe el porcentaje"
            validation="required|between:0,100"
          />
        </div>
      </div>

      <!-- Lista de Ítems Dinámica mediante Componentes -->
      <CalculadoraItemRow
        v-for="(item, index) in items"
        :key="item.id"
        :index="index"
        :can-delete="items.length > 1"
        :subtotal="calcularSubtotalItem(index)"
        @delete="eliminarItem(index)"
      />

      <!-- Botón para añadir ítems y resumen de total -->
      <div class="flex justify-between items-center mb-6">
        <div class="text-xl font-black text-slate-800">
          Total: ${{ totalGeneral.toFixed(2) }}
        </div>
        <button
          type="button"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition flex items-center gap-1"
          @click="agregarItem"
        >
          <i class="bi bi-plus-lg"></i> Agregar ítem
        </button>
      </div>

      <!-- Botón de Envío -->
      <button
        type="submit"
        class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded transition duration-200 shadow-md"
      >
        Calcular
      </button>
    </FormKit>
  </div>
</template>
