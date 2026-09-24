import { ref, computed } from 'vue'
import { formData } from '../components/section/section-calculadora/config/config.js'
import { db } from '../config/firestore.js'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

export function useCalculadora() {
  const items = ref([{ id: Date.now() }])
  const cargando = ref(false)

  const agregarItem = () => {
    items.value.push({ id: Date.now() })
  }

  const eliminarItem = (index) => {
    if (items.value.length > 1) {
      items.value.splice(index, 1)
    }
  }

  // 1. Costo de UNA sola unidad dentro del paquete (Precio / Unidades del paquete)
  const calcularPrecioUnitario = (index) => {
    const precioPaquete = parseFloat(formData.value?.[`precioItem_${index}`]) || 0
    const unidadesPorPaquete = parseFloat(formData.value?.[`cantidadPaquete_${index}`]) || 0

    if (unidadesPorPaquete === 0) return 0
    return precioPaquete / unidadesPorPaquete
  }

  // 2. Subtotal consumido por este ítem (Costo Unitario * Unidades a Usar)
  const calcularSubtotalFila = (index) => {
    const costoUnitario = calcularPrecioUnitario(index)
    const unidadesUsadas = parseFloat(formData.value?.[`cantidadUso_${index}`]) || 0

    return costoUnitario * unidadesUsadas
  }

  // 3. Suma de los subtotales de uso de todos los ítems
  const subtotalGeneral = computed(() => {
    return items.value.reduce((acc, _, index) => {
      return acc + calcularSubtotalFila(index)
    }, 0)
  })

  // 4. Total Final aplicando la cantidad global de producciones y el margen (%)
  const totalFinal = computed(() => {
    const base = subtotalGeneral.value
    const multiplicadorGlobal = parseFloat(formData.value?.cantidad) || 1
    const porcentaje = parseFloat(formData.value?.customPorcentaje) || 0

    const costoInversionBase = base * multiplicadorGlobal
    return costoInversionBase + (costoInversionBase * (porcentaje / 100))
  })

  // Persistencia en Firestore
  const guardarCalculo = async (data) => {
    cargando.value = true

    const itemsProcesados = items.value.map((_, index) => ({
      nombre: data[`nombreItem_${index}`] || '',
      unidadesPorPaquete: parseFloat(data[`cantidadPaquete_${index}`]) || 0,
      unidadesUsadas: parseFloat(data[`cantidadUso_${index}`]) || 0,
      precioPaquete: parseFloat(data[`precioItem_${index}`]) || 0,
      paquetesComprados: parseFloat(data[`cantidadItem_${index}`]) || 0,
      costoUnitario: calcularPrecioUnitario(index),
      subtotalGastoReal: calcularSubtotalFila(index)
    }))

    const documento = {
      cliente: data.nombre || '',
      cantidadProduccion: parseFloat(data.cantidad) || 1,
      porcentajePersonalizado: parseFloat(data.customPorcentaje) || 0,
      subtotalUsoBase: subtotalGeneral.value,
      totalGastoInversion: totalFinal.value,
      items: itemsProcesados,
      fechaCreacion: serverTimestamp()
    }

    try {
      const docRef = await addDoc(collection(db, 'calculos'), documento)
      console.log('Documento guardado con ID:', docRef.id)
      alert('¡Cálculo de inversión guardado exitosamente!')
    } catch (error) {
      console.error('Error al guardar en Firestore:', error)
      alert('Error al guardar en la base de datos.')
    } finally {
      cargando.value = false
    }
  }

  return {
    items,
    cargando,
    formData,
    totalFinal,
    subtotalGeneral,
    agregarItem,
    eliminarItem,
    calcularPrecioUnitario,
    calcularSubtotalFila,
    guardarCalculo
  }
}
