import { ref, onMounted } from 'vue'
import { db, auth } from '../config/firestore.js'
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  serverTimestamp, 
  query, 
  orderBy 
} from 'firebase/firestore'
import { useAuthStore } from '../stores/authStore'

/**
 * Composable para la gestión de clientes del negocio.
 * Aislado por subcolección: negocios/{uid}/clientes
 */
export function useClientes(initialUid = null) {
  const clientes = ref([])
  const cargando = ref(false)
  const clienteSeleccionado = ref(null)
  const esModalAbierta = ref(false)
  let listenerUnsubscribe = null

  // Resolver UID efectivo del negocio
  const getUid = (customUid = null) => {
    if (customUid) return customUid
    if (initialUid) return initialUid
    const authStore = useAuthStore()
    return authStore.user?.uid || auth?.currentUser?.uid || 'demo-user-1'
  }

  // Obtener clientes en tiempo real aislados por negocio
  const obtenerClientes = (customUid = null) => {
    if (listenerUnsubscribe) {
      listenerUnsubscribe()
      listenerUnsubscribe = null
    }

    cargando.value = true
    const uid = getUid(customUid)

    try {
      if (db) {
        const subcolRef = collection(db, 'negocios', uid, 'clientes')
        const q = query(subcolRef, orderBy('fechaCreacion', 'desc'))
        
        listenerUnsubscribe = onSnapshot(q, (snapshot) => {
          clientes.value = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          cargando.value = false
        }, (error) => {
          console.warn(`Error escuchando clientes en negocios/${uid}/clientes:`, error)
          // Fallback sin orderBy por índice
          listenerUnsubscribe = onSnapshot(subcolRef, (snap) => {
            clientes.value = snap.docs.map(d => ({ id: d.id, ...d.data() }))
            cargando.value = false
          }, (err) => {
            console.warn('Error fallback clientes:', err)
            cargando.value = false
          })
        })
        return listenerUnsubscribe
      } else {
        cargando.value = false
      }
    } catch (err) {
      console.warn('Error inicializando listener de clientes:', err)
      cargando.value = false
    }
  }

  // Guardar cliente (Crear o Actualizar)
  const guardarCliente = async (datos, customUid = null) => {
    cargando.value = true
    const uid = getUid(customUid)

    try {
      const payload = {
        nombre: datos.nombre,
        apellido: datos.apellido || '',
        telefono: datos.telefono,
        correo: datos.correo || '',
        direccion: datos.direccion || '',
        cantidadPedidos: Number(datos.cantidadPedidos) || 0,
      }

      if (db) {
        if (clienteSeleccionado.value?.id && !clienteSeleccionado.value.id.startsWith('local_')) {
          const clienteDoc = doc(db, 'negocios', uid, 'clientes', clienteSeleccionado.value.id)
          await updateDoc(clienteDoc, {
            ...payload,
            actualizadoEn: serverTimestamp ? serverTimestamp() : new Date().toISOString()
          })
        } else {
          const subcolRef = collection(db, 'negocios', uid, 'clientes')
          await addDoc(subcolRef, {
            ...payload,
            fechaCreacion: serverTimestamp ? serverTimestamp() : new Date().toISOString()
          })
        }
      } else {
        // Modo demo local
        if (clienteSeleccionado.value?.id) {
          const idx = clientes.value.findIndex(c => c.id === clienteSeleccionado.value.id)
          if (idx !== -1) clientes.value[idx] = { ...clienteSeleccionado.value, ...payload }
        } else {
          clientes.value.unshift({ id: `local_${Date.now()}`, ...payload })
        }
      }

      cerrarModal()
    } catch (error) {
      console.warn('Error al guardar cliente en Firestore, guardando local:', error)
      if (clienteSeleccionado.value?.id) {
        const idx = clientes.value.findIndex(c => c.id === clienteSeleccionado.value.id)
        if (idx !== -1) clientes.value[idx] = { ...clienteSeleccionado.value, ...datos }
      } else {
        clientes.value.unshift({ id: `local_${Date.now()}`, ...datos })
      }
      cerrarModal()
    } finally {
      cargando.value = false
    }
  }

  // Eliminar cliente
  const eliminarCliente = async (id, customUid = null) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este cliente?')) return

    cargando.value = true
    const uid = getUid(customUid)

    try {
      if (db && !id.startsWith('local_')) {
        await deleteDoc(doc(db, 'negocios', uid, 'clientes', id))
      } else {
        clientes.value = clientes.value.filter(c => c.id !== id)
      }
    } catch (error) {
      console.warn('Error al eliminar cliente de Firestore:', error)
      clientes.value = clientes.value.filter(c => c.id !== id)
    } finally {
      cargando.value = false
    }
  }

  // Abrir chat de WhatsApp
  const abrirWhatsApp = (telefono) => {
    if (!telefono) return
    const numeroLimpio = telefono.replace(/\D/g, '')
    window.open(`https://wa.me/${numeroLimpio}`, '_blank')
  }

  // Control de la Modal
  const abrirModalCrear = () => {
    clienteSeleccionado.value = null
    esModalAbierta.value = true
  }

  const abrirModalEditar = (cliente) => {
    clienteSeleccionado.value = cliente
    esModalAbierta.value = true
  }

  const cerrarModal = () => {
    clienteSeleccionado.value = null
    esModalAbierta.value = false
  }

  onMounted(() => {
    const unsub = obtenerClientes()
    return () => {
      if (unsub) unsub()
    }
  })

  return {
    clientes,
    cargando,
    esModalAbierta,
    clienteSeleccionado,
    abrirModalCrear,
    abrirModalEditar,
    cerrarModal,
    guardarCliente,
    eliminarCliente,
    abrirWhatsApp,
    obtenerClientes
  }
}
