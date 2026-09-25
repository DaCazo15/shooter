/**
 * Motor Generador de Consejos y Respuestas de Pandi Copilot.
 * 
 * Regla de negocio fundamental: Siempre formula consejos prácticos, cálidos y accionables,
 * e incluye obligatoriamente una sugerencia de segunda opinión antes de decisiones críticas.
 */

import { INTENTS } from './dataset.js'

export function generarConsejoConversacional(intent, textoUsuario, contextoNegocio = {}) {
  let respuestaPrincipal = ''

  switch (intent) {
    case INTENTS.PRECIOS_MARGENES:
      respuestaPrincipal = `¡Excelente pregunta! Para fijar precios justos y rentables en creaciones artesanales, te recomiendo aplicar la fórmula de 3 pilares:

1. **Costo Total de Materiales + Merma:** Suma todos los insumos directos agregando un 5% a 10% por concepto de merma o desperdicio en el taller.
2. **Tu Mano de Obra (Horas de Trabajo):** Asígnate un sueldo por hora justo. Si tardas 2 horas y tu hora vale $5, el costo de mano de obra es $10.
3. **Margen de Ganancia del Negocio (30% al 50%):** Es lo que le queda a tu empresa para reinvertir, marketing y crecimiento después de pagar materiales y tu sueldo.

🎯 **Regla de oro:** Nunca compitas por ser el más barato; compite por acabados impecables, empaque especial y valor de marca.`
      break

    case INTENTS.STOCK_INVENTARIO:
      respuestaPrincipal = `¡El control de materiales es el corazón del taller! Aquí tienes mis recomendaciones clave:

1. **Establece un Stock de Seguridad:** Define un mínimo para tus 5 insumos indispensables. Cuando el stock llegue a esa cifra, emite la orden de compra antes de que se agote.
2. **Agrupa tus compras con proveedores:** Comprar al por mayor o por rollos/paquetes completos te permitirá negociar entre un 15% y 25% de descuento en tus costos.
3. **Controla las mermas:** Lleva registro de los sobrantes. Muchos retazos o piezas secundarias pueden transformarse en accesorios pequeños o detalles de empaque.`
      break

    case INTENTS.CLIENTES_VENTAS:
      respuestaPrincipal = `¡Para impulsar tus ventas y cuidar la relación con tus clientes, te aconsejo lo siguiente!

1. **Regla del Anticipo (50% previo):** En pedidos personalizados, jamás inicies la elaboración sin el 50% de abono. Esto filtra a clientes dudosos y asegura los materiales.
2. **Seguimiento post-entrega:** A los 3 días de entregado el pedido, escribe un mensaje corto: *"¡Hola! ¿Cómo llegó tu pieza? Queríamos asegurarnos de que todo esté perfecto"*. Esto genera lealtad y recompra.
3. **Fotos en uso:** Pide amablemente a tus clientes que te etiqueten en sus fotos a cambio de un detalle o descuento en su siguiente compra.`
      break

    case INTENTS.ESTRATEGIA_MARKETING:
      respuestaPrincipal = `¡Tu vitrina digital y redes son tu mejor canal! Aquí tienes ideas prácticas:

1. **Muestra el Proceso de Creación:** A las personas les fascina ver el detrás de cámara: cómo seleccionas los materiales, cómo ensamblas y el momento en que empacas el pedido.
2. **Fotografía con luz natural:** Usa fondos neutros (tonos crema, madera o lino) y luz indirecta de ventana para resaltar las texturas y brillos de tus piezas.
3. **Colecciones limitadas con fecha de lanzamiento:** Crea expectativa anunciando fechas límite (ej. *"Solo 10 unidades disponibles este viernes"*).`
      break

    case INTENTS.GESTION_TIEMPO:
      respuestaPrincipal = `¡La saturación en el taller es común cuando el negocio crece! Prueba estas pautas:

1. **Producción por Lotes:** En lugar de hacer una pieza completa de inicio a fin, agrupa tareas: corta todos los materiales el lunes, ensambla el martes y pule/empaca el miércoles.
2. **Comunica plazos holgados:** Si sabes que tardas 3 días, dile al cliente 5 a 6 días hábiles. Es mejor entregar antes de lo prometido que retrasarse.
3. **Estandariza tus productos estrella:** Aquellos modelos que más vendes deben tener medidas y procesos anotados para elaborarlos en menor tiempo.`
      break

    case INTENTS.DATOS_CUENTA_PERFIL: {
      const u = contextoNegocio.user || {}
      const tel = u.phone ? u.phone : '*(No registrado aún en Perfil)*'
      const wa = u.whatsapp ? u.whatsapp : '*(No registrado aún en Perfil)*'
      const negocio = u.businessName || 'Mi Negocio'
      const correo = u.email || 'Sin correo asignado'
      const ig = u.instagram || 'Sin Instagram configurado'
      const moneda = `${u.currencySymbol || '$'} (${u.currency || 'USD'})`

      respuestaPrincipal = `Aquí tienes los datos oficiales registrados en tu cuenta y perfil de negocio **${negocio}**:

📞 **Teléfono de Contacto / Llamadas:** \`${tel}\`
💬 **WhatsApp de Ventas Directas:** \`${wa}\`
✉️ **Correo electrónico:** \`${correo}\`
📸 **Instagram:** \`${ig}\`
💵 **Moneda configurada:** ${moneda}

*(Puedes actualizar cualquiera de estos datos en cualquier momento desde el menú **Configurar Perfil**).*`
      break
    }

    case INTENTS.METRICAS_CLIENTES: {
      const lista = contextoNegocio.clientes || []
      const total = lista.length
      if (total === 0) {
        respuestaPrincipal = `Actualmente tienes **0 clientes registrados** en tu sistema. 

👥 Puedes agregar tus primeros clientes desde el menú **Clientes** para guardar sus teléfonos de WhatsApp, historial de pedidos y direcciones de entrega.`
      } else {
        const nombresMuestra = lista.slice(0, 4).map(c => `• **${c.nombre || 'Cliente'}** ${c.telefono ? `(${c.telefono})` : ''}`).join('\n')
        respuestaPrincipal = `Actualmente tienes **${total} ${total === 1 ? 'cliente registrado' : 'clientes registrados'}** en tu base de datos:

${nombresMuestra}${total > 4 ? `\n• *... y ${total - 4} clientes más.*` : ''}

💡 *Puedes gestionarlos, ver sus pedidos o escribirles directamente por WhatsApp desde el panel de **Clientes**.*`
      }
      break
    }

    case INTENTS.METRICAS_CATALOGO: {
      const lista = contextoNegocio.catalogo || []
      const total = lista.length
      if (total === 0) {
        respuestaPrincipal = `Actualmente tienes **0 productos publicados** en tu catálogo.

🛍️ Puedes crear tus creaciones en el módulo de **Catálogo** para que aparezcan automáticamente en tu tienda web y Linktree.`
      } else {
        const prodsMuestra = lista.slice(0, 4).map(p => `• **${p.nombre || p.titulo || 'Producto'}** - $${p.precio || 0}`).join('\n')
        respuestaPrincipal = `Tienes **${total} ${total === 1 ? 'producto activo' : 'productos activos'}** en tu catálogo público:

${prodsMuestra}${total > 4 ? `\n• *... y ${total - 4} artículos más.*` : ''}

✨ *Tus clientes pueden verlos y pedirlos directamente desde tu vitrina web.*`
      }
      break
    }

    case INTENTS.METRICAS_INVENTARIO: {
      const lista = contextoNegocio.materiales || []
      const total = lista.length
      const criticos = lista.filter(m => Number(m.stock || 0) <= Number(m.stockMinimo || 5))
      const valorTotal = lista.reduce((acc, m) => acc + (Number(m.stock || 0) * Number(m.costoUnitario || 0)), 0)

      if (total === 0) {
        respuestaPrincipal = `Actualmente tienes **0 insumos o materiales registrados** en el inventario.

📦 Te recomiendo registrar tus materias primas principales en el módulo de **Inventario** para llevar control de mermas y costos.`
      } else {
        respuestaPrincipal = `Resumen de stock de tu taller:

📦 **Total de materiales registrados:** ${total} insumos
💰 **Valor estimado del inventario:** $${valorTotal.toFixed(2)}
⚠️ **Insumos con stock bajo o crítico:** ${criticos.length} ${criticos.length === 1 ? 'material' : 'materiales'}

${criticos.length > 0 ? `🚨 *Atención en:* ${criticos.slice(0, 3).map(c => c.nombre).join(', ')}` : '✅ *Todos tus insumos tienen niveles de stock saludables.*'}`
      }
      break
    }

    case INTENTS.SALUDO_AYUDA:
      return `¡Hola! Soy **Pandi Copilot** 🐼, tu asistente inteligente del taller. 

Puedo ayudarte con:
• **Cálculo y revisión de precios y márgenes** 💰
• **Control y alertas de insumos en inventario** 📦
• **Estrategias para ventas y clientes** 👥
• **Organización y optimización de tiempos en el taller** ⏱️

¿Qué consulta o decisión tienes en mente hoy?`

    case INTENTS.DESPEDIDA_GRACIAS:
      return `¡Con mucho gusto! Me alegra ser de utilidad para tu taller. Aquí estaré cuando necesites otra consulta o recomendación. ¡Mucho éxito con tus pedidos hoy! 🐼✨`

    default:
      respuestaPrincipal = `He analizado tu consulta. En los negocios artesanales, la clave para cualquier reto está en mantener claros tus números (costos fijos y variables), cuidar la calidad en cada entrega y mantener una comunicación cercana y transparente con tus clientes.

Si deseas que profundicemos en algún aspecto específico (precios, stock, ventas o tiempo), cuéntame más detalles sobre lo que estás viviendo en tu taller.`
      break
  }

  return `${respuestaPrincipal}`
}
