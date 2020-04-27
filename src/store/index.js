import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import getters from './getters'
import errorLog from './modules/errorLog'
import tagsView from './modules/tagsView'
import permission from './modules/permission'
import member from './modules/member'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    errorLog,
    tagsView,
    user,
    permission,
    member
  },
  getters
})

export default store
