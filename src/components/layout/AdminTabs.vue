<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const navItems = [
  { name: 'dashboard-calculadora', path: '/dashboard/calculadora', label: 'Calculadora de Costos', icon: 'bi bi-calculator-fill' },
  { name: 'dashboard-builder', path: '/dashboard/builder', label: 'CMD Builder', icon: 'bi bi-window-stack' },
  { name: 'dashboard-catalogo', path: '/dashboard/catalogo', label: 'Catálogo', icon: 'bi bi-grid-fill' },
  { name: 'dashboard-inventario', path: '/dashboard/inventario', label: 'Inventario', icon: 'bi bi-box-seam-fill' },
  { name: 'dashboard-cuentas', path: '/dashboard/cuentas', label: 'Cuentas', icon: 'bi bi-wallet2' },
  { name: 'dashboard-clientes', path: '/dashboard/clientes', label: 'Clientes', icon: 'bi bi-people-fill' }
]

const isActive = (item) => {
  return route.name === item.name || route.path.startsWith(item.path)
}
</script>

<template>
  <div class="bg-white border-b border-[#EADBDE] shadow-xs sticky top-16 z-30 overflow-x-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <nav class="flex space-x-2 sm:space-x-4 py-3 min-w-max">
        <router-link
          v-for="item in navItems"
          :key="item.name"
          :to="item.path"
          class="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-150"
          :class="isActive(item) 
            ? 'bg-[#9E5A78] text-white shadow-sm shadow-[#9E5A78]/30 scale-[1.02]' 
            : 'text-gray-600 hover:text-[#9E5A78] hover:bg-[#F7EFE9]'"
        >
          <i :class="item.icon" class="text-sm"></i>
          <span>{{ item.label }}</span>
        </router-link>
      </nav>
    </div>
  </div>
</template>
