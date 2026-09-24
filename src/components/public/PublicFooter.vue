<script setup>
import { useCmdStore } from '../../stores/cmdStore'

const cmdStore = useCmdStore()

const emit = defineEmits(['abrir-legal'])
</script>

<template>
  <footer class="bg-[#1F1824] text-white/80 pt-12 pb-8 border-t border-[#2D2334] text-xs">
    <div class="max-w-6xl mx-auto px-4 sm:px-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-[#2D2334]">
        <!-- Col 1: Bio / Marca -->
        <div class="space-y-3">
          <h3 class="font-serif-title text-base font-bold text-[#FAF8F6]">
            {{ cmdStore.footerConfig.nombreMarca || cmdStore.tituloSitio }}
          </h3>
          <p class="text-xs text-gray-400 leading-relaxed max-w-sm">
            {{ cmdStore.footerConfig.descripcion }}
          </p>
          <div v-if="cmdStore.footerConfig.mostrarRedes" class="flex items-center gap-3 pt-2">
            <a
              v-if="cmdStore.footerConfig.instagram"
              :href="cmdStore.footerConfig.instagram"
              target="_blank"
              class="w-8 h-8 rounded-full bg-[#2D2334] hover:bg-[#9E5A78] text-white flex items-center justify-center transition"
              title="Instagram"
            >
              <i class="bi bi-instagram"></i>
            </a>
            <a
              v-if="cmdStore.footerConfig.whatsapp"
              :href="cmdStore.footerConfig.whatsapp"
              target="_blank"
              class="w-8 h-8 rounded-full bg-[#2D2334] hover:bg-emerald-600 text-white flex items-center justify-center transition"
              title="WhatsApp"
            >
              <i class="bi bi-whatsapp"></i>
            </a>
          </div>
        </div>

        <!-- Col 2: Horarios y Contacto -->
        <div class="space-y-2">
          <h4 class="font-bold text-xs uppercase tracking-wider text-[#D99FB4]">Atención y Contacto</h4>
          <p class="text-xs text-gray-300">
            <i class="bi bi-clock mr-1 text-[#9E5A78]"></i> {{ cmdStore.footerConfig.horario || 'Lunes a Sábado: 9:00 AM - 6:00 PM' }}
          </p>
          <p class="text-xs text-gray-300">
            <i class="bi bi-envelope mr-1 text-[#9E5A78]"></i> {{ cmdStore.footerConfig.email || 'contacto@pandibuy.com' }}
          </p>
        </div>

        <!-- Col 3: Enlaces Legales -->
        <div class="space-y-2">
          <h4 class="font-bold text-xs uppercase tracking-wider text-[#D99FB4]">Información Legal</h4>
          <ul class="space-y-1.5">
            <li v-if="cmdStore.footerConfig.mostrarTerminos">
              <button @click="emit('abrir-legal', 'terminos')" class="hover:text-[#D99FB4] transition text-left">
                Términos y Condiciones de Compra
              </button>
            </li>
            <li v-if="cmdStore.footerConfig.mostrarPoliticaDevolucion">
              <button @click="emit('abrir-legal', 'devoluciones')" class="hover:text-[#D99FB4] transition text-left">
                Políticas de Cambio y Garantías
              </button>
            </li>
          </ul>
        </div>
      </div>

      <!-- Copyright y Badge Pandibuy -->
      <div class="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-400">
        <p>{{ cmdStore.footerConfig.textoCopyright }}</p>
        <div v-if="cmdStore.footerConfig.badgePandibuy" class="flex items-center gap-1.5 text-gray-400">
          <span>Tienda impulsada por</span>
          <router-link to="/login" class="text-[#D99FB4] font-bold hover:underline flex items-center gap-1">
            <i class="bi bi-bag-heart-fill"></i>
            <span>Pandibuy</span>
          </router-link>
        </div>
      </div>
    </div>
  </footer>
</template>
