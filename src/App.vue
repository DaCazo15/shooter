<script setup>
import NavComponent from './components/NavComponent.vue'
import ToolsComponent from './components/ToolsComponent.vue'
import SectionComponent from './components/SectionComponent.vue'
import { useSections } from './composable/sections.js'

const { sectionData, setActiveSection } = useSections()
</script>

<template>
  <div class="flex flex-col min-h-screen bg-gray-100">
    <NavComponent title="My App" />
    <div class="p-4">
      <ToolsComponent @nombre="setActiveSection" />
    </div>
    <div>
      <SectionComponent :section="sectionData" />
    </div>
  </div>
</template>
