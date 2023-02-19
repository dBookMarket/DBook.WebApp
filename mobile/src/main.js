import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/styles/index.scss'
import 'lib-flexible'
import Vant from 'vant'
import 'vant/lib/index.css'
import Empty from '@/components/Empty'
// import Vconsole from 'vconsole'
import VueClipBoard from 'vue-clipboard2'
import initRichText from './utils/initHTMLEditor.js'
initRichText();
import 'font-awesome/css/font-awesome.min.css'

Vue.use(VueClipBoard)

//插件注册
Vue.use(Vant)

//组件注册
Vue.component('EmptyData',Empty)
Vue.config.productionTip = false

// if (process.env.NODE_ENV !== 'production') {
//   Vue.prototype.$vconsole = new Vconsole()
// }


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
