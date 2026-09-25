import { ref } from 'vue'
import { db, auth } from '../config/firestore.js'
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore'
import { useAuthStore } from '../stores/authStore'
import { resolverUid } from '../utils/resolverUid'

/**
 * Composable para la gestión de inventario de materiales/insumos.
 * Aislado por subcolección: negocios/{uid}/inventario
 */
export function useInventario(initialUid = null) {
  const materiales = ref([])
  const cargando = ref(false)
  const errorGuardado = ref(null)
  const modalAbierto = ref(false)
  const materialEditar = ref(null)
  let listenerUnsubscribe = null

  // Resolver UID efectivo del negocio (demo solo si VITE_DEMO_MODE=true)
  const getUid = (customUid = null) => resolverUid(customUid, initialUid)

  const obtenerMateriales = (customUid = null) => {
    if (listenerUnsubscribe) {
      listenerUnsubscribe()
      listenerUnsubscribe = null
    }

    cargando.value = true
    const uid = getUid(customUid)

    try {
      if (db) {
        const subcolRef = collection(db, 'negocios', uid, 'inventario')
        listenerUnsubscribe = onSnapshot(subcolRef, (snapshot) => {
          materiales.value = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          cargando.value = false
        }, (error) => {
          console.warn(`Error al obtener inventario en negocios/${uid}/inventario:`, error)
          cargando.value = false
        })
        return listenerUnsubscribe
      } else {
        cargando.value = false
      }
    } catch (err) {
      console.warn('Error inicializando listener de inventario:', err)
      cargando.value = false
    }
  }

  const abrirModalCrear = () => {
    materialEditar.value = null
    modalAbierto.value = true
  }

  const abrirModalEditar = (material) => {
    materialEditar.value = { ...material }
    modalAbierto.value = true
  }

  const cerrarModal = () => {
    modalAbierto.value = false
    materialEditar.value = null
  }

  const guardarMaterial = async (datos, customUid = null) => {
    errorGuardado.value = null
    cargando.value = true
    const uid = getUid(customUid)

    const payload = {
      nombre: datos.nombre,
      categoria: datos.categoria,
      cantidad: Number(datos.cantidad) || 0,
      unidad: datos.unidad,
      costoUnitario: Number(datos.costoUnitario) || 0,
      stockMinimo: Number(datos.stockMinimo) || 0,
      proveedor: datos.proveedor || '',
      notas: datos.notas || ''
    }

    try {
      if (db) {
        if (materialEditar.value?.id && !materialEditar.value.id.startsWith('local_')) {
          const docRef = doc(db, 'negocios', uid, 'inventario', materialEditar.value.id)
          await updateDoc(docRef, {
            ...payload,
            actualizadoEn: serverTimestamp ? serverTimestamp() : new Date().toISOString()
          })
        } else {
          const subcolRef = collection(db, 'negocios', uid, 'inventario')
          await addDoc(subcolRef, {
            ...payload,
            creadoEn: serverTimestamp ? serverTimestamp() : new Date().toISOString()
          })
        }
      } else {
        // Modo demo local (db no disponible)
        if (materialEditar.value?.id) {
          const idx = materiales.value.findIndex(m => m.id === materialEditar.value.id)
          if (idx !== -1) materiales.value[idx] = { ...materialEditar.value, ...payload }
        } else {
          materiales.value.unshift({ id: `local_${Date.now()}`, ...payload })
        }
      }
      cerrarModal()
    } catch (error) {
      console.error('Error al guardar material en Firestore:', error)
      errorGuardado.value = error.message || 'Error al guardar el material en el servidor'
      throw error
    } finally {
      cargando.value = false
    }
  }

  const eliminarMaterial = async (id, customUid = null) => {
    if (!confirm('¿Estás seguro de eliminar este material del inventario?')) return

    errorGuardado.value = null
    cargando.value = true
    const uid = getUid(customUid)

    try {
      if (db && !id.startsWith('local_')) {
        const docRef = doc(db, 'negocios', uid, 'inventario', id)
        await deleteDoc(docRef)
      } else {
        // Modo demo local
        materiales.value = materiales.value.filter(m => m.id !== id)
      }
    } catch (error) {
      console.error('Error al eliminar material de Firestore:', error)
      errorGuardado.value = error.message || 'Error al eliminar el material en el servidor'
      throw error
    } finally {
      cargando.value = false
    }
  }

  return {
    materiales,
    cargando,
    errorGuardado,
    modalAbierto,
    materialEditar,
    obtenerMateriales,
    abrirModalCrear,
    abrirModalEditar,
    cerrarModal,
    guardarMaterial,
    eliminarMaterial
  }
}
