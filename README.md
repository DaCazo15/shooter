<p align="center">
  <img src="public/logo.png" width="120" height="120" alt="Pandibuy Logo" />
</p>

<h1 align="center">Pandibuy 🛒✨</h1>

<p align="center">
  <strong>Business Suite, E-Commerce Catalog & Shop Builder para Creadores y Talleres</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Vue-3.x-4FC08D?style=flat-square&logo=vue.js&logoColor=white" alt="Vue 3" />
  <img src="https://img.shields.io/badge/Vite-8.x-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=flat-square&logo=firebase&logoColor=black" alt="Firebase" />
  <img src="https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/AI-Claude%20%26%20TensorFlow-9E5A78?style=flat-square" alt="AI Copilot" />
</p>

---

**Pandibuy** es una plataforma integral de gestión comercial, e-commerce y catálogo digital diseñada específicamente para talleres, artesanos, creadores y pequeños negocios. Centraliza el control de inventario, finanzas multimoneda, relación con clientes, cotizaciones de producción y presencia web pública, complementado con un **Copiloto Inteligente (IA)** que analiza las métricas del negocio y ofrece asesoramiento estratégico en tiempo real.

---

## 🚀 Características Principales

- **Catálogo de Productos & Tienda Digital**: Gestión de productos con control de precios, costos, márgenes de ganancia y stock.
- **Inventario & Proveedores**: Control de existencias de materias primas e insumos con alertas de stock mínimo y directorio directo de proveedores.
- **Directorio de Clientes**: Registro de clientes, historial de pedidos y acceso directo para contacto vía WhatsApp.
- **Gestión Financiera Multimoneda**: Registro de cuentas y balances en distintas divisas (USD, VES, EUR).
- **Calculadora de Costos & Presupuestos**: Herramienta de cálculo detallado de costos unitarios (materia prima + mano de obra + gastos indirectos) y márgenes de venta sugeridos.
- **Editor CMD (Sitio Web & Linktree)**: Constructor visual para diseñar y publicar un portal web personalizado o bio-link de ventas.
- **Copiloto Inteligente con Claude (Anthropic)**: Asistente virtual con acceso seguro a herramientas de consulta sobre el negocio (ventas, catálogo, inventario y finanzas) para brindar diagnósticos y sugerencias accionables.

---

## 🛠️ Stack Tecnológico

