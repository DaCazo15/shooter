import { ref, computed } from 'vue'
import { auth } from '../config/firestore'

/**
 * Composable para interactuar con Pandi Copilot desde el frontend de Vue.
 */
export function useCopiloto() {
  const mensajes = ref([
    {
      id: 'bienvenida',
      role: 'assistant',
      content: '¡Epa! Soy tu **Pandi Copilot** 🐼. Puedo revisar tu catálogo, avisarte qué materiales se están agotando en el taller o ver cómo van tus ventas y clientes. ¿En qué te echo una mano hoy?'
    }
  ])

  const cargando = ref(false)
  const cargandoDiagnostico = ref(false)
  const error = ref(null)
  const insights = ref([])
  const saludNegocio = ref(null)

  // Determina si el negocio tiene data en Firestore
  const tieneDataNegocio = computed(() => {
    if (!saludNegocio.value) return true // Asume true mientras carga o en fallback
    return saludNegocio.value.tieneData !== false
  })

  const sugerenciasRapidas = [
    '📦 ¿Qué insumos tengo en stock crítico?',
    '📊 Analiza los precios y márgenes de mi catálogo',
    '👥 ¿Quiénes son mis clientes más recurrentes?',
    '💡 ¿Qué oportunidades de venta detectas hoy?'
  ]

  // Obtener diagnóstico y lista de insights accionables al entrar al dashboard
  const obtenerDiagnostico = async () => {
    cargandoDiagnostico.value = true
    try {
      let idToken = ''
      if (auth?.currentUser) {
        idToken = await auth.currentUser.getIdToken()
      }

      const res = await fetch('/api/copiloto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(idToken ? { 'Authorization': `Bearer ${idToken}` } : {})
        },
        body: JSON.stringify({ soloAnalisis: true })
      })

      if (res.ok) {
        const data = await res.json()
        saludNegocio.value = data.salud || null
        insights.value = data.insights || []

        if (data.salud && data.salud.tieneData === false) {
          // Negocio sin datos registrados
          mensajes.value = [
            {
              id: 'sin_data',
              role: 'assistant',
              content: '¡Epa! 🐼 Para poder ayudarte con análisis, precios y alertas de stock, primero necesitas registrar al menos **1 producto en tu Catálogo** o **1 insumo en tu Inventario**. ¡Una vez que agregues tus datos, me activo automáticamente!'
            }
          ]
          return
        }

        // Si hay alertas críticas, actualizar el mensaje de bienvenida proactivamente
        if (data.insights?.length > 0) {
          const criticos = data.insights.filter(i => i.severidad === 'critico')
          if (criticos.length > 0) {
            mensajes.value[0].content = `¡Epa! Soy tu **Pandi Copilot** 🐼. Noté **${criticos.length} alertas prioritarias** en tu negocio (ej. *${criticos[0].titulo}*). ¿Quieres que las revisemos o prefieres consultar otra cosa?`
          }
        }
      }
    } catch (err) {
      console.warn('Diagnóstico local activo:', err.message)
    } finally {
      cargandoDiagnostico.value = false
    }
  }

  const enviarMensaje = async (textoUsuario) => {
    if (!textoUsuario.trim() || cargando.value || !tieneDataNegocio.value) return

    const mensajeId = Date.now().toString()

    mensajes.value.push({
      id: mensajeId,
      role: 'user',
      content: textoUsuario
    })

    cargando.value = true
    error.value = null

    try {
      let idToken = ''
      if (auth?.currentUser) {
        idToken = await auth.currentUser.getIdToken()
      }

      const res = await fetch('/api/copiloto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(idToken ? { 'Authorization': `Bearer ${idToken}` } : {})
        },
        body: JSON.stringify({
          messages: mensajes.value.map(m => ({ role: m.role, content: m.content }))
        })
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || `Error ${res.status}: no se pudo conectar con el copiloto`)
      }

      const data = await res.json()
      mensajes.value.push({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content
      })
    } catch (err) {
      console.error('Error enviando mensaje al copiloto:', err)
      error.value = err.message
      mensajes.value.push({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `⚠️ *Ups, ocurrió un detalle:* ${err.message}`
      })
    } finally {
      cargando.value = false
    }
  }

  const reiniciarConversacion = () => {
    if (!tieneDataNegocio.value) return
    mensajes.value = [
      {
        id: 'bienvenida',
        role: 'assistant',
        content: '¡Epa! Conversación reiniciada. ¿Qué quieres consultar de tu negocio hoy?'
      }
    ]
    error.value = null
  }

  return {
    mensajes,
    cargando,
    cargandoDiagnostico,
    error,
    insights,
    saludNegocio,
    tieneDataNegocio,
    sugerenciasRapidas,
    obtenerDiagnostico,
    enviarMensaje,
    reiniciarConversacion
  }
}
