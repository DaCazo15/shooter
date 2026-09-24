<script setup>
import BotonBase from '../components/ui/BotonBase.vue'
const emit = defineEmits(['nombre'])
</script>

<template>
  <div class="grid grid-cols-2 lg:grid-cols-6 gap-2 ">
    <BotonBase title="Calculadora" color="gray" icon="bi bi-calculator" @click="emit('nombre', 'calculadora')" />
    <BotonBase title="CMD" color="gray" icon="bi bi-console" @click="emit('nombre', 'cmd')" />
    <BotonBase title="Catalogo" color="gray" icon="bi bi-list" @click="emit('nombre', 'catalogo')" />
    <BotonBase title="Clientes" color="gray" icon="bi bi-people" @click="emit('nombre', 'clientes')" />
    <BotonBase title="Inventario" color="gray" icon="bi bi-box" @click="emit('nombre', 'inventario')" />
    <BotonBase title="Cuentas" color="gray" icon="bi bi-wallet" @click="emit('nombre', 'cuentas')" />
  </div>
</template>
