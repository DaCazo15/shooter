import { ref, computed } from 'vue'
import { db } from '../config/firestore'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { MODOS_CMD, CONFIG_CMD_INICIAL, limpiarSubdominio } from '../types/cmd.js'

export function useCMD(userId) {
  const cargando = ref(false)
  const guardando = ref(false)
  const modoActual = ref(MODOS_CMD.WEB)

  const config = ref({ ...CONFIG_CMD_INICIAL })

  const urlSubdominio = computed(() => {
    const slug = limpiarSubdominio(config.value.subdominio)
    return slug ? `https://${slug}.tuapp.com` : ''
  })

  const cambiarModo = (nuevoModo) => {
    modoActual.value = nuevoModo
  }

  // Métodos para el CMD Web
  const toggleBloqueWeb = (id) => {
    const b = config.value.bloquesWeb.find(item => item.id === id)
    if (b) b.activo = !b.activo
  }

  const moverBloqueWeb = (index, direccion) => {
    const lista = [...config.value.bloquesWeb]
    const dest = index + direccion
    if (dest < 0 || dest >= lista.length) return
    const temp = lista[index]
    lista[index] = lista[dest]
    lista[dest] = temp
    lista.forEach((item, i) => item.orden = i + 1)
    config.value.bloquesWeb = lista
  }

  // Métodos para el CMD Linktree
  const agregarEnlaceLinktree = () => {
    config.value.linktree.enlaces.push({
      id: Date.now().toString(),
      red: 'custom',
      etiqueta: 'Nuevo Enlace',
      url: '',
      activo: true
    })
  }

  const eliminarEnlaceLinktree = (index) => {
    config.value.linktree.enlaces.splice(index, 1)
  }

  const cargarConfiguracion = async () => {
    if (!userId) return
    cargando.value = true
    try {
      const snap = await getDoc(doc(db, 'sitios_web', userId))
      if (snap.exists()) {
        config.value = { ...config.value, ...snap.data() }
      }
    } catch (err) {
      console.error('Error al cargar CMD:', err)
    } finally {
      cargando.value = false
    }
  }

  const guardarCMD = async () => {
    if (!userId) return
    guardando.value = true
    try {
      await setDoc(doc(db, 'sitios_web', userId), {
        ...config.value,
        subdominioSlug: limpiarSubdominio(config.value.subdominio),
        actualizadoEn: serverTimestamp()
      }, { merge: true })
      alert('¡Configuración del CMD guardada exitosamente!')
    } catch (err) {
      console.error('Error al guardar CMD:', err)
      alert('Ocurrió un error al guardar.')
    } finally {
      guardando.value = false
    }
  }

  return {
    config,
    modoActual,
    MODOS_CMD,
    urlSubdominio,
    cargando,
    guardando,
    cambiarModo,
    toggleBloqueWeb,
    moverBloqueWeb,
    agregarEnlaceLinktree,
    eliminarEnlaceLinktree,
    cargarConfiguracion,
    guardarCMD
  }
}
