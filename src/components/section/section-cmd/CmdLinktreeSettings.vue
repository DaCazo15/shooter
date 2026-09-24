<script setup>
import { useCmdStore } from '../../../stores/cmdStore'

const cmdStore = useCmdStore()
</script>

<template>
  <div class="bg-white p-6 rounded-2xl border border-[#EADBDE] shadow-xs space-y-6">
    <div class="flex items-center justify-between border-b border-[#FAF8F6] pb-3 text-[#9E5A78]">
      <div class="flex items-center gap-2">
        <i class="bi bi-diagram-2 text-lg"></i>
        <h2 class="text-base font-bold text-[#1F1824]">Personalización del Perfil Linktree</h2>
      </div>
      <router-link
        :to="{ name: 'public-linktree', params: { subdominio: cmdStore.subdominio || 'pandibuy' } }"
        target="_blank"
        class="text-xs font-bold text-[#9E5A78] hover:underline flex items-center gap-1"
      >
        <i class="bi bi-box-arrow-up-right"></i> Ver Linktree
      </router-link>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Título del Perfil</label>
        <input
          v-model="cmdStore.linktree.tituloPerfil"
          type="text"
          class="w-full px-3.5 py-2 text-xs bg-[#FAF8F6] border border-[#EADBDE] rounded-xl font-bold"
        />
      </div>

      <div>
        <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Color de Botones (Hex)</label>
        <input
          v-model="cmdStore.linktree.colorBoton"
          type="text"
          placeholder="#9E5A78"
          class="w-full px-3.5 py-2 text-xs bg-[#FAF8F6] border border-[#EADBDE] rounded-xl font-semibold"
        />
      </div>

      <div class="sm:col-span-2">
        <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Biografía</label>
        <textarea
          v-model="cmdStore.linktree.biografia"
          rows="2"
          class="w-full px-3.5 py-2 text-xs bg-[#FAF8F6] border border-[#EADBDE] rounded-xl"
        ></textarea>
      </div>
    </div>

    <!-- Lista de Enlaces Dinámica -->
    <div class="space-y-3 pt-2">
      <div class="flex justify-between items-center">
        <h3 class="text-xs font-bold text-gray-700 uppercase tracking-wider">Enlaces & Botones del Linktree</h3>
        <button
          type="button"
          @click="cmdStore.agregarEnlaceLinktree"
          class="px-3.5 py-1.5 bg-[#F7EFE9] text-[#9E5A78] font-bold text-xs rounded-xl hover:bg-[#EADBDE] transition flex items-center gap-1"
        >
          <i class="bi bi-plus-lg"></i> Agregar Enlace
        </button>
      </div>

      <div
        v-for="(enlace, idx) in cmdStore.linktree.enlaces"
        :key="enlace.id"
        class="grid grid-cols-12 gap-3 items-center bg-[#FAF8F6] p-3 rounded-xl border border-[#EADBDE]"
      >
        <div class="col-span-1 text-center">
          <input
            type="checkbox"
            v-model="enlace.activo"
            class="w-4 h-4 rounded text-[#9E5A78]"
            title="Activar o desactivar enlace"
          />
        </div>
        <div class="col-span-4">
          <input
            v-model="enlace.etiqueta"
            type="text"
            placeholder="Texto del botón"
            class="w-full px-3 py-1.5 bg-white border border-[#EADBDE] rounded-lg text-xs font-medium"
          />
        </div>
        <div class="col-span-6">
          <input
            v-model="enlace.url"
            type="text"
            placeholder="https://..."
            class="w-full px-3 py-1.5 bg-white border border-[#EADBDE] rounded-lg text-xs"
          />
        </div>
        <div class="col-span-1 text-center">
          <button
            type="button"
            @click="cmdStore.eliminarEnlaceLinktree(idx)"
            class="text-red-400 hover:text-red-600 p-1"
          >
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
