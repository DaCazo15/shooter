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

export function useProveedores(initialUid = null) {
  const proveedores = ref([])
  const cargando = ref(false)
  const modalAbierto = ref(false)
  const proveedorEditar = ref(null)
  let listenerUnsubscribe = null

  // Resolver UID efectivo del negocio
  const getUid = (customUid = null) => {
    if (customUid) return customUid
    if (initialUid) return initialUid
    const authStore = useAuthStore()
    return authStore.user?.uid || auth?.currentUser?.uid || 'demo-user-1'
  }

  // Escuchar cambios en tiempo real
  const obtenerProveedores = (customUid = null) => {
    if (listenerUnsubscribe) {
      listenerUnsubscribe()
      listenerUnsubscribe = null
    }

    cargando.value = true
    const uid = getUid(customUid)

    try {
      if (db) {
        const subcolRef = collection(db, 'negocios', uid, 'proveedores')
        listenerUnsubscribe = onSnapshot(subcolRef, (snapshot) => {
          proveedores.value = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          cargando.value = false
        }, (error) => {
          console.warn(`Error al obtener proveedores en negocios/${uid}/proveedores:`, error)
          cargando.value = false
        })
        return listenerUnsubscribe
      } else {
        cargando.value = false
      }
    } catch (err) {
      console.warn('Error inicializando listener de proveedores:', err)
      cargando.value = false
    }
  }

  const abrirModalCrear = () => {
    proveedorEditar.value = null
    modalAbierto.value = true
  }

  const abrirModalEditar = (proveedor) => {
    proveedorEditar.value = { ...proveedor }
    modalAbierto.value = true
  }

  const cerrarModal = () => {
    modalAbierto.value = false
    proveedorEditar.value = null
  }

  // Guardar (Crear o Actualizar)
  const guardarProveedor = async (datos, customUid = null) => {
    cargando.value = true
    const uid = getUid(customUid)

    const payload = {
      nombre: datos.nombre,
      apellido: datos.apellido || '',
      telefono: datos.telefono,
      correo: datos.correo || '',
      mercancia: datos.mercancia || ''
    }

    try {
      if (db) {
        if (proveedorEditar.value?.id && !proveedorEditar.value.id.startsWith('local_')) {
          // Actualizar
          const docRef = doc(db, 'negocios', uid, 'proveedores', proveedorEditar.value.id)
          await updateDoc(docRef, {
            ...payload,
            actualizadoEn: serverTimestamp ? serverTimestamp() : new Date().toISOString()
          })
        } else {
          // Crear
          const subcolRef = collection(db, 'negocios', uid, 'proveedores')
          await addDoc(subcolRef, {
            ...payload,
            creadoEn: serverTimestamp ? serverTimestamp() : new Date().toISOString()
          })
        }
      } else {
        // Demo local
        if (proveedorEditar.value?.id) {
          const idx = proveedores.value.findIndex(p => p.id === proveedorEditar.value.id)
          if (idx !== -1) proveedores.value[idx] = { ...proveedorEditar.value, ...payload }
        } else {
          proveedores.value.unshift({ id: `local_${Date.now()}`, ...payload })
        }
      }
      cerrarModal()
    } catch (error) {
      console.warn('Error al guardar proveedor en Firestore, guardando local:', error)
      if (proveedorEditar.value?.id) {
        const idx = proveedores.value.findIndex(p => p.id === proveedorEditar.value.id)
        if (idx !== -1) proveedores.value[idx] = { ...proveedorEditar.value, ...payload }
      } else {
        proveedores.value.unshift({ id: `local_${Date.now()}`, ...payload })
      }
      cerrarModal()
    } finally {
      cargando.value = false
    }
  }

  // Eliminar
  const eliminarProveedor = async (id, customUid = null) => {
    if (!confirm('¿Estás seguro de eliminar este proveedor?')) return

    cargando.value = true
    const uid = getUid(customUid)

    try {
      if (db && !id.startsWith('local_')) {
        const docRef = doc(db, 'negocios', uid, 'proveedores', id)
        await deleteDoc(docRef)
      } else {
        proveedores.value = proveedores.value.filter(p => p.id !== id)
      }
    } catch (error) {
      console.warn('Error al eliminar proveedor de Firestore:', error)
      proveedores.value = proveedores.value.filter(p => p.id !== id)
    } finally {
      cargando.value = false
    }
  }

  // Utilidad para enlace directo a WhatsApp
  const generarLinkWhatsApp = (telefono, nombre) => {
    const numeroLimpio = (telefono || '').replace(/\D/g, '')
    const mensaje = encodeURIComponent(`Hola ${nombre || ''}, me contacto desde el sistema.`)
    return `https://wa.me/${numeroLimpio}?text=${mensaje}`
  }

  return {
    proveedores,
    cargando,
    modalAbierto,
    proveedorEditar,
    obtenerProveedores,
    abrirModalCrear,
    abrirModalEditar,
    cerrarModal,
    guardarProveedor,
    eliminarProveedor,
    generarLinkWhatsApp
  }
}
