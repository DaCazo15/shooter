import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  const legalSettings = ref({
    nombreLegal: 'Pandibuy Atelier C.A.',
    identificacionFiscal: 'J-50123984-1',
    emailContacto: 'legal@pandibuy.com',
    telefono: '+58 412 1234567',
    direccionFisica: 'Av. Principal, Edificio Empresarial, Piso 4, Caracas, Venezuela',
    terminosYCondiciones: `1. Aceptación de los Términos: Al acceder y utilizar los servicios de Pandibuy, el usuario acepta de forma expresa estos términos y condiciones.
2. Pedidos y Pagos: Todos los pedidos personalizados requieren un anticipo del 50% antes de iniciar la producción. El saldo restante debe liquidarse previo al despacho.
3. Tiempos de Entrega: Los plazos de confección oscilan entre 3 y 7 días hábiles según la complejidad del pedido.
4. Envíos y Responsabilidad: Los envíos se realizan a través de agencias de encomienda aliadas con número de seguimiento garantizado.`,
    politicaDevoluciones: `Políticas de Cambio y Devolución:
- Debido a la naturaleza  y personalizada de nuestras piezas, no se aceptan devoluciones por cambio de opinión una vez iniciado el proceso.
- En caso de defectos de fábrica o discrepancias en el pedido recibido, el cliente tiene un plazo de 48 horas tras la entrega para notificar el reclamo con soporte fotográfico.
- Las devoluciones aprobadas serán reemplazadas por una pieza nueva o saldo a favor en la tienda.`,
    politicaPrivacidad: `Protección de Datos:
- Pandibuy respeta y protege la privacidad de sus clientes. Los datos recopilados (nombre, teléfono, dirección de entrega) se utilizan exclusivamente para procesar y despachar sus pedidos.
- En ningún caso comercializamos ni transferimos información personal a terceros.`,
    avisosLegales: `Todos los diseños, logotipos y fotografías presentadas en este catálogo son propiedad intelectual de Pandibuy Atelier y están protegidos por las leyes de propiedad industrial y derechos de autor vigentes.`
  })

  const guardarAjustesLegales = (nuevosDatos) => {
    legalSettings.value = { ...legalSettings.value, ...nuevosDatos }
  }

  return {
    legalSettings,
    guardarAjustesLegales
  }
}, {
  persist: true
})
