import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/home/index.vue'
import Settings from '../views/settings/index.vue'
import Layout from '../layouts/default.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Root',
      component: Layout,
      redirect: '/home',
      children: [
        {
          path: '/home',
          name: 'home',
          component: HomeView
        },
        {
          path: '/settings',
          name: 'settings',
          component: Settings
        }
      ]
    }
  ]
})

export default router
