import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '仪表盘', icon: 'dashboard' }
    }]
  },

  {
    path: '/project',
    component: Layout,
    redirect: '/project/all',
    name: 'Project',
    meta: { title: '项目', icon: 'component' },
    children: [
      {
        path: 'all',
        name: 'projectList',
        component: () => import('@/views/project/index'),
        meta: { title: '项目列表', icon: 'list' },
      },
      {
        path: 'update/:pid',
        name: 'projectUpdate',
        component: () => import('@/views/project/edit'),
        meta: { title: '修改项目', icon: 'edit' },
        hidden: true
      },
      {
        path: 'create',
        name: 'projectCreate',
        component: () => import('@/views/project/edit'),
        meta: { title: '创建项目', icon: 'edit' },
      },
      {
        path: ':pid',
        name: 'projectShow',
        component: () => import('@/views/project/show'),
        meta: { title: '分类列表', icon: 'list' },
        hidden: true,
      },
      {
        path: 'type/update/:rid',
        name: 'reptileTypeUpdate',
        component: () => import('@/views/type/edit'),
        meta: { title: '修改分类', icon: 'edit' },
        hidden: true
      },
      {
        path: 'type/create/:pid',
        name: 'reptileTypeCreate',
        component: () => import('@/views/type/edit'),
        meta: { title: '创建分类', icon: 'edit' },
        hidden: true
      },
      {
        path: 'type/:rid',
        name: 'reptileTypeShow',
        component: () => import('@/views/type/index'),
        meta: { title: '爬虫列表', icon: 'list' },
        hidden: true
      },
      {
        path: 'reptile/update/:rid',
        name: 'reptileUpdate',
        component: () => import('@/views/reptile/edit'),
        meta: { title: '修改爬虫' },
        hidden: true
      },
      {
        path: 'reptile/create/:rid',
        name: 'reptileCreate',
        component: () => import('@/views/reptile/edit'),
        meta: { title: '创建爬虫' },
        hidden: true
      }
    ]
  },

  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: 'Form', icon: 'form' }
      }
    ]
  },

  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: {
      title: 'Nested',
      icon: 'nested'
    },
    children: [
      {
        path: 'menu1',
        component: () => import('@/views/nested/menu1/index'), // Parent router-view
        name: 'Menu1',
        meta: { title: 'Menu1' },
        children: [
          {
            path: 'menu1-1',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'Menu1-1',
            meta: { title: 'Menu1-1' }
          },
          {
            path: 'menu1-2',
            component: () => import('@/views/nested/menu1/menu1-2'),
            name: 'Menu1-2',
            meta: { title: 'Menu1-2' },
            children: [
              {
                path: 'menu1-2-1',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
                name: 'Menu1-2-1',
                meta: { title: 'Menu1-2-1' }
              },
              {
                path: 'menu1-2-2',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
                name: 'Menu1-2-2',
                meta: { title: 'Menu1-2-2' }
              }
            ]
          },
          {
            path: 'menu1-3',
            component: () => import('@/views/nested/menu1/menu1-3'),
            name: 'Menu1-3',
            meta: { title: 'Menu1-3' }
          }
        ]
      },
      {
        path: 'menu2',
        component: () => import('@/views/nested/menu2/index'),
        meta: { title: 'menu2' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
