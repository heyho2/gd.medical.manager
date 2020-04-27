import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权
import { hasPermission } from '@/utils/permission' // 验权

const whiteList = ['/login', '/404', '/401'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // 如果当前页面是仪表板将不会触发afterEach挂钩，所以手动处理它
    } else {
      if (!store.getters.name) { // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetUserInfo').then(res => { // 拉取user_info
          const menus = res.data.menus // 服务器菜单
          const isSuper = res.data.isSuper // 服务器菜单
          store.dispatch('GenerateRoutes', { menus, isSuper }).then(() => { // 根据roles权限生成可访问的路由表
            next({ ...to, replace: true })
          })
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            Message.error(err || 'Verification failed, please login again')
            next({ path: '/' })
          })
        })
      } else {
        // next();
        // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
        if (whiteList.indexOf(to.path) === -1 && to.path != '/dashboard') {
          if (hasPermission(to.path)) {
            next()
          } else {
            next({ path: '/401' })
          }
        } else {
          next()
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
