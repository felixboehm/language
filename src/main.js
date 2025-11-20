import './style.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { useSettings } from './composables/useSettings'
import { useProgress } from './composables/useProgress'

// Initialize and load settings and progress before mounting the app
const { loadSettings } = useSettings()
loadSettings()

const { loadProgress } = useProgress()
loadProgress()

const app = createApp(App)
app.use(router)
app.mount('#app')
