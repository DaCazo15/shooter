/**
 * Tipos de bloques disponibles para el builder MVP
 */
export const TIPO_BLOQUE = {
  CINTA: 'Cinta Informativa',
  HERO: 'Hero Principal',
  CARRUSEL: 'Carrusel de Productos',
  CATALOGO: 'Catálogo de Mercancía',
  CTA: 'Call To Action',
  LINKTREE: 'Sección Linktree'
}

/**
 * Plantilla de bloques por defecto con contenido inicial
 */
export const BLOQUES_DEFECTO = [
  {
    id: 'cinta',
    tipo: TIPO_BLOQUE.CINTA,
    activo: true,
    orden: 1,
    contenido: {
      texto: '¡Envíos nacionales e internacionales disponibles!',
      colorFondo: '#1e293b',
      colorTexto: '#ffffff'
    }
  },
  {
    id: 'hero',
    tipo: TIPO_BLOQUE.HERO,
    activo: true,
    orden: 2,
    contenido: {
      titulo: 'Bienvenidos a nuestro catálogo',
      subtitulo: 'Encuentra los mejores productos e insumos al mejor precio',
      imagenUrl: '',
      textoBoton: 'Ver Productos',
      linkBoton: '#catalogo'
    }
  },
  {
    id: 'carrusel',
    tipo: TIPO_BLOQUE.CARRUSEL,
    activo: true,
    orden: 3,
    contenido: {
      tituloSeccion: 'Productos Destacados',
      limiteItems: 6,
      mostrarPrecio: true
    }
  },
  {
    id: 'catalogo',
    tipo: TIPO_BLOQUE.CATALOGO,
    activo: true,
    orden: 4,
    contenido: {
      tituloSeccion: 'Nuestro Catálogo',
      mostrarFiltros: true,
      mostrarBuscador: true
    }
  },
  {
    id: 'cta',
    tipo: TIPO_BLOQUE.CTA,
    activo: true,
    orden: 5,
    contenido: {
      titulo: '¿Necesitas una cotización personalizada?',
      descripcion: 'Contáctanos directamente por WhatsApp y te atenderemos de inmediato.',
      textoBoton: 'Escribir a WhatsApp',
      tipoAccion: 'whatsapp'
    }
  },
  {
    id: 'linktree',
    tipo: TIPO_BLOQUE.LINKTREE,
    activo: true,
    orden: 6,
    contenido: {
      tituloSeccion: 'Conéctate con Nosotros',
      mostrarIconos: true,
      estiloBotones: 'rounded-lg'
    }
  }
]

/**
 * Estructura inicial del estado del sitio
 */
export const CONFIG_SITIO_INICIAL = {
  subdominio: '',
  subdominioSlug: '',
  tituloSitio: '',
  descripcion: '',
  logoUrl: '',
  redes: {
    whatsapp: '',
    instagram: '',
    facebook: '',
    telegram: '',
    web: ''
  },
  bloques: [...BLOQUES_DEFECTO]
}

/**
 * Sanitiza y genera el slug del subdominio
 * @param {string} texto 
 * @returns {string}
 */
export const limpiarSubdominio = (texto) => {
  if (!texto) return ''
  return texto
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9-]/g, '')
}

/**
 * Construye la URL final del subdominio
 * @param {string} subdominio 
 * @param {string} dominioBase 
 * @returns {string}
 */
export const construirUrlSubdominio = (subdominio, dominioBase = 'tuapp.com') => {
  const slug = limpiarSubdominio(subdominio)
  return slug ? `https://${slug}.${dominioBase}` : ''
}
