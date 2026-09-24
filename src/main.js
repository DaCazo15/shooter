import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// styles
import './assets/main.css'

// firebase
import { VueFire, VueFireAuth } from 'vuefire'
import { firebaseApp } from './config/firestore.js'

const app = createApp(App)

// Pinia setup
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

// Router setup
app.use(router)

// VueFire setup
app.use(VueFire, {
  firebaseApp,
  modules: [
    VueFireAuth(),
  ],
})

app.mount('#app')
