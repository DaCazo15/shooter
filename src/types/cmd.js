export const MODOS_CMD = {
  WEB: 'web',
  LINKTREE: 'linktree'
}

export const BLOQUES_WEB_DEFECTO = [
  { id: 'cinta', tipo: 'Cinta Informativa', activo: true, orden: 1, contenido: { texto: '¡Envíos nacionales disponibles!' } },
  { id: 'hero', tipo: 'Hero Principal', activo: true, orden: 2, contenido: { titulo: 'Bienvenidos a mi Tienda', subtitulo: 'Catálogo de productos' } },
  { id: 'carrusel', tipo: 'Carrusel Destacados', activo: true, orden: 3, contenido: { limiteItems: 6 } },
  { id: 'catalogo', tipo: 'Catálogo General', activo: true, orden: 4, contenido: { mostrarFiltros: true } },
  { id: 'cta', tipo: 'Call To Action', activo: true, orden: 5, contenido: { titulo: '¿Tienes dudas?', textoBoton: 'Contactar por WhatsApp' } }
]

export const CONFIG_LINKTREE_DEFECTO = {
  titulo: 'Pandibuy Atelier',
  tituloPerfil: 'Pandibuy Atelier',
  bio: 'Joyería y piezas de diseño  hechas con amor.',
  biografia: 'Joyería y piezas de diseño  hechas con amor.',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  colorFondo: '#1F1824',
  colorBoton: '#9E5A78',
  colorTextoBoton: '#FAF8F6',
  enlaces: [
    { id: 'wa', red: 'whatsapp', icono: 'bi bi-whatsapp', etiqueta: 'WhatsApp Directo', url: 'https://wa.me/', activo: true },
    { id: 'ig', red: 'instagram', icono: 'bi bi-instagram', etiqueta: 'Instagram Oficial', url: 'https://instagram.com/', activo: true },
    { id: 'fb', red: 'facebook', icono: 'bi bi-facebook', etiqueta: 'Página de Facebook', url: 'https://facebook.com/', activo: true },
    { id: 'tg', red: 'telegram', icono: 'bi bi-telegram', etiqueta: 'Canal de Telegram', url: 'https://t.me/', activo: true },
    { id: 'wb', red: 'web', icono: 'bi bi-globe', etiqueta: 'Sitio Web Principal', url: '#catalogo', activo: true }
  ]
}

export const CONFIG_CMD_INICIAL = {
  modoActivo: MODOS_CMD.WEB,
  subdominio: '',
  tituloSitio: '',
  descripcion: '',
  bloquesWeb: [...BLOQUES_WEB_DEFECTO],
  linktree: { ...CONFIG_LINKTREE_DEFECTO }
}

export const limpiarSubdominio = (texto) => {
  if (!texto) return ''
  return texto
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9-]/g, '')
}
