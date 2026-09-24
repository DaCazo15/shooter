import { ref } from 'vue'
import { db } from '../config/firestore.js'
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore'

/**
 * Composable para la gestión de inventario de materiales/insumos.
 * Registra stock, costos y unidades de cada material del negocio.
 */
export function useInventario() {
  const materiales = ref([])
  const cargando = ref(false)
  const modalAbierto = ref(false)
  const materialEditar = ref(null)

  const obtenerMateriales = () => {
    cargando.value = true
    const refCol = collection(db, 'inventario')
    return onSnapshot(refCol, (snapshot) => {
      materiales.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      cargando.value = false
    }, (error) => {
      console.error('Error al obtener inventario:', error)
      cargando.value = false
    })
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

  const guardarMaterial = async (datos) => {
    cargando.value = true
    try {
      if (materialEditar.value?.id) {
        const docRef = doc(db, 'inventario', materialEditar.value.id)
        await updateDoc(docRef, {
          nombre: datos.nombre,
          categoria: datos.categoria,
          cantidad: Number(datos.cantidad) || 0,
          unidad: datos.unidad,
          costoUnitario: Number(datos.costoUnitario) || 0,
          stockMinimo: Number(datos.stockMinimo) || 0,
          proveedor: datos.proveedor || '',
          notas: datos.notas || '',
          actualizadoEn: serverTimestamp()
        })
      } else {
        await addDoc(collection(db, 'inventario'), {
          nombre: datos.nombre,
          categoria: datos.categoria,
          cantidad: Number(datos.cantidad) || 0,
          unidad: datos.unidad,
          costoUnitario: Number(datos.costoUnitario) || 0,
          stockMinimo: Number(datos.stockMinimo) || 0,
          proveedor: datos.proveedor || '',
          notas: datos.notas || '',
          creadoEn: serverTimestamp()
        })
      }
      cerrarModal()
    } catch (error) {
      console.error('Error al guardar material:', error)
      alert('Ocurrió un error al guardar el material.')
    } finally {
      cargando.value = false
    }
  }

  const eliminarMaterial = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este material del inventario?')) return

    cargando.value = true
    try {
      await deleteDoc(doc(db, 'inventario', id))
    } catch (error) {
      console.error('Error al eliminar material:', error)
      alert('Error al intentar eliminar.')
    } finally {
      cargando.value = false
    }
  }

  return {
    materiales,
    cargando,
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
