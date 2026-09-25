import { ref, computed } from 'vue'
import { db } from '../config/firestore.js'
import { collection, addDoc, getDocs, orderBy, query, limit, serverTimestamp } from 'firebase/firestore'

export function useCalculadora() {
  const nombreProyecto = ref('')
  const cantidadProduccion = ref(1)
  const margenGanancia = ref(40) // 40% de margen por defecto
  const horasTrabajo = ref(1.5)
  const precioHora = ref(8)
  const costoEmpaqueEnvio = ref(2.5)

  const items = ref([
    {
      id: 1,
      nombre: 'Materia prima base / Tela / Insumo',
      precioPaquete: 25,
      unidadesPaquete: 10,
      cantidadUso: 1
    }
  ])

  const historial = ref([])
  const cargando = ref(false)
  const guardando = ref(false)
  const errorGuardado = ref(null)

  const agregarItem = () => {
    items.value.push({
      id: Date.now(),
      nombre: '',
      precioPaquete: 0,
      unidadesPaquete: 1,
      cantidadUso: 1
    })
  }

  const eliminarItem = (index) => {
    if (items.value.length > 1) {
      items.value.splice(index, 1)
    }
  }

  // Costo unitario de un solo insumo
  const calcularCostoUnitario = (item) => {
    const precio = parseFloat(item.precioPaquete) || 0
    const unidades = parseFloat(item.unidadesPaquete) || 1
    if (unidades <= 0) return 0
    return precio / unidades
  }

  // Costo del insumo para una sola unidad producida
  const calcularSubtotalItem = (item) => {
    const costoUnit = calcularCostoUnitario(item)
    const uso = parseFloat(item.cantidadUso) || 0
    return costoUnit * uso
  }

  // Costo total de materiales por unidad producida
  const costoMaterialesUnitario = computed(() => {
    return items.value.reduce((acc, item) => acc + calcularSubtotalItem(item), 0)
  })

  // Costo de mano de obra por unidad producida
  const costoManoObraUnitario = computed(() => {
    const horas = parseFloat(horasTrabajo.value) || 0
    const tarifa = parseFloat(precioHora.value) || 0
    const cant = parseFloat(cantidadProduccion.value) || 1
    return (horas * tarifa) / cant
  })

  // Costo de empaque y gastos indirectos por unidad
  const costoIndirectoUnitario = computed(() => {
    return parseFloat(costoEmpaqueEnvio.value) || 0
  })

  // Costo de Producción Total por Unidad
  const costoTotalUnitario = computed(() => {
    return costoMaterialesUnitario.value + costoManoObraUnitario.value + costoIndirectoUnitario.value
  })

  // Costo Total del Lote (para toda la cantidad de producción)
  const costoTotalLote = computed(() => {
    const cant = parseFloat(cantidadProduccion.value) || 1
    return costoTotalUnitario.value * cant
  })

  // Precio de Venta al Público (PVP) Sugerido por Unidad con margen aplicado
  const pvpSugeridoUnitario = computed(() => {
    const costo = costoTotalUnitario.value
    const margen = parseFloat(margenGanancia.value) || 0
    if (margen >= 100) return costo * 2
    return costo * (1 + (margen / 100))
  })

  // Ganancia Neta por Unidad
  const gananciaNetaUnitaria = computed(() => {
    return pvpSugeridoUnitario.value - costoTotalUnitario.value
  })

  // Ganancia Total Esperada por el Lote Completo
  const gananciaTotalLote = computed(() => {
    const cant = parseFloat(cantidadProduccion.value) || 1
    return gananciaNetaUnitaria.value * cant
  })

  // Total Facturación Esperada
  const facturacionTotalLote = computed(() => {
    const cant = parseFloat(cantidadProduccion.value) || 1
    return pvpSugeridoUnitario.value * cant
  })

  // Guardar cálculo
  const guardarCalculo = async () => {
    if (!nombreProyecto.value) {
      nombreProyecto.value = 'Presupuesto ' + new Date().toLocaleDateString()
    }
    errorGuardado.value = null
    guardando.value = true

    const calculoDoc = {
      nombre: nombreProyecto.value,
      cantidadProduccion: parseFloat(cantidadProduccion.value) || 1,
      margenGanancia: parseFloat(margenGanancia.value) || 0,
      horasTrabajo: parseFloat(horasTrabajo.value) || 0,
      precioHora: parseFloat(precioHora.value) || 0,
      costoEmpaqueEnvio: parseFloat(costoEmpaqueEnvio.value) || 0,
      costoMaterialesUnitario: costoMaterialesUnitario.value,
      costoManoObraUnitario: costoManoObraUnitario.value,
      costoTotalUnitario: costoTotalUnitario.value,
      costoTotalLote: costoTotalLote.value,
      pvpSugeridoUnitario: pvpSugeridoUnitario.value,
      gananciaNetaUnitaria: gananciaNetaUnitaria.value,
      gananciaTotalLote: gananciaTotalLote.value,
      items: items.value.map(i => ({
        nombre: i.nombre,
        precioPaquete: parseFloat(i.precioPaquete) || 0,
        unidadesPaquete: parseFloat(i.unidadesPaquete) || 1,
        cantidadUso: parseFloat(i.cantidadUso) || 0,
        costoCalculado: calcularSubtotalItem(i)
      })),
      fecha: new Date().toISOString()
    }

    try {
      if (db) {
        await addDoc(collection(db, 'calculos'), {
          ...calculoDoc,
          fechaServidor: serverTimestamp ? serverTimestamp() : new Date().toISOString()
        })
      } else {
        // Modo demo local
        historial.value.unshift({ id: Date.now(), ...calculoDoc })
      }
      return true
    } catch (e) {
      console.error('Error al guardar cálculo en Firestore:', e)
      errorGuardado.value = e.message || 'Error al guardar el cálculo en el servidor'
      throw e
    } finally {
      guardando.value = false
    }
  }

  const cargarHistorial = async () => {
    cargando.value = true
    try {
      if (db) {
        const q = query(collection(db, 'calculos'), orderBy('fechaServidor', 'desc'), limit(10))
        const snap = await getDocs(q)
        historial.value = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      }
    } catch (e) {
      console.warn('No se pudo cargar historial de Firestore:', e)
    } finally {
      cargando.value = false
    }
  }

  return {
    nombreProyecto,
    cantidadProduccion,
    margenGanancia,
    horasTrabajo,
    precioHora,
    costoEmpaqueEnvio,
    items,
    historial,
    cargando,
    guardando,
    errorGuardado,
    costoMaterialesUnitario,
    costoManoObraUnitario,
    costoIndirectoUnitario,
    costoTotalUnitario,
    costoTotalLote,
    pvpSugeridoUnitario,
    gananciaNetaUnitaria,
    gananciaTotalLote,
    facturacionTotalLote,
    agregarItem,
    eliminarItem,
    calcularCostoUnitario,
    calcularSubtotalItem,
    guardarCalculo,
    cargarHistorial
  }
}
