import VueRouter from 'vue-router'
import Dashboard from '@/components/Dashboard'

const router = new VueRouter({
  routes: [
    {
      path: '/',
      name: "dashboard",
      component: Dashboard,
    },
  ]
})
export default router