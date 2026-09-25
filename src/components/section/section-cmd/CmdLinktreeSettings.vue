<script setup>
import { computed } from 'vue'
import { useCmdStore } from '../../../stores/cmdStore'

const cmdStore = useCmdStore()

// Sincronización bidireccional de alias
const tituloPerfil = computed({
  get: () => cmdStore.linktree.tituloPerfil || cmdStore.linktree.titulo || '',
  set: (val) => {
    cmdStore.linktree.tituloPerfil = val
    cmdStore.linktree.titulo = val
  }
})

const biografia = computed({
  get: () => cmdStore.linktree.biografia || cmdStore.linktree.bio || '',
  set: (val) => {
    cmdStore.linktree.biografia = val
    cmdStore.linktree.bio = val
  }
})

const iconosDisponibles = [
  { valor: 'bi bi-whatsapp', etiqueta: 'WhatsApp' },
  { valor: 'bi bi-instagram', etiqueta: 'Instagram' },
  { valor: 'bi bi-tiktok', etiqueta: 'TikTok' },
  { valor: 'bi bi-facebook', etiqueta: 'Facebook' },
  { valor: 'bi bi-telegram', etiqueta: 'Telegram' },
  { valor: 'bi bi-bag-heart', etiqueta: 'Catálogo / Tienda' },
  { valor: 'bi bi-globe', etiqueta: 'Sitio Web' },
  { valor: 'bi bi-envelope', etiqueta: 'Correo' },
  { valor: 'bi bi-telephone', etiqueta: 'Teléfono' },
  { valor: 'bi bi-link-45deg', etiqueta: 'Enlace General' }
]
</script>

<template>
  <div class="bg-white p-6 rounded-2xl border border-[#EADBDE] shadow-xs space-y-6">
    <div class="flex items-center justify-between border-b border-[#FAF8F6] pb-3 text-[#9E5A78]">
      <div class="flex items-center gap-2">
        <i class="bi bi-diagram-2 text-lg"></i>
        <div>
          <h2 class="text-base font-bold text-[#1F1824]">Personalización del Perfil Linktree</h2>
          <p class="text-[11px] text-gray-500 font-normal">Configura el diseño, encabezado y enlaces directos para tus redes sociales.</p>
        </div>
      </div>
      <router-link
        :to="{ name: 'public-linktree', params: { subdominio: cmdStore.subdominio || 'pandibuy' } }"
        target="_blank"
        class="text-xs font-bold text-[#9E5A78] hover:underline flex items-center gap-1.5 px-3 py-1.5 bg-[#F7EFE9] rounded-xl hover:bg-[#EADBDE] transition"
      >
        <i class="bi bi-box-arrow-up-right"></i> Previsualizar Linktree
      </router-link>
    </div>

    <!-- Ajustes Principales de Perfil -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Título del Perfil</label>
        <input
          v-model="tituloPerfil"
          type="text"
          placeholder="Nombre de tu negocio o marca"
          class="w-full px-3.5 py-2 text-xs bg-[#FAF8F6] border border-[#EADBDE] rounded-xl font-bold"
        />
      </div>

      <div>
        <label class="block text-xs font-bold text-gray-700 uppercase mb-1">URL del Avatar / Foto de Perfil</label>
        <input
          v-model="cmdStore.linktree.avatarUrl"
          type="text"
          placeholder="https://ejemplo.com/avatar.jpg"
          class="w-full px-3.5 py-2 text-xs bg-[#FAF8F6] border border-[#EADBDE] rounded-xl font-medium"
        />
      </div>

      <div class="sm:col-span-2">
        <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Biografía / Descripción corta</label>
        <textarea
          v-model="biografia"
          rows="2"
          placeholder="Breve descripción visible debajo del avatar..."
          class="w-full px-3.5 py-2 text-xs bg-[#FAF8F6] border border-[#EADBDE] rounded-xl"
        ></textarea>
      </div>

      <div>
        <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Color de Fondo de la Pantalla</label>
        <div class="flex items-center gap-2">
          <input
            type="color"
            v-model="cmdStore.linktree.colorFondo"
            class="w-9 h-9 p-0.5 rounded-lg border border-[#EADBDE] cursor-pointer"
          />
          <input
            v-model="cmdStore.linktree.colorFondo"
            type="text"
            placeholder="#1F1824"
            class="w-full px-3.5 py-2 bg-[#FAF8F6] border border-[#EADBDE] rounded-xl font-mono text-xs"
          />
        </div>
      </div>

      <div>
        <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Color de los Botones</label>
        <div class="flex items-center gap-2">
          <input
            type="color"
            v-model="cmdStore.linktree.colorBoton"
            class="w-9 h-9 p-0.5 rounded-lg border border-[#EADBDE] cursor-pointer"
          />
          <input
            v-model="cmdStore.linktree.colorBoton"
            type="text"
            placeholder="#9E5A78"
            class="w-full px-3.5 py-2 bg-[#FAF8F6] border border-[#EADBDE] rounded-xl font-mono text-xs"
          />
        </div>
      </div>

      <div>
        <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Color de Texto de los Botones</label>
        <div class="flex items-center gap-2">
          <input
            type="color"
            v-model="cmdStore.linktree.colorTextoBoton"
            class="w-9 h-9 p-0.5 rounded-lg border border-[#EADBDE] cursor-pointer"
          />
          <input
            v-model="cmdStore.linktree.colorTextoBoton"
            type="text"
            placeholder="#FAF8F6"
            class="w-full px-3.5 py-2 bg-[#FAF8F6] border border-[#EADBDE] rounded-xl font-mono text-xs"
          />
        </div>
      </div>
    </div>

    <!-- Lista de Enlaces Dinámica -->
    <div class="space-y-3 pt-2">
      <div class="flex justify-between items-center">
        <div>
          <h3 class="text-xs font-bold text-gray-700 uppercase tracking-wider">Enlaces & Botones del Linktree</h3>
          <p class="text-[11px] text-gray-400">Marca la casilla para hacer visible cada enlace en tu página pública.</p>
        </div>
        <button
          type="button"
          @click="cmdStore.agregarEnlaceLinktree"
          class="px-3.5 py-1.5 bg-[#F7EFE9] text-[#9E5A78] font-bold text-xs rounded-xl hover:bg-[#EADBDE] transition flex items-center gap-1.5"
        >
          <i class="bi bi-plus-lg"></i> Agregar Enlace
        </button>
      </div>

      <div v-if="!cmdStore.linktree.enlaces || cmdStore.linktree.enlaces.length === 0" class="text-center py-6 text-xs text-gray-400 bg-[#FAF8F6] rounded-xl border border-dashed border-[#EADBDE]">
        No hay enlaces configurados. Haz clic en "Agregar Enlace" para crear el primero.
      </div>

      <div
        v-for="(enlace, idx) in cmdStore.linktree.enlaces"
        :key="enlace.id || idx"
        class="grid grid-cols-12 gap-2 sm:gap-3 items-center bg-[#FAF8F6] p-3 rounded-xl border border-[#EADBDE] transition"
        :class="{ 'opacity-60 bg-gray-50': !enlace.activo }"
      >
        <!-- Toggle Activo -->
        <div class="col-span-2 sm:col-span-1 flex items-center justify-center">
          <label class="inline-flex items-center cursor-pointer" :title="enlace.activo ? 'Visible en Linktree' : 'Oculto en Linktree'">
            <input
              type="checkbox"
              v-model="enlace.activo"
              class="w-4 h-4 rounded text-[#9E5A78] focus:ring-[#9E5A78] cursor-pointer"
            />
          </label>
        </div>

        <!-- Selector de Ícono -->
        <div class="col-span-10 sm:col-span-3">
          <select
            v-model="enlace.icono"
            class="w-full px-2.5 py-1.5 bg-white border border-[#EADBDE] rounded-lg text-xs font-medium focus:ring-1 focus:ring-[#9E5A78]"
          >
            <option v-for="ico in iconosDisponibles" :key="ico.valor" :value="ico.valor">
              {{ ico.etiqueta }}
            </option>
          </select>
        </div>

        <!-- Texto / Etiqueta -->
        <div class="col-span-12 sm:col-span-3">
          <input
            v-model="enlace.etiqueta"
            type="text"
            placeholder="Texto del botón"
            class="w-full px-3 py-1.5 bg-white border border-[#EADBDE] rounded-lg text-xs font-medium focus:ring-1 focus:ring-[#9E5A78]"
          />
        </div>

        <!-- URL Destino -->
        <div class="col-span-10 sm:col-span-4">
          <input
            v-model="enlace.url"
            type="text"
            placeholder="https://..."
            class="w-full px-3 py-1.5 bg-white border border-[#EADBDE] rounded-lg text-xs focus:ring-1 focus:ring-[#9E5A78]"
          />
        </div>

        <!-- Eliminar -->
        <div class="col-span-2 sm:col-span-1 text-center">
          <button
            type="button"
            @click="cmdStore.eliminarEnlaceLinktree(idx)"
            class="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition"
            title="Eliminar enlace"
          >
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
