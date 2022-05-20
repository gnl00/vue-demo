import {createRouter, createWebHistory} from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/home/Home.vue')
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/profile/Profile.vue')
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/About/About.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router