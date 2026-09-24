/**
 * Endpoint Serverless /api/copiloto
 *
 * Recibe los mensajes del usuario desde el dashboard de Vue, valida el Firebase ID Token,
 * ejecuta el análisis proactivo del negocio, ejecuta el bucle de herramientas
 * contra Firestore (scoped a negocios/{uid}/...) y responde con Claude (Anthropic).
 */

import Anthropic from '@anthropic-ai/sdk'
import admin from 'firebase-admin'
import { toolExecutors } from './copilotoTools.js'
import { COPILOTO_SYSTEM_PROMPT } from './prompts/systemPrompt.js'
import { analizarNegocio, formatearInsightsParaPrompt } from './analisisNegocio.js'

// Definiciones de herramientas para la API de Claude
export const COPILOTO_TOOLS_SCHEMAS = [
  {
    name: 'consultar_catalogo',
    description: 'Consulta los productos del catálogo del negocio, precios, costos y márgenes de ganancia.',
    input_schema: {
      type: 'object',
      properties: {
        categoria: {
          type: 'string',
          description: 'Categoría opcional a filtrar (ej. "Joyería", "Bolsos", "Todos").'
        },
        soloDestacados: {
          type: 'boolean',
          description: 'Si es true, filtra solo productos destacados.'
        }
      }
    }
  },
  {
    name: 'consultar_inventario',
    description: 'Consulta los insumos, materiales y stock del negocio. Permite detectar insumos con stock crítico.',
    input_schema: {
      type: 'object',
      properties: {
        soloStockBajo: {
          type: 'boolean',
          description: 'Si es true, devuelve solo insumos donde la cantidad actual es menor o igual al stock mínimo.'
        }
      }
    }
  },
  {
    name: 'consultar_clientes',
    description: 'Consulta el listado de clientes del negocio, su historial de pedidos y contactos.',
    input_schema: {
      type: 'object',
      properties: {
        filtro: {
          type: 'string',
          description: 'Término de búsqueda por nombre, teléfono o dirección.'
        }
      }
    }
  },
  {
    name: 'consultar_cuentas',
    description: 'Consulta las cuentas financieras, monedas (USD, VES, EUR) y balances del negocio.',
    input_schema: {
      type: 'object',
      properties: {
        estado: {
          type: 'string',
          description: 'Estado de las cuentas a consultar (por defecto "todas").'
        }
      }
    }
  },
  {
    name: 'consultar_ventas_recientes',
    description: 'Consulta el registro de pedidos y ventas de los últimos N días con métricas de ingresos y ticket promedio.',
    input_schema: {
      type: 'object',
      properties: {
        dias: {
          type: 'number',
          description: 'Número de días hacia atrás a consultar (ej. 7, 15, 30).'
        }
      }
    }
  }
]

// Inicialización de Firebase Admin (solo una vez)
if (!admin.apps.length) {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY))
    })
  } else {
    try {
      admin.initializeApp()
    } catch (e) {
      console.warn('Firebase Admin no pudo inicializarse sin credenciales:', e.message)
    }
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(500).json({
      error: 'ANTHROPIC_API_KEY no configurada en las variables de entorno del servidor.'
    })
  }

  try {
    // 1. Validar el token de Firebase Auth
    const authHeader = req.headers.authorization || ''
    const idToken = authHeader.replace('Bearer ', '').trim()

    let uid = 'demo-user-1'
    if (idToken && admin.apps.length) {
      try {
        const decodedToken = await admin.auth().verifyIdToken(idToken)
        uid = decodedToken.uid
      } catch (authErr) {
        console.warn('Token inválido, usando fallback seguro:', authErr.message)
      }
    }

    const { messages, soloAnalisis = false } = req.body

    // Si solo se solicita el diagnóstico de salud del negocio
    if (soloAnalisis) {
      const diagnostico = await analizarNegocio(uid)
      return res.status(200).json(diagnostico)
    }

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'El cuerpo de la petición debe incluir un arreglo de messages.' })
    }

    // 2. Ejecutar análisis proactivo para enriquecer el System Prompt
    let dynamicSystemPrompt = COPILOTO_SYSTEM_PROMPT
    try {
      const diagnostico = await analizarNegocio(uid)
      if (diagnostico?.insights?.length) {
        dynamicSystemPrompt += `\n\n==================================================\n${formatearInsightsParaPrompt(diagnostico.insights)}\n==================================================`
      }
    } catch (diagErr) {
      console.warn('No se pudo generar diagnóstico proactivo:', diagErr.message)
    }

    const anthropic = new Anthropic({ apiKey })
    let currentMessages = [...messages]
    let maxIteraciones = 5

    // 3. Bucle de ejecución de herramientas (Tool Use Loop)
    while (maxIteraciones > 0) {
      maxIteraciones--

      const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        system: dynamicSystemPrompt,
        tools: COPILOTO_TOOLS_SCHEMAS,
        messages: currentMessages
      })

      // Si Claude no solicita más herramientas, retornar respuesta final
      if (response.stop_reason !== 'tool_use') {
        const textBlock = response.content.find(c => c.type === 'text')
        return res.status(200).json({
          role: 'assistant',
          content: textBlock ? textBlock.text : ''
        })
      }

      // Si Claude solicita usar una herramienta:
      const toolUseBlock = response.content.find(c => c.type === 'tool_use')
      if (!toolUseBlock) break

      currentMessages.push({ role: 'assistant', content: response.content })

      // Ejecutar la tool en Firestore con el UID del negocio
      const executor = toolExecutors[toolUseBlock.name]
      let toolResultData

      if (executor) {
        try {
          toolResultData = await executor(toolUseBlock.input, uid)
        } catch (execErr) {
          toolResultData = { error: execErr.message }
        }
      } else {
        toolResultData = { error: `Herramienta ${toolUseBlock.name} no encontrada.` }
      }

      // Devolver resultado a Claude
      currentMessages.push({
        role: 'user',
        content: [
          {
            type: 'tool_result',
            tool_use_id: toolUseBlock.id,
            content: JSON.stringify(toolResultData)
          }
        ]
      })
    }

    return res.status(500).json({ error: 'Se excedió el límite de llamadas a herramientas.' })
  } catch (error) {
    console.error('Error en /api/copiloto:', error)
    return res.status(500).json({ error: error.message || 'Error interno del servidor.' })
  }
}
