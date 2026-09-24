/**
 * Herramientas de consulta de Firestore para el Copiloto de Pandibuy (Claude Tool Use)
 *
 * Todas las funciones están aisladas y scoped a negocios/{uid}/...
 * Las respuestas están compactadas y resumidas para minimizar el uso de tokens en el LLM.
 */

import admin from 'firebase-admin'

const getDb = () => admin.firestore()

/**
 * 1. Consultar Catálogo de Productos
 * Retorna resumen financiero y productos compactados.
 */
export async function consultarCatalogo({ categoria, soloDestacados = false } = {}, uid) {
  if (!uid) throw new Error('UID de negocio requerido')
  const db = getDb()

  let q = db.collection('negocios').doc(uid).collection('catalogo')

  if (categoria && categoria !== 'Todos') {
    q = q.where('categoria', '==', categoria)
  }

  const snapshot = await q.get()
  let productos = snapshot.docs.map(doc => {
    const d = doc.data()
    const precio = Number(d.precio) || 0
    const costo = Number(d.costo) || 0
    const stock = Number(d.stock) || 0
    const margen = precio > 0 ? (((precio - costo) / precio) * 100).toFixed(1) : 0

    return {
      id: doc.id,
      titulo: d.titulo,
      cat: d.categoria || 'General',
      precio,
      costo,
      stock,
      margen: `${margen}%`,
      destacado: !!d.destacado
    }
  })

  if (soloDestacados) {
    productos = productos.filter(p => p.destacado)
  }

  // Resumen financiero global del catálogo
  const totalItems = productos.length
  const valorTotalVenta = productos.reduce((acc, p) => acc + (p.precio * (p.stock || 1)), 0)
  const costoTotalInversion = productos.reduce((acc, p) => acc + (p.costo * (p.stock || 1)), 0)
  const sinStock = productos.filter(p => p.stock === 0).length

  return {
    resumen: {
      totalProductos: totalItems,
      sinStock,
      valorTotalStock: `$${valorTotalVenta.toFixed(2)}`,
      costoTotalInversion: `$${costoTotalInversion.toFixed(2)}`,
      gananciaProyectada: `$${(valorTotalVenta - costoTotalInversion).toFixed(2)}`
    },
    // Limitar listado a máximo 20 items para no inflar tokens
    productos: productos.slice(0, 20)
  }
}

/**
 * 2. Consultar Inventario de Insumos y Materias Primas
 * Prioriza y alerta sobre insumos bajo stock mínimo.
 */
export async function consultarInventario({ soloStockBajo = false } = {}, uid) {
  if (!uid) throw new Error('UID de negocio requerido')
  const db = getDb()

  const snapshot = await db.collection('negocios').doc(uid).collection('inventario').get()

  let insumos = snapshot.docs.map(doc => {
    const d = doc.data()
    const cantidad = Number(d.cantidad) || 0
    const stockMinimo = Number(d.stockMinimo) || 0
    const costoUnitario = Number(d.costoUnitario) || 0
    const esCritico = cantidad <= stockMinimo

    return {
      id: doc.id,
      nombre: d.nombre,
      categoria: d.categoria || 'General',
      stock: `${cantidad} ${d.unidad || 'unidades'}`,
      minimo: stockMinimo,
      costoUnit: `$${costoUnitario.toFixed(2)}`,
      valorTotal: `$${(cantidad * costoUnitario).toFixed(2)}`,
      proveedor: d.proveedor || 'Sin asignar',
      alertaCritica: esCritico
    }
  })

  const totalInsumos = insumos.length
  const criticos = insumos.filter(i => i.alertaCritica)
  const valorTotalInventario = insumos.reduce((acc, i) => {
    const val = parseFloat(i.valorTotal.replace('$', '')) || 0
    return acc + val
  }, 0)

  if (soloStockBajo) {
    insumos = criticos
  }

  return {
    resumen: {
      totalInsumos,
      insumosEnRiesgo: criticos.length,
      valorTotalInventario: `$${valorTotalInventario.toFixed(2)}`
    },
    // Retorna primero los críticos y limita a 20 items
    insumos: (soloStockBajo ? criticos : [...criticos, ...insumos.filter(i => !i.alertaCritica)]).slice(0, 20)
  }
}

/**
 * 3. Consultar Clientes y Comportamiento de Pedidos
 * Permite filtrar por nombre/teléfono o listar los clientes más recurrentes.
 */
