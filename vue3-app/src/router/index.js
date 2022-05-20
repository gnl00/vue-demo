import {createRouter, createWebHistory} from "vue-router"

// 定义路由数组
const routes = [
  {
    path: '/web',
    name: 'home',
    component: () => import('@/views/Home')
  },
  {
    path: '/myComp',
    name: 'myComp',
    component: () => import('@/views/MyComp')
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/About')
  }
]

// 创建路由
const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 使用路由守卫要记住放行
  next()
})

// 路由错误回调
router.onError(handler => {
})

export default router