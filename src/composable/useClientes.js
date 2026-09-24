import { ref, onMounted } from 'vue'
import { db } from '../config/firestore.js'
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

export function useClientes() {
  const clientes = ref([])
  const cargando = ref(false)
  const clienteSeleccionado = ref(null)
  const esModalAbierta = ref(false)

  const clientesRef = collection(db, 'clientes')

  // Obtener clientes en tiempo real
  const obtenerClientes = () => {
    cargando.value = true
    const q = query(clientesRef, orderBy('fechaCreacion', 'desc'))
    
    return onSnapshot(q, (snapshot) => {
      clientes.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      cargando.value = false
    }, (error) => {
      console.error('Error obteniendo clientes:', error)
      cargando.value = false
    })
  }

  // Guardar cliente (Crear o Actualizar)
  const guardarCliente = async (datos) => {
    cargando.value = true
    try {
      const payload = {
        nombre: datos.nombre,
        apellido: datos.apellido,
        telefono: datos.telefono,
        correo: datos.correo || '',
        direccion: datos.direccion || '',
        cantidadPedidos: Number(datos.cantidadPedidos) || 0,
      }

      if (clienteSeleccionado.value) {
        // Actualizar
        const clienteDoc = doc(db, 'clientes', clienteSeleccionado.value.id)
        await updateDoc(clienteDoc, payload)
      } else {
        // Crear
        payload.fechaCreacion = serverTimestamp()
        await addDoc(clientesRef, payload)
      }

      cerrarModal()
    } catch (error) {
      console.error('Error al guardar cliente:', error)
      alert('Ocurrió un error al guardar el cliente.')
    } finally {
      cargando.value = false
    }
  }

  // Eliminar cliente
  const eliminarCliente = async (id) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este cliente?')) return

    try {
      await deleteDoc(doc(db, 'clientes', id))
    } catch (error) {
      console.error('Error al eliminar cliente:', error)
      alert('Error al intentar eliminar el cliente.')
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
    return () => unsub()
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
    abrirWhatsApp
  }
}
