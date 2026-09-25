<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import { useCmdStore } from '../../stores/cmdStore'

const router = useRouter()
const authStore = useAuthStore()
const cmdStore = useCmdStore()

const menuPerfilAbierto = ref(false)

const handleLogout = async () => {
  await authStore.logout()
  router.push({ name: 'login' })
}

const abrirWeb = () => {
  const url = `/web/${cmdStore.subdominio || 'pandibuy'}`
  window.open(url, '_blank')
}

const abrirLinktree = () => {
  const url = `/bio/${cmdStore.subdominio || 'pandibuy'}`
  window.open(url, '_blank')
}
</script>

<template>
  <header class="bg-[#1F1824] text-white border-b border-[#2D2334] sticky top-0 z-40 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo & Branding -->
        <router-link to="/dashboard/calculadora" class="flex items-center gap-3 group">
          <img
            src="/logo.png"
            alt="Pandibuy Logo"
            class="w-10 h-10 object-contain rounded-xl shadow-md group-hover:scale-105 transition transform"
          />
          <div>
            <span class="font-serif-title text-xl font-bold tracking-tight text-[#FAF8F6] block leading-none">
              Pandibuy
            </span>
            <span class="text-[10px] tracking-widest uppercase font-semibold text-[#D99FB4]">
              Business Studio
            </span>
          </div>
        </router-link>

        <!-- Acciones Rápidas (Ver Web, Linktree, Perfil) -->
        <div class="flex items-center gap-3">
          <!-- Botón Ver Web Pública -->
          <button
            @click="abrirWeb"
            class="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#2D2334] hover:bg-[#3E3147] text-[#FAF8F6] text-xs font-semibold border border-[#3E3147] transition shadow-sm"
            title="Abrir tu vitrina web en una pestaña nueva"
          >
            <i class="bi bi-globe text-[#D99FB4]"></i>
            <span>Ver Mi Web</span>
          </button>

          <!-- Botón Ver Linktree -->
          <button
            @click="abrirLinktree"
            class="hidden md:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#2D2334] hover:bg-[#3E3147] text-[#FAF8F6] text-xs font-semibold border border-[#3E3147] transition shadow-sm"
            title="Abrir tu perfil Linktree"
          >
            <i class="bi bi-diagram-2 text-[#D99FB4]"></i>
            <span>Ver Linktree</span>
          </button>

          <!-- Separador -->
          <div class="hidden sm:block h-6 w-px bg-[#3E3147] mx-1"></div>

          <!-- Menú / Botón de Perfil de Usuario -->
          <div class="relative">
            <button
              @click="menuPerfilAbierto = !menuPerfilAbierto"
              class="flex items-center gap-2.5 p-1.5 pr-3 rounded-full bg-[#2D2334] hover:bg-[#3E3147] border border-[#3E3147] transition focus:outline-none focus:ring-2 focus:ring-[#9E5A78]"
            >
              <img
                :src="authStore.user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'"
                alt="Avatar"
                class="w-7 h-7 rounded-full object-cover border border-[#9E5A78]"
              />
              <span class="text-xs font-semibold text-[#FAF8F6] hidden sm:block max-w-30 truncate">
                {{ authStore.user.displayName || 'Mi Perfil' }}
              </span>
              <i class="bi bi-chevron-down text-[10px] text-gray-400"></i>
            </button>

            <!-- Dropdown Menú de Perfil -->
            <div
              v-if="menuPerfilAbierto"
              @click="menuPerfilAbierto = false"
              class="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl py-2 border border-[#EADBDE] text-[#1F1824] z-50 animate-in fade-in zoom-in-95 duration-100"
            >
              <div class="px-4 py-3 border-b border-[#FAF8F6] bg-[#FAF8F6]/70 rounded-t-2xl">
                <p class="text-xs text-gray-500">Sesión iniciada como</p>
                <p class="text-sm font-bold text-[#1F1824] truncate">{{ authStore.user.businessName || 'Pandibuy Atelier' }}</p>
                <p class="text-xs text-[#9E5A78] truncate">{{ authStore.user.email }}</p>
              </div>

              <div class="py-1">
                <router-link
                  to="/dashboard/perfil"
                  class="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-[#F7EFE9] hover:text-[#9E5A78] transition"
                >
                  <i class="bi bi-person-gear text-sm text-[#9E5A78]"></i>
                  <span>Configurar Perfil</span>
                </router-link>

                <router-link
                  to="/dashboard/configuracion"
                  class="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-[#F7EFE9] hover:text-[#9E5A78] transition"
                >
                  <i class="bi bi-gear text-sm text-[#9E5A78]"></i>
                  <span>Configuración</span>
                </router-link>

                <router-link
                  to="/dashboard/builder"
                  class="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-[#F7EFE9] hover:text-[#9E5A78] transition"
                >
                  <i class="bi bi-palette text-sm text-[#9E5A78]"></i>
                  <span>Abrir CMD</span>
                </router-link>
              </div>

              <div class="border-t border-gray-100 pt-1 mt-1">
                <button
                  @click="handleLogout"
                  class="w-full text-left flex items-center gap-3 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition"
                >
                  <i class="bi bi-box-arrow-right text-sm"></i>
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
