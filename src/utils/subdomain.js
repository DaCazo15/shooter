/**
 * Utilidad para detección y manejo de subdominios
 */

const PLATFORM_HOSTS = [
  'vercel.app',
  'netlify.app',
  'web.app',
  'firebaseapp.com',
  'pages.dev',
  'onrender.com',
  'github.io',
  'glitch.me',
  'railway.app'
]

const SUBDOMINIOS_RESERVADOS = [
  'www',
  'app',
  'admin',
  'api',
  'dashboard',
  'preview',
  'shooter',
  'pandibuy',
  'auth',
  'mail',
  'static'
]

/**
 * Obtiene el subdominio actual a partir del hostname del navegador.
 * Ignora IPs, localhost puro, dominios base y plataformas de hosting (Vercel, Netlify, Firebase, etc.).
 * @returns {string|null} Nombre del subdominio o null si es dominio principal
 */
export function getHostnameSubdomain() {
  if (typeof window === 'undefined') return null

  const hostname = window.location.hostname
  if (!hostname || hostname === 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
    return null
  }

  // Soporte para subdominio en localhost: tienda.localhost:5173
  if (hostname.endsWith('.localhost')) {
    const parts = hostname.split('.')
    if (parts.length > 1 && !SUBDOMINIOS_RESERVADOS.includes(parts[0].toLowerCase())) {
      return parts[0].toLowerCase()
    }
    return null
  }

  // Si está desplegado en una plataforma de hosting (ej. proyecto.vercel.app)
  const platformMatch = PLATFORM_HOSTS.find(p => hostname.endsWith('.' + p) || hostname === p)
  if (platformMatch) {
    // Si es exactamente la plataforma o subdominio de 1er nivel del hosting (ej. mi-app.vercel.app)
    const hostWithoutPlatform = hostname.slice(0, -(platformMatch.length + 1))
    if (!hostWithoutPlatform) return null

    const parts = hostWithoutPlatform.split('.')
    // Solo si hay un subdominio adicional ANTES del nombre del proyecto (ej: tienda.mi-app.vercel.app)
    if (parts.length > 1) {
      const sub = parts[0].toLowerCase()
      if (!SUBDOMINIOS_RESERVADOS.includes(sub)) {
        return sub
      }
    }
    return null
  }

  // Para dominios personalizados estándar (ej: tienda.pandibuy.com)
  const parts = hostname.split('.')
  if (parts.length >= 3) {
    const sub = parts[0].toLowerCase()
    if (!SUBDOMINIOS_RESERVADOS.includes(sub)) {
      return sub
    }
  }

  return null
}
