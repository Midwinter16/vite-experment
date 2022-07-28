// import {createApp, ref} from 'vue'
import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import {createPinia} from 'pinia'
import 'element-plus/dist/index.css'
import 'animate.css'

const app = createApp(App)

const pinia = createPinia()

app.use(router).use(pinia).use(ElementPlus).mount('#app')
