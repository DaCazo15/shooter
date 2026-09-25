import { ref, computed } from 'vue'
import { db, auth } from '../config/firestore'
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
import { useAuthStore } from '../stores/authStore'
import { resolverUid } from '../utils/resolverUid'

export function useCatalogo(initialUid = null) {
  const catalogo = ref([])
  const cargando = ref(false)
  const errorGuardado = ref(null)
  let listenerUnsubscribe = null

  // Resolver UID efectivo del negocio (demo solo si VITE_DEMO_MODE=true)
  const getUid = (customUid = null) => resolverUid(customUid, initialUid)

  // Cargar catálogo en tiempo real aislado por subcolección: negocios/{uid}/catalogo
  const iniciarEscuchaCatalogo = (customUid = null) => {
    detenerEscucha()
    cargando.value = true
    const uid = getUid(customUid)

    try {
      if (db) {
        const subcolRef = collection(db, 'negocios', uid, 'catalogo')
        const q = query(subcolRef, orderBy('fechaCreacion', 'desc'))
        
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
            console.warn(`Firestore offline o sin índice en negocios/${uid}/catalogo:`, error)
            // Fallback si falla el orderBy por índice
            listenerUnsubscribe = onSnapshot(
              subcolRef,
              (snap) => {
                catalogo.value = snap.docs.map((d) => ({
                  id: d.id,
                  ...d.data()
                }))
                cargando.value = false
              },
              (errFallback) => {
                console.warn('Error en fallback de catálogo:', errFallback)
                cargando.value = false
              }
            )
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

  // Agregar producto a negocios/{uid}/catalogo
  const agregarProducto = async (producto, customUid = null) => {
    errorGuardado.value = null
    const uid = getUid(customUid)
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

    if (db) {
      try {
        const subcolRef = collection(db, 'negocios', uid, 'catalogo')
        const docRef = await addDoc(subcolRef, payload)
        return { id: docRef.id, ...payload }
      } catch (e) {
        console.error('Error guardando producto en Firestore:', e)
        errorGuardado.value = e.message || 'Error al guardar el producto en el servidor'
        throw e
      }
    } else {
      // Modo demo (db no inicializado)
      const localItem = { id: `local_${Date.now()}`, ...payload }
      catalogo.value.unshift(localItem)
      return localItem
    }
  }

  // Actualizar producto en negocios/{uid}/catalogo/{id}
  const actualizarProducto = async (id, datosActualizados, customUid = null) => {
    errorGuardado.value = null
    const uid = getUid(customUid)
    const payload = {
      ...datosActualizados,
      precio: parseFloat(datosActualizados.precio) || 0,
      costo: parseFloat(datosActualizados.costo) || 0,
      stock: parseInt(datosActualizados.stock, 10) || 0
    }

    if (db && !id.startsWith('local_')) {
      try {
        const docRef = doc(db, 'negocios', uid, 'catalogo', id)
        await updateDoc(docRef, payload)
      } catch (e) {
        console.error('Error actualizando producto en Firestore:', e)
        errorGuardado.value = e.message || 'Error al actualizar el producto en el servidor'
        throw e
      }
    } else {
      // Modo demo (db no inicializado o registro local)
      const idx = catalogo.value.findIndex(p => p.id === id)
      if (idx !== -1) {
        catalogo.value[idx] = { ...catalogo.value[idx], ...payload }
      }
    }
  }

  // Eliminar producto de negocios/{uid}/catalogo/{id}
  const eliminarProducto = async (id, customUid = null) => {
    errorGuardado.value = null
    const uid = getUid(customUid)
    if (db && !id.startsWith('local_')) {
      try {
        const docRef = doc(db, 'negocios', uid, 'catalogo', id)
        await deleteDoc(docRef)
      } catch (e) {
        console.error('Error eliminando producto de Firestore:', e)
        errorGuardado.value = e.message || 'Error al eliminar el producto en el servidor'
        throw e
      }
    } else {
      // Modo demo (db no inicializado o registro local)
      catalogo.value = catalogo.value.filter(p => p.id !== id)
    }
  }

  // Métricas financieras calculadas sobre el catálogo del negocio
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
    errorGuardado,
    metricasCatalogo,
    iniciarEscuchaCatalogo,
    detenerEscucha,
    agregarProducto,
    actualizarProducto,
    eliminarProducto
  }
}
