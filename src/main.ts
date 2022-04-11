import { createApp } from 'vue'
import App from './App.vue'
import './index.scss'
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import i18n from "./plugins/i18n"
import router from "./router/router"

const app = createApp(App).use(i18n).use(Toast).use(router)
app.mount('#app')
