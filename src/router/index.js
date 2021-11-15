import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '@/components/Home'
import Login from '@/components/Login'
import MainLayout from '@/components/MainLayout'
import ContentsLayout from '@/components/ContentsLayout'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: '/main',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    beforeEnter: (to, from, next) => {
      if (Vue.cookie.get('auth-token') || Vue.cookie.get('Authorization-v2')) {
        next({ name: 'Main' })
      } else {
        next()
      }
    }
  },
  {
    path: '/main',
    name: 'Main',
    redirect: 'main/mbti',
    component: MainLayout,
    children: [
      {
        path: 'mbti',
        name: 'MBTI',
        redirect: 'mbti/idol',
        component: ContentsLayout,
        meta: {
          title: 'MBTI'
        },
        children: [
          {
            path: 'idol',
            name: 'MBTI_아이돌',
            redirect: 'idol/list',
            meta: {
              title: '아이돌'
            },
            component: () => import('@/templates/mbti/MBTILayout'),
            children: [
              {
                path: 'list',
                name: 'MBTI_아이돌_리스트',
                meta: {
                  title: '아이돌 리스트'
                },
                component: () => import('@/templates/mbti/idol/IdolList')
              },
            ]
          }
        ]
      },
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  linkActiveClass: 'active',
  base: process.env.BASE_URL,
  routes
})

export default router
