/**
 * Motor de Diagnóstico y Análisis de Negocio para Pandibuy
 *
 * Cruza datos de:
 * 1. Catálogo (Precios, Costos, Stock de Productos terminados)
 * 2. Inventario (Stock de Insumos/Materiales y Proveedores)
 * 3. Pedidos / Ventas (Frecuencia, Unidades Vendidas, Fechas)
 * 4. Clientes (Última compra, Frecuencia histórica)
 *
 * Retorna una lista estructurada de insights accionables categorizados por severidad.
 */

import admin from 'firebase-admin'

const getDb = () => admin.firestore()

/**
 * Analiza el estado del negocio y genera insights accionables.
 * @param {string} uid - ID del negocio / usuario
 * @returns {Promise<Object>} Resumen de salud del negocio + array de insights
 */
export async function analizarNegocio(uid) {
  if (!uid) throw new Error('UID de negocio requerido para el análisis')
  const db = getDb()
  const negocioRef = db.collection('negocios').doc(uid)

  const ahora = new Date()
  const hace30Dias = new Date(ahora.getTime() - 30 * 24 * 60 * 60 * 1000)
  const hace60Dias = new Date(ahora.getTime() - 60 * 24 * 60 * 60 * 1000)

  // 1. Cargar colecciones en paralelo
  const [snapCatalogo, snapInventario, snapClientes, snapPedidos, snapCuentas] = await Promise.all([
    negocioRef.collection('catalogo').get(),
    negocioRef.collection('inventario').get(),
    negocioRef.collection('clientes').get(),
    negocioRef.collection('pedidos').get().catch(() => ({ docs: [] })),
    db.collection('cuentas').where('uid', '==', uid).get().catch(() => ({ docs: [] }))
  ])

  const catalogo = snapCatalogo.docs.map(d => ({ id: d.id, ...d.data() }))
  const inventario = snapInventario.docs.map(d => ({ id: d.id, ...d.data() }))
  const clientes = snapClientes.docs.map(d => ({ id: d.id, ...d.data() }))
  const pedidos = snapPedidos.docs ? snapPedidos.docs.map(d => ({ id: d.id, ...d.data() })) : []
  const cuentas = snapCuentas.docs ? snapCuentas.docs.map(d => ({ id: d.id, ...d.data() })) : []

  const totalRegistros = catalogo.length + inventario.length + clientes.length + pedidos.length + cuentas.length
  const tieneData = totalRegistros > 0

  const insights = []

  // Si no tiene datos en ninguna colección, retornar diagnóstico vacío temprano
  if (!tieneData) {
    return {
      salud: {
        tieneData: false,
        totalRegistros: 0,
        totalProductos: 0,
        totalInsumos: 0,
        totalClientes: 0,
        totalInsights: 0,
        criticos: 0,
        alertas: 0,
        oportunidades: 0,
        fechaAnalisis: ahora.toISOString()
      },
      insights: []
    }
  }

  // -------------------------------------------------------------
  // VECTOR 1: Productos con Margen de Ganancia Bajo (< 25%)
  // -------------------------------------------------------------
  catalogo.forEach(prod => {
    const precio = Number(prod.precio) || 0
    const costo = Number(prod.costo) || 0
    if (precio > 0) {
      const margenPct = ((precio - costo) / precio) * 100
      if (margenPct < 25) {
        insights.push({
          id: `margen_bajo_${prod.id}`,
          tipo: 'margen_bajo',
          severidad: margenPct < 15 ? 'critico' : 'alerta',
          titulo: `Margen ajustado en "${prod.titulo}"`,
          mensaje: `Tiene un margen de ganancia del ${margenPct.toFixed(1)}% (Costo: $${costo.toFixed(2)} vs Precio: $${precio.toFixed(2)}).`,
          sugerencia: `Ajusta el precio a mínimo $${(costo / 0.7).toFixed(2)} para obtener al menos un 30% de margen saludable.`,
          entidadId: prod.id
        })
      }
    }
  })

  // -------------------------------------------------------------
  // VECTOR 2: Insumos y Materias Primas en Stock Crítico
  // -------------------------------------------------------------
  inventario.forEach(item => {
    const cant = Number(item.cantidad) || 0
    const min = Number(item.stockMinimo) || 0
    if (cant <= min) {
      insights.push({
        id: `insumo_critico_${item.id}`,
        tipo: 'insumo_critico',
        severidad: cant === 0 ? 'critico' : 'alerta',
        titulo: `Insumo por agotarse: "${item.nombre}"`,
        mensaje: `Te quedan solo ${cant} ${item.unidad || 'unidades'} (mínimo recomendado: ${min}).`,
        sugerencia: item.proveedor 
          ? `Contacta al proveedor "${item.proveedor}" para reponer stock antes de frenar pedidos.`
          : `Asigna un proveedor y reabastece este material para no parar producción.`,
        entidadId: item.id
      })
    }
  })

  // -------------------------------------------------------------
  // VECTOR 3: Productos sin movimiento en los últimos 30 días
  // -------------------------------------------------------------
  if (pedidos.length > 0 && catalogo.length > 0) {
    const pedidosRecientes = pedidos.filter(p => {
      const fecha = p.fechaCreacion?.toDate ? p.fechaCreacion.toDate() : new Date(p.fechaCreacion || 0)
      return fecha >= hace30Dias
    })

    const ventasPorProducto = {}
    pedidosRecientes.forEach(p => {
      if (Array.isArray(p.productos)) {
        p.productos.forEach(item => {
          const prodId = item.id || item.titulo
          ventasPorProducto[prodId] = (ventasPorProducto[prodId] || 0) + (Number(item.cantidad) || 1)
        })
      }
    })

    catalogo.forEach(prod => {
      const vendidos = ventasPorProducto[prod.id] || ventasPorProducto[prod.titulo] || 0
      const stock = Number(prod.stock) || 0
      if (vendidos === 0 && stock > 0) {
        insights.push({
          id: `sin_movimiento_${prod.id}`,
          tipo: 'inventario_estancado',
          severidad: 'oportunidad',
          titulo: `Producto sin ventas recientes: "${prod.titulo}"`,
          mensaje: `Tienes ${stock} unidades en stock y no registra ventas en los últimos 30 días.`,
          sugerencia: `Márcalo como "Destacado" en tu vitrina web o crea una promoción por WhatsApp / Linktree para rotarlo.`,
          entidadId: prod.id
        })
      } else if (vendidos >= 5 && stock <= 2) {
        insights.push({
          id: `alta_demanda_poco_stock_${prod.id}`,
          tipo: 'alta_demanda_riesgo',
          severidad: 'critico',
          titulo: `Alta demanda y poco stock en "${prod.titulo}"`,
          mensaje: `Vendiste ${vendidos} unidades este mes y solo te quedan ${stock} en stock.`,
          sugerencia: `Prioriza fabricar más piezas de este modelo para no perder ventas.`,
          entidadId: prod.id
        })
      }
    })
  }

  // -------------------------------------------------------------
  // VECTOR 4: Clientes Frecuentes Inactivos (> 45 días sin comprar)
  // -------------------------------------------------------------
  clientes.forEach(cli => {
    const pedidosTotales = Number(cli.cantidadPedidos) || 0
    if (pedidosTotales >= 2) {
      const fechaUltima = cli.ultimaCompra?.toDate ? cli.ultimaCompra.toDate() : (cli.actualizadoEn?.toDate ? cli.actualizadoEn.toDate() : null)
      if (fechaUltima && fechaUltima < hace60Dias) {
        insights.push({
          id: `cliente_inactivo_${cli.id}`,
          tipo: 'cliente_inactivo',
          severidad: 'oportunidad',
          titulo: `Cliente frecuente inactivo: ${cli.nombre}`,
          mensaje: `Ha realizado ${pedidosTotales} compras antes, pero no pide desde hace más de 60 días.`,
          sugerencia: `Escríbele un mensaje personalizado por WhatsApp mostrándole las piezas nuevas de tu catálogo.`,
          entidadId: cli.id
        })
      }
    }
  })

  // -------------------------------------------------------------
  // Resumen Ejecutivo del Diagnóstico
  // -------------------------------------------------------------
  const resumenSalud = {
    tieneData: true,
    totalRegistros,
    totalProductos: catalogo.length,
    totalInsumos: inventario.length,
    totalClientes: clientes.length,
    totalInsights: insights.length,
    criticos: insights.filter(i => i.severidad === 'critico').length,
    alertas: insights.filter(i => i.severidad === 'alerta').length,
    oportunidades: insights.filter(i => i.severidad === 'oportunidad').length,
    fechaAnalisis: ahora.toISOString()
  }

  return {
    salud: resumenSalud,
    insights
  }
}

/**
 * Formatea los insights en un bloque de texto conciso para inyectar en el contexto inicial de Claude.
 * @param {Array} insights - Lista de insights devueltos por analizarNegocio
 * @returns {string} Texto formateado para el System Prompt / Contexto del Copiloto
 */
export function formatearInsightsParaPrompt(insights = []) {
  if (!insights.length) {
    return 'Diagnóstico del negocio: Todo se encuentra en orden (sin alertas de stock bajo ni anomalías de precios).'
  }

  const lineas = ['DIAGNÓSTICO PROACTIVO ACTUAL DEL NEGOCIO (Menciona estos puntos al iniciar si son críticos):']
  
  insights.slice(0, 5).forEach((ins, idx) => {
    const icon = ins.severidad === 'critico' ? '🚨 [CRÍTICO]' : (ins.severidad === 'alerta' ? '⚠️ [ALERTA]' : '💡 [OPORTUNIDAD]')
    lineas.push(`${idx + 1}. ${icon} ${ins.titulo}: ${ins.mensaje} -> Sugerencia: ${ins.sugerencia}`)
  })

  return lineas.join('\n')
}
