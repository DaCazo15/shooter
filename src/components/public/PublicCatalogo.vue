<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useCatalogo } from '../../composable/useCatalogo'
import { useWhatsApp } from '../../composable/useWhatsApp'
import gsap from 'gsap'

defineProps({
  bloque: {
    type: Object,
    default: null
  }
})

const { catalogo, iniciarEscuchaCatalogo, detenerEscucha } = useCatalogo()
const { contactarWhatsApp } = useWhatsApp()

const busqueda = ref('')
const categoriaSeleccionada = ref('Todos')

const listaProductos = computed(() => {
  const lista = catalogo.value || []
  return lista.filter(p => {
    const matchCat = categoriaSeleccionada.value === 'Todos' || p.categoria === categoriaSeleccionada.value
    const matchBusqueda = (p.titulo || '').toLowerCase().includes(busqueda.value.toLowerCase())
    return matchCat && matchBusqueda
  })
})

const categorias = computed(() => {
  const lista = catalogo.value || []
  const set = new Set(lista.map(p => p.categoria).filter(Boolean))
  return ['Todos', ...Array.from(set)]
})

onMounted(() => {
  iniciarEscuchaCatalogo()
  nextTick(() => {
    gsap.from('.gsap-card', {
      duration: 0.7,
      y: 30,
      opacity: 0,
      stagger: 0.12,
      delay: 0.3,
      ease: 'power2.out'
    })
  })
})

defineExpose({ detenerEscucha })
</script>

<template>
  <section v-if="bloque && bloque.activo" id="catalogo" class="max-w-6xl mx-auto px-4 sm:px-6 py-16 w-full">
    <div class="text-center max-w-2xl mx-auto mb-10 space-y-2">
      <h2 class="text-2xl sm:text-3xl font-serif-title font-bold text-[#1F1824]">
        {{ bloque.contenido.titulo || 'Catálogo de Productos' }}
      </h2>
      <p class="text-xs text-gray-500">Selecciona el producto que deseas y contáctanos directamente por WhatsApp para concretar tu pedido.</p>
    </div>

    <!-- Barra de Búsqueda y Filtros -->
    <div class="mb-8 space-y-4">
      <div v-if="bloque.contenido.mostrarBuscador" class="max-w-md mx-auto relative">
        <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
          <i class="bi bi-search"></i>
        </span>
        <input
          v-model="busqueda"
          type="text"
          placeholder="Buscar por nombre de producto..."
          class="w-full pl-10 pr-4 py-2.5 bg-white border border-[#EADBDE] rounded-full text-xs text-[#1F1824] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9E5A78]"
        />
      </div>

      <div v-if="bloque.contenido.mostrarFiltros && categorias.length > 1" class="flex flex-wrap justify-center gap-2">
        <button
          v-for="cat in categorias"
          :key="cat"
          @click="categoriaSeleccionada = cat"
          class="px-4 py-1.5 rounded-full text-xs font-semibold transition"
          :class="categoriaSeleccionada === cat ? 'bg-[#9E5A78] text-white shadow-sm' : 'bg-white text-gray-600 border border-[#EADBDE] hover:bg-[#F7EFE9]'"
        >
          {{ cat }}
        </button>
      </div>
    </div>

    <!-- Estado Vacío -->
    <div v-if="listaProductos.length === 0" class="text-center py-16 bg-white rounded-3xl border border-dashed border-[#EADBDE] p-8 space-y-3">
      <div class="w-14 h-14 mx-auto rounded-2xl bg-[#F7EFE9] text-[#9E5A78] flex items-center justify-center text-2xl">
        <i class="bi bi-bag"></i>
      </div>
      <h3 class="font-bold text-sm text-[#1F1824]">Próximamente nuevas creaciones</h3>
      <p class="text-xs text-gray-500 max-w-sm mx-auto">
        Estamos preparando piezas exclusivas para nuestro catálogo. Puedes consultarnos vía WhatsApp para pedidos bajo encargo.
      </p>
      <button
        @click="contactarWhatsApp()"
        class="mt-2 px-5 py-2 bg-[#9E5A78] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#864662] transition inline-flex items-center gap-1.5"
      >
        <i class="bi bi-whatsapp"></i>
        <span>Consultar por WhatsApp</span>
      </button>
    </div>

    <!-- Grilla de Productos -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="prod in listaProductos"
        :key="prod.id"
        class="gsap-card bg-white rounded-2xl border border-[#EADBDE] shadow-xs overflow-hidden hover:shadow-md transition duration-200 flex flex-col group"
      >
        <div class="h-48 overflow-hidden relative bg-gray-100">
          <img
            v-if="prod.imagen"
            :src="prod.imagen"
            :alt="prod.titulo"
            class="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
          <div v-else class="w-full h-full bg-[#FAF8F6] flex flex-col items-center justify-center text-gray-400">
            <i class="bi bi-image text-3xl text-gray-300"></i>
            <span class="text-[11px] mt-1">Pandibuy Atelier</span>
          </div>
          <span class="absolute top-2.5 right-2.5 px-2.5 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-bold text-[#9E5A78] rounded-full shadow-xs">
            {{ prod.categoria || 'Colección' }}
          </span>
        </div>

        <div class="p-4 flex-1 flex flex-col justify-between">
          <div>
            <h3 class="font-bold text-sm text-[#1F1824] group-hover:text-[#9E5A78] transition">
              {{ prod.titulo }}
            </h3>
            <p class="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
              {{ prod.descripcion }}
            </p>
          </div>

          <div class="pt-4 border-t border-[#FAF8F6] mt-4 flex items-center justify-between">
            <span class="text-lg font-black text-[#1F1824]">
              ${{ Number(prod.precio || 0).toFixed(2) }}
            </span>
            <button
              @click="contactarWhatsApp(prod)"
              class="px-3.5 py-1.5 bg-[#9E5A78] hover:bg-[#864662] text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm"
            >
              <i class="bi bi-bag-plus"></i> Pedir
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
