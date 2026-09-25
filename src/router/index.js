import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { getHostnameSubdomain } from '../utils/subdomain'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: () => {
        // Si se accede mediante un subdominio (mitienda.pandibuy.com o mitienda.localhost)
        const hostSubdomain = getHostnameSubdomain()
        if (hostSubdomain) {
          return { name: 'public-web', params: { subdominio: hostSubdomain } }
        }

        // Si es el dominio principal, verificar autenticación
        const authStore = useAuthStore()
        return authStore.isAuthenticated ? '/dashboard/calculadora' : '/login'
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/LoginView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/dashboard',
      component: () => import('../views/dashboard/DashboardLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: { name: 'dashboard-calculadora' }
        },
        {
          path: 'calculadora',
          name: 'dashboard-calculadora',
          component: () => import('../components/section/section-calculadora/CalculadoraComponent.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'builder',
          name: 'dashboard-builder',
          component: () => import('../components/section/section-cmd/CmdComponent.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'cmd',
          redirect: { name: 'dashboard-builder' }
        },
        {
          path: 'catalogo',
          name: 'dashboard-catalogo',
          component: () => import('../components/section/section-catalogo/CatalogoComponent.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'clientes',
          name: 'dashboard-clientes',
          component: () => import('../components/section/section-clientes/ClientesComponent.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'inventario',
          name: 'dashboard-inventario',
          component: () => import('../components/section/section-inventario/InventarioComponent.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'cuentas',
          name: 'dashboard-cuentas',
          component: () => import('../components/section/section-account/AccountComponent.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'perfil',
          name: 'dashboard-perfil',
          component: () => import('../views/dashboard/ProfileView.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'configuracion',
          name: 'dashboard-configuracion',
          component: () => import('../components/section/section-configuracion/ConfiguracionComponent.vue'),
          meta: { requiresAuth: true }
        }
      ]
    },
    // Vistas públicas para el sitio web y linktree del usuario (NO requieren autenticación)
    {
      path: '/web/:subdominio?',
      name: 'public-web',
      component: () => import('../views/public/PublicWebView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/bio/:subdominio?',
      name: 'public-linktree',
      component: () => import('../views/public/PublicLinktreeView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/linktree/:subdominio?',
      redirect: to => ({
        name: 'public-linktree',
        params: { subdominio: to.params.subdominio }
      })
    },
    // Error 404
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/errors/NotFoundView.vue'),
      meta: { requiresAuth: false }
    }
  ]
})

// Navigation guard con seguridad estricta
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // 1. Si la ruta requiere autenticación y el usuario NO está autenticado -> a Login
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!authStore.isAuthenticated) {
      return next({ name: 'login', query: { redirect: to.fullPath } })
    }
  }

  // 2. Si el usuario ya está autenticado e intenta acceder a login -> a Dashboard
  if (to.matched.some(record => record.meta.requiresGuest)) {
    if (authStore.isAuthenticated) {
      return next({ name: 'dashboard-calculadora' })
    }
  }

  // 3. Rutas públicas (web, bio/linktree, not-found) se permiten libremente sin login
  next()
})

export default router
