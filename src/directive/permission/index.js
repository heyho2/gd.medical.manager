import Vue from 'vue'
import router from '@/router'
import { checkPermission } from '@/utils/permission'
/** 权限指令**/
Vue.directive('permission', {
  inserted(el, binding, vnode) {
    // 获取按钮权限
    if (!Vue.prototype.$checkPermission(binding.value)) {
      if (!el) throw new Error(`【出现异常了】老哥，权限不能放到组件的根目录`)
      el.parentNode && el.parentNode.removeChild(el)
    }
  }
})
Vue.directive('permission2', {
  bind(el, binding, vnode) {
    // 获取按钮权限
    if (!Vue.prototype.$checkPermission(binding.value)) {
      var ss = el.parentNode
      if (!ss) throw new Error(`【出现异常了】老哥，权限不能放到组件的根目录`)
      el.classList.add('.is-disabled')
      el.title = '您没有权限噢'
    }
  }
})
// 权限检查方法
Vue.prototype.$checkPermission = function(a) {
  var r = router
  return checkPermission(a, r.history.current.path)
}
