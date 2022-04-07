import { createApp } from 'vue'
import App from './App.vue'
import './index.scss'
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

const app = createApp(App)
app.mount('#app')
app.use(Toast)
