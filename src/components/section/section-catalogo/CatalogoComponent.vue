<script setup>
import { useCatalogo } from '../../../composable/useCatalogo.js'
import CatalogoCard from './CatalogoCard.vue'

const { catalogo } = useCatalogo()
</script>

<template>
  <div class="p-6">
    <div v-if="!catalogo" class="text-center py-12 text-gray-500 font-medium">
      Cargando catálogo...
    </div>

    <div v-else-if="catalogo.length === 0" class="text-center py-12 text-gray-500 font-medium">
      No hay elementos registrados en el catálogo.
    </div>

    <div v-else class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <CatalogoCard
        v-for="(item, index) in catalogo"
        :key="item.id"
        :item="item"
        :index="index"
      />
    </div>
  </div>
</template>
