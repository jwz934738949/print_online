import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login'
import Home from "../views/Home/Home"
import Welcome from "../views/Home/Welcome"
import Print from "../views/Home/print/Print"
import Order from "../views/order/Order"

Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    children: [{
        path: '/',
        redirect: '/welcome'
      },
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/print',
        component: Print
      },
      {
        path: '/order',
        component: Order
      }
    ]
  }

]

const router = new VueRouter({
  routes
})

// 添加导航守卫，当进入登录之外的界面时，首先判断是否存在token值
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    return next()
  }
  // 当跳转页面不为login页面时
  let token = window.sessionStorage.getItem("token")
  if (!token) {
    // 不存在token值
    return next('/login')
  }
  // 存在直接跳转
  next()
})

export default router