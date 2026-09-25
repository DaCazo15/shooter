<script setup>
import { ref, onMounted, watch } from 'vue'
import { useAuthStore } from '../../stores/authStore'

const authStore = useAuthStore()

const formData = ref({
  displayName: authStore.user.displayName || '',
  businessName: authStore.user.businessName || '',
  bio: authStore.user.bio || '',
  email: authStore.user.email || '',
  phone: authStore.user.phone || '',
  whatsapp: authStore.user.whatsapp || '',
  instagram: authStore.user.instagram || '',
  currency: authStore.user.currency || 'USD',
  currencySymbol: authStore.user.currencySymbol || '$',
  avatarUrl: authStore.user.avatarUrl || ''
})

const guardando = ref(false)
const guardadoExitoso = ref(false)

const sincronizarDatos = () => {
  if (authStore.user) {
    formData.value = {
      displayName: authStore.user.displayName || '',
      businessName: authStore.user.businessName || '',
      bio: authStore.user.bio || '',
      email: authStore.user.email || '',
      phone: authStore.user.phone || '',
      whatsapp: authStore.user.whatsapp || '',
      instagram: authStore.user.instagram || '',
      currency: authStore.user.currency || 'USD',
      currencySymbol: authStore.user.currencySymbol || '$',
      avatarUrl: authStore.user.avatarUrl || ''
    }
  }
}

onMounted(() => {
  sincronizarDatos()
})

watch(() => authStore.user, () => {
  sincronizarDatos()
}, { deep: true })

const monedas = [
  { codigo: 'USD', simbolo: '$', nombre: 'Dólares Estadounidenses ($ USD)' },
  { codigo: 'VES', simbolo: 'Bs.', nombre: 'Bolívares (Bs. VES)' },
  { codigo: 'EUR', simbolo: '€', nombre: 'Euros (€ EUR)' },
  { codigo: 'COP', simbolo: '$', nombre: 'Pesos Colombianos ($ COP)' },
  { codigo: 'MXN', simbolo: '$', nombre: 'Pesos Mexicanos ($ MXN)' }
]

const actualizarMoneda = (e) => {
  const selected = monedas.find(m => m.codigo === e.target.value)
  if (selected) {
    formData.value.currency = selected.codigo
    formData.value.currencySymbol = selected.simbolo
  }
}