- **Frontend Core**: [Vue 3](https://vuejs.org/) (Composition API, `<script setup>`) con [Vite 8](https://vite.dev/)
- **Enrutamiento**: [Vue Router 4](https://router.vuejs.org/)
- **Gestión de Estado**: [Pinia](https://pinia.vuejs.org/) con persistencia vía `pinia-plugin-persistedstate`
- **Estilos & UI**: [Tailwind CSS v4](https://tailwindcss.com/) (integrado con `@tailwindcss/vite`), [Bootstrap Icons](https://icons.getbootstrap.com/) y animaciones con [GSAP](https://greensock.com/gsap/)
- **Base de Datos, Autenticación & Storage**: [Firebase](https://firebase.google.com/) (Authentication, Cloud Firestore, Cloud Storage) y `firebase-admin`
- **Inteligencia Artificial**: [Anthropic Claude SDK](https://docs.anthropic.com/) (`@anthropic-ai/sdk`) para el copiloto con bucle de herramientas (*tool use*) + [TensorFlow.js](https://www.tensorflow.org/js)

---

## ⚙️ Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto para definir las credenciales requeridas tanto por el frontend como por las funciones de backend/serverless:

```env
# ==========================================
# Configuración Frontend de Firebase
# ==========================================
VITE_FIRESTORE_API_KEY="tu_api_key_de_firebase"
VITE_FIRESTORE_AUTH_DOMAIN="tu-proyecto.firebaseapp.com"
VITE_FIRESTORE_PROJECT_ID="tu-proyecto-id"
VITE_FIRESTORE_STORAGE_BUCKET="tu-proyecto.firebasestorage.app"
VITE_FIRESTORE_MESSAGING_SENDER_ID="123456789012"
VITE_FIRESTORE_APP_ID="1:123456789012:web:abcdef123456"

# ==========================================
# Modo Demostración (Opcional)
# ==========================================
# Si es true, permite navegar y simular acciones en local sin conexión real a Firebase
VITE_DEMO_MODE=false

# ==========================================
# Backend / Serverless & Copiloto IA
# ==========================================
# Clave de API de Anthropic para el motor de Claude
ANTHROPIC_API_KEY="sk-ant-api03-..."

# Clave de cuenta de servicio de Firebase Admin en formato JSON (como string de una sola línea)
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"...","private_key":"...","client_email":"..."}'
```

### 📋 Detalle de cada variable

| Variable | Propósito | ¿Dónde se obtiene? |
| :--- | :--- | :--- |
| `VITE_FIRESTORE_API_KEY` | Llave pública para inicializar el SDK cliente de Firebase en el navegador. | **Firebase Console** → *Configuración del proyecto* → *General* → *Tus apps* → *Configuración de SDK*. |
| `VITE_FIRESTORE_AUTH_DOMAIN` | Dominio asignado para la gestión de inicios de sesión y redirecciones de autenticación. | **Firebase Console** → *Configuración del proyecto* → *General*. |
| `VITE_FIRESTORE_PROJECT_ID` | Identificador único de tu proyecto en Google Cloud / Firebase. | **Firebase Console** → *Configuración del proyecto* → *General* → *ID del proyecto*. |
| `VITE_FIRESTORE_STORAGE_BUCKET` | Dirección del contenedor de Cloud Storage para almacenar imágenes y archivos. | **Firebase Console** → *Storage* o *Configuración del proyecto*. |
| `VITE_FIRESTORE_MESSAGING_SENDER_ID` | Identificador numérico del remitente para Firebase Cloud Messaging. | **Firebase Console** → *Configuración del proyecto* → *Cloud Messaging*. |
| `VITE_FIRESTORE_APP_ID` | ID único de la aplicación Web registrada en el proyecto Firebase. | **Firebase Console** → *Configuración del proyecto* → *General* → *Tus apps*. |
| `ANTHROPIC_API_KEY` | Clave secreta para interactuar con los modelos Claude (IA) en el backend del copiloto. | **[Anthropic Console](https://console.anthropic.com/)** → *API Keys* → *Create Key*. |
| `FIREBASE_SERVICE_ACCOUNT_KEY` | Credenciales con permisos de administrador para validar tokens de usuario y acceder a Firestore desde el backend del copiloto. | **Firebase Console** → *Configuración del proyecto* → *Cuentas de servicio* → *Generar nueva clave privada* (descargar JSON y colocar su contenido). |

---

## 💻 Instalación y Ejecución Local

### 1. Prerrequisitos
- **Node.js** v18.0.0 o superior
- **npm** v9.0.0 o superior

### 2. Clonar e Instalar Dependencias
```bash
# Clonar el repositorio
git clone <URL_DEL_REPOSITORIO>
cd shooter

# Instalar los paquetes del proyecto
npm install
```

### 3. Configurar Variables de Entorno
Copia el archivo de ejemplo o crea tu `.env.local`:
```bash
cp .env.example .env.local
```
Completa las variables con tus credenciales de Firebase y Anthropic.

### 4. Iniciar el Servidor de Desarrollo
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:5173`.

### 5. Compilar para Producción
```bash
# Generar el bundle optimizado en la carpeta /dist
npm run build

# Previsualizar el build de producción localmente
npm run preview
```

---

## 📁 Estructura del Proyecto

```text
├── api/                    # Endpoints serverless (Copiloto con Claude, tools y análisis)
├── public/                 # Recursos públicos estáticos
├── src/
│   ├── assets/             # Estilos globales, tipografías e imágenes
│   ├── components/         # Componentes organizados por secciones del dashboard y vista pública
│   │   ├── copiloto/       # Chat y asistente inteligente
│   │   ├── layout/         # Navegación, barra superior y barra lateral
│   │   ├── public/         # Vistas públicas del catálogo y linktree
│   │   └── section/        # Módulos: catálogo, inventario, clientes, finanzas, calculadora, CMD
│   ├── composable/         # Hooks de lógica de negocio (useCatalogo, useInventario, useClientes, etc.)
│   ├── config/             # Configuración de Firebase y servicios externos
│   ├── router/             # Definición de rutas y navegación
│   ├── stores/             # Stores de estado global con Pinia (auth, cmd, settings)
│   ├── types/              # Constantes y estructuras de datos
│   └── utils/              # Funciones auxiliares y formateadores
├── package.json
└── vite.config.js
```

---

## 🛡️ Licencia
Este proyecto es privado y de uso exclusivo para el equipo de **Pandibuy**.
