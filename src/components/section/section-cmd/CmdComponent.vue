<script setup>
import { onMounted, ref } from 'vue'
import { useCmdStore } from '../../../stores/cmdStore'
import { useAuthStore } from '../../../stores/authStore'
import CmdWebSections from './CmdWebSections.vue'
import CmdFooterSettings from './CmdFooterSettings.vue'
import CmdLinktreeSettings from './CmdLinktreeSettings.vue'

const cmdStore = useCmdStore()
const authStore = useAuthStore()

const pestanaActiva = ref('editor') // 'editor' | 'footer' | 'linktree'
const guardadoExitoso = ref(false)

onMounted(() => {
  cmdStore.cargarDeFirestore(authStore.user.uid)
})

const handleGuardar = async () => {
  const ok = await cmdStore.guardarEnFirestore(authStore.user.uid)
  if (ok) {
    guardadoExitoso.value = true
    setTimeout(() => {
      guardadoExitoso.value = false
    }, 3500)
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-[#EADBDE] shadow-xs">
      <div>
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-0.5 rounded-md bg-[#F7EFE9] text-[#9E5A78] text-[11px] font-bold uppercase tracking-wider">
            CMD Builder & CMS
          </span>
          <span class="text-xs text-gray-400">|</span>
          <span class="text-xs text-emerald-700 font-semibold flex items-center gap-1">
            <i class="bi bi-broadcast"></i> En vivo
          </span>
        </div>
        <h1 class="text-2xl font-bold font-serif-title text-[#1F1824] mt-1">Constructor de Sitio Web & Linktree</h1>
        <p class="text-xs text-gray-500">Personaliza los textos, imágenes, enlaces y secciones de tu vitrina pública y de tu perfil Linktree</p>
      </div>

      <div class="flex items-center gap-3">
        <router-link
          :to="{ name: 'public-web', params: { subdominio: cmdStore.subdominio || 'pandibuy' } }"
          target="_blank"
          class="px-4 py-2 bg-[#F7EFE9] hover:bg-[#EADBDE] text-[#9E5A78] font-bold text-xs rounded-xl transition flex items-center gap-1.5"
        >
          <i class="bi bi-box-arrow-up-right"></i> Ver Web en Vivo
        </router-link>

        <button
          @click="handleGuardar"
          :disabled="cmdStore.guardando"
          class="px-6 py-2 bg-[#9E5A78] hover:bg-[#864662] text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
        >
          <i v-if="cmdStore.guardando" class="bi bi-arrow-repeat animate-spin"></i>
          <i v-else class="bi bi-cloud-arrow-up-fill"></i>
          <span>{{ cmdStore.guardando ? 'Guardando...' : 'Publicar Cambios' }}</span>
        </button>
      </div>
    </div>

    <div v-if="guardadoExitoso" class="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2">
      <i class="bi bi-check-circle-fill text-emerald-600"></i>
      ¡Configuración publicada y sincronizada con éxito! Los cambios ya son visibles en tu enlace público.
    </div>

    <!-- Pestañas de Modo -->
    <div class="flex flex-wrap gap-2 border-b border-[#EADBDE] pb-2">
      <button
        @click="pestanaActiva = 'editor'"
        class="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2"
        :class="pestanaActiva === 'editor' ? 'bg-[#1F1824] text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-[#F7EFE9]'"
      >
        <i class="bi bi-layout-text-window-reverse"></i> Secciones de la Web
      </button>

      <button
        @click="pestanaActiva = 'footer'"
        class="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2"
        :class="pestanaActiva === 'footer' ? 'bg-[#1F1824] text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-[#F7EFE9]'"
      >
        <i class="bi bi-symmetry-horizontal"></i> Footer de la Web
      </button>

      <button
        @click="pestanaActiva = 'linktree'"
        class="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2"
        :class="pestanaActiva === 'linktree' ? 'bg-[#1F1824] text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-[#F7EFE9]'"
      >
        <i class="bi bi-diagram-2"></i> Perfil Linktree
      </button>
    </div>

    <!-- Ajustes Globales de Subdominio y Tienda -->
    <div class="bg-white p-5 rounded-2xl border border-[#EADBDE] shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Nombre / Título de la Tienda</label>
        <input
          v-model="cmdStore.tituloSitio"
          type="text"
          placeholder="Pandibuy Atelier"
          class="w-full px-3.5 py-2 text-xs bg-[#FAF8F6] border border-[#EADBDE] rounded-xl focus:ring-2 focus:ring-[#9E5A78] focus:outline-none font-semibold"
        />
      </div>

      <div>
        <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Subdominio / Slug de la Tienda</label>
        <div class="flex items-center">
          <span class="px-3 py-2 bg-gray-100 border border-r-0 border-[#EADBDE] text-gray-500 text-xs rounded-l-xl">
            pandibuy.com/web/
          </span>
          <input
            v-model="cmdStore.subdominio"
            type="text"
            placeholder="mitienda"
            class="w-full px-3 py-2 text-xs bg-[#FAF8F6] border border-[#EADBDE] rounded-r-xl focus:ring-2 focus:ring-[#9E5A78] focus:outline-none font-bold text-[#9E5A78]"
          />
        </div>
      </div>
    </div>

    <!-- 1. PESTAÑA: SECCIONES DE LA WEB -->
    <CmdWebSections v-if="pestanaActiva === 'editor'" />

    <!-- 2. PESTAÑA: FOOTER DE LA WEB -->
    <CmdFooterSettings v-if="pestanaActiva === 'footer'" />

    <!-- 3. PESTAÑA: LINKTREE -->
    <CmdLinktreeSettings v-if="pestanaActiva === 'linktree'" />
  </div>
</template>
