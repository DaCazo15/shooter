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
  saludNegocio,
  tieneDataNegocio,
  obtenerDiagnostico,
  enviarMensaje,
  reiniciarConversacion
} = useCopiloto()

const abierto = ref(false)
const inputTexto = ref('')
const mensajesContainer = ref(null)
const mensajeCopiadoId = ref(null)

const toggleChat = () => {
  abierto.value = !abierto.value
  if (abierto.value) {
    scrollToBottom()
  }
}

const handleEnviar = async () => {
  const texto = inputTexto.value.trim()
  if (!texto || cargando.value) return
  inputTexto.value = ''
  await enviarMensaje(texto)
  scrollToBottom()
}

const copiarTexto = async (id, texto) => {
  try {
    const limpio = texto.replace(/\*\*/g, '').replace(/---/g, '').trim()
    await navigator.clipboard.writeText(limpio)
    mensajeCopiadoId.value = id
    setTimeout(() => {
      mensajeCopiadoId.value = null
    }, 2000)
  } catch (e) {
    console.warn('Error copiando al portapapeles:', e)
  }
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
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-[#1F1824]">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic text-gray-600">$1</em>')
    .replace(/---/g, '<hr class="my-3 border-[#EADBDE]" />')
    .replace(/\n/g, '<br />')
}
</script>

<template>
  <div>
    <!-- Botón Flotante Estilo Gemini / Claude -->
    <div class="fixed bottom-6 right-6 z-50">
      <button
        @click="toggleChat"
        type="button"
        class="group relative flex items-center gap-3 px-4 py-3 bg-[#1F1824] hover:bg-[#2A2131] text-[#FAF8F6] rounded-full shadow-2xl hover:shadow-[#9E5A78]/20 transition-all duration-300 transform hover:scale-[1.03] border border-[#3E3147]/80"
        title="Abrir Pandi Copilot IA"
      >
        <!-- Icono / Logo Pandi Copilot -->
        <div class="w-8 h-8 rounded-full bg-[#FAF8F6] p-0.5 flex items-center justify-center shadow-md group-hover:rotate-12 transition duration-300 shrink-0">
          <img src="/logo.png" alt="Pandi Logo" class="w-full h-full object-contain" />
        </div>

        <div class="text-left pr-1 hidden sm:block">
          <div class="flex items-center gap-1.5">
            <span class="text-xs font-bold font-serif-title tracking-wide text-[#FAF8F6]">Pandi Copilot</span>
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          </div>
          <span class="block text-[10px] text-[#D99FB4] font-medium tracking-tight">
            TensorFlow IA
          </span>
        </div>
      </button>
    </div>

    <!-- Backdrop Oscuro en Móviles -->
    <div
      v-if="abierto"
      @click="abierto = false"
      class="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 md:hidden"
    ></div>

    <!-- Panel Lateral de Chat Estilo Claude / Gemini -->
    <transition name="claude-slide">
      <aside
        v-if="abierto"
        class="fixed inset-y-0 right-0 z-50 w-full sm:max-w-lg sm:w-120 bg-[#FAF8F6] shadow-2xl flex flex-col border-l border-[#EADBDE] overflow-hidden"
      >
        <!-- Encabezado Minimalista Estilo Claude -->
        <div class="px-5 py-3.5 bg-white/90 backdrop-blur-md border-b border-[#EADBDE] flex items-center justify-between shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-[#FAF8F6] border border-[#EADBDE] p-1 flex items-center justify-center shadow-xs">
              <img src="/logo.png" alt="Pandi Logo" class="w-full h-full object-contain" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-sm font-bold font-serif-title text-[#1F1824]">Pandi Copilot</h3>
              </div>
              <p class="text-[11px] text-gray-500">El asesor de tu marca</p>
            </div>
          </div>

          <!-- Acciones de Cabecera -->
          <div class="flex items-center gap-1">
            <button
              @click="reiniciarConversacion"
              title="Nueva conversación"
              class="p-2 text-gray-500 hover:text-[#9E5A78] hover:bg-[#F7EFE9] rounded-xl transition text-xs flex items-center gap-1 font-semibold"
            >
              <i class="bi bi-pencil-square text-sm"></i>
              <span class="hidden sm:inline text-[11px]">Nuevo</span>
            </button>
            <button
              @click="abierto = false"
              title="Cerrar panel"
              class="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition text-sm"
            >
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
        </div>

        <!-- Contenedor de Mensajes (Flujo Limpio Estilo Gemini/Claude) -->
        <div
          ref="mensajesContainer"
          class="flex-1 p-5 overflow-y-auto space-y-6 text-xs text-[#1F1824]"
        >
          <!-- Mensaje cuando no hay conversación iniciada -->
          <div v-if="mensajes.length === 0" class="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
            <div class="w-12 h-12 rounded-2xl bg-[#F7EFE9] text-[#9E5A78] flex items-center justify-center text-2xl shadow-xs border border-[#EADBDE]">
              <i class="bi bi-stars"></i>
            </div>
            <div class="space-y-1 max-w-xs">
              <h4 class="text-sm font-bold font-serif-title text-[#1F1824]">¿En qué te puedo asesorar?</h4>
              <p class="text-xs text-gray-500 leading-relaxed">
                Escribe tu consulta sobre precios, inventario, ventas o tiempos de taller.
              </p>
            </div>
          </div>

          <!-- Lista de Mensajes -->
          <div
            v-for="msg in mensajes"
            :key="msg.id"
            class="space-y-1"
          >
            <!-- 1. Mensaje del Usuario (Burbuja pulida a la derecha) -->
            <div v-if="msg.role === 'user'" class="flex justify-end">
              <div class="max-w-[85%] bg-[#1F1824] text-[#FAF8F6] px-4 py-3 rounded-2xl rounded-tr-xs shadow-xs text-xs font-medium leading-relaxed">
                {{ msg.content }}
              </div>
            </div>

            <!-- 2. Mensaje del Asistente (Flujo limpio a la izquierda estilo Claude/Gemini) -->
            <div v-else class="flex items-start gap-3 max-w-[95%]">
              <div class="w-7 h-7 rounded-lg bg-[#FAF8F6] border border-[#EADBDE] p-0.5 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                <img src="/logo.png" alt="Pandi" class="w-full h-full object-contain" />
              </div>

              <div class="space-y-2 flex-1">
                <div class="bg-white p-4 rounded-2xl border border-[#EADBDE] shadow-xs text-xs text-[#1F1824] leading-relaxed">
                  <div v-html="formatearMarkdown(msg.content)"></div>
                </div>

                <!-- Botones de Utilidad al pie de la respuesta -->
                <div class="flex items-center gap-2 text-[11px] text-gray-400 pl-1">
                  <button
                    @click="copiarTexto(msg.id, msg.content)"
                    class="hover:text-[#9E5A78] transition flex items-center gap-1 font-semibold"
                    title="Copiar respuesta"
                  >
                    <i :class="mensajeCopiadoId === msg.id ? 'bi bi-check2 text-emerald-600' : 'bi bi-clipboard'"></i>
                    <span>{{ mensajeCopiadoId === msg.id ? '¡Copiado!' : 'Copiar' }}</span>
                  </button>
                  <span>•</span>
                  <span class="text-gray-400 flex items-center gap-1">
                    <i class="bi bi-shield-check text-[#9E5A78]"></i> Segunda opinión sugerida
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Indicador de Respuesta en Progreso -->
          <div v-if="cargando" class="flex items-start gap-3 max-w-[85%]">
            <div class="w-7 h-7 rounded-lg bg-[#FAF8F6] border border-[#EADBDE] text-[#9E5A78] flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-xs">
              <i class="bi bi-stars animate-spin text-sm"></i>
            </div>
            <div class="bg-white border border-[#EADBDE] rounded-2xl px-4 py-3 shadow-xs flex items-center gap-2">
              <span class="text-xs text-gray-500 font-medium">Pandi Copilot analizando con TensorFlow</span>
              <span class="inline-flex gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-[#9E5A78] animate-bounce"></span>
                <span class="w-1.5 h-1.5 rounded-full bg-[#9E5A78] animate-bounce [animation-delay:0.2s]"></span>
                <span class="w-1.5 h-1.5 rounded-full bg-[#9E5A78] animate-bounce [animation-delay:0.4s]"></span>
              </span>
            </div>
          </div>
        </div>

        <!-- Barra de Entrada Flotante Estilo Gemini / Claude -->
        <div class="p-4 bg-white border-t border-[#EADBDE] shrink-0">
          <form @submit.prevent="handleEnviar" class="relative">
            <div class="bg-[#FAF8F6] border border-[#EADBDE] rounded-2xl focus-within:ring-2 focus-within:ring-[#9E5A78] focus-within:border-transparent transition-all shadow-xs flex items-center p-1.5 pr-2">
              <input
                v-model="inputTexto"
                type="text"
                placeholder="Hazle una consulta a Pandi Copilot..."
                :disabled="cargando"
                class="w-full px-3 py-2 text-xs bg-transparent focus:outline-none placeholder-gray-400 font-medium"
              />
              <button
                type="submit"
                :disabled="!inputTexto.trim() || cargando"
                class="w-8 h-8 rounded-xl bg-[#9E5A78] hover:bg-[#864662] text-white transition disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center shadow-xs shrink-0"
                title="Enviar mensaje"
              >
                <i class="bi bi-arrow-up text-sm font-bold"></i>
              </button>
            </div>
          </form>

          <p class="text-[10px] text-gray-400 text-center mt-2">
            Considera siempre una segunda opinión.
          </p>
        </div>
      </aside>
    </transition>
  </div>
</template>

<style scoped>
.claude-slide-enter-active,
.claude-slide-leave-active {
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
}

.claude-slide-enter-from,
.claude-slide-leave-to {
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

