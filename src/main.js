import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import VueRouter from 'vue-router'

Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(VueRouter)

const routes = [
  { path: '/ListTasks', component: '' }
]

new Vue({
  render: h => h(App)
}).$mount('#app')
