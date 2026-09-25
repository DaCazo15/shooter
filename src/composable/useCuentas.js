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
  const errorGuardado = ref(null)
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
    if (db) {
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
    } else {
      cargando.value = false
    }
  }

  // Crear o actualizar cuenta
  const guardarCuenta = async ({ id, nombre, moneda, saldoInicial = 0 }) => {
    errorGuardado.value = null
    const user = auth.currentUser
    if (!user) throw new Error('Usuario no autenticado')

    cargando.value = true
    const payload = {
      nombre,
      moneda,
      saldoInicial: parseFloat(saldoInicial) || 0
    }

    try {
      if (db && (!id || !id.startsWith('local_'))) {
        if (id) {
          // Actualización
          const cuentaRef = doc(db, 'cuentas', id)
          await updateDoc(cuentaRef, payload)
        } else {
          // Creación
          await addDoc(collection(db, 'cuentas'), {
            uid: user.uid,
            ...payload,
            saldoActual: parseFloat(saldoInicial) || 0,
            fechaCreacion: serverTimestamp ? serverTimestamp() : new Date().toISOString()
          })
        }
      } else {
        // Modo demo local (db no inicializado o cuenta local)
        if (id) {
          const idx = cuentas.value.findIndex(c => c.id === id)
          if (idx !== -1) cuentas.value[idx] = { ...cuentas.value[idx], ...payload }
        } else {
          cuentas.value.unshift({
            id: `local_${Date.now()}`,
            uid: user.uid,
            ...payload,
            saldoActual: parseFloat(saldoInicial) || 0
          })
        }
      }
    } catch (error) {
      console.error('Error al guardar la cuenta:', error)
      errorGuardado.value = error.message || 'Error al guardar la cuenta en el servidor'
      throw error
    } finally {
      cargando.value = false
    }
  }

  // Eliminar cuenta
  const eliminarCuenta = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta cuenta? Se perderán sus registros.')) return

    errorGuardado.value = null
    cargando.value = true
    try {
      if (db && !id.startsWith('local_')) {
        await deleteDoc(doc(db, 'cuentas', id))
      } else {
        // Modo demo local
        cuentas.value = cuentas.value.filter(c => c.id !== id)
      }
    } catch (error) {
      console.error('Error al eliminar cuenta:', error)
      errorGuardado.value = error.message || 'Error al eliminar la cuenta en el servidor'
      throw error
    } finally {
      cargando.value = false
    }
  }

  return {
    cuentas,
    cargando,
    errorGuardado,
    monedasDisponibles,
    cargarCuentas,
    guardarCuenta,
    eliminarCuenta
  }
}
