/**
 * Motor de Red Neuronal y Clasificación de Lenguaje Natural para Pandi Copilot.
 * Inferencia 100% en el cliente, cero latencia, sin llamadas a APIs externas.
 */

import { TRAINING_DATA, INTENTS } from './dataset.js'

// Limpieza, normalización y tokenización de texto en español
export function tokenizar(texto) {
  if (!texto) return []
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Eliminar tildes
    .replace(/[^a-z0-9\s]/g, ' ')   // Solo caracteres alfanuméricos
    .split(/\s+/)
    .filter(t => t.length > 2)      // Filtrar palabras de menos de 3 letras
}

// Distancia de Levenshtein para tolerancia a errores ortográficos / tipográficos
function calcularDistanciaLevenshtein(a, b) {
  if (a === b) return 0
  if (a.length === 0) return b.length
  if (b.length === 0) return a.length

  const matrix = []
  for (let i = 0; i <= b.length; i++) matrix[i] = [i]
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
        )
      }
    }
  }
  return matrix[b.length][a.length]
}

// Función de activación Softmax
function softmax(logits) {
  const maxLogit = Math.max(...logits)
  const scores = logits.map(l => Math.exp(l - maxLogit))
  const sumScores = scores.reduce((a, b) => a + b, 0)
  return scores.map(s => s / (sumScores || 1))
}

class CopilotNeuralEngine {
  constructor() {
    this.vocabulario = []
    this.intentsList = Array.from(new Set(Object.values(INTENTS)))
    this.intentWeights = {} // Pesos entrenados por cada neurona de intención
    this.isTrained = false
  }

  // Construir vocabulario a partir de los datos de entrenamiento
  construirVocabulario() {
    const vocabSet = new Set()
    TRAINING_DATA.forEach(item => {
      const tokens = tokenizar(item.text)
      tokens.forEach(t => vocabSet.add(t))
    })
    this.vocabulario = Array.from(vocabSet)
  }

  // Convertir texto a vector TF-IDF / Bag of Words normalizado con tolerancia difusa
  textoAVector(texto) {
    const tokens = tokenizar(texto)
    const vector = new Array(this.vocabulario.length).fill(0)

    tokens.forEach(t => {
      const index = this.vocabulario.indexOf(t)
      if (index !== -1) {
        vector[index] += 1
      } else if (t.length >= 4) {
        // Búsqueda difusa para tolerar errores ortográficos (ej. "cliuentes" -> "clientes")
        let mejorMatchIdx = -1
        let menorDistancia = Infinity

        for (let i = 0; i < this.vocabulario.length; i++) {
          const palabraVocab = this.vocabulario[i]
          if (Math.abs(palabraVocab.length - t.length) <= 2) {
            const dist = calcularDistanciaLevenshtein(t, palabraVocab)
            const maxDistPermitida = t.length >= 7 ? 2 : 1
            if (dist <= maxDistPermitida && dist < menorDistancia) {
              menorDistancia = dist
              mejorMatchIdx = i
            }
          }
        }

        if (mejorMatchIdx !== -1) {
          vector[mejorMatchIdx] += 0.9 // Ponderación de coincidencia difusa
        }
      }
    })

    // Normalización euclidiana L2
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0))
    if (magnitude > 0) {
      return vector.map(v => v / magnitude)
    }
    return vector
  }

  // Entrenar la red neuronal (Calcula y optimiza los pesos de cada intención)
  async entrenar() {
    if (this.isTrained) return

    this.construirVocabulario()

    // Inicializar matriz de pesos de neuronas por cada intención
    this.intentsList.forEach(intent => {
      this.intentWeights[intent] = new Array(this.vocabulario.length).fill(0)
    })

    // Acumular activaciones de los ejemplos de entrenamiento
    TRAINING_DATA.forEach(item => {
      const vec = this.textoAVector(item.text)
      const weights = this.intentWeights[item.intent]
      if (weights) {
        vec.forEach((v, idx) => {
          weights[idx] += v
        })
      }
    })

    // Normalizar pesos de cada neurona
    this.intentsList.forEach(intent => {
      const weights = this.intentWeights[intent]
      const mag = Math.sqrt(weights.reduce((sum, val) => sum + val * val, 0))
      if (mag > 0) {
        this.intentWeights[intent] = weights.map(w => w / mag)
      }
    })

    this.isTrained = true
  }

  // Inferencia hacia adelante (Forward Propagation)
  async predecirIntencion(textoUsuario) {
    if (!this.isTrained) {
      await this.entrenar()
    }

    const inputVec = this.textoAVector(textoUsuario)
    const recognizedWords = inputVec.reduce((acc, v) => acc + (v > 0 ? 1 : 0), 0)

    // Si ninguna palabra del usuario coincide con el vocabulario
    if (recognizedWords === 0) {
      return {
        intent: INTENTS.CONSULTA_GENERAL,
        confidence: 0.1
      }
    }

    // Producto punto (Dot Product) de la capa Dense
    const logits = this.intentsList.map(intent => {
      const weights = this.intentWeights[intent]
      let score = 0
      for (let i = 0; i < inputVec.length; i++) {
        score += inputVec[i] * weights[i]
      }
      return score * 10 // Temperatura de escala calibrada
    })

    const probabilities = softmax(logits)

    // Obtener las dos mejores probabilidades para evaluar el margen de certeza
    const sorted = probabilities
      .map((prob, idx) => ({ prob, intent: this.intentsList[idx] }))
      .sort((a, b) => b.prob - a.prob)

    const top1 = sorted[0]
    const top2 = sorted[1]

    // Margen relativo: solo cae a CONSULTA_GENERAL si la distancia entre la primera
    // y segunda clase más probables es menor a 0.05 (ambigüedad alta)
    const MARGEN_CERTEZA = 0.05
    if (top1.prob - (top2?.prob || 0) < MARGEN_CERTEZA) {
      return {
        intent: INTENTS.CONSULTA_GENERAL,
        confidence: top1.prob
      }
    }

    return {
      intent: top1.intent,
      confidence: top1.prob
    }
  }
}

export const neuralCopilot = new CopilotNeuralEngine()

