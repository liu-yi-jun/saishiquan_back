import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 注意理解了嵌套路由，子路由是要求父路由有子视图吗？
const routes = [
  {
    path: '/',
    redirect: '/issue'
  },
  {
    path: '/issue',
    component: () => import('../views/blogManage/issue.vue')
  },
  {
    path: '/edit',
    name: 'edit',
    component: () => import('../views/blogManage/edit.vue')
  },
  {
    path: '/addclass',
    name: 'addclass',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/addclass.vue')
  },
  {
    path: '/reply',
    name: 'reply',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/reply.vue')
  },
  {
    path: '/friend',
    name: 'friend',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/friend.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
