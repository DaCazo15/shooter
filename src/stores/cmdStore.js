import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db } from '../config/firestore'
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore'

export const DEFAULT_BLOQUES_WEB = [
  {
    id: 'cinta',
    tipo: 'Cinta Superior Informativa',
    icono: 'bi bi-megaphone',
    activo: true,
    orden: 1,
    contenido: {
      texto: 'Envíos a todo el país. Consulta disponibilidad y pedidos personalizados vía WhatsApp.',
      bgColor: '#1F1824',
      textColor: '#FAF8F6',
      link: ''
    }
  },
  {
    id: 'hero',
    tipo: 'Hero Principal (Portada)',
    icono: 'bi bi-stars',
    activo: true,
    orden: 2,
    contenido: {
      titulo: 'Piezas artesanales que cuentan historias',
      subtitulo: 'Diseño exclusivo, acabados de calidad y empaque especial para tus momentos inolvidables.',
      textoBoton: 'Ver Catálogo Exclusivo',
      enlaceBoton: '#catalogo',
      mostrarBotonWhatsApp: true,
      textoWhatsApp: 'Hablar por WhatsApp',
      imagenFondo: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
      overlayOscuro: true
    }
  },
  {
    id: 'carrusel',
    tipo: 'Colección Destacada',
    icono: 'bi bi-grid-1x2',
    activo: true,
    orden: 3,
    contenido: {
      titulo: 'Lo más vendido de la temporada',
      subtitulo: 'Nuestras creaciones favoritas seleccionadas para ti',
      limiteItems: 4
    }
  },
  {
    id: 'catalogo',
    tipo: 'Catálogo de Productos',
    icono: 'bi bi-bag-heart',
    activo: true,
    orden: 4,
    contenido: {
      titulo: 'Explora nuestra colección',
      mostrarFiltros: true,
      mostrarBuscador: true,
      columnas: 3
    }
  },
  {
    id: 'cta',
    tipo: 'Sección de Contacto y Pedidos Especiales',
    icono: 'bi bi-chat-quote',
    activo: true,
    orden: 5,
    contenido: {
      titulo: '¿Buscas un diseño personalizado?',
      descripcion: 'Creamos piezas únicas bajo encargo para eventos especiales, bodas o regalos corporativos.',
      textoBoton: 'Solicitar Cotización',
      enlaceBoton: 'https://wa.me/',
      fondoColor: '#F7EFE9'
    }
  }
]

export const DEFAULT_LINKTREE_ENLACES = [
  {
    id: '1',
    titulo: 'Catálogo de Productos',
    etiqueta: 'Ver Colección Completa',
    url: '#catalogo',
    icono: 'bi bi-bag-heart',
    activo: true,
    destacado: true
  },
  {
    id: '2',
    titulo: 'Atención al Cliente WhatsApp',
    etiqueta: 'Chatear con una Asesora',
    url: 'https://wa.me/',
    icono: 'bi bi-whatsapp',
    activo: true,
    destacado: false
  },
  {
    id: '3',
    titulo: 'Instagram Oficial',
    etiqueta: 'Síguenos en Instagram',
    url: 'https://instagram.com/',
    icono: 'bi bi-instagram',
    activo: true,
    destacado: false
  },
  {
    id: '4',
    titulo: 'TikTok Store',
    etiqueta: 'Mira nuestros procesos en TikTok',
    url: 'https://tiktok.com/',
    icono: 'bi bi-tiktok',
    activo: true,
    destacado: false
  }
]

