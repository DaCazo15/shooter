import { ref, computed } from 'vue'
import { db } from '../config/firestore.js'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'

export function useCMD(userId) {
  const cargando = ref(false)
  const guardando = ref(false)

  // Configuración base de la app web del usuario
  const configSitio = ref({
    subdominio: '',
    tituloSitio: '',
    descripcion: '',
    // Enlaces de redes sociales (Linktree)
    redes: {
      whatsapp: '',
      instagram: '',
      facebook: '',
      telegram: '',
      web: ''
    },
    // Secciones / Bloques del MVP
    bloques: [
      { id: 'cinta', tipo: 'Cinta Informativa', activo: true, orden: 1, contenido: { texto: '¡Envíos gratis a partir de $50!' } },
      { id: 'hero', tipo: 'Hero Principal', activo: true, orden: 2, contenido: { titulo: 'Bienvenidos a mi Tienda', subtitulo: 'Los mejores productos al mejor precio', imagenUrl: '' } },
      { id: 'carrusel', tipo: 'Carrusel de Productos', activo: true, orden: 3, contenido: { limiteItems: 6 } },
      { id: 'catalogo', tipo: 'Catálogo de Mercancía', activo: true, orden: 4, contenido: { mostrarFiltros: true } },
      { id: 'cta', tipo: 'Call To Action', activo: true, orden: 5, contenido: { titulo: '¿Tienes dudas?', textoBoton: 'Contactar por WhatsApp' } },
      { id: 'linktree', tipo: 'Sección Linktree', activo: true, orden: 6, contenido: { mostrarIconos: true } }
    ]
  })

  // URL final del subdominio
  const urlSubdominio = computed(() => {
    if (!configSitio.value.subdominio) return ''
    const slug = configSitio.value.subdominio.toLowerCase().trim().replace(/[^a-z0-9-]/g, '')
    return `https://${slug}.tuapp.com`
  })

  // Cargar configuración existente desde Firestore
  const cargarConfiguracion = async () => {
    if (!userId) return
    cargando.value = true
    try {
      const docRef = doc(db, 'sitios_web', userId)
      const snap = await getDoc(docRef)
      if (snap.exists()) {
        configSitio.value = { ...configSitio.value, ...snap.data() }
      }
    } catch (error) {
      console.error('Error al cargar la configuración CMD:', error)
    } finally {
      cargando.value = false
    }
  }

  // Activar / Desactivar bloque
  const toggleBloque = (id) => {
    const bloque = configSitio.value.bloques.find(b => b.id === id)
    if (bloque) bloque.activo = !bloque.activo
  }

  // Reordenar bloques
  const moverBloque = (index, direccion) => {
    const nuevosBloques = [...configSitio.value.bloques]
    const objetivo = index + direccion
    if (objetivo < 0 || objetivo >= nuevosBloques.length) return

    const temp = nuevosBloques[index]
    nuevosBloques[index] = nuevosBloques[objetivo]
    nuevosBloques[objetivo] = temp

    // Actualizar propiedad de orden
    nuevosBloques.forEach((b, i) => b.orden = i + 1)
    configSitio.value.bloques = nuevosBloques
  }

  // Guardar configuración completa en Firestore
  const guardarSitio = async () => {
    if (!userId) return
    guardando.value = true
    try {
      const docRef = doc(db, 'sitios_web', userId)
      await setDoc(docRef, {
        ...configSitio.value,
        subdominioSlug: configSitio.value.subdominio.toLowerCase().trim().replace(/[^a-z0-9-]/g, ''),
        actualizadoEn: serverTimestamp()
      }, { merge: true })
      alert('¡Configuración de tu Web App guardada correctamente!')
    } catch (error) {
      console.error('Error al guardar el sitio:', error)
      alert('Error al guardar los cambios.')
    } finally {
      guardando.value = false
    }
  }

  return {
    configSitio,
    urlSubdominio,
    cargando,
    guardando,
    cargarConfiguracion,
    toggleBloque,
    moverBloque,
    guardarSitio
  }
}
