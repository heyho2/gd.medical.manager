import { login, logout, GetLoginUserInfoAsync } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { md5 } from '@/utils/md5'

const user = {
  state: {
    token: getToken(),
    name: null,
    avatar: '',
    isSuper: false,
    roles: [],
    menus: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    set_isSuper: (state, isSuper) => {
      state.isSuper = isSuper
    },
    set_menus: (state, menus) => {
      state.menus = menus
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      const password = md5(userInfo.password).toUpperCase()

      return new Promise((resolve, reject) => {
        login(username, password).then(response => {
          const data = response.data
          localStorage.rabbitMQ = data.rabbitMQ
          setToken(data.token)
          commit('SET_TOKEN', data.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        GetLoginUserInfoAsync().then(response => {
          const data = response.data
          commit('SET_ROLES', data.roles)
          commit('set_isSuper', data.isSuper)
          commit('set_menus', data.menus)
          commit('SET_NAME', data.nickName)
          commit('SET_AVATAR', data.avatar)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        localStorage.clear()
        resolve()
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        localStorage.clear()
        resolve()
      })
    }
  }
}

export default user
