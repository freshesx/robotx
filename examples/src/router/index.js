import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/dashboard',
      component: () => import('../components/dashboard/index.js'),
      children: [
        {
          path: 'homepage',
          name: 'homepage',
          component: () => import('../components/homepage/index.js')
        }
      ]
    }
  ]
})

export default router
