const getters = {
  sidebar: state => state.app.sidebar,//侧边栏
  showSiderbar: state => state.app.showSiderbar, //显示或隐藏
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar, //头像
  name: state => state.user.name,
  is_super: state => state.user.isSuper,
  menus: state => state.user.menus,
  roles: state => state.user.roles,
  visitedViews: state => state.tagsView.visitedViews,
  loadingInstance: state => state.app.loadingInstance,///请求加载loading实体
  permission_routers: state => state.permission.routers,
  permission_buttons: state => state.permission.path_buttons,
}
export default getters
