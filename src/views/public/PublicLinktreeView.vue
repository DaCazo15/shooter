<script setup>
import { onMounted, computed, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useCmdStore } from '../../stores/cmdStore'
import { getHostnameSubdomain } from '../../utils/subdomain'
import gsap from 'gsap'

const route = useRoute()
const cmdStore = useCmdStore()

const enlacesActivos = computed(() => {
  return cmdStore.linktree.enlaces.filter(e => e.activo)
})

onMounted(() => {
  const sub = route.params.subdominio || getHostnameSubdomain()
  if (sub && sub !== cmdStore.subdominio) {
    cmdStore.cargarDeFirestore(sub)
  }

  nextTick(() => {
    // Animación de entrada de avatar y biografía
    gsap.from('.gsap-linktree-header', {
      duration: 1,
      y: 30,
      opacity: 0,
      ease: 'power3.out'
    })

    // Animación en cascada de los botones de enlaces
    gsap.from('.gsap-link-item', {
      duration: 0.8,
      y: 25,
      opacity: 0,
      stagger: 0.12,
      delay: 0.2,
      ease: 'back.out(1.5)'
    })
  })
})

const getIcono = (enlace) => {
  if (enlace.icono) return enlace.icono
  if (enlace.red === 'whatsapp' || enlace.url.includes('wa.me')) return 'bi bi-whatsapp'
  if (enlace.red === 'instagram' || enlace.url.includes('instagram.com')) return 'bi bi-instagram'
  if (enlace.red === 'tiktok' || enlace.url.includes('tiktok.com')) return 'bi bi-tiktok'
  if (enlace.red === 'facebook' || enlace.url.includes('facebook.com')) return 'bi bi-facebook'
  if (enlace.red === 'telegram' || enlace.url.includes('t.me')) return 'bi bi-telegram'
  return 'bi bi-link-45deg'
}
</script>

<template>
  <div
    class="min-h-screen flex flex-col items-center justify-between p-6 antialiased"
    :style="{ backgroundColor: cmdStore.linktree.colorFondo || '#1F1824' }"
  >
    <!-- Contenedor Central -->
    <div class="w-full max-w-md mx-auto pt-8 pb-12 flex flex-col items-center text-center space-y-6">
      <!-- Encabezado / Avatar y Bio con GSAP -->
      <div class="gsap-linktree-header space-y-3 flex flex-col items-center">
        <div class="relative">
          <img
            :src="cmdStore.linktree.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'"
            alt="Avatar"
            class="w-24 h-24 rounded-full object-cover border-4 border-[#D99FB4] shadow-xl"
          />
          <span class="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-2 border-[#1F1824] rounded-full"></span>
        </div>

        <div>
          <h1 class="text-xl font-bold font-serif-title text-[#FAF8F6]">
            {{ cmdStore.linktree.titulo || cmdStore.tituloSitio || 'Pandibuy Store' }}
          </h1>
          <p class="text-xs text-[#FAF8F6]/70 mt-1 max-w-xs mx-auto leading-relaxed">
            {{ cmdStore.linktree.bio || 'Accede a nuestro catálogo exclusivo, pedidos personalizados y canales de atención.' }}
          </p>
        </div>
      </div>

      <!-- Enlaces con Animación GSAP -->
      <div class="w-full space-y-3 pt-2">
        <a
          v-for="enlace in enlacesActivos"
          :key="enlace.id"
          :href="enlace.url"
          target="_blank"
          rel="noopener noreferrer"
          class="gsap-link-item group w-full p-4 rounded-2xl flex items-center justify-between transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
          :style="{
            backgroundColor: cmdStore.linktree.colorBoton || '#9E5A78',
            color: cmdStore.linktree.colorTextoBoton || '#FAF8F6'
          }"
        >
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-sm">
              <i :class="getIcono(enlace)"></i>
            </div>
            <span class="text-xs font-bold text-left tracking-wide">{{ enlace.etiqueta }}</span>
          </div>

          <i class="bi bi-arrow-up-right text-xs opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition"></i>
        </a>

        <!-- Botón Ver Web Principal -->
        <RouterLink
          :to="{ name: 'public-web', params: { subdominio: route.params.subdominio || cmdStore.subdominio || 'pandibuy' } }"
          class="gsap-link-item block w-full p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-[#FAF8F6] text-xs font-bold transition text-center border border-white/10"
        >
          <i class="bi bi-globe me-1.5"></i> Visitar Tienda Completa
        </RouterLink>
      </div>
    </div>

    <!-- Pie / Footer con GSAP -->
    <div class="text-center py-4">
      <RouterLink to="/" class="text-[11px] font-bold text-[#FAF8F6]/50 hover:text-[#FAF8F6] transition flex items-center justify-center gap-1.5">
        <span>Powered by</span>
        <span class="font-serif-title text-[#D99FB4]">Pandibuy</span>
      </RouterLink>
    </div>
  </div>
</template>
