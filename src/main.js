import Vue from 'vue'
import VueRouter from 'vue-router'
import vuetify from '@/plugins/vuetify'
import App from './App.vue'
import router from '@/routes/router'
import "./styles/general.scss"
import "setimmediate"

Vue.use(VueRouter)

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
