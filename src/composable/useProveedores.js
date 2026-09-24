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

export function useProveedores() {
  const proveedores = ref([])
  const cargando = ref(false)
  const modalAbierto = ref(false)
  const proveedorEditar = ref(null)

  // Escuchar cambios en tiempo real
  const obtenerProveedores = () => {
    cargando.value = true
    const refCol = collection(db, 'proveedores')
    return onSnapshot(refCol, (snapshot) => {
      proveedores.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      cargando.value = false
    }, (error) => {
      console.error('Error al obtener proveedores:', error)
      cargando.value = false
    })
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
  const guardarProveedor = async (datos) => {
    cargando.value = true
    try {
      if (proveedorEditar.value?.id) {
        // Actualizar
        const docRef = doc(db, 'proveedores', proveedorEditar.value.id)
        await updateDoc(docRef, {
          nombre: datos.nombre,
          apellido: datos.apellido,
          telefono: datos.telefono,
          correo: datos.correo,
          mercancia: datos.mercancia,
          actualizadoEn: serverTimestamp()
        })
      } else {
        // Crear
        await addDoc(collection(db, 'proveedores'), {
          nombre: datos.nombre,
          apellido: datos.apellido,
          telefono: datos.telefono,
          correo: datos.correo,
          mercancia: datos.mercancia,
          creadoEn: serverTimestamp()
        })
      }
      cerrarModal()
    } catch (error) {
      console.error('Error al guardar proveedor:', error)
      alert('Ocurrió un error al intentar guardar.')
    } finally {
      cargando.value = false
    }
  }

  // Eliminar
  const eliminarProveedor = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este proveedor?')) return

    cargando.value = true
    try {
      await deleteDoc(doc(db, 'proveedores', id))
    } catch (error) {
      console.error('Error al eliminar proveedor:', error)
      alert('Error al intentar eliminar.')
    } finally {
      cargando.value = false
    }
  }

  // Utilidad para enlace directo a WhatsApp
  const generarLinkWhatsApp = (telefono, nombre) => {
    const numeroLimpio = telefono.replace(/\D/g, '')
    const mensaje = encodeURIComponent(`Hola ${nombre}, me contacto desde el sistema.`)
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
