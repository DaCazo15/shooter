<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCopiloto } from '../../composable/useCopiloto'

const router = useRouter()

const {
  mensajes,
  cargando,
  cargandoDiagnostico,
  error,
  insights,
  saludNegocio,
  tieneDataNegocio,
  sugerenciasRapidas,
  obtenerDiagnostico,
  enviarMensaje,
  reiniciarConversacion
} = useCopiloto()

const abierto = ref(false)
const inputTexto = ref('')
const mensajesContainer = ref(null)

const toggleChat = () => {
  abierto.value = !abierto.value
  if (abierto.value) {
    scrollToBottom()
  }
}

const irASeccion = (ruta) => {
  abierto.value = false
  router.push(ruta)
}

const handleEnviar = async () => {
  const texto = inputTexto.value.trim()
  if (!texto || cargando.value || !tieneDataNegocio.value) return
  inputTexto.value = ''
  await enviarMensaje(texto)
  scrollToBottom()
}

const usarSugerencia = async (sug) => {
  if (cargando.value || !tieneDataNegocio.value) return
  await enviarMensaje(sug)
  scrollToBottom()
}

const scrollToBottom = () => {
  nextTick(() => {
    if (mensajesContainer.value) {
      mensajesContainer.value.scrollTop = mensajesContainer.value.scrollHeight
    }
  })
}

// Auto scroll al recibir mensajes nuevos
watch(mensajes, () => {
  scrollToBottom()
}, { deep: true })

onMounted(() => {
  obtenerDiagnostico()
})

const formatearMarkdown = (texto = '') => {
  return texto
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br />')
}
</script>

