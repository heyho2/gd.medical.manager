import store from '@/store'

export function checkPermission(value, path) {
  const path_buttons = store.getters && store.getters.permission_buttons
  const is_super = store.getters && store.getters.is_super
  if (is_super)// 超级管理员
  { return true }
  if (value && path) {
    const buttons = path_buttons[path.toLowerCase()]
    if (buttons && buttons.length > 0 && buttons.indexOf(value) != -1) { return true }
  } else {
    throw new Error(`【出现异常了】老哥，权限参数错误传错了`)
  }
  return false
}

export function hasPermission(path) {
  const routers = store.getters && store.getters.permission_routers
  const is_super = store.getters && store.getters.is_super
  if (is_super)// 超级管理员
  { return true }
  if (isRouter(routers, path)) {
    return true
  }
  return false
}

function isRouter(menus, path) {
  let temp = false
  menus.forEach(route => {
    if (route.path.toLowerCase() == path.toLowerCase()) {
      temp = temp || true
    }
    temp = temp || isRouter(route.children, path)
  })
  return temp
}
