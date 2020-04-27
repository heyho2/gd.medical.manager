import '@/utils/linq'
function filterAsyncRouter(menus, path_buttons) {
  const res = []
  path_buttons = path_buttons || {};
  menus.forEach(route => {
    const tmp = {
      path: route.menuUrl,
      name: route.menuCode,
      meta: { title: route.menuName, icon: route.menuClass },
      hidden: !route.enable,
    }
    if (route.children) {
      tmp.children = filterAsyncRouter(route.children, path_buttons)
    }
    if (tmp.name == 'dashboard') {
      tmp.meta.affix = true;
    }
    res.push(tmp);
    path_buttons[tmp.path.toLowerCase()] = route.buttons;
  })
  return res;
}

const permission = {
  state: {
    routers: [],
    path_buttons: {},
    is_super: false
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.routers = routers
    },
    set_path_buttons: (state, path_buttons) => {
      state.path_buttons = path_buttons
    },
    set_is_super: (state, is_super) => {
      state.is_super = is_super
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { menus, isSuper } = data
        const path_buttons = {};
        let accessedRouters = filterAsyncRouter(menus, path_buttons);
        commit('SET_ROUTERS', accessedRouters);
        commit('set_path_buttons', path_buttons);
        commit('set_is_super', isSuper);
        resolve()
      })
    }
  }
}

export default permission
