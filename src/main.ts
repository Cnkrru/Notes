import { createApp } from 'vue'
import App from './App.vue'
import { createAppRouter } from './router'
import { pinia } from './stores'

const app = createApp(App)
const router = createAppRouter()

app.use(router)
app.use(pinia)

app.mount('#app')