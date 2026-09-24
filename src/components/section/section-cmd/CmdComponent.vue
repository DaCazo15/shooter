<script setup>
import { onMounted } from 'vue'
import { useCMD } from '../../../composable/useCMD'

// Pasar el ID del usuario autenticado (se asume auth.currentUser.uid o un ID estático temporal)
const {
  configSitio,
  urlSubdominio,
  cargando,
  guardando,
  cargarConfiguracion,
  toggleBloque,
  moverBloque,
  guardarSitio
} = useCMD('USUARIO_ACTUAL_ID')

onMounted(() => {
  cargarConfiguracion()
})

const handleSubmit = () => {
  guardarSitio()
}
</script>

<template>
  <div class="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-md">
    <!-- Header -->
    <div class="border-b pb-4 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h2 class="text-2xl font-black text-gray-800">CMD — Page Builder & MVP</h2>
        <p class="text-sm text-gray-500">Arma tu sitio web dinámico, catálogo y Linktree personalizado</p>
      </div>
      <div v-if="urlSubdominio" class="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-200 text-sm font-semibold flex items-center gap-2">
        <i class="bi bi-globe"></i>
        <a :href="urlSubdominio" target="_blank" class="hover:underline">{{ urlSubdominio }}</a>
      </div>
    </div>

    <div v-if="cargando" class="text-center py-10 text-gray-400">
      Cargando configuración...
    </div>

    <FormKit
      v-else
      type="form"
      :actions="false"
      @submit="handleSubmit"
    >
      <!-- Configuración de Subdominio e Identidad -->
      <div class="bg-slate-800 text-white rounded-xl p-5 mb-6">
        <h3 class="text-lg font-bold mb-3 flex items-center gap-2">
          <i class="bi bi-link-45deg"></i> Dominio e Identidad del Negocio
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-800">
          <FormKit
            type="text"
            v-model="configSitio.subdominio"
            label="Subdominio deseado"
            placeholder="mimienda"
            help="Escribe solo el nombre de tu marca"
            validation="required|alpha_node"
          />
          <FormKit
            type="text"
            v-model="configSitio.tituloSitio"
            label="Título del sitio"
            placeholder="Mi Tienda Oficial"
            validation="required"
          />
          <FormKit
            type="text"
            v-model="configSitio.descripcion"
            label="Descripción corta"
            placeholder="Venta de accesorios y artículos diversos"
          />
        </div>
      </div>

      <!-- Configuración Linktree / Redes Sociales -->
      <div class="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6">
        <h3 class="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
          <i class="bi bi-share"></i> Enlaces directos (Linktree)
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormKit
            type="text"
            v-model="configSitio.redes.whatsapp"
            label="WhatsApp"
            placeholder="+584120000000"
          />
          <FormKit
            type="text"
            v-model="configSitio.redes.instagram"
            label="Instagram (Usuario)"
            placeholder="@mitienda"
          />
          <FormKit
            type="text"
            v-model="configSitio.redes.facebook"
            label="Facebook (URL o Página)"
            placeholder="mitiendaoficial"
          />
          <FormKit
            type="text"
            v-model="configSitio.redes.telegram"
            label="Telegram"
            placeholder="t.me/mitienda"
          />
          <FormKit
            type="url"
            v-model="configSitio.redes.web"
            label="Sitio Web Externo"
            placeholder="https://mitienda.com"
          />
        </div>
      </div>

      <!-- Gestión de Bloques / Secciones del Sitio -->
      <div class="mb-6">
        <h3 class="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
          <i class="bi bi-layers"></i> Estructura y Secciones del MVP
        </h3>

        <div class="space-y-3">
          <div
            v-for="(bloque, index) in configSitio.bloques"
            :key="bloque.id"
            class="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:border-blue-300 transition"
          >
            <!-- Control de activación y nombre del bloque -->
            <div class="flex items-center gap-3">
              <input
                type="checkbox"
                :checked="bloque.activo"
                @change="toggleBloque(bloque.id)"
                class="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
              />
              <span
                class="font-semibold text-gray-800"
                :class="{ 'line-through text-gray-400': !bloque.activo }"
              >
                {{ bloque.tipo }}
              </span>
            </div>

            <!-- Controles de ordenamiento -->
            <div class="flex items-center gap-2">
              <button
                type="button"
                :disabled="index === 0"
                class="p-1.5 text-gray-500 hover:text-blue-600 disabled:opacity-30"
                @click="moverBloque(index, -1)"
              >
                <i class="bi bi-arrow-up-circle text-lg"></i>
              </button>
              <button
                type="button"
                :disabled="index === configSitio.bloques.length - 1"
                class="p-1.5 text-gray-500 hover:text-blue-600 disabled:opacity-30"
                @click="moverBloque(index, 1)"
              >
                <i class="bi bi-arrow-down-circle text-lg"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Botón Publicar / Guardar -->
      <button
        type="submit"
        :disabled="guardando"
        class="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold py-3 px-6 rounded-lg transition duration-200 shadow-md flex items-center justify-center gap-2"
      >
        <i class="bi bi-cloud-upload"></i>
        {{ guardando ? 'Publicando cambios...' : 'Publicar Sitio Web' }}
      </button>
    </FormKit>
  </div>
</template>
