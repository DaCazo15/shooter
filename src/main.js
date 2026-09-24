import { createApp } from 'vue'
import App from './App.vue'

// formkit
import { plugin, defaultConfig } from '@formkit/vue'
import config from '../formkit.config' // Asegúrate de ajustar la ruta según tu estructura

// styles
import './assets/main.css'

// firebase
import { VueFire, VueFireAuth } from 'vuefire'
import { firebaseApp } from './config/firestore.js'


const app = createApp(App)
app.use(plugin, defaultConfig(config))

app.use(VueFire, {
  // Pasa la instancia inicializada de Firebase
  firebaseApp,
  modules: [
    // Habilita el módulo de autenticación de VueFire
    VueFireAuth(),
  ],
})

app.mount('#app')
