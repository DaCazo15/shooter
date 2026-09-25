import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { auth, db } from '../config/firestore'
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'

/**
 * Determina si el modo demo está explícitamente habilitado
 * mediante la variable de entorno VITE_DEMO_MODE=true.
 * Nunca se activa como fallback silencioso.
 */
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true'

/**
 * Verifica si Firebase Auth está correctamente configurado
 * (apiKey presente y objeto auth inicializado).
 */
function isFirebaseConfigured() {
  return !!(auth && auth.app && auth.app.options && auth.app.options.apiKey)
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref({
    uid: '',
    email: '',
    displayName: 'Usuario',
    businessName: 'Mi Negocio',
    bio: '',
    phone: '',
    currency: 'USD',
    currencySymbol: '$',
    avatarUrl: '',
    instagram: '',
    whatsapp: ''
  })

  const isAuthenticated = ref(false)
  const isLoading = ref(false)
  const errorMessage = ref('')

  /** Indica si la sesión actual opera en modo demo */
  const isDemoMode = computed(() => DEMO_MODE)

  // Iniciar sesión con email y contraseña
  const login = async (email, password) => {
    isLoading.value = true
    errorMessage.value = ''
    try {
      if (isFirebaseConfigured()) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        const fbUser = userCredential.user
        user.value = {
          ...user.value,
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName || user.value.displayName
        }
        isAuthenticated.value = true
        return true
      } else if (DEMO_MODE) {
        // Modo demostración explícito (VITE_DEMO_MODE=true)
        console.info('[Auth] Modo demo activado explícitamente. Sesión simulada.')
        user.value = {
          ...user.value,
          uid: 'demo-user-1',
          email: email
        }
        isAuthenticated.value = true
        return true
      } else {
        // Firebase no configurado y modo demo no habilitado → error claro
        throw new Error(
          'Firebase Auth no está configurado correctamente (falta apiKey). ' +
          'Configura las variables de entorno de Firebase o activa el modo demo con VITE_DEMO_MODE=true.'
        )
      }
    } catch (error) {
      console.error('Error de autenticación:', error)
      errorMessage.value = error.message || 'Error al iniciar sesión. Revisa tus credenciales.'
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Iniciar sesión con Google
  const loginWithGoogle = async () => {
    isLoading.value = true
    errorMessage.value = ''
    try {
      if (isFirebaseConfigured()) {
        const provider = new GoogleAuthProvider()
        const result = await signInWithPopup(auth, provider)
        const fbUser = result.user
        user.value = {
          ...user.value,
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName || user.value.displayName,
          avatarUrl: fbUser.photoURL || user.value.avatarUrl
        }
        isAuthenticated.value = true
        return true
      } else if (DEMO_MODE) {
        console.info('[Auth] Modo demo activado explícitamente. Sesión Google simulada.')
        user.value = {
          ...user.value,
          uid: 'demo-user-1',
          email: 'demo@pandibuy.local'
        }
        isAuthenticated.value = true
        return true
      } else {
        throw new Error(
          'Firebase Auth no está configurado correctamente (falta apiKey). ' +
          'Configura las variables de entorno de Firebase o activa el modo demo con VITE_DEMO_MODE=true.'
        )
      }
    } catch (error) {
      console.error('Error de autenticación con Google:', error)
      errorMessage.value = error.message || 'No se pudo iniciar sesión con Google.'
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Cerrar sesión
  const logout = async () => {
    try {
      if (isFirebaseConfigured()) {
        await signOut(auth)
      }
    } catch (e) {
      console.error(e)
    } finally {
      isAuthenticated.value = false
    }
  }

  // Actualizar perfil de usuario
  const updateProfile = async (newData) => {
    user.value = { ...user.value, ...newData }
    try {
      if (db && user.value.uid) {
        await setDoc(doc(db, 'usuarios', user.value.uid), user.value, { merge: true })
      }
    } catch (err) {
      console.warn('Error guardando perfil en Firestore, guardado localmente:', err)
    }
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    isDemoMode,
    errorMessage,
    login,
    loginWithGoogle,
    logout,
    updateProfile
  }
}, {
  persist: true
})