const handleGuardar = async () => {
  guardando.value = true
  try {
    await authStore.updateProfile(formData.value)
    guardadoExitoso.value = true
    setTimeout(() => {
      guardadoExitoso.value = false
    }, 3500)
  } catch (e) {
    console.error('Error guardando perfil:', e)
  } finally {
    guardando.value = false
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-[#EADBDE] shadow-xs">
      <div>
        <h1 class="text-2xl font-bold font-serif-title text-[#1F1824]">Perfil de Negocio & Usuario</h1>
        <p class="text-xs text-gray-500 mt-1">Configura los datos oficiales de tu marca, canales de contacto y preferencias monetarias</p>
      </div>
      <div v-if="guardadoExitoso" class="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-xs font-bold border border-emerald-200 flex items-center gap-2">
        <i class="bi bi-check-circle-fill"></i> ¡Datos guardados correctamente!
      </div>
    </div>

    <!-- Formulario -->
    <form @submit.prevent="handleGuardar" class="space-y-6">
      <!-- Tarjeta 1: Identidad de Marca y Avatar -->
      <div class="bg-white p-6 rounded-2xl border border-[#EADBDE] shadow-xs space-y-6">
        <div class="flex items-center gap-2 border-b border-[#FAF8F6] pb-3 text-[#9E5A78]">
          <i class="bi bi-building-gear text-lg"></i>
          <h2 class="text-base font-bold text-[#1F1824]">Identidad del Negocio</h2>
        </div>

        <div class="flex flex-col sm:flex-row items-center gap-6">
          <div class="relative group">
            <img
              :src="formData.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'"
              alt="Logo / Foto de Perfil"
              class="w-24 h-24 rounded-2xl object-cover border-2 border-[#9E5A78] shadow-md"
            />
          </div>
          <div class="flex-1 space-y-3 w-full">
            <label class="block text-xs font-bold uppercase tracking-wider text-gray-700">URL del Logo o Avatar</label>
            <input
              v-model="formData.avatarUrl"
              type="text"
              placeholder="https://ejemplo.com/mi-logo.jpg"
              class="w-full px-3.5 py-2 text-xs bg-[#FAF8F6] border border-[#EADBDE] rounded-xl focus:ring-2 focus:ring-[#9E5A78] focus:outline-none"
            />
            <p class="text-[11px] text-gray-400">Recomendamos una imagen cuadrada en alta resolución (formato JPG o PNG).</p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Nombre Comercial de la Marca</label>
            <input
              v-model="formData.businessName"
              type="text"
              required
              placeholder="Pandibuy Atelier"
              class="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F6] border border-[#EADBDE] rounded-xl focus:ring-2 focus:ring-[#9E5A78] focus:outline-none font-medium"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Nombre de la Administradora</label>
            <input
              v-model="formData.displayName"
              type="text"
              required
              placeholder="Valeria Pandi"
              class="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F6] border border-[#EADBDE] rounded-xl focus:ring-2 focus:ring-[#9E5A78] focus:outline-none font-medium"
            />
          </div>

          <div class="sm:col-span-2">
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Descripción / Eslogan del Negocio</label>
            <textarea
              v-model="formData.bio"
              rows="2"
              placeholder="Breve reseña sobre tus productos o servicios..."
              class="w-full px-3.5 py-2 text-xs bg-[#FAF8F6] border border-[#EADBDE] rounded-xl focus:ring-2 focus:ring-[#9E5A78] focus:outline-none"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Tarjeta 2: Canales de Venta & Moneda -->
      <div class="bg-white p-6 rounded-2xl border border-[#EADBDE] shadow-xs space-y-6">
        <div class="flex items-center gap-2 border-b border-[#FAF8F6] pb-3 text-[#9E5A78]">
          <i class="bi bi-currency-exchange text-lg"></i>
          <h2 class="text-base font-bold text-[#1F1824]">Canales de Contacto & Moneda Oficial</h2>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">WhatsApp para Ventas Directas</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-emerald-600 font-bold">
                <i class="bi bi-whatsapp"></i>
              </span>
              <input
                v-model="formData.whatsapp"
                type="text"
                placeholder="+584121234567"
                class="w-full pl-9 pr-3.5 py-2 text-xs bg-[#FAF8F6] border border-[#EADBDE] rounded-xl focus:ring-2 focus:ring-[#9E5A78] focus:outline-none font-medium"
              />
            </div>
            <p class="text-[10px] text-gray-400 mt-1">Se usará en los botones automáticos de compra de tu catálogo.</p>
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Teléfono de Contacto / Llamadas</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-600 font-bold">
                <i class="bi bi-telephone-fill"></i>
              </span>
              <input
                v-model="formData.phone"
                type="text"
                placeholder="+582121234567"
                class="w-full pl-9 pr-3.5 py-2 text-xs bg-[#FAF8F6] border border-[#EADBDE] rounded-xl focus:ring-2 focus:ring-[#9E5A78] focus:outline-none font-medium"
              />
            </div>
            <p class="text-[10px] text-gray-400 mt-1">Línea fija o móvil para llamadas directas de clientes.</p>
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Instagram (@usuario)</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-rose-500 font-bold">
                <i class="bi bi-instagram"></i>
              </span>
              <input
                v-model="formData.instagram"
                type="text"
                placeholder="@tu_marca"
                class="w-full pl-9 pr-3.5 py-2 text-xs bg-[#FAF8F6] border border-[#EADBDE] rounded-xl focus:ring-2 focus:ring-[#9E5A78] focus:outline-none font-medium"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Correo de Notificaciones</label>
            <input
              v-model="formData.email"
              type="email"
              placeholder="contacto@pandibuy.com"
              class="w-full px-3.5 py-2 text-xs bg-[#FAF8F6] border border-[#EADBDE] rounded-xl focus:ring-2 focus:ring-[#9E5A78] focus:outline-none font-medium"
            />
          </div>

          <div class="sm:col-span-2">
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Moneda Principal del Sistema</label>
            <select
              :value="formData.currency"
              @change="actualizarMoneda"
              class="w-full px-3.5 py-2 text-xs bg-[#FAF8F6] border border-[#EADBDE] rounded-xl focus:ring-2 focus:ring-[#9E5A78] focus:outline-none font-medium cursor-pointer"
            >
              <option v-for="m in monedas" :key="m.codigo" :value="m.codigo">
                {{ m.nombre }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Botón de Acción con Feedback Inmediato -->
      <div class="flex items-center justify-end gap-3">
        <span v-if="guardadoExitoso" class="text-xs font-bold text-emerald-600 flex items-center gap-1.5 animate-in fade-in">
          <i class="bi bi-check-circle-fill"></i> ¡Cambios guardados con éxito!
        </span>

        <button
          type="submit"
          :disabled="guardando"
          class="px-8 py-3 bg-[#9E5A78] hover:bg-[#864662] text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition flex items-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          <i v-if="guardando" class="bi bi-arrow-repeat animate-spin"></i>
          <i v-else-if="guardadoExitoso" class="bi bi-check-lg text-sm"></i>
          <i v-else class="bi bi-floppy-fill"></i>
          <span>{{ guardando ? 'Guardando...' : guardadoExitoso ? '¡Guardado!' : 'Guardar Cambios de Perfil' }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

