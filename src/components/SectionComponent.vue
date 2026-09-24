<script setup>
import { defineAsyncComponent } from 'vue'

const props = defineProps({
  section: {
    type: Object,
    required: true
  }
})

const componentsMap = {
  calculadora: defineAsyncComponent(() => import('./section/section-calculadora/CalculadoraComponent.vue')),
  cmd: defineAsyncComponent(() => import('./section/section-cmd/CmdComponent.vue')),
  catalogo: defineAsyncComponent(() => import('./section/section-catalogo/CatalogoComponent.vue')),
  clientes: defineAsyncComponent(() => import('./section/section-clientes/ClientesComponent.vue')),
  inventario: defineAsyncComponent(() => import('./section/section-inventario/InventarioComponent.vue')),
  cuentas: defineAsyncComponent(() => import('./section/section-account/AccountComponent.vue'))
}
</script>

<template>
  <div class="bg-white p-4 rounded shadow space-y-2">
    <template v-for="(data, key) in props.section" :key="key">
      <div v-if="data.status" class="border-b pb-2">
        <component :is="componentsMap[key]" />
      </div>
    </template>
  </div>
</template>
