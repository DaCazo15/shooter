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

  // Iniciar sesión con email y contraseña
  const login = async (email, password) => {
    isLoading.value = true
    errorMessage.value = ''
    try {
      if (auth && auth.app.options.apiKey) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        const fbUser = userCredential.user
        user.value = {
          ...user.value,
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName || user.value.displayName
        }
      } else {
        // Modo demostración offline/local
        user.value.email = email
      }
      isAuthenticated.value = true
      return true
    } catch (error) {
      console.warn('Firebase auth error, usando fallback seguro:', error)
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
      if (auth && auth.app.options.apiKey) {
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
      }
      isAuthenticated.value = true
      return true
    } catch (error) {
      console.warn('Google auth error:', error)
      errorMessage.value = error.message || 'No se pudo iniciar sesión con Google.'
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Cerrar sesión
  const logout = async () => {
    try {
      if (auth && auth.app.options.apiKey) {
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
    errorMessage,
    login,
    loginWithGoogle,
    logout,
    updateProfile
  }
}, {
  persist: true
})
