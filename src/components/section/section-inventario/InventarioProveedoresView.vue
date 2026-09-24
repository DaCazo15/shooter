<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  proveedores: {
    type: Array,
    default: () => []
  },
  cargando: Boolean,
  generarLinkWhatsApp: {
    type: Function,
    required: true
  }
})

const emit = defineEmits(['crear', 'editar', 'eliminar'])

const busqueda = ref('')

const proveedoresFiltrados = computed(() => {
  if (!busqueda.value.trim()) return props.proveedores
  const q = busqueda.value.toLowerCase()
  return props.proveedores.filter(p =>
    (p.nombre && p.nombre.toLowerCase().includes(q)) ||
    (p.apellido && p.apellido.toLowerCase().includes(q)) ||
    (p.telefono && p.telefono.includes(q)) ||
    (p.correo && p.correo.toLowerCase().includes(q)) ||
    (p.mercancia && p.mercancia.toLowerCase().includes(q))
  )
})
</script>

<template>
  <div class="space-y-5">
    <!-- Barra de Búsqueda y Acción -->
    <div class="bg-white p-4 rounded-2xl border border-[#EADBDE] shadow-xs flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
      <div class="relative flex-1 max-w-md">
        <i class="bi bi-search absolute left-3.5 top-2.5 text-gray-400 text-xs"></i>
        <input
          v-model="busqueda"
          type="text"
          placeholder="Buscar proveedor por nombre, teléfono, mercancía..."
          class="w-full pl-9 pr-3.5 py-2 text-xs bg-[#FAF8F6] border border-[#EADBDE] rounded-xl focus:ring-2 focus:ring-[#9E5A78] focus:outline-none"
        />
      </div>

      <button
        @click="emit('crear')"
        class="px-4 py-2 bg-[#9E5A78] hover:bg-[#864662] text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 shrink-0 self-end sm:self-auto"
      >
        <i class="bi bi-plus-lg"></i> Registrar Proveedor
      </button>
    </div>

    <!-- Estado Cargando -->
    <div v-if="cargando && !proveedores.length" class="text-center py-12">
      <i class="bi bi-arrow-repeat animate-spin text-2xl text-[#9E5A78]"></i>
      <p class="text-xs text-gray-500 mt-2">Cargando proveedores...</p>
    </div>

    <!-- Estado Vacío -->
    <div v-else-if="!proveedoresFiltrados.length" class="text-center py-16 bg-white rounded-2xl border border-dashed border-[#EADBDE] space-y-3">
      <div class="w-14 h-14 mx-auto rounded-2xl bg-[#F7EFE9] text-[#9E5A78] flex items-center justify-center text-2xl">
        <i class="bi bi-truck"></i>
      </div>
      <h3 class="font-bold text-sm text-[#1F1824]">
        {{ busqueda ? 'No se encontraron proveedores' : 'Sin proveedores registrados' }}
      </h3>
      <p class="text-xs text-gray-500 max-w-sm mx-auto">
        {{ busqueda ? 'Prueba con otro término de búsqueda.' : 'Registra a tus proveedores para tener un control organizado de tus contactos de compra.' }}
      </p>
      <button
        v-if="!busqueda"
        @click="emit('crear')"
        class="mt-2 px-5 py-2 bg-[#9E5A78] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#864662] transition inline-flex items-center gap-1.5"
      >
        <i class="bi bi-plus-circle"></i> Agregar el primero
      </button>
    </div>

    <!-- Grilla de Proveedores -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="prov in proveedoresFiltrados"
        :key="prov.id"
        class="bg-white rounded-2xl border border-[#EADBDE] shadow-xs p-5 hover:shadow-md transition flex flex-col justify-between"
      >
        <div>
          <div class="flex justify-between items-start mb-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-[#F7EFE9] text-[#9E5A78] flex items-center justify-center text-lg font-bold">
                {{ (prov.nombre || '?')[0].toUpperCase() }}
              </div>
              <div>
                <h3 class="text-sm font-bold text-[#1F1824]">{{ prov.nombre }} {{ prov.apellido }}</h3>
                <p class="text-[11px] text-gray-400">{{ prov.correo || 'Sin correo' }}</p>
              </div>
            </div>
            <a
              :href="generarLinkWhatsApp(prov.telefono, prov.nombre)"
              target="_blank"
              rel="noopener noreferrer"
              class="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-bold rounded-full flex items-center gap-1.5 transition shadow-sm"
            >
              <i class="bi bi-whatsapp"></i> Chat
            </a>
          </div>

          <div class="grid grid-cols-2 gap-3 mt-3">
            <div class="bg-[#FAF8F6] rounded-xl p-3">
              <span class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Teléfono</span>
              <p class="text-xs text-[#1F1824] font-medium mt-0.5">{{ prov.telefono }}</p>
            </div>
            <div class="bg-[#FAF8F6] rounded-xl p-3">
              <span class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Mercancía</span>
              <p class="text-xs text-[#1F1824] font-medium mt-0.5 line-clamp-2">{{ prov.mercancia || 'No especificada' }}</p>
            </div>
          </div>
        </div>

        <!-- Acciones -->
        <div class="flex justify-end gap-2 mt-4 pt-3 border-t border-[#FAF8F6]">
          <button
            type="button"
            @click="emit('editar', prov)"
            class="px-3 py-1.5 text-[#9E5A78] hover:bg-[#F7EFE9] text-xs font-bold rounded-lg transition flex items-center gap-1"
          >
            <i class="bi bi-pencil"></i> Editar
          </button>
          <button
            type="button"
            @click="emit('eliminar', prov.id)"
            class="px-3 py-1.5 text-red-500 hover:bg-red-50 text-xs font-bold rounded-lg transition flex items-center gap-1"
          >
            <i class="bi bi-trash"></i> Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
