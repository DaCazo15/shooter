/**
 * Motor Generador de Consejos y Respuestas de Pandi Copilot.
 * 
 * Regla de negocio fundamental: Siempre formula consejos prácticos, cálidos y accionables,
 * e incluye respuestas basadas en datos reales del negocio (contextoNegocio).
 */

import { INTENTS } from './dataset.js'

export function generarConsejoConversacional(intent, textoUsuario, contextoNegocio = {}) {
  let respuestaPrincipal = ''
  const textoNorm = (textoUsuario || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

  switch (intent) {
    case INTENTS.PRECIOS_MARGENES:
      respuestaPrincipal = `¡Excelente pregunta! Para fijar precios justos y rentables en creaciones artesanales, te recomiendo aplicar la fórmula de 3 pilares:

1. **Costo Total de Materiales + Merma:** Suma todos los insumos directos agregando un 5% a 10% por concepto de merma o desperdicio en el taller.
2. **Tu Mano de Obra (Horas de Trabajo):** Asígnate un sueldo por hora justo. Si tardas 2 horas y tu hora vale $5, el costo de mano de obra es $10.
3. **Margen de Ganancia del Negocio (30% al 50%):** Es lo que le queda a tu empresa para reinvertir, marketing y crecimiento después de pagar materiales y tu sueldo.

🎯 **Regla de oro:** Nunca compitas por ser el más barato; compite por acabados impecables, empaque especial y valor de marca.`
      break

    case INTENTS.STOCK_INVENTARIO: {
      const pideProveedores = /\bproveedor(es)?\b/.test(textoNorm)
      const pideDatos = /\b(cuant[oa]s?|total|valor|resumen|critico|bajo|falta[n]?|revisa|disponible|agotando|tengo|hay|registrados?|directorio|contactos?)\b/.test(textoNorm)

      // Consulta directa sobre Proveedores del taller
      if (pideProveedores) {
        const provs = contextoNegocio.proveedores || []
        const totalProvs = provs.length

        if (totalProvs === 0) {
          respuestaPrincipal = `Actualmente tienes **0 proveedores registrados** en tu directorio.

🚚 Puedes registrar a tus distribuidores y contactos de materia prima desde el módulo de **Inventario & Proveedores** para tener a mano sus teléfonos y enlaces directos de WhatsApp.`
        } else {
          const provsMuestra = provs.slice(0, 4).map(p => `• **${p.nombre || 'Proveedor'} ${p.apellido || ''}** ${p.telefono ? `(${p.telefono})` : ''} - *${p.mercancia || 'General'}*`).join('\n')
          respuestaPrincipal = `Actualmente tienes **${totalProvs} ${totalProvs === 1 ? 'proveedor registrado' : 'proveedores registrados'}** en tu directorio:

${provsMuestra}${totalProvs > 4 ? `\n• *... y ${totalProvs - 4} proveedores más.*` : ''}

💡 *Puedes ver sus datos de contacto o escribirles directo a su WhatsApp desde la pestaña de **Proveedores** en el menú Inventario.*`
        }
      } else if (pideDatos) {
        const lista = contextoNegocio.materiales || []
        const total = lista.length
        const criticos = lista.filter(m => Number(m.cantidad ?? m.stock ?? 0) <= Number(m.stockMinimo || 5))
        const valorTotal = lista.reduce((acc, m) => acc + (Number(m.cantidad ?? m.stock ?? 0) * Number(m.costoUnitario || 0)), 0)

        if (total === 0) {
          respuestaPrincipal = `Actualmente tienes **0 insumos o materiales registrados** en el inventario.

📦 Te recomiendo registrar tus materias primas principales en el módulo de **Inventario** para llevar control de mermas, costos y alertas de reposición.`
        } else {
          respuestaPrincipal = `Resumen de stock y materiales en tu taller:

📦 **Total de materiales registrados:** ${total} insumos
💰 **Valor estimado del inventario:** $${valorTotal.toFixed(2)}
⚠️ **Insumos con stock bajo o crítico:** ${criticos.length} ${criticos.length === 1 ? 'material' : 'materiales'}

${criticos.length > 0 ? `🚨 *Atención en:* ${criticos.slice(0, 3).map(c => c.nombre).join(', ')}` : '✅ *Todos tus insumos tienen niveles de stock saludables.*'}`
        }
      } else {
        respuestaPrincipal = `¡El control de materiales es el corazón del taller! Aquí tienes mis recomendaciones clave:

1. **Establece un Stock de Seguridad:** Define un mínimo para tus 5 insumos indispensables. Cuando el stock llegue a esa cifra, emite la orden de compra antes de que se agote.
2. **Agrupa tus compras con proveedores:** Comprar al por mayor o por rollos/paquetes completos te permitirá negociar entre un 15% y 25% de descuento en tus costos.
3. **Controla las mermas:** Lleva registro de los sobrantes. Muchos retazos o piezas secundarias pueden transformarse en accesorios pequeños o detalles de empaque.`
      }
      break
    }

    case INTENTS.CLIENTES_VENTAS: {
      const lista = contextoNegocio.clientes || []
      const total = lista.length

      const pideVentas = /\b(ventas?|pedidos?|facturacion|vendido|ordenes|compras?)\b/.test(textoNorm)
      const pideDatos = /\b(cuant[oa]s?|total|lista|quienes|registrados?|compradores|tengo|hay|resumen|base|directorio)\b/.test(textoNorm)

      // Consulta de Ventas / Pedidos concretados
      if (pideVentas) {
        const totalPedidos = lista.reduce((acc, c) => acc + (Number(c.cantidadPedidos) || 0), 0)
        const clientesConPedidos = lista
          .filter(c => Number(c.cantidadPedidos) > 0)
          .sort((a, b) => (Number(b.cantidadPedidos) || 0) - (Number(a.cantidadPedidos) || 0))

        if (totalPedidos === 0) {
          respuestaPrincipal = `Actualmente tienes registrado un total de **0 pedidos o ventas concretadas** en tu registro de clientes.

📈 Puedes registrar los pedidos de tus compradores directamente en la ficha de cada cliente dentro del menú **Clientes** o consultar tus balances en **Cuentas**.`
        } else {
          const topCompradores = clientesConPedidos.slice(0, 4).map(c => `• **${c.nombre || 'Cliente'}**: ${c.cantidadPedidos} ${c.cantidadPedidos === 1 ? 'pedido' : 'pedidos'}`).join('\n')
          respuestaPrincipal = `Resumen de ventas y pedidos registrados:

🛍️ **Total acumulado de pedidos/ventas:** ${totalPedidos} ${totalPedidos === 1 ? 'pedido' : 'pedidos'}
👥 **Clientes activos con compras:** ${clientesConPedidos.length}

${topCompradores ? `🏆 **Principales compradores:**\n${topCompradores}` : ''}

💡 *Puedes registrar nuevos pedidos o editar la cantidad en el módulo de **Clientes**.*`
        }
      } else if (pideDatos) {
        if (total === 0) {
          respuestaPrincipal = `Actualmente tienes **0 clientes registrados** en tu sistema. 

👥 Puedes agregar tus primeros clientes desde el menú **Clientes** para guardar sus teléfonos de WhatsApp, historial de pedidos y direcciones de entrega.`
        } else {
          const nombresMuestra = lista.slice(0, 4).map(c => `• **${c.nombre || 'Cliente'}** ${c.telefono ? `(${c.telefono})` : ''}`).join('\n')
          respuestaPrincipal = `Actualmente tienes **${total} ${total === 1 ? 'cliente registrado' : 'clientes registrados'}** en tu base de datos:

${nombresMuestra}${total > 4 ? `\n• *... y ${total - 4} clientes más.*` : ''}

💡 *Puedes gestionarlos, ver sus pedidos o escribirles directamente por WhatsApp desde el panel de **Clientes**.*`
        }
      } else {
        respuestaPrincipal = `¡Para impulsar tus ventas y cuidar la relación con tus clientes, te aconsejo lo siguiente!

1. **Regla del Anticipo (50% previo):** En pedidos personalizados, jamás inicies la elaboración sin el 50% de abono. Esto filtra a clientes dudosos y asegura los materiales.
2. **Seguimiento post-entrega:** A los 3 días de entregado el pedido, escribe un mensaje corto: *"¡Hola! ¿Cómo llegó tu pieza? Queríamos asegurarnos de que todo esté perfecto"*. Esto genera lealtad y recompra.
3. **Fotos en uso:** Pide amablemente a tus clientes que te etiqueten en sus fotos a cambio de un detalle o descuento en su siguiente compra.`
      }
      break
    }

    case INTENTS.ESTRATEGIA_MARKETING: {
      const u = contextoNegocio.user || {}
      const listaProds = contextoNegocio.catalogo || []
      const totalProds = listaProds.length
      const negocio = u.businessName || 'tu negocio'

      const pideWebLinktree = /\b(web|linktree|pagina|sitio|vitrina|arbol|portada|banner|tienda online)\b/.test(textoNorm)
      const pideFotosPackaging = /\b(fotos?|fotografia|camara|packaging|empaque|caja|bolsa|envio|reels?|tiktok|historias?)\b/.test(textoNorm)

      if (pideWebLinktree) {
        respuestaPrincipal = `🌐 **Tu Vitrina Web y Linktree Oficiales (${negocio})**:

1. 🛍️ **Tu Tienda Web Pública:**
   • Es tu catálogo digital donde tus clientes exploran tus creaciones con fotos, precios y descripción.
   • Actualmente tienes **${totalProds} ${totalProds === 1 ? 'producto activo' : 'productos activos'}** listos para recibir pedidos directamente en tu WhatsApp.

2. 🔗 **Tu Linktree Personalizado:**
   • Es tu centro de enlaces para la biografía de Instagram y TikTok.
   • Centraliza el acceso a tu catálogo web, botón directo a tu WhatsApp y redes sociales.

3. 🎨 **Personalización y Edición:**
   • Puedes cambiar colores, textos de portada, cintas promocionales y banners desde el módulo **Web & Linktree** en tu menú administrativo.

💡 *Consejo de Oro:* Coloca el enlace de tu Linktree en la biografía de tus redes y destaca tus creaciones estrella para convertir visitas en ventas por WhatsApp.`
      } else if (pideFotosPackaging) {
        respuestaPrincipal = `📸 **Consejos de Fotografía, Packaging y Redes:**

1. **Fotografía con Luz Natural:** Usa luz indirecta de ventana y fondos neutros (tonos crema, madera o lino) para resaltar texturas y acabados.
2. **Packaging con Experiencia de Unboxing:** Incluye una tarjeta de agradecimiento escrita a mano, aroma agradable en la caja o papel seda con sellos personalizados.
3. **Muestra el Proceso de Creación en Video:** A las personas les encanta ver el "detrás de cámaras": la selección de materiales, el armado y el empaque final.`
      } else {
        respuestaPrincipal = `¡Tu vitrina digital y redes son tu mejor canal de ventas! Aquí tienes ideas clave:

1. **Muestra el Proceso de Creación:** El contenido del taller (selección de materiales, armado y pruebas de calidad) genera mucha más confianza y ventas que fotos estáticas.
2. **Colecciones Limitadas:** Anuncia fechas de lanzamiento con cupos o piezas limitadas (ej. *"Solo 8 piezas exclusivas este fin de semana"*).
3. **Aprovecha tu Tienda Web y Linktree:** Mantén tus productos destacados actualizados en tu catálogo para que tus seguidores de redes compren en un clic por WhatsApp.`
      }
      break
    }

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

      const pideSoloWA = /\b(whatsapp|guasap|wasap)\b/.test(textoNorm) && !/\b(todo|todos|perfil|cuenta|resumen|datos)\b/.test(textoNorm)
      const pideSoloTel = /\b(telefono|llamadas?|celular|numero de contacto)\b/.test(textoNorm) && !/\bwhatsapp|guasap|wasap\b/.test(textoNorm) && !/\b(todo|todos|perfil|cuenta|resumen|datos)\b/.test(textoNorm)
      const pideSoloCorreo = /\b(correo|email|mail)\b/.test(textoNorm) && !/\b(todo|todos|perfil|cuenta|resumen|datos)\b/.test(textoNorm)
      const pideSoloIG = /\b(instagram|ig|redes)\b/.test(textoNorm) && !/\b(todo|todos|perfil|cuenta|resumen|datos)\b/.test(textoNorm)
      const pideSoloMoneda = /\b(moneda|divisa|simbolo)\b/.test(textoNorm) && !/\b(todo|todos|perfil|cuenta|resumen|datos)\b/.test(textoNorm)
      const pideSoloNegocio = /\b(nombre|tienda|empresa)\b/.test(textoNorm) && !/\b(todo|todos|perfil|cuenta|resumen|datos)\b/.test(textoNorm)

      if (pideSoloWA) {
        respuestaPrincipal = `💬 Tu número de **WhatsApp de ventas** registrado es: \`${wa}\``
      } else if (pideSoloTel) {
        respuestaPrincipal = `📞 Tu **número de teléfono de contacto** registrado es: \`${tel}\``
      } else if (pideSoloCorreo) {
        respuestaPrincipal = `✉️ El **correo electrónico** asociado a tu cuenta es: \`${correo}\``
      } else if (pideSoloIG) {
        respuestaPrincipal = `📸 Tu cuenta de **Instagram** configurada es: \`${ig}\``
      } else if (pideSoloMoneda) {
        respuestaPrincipal = `💵 Tu **moneda configurada** en el sistema es: **${moneda}**`
      } else if (pideSoloNegocio) {
        respuestaPrincipal = `🏷️ El **nombre de tu negocio** registrado es: **${negocio}**`
      } else {
        respuestaPrincipal = `Aquí tienes los datos oficiales registrados en tu cuenta y perfil de negocio **${negocio}**:

📞 **Teléfono de Contacto / Llamadas:** \`${tel}\`
💬 **WhatsApp de Ventas Directas:** \`${wa}\`
✉️ **Correo electrónico:** \`${correo}\`
📸 **Instagram:** \`${ig}\`
💵 **Moneda configurada:** ${moneda}

*(Puedes actualizar cualquiera de estos datos en cualquier momento desde el menú **Configurar Perfil**).*`
      }
      break
    }

    case INTENTS.METRICAS_CATALOGO: {
      const lista = contextoNegocio.catalogo || []
      const total = lista.length
      const pideMasVendido = /\b(mas vendid[oa]s?|lo mas vendido|destacad[oa]s?|populares?|estrella|favorit[oa]s?|top|mas pedido)\b/.test(textoNorm)
      const pideMasCaro = /\b(mas car[oa]s?|mayor precio|mas costos[oa]s?|mas valios[oa]s?)\b/.test(textoNorm)
      const pideMasBarato = /\b(mas barat[oa]s?|mas economic[oa]s?|menor precio)\b/.test(textoNorm)

      if (total === 0) {
        respuestaPrincipal = `Actualmente tienes **0 productos publicados** en tu catálogo público.

🛍️ Puedes crear y publicar tus creaciones desde el módulo de **Catálogo** para que aparezcan automáticamente en tu vitrina web y Linktree.`
      } else if (pideMasVendido) {
        const destacados = lista.filter(p => !!p.destacado)
        if (destacados.length > 0) {
          const listado = destacados.map(p => `• ⭐ **${p.titulo || p.nombre || 'Producto'}** — $${p.precio || 0} *(${p.categoria || 'General'})*`).join('\n')
          respuestaPrincipal = `Tus productos **destacados y estrella** en el catálogo son (${destacados.length}):

${listado}

💡 *Estos artículos aparecen resaltados en primer lugar en tu tienda web.*`
        } else {
          const muestra = lista.slice(0, 3).map(p => `• **${p.titulo || p.nombre || 'Producto'}** — $${p.precio || 0} *(${p.categoria || 'General'})*`).join('\n')
          respuestaPrincipal = `Actualmente tienes **${total} ${total === 1 ? 'producto' : 'productos'}** en tu catálogo, pero no has marcado ninguno como **Destacado / Más vendido**.

Tus productos actuales incluyen:
${muestra}

💡 *Consejo:* Para que un producto aparezca como lo más vendido o artículo estrella en tu tienda web, edítalo en el módulo de **Catálogo** y activa la opción **"Destacar producto"**.`
        }
      } else if (pideMasCaro) {
        const ordenados = [...lista].sort((a, b) => (Number(b.precio) || 0) - (Number(a.precio) || 0))
        const top3 = ordenados.slice(0, 3).map(p => `• 💎 **${p.titulo || p.nombre || 'Producto'}** — $${p.precio || 0} *(Costo base: $${p.costo || 0})*`).join('\n')
        respuestaPrincipal = `Tus productos con **mayor precio** en el catálogo son:

${top3}`
      } else if (pideMasBarato) {
        const ordenados = [...lista].sort((a, b) => (Number(a.precio) || 0) - (Number(b.precio) || 0))
        const top3 = ordenados.slice(0, 3).map(p => `• 🏷️ **${p.titulo || p.nombre || 'Producto'}** — $${p.precio || 0}`).join('\n')
        respuestaPrincipal = `Tus productos más **económicos o accesibles** en el catálogo son:

${top3}`
      } else {
        const prodsMuestra = lista.slice(0, 4).map(p => `• **${p.titulo || p.nombre || 'Producto'}** — $${p.precio || 0}`).join('\n')
        respuestaPrincipal = `Tienes **${total} ${total === 1 ? 'producto activo' : 'productos activos'}** en tu catálogo público:

${prodsMuestra}${total > 4 ? `\n• *... y ${total - 4} artículos más.*` : ''}

✨ *Tus clientes pueden verlos y pedirlos directamente desde tu vitrina web.*`
      }
      break
    }

    case INTENTS.SALUDO_AYUDA:
      return `¡Hola! Soy **Pandi Copilot** 🐼, tu asistente inteligente del taller. 

Puedo ayudarte con:
• **Cálculo y revisión de precios y márgenes** 💰
• **Control y alertas de insumos en inventario y proveedores** 📦
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
