<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useCmdStore } from '../../stores/cmdStore'
import { getHostnameSubdomain } from '../../utils/subdomain'

import PublicInfoBar from '../../components/public/PublicInfoBar.vue'
import PublicNavbar from '../../components/public/PublicNavbar.vue'
import PublicHeroBanner from '../../components/public/PublicHeroBanner.vue'
import PublicCatalogo from '../../components/public/PublicCatalogo.vue'
import PublicCtaBanner from '../../components/public/PublicCtaBanner.vue'
import PublicFooter from '../../components/public/PublicFooter.vue'
import PublicLegalModal from '../../components/public/PublicLegalModal.vue'
import PublicWhatsAppFloat from '../../components/public/PublicWhatsAppFloat.vue'

const route = useRoute()
const cmdStore = useCmdStore()

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true'

// UID del negocio dueño de la tienda
const ownerUid = computed(() => {
  return cmdStore.ownerUid || route.params.subdominio || getHostnameSubdomain() || (DEMO_MODE ? 'demo-user-1' : '')
})

// Carga de configuración por subdominio o parámetro de ruta
const cargarTienda = () => {
  const sub = route.params.subdominio || getHostnameSubdomain()
  if (sub) {
    cmdStore.cargarDeFirestore(sub)
  }
}

onMounted(() => {
  cargarTienda()
})

watch(() => route.params.subdominio, () => {
  cargarTienda()
})

// Estado del modal legal (coordinado por el orquestador)
const modalLegalAbierto = ref(false)
const modalLegalTipo = ref('terminos')

const abrirModalLegal = (tipo) => {
  modalLegalTipo.value = tipo
  modalLegalAbierto.value = true
}

// Acceso directo a los bloques configurados
const bloqueCinta = computed(() => cmdStore.bloquesWeb.find(b => b.id === 'cinta'))
const bloqueHero = computed(() => cmdStore.bloquesWeb.find(b => b.id === 'hero'))
const bloqueCatalogo = computed(() => cmdStore.bloquesWeb.find(b => b.id === 'catalogo'))
const bloqueCta = computed(() => cmdStore.bloquesWeb.find(b => b.id === 'cta'))
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#FAF8F6] text-[#1F1824] antialiased">
    <PublicInfoBar :bloque="bloqueCinta" />
    <PublicNavbar />
    <PublicHeroBanner :bloque="bloqueHero" />
    <PublicCatalogo :bloque="bloqueCatalogo" :uid="ownerUid" />
    <PublicCtaBanner :bloque="bloqueCta" />
    <PublicFooter @abrir-legal="abrirModalLegal" />
    <PublicWhatsAppFloat />

    <PublicLegalModal
      :abierto="modalLegalAbierto"
      :tipo="modalLegalTipo"
      @cerrar="modalLegalAbierto = false"
    />
  </div>
</template>
