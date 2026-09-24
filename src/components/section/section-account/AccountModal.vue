<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  mostrar: Boolean,
  cuentaEditar: Object,
  monedas: Array,
  cargando: Boolean
})

const emit = defineEmits(['cerrar', 'guardar'])

const form = ref({
  nombre: '',
  moneda: 'USD',
  saldoInicial: 0
})

watch(() => props.cuentaEditar, (cuenta) => {
  if (cuenta) {
    form.value = {
      id: cuenta.id,
      nombre: cuenta.nombre,
      moneda: cuenta.moneda,
      saldoInicial: cuenta.saldoInicial || 0
    }
  } else {
    form.value = { nombre: '', moneda: 'USD', saldoInicial: 0 }
  }
}, { immediate: true })

const handleSubmit = () => {
  if (!form.value.nombre) return
  emit('guardar', { ...form.value, id: props.cuentaEditar?.id })
}
</script>

<template>
  <div
    v-if="mostrar"
    class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    @click.self="emit('cerrar')"
  >
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
      <!-- Encabezado -->
      <div class="flex justify-between items-center px-6 py-4 bg-[#1F1824]">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-[#9E5A78] flex items-center justify-center text-white text-sm">
            <i class="bi bi-wallet2"></i>
          </div>
          <h3 class="text-sm font-bold text-[#FAF8F6]">
            {{ cuentaEditar ? 'Editar Cuenta' : 'Nueva Cuenta' }}
          </h3>
        </div>
        <button @click="emit('cerrar')" class="text-gray-400 hover:text-white transition">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <!-- Formulario -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <div>
          <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Nombre de la cuenta *</label>
          <input
            v-model="form.nombre"
            type="text"
            placeholder="Ej. Banesco, PayPal, Efectivo"
            required
            class="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F6] border border-[#EADBDE] rounded-xl focus:ring-2 focus:ring-[#9E5A78] focus:outline-none"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Moneda</label>
          <select
            v-model="form.moneda"
            class="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F6] border border-[#EADBDE] rounded-xl focus:ring-2 focus:ring-[#9E5A78] focus:outline-none appearance-none"
          >
            <option v-for="m in monedas" :key="m.value" :value="m.value">
              {{ m.label }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Saldo inicial</label>
          <input
            v-model.number="form.saldoInicial"
            type="number"
            step="0.01"
            placeholder="0.00"
            class="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F6] border border-[#EADBDE] rounded-xl focus:ring-2 focus:ring-[#9E5A78] focus:outline-none"
          />
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
            <span>{{ cargando ? 'Guardando...' : 'Guardar Cuenta' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
