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
      {
        path: 'contract',
        name: '계약',
        redirect: 'contract/contract',
        component: ContentsLayout,
        meta: {
          title: '계약'
        },
        children: [
          {
            path: 'contract',
            name: '계약_신계약',
            redirect: 'contract/contract',
            meta: {
              title: '신계약'
            },
            component: () => import('@/templates/contract/ContractLayout'),
            children: [
              {
                path: 'contract',
                name: '계약_신계약_리스트',
                meta: {
                  title: '신계약 리스트'
                },
                component: () => import('@/templates/contract/contract/ContractList'),
              },
              {
                path: 'contract/create',
                name: '계약_신계약_등록',
                meta: {
                  title: '신계약 등록'
                },
                component: () => import('@/templates/contract/contract/ContractDetail')
              },
              {
                path: 'contract/:detailId',
                name: '계약_신계약_상세',
                meta: {
                  title: '신계약 상세'
                },
                component: () => import('@/templates/contract/contract/ContractDetail')
              },
              {
                path: 'contract2',
                name: '계약_신계약_리스트2',
                meta: {
                  title: '신계약 리스트2'
                },
                component: () => import('@/templates/contract/contract/ContractList2'),
              },
            ]
          }
        ]
      },
      {
        path: 'work',
        name: '업무보고',
        redirect: 'work/work',
        component: ContentsLayout,
        meta: {
          title: '업무보고'
        },
        children: [
          {
            path: 'work',
            name: '업무보고_일일업무보고',
            redirect: 'work/list',
            meta: {
              title: '업무보고'
            },
            component: () => import('@/templates/work/WorkLayout'),
            children: [
              {
                path: 'list',
                name: '업무보고_일일업무보고_리스트',
                meta: {
                  title: '업무보고 리스트'
                },
                component: () => import('@/templates/work/work/WorkList')
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
