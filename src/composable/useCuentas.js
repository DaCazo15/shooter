import { ref, computed } from 'vue'
import { db } from '../config/firestore.js'
import { getAuth } from 'firebase/auth'
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore'

export function useCuentas() {
  const cuentas = ref([])
  const cargando = ref(false)
  const auth = getAuth()

  // Monedas soportadas por defecto
  const monedasDisponibles = [
    { label: 'Dólar ($)', value: 'USD' },
    { label: 'Bolívar (Bs.)', value: 'VES' },
    { label: 'Euro (€)', value: 'EUR' }
  ]

  // Escuchar cuentas en tiempo real filtradas por usuario
  const cargarCuentas = () => {
    const user = auth.currentUser
    if (!user) return

    cargando.value = true
    const q = query(collection(db, 'cuentas'), where('uid', '==', user.uid))

    return onSnapshot(q, (snapshot) => {
      cuentas.value = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data()
      }))
      cargando.value = false
    }, (error) => {
      console.error('Error escuchando cuentas:', error)
      cargando.value = false
    })
  }

  // Crear o actualizar cuenta
  const guardarCuenta = async ({ id, nombre, moneda, saldoInicial = 0 }) => {
    const user = auth.currentUser
    if (!user) throw new Error('Usuario no autenticado')

    cargando.value = true
    try {
      if (id) {
        // Actualización
        const cuentaRef = doc(db, 'cuentas', id)
        await updateDoc(cuentaRef, {
          nombre,
          moneda,
          saldoInicial: parseFloat(saldoInicial) || 0
        })
      } else {
        // Creación
        await addDoc(collection(db, 'cuentas'), {
          uid: user.uid,
          nombre,
          moneda,
          saldoInicial: parseFloat(saldoInicial) || 0,
          saldoActual: parseFloat(saldoInicial) || 0,
          fechaCreacion: serverTimestamp()
        })
      }
    } catch (error) {
      console.error('Error al guardar la cuenta:', error)
      throw error
    } finally {
      cargando.value = false
    }
  }

  // Eliminar cuenta
  const eliminarCuenta = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta cuenta? Se perderán sus registros.')) return

    cargando.value = true
    try {
      await deleteDoc(doc(db, 'cuentas', id))
    } catch (error) {
      console.error('Error al eliminar cuenta:', error)
      alert('Error al eliminar la cuenta')
    } finally {
      cargando.value = false
    }
  }

  return {
    cuentas,
    cargando,
    monedasDisponibles,
    cargarCuentas,
    guardarCuenta,
    eliminarCuenta
  }
}