export async function consultarClientes({ filtro = '' } = {}, uid) {
  if (!uid) throw new Error('UID de negocio requerido')
  const db = getDb()

  const snapshot = await db.collection('negocios').doc(uid).collection('clientes').get()

  let clientes = snapshot.docs.map(doc => {
    const d = doc.data()
    return {
      id: doc.id,
      nombre: `${d.nombre || ''} ${d.apellido || ''}`.trim(),
      telefono: d.telefono || 'N/A',
      pedidos: Number(d.cantidadPedidos) || 0,
      direccion: d.direccion || ''
    }
  })

  // Aplicar filtro de búsqueda si se envió
  if (filtro.trim()) {
    const q = filtro.toLowerCase()
    clientes = clientes.filter(c => 
      c.nombre.toLowerCase().includes(q) || 
      c.telefono.includes(q) || 
      c.direccion.toLowerCase().includes(q)
    )
  }

  // Ordenar por clientes con más pedidos
  clientes.sort((a, b) => b.pedidos - a.pedidos)

  const totalClientes = clientes.length
  const totalPedidosAcumulados = clientes.reduce((acc, c) => acc + c.pedidos, 0)

  return {
    resumen: {
      totalClientes,
      totalPedidosHistoricos: totalPedidosAcumulados,
      clienteMasFrecuente: clientes[0]?.nombre || 'Ninguno'
    },
    clientes: clientes.slice(0, 15)
  }
}

/**
 * 4. Consultar Cuentas y Saldos Financieros
 * Agrupa saldos por moneda y estados (activas, pendientes).
 */
export async function consultarCuentas({ estado = 'todas' } = {}, uid) {
  if (!uid) throw new Error('UID de negocio requerido')
  const db = getDb()

  const snapshot = await db.collection('cuentas').where('uid', '==', uid).get()

  const cuentas = snapshot.docs.map(doc => {
    const d = doc.data()
    return {
      id: doc.id,
      nombre: d.nombre,
      moneda: d.moneda || 'USD',
      saldoActual: Number(d.saldoActual ?? d.saldoInicial) || 0,
      saldoInicial: Number(d.saldoInicial) || 0
    }
  })

  // Agrupación de balances por divisa
  const balancePorMoneda = cuentas.reduce((acc, c) => {
    acc[c.moneda] = (acc[c.moneda] || 0) + c.saldoActual
    return acc
  }, {})

  return {
    resumen: {
      totalCuentas: cuentas.length,
      balancePorMoneda
    },
    cuentas
  }
}

/**
 * 5. Consultar Ventas y Pedidos Recientes
 * Consulta la actividad de ventas de los últimos N días.
 */
export async function consultarVentasRecientes({ dias = 30 } = {}, uid) {
  if (!uid) throw new Error('UID de negocio requerido')
  const db = getDb()

  const fechaLimite = new Date()
  fechaLimite.setDate(fechaLimite.getDate() - Number(dias))

  // Consulta en subcolección pedidos o ventas
  const snapshot = await db
    .collection('negocios')
    .doc(uid)
    .collection('pedidos')
    .where('fechaCreacion', '>=', fechaLimite)
    .get()
    .catch(async () => {
      // Fallback si no tiene índice compuesto o está en 'ventas'
      return await db.collection('negocios').doc(uid).collection('pedidos').limit(20).get()
    })

  const pedidos = snapshot.docs.map(doc => {
    const d = doc.data()
    return {
      id: doc.id,
      cliente: d.clienteNombre || 'Cliente General',
      total: Number(d.total) || 0,
      estado: d.estado || 'completado',
      itemsCount: Array.isArray(d.productos) ? d.productos.length : 1,
      fecha: d.fechaCreacion?.toDate ? d.fechaCreacion.toDate().toISOString().split('T')[0] : 'Reciente'
    }
  })

  const montoTotal = pedidos.reduce((acc, p) => acc + p.total, 0)
  const ticketPromedio = pedidos.length > 0 ? (montoTotal / pedidos.length).toFixed(2) : 0

  return {
    resumen: {
      periodoDias: dias,
      totalVentas: pedidos.length,
      ingresosTotales: `$${montoTotal.toFixed(2)}`,
      ticketPromedio: `$${ticketPromedio}`
    },
    ultimosPedidos: pedidos.slice(0, 15)
  }
}

/**
 * Mapa de despacho para ejecución dinámica desde el loop de Claude
 */
export const toolExecutors = {
  consultar_catalogo: (input, uid) => consultarCatalogo(input, uid),
  consultar_inventario: (input, uid) => consultarInventario(input, uid),
  consultar_clientes: (input, uid) => consultarClientes(input, uid),
  consultar_cuentas: (input, uid) => consultarCuentas(input, uid),
  consultar_ventas_recientes: (input, uid) => consultarVentasRecientes(input, uid)
}
