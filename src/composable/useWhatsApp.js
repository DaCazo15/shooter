import { useCmdStore } from '../stores/cmdStore'

/**
 * Composable para centralizar la lógica de contacto por WhatsApp.
 * Reutilizable en cualquier componente público o admin.
 */
export function useWhatsApp() {
  const cmdStore = useCmdStore()

  const contactarWhatsApp = (producto = null) => {
    const telefono = cmdStore.footerConfig.whatsapp
      ? cmdStore.footerConfig.whatsapp.replace(/\D/g, '')
      : '584121234567'

    let mensaje = `¡Hola ${cmdStore.tituloSitio}! Me gustaría consultar información sobre sus productos.`

    if (producto) {
      mensaje = `¡Hola! Estoy interesada en adquirir "${producto.titulo}" ($${Number(producto.precio || 0).toFixed(2)}). ¿Tienen disponibilidad?`
    }

    const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`
    window.open(url, '_blank')
  }

  return { contactarWhatsApp }
}
