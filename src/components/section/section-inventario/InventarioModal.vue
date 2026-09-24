<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  mostrar: Boolean,
  proveedor: Object,
  cargando: Boolean
})

const emit = defineEmits(['cerrar', 'guardar'])

const form = ref({
  nombre: '',
  apellido: '',
  telefono: '',
  correo: '',
  mercancia: ''
})

watch(() => props.proveedor, (prov) => {
  if (prov) {
    form.value = {
      nombre: prov.nombre || '',
      apellido: prov.apellido || '',
      telefono: prov.telefono || '',
      correo: prov.correo || '',
      mercancia: prov.mercancia || ''
    }
  } else {
    form.value = { nombre: '', apellido: '', telefono: '', correo: '', mercancia: '' }
  }
}, { immediate: true })

const handleSubmit = () => {
  if (!form.value.nombre || !form.value.telefono) return
  emit('guardar', { ...form.value })
}
</script>

<template>
  <div
    v-if="mostrar"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
    @click.self="emit('cerrar')"
  >
    <div class="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
      <!-- Encabezado -->
      <div class="flex justify-between items-center px-6 py-4 bg-[#1F1824]">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-[#9E5A78] flex items-center justify-center text-white text-sm">
            <i class="bi bi-truck"></i>
          </div>
          <h3 class="text-sm font-bold text-[#FAF8F6]">
            {{ proveedor ? 'Editar Proveedor' : 'Nuevo Proveedor' }}
          </h3>
        </div>
        <button @click="emit('cerrar')" class="text-gray-400 hover:text-white transition">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <!-- Formulario -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Nombre *</label>
            <input
              v-model="form.nombre"
              type="text"
              placeholder="Carlos"
              required
              class="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F6] border border-[#EADBDE] rounded-xl focus:ring-2 focus:ring-[#9E5A78] focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Apellido</label>
            <input
              v-model="form.apellido"
              type="text"
              placeholder="Pérez"
              class="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F6] border border-[#EADBDE] rounded-xl focus:ring-2 focus:ring-[#9E5A78] focus:outline-none"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Teléfono *</label>
            <input
              v-model="form.telefono"
              type="text"
              placeholder="+584120000000"
              required
              class="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F6] border border-[#EADBDE] rounded-xl focus:ring-2 focus:ring-[#9E5A78] focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Correo</label>
            <input
              v-model="form.correo"
              type="email"
              placeholder="proveedor@correo.com"
              class="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F6] border border-[#EADBDE] rounded-xl focus:ring-2 focus:ring-[#9E5A78] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Mercancía / Productos que suministra</label>
          <textarea
            v-model="form.mercancia"
            placeholder="Silicón, Herramientas, Empaques"
            rows="3"
            class="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F6] border border-[#EADBDE] rounded-xl focus:ring-2 focus:ring-[#9E5A78] focus:outline-none resize-none"
          ></textarea>
        </div>

        <!-- Botones -->
        <div class="flex justify-end gap-3 pt-2">
          <button
            type="button"
            @click="emit('cerrar')"
            class="px-4 py-2.5 bg-gray-100 text-gray-600 text-xs font-bold rounded-xl hover:bg-gray-200 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="cargando"
            class="px-5 py-2.5 bg-[#9E5A78] hover:bg-[#864662] text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-2 disabled:opacity-50"
          >
            <i v-if="cargando" class="bi bi-arrow-repeat animate-spin"></i>
            <i v-else class="bi bi-check-lg"></i>
            <span>{{ cargando ? 'Guardando...' : 'Guardar' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
