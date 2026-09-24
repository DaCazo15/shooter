import { ref, computed } from 'vue'
import { db } from '../config/firestore'
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore'

// Estado reactivo compartido
const catalogo = ref([])
const cargando = ref(false)
let listenerUnsubscribe = null

export function useCatalogo() {
  // Cargar catálogo en tiempo real con Firestore
  const iniciarEscuchaCatalogo = () => {
    cargando.value = true
    try {
      if (db) {
        const q = query(collection(db, 'catalogo'), orderBy('fechaCreacion', 'desc'))
        listenerUnsubscribe = onSnapshot(
          q,
          (snapshot) => {
            catalogo.value = snapshot.docs.map((d) => ({
              id: d.id,
              ...d.data()
            }))
            cargando.value = false
          },
          (error) => {
            console.warn('Firestore offline o sin conexión en catálogo:', error)
            cargando.value = false
          }
        )
      } else {
        cargando.value = false
      }
    } catch (err) {
      console.warn('Error inicializando listener de catálogo:', err)
      cargando.value = false
    }
  }

  const detenerEscucha = () => {
    if (listenerUnsubscribe) {
      listenerUnsubscribe()
      listenerUnsubscribe = null
    }
  }

  // Agregar producto
  const agregarProducto = async (producto) => {
    const payload = {
      titulo: producto.titulo || 'Sin Título',
      categoria: producto.categoria || 'General',
      descripcion: producto.descripcion || '',
      imagen: producto.imagen || '',
      precio: parseFloat(producto.precio) || 0,
      costo: parseFloat(producto.costo) || 0,
      stock: parseInt(producto.stock, 10) || 0,
      destacado: !!producto.destacado,
      fechaCreacion: serverTimestamp ? serverTimestamp() : new Date().toISOString()
    }

    try {
      if (db) {
        const docRef = await addDoc(collection(db, 'catalogo'), payload)
        return { id: docRef.id, ...payload }
      } else {
        const localItem = { id: `local_${Date.now()}`, ...payload }
        catalogo.value.unshift(localItem)
        return localItem
      }
    } catch (e) {
      console.warn('Guardado en Firestore no disponible, guardando local:', e)
      const localItem = { id: `local_${Date.now()}`, ...payload }
      catalogo.value.unshift(localItem)
      return localItem
    }
  }

  // Actualizar producto
  const actualizarProducto = async (id, datosActualizados) => {
    const payload = {
      ...datosActualizados,
      precio: parseFloat(datosActualizados.precio) || 0,
      costo: parseFloat(datosActualizados.costo) || 0,
      stock: parseInt(datosActualizados.stock, 10) || 0
    }

    try {
      if (db && !id.startsWith('local_')) {
        await updateDoc(doc(db, 'catalogo', id), payload)
      } else {
        const idx = catalogo.value.findIndex(p => p.id === id)
        if (idx !== -1) {
          catalogo.value[idx] = { ...catalogo.value[idx], ...payload }
        }
      }
    } catch (e) {
      console.warn('Error actualizando producto:', e)
      const idx = catalogo.value.findIndex(p => p.id === id)
      if (idx !== -1) {
        catalogo.value[idx] = { ...catalogo.value[idx], ...payload }
      }
    }
  }

  // Eliminar producto
  const eliminarProducto = async (id) => {
    try {
      if (db && !id.startsWith('local_')) {
        await deleteDoc(doc(db, 'catalogo', id))
      } else {
        catalogo.value = catalogo.value.filter(p => p.id !== id)
      }
    } catch (e) {
      console.warn('Error eliminando producto:', e)
      catalogo.value = catalogo.value.filter(p => p.id !== id)
    }
  }

  // Métricas financieras calculadas sobre el catálogo completo
  const metricasCatalogo = computed(() => {
    const totalItems = catalogo.value.length
    
    // Valor total en venta (Precio * Stock)
    const valorTotalVenta = catalogo.value.reduce((acc, p) => {
      const stock = (p.stock && p.stock > 0) ? p.stock : 1
      return acc + ((parseFloat(p.precio) || 0) * stock)
    }, 0)

    // Costo total de inversión (Costo * Stock)
    const costoTotalInversion = catalogo.value.reduce((acc, p) => {
      const stock = (p.stock && p.stock > 0) ? p.stock : 1
      return acc + ((parseFloat(p.costo) || 0) * stock)
    }, 0)

    // Ganancia proyectada
    const gananciaProyectada = valorTotalVenta - costoTotalInversion

    // Margen global del catálogo (%)
    const margenGlobal = valorTotalVenta > 0
      ? ((gananciaProyectada / valorTotalVenta) * 100)
      : 0

    return {
      totalItems,
      valorTotalVenta,
      costoTotalInversion,
      gananciaProyectada,
      margenGlobal
    }
  })

  return {
    catalogo,
    cargando,
    metricasCatalogo,
    iniciarEscuchaCatalogo,
    detenerEscucha,
    agregarProducto,
    actualizarProducto,
    eliminarProducto
  }
}
