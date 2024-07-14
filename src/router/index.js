import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue'),
    meta: {
      title: '登录页面'
    }
  },
  {
    path: '/',
    name: 'admin',
    meta: {
      title: '智慧停车场后台管理页面'
    },
    component: () => import('../views/Admin.vue'),
    children: [
      {
        path: '/',
        component: () => import('../components/Index.vue'),
        meta: {
          title: '智慧停车场后台管理页面'
        }
      },
      {
        path: 'index',
        component: () => import('../components/Index.vue'),
        meta: {
          title: '智慧停车场后台管理页面'
        }
      },
      {
        path: 'orderlist',
        component: () => import('../components/OrderList.vue'),
        meta: {
          title: '订单管理'
        }
      },
      {
        path: 'userlist',
        component: () => import('../components/UserList.vue'),
        meta: {
          title: '用户列表'
        }
      },
      {
        path: 'notice',
        component: () => import('../components/Notice.vue'),
        meta: {
          title: '公告发布'
        }
      },
    ]
  }
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

const originalPush = router.push

router.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

function getCookie(name) {
  let cookieArray = document.cookie.split(';')
  for (let i = 0; i < cookieArray.length; i++) {
    let cookiePair = cookieArray[i].split('=')
    if (name == cookiePair[0].trim()) {
      return decodeURIComponent(cookiePair[1])
    }
  }
  return null
}

router.beforeEach((to, from, next) => {

  document.title = to.meta.title

  let userCookie = getCookie('SESSION')

  if (to.path === '/login') return next()
  if (userCookie == null) {
    next('/login')
  } else {
    next()
  }
})

export default router
