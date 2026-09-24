<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('contacto@pandibuy.com')
const password = ref('pandibuy123')
const recordarme = ref(true)

const handleLogin = async () => {
  const exito = await authStore.login(email.value, password.value)
  if (exito) {
    router.push({ name: 'dashboard-calculadora' })
  }
}

const handleGoogle = async () => {
  const exito = await authStore.loginWithGoogle()
  if (exito) {
    router.push({ name: 'dashboard-calculadora' })
  }
}

const handleAccesoDirecto = async () => {
  authStore.isAuthenticated = true
  router.push({ name: 'dashboard-calculadora' })
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-linear-to-br from-[#1F1824] via-[#2A2030] to-[#16111B] p-4 sm:p-6 lg:p-8 relative overflow-hidden">
    <!-- Luces y esferas de fondo estilo lujo -->
    <div class="absolute -top-32 -left-32 w-96 h-96 bg-[#9E5A78]/20 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-32 -right-32 w-96 h-96 bg-[#D99FB4]/15 rounded-full blur-3xl pointer-events-none"></div>

    <div class="w-full max-w-md bg-[#FAF8F6] rounded-3xl shadow-2xl overflow-hidden border border-[#EADBDE]/40 relative z-10">
      <!-- Encabezado con estética refinada -->
      <div class="bg-linear-to-r from-[#1F1824] to-[#2D2334] p-8 text-center text-white relative">
        <div class="w-16 h-16 mx-auto mb-3 bg-[#FAF8F6] rounded-2xl flex items-center justify-center shadow-lg border border-[#EADBDE]">
          <i class="bi bi-bag-heart-fill text-2xl text-[#9E5A78]"></i>
        </div>
        <h1 class="text-2xl font-bold tracking-tight font-serif-title text-[#FAF8F6]">
          Pandibuy
        </h1>
        <p class="text-xs uppercase tracking-widest text-[#D99FB4] font-semibold mt-1">
          Business Suite & Shop Builder
        </p>
      </div>

      <!-- Formulario de Inicio de Sesión -->
      <div class="p-8">
        <div class="mb-6 text-center">
          <h2 class="text-xl font-bold text-[#1F1824]">Iniciar Sesión</h2>
          <p class="text-xs text-gray-500 mt-1">Ingresa tus credenciales autorizadas para acceder a tu panel de control</p>
        </div>

        <div v-if="authStore.errorMessage" class="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
          <i class="bi bi-exclamation-circle-fill text-red-500"></i>
          <span>{{ authStore.errorMessage }}</span>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Correo Electrónico
            </label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                <i class="bi bi-envelope"></i>
              </span>
              <input
                v-model="email"
                type="email"
                required
                placeholder="tu@negocio.com"
                class="w-full pl-10 pr-4 py-2.5 bg-white border border-[#EADBDE] rounded-xl text-sm text-[#1F1824] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9E5A78] focus:border-transparent transition"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Contraseña
            </label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                <i class="bi bi-lock"></i>
              </span>
              <input
                v-model="password"
                type="password"
                required
                placeholder="••••••••"
                class="w-full pl-10 pr-4 py-2.5 bg-white border border-[#EADBDE] rounded-xl text-sm text-[#1F1824] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9E5A78] focus:border-transparent transition"
              />
            </div>
          </div>

          <div class="flex items-center justify-between text-xs pt-1">
            <label class="flex items-center gap-2 cursor-pointer text-gray-600">
              <input
                v-model="recordarme"
                type="checkbox"
                class="rounded border-[#EADBDE] text-[#9E5A78] focus:ring-[#9E5A78]"
              />
              Recordar este equipo
            </label>
            <a href="#" class="text-[#9E5A78] hover:underline font-medium">¿Olvidaste tu clave?</a>
          </div>

          <button
            type="submit"
            :disabled="authStore.isLoading"
            class="w-full py-3 bg-[#9E5A78] hover:bg-[#864662] text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition duration-200 flex items-center justify-center gap-2"
          >
            <i v-if="authStore.isLoading" class="bi bi-arrow-repeat animate-spin"></i>
            <i v-else class="bi bi-box-arrow-in-right"></i>
            {{ authStore.isLoading ? 'Iniciando sesión...' : 'Entrar a Pandibuy' }}
          </button>
        </form>

        <div class="relative my-6 text-center">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-[#EADBDE]"></div>
          </div>
          <span class="relative bg-[#FAF8F6] px-3 text-xs text-gray-400 uppercase tracking-wider">Otras opciones</span>
        </div>

        <button
          @click="handleGoogle"
          type="button"
          class="w-full py-2.5 bg-white hover:bg-gray-50 border border-[#EADBDE] text-gray-700 font-semibold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-2 mb-3"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          Continuar con Google
        </button>

        <button
          @click="handleAccesoDirecto"
          type="button"
          class="w-full py-2 bg-[#F7EFE9] hover:bg-[#EADBDE] text-[#9E5A78] font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
        >
          <i class="bi bi-lightning-charge-fill"></i> Acceso Rápido / Modo Demo
        </button>

        <div class="mt-6 text-center text-xs text-gray-400">
          <p>Plataforma privada de gestión empresarial.</p>
          <p class="mt-1">Solo acceso para usuarios registrados.</p>
        </div>
      </div>
    </div>
  </div>
</template>