export const useCmdStore = defineStore('cmd', () => {
  // Modo de edición ('web' | 'linktree')
  const modoActual = ref('web')

  // Identificador del dueño del negocio
  const ownerUid = ref('demo-user-1')

  // Configuración de la Web
  const subdominio = ref('pandibuy')
  const tituloSitio = ref('Pandibuy Atelier')
  const descripcion = ref('Tienda de creaciones y piezas de diseño artesanal.')
  const bloquesWeb = ref([...DEFAULT_BLOQUES_WEB])

  // Configuración del Linktree
  const linktree = ref({
    titulo: 'Pandibuy Atelier',
    bio: 'Joyería y piezas de diseño artesanal hechas con amor.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    colorFondo: '#1F1824',
    colorBoton: '#9E5A78',
    colorTextoBoton: '#FAF8F6',
    estiloBotones: 'rounded-xl',
    enlaces: [...DEFAULT_LINKTREE_ENLACES]
  })

  // Footer Config
  const footerConfig = ref({
    mostrarRedes: true,
    mostrarTerminos: true,
    mostrarPoliticas: true,
    textoCopyright: '© 2026 Pandibuy Atelier. Todos los derechos reservados.'
  })

  const cargando = ref(false)
  const guardando = ref(false)

  // Acciones
  const cambiarModo = (modo) => {
    modoActual.value = modo
  }

  const toggleBloqueWeb = (id) => {
    const bloque = bloquesWeb.value.find(b => b.id === id)
    if (bloque) bloque.activo = !bloque.activo
  }

  const moverBloqueWeb = (indiceOrigen, direccion) => {
    const nuevoIndice = indiceOrigen + direccion
    if (nuevoIndice < 0 || nuevoIndice >= bloquesWeb.value.length) return
    const elemento = bloquesWeb.value.splice(indiceOrigen, 1)[0]
    bloquesWeb.value.splice(nuevoIndice, 0, elemento)
    bloquesWeb.value.forEach((b, idx) => { b.orden = idx + 1 })
  }

  const actualizarContenidoBloque = (id, nuevoContenido) => {
    const bloque = bloquesWeb.value.find(b => b.id === id)
    if (bloque) {
      bloque.contenido = { ...bloque.contenido, ...nuevoContenido }
    }
  }

  const agregarEnlaceLinktree = () => {
    linktree.value.enlaces.push({
      id: Date.now().toString(),
      titulo: 'Nuevo Enlace',
      icono: 'bi bi-link-45deg',
      etiqueta: 'Nuevo Enlace',
      url: 'https://',
      activo: true
    })
  }

  const eliminarEnlaceLinktree = (index) => {
    linktree.value.enlaces.splice(index, 1)
  }

  // Guardar en Firestore y mantener en Store
  const guardarEnFirestore = async (userId = 'demo-user-1') => {
    guardando.value = true
    ownerUid.value = userId
    const payload = {
      uid: userId,
      subdominio: subdominio.value,
      tituloSitio: tituloSitio.value,
      descripcion: descripcion.value,
      bloquesWeb: bloquesWeb.value,
      linktree: linktree.value,
      footerConfig: footerConfig.value,
      ultimaActualizacion: new Date().toISOString()
    }

    try {
      if (db) {
        await setDoc(doc(db, 'sitios_cmd', userId), payload, { merge: true })
      }
      return true
    } catch (e) {
      console.warn('Guardado en Firestore no disponible, guardado en Pinia/LocalStorage:', e)
      return true
    } finally {
      guardando.value = false
    }
  }

  // Cargar de Firestore buscando por UID o por subdominio
  const cargarDeFirestore = async (userIdOrSubdominio = 'demo-user-1') => {
    cargando.value = true
    try {
      if (db) {
        // 1. Intentar buscar por ID directo de documento (UID)
        const snap = await getDoc(doc(db, 'sitios_cmd', userIdOrSubdominio))
        if (snap.exists()) {
          ownerUid.value = snap.id
          const data = snap.data()
          if (data.subdominio) subdominio.value = data.subdominio
          if (data.tituloSitio) tituloSitio.value = data.tituloSitio
          if (data.descripcion) descripcion.value = data.descripcion
          if (data.bloquesWeb) bloquesWeb.value = data.bloquesWeb
          if (data.linktree) linktree.value = data.linktree
          if (data.footerConfig) footerConfig.value = data.footerConfig
          return
        }

        // 2. Si no es UID directo, buscar por el campo subdominio
        const q = query(collection(db, 'sitios_cmd'), where('subdominio', '==', userIdOrSubdominio))
        const querySnap = await getDocs(q)
        if (!querySnap.empty) {
          const docFound = querySnap.docs[0]
          ownerUid.value = docFound.id
          const data = docFound.data()
          if (data.subdominio) subdominio.value = data.subdominio
          if (data.tituloSitio) tituloSitio.value = data.tituloSitio
          if (data.descripcion) descripcion.value = data.descripcion
          if (data.bloquesWeb) bloquesWeb.value = data.bloquesWeb
          if (data.linktree) linktree.value = data.linktree
          if (data.footerConfig) footerConfig.value = data.footerConfig
          return
        }
      }
      // Fallback
      ownerUid.value = userIdOrSubdominio
    } catch (e) {
      console.warn('Error cargando configuración, usando fallback local:', e)
      ownerUid.value = userIdOrSubdominio
    } finally {
      cargando.value = false
    }
  }

  return {
    modoActual,
    ownerUid,
    subdominio,
    tituloSitio,
    descripcion,
    bloquesWeb,
    linktree,
    footerConfig,
    cargando,
    guardando,
    cambiarModo,
    toggleBloqueWeb,
    moverBloqueWeb,
    actualizarContenidoBloque,
    agregarEnlaceLinktree,
    eliminarEnlaceLinktree,
    guardarEnFirestore,
    cargarDeFirestore
  }
}, {
  persist: true
})