<template>
  <div>
    <!-- Botón Flotante para Abrir Copiloto -->
    <div class="fixed bottom-6 right-6 z-50">
      <button
        @click="toggleChat"
        type="button"
        class="group relative flex items-center gap-2.5 px-4 py-3 bg-[#1F1824] hover:bg-[#2D2334] text-[#FAF8F6] rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-[#3E3147]"
        title="Abrir Pandi Copilot IA"
      >
        <!-- Icono Avatar -->
        <div class="w-8 h-8 rounded-xl bg-linear-to-tr from-[#9E5A78] to-[#D99FB4] flex items-center justify-center text-white text-base shadow-sm group-hover:scale-110 transition">
          <i class="bi bi-stars"></i>
        </div>

        <div class="text-left hidden sm:block">
          <span class="block text-xs font-bold font-serif-title leading-tight">Pandi Copilot</span>
          <span class="block text-[10px] text-[#D99FB4] leading-tight">
            {{ tieneDataNegocio ? 'Asesor IA' : 'Configura tu tienda' }}
          </span>
        </div>

        <!-- Indicador de Notificación / Alertas Críticas -->
        <span
          v-if="tieneDataNegocio && saludNegocio && saludNegocio.criticos > 0"
          class="absolute -top-1.5 -right-1.5 flex h-4 w-4"
        >
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[9px] font-bold text-white items-center justify-center">
            {{ saludNegocio.criticos }}
          </span>
        </span>
      </button>
    </div>

    <!-- Backdrop Oscuro en Móviles -->
    <div
      v-if="abierto"
      @click="abierto = false"
      class="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 md:hidden"
    ></div>

    <!-- Panel Lateral de Chat (Drawer / Modal) -->
    <transition name="slide-panel">
      <aside
        v-if="abierto"
        class="fixed inset-y-0 right-0 z-50 w-full sm:w-105 bg-white shadow-2xl flex flex-col border-l border-[#EADBDE] overflow-hidden"
      >
        <!-- Encabezado del Copiloto -->
        <div class="px-5 py-4 bg-[#1F1824] text-white flex items-center justify-between shrink-0 shadow-md">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-linear-to-tr from-[#9E5A78] to-[#D99FB4] flex items-center justify-center text-white text-lg shadow-sm">
              <i class="bi bi-robot"></i>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-sm font-bold font-serif-title text-[#FAF8F6]">Pandi Copilot</h3>
                <span
                  v-if="tieneDataNegocio"
                  class="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold flex items-center gap-1"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Claude 3.5
                </span>
                <span
                  v-else
                  class="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-semibold flex items-center gap-1"
                >
                  <i class="bi bi-pause-circle"></i> En espera de datos
                </span>
              </div>
              <p class="text-[11px] text-[#FAF8F6]/70">
                {{ tieneDataNegocio ? 'Diagnóstico & asesoría en vivo' : 'Requiere datos de tu negocio' }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-1">
            <button
              v-if="tieneDataNegocio"
              @click="reiniciarConversacion"
              title="Reiniciar chat"
              class="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition text-xs"
            >
              <i class="bi bi-arrow-clockwise text-sm"></i>
            </button>
            <button
              @click="abierto = false"
              title="Cerrar panel"
              class="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition text-xs"
            >
              <i class="bi bi-x-lg text-sm"></i>
            </button>
          </div>
        </div>

        <!-- Barra de Estado / Diagnóstico Rápido (Solo si hay datos) -->
        <div
          v-if="tieneDataNegocio && saludNegocio && saludNegocio.totalInsights > 0"
          class="bg-[#FAF8F6] border-b border-[#EADBDE] px-4 py-2.5 flex items-center justify-between shrink-0"
        >
          <div class="flex items-center gap-2 text-xs">
            <span class="text-[11px] font-bold text-gray-600">Salud del negocio:</span>
            <span v-if="saludNegocio.criticos > 0" class="px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-bold text-[10px]">
              {{ saludNegocio.criticos }} alertas críticas
            </span>
            <span v-if="saludNegocio.alertas > 0" class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
              {{ saludNegocio.alertas }} sugerencias
            </span>
          </div>
          <button
            @click="usarSugerencia('Analiza las alertas y dame un plan de acción para hoy')"
            class="text-[11px] font-bold text-[#9E5A78] hover:underline"
          >
            Ver plan
          </button>
        </div>

        <!-- Estado Bloqueado / No Disponible (Sin datos en Firebase) -->
        <div
          v-if="!tieneDataNegocio"
          class="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-4 bg-[#FAF8F6]/60"
        >
          <div class="w-16 h-16 rounded-3xl bg-[#F7EFE9] text-[#9E5A78] flex items-center justify-center text-3xl shadow-xs">
            <i class="bi bi-boxes"></i>
          </div>

          <div class="space-y-1.5 max-w-xs">
            <h4 class="text-sm font-bold font-serif-title text-[#1F1824]">Copiloto IA no disponible aún</h4>
            <p class="text-xs text-gray-500 leading-relaxed">
              El copiloto necesita información de tu negocio para analizar costos, márgenes y alertas de reposición.
            </p>
          </div>

          <!-- Acciones de Onboarding -->
          <div class="w-full max-w-xs space-y-2 pt-2">
            <button
              @click="irASeccion('/dashboard/catalogo')"
              class="w-full py-2.5 px-4 bg-[#9E5A78] hover:bg-[#864662] text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2"
            >
              <i class="bi bi-plus-circle"></i> Registrar primer producto
            </button>
            <button
              @click="irASeccion('/dashboard/inventario')"
              class="w-full py-2.5 px-4 bg-white hover:bg-gray-50 text-[#1F1824] border border-[#EADBDE] text-xs font-bold rounded-xl transition flex items-center justify-center gap-2"
            >
              <i class="bi bi-box-seam"></i> Registrar insumo en inventario
            </button>
          </div>

          <p class="text-[10px] text-gray-400">
            Al registrar tu primer producto o material, Pandi Copilot se habilitará automáticamente.
          </p>
        </div>

        <!-- Contenedor de Mensajes (Cuando sí hay datos) -->
        <div
          v-else
          ref="mensajesContainer"
          class="flex-1 p-4 overflow-y-auto space-y-4 bg-[#FAF8F6]/40 text-xs"
        >
          <div
            v-for="msg in mensajes"
            :key="msg.id"
            class="flex flex-col"
            :class="msg.role === 'user' ? 'items-end' : 'items-start'"
          >
            <div class="flex items-start gap-2 max-w-[85%]">
              <!-- Avatar del Asistente -->
              <div
                v-if="msg.role === 'assistant'"
                class="w-6 h-6 rounded-lg bg-[#9E5A78] text-white flex items-center justify-center text-xs shrink-0 mt-1 shadow-xs"
              >
                <i class="bi bi-stars"></i>
              </div>

              <!-- Burbuja de Mensaje -->
              <div
                class="rounded-2xl px-4 py-3 shadow-xs leading-relaxed"
                :class="msg.role === 'user'
                  ? 'bg-[#9E5A78] text-white rounded-tr-xs'
                  : 'bg-white text-[#1F1824] border border-[#EADBDE] rounded-tl-xs'"
              >
                <div v-html="formatearMarkdown(msg.content)"></div>
              </div>
            </div>
          </div>

          <!-- Indicador de "Escribiendo / Analizando" -->
          <div v-if="cargando" class="flex items-start gap-2 max-w-[85%]">
            <div class="w-6 h-6 rounded-lg bg-[#9E5A78] text-white flex items-center justify-center text-xs shrink-0 mt-1">
              <i class="bi bi-stars"></i>
            </div>
            <div class="bg-white text-[#1F1824] border border-[#EADBDE] rounded-2xl rounded-tl-xs px-4 py-3 shadow-xs flex items-center gap-2">
              <span class="text-[11px] text-gray-500 font-medium">Pandi está analizando tus datos</span>
              <span class="inline-flex gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-[#9E5A78] animate-bounce"></span>
                <span class="w-1.5 h-1.5 rounded-full bg-[#9E5A78] animate-bounce [animation-delay:0.2s]"></span>
                <span class="w-1.5 h-1.5 rounded-full bg-[#9E5A78] animate-bounce [animation-delay:0.4s]"></span>
              </span>
            </div>
          </div>

          <!-- Banner de Error si falla la API -->
          <div v-if="error" class="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 flex items-center justify-between text-xs">
            <span class="flex items-center gap-1.5">
              <i class="bi bi-exclamation-octagon-fill text-red-500"></i>
              <span>Hubo un problema de conexión con la IA.</span>
            </span>
            <button
              @click="handleEnviar"
              class="px-2.5 py-1 bg-red-600 text-white rounded-lg font-bold text-[11px] hover:bg-red-700 transition"
            >
              Reintentar
            </button>
          </div>
        </div>

        <!-- Sugerencias Rápidas (Solo si hay datos) -->
        <div v-if="tieneDataNegocio" class="px-4 py-2 bg-white border-t border-[#FAF8F6] shrink-0">
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Consultas sugeridas</p>
          <div class="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <button
              v-for="sug in sugerenciasRapidas"
              :key="sug"
              @click="usarSugerencia(sug)"
              :disabled="cargando"
              class="px-2.5 py-1 bg-[#FAF8F6] hover:bg-[#F7EFE9] text-[#9E5A78] border border-[#EADBDE] rounded-lg text-[11px] font-medium whitespace-nowrap transition shrink-0 disabled:opacity-50"
            >
              {{ sug }}
            </button>
          </div>
        </div>

        <!-- Input de Texto y Botón Enviar -->
        <div class="p-4 bg-white border-t border-[#EADBDE] shrink-0">
          <form @submit.prevent="handleEnviar" class="flex items-center gap-2">
            <div class="relative flex-1">
              <input
                v-model="inputTexto"
                type="text"
                :placeholder="tieneDataNegocio ? 'Pregúntale a Pandi (ej: ¿cuánto stock de resina queda?)...' : 'Registra productos o insumos para habilitar el chat...'"
                :disabled="cargando || !tieneDataNegocio"
                class="w-full pl-3.5 pr-10 py-2.5 text-xs bg-[#FAF8F6] border border-[#EADBDE] rounded-xl focus:ring-2 focus:ring-[#9E5A78] focus:outline-none disabled:opacity-50 placeholder-gray-400"
              />
              <button
                type="submit"
                :disabled="!inputTexto.trim() || cargando || !tieneDataNegocio"
                class="absolute right-1.5 top-1.5 p-1.5 bg-[#9E5A78] hover:bg-[#864662] text-white rounded-lg transition disabled:opacity-30 flex items-center justify-center shadow-xs"
              >
                <i class="bi bi-arrow-up text-xs font-bold"></i>
              </button>
            </div>
          </form>
          <p class="text-[10px] text-gray-400 text-center mt-2">
            {{ tieneDataNegocio ? 'Pandi Copilot utiliza datos en vivo de tu catálogo, inventario y cuentas.' : 'Bloqueado temporalmente: agrega datos en el catálogo o inventario.' }}
          </p>
        </div>
      </aside>
    </transition>
  </div>
</template>

<style scoped>
.slide-panel-enter-active,
.slide-panel-leave-active {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
}

.slide-panel-enter-from,
.slide-panel-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
