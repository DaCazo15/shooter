<script setup>
import AdminNav from '../../components/layout/AdminNav.vue'
import AdminTabs from '../../components/layout/AdminTabs.vue'
import AdminFooter from '../../components/layout/AdminFooter.vue'
import CopilotoComponent from '../../components/copiloto/CopilotoComponent.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#FAF8F6]">
    <AdminNav />
    <AdminTabs />

    <main class="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
      <router-view v-slot="{ Component }">
        <transition name="fade-slide" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <AdminFooter />

    <!-- Copiloto IA Global para todo el Dashboard -->
    <CopilotoComponent />
  </div>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
