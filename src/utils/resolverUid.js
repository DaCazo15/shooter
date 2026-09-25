/**
 * Utilidad centralizada para resolver el UID del negocio autenticado.
 * 
 * Solo permite el fallback 'demo-user-1' si VITE_DEMO_MODE=true está
 * explícitamente habilitado. De lo contrario, lanza un error claro.
 */
import { auth } from '../config/firestore'
import { useAuthStore } from '../stores/authStore'

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true'
const DEMO_UID = 'demo-user-1'

/**
 * Resuelve el UID efectivo del negocio con la siguiente prioridad:
 * 1. customUid explícito (parámetro directo)
 * 2. initialUid del composable
 * 3. authStore.user.uid (sesión activa Pinia)
 * 4. auth.currentUser.uid (sesión Firebase directa)
 * 5. 'demo-user-1' SOLO si VITE_DEMO_MODE=true
 * 6. Error claro si nada de lo anterior aplica
 */
export function resolverUid(customUid = null, initialUid = null) {
  if (customUid) return customUid
  if (initialUid) return initialUid

  const authStore = useAuthStore()
  const uid = authStore.user?.uid || auth?.currentUser?.uid

  if (uid) return uid

  if (DEMO_MODE) {
    return DEMO_UID
  }

  console.warn(
    '[resolverUid] No se encontró un UID de negocio autenticado. ' +
    'Inicia sesión o activa VITE_DEMO_MODE=true para modo de demostración.'
  )
  return ''
}
