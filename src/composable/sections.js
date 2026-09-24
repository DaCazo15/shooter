import { reactive } from 'vue'

const sectionData = reactive({
  'calculadora': { status: true, titulo: 'Calculadora' },
  'cmd': { status: false, titulo: 'CMD' },
  'catalogo': { status: false, titulo: 'Catalogo' },
  'clientes': { status: false, titulo: 'Clientes' },
  'inventario': { status: false, titulo: 'Inventario' },
  'cuentas': { status: false, titulo: 'Cuentas' }
})

export function useSections() {
  const setActiveSection = (keyName) => {
    if (!sectionData[keyName]) return
    Object.keys(sectionData).forEach(key => {
      sectionData[key].status = false
    })
    sectionData[keyName].status = true
  }

  return {
    sectionData,
    setActiveSection
  }
}
