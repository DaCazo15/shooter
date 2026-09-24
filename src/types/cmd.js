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
  tituloPerfil: '',
  biografia: '',
  avatarUrl: '',
  colorFondo: '#0f172a',
  colorBoton: '#2563eb',
  enlaces: [
    { id: 'wa', red: 'whatsapp', etiqueta: 'WhatsApp Directo', url: '', activo: true },
    { id: 'ig', red: 'instagram', etiqueta: 'Instagram Oficial', url: '', activo: true },
    { id: 'fb', red: 'facebook', etiqueta: 'Página de Facebook', url: '', activo: true },
    { id: 'tg', red: 'telegram', etiqueta: 'Canal de Telegram', url: '', activo: true },
    { id: 'wb', red: 'web', etiqueta: 'Sitio Web Principal', url: '', activo: true }
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
