import './style.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { useSettings } from './composables/useSettings'

// Initialize and load settings before mounting the app
const { loadSettings } = useSettings()
loadSettings()

const app = createApp(App)
app.use(router)
app.mount('#app')
