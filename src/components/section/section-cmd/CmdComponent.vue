<script setup>
import { onMounted } from 'vue'
import { useCMD } from '../../../composable/useCMD'

const {
  config,
  modoActual,
  MODOS_CMD,
  urlSubdominio,
  cargando,
  guardando,
  cambiarModo,
  toggleBloqueWeb,
  moverBloqueWeb,
  agregarEnlaceLinktree,
  eliminarEnlaceLinktree,
  cargarConfiguracion,
  guardarCMD
} = useCMD('USUARIO_ACTUAL_ID')

onMounted(() => {
  cargarConfiguracion()
})

const handleSubmit = () => {
  guardarCMD()
}
</script>

<template>
  <div class="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-md">
    <!-- Header -->
    <div class="border-b pb-4 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h2 class="text-2xl font-black text-gray-800">CMD — Builder Center</h2>
        <p class="text-sm text-gray-500">Configura tu aplicación Web MVP o tu perfil Linktree</p>
      </div>
      <div v-if="urlSubdominio" class="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-200 text-sm font-semibold flex items-center gap-2">
        <i class="bi bi-globe"></i>
        <a :href="urlSubdominio" target="_blank" class="hover:underline">{{ urlSubdominio }}</a>
      </div>
    </div>

    <!-- Selector de Modo (Pestañas) -->
    <div class="flex gap-2 mb-6 border-b border-gray-200 pb-2">
      <button
        type="button"
        class="px-5 py-2.5 rounded-lg font-bold text-sm transition flex items-center gap-2"
        :class="modoActual === MODOS_CMD.WEB ? 'bg-slate-800 text-white shadow' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
        @click="cambiarModo(MODOS_CMD.WEB)"
      >
        <i class="bi bi-window-stack"></i> CMD Web App (MVP)
      </button>
      <button
        type="button"
        class="px-5 py-2.5 rounded-lg font-bold text-sm transition flex items-center gap-2"
        :class="modoActual === MODOS_CMD.LINKTREE ? 'bg-slate-800 text-white shadow' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
        @click="cambiarModo(MODOS_CMD.LINKTREE)"
      >
        <i class="bi bi-diagram-2"></i> CMD Linktree
      </button>
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
      <!-- Subdominio Global -->
      <div class="bg-slate-900 text-white rounded-xl p-5 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-800">
          <FormKit
            type="text"
            v-model="config.subdominio"
            label="Subdominio del proyecto"
            placeholder="mimienda"
            help="Se usará para acceder a tu sitio o linktree"
            validation="required|alpha_node"
          />
          <FormKit
            type="text"
            v-model="config.tituloSitio"
            label="Nombre del Negocio"
            placeholder="Mi Tienda Oficial"
            validation="required"
          />
        </div>
      </div>

      <!-- MODO 1: CMD WEB APP -->
      <div v-if="modoActual === MODOS_CMD.WEB" class="space-y-6">
        <div class="border-l-4 border-blue-600 pl-4 py-1">
          <h3 class="text-xl font-bold text-gray-800">Constructor de Web App / Catálogo</h3>
          <p class="text-sm text-gray-500">Activa y ordena las secciones de tu sitio web</p>
        </div>

        <div class="space-y-3">
          <div
            v-for="(bloque, index) in config.bloquesWeb"
            :key="bloque.id"
            class="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm"
          >
            <div class="flex items-center gap-3">
              <input
                type="checkbox"
                :checked="bloque.activo"
                @change="toggleBloqueWeb(bloque.id)"
                class="w-5 h-5 accent-emerald-600 cursor-pointer"
              />
              <span class="font-semibold text-gray-800" :class="{ 'line-through text-gray-400': !bloque.activo }">
                {{ bloque.tipo }}
              </span>
            </div>

            <div class="flex items-center gap-2">
              <button
                type="button"
                :disabled="index === 0"
                class="p-1.5 text-gray-500 hover:text-blue-600 disabled:opacity-30"
                @click="moverBloqueWeb(index, -1)"
              >
                <i class="bi bi-arrow-up-circle text-lg"></i>
              </button>
              <button
                type="button"
                :disabled="index === config.bloquesWeb.length - 1"
                class="p-1.5 text-gray-500 hover:text-blue-600 disabled:opacity-30"
                @click="moverBloqueWeb(index, 1)"
              >
                <i class="bi bi-arrow-down-circle text-lg"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- MODO 2: CMD LINKTREE -->
      <div v-if="modoActual === MODOS_CMD.LINKTREE" class="space-y-6">
        <div class="border-l-4 border-emerald-600 pl-4 py-1">
          <h3 class="text-xl font-bold text-gray-800">Perfil Linktree</h3>
          <p class="text-sm text-gray-500">Administra tus enlaces directos a redes y canales de contacto</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
          <FormKit
            type="text"
            v-model="config.linktree.tituloPerfil"
            label="Título / Nombre en Perfil"
            placeholder="Ej. @mitienda_oficial"
          />
          <FormKit
            type="text"
            v-model="config.linktree.biografia"
            label="Biografía / Eslogan"
            placeholder="Atención rápida por WhatsApp e Instagram"
          />
        </div>

        <!-- Lista de Enlaces -->
        <div class="space-y-3">
          <div
            v-for="(enlace, idx) in config.linktree.enlaces"
            :key="enlace.id"
            class="grid grid-cols-12 gap-3 items-center bg-white border border-gray-200 p-3 rounded-xl shadow-sm"
          >
            <div class="col-span-1 text-center">
              <input
                type="checkbox"
                v-model="enlace.activo"
                class="w-4 h-4 accent-emerald-600"
              />
            </div>
            <div class="col-span-4">
              <FormKit
                type="text"
                v-model="enlace.etiqueta"
                placeholder="Nombre del enlace"
              />
            </div>
            <div class="col-span-6">
              <FormKit
                type="text"
                v-model="enlace.url"
                placeholder="https://wa.me/... o enlace"
              />
            </div>
            <div class="col-span-1 text-center">
              <button
                type="button"
                class="text-red-500 hover:text-red-700"
                @click="eliminarEnlaceLinktree(idx)"
              >
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>

          <button
            type="button"
            class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium text-sm transition flex items-center gap-1"
            @click="agregarEnlaceLinktree"
          >
            <i class="bi bi-plus-circle"></i> Agregar otro enlace
          </button>
        </div>
      </div>

      <!-- Guardado Unificado -->
      <button
        type="submit"
        :disabled="guardando"
        class="w-full mt-8 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold py-3 px-6 rounded-lg transition shadow-md flex items-center justify-center gap-2"
      >
        <i class="bi bi-cloud-upload"></i>
        {{ guardando ? 'Guardando...' : 'Publicar Configuración' }}
      </button>
    </FormKit>
  </div>
</template>
