import { ref, computed } from 'vue'
import { neuralCopilot } from '../services/tfCopilot/model'
import { generarConsejoConversacional } from '../services/tfCopilot/adviceEngine'
import { useAuthStore } from '../stores/authStore'
import { useClientes } from './useClientes'
import { useCatalogo } from './useCatalogo'
import { useInventario } from './useInventario'
import { useProveedores } from './useProveedores'

/**
 * Composable para interactuar con Pandi Cosado por TensorFlow.js.
 * Inferencia 100% en el cliente, consejos es y cláusula obligatoria de segunda opinión.
 */
export function useCopiloto() {
  const authStore = useAuthStore()
  const { clientes, obtenerClientes } = useClientes()
  const { catalogo, iniciarEscuchaCatalogo } = useCatalogo()
  const { materiales, obtenerMateriales } = useInventario()
  const { proveedores, obtenerProveedores } = useProveedores()

  const mensajes = ref([])
  const cargando = ref(false)
  const cargandoDiagnostico = ref(false)
  const error = ref(null)
  const saludNegocio = ref(null)

  const tieneDataNegocio = computed(() => true)

  // Diagnóstico inicial en local
  const obtenerDiagnostico = async () => {
    cargandoDiagnostico.value = true
    try {
      // Cargar colecciones en background para alimentar al Copiloto
      obtenerClientes()
      iniciarEscuchaCatalogo()
      obtenerMateriales()
      obtenerProveedores()

      // Inicializar y pre-entrenar la red neuronal en background
      await neuralCopilot.entrenar()
      saludNegocio.value = { tieneData: true, estado: 'optimo' }
    } catch (err) {
      console.warn('Inicialización de red neuronal Copilot:', err)
    } finally {
      cargandoDiagnostico.value = false
    }
  }

  // Enviar mensaje e inferir con TensorFlow.js
  const enviarMensaje = async (textoUsuario) => {
    if (!textoUsuario || !textoUsuario.trim() || cargando.value) return

    const mensajeId = Date.now().toString()

    mensajes.value.push({
      id: mensajeId,
      role: 'user',
      content: textoUsuario
    })

    cargando.value = true
    error.value = null

    try {
      // Asegurar que las listas del negocio estén cargadas
      if (clientes.value.length === 0) obtenerClientes()
      if (catalogo.value.length === 0) iniciarEscuchaCatalogo()
      if (materiales.value.length === 0) obtenerMateriales()
      if (proveedores.value.length === 0) obtenerProveedores()

      // Simular un pequeño retardo natural de pensamiento (350ms)
      await new Promise(r => setTimeout(r, 350))

      // 1. Inferencia de intención con la red neuronal TensorFlow.js
      const { intent, confidence } = await neuralCopilot.predecirIntencion(textoUsuario)

      // 2. Generación del consejo estructurado
      const respuesta = generarConsejoConversacional(intent, textoUsuario, {
        confianza: confidence,
        user: authStore.user,
        clientes: clientes.value || [],
        catalogo: catalogo.value || [],
        materiales: materiales.value || [],
        proveedores: proveedores.value || []
      })

      mensajes.value.push({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: respuesta
      })
    } catch (err) {
      console.error('Error en inferencia de Pandi Copilot:', err)
      error.value = err.message
      mensajes.value.push({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `⚠️ *Ocurrió un detalle al procesar la recomendación:* ${err.message}`
      })
    } finally {
      cargando.value = false
    }
  }

  const reiniciarConversacion = () => {
    mensajes.value = []
    error.value = null
  }

  return {
    mensajes,
    cargando,
    cargandoDiagnostico,
    error,
    saludNegocio,
    tieneDataNegocio,
    obtenerDiagnostico,
    enviarMensaje,
    reiniciarConversacion
  }
}
