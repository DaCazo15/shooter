<script setup>
defineProps({
  item: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    required: true
  }
})
</script>

<template>
  <div class="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 flex flex-col justify-between relative">
    <!-- Encabezado Oscuro -->
    <div class="bg-slate-900 text-white px-6 pt-6 pb-8 relative flex justify-between items-start">
      <h3 class="text-2xl font-black tracking-wide uppercase">
        {{ item.titulo || 'SIN TÍTULO' }}
      </h3>
      <div class="flex items-center space-x-2 text-gray-400">
        <button class="hover:text-white transition">
          <i class="bi bi-search"></i>
        </button>
        <button class="hover:text-white transition">
          <i class="bi bi-three-dots-vertical"></i>
        </button>
      </div>
    </div>

    <!-- Badge flotante de número -->
    <div class="absolute top-13 left-6 z-10">
      <span class="bg-yellow-400 text-slate-900 font-bold text-sm px-3 py-1 rounded-full shadow-sm">
        {{ (index + 1).toString().padStart(2, '0') }}
      </span>
    </div>

    <!-- Cuerpo Blanco -->
    <div class="p-6 pt-8 flex-1 flex flex-col justify-between space-y-4">
      <div class="flex justify-between items-center text-gray-400 text-sm">
        <div class="flex items-center space-x-2 text-indigo-600 font-semibold">
          <i class="bi bi-card-text text-lg"></i>
          <span>Info...</span>
        </div>
        <i class="bi bi-info-circle hover:text-gray-600 cursor-pointer"></i>
      </div>

      <div class="text-gray-600 text-sm space-y-1">
        <p class="line-clamp-2">
          {{ item.descripcion || 'Sin descripción disponible para este elemento del catálogo.' }}
        </p>
        <div v-if="item.precio" class="pt-2 text-base font-bold text-slate-800">
          ${{ Number(item.precio).toFixed(2) }}
        </div>
      </div>

      <div class="flex justify-center space-x-1.5 pt-2">
        <span class="w-2 h-2 rounded-full bg-slate-800"></span>
        <span class="w-2 h-2 rounded-full bg-gray-300"></span>
        <span class="w-2 h-2 rounded-full bg-gray-300"></span>
        <span class="w-2 h-2 rounded-full bg-gray-300"></span>
        <span class="w-2 h-2 rounded-full bg-gray-300"></span>
      </div>
    </div>
  </div>
</template>
