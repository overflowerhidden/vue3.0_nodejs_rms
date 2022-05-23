import { createRouter, createWebHashHistory } from "vue-router"
import Home from '../components/Home.vue'
import storage from './../utils/storage'
import API from './../api'
import utils from './../utils/utils'
import { defineAsyncComponent } from 'vue'

const routes = [
  {
    name: 'home',
    path: '/',
    meta: {
      title: '首页'
    },
    component: Home,
    redirect: '/welcome',
    children: [
      {
        name: 'welcome',
        path: '/welcome',
        meta: {
          title: '欢迎来到SeeYou'
        },
        component: () => import('@/views/Welcome.vue'),
      },
      // {
      //   name: 'user',
      //   path: '/system/user',
      //   meta: {
      //     title: '用户管理'
      //   },
      //   component: () => import('@/views/User.vue'),
      // }, {
      //   name: 'menu',
      //   path: '/system/menu',
      //   meta: {
      //     title: '菜单管理'
      //   },
      //   component: () => import('@/views/Menu.vue'),
      // }, {
      //   name: 'role',
      //   path: '/system/role',
      //   meta: {
      //     title: '角色管理'
      //   },
      //   component: () => import('@/views/Role.vue'),
      // }, {
      //   name: 'dept',
      //   path: '/system/dept',
      //   meta: {
      //     title: '角色管理'
      //   },
      //   component: () => import('@/views/Dept.vue'),
      // },
    ]
  },
  {
    name: 'login',
    path: '/login',
    meta: {
      title: '登录'
    },
    component: () => import('../views/Login.vue'),
  }, {
    name: '404',
    path: '/404',
    meta: {
      title: '页面不存在'
    },
    component: () => import('@/views/404.vue'),
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

async function loadAsyncRoutes() {
  let userInfo = storage.getItem('userInfo') || {}
  if (userInfo.token) {
    try {
      const { menuList } = await API.getPermissionList()
      let routes = utils.generateRoute(menuList)
      routes.map(route => {
        let url = `./../views/${route.component}.vue`
        route.component = defineAsyncComponent(() => import(/* @vite-ignore */url));
        // route.component = () => import(url);
        router.addRoute('home', route)
      })
    } catch (error) { }
  }
}


// 动态添加路由
// router.addRoute('home', {
//   name: 'menu',
//   path: '/system/menu',
//   meta: {
//     title: '角色管理'
//   },
//   component: () => import('@/views/Menu.vue'),
// })
await loadAsyncRoutes();

function checkPermission(path) {
  let hasPermission = router.getRoutes().filter(route => route.path == path)
  if (hasPermission.length > 0) {
    return true
  } else {
    return false
  }
}

router.beforeEach((to, from, next) => {
  // if (checkPermission(to.path)) {
  if (router.hasRoute(to.name)) {
    document.title = to.meta.title
    next()
  } else {
    next('/404')
  }
})

export default router;