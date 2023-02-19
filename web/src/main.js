import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import tool from "./assets/lib/tool"
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import "./assets/style/base.scss"
const app = createApp(App);// 全局注册组件
app.use(tool).use(router).use(ElementPlus, { size: "large" })
app.mount('#app')