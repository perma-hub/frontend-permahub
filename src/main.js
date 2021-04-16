import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import vuetify from '@/plugins/vuetify'

import store from './store'
import App from './App.vue'
import router from '@/routes/router'
import "./styles/general.css"
import "setimmediate"

Vue.use(VueRouter)
Vue.use(Vuex)

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
