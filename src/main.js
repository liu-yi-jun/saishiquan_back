import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式
import './assets/global/global.css'
// 导入axios
import axios from 'axios'
// vue原型挂载axios
Vue.prototype.$http = axios
// 配置请求的根路径
axios.defaults.baseURL = 'https://saishiquan.eigene.cn/back'
axios.defaults.resource = 'https://saishiquan.eigene.cn'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
