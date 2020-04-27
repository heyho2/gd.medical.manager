import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css
import '@/styles/font/iconfont.css' // 阿里字体图标

import App from './App'
import router from './router'
import store from './store'
import '@/directive/permission/index'

import '@/icons' // icon
import '@/permission' // permission control

Vue.use(ElementUI)

import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
Vue.use(preview)

// =======================================================全局过滤器
import * as filters from '@/filters'

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// =======================================================全局组件
import '@/components/globalComponents'

import '@/plugins'

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
