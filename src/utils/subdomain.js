/**
 * Utilidad para detección y manejo de subdominios
 */

/**
 * Obtiene el subdominio actual a partir del hostname del navegador.
 * Ignora IPs, localhost puro, dominios base y subdominios reservados (www, app, admin, api, etc.).
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
    if (parts.length > 1 && parts[0] !== 'www') {
      return parts[0].toLowerCase()
    }
    return null
  }

  const parts = hostname.split('.')
  // Si tiene al menos 3 partes (tienda.pandibuy.com, mi-negocio.vercel.app)
  if (parts.length >= 3) {
    const sub = parts[0].toLowerCase()
    const subdominiosReservados = ['www', 'app', 'admin', 'api', 'dashboard', 'preview', 'shooter']
    if (!subdominiosReservados.includes(sub)) {
      return sub
    }
  }

  return null
}
