/**
 * Dataset de entrenamiento para el clasificador de intenciones conversacionales de Pandi Copilot.
 * Especializado en talleres de artesanía, joyería, confección y pequeños comercios.
 */

export const INTENTS = {
  PRECIOS_MARGENES: 'precios_margenes',
  STOCK_INVENTARIO: 'stock_inventario',
  CLIENTES_VENTAS: 'clientes_ventas',
  ESTRATEGIA_MARKETING: 'estrategia_marketing',
  GESTION_TIEMPO: 'gestion_tiempo',
  DATOS_CUENTA_PERFIL: 'datos_cuenta_perfil',
  METRICAS_CLIENTES: 'metricas_clientes',
  METRICAS_CATALOGO: 'metricas_catalogo',
  METRICAS_INVENTARIO: 'metricas_inventario',
  SALUDO_AYUDA: 'saludo_ayuda',
  DESPEDIDA_GRACIAS: 'despedida_gracias',
  CONSULTA_GENERAL: 'consulta_general'
}

export const TRAINING_DATA = [
  // --- PRECIOS Y MÁRGENES ---
  { text: '¿Cómo calculo el precio de mis productos?', intent: INTENTS.PRECIOS_MARGENES },
  { text: '¿Cuánto margen de ganancia debería tener en artesanías?', intent: INTENTS.PRECIOS_MARGENES },
  { text: 'Siento que estoy cobrando muy barato', intent: INTENTS.PRECIOS_MARGENES },
  { text: '¿Cómo sé si estoy ganando o perdiendo dinero?', intent: INTENTS.PRECIOS_MARGENES },
  { text: '¿Debo subir mis precios por la inflación?', intent: INTENTS.PRECIOS_MARGENES },
  { text: 'Calculadora de costos y ganancia neta', intent: INTENTS.PRECIOS_MARGENES },
  { text: '¿Cómo incluyo mi mano de obra y tiempo en el costo?', intent: INTENTS.PRECIOS_MARGENES },
  { text: 'Los clientes me piden mucho descuento y rebajas', intent: INTENTS.PRECIOS_MARGENES },
  { text: '¿Qué porcentaje de ganancia es recomendable?', intent: INTENTS.PRECIOS_MARGENES },
  { text: '¿Cómo cobrar pedidos personalizados sin perder dinero?', intent: INTENTS.PRECIOS_MARGENES },

  // --- STOCK E INVENTARIO ---
  { text: '¿Qué materiales se me están agotando?', intent: INTENTS.STOCK_INVENTARIO },
  { text: 'Tengo insumos con stock crítico o bajo', intent: INTENTS.STOCK_INVENTARIO },
  { text: '¿Cómo controlo las mermas y desperdicios del taller?', intent: INTENTS.STOCK_INVENTARIO },
  { text: '¿Cuándo debo comprar más materia prima?', intent: INTENTS.STOCK_INVENTARIO },
  { text: 'No sé cuánto inventario tengo disponible', intent: INTENTS.STOCK_INVENTARIO },
  { text: 'Revisa si me falta material para trabajar', intent: INTENTS.STOCK_INVENTARIO },
  { text: '¿Cómo organizar los insumos en el taller?', intent: INTENTS.STOCK_INVENTARIO },
  { text: 'Tengo dinero estancado en materiales que no uso', intent: INTENTS.STOCK_INVENTARIO },
  { text: 'Alertas de stock mínimo y reposición', intent: INTENTS.STOCK_INVENTARIO },
  { text: '¿Cuáles insumos tienen mayor rotación?', intent: INTENTS.STOCK_INVENTARIO },

  // --- CLIENTES Y VENTAS ---
  { text: '¿Cómo conseguir más clientes para mi tienda?', intent: INTENTS.CLIENTES_VENTAS },
  { text: 'Un cliente no me quiere pagar el anticipo', intent: INTENTS.CLIENTES_VENTAS },
  { text: '¿Cómo fidelizar a mis compradores frecuentes?', intent: INTENTS.CLIENTES_VENTAS },
  { text: '¿Qué hacer cuando un cliente hace un reclamo?', intent: INTENTS.CLIENTES_VENTAS },
  { text: '¿Cómo pedir recomendaciones y reseñas positivas?', intent: INTENTS.CLIENTES_VENTAS },
  { text: 'Mis ventas han bajado este mes, ¿qué hago?', intent: INTENTS.CLIENTES_VENTAS },
  { text: '¿Cómo cerrar ventas por WhatsApp de forma efectiva?', intent: INTENTS.CLIENTES_VENTAS },
  { text: 'Un comprador dejó el carrito o pedido a medias', intent: INTENTS.CLIENTES_VENTAS },
  { text: '¿Cómo manejar clientes difíciles o indecisos?', intent: INTENTS.CLIENTES_VENTAS },
  { text: '¿Quiénes son mis clientes más valiosos?', intent: INTENTS.CLIENTES_VENTAS },

  // --- ESTRATEGIA Y MARKETING ---
  { text: '¿Cómo promocionar mis creaciones en Instagram y TikTok?', intent: INTENTS.ESTRATEGIA_MARKETING },
  { text: 'Ideas para fotos y videos de mis productos', intent: INTENTS.ESTRATEGIA_MARKETING },
  { text: '¿Vale la pena hacer promociones o 2x1?', intent: INTENTS.ESTRATEGIA_MARKETING },
  { text: '¿Cómo prepararme para San Valentín, Navidad o Día de las Madres?', intent: INTENTS.ESTRATEGIA_MARKETING },
  { text: '¿Qué empaque o packaging le da más valor a mi marca?', intent: INTENTS.ESTRATEGIA_MARKETING },
  { text: '¿Cómo lanzar una nueva colección exclusiva?', intent: INTENTS.ESTRATEGIA_MARKETING },
  { text: 'Consejos para mejorar mi vitrina web y Linktree', intent: INTENTS.ESTRATEGIA_MARKETING },
  { text: '¿Cómo diferenciarme de la competencia?', intent: INTENTS.ESTRATEGIA_MARKETING },

  // --- GESTIÓN DE TIEMPO Y TALLER ---
  { text: 'Estoy saturado de pedidos y no me da tiempo', intent: INTENTS.GESTION_TIEMPO },
  { text: '¿Cómo calcular el tiempo de elaboración por pieza?', intent: INTENTS.GESTION_TIEMPO },
  { text: 'Me cuesta organizar las entregas a tiempo', intent: INTENTS.GESTION_TIEMPO },
  { text: '¿Debería contratar un ayudante o tercerizar?', intent: INTENTS.GESTION_TIEMPO },
  { text: '¿Cómo equilibrar la producción con la atención al cliente?', intent: INTENTS.GESTION_TIEMPO },
  { text: 'Tengo retrasos en la producción artesanal', intent: INTENTS.GESTION_TIEMPO },

  // --- DATOS DE CUENTA Y PERFIL DEL NEGOCIO ---
  { text: '¿Cuál es mi número de teléfono?', intent: INTENTS.DATOS_CUENTA_PERFIL },
  { text: 'cuál es el número de teléfono de la cuenta', intent: INTENTS.DATOS_CUENTA_PERFIL },
  { text: 'cual es numero de telefono de lacuenta', intent: INTENTS.DATOS_CUENTA_PERFIL },
  { text: 'número de teléfono registrado', intent: INTENTS.DATOS_CUENTA_PERFIL },
  { text: 'mi numero de telefono', intent: INTENTS.DATOS_CUENTA_PERFIL },
  { text: 'telefono de contacto', intent: INTENTS.DATOS_CUENTA_PERFIL },
  { text: '¿Qué número de WhatsApp tengo configurado?', intent: INTENTS.DATOS_CUENTA_PERFIL },
  { text: 'mi numero de whatsapp', intent: INTENTS.DATOS_CUENTA_PERFIL },
  { text: 'dime mi whatsapp y teléfono', intent: INTENTS.DATOS_CUENTA_PERFIL },
  { text: '¿Cuál es el correo o email de la cuenta?', intent: INTENTS.DATOS_CUENTA_PERFIL },
  { text: '¿Cómo se llama mi negocio o tienda?', intent: INTENTS.DATOS_CUENTA_PERFIL },
  { text: 'muéstrame los datos de mi perfil de negocio', intent: INTENTS.DATOS_CUENTA_PERFIL },
  { text: 'cuál es mi instagram y redes', intent: INTENTS.DATOS_CUENTA_PERFIL },
  { text: '¿Qué moneda tengo configurada?', intent: INTENTS.DATOS_CUENTA_PERFIL },
  { text: 'información de mi cuenta', intent: INTENTS.DATOS_CUENTA_PERFIL },
  { text: 'datos de perfil y usuario', intent: INTENTS.DATOS_CUENTA_PERFIL },

  // --- MÉTRICAS DE CLIENTES ---
  { text: '¿Cuántos clientes tenemos registrados actualmente?', intent: INTENTS.METRICAS_CLIENTES },
  { text: 'cuantos clientes tenemos', intent: INTENTS.METRICAS_CLIENTES },
  { text: 'cuantos clientes hay registrados', intent: INTENTS.METRICAS_CLIENTES },
  { text: 'total de clientes en el sistema', intent: INTENTS.METRICAS_CLIENTES },
  { text: 'lista de mis clientes', intent: INTENTS.METRICAS_CLIENTES },
  { text: 'quiénes son mis clientes registrados', intent: INTENTS.METRICAS_CLIENTES },
  { text: 'cuántos compradores tengo', intent: INTENTS.METRICAS_CLIENTES },

  // --- MÉTRICAS DE CATÁLOGO / PRODUCTOS ---
  { text: '¿Cuántos productos tengo en el catálogo?', intent: INTENTS.METRICAS_CATALOGO },
  { text: 'cuántos productos hay publicados', intent: INTENTS.METRICAS_CATALOGO },
  { text: 'total de artículos en el catálogo', intent: INTENTS.METRICAS_CATALOGO },
  { text: 'qué productos tengo disponibles', intent: INTENTS.METRICAS_CATALOGO },
  { text: 'resumen de mi catálogo', intent: INTENTS.METRICAS_CATALOGO },

  // --- MÉTRICAS DE INVENTARIO / MATERIALES ---
  { text: '¿Cuántos insumos o materiales tengo en inventario?', intent: INTENTS.METRICAS_INVENTARIO },
  { text: 'resumen del stock del taller', intent: INTENTS.METRICAS_INVENTARIO },
  { text: 'cuál es el valor de mi inventario', intent: INTENTS.METRICAS_INVENTARIO },
  { text: 'qué materiales tienen stock bajo o crítico', intent: INTENTS.METRICAS_INVENTARIO },
  { text: 'cuántos insumos tengo registrados', intent: INTENTS.METRICAS_INVENTARIO },

  // --- SALUDO Y AYUDA ---
  { text: 'Hola, ¿qué puedes hacer?', intent: INTENTS.SALUDO_AYUDA },
  { text: 'Buenos días Pandi Copilot', intent: INTENTS.SALUDO_AYUDA },
  { text: 'Buenas tardes, necesito ayuda', intent: INTENTS.SALUDO_AYUDA },
  { text: '¿En qué me puedes colaborar hoy?', intent: INTENTS.SALUDO_AYUDA },
  { text: 'Hola amigo', intent: INTENTS.SALUDO_AYUDA },

  // --- DESPEDIDA Y GRACIAS ---
  { text: 'Muchas gracias por el consejo', intent: INTENTS.DESPEDIDA_GRACIAS },
  { text: 'Gracias Pandi, me ayudó mucho', intent: INTENTS.DESPEDIDA_GRACIAS },
  { text: 'Excelente recomendación, hasta luego', intent: INTENTS.DESPEDIDA_GRACIAS },
  { text: 'Adiós, que tengas buen día', intent: INTENTS.DESPEDIDA_GRACIAS }
]
