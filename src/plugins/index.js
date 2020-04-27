import Vue from 'vue'

// socket
import './stomp.js'
import './sockjs.min.js'
import './rabbitMQ.js'

import { Message, Notification } from 'element-ui'
Vue.prototype.$success = function (msg) {
  return Notification({
    title: '成功',
    message: msg || '成功',
    type: 'success',
    duration: 2000
  })
}

Vue.prototype.$error = function (msg) {
  return Message({
    message: msg || 'error',
    type: 'error'
  })
}
