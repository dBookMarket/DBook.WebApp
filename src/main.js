import vhCheck from "vh-check";
vhCheck('browser-address-bar');
import { createApp } from 'vue'
import App from './App.vue'
import tool from "./assets/lib/tool"
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import "./assets/style/base.scss"
import "./assets/style/mobile.scss"
import "./assets/style/web.scss"
import "./assets/style/ipad.scss"
import router from './router'
const app = createApp(App);// 全局注册组件
app.use(tool).use(ElementPlus, { size: "large" }).use(router)
app.mount('#app')

