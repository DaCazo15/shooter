<script setup>
import { ref } from 'vue'
import { useCmdStore } from '../../../stores/cmdStore'

const cmdStore = useCmdStore()
const bloqueExpandido = ref('hero')

const toggleAcordeon = (id) => {
  bloqueExpandido.value = bloqueExpandido.value === id ? null : id
}
</script>

<template>
  <div class="space-y-4">
    <div class="text-xs text-gray-500 flex items-center gap-1 mb-2">
      <i class="bi bi-info-circle"></i> Puedes activar/desactivar bloques, reordenarlos y desplegar cada uno para editar sus textos e imágenes:
    </div>

    <div
      v-for="(bloque, index) in cmdStore.bloquesWeb"
      :key="bloque.id"
      class="bg-white rounded-2xl border border-[#EADBDE] shadow-xs overflow-hidden transition"
    >
      <!-- Barra de Control del Bloque -->
      <div class="p-4 flex items-center justify-between bg-linear-to-r from-white to-[#FAF8F6] border-b border-[#FAF8F6]">
        <div class="flex items-center gap-3">
          <input
            type="checkbox"
            :checked="bloque.activo"
            @change="cmdStore.toggleBloqueWeb(bloque.id)"
            class="w-4 h-4 rounded text-[#9E5A78] focus:ring-[#9E5A78] cursor-pointer"
          />
          <div class="flex items-center gap-2 cursor-pointer" @click="toggleAcordeon(bloque.id)">
            <i :class="bloque.icono || 'bi bi-layers'" class="text-[#9E5A78] text-base"></i>
            <span class="font-bold text-xs text-[#1F1824]" :class="{ 'line-through text-gray-400': !bloque.activo }">
              {{ bloque.tipo }}
            </span>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            :disabled="index === 0"
            @click="cmdStore.moverBloqueWeb(index, -1)"
            class="p-1.5 text-gray-400 hover:text-[#9E5A78] disabled:opacity-20"
            title="Mover arriba"
          >
            <i class="bi bi-arrow-up-circle text-base"></i>
          </button>
          <button
            type="button"
            :disabled="index === cmdStore.bloquesWeb.length - 1"
            @click="cmdStore.moverBloqueWeb(index, 1)"
            class="p-1.5 text-gray-400 hover:text-[#9E5A78] disabled:opacity-20"
            title="Mover abajo"
          >
            <i class="bi bi-arrow-down-circle text-base"></i>
          </button>
          <button
            type="button"
            @click="toggleAcordeon(bloque.id)"
            class="px-2.5 py-1 text-xs bg-[#F7EFE9] text-[#9E5A78] rounded-lg font-semibold hover:bg-[#EADBDE] transition"
          >
            {{ bloqueExpandido === bloque.id ? 'Ocultar' : 'Editar Contenido' }}
          </button>
        </div>
      </div>

      <!-- Panel Desplegable de Edición por Bloque -->
      <div v-if="bloqueExpandido === bloque.id" class="p-5 bg-[#FAF8F6] border-t border-[#EADBDE] space-y-4">
        <!-- Bloque Cinta -->
        <div v-if="bloque.id === 'cinta'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="md:col-span-2">
            <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Mensaje de la Cinta</label>
            <input
              v-model="bloque.contenido.texto"
              type="text"
              placeholder="Envíos a todo el país..."
              class="w-full px-3 py-2 text-xs bg-white border border-[#EADBDE] rounded-xl focus:ring-2 focus:ring-[#9E5A78]"
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Color de Fondo (Hex)</label>
            <input
              v-model="bloque.contenido.bgColor"
              type="text"
              placeholder="#1F1824"
              class="w-full px-3 py-2 text-xs bg-white border border-[#EADBDE] rounded-xl"
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Color de Texto (Hex)</label>
            <input
              v-model="bloque.contenido.textColor"
              type="text"
              placeholder="#FAF8F6"
              class="w-full px-3 py-2 text-xs bg-white border border-[#EADBDE] rounded-xl"
            />
          </div>
        </div>

        <!-- Bloque Hero -->
        <div v-if="bloque.id === 'hero'" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="md:col-span-2">
              <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Título Principal (Hero)</label>
              <input
                v-model="bloque.contenido.titulo"
                type="text"
                placeholder="Piezas artesanales que cuentan historias"
                class="w-full px-3 py-2 text-xs bg-white border border-[#EADBDE] rounded-xl focus:ring-2 focus:ring-[#9E5A78] font-bold"
              />
            </div>

            <div class="md:col-span-2">
              <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Subtítulo / Bajada</label>
              <textarea
                v-model="bloque.contenido.subtitulo"
                rows="2"
                class="w-full px-3 py-2 text-xs bg-white border border-[#EADBDE] rounded-xl focus:ring-2 focus:ring-[#9E5A78]"
              ></textarea>
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Texto del Botón Principal</label>
              <input
                v-model="bloque.contenido.textoBoton"
                type="text"
                class="w-full px-3 py-2 text-xs bg-white border border-[#EADBDE] rounded-xl"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-700 uppercase mb-1">URL de la Imagen de Fondo</label>
              <input
                v-model="bloque.contenido.imagenFondo"
                type="url"
                placeholder="https://images.unsplash.com/..."
                class="w-full px-3 py-2 text-xs bg-white border border-[#EADBDE] rounded-xl"
              />
            </div>
          </div>
        </div>

        <!-- Bloque Carrusel -->
        <div v-if="bloque.id === 'carrusel'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Título de la Sección</label>
            <input
              v-model="bloque.contenido.titulo"
              type="text"
              class="w-full px-3 py-2 text-xs bg-white border border-[#EADBDE] rounded-xl"
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Subtítulo</label>
            <input
              v-model="bloque.contenido.subtitulo"
              type="text"
              class="w-full px-3 py-2 text-xs bg-white border border-[#EADBDE] rounded-xl"
            />
          </div>
        </div>

        <!-- Bloque Catálogo -->
        <div v-if="bloque.id === 'catalogo'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Título del Catálogo</label>
            <input
              v-model="bloque.contenido.titulo"
              type="text"
              class="w-full px-3 py-2 text-xs bg-white border border-[#EADBDE] rounded-xl font-bold"
            />
          </div>
          <div class="flex items-center gap-6 pt-5">
            <label class="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                v-model="bloque.contenido.mostrarBuscador"
                class="rounded text-[#9E5A78]"
              />
              Activar buscador en tiempo real
            </label>
            <label class="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                v-model="bloque.contenido.mostrarFiltros"
                class="rounded text-[#9E5A78]"
              />
              Filtros por categoría
            </label>
          </div>
        </div>

        <!-- Bloque CTA -->
        <div v-if="bloque.id === 'cta'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Título del CTA</label>
            <input
              v-model="bloque.contenido.titulo"
              type="text"
              class="w-full px-3 py-2 text-xs bg-white border border-[#EADBDE] rounded-xl font-bold"
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Texto del Botón</label>
            <input
              v-model="bloque.contenido.textoBoton"
              type="text"
              class="w-full px-3 py-2 text-xs bg-white border border-[#EADBDE] rounded-xl"
            />
          </div>
          <div class="md:col-span-2">
            <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Descripción de la propuesta</label>
            <textarea
              v-model="bloque.contenido.descripcion"
              rows="2"
              class="w-full px-3 py-2 text-xs bg-white border border-[#EADBDE] rounded-xl"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
