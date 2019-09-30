import Vue from 'vue'
import App from './App.vue'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import './assets/app.scss'
import '@mdi/font/css/materialdesignicons.min.css'
//import BootstrapVue from 'bootstrap-vue'
//import VueRouter from 'vue-router'

Vue.use(Buefy)

Vue.config.productionTip = false
//Vue.use(BootstrapVue)
//Vue.use(VueRouter)

//const routes = [
//  { path: '/ListTasks', component: '' }
//]

new Vue({
  render: h => h(App)
}).$mount('#app')
