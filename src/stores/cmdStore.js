import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db } from '../config/firestore'
import { doc, getDoc, setDoc } from 'firebase/firestore'

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
      textoBoton: 'Cotizar pedido por WhatsApp',
      enlaceBoton: 'https://wa.me/584121234567'
    }
  }
]

export const DEFAULT_LINKTREE = {
  tituloPerfil: 'Pandibuy Atelier',
  biografia: 'Diseños únicos & Detalles artesanales. Envíos nacionales e internacionales con atención personalizada.',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  colorFondo: '#1F1824',
  colorBoton: '#9E5A78',
  estiloBoton: 'rounded-full',
  enlaces: [
    { id: 'wa', red: 'whatsapp', icono: 'bi bi-whatsapp', etiqueta: 'Escríbenos a WhatsApp', url: 'https://wa.me/584121234567', activo: true },
    { id: 'ig', red: 'instagram', icono: 'bi bi-instagram', etiqueta: 'Síguenos en Instagram (@pandibuy)', url: 'https://instagram.com/pandibuy', activo: true },
    { id: 'cat', red: 'catalogo', icono: 'bi bi-bag-check', etiqueta: 'Ver Catálogo Completo', url: '/web/pandibuy', activo: true },
    { id: 'tiktok', red: 'tiktok', icono: 'bi bi-tiktok', etiqueta: 'Videos y Tutoriales en TikTok', url: 'https://tiktok.com/@pandibuy', activo: true }
  ]
}

export const DEFAULT_FOOTER_CONFIG = {
  nombreMarca: 'Pandibuy Atelier',
  descripcion: 'Creaciones elaboradas a mano con materiales de primera calidad y pasión por los detalles.',
  mostrarRedes: true,
  instagram: 'https://instagram.com/pandibuy',
  whatsapp: 'https://wa.me/584121234567',
  email: 'contacto@pandibuy.com',
  horario: 'Lunes a Sábado: 9:00 AM - 6:00 PM',
  mostrarTerminos: true,
  mostrarPoliticaDevolucion: true,
  mostrarCopyright: true,
  textoCopyright: '© 2026 Pandibuy Atelier. Todos los derechos reservados.',
  badgePandibuy: true
}

export const useCmdStore = defineStore('cmd', () => {
  const modoActual = ref('web') // 'web' | 'linktree'
  const subdominio = ref('pandibuy')
  const tituloSitio = ref('Pandibuy Atelier')
  const descripcion = ref('Tienda oficial de creaciones exclusivas')
  const bloquesWeb = ref(JSON.parse(JSON.stringify(DEFAULT_BLOQUES_WEB)))
  const linktree = ref(JSON.parse(JSON.stringify(DEFAULT_LINKTREE)))
  const footerConfig = ref(JSON.parse(JSON.stringify(DEFAULT_FOOTER_CONFIG)))
  
  const cargando = ref(false)
  const guardando = ref(false)

  const cambiarModo = (modo) => {
    modoActual.value = modo
  }

  const toggleBloqueWeb = (id) => {
    const bloque = bloquesWeb.value.find(b => b.id === id)
    if (bloque) {
      bloque.activo = !bloque.activo
    }
  }

  const moverBloqueWeb = (index, direccion) => {
    const nuevoIndex = index + direccion
    if (nuevoIndex >= 0 && nuevoIndex < bloquesWeb.value.length) {
      const temp = bloquesWeb.value[index]
      bloquesWeb.value[index] = bloquesWeb.value[nuevoIndex]
      bloquesWeb.value[nuevoIndex] = temp
    }
  }

  const actualizarContenidoBloque = (id, nuevoContenido) => {
    const bloque = bloquesWeb.value.find(b => b.id === id)
    if (bloque) {
      bloque.contenido = { ...bloque.contenido, ...nuevoContenido }
    }
  }

  const agregarEnlaceLinktree = () => {
    linktree.value.enlaces.push({
      id: `link_${Date.now()}`,
      red: 'link',
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
    const payload = {
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

  // Cargar de Firestore
  const cargarDeFirestore = async (userId = 'demo-user-1') => {
    cargando.value = true
    try {
      if (db) {
        const snap = await getDoc(doc(db, 'sitios_cmd', userId))
        if (snap.exists()) {
          const data = snap.data()
          if (data.subdominio) subdominio.value = data.subdominio
          if (data.tituloSitio) tituloSitio.value = data.tituloSitio
          if (data.descripcion) descripcion.value = data.descripcion
          if (data.bloquesWeb) bloquesWeb.value = data.bloquesWeb
          if (data.linktree) linktree.value = data.linktree
          if (data.footerConfig) footerConfig.value = data.footerConfig
        }
      }
    } catch (e) {
      console.warn('Error cargando configuración:', e)
    } finally {
      cargando.value = false
    }
  }

  return {
    modoActual,
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
