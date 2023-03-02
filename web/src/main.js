import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import tool from "./assets/lib/tool"
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import "./assets/style/base.scss"
// import { createMetaManager} from 'vue-meta'
const app = createApp(App);// 全局注册组件
// console.log(createMetaManager)
// .use(createMetaManager(false, {
//     meta: { tag: 'meta', nameless: true }
// }))
app.use(tool).use(router).use(ElementPlus, { size: "large" })
app.mount('#app')