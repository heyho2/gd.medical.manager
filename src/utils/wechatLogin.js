import {
  getToken,
  setToken,
  getWeChatMobileConfig,
  setWeChatMobileConfig,
  getWeChatCode,
  setWeChatCode
} from '@/utils/auth'

import router from '@/router'
import {
  GetWeChatMobileConfig,
  EnterpriseWeChatLoginAdmin
} from '@/api/login'
import store from '../store'
export function getParameter() {
  const str = location.href
  if (str.indexOf('?code') > 0) {
    const parames = str.split('=')[1].split('&')
    return parames[0]
  }
}
export function getHref() {
  const url = window.location.href
  return url
}
// 截取当前链接 拼接链接
export function intSplUrl(url) {
  if (url.indexOf('?code') > 0) {
    var a = url.split('?code')
    var b = a[1].split('#')
    return `${a[0]}#${b[1]}`
  } else {
    return url
  }
}
// 获取Appid 并跳转
export function getCode() {
  GetWeChatMobileConfig().then(res => {
    const locaAppid = res.data.appid
    const locaAgentid = res.data.agentid
    const redirectFunctionUrl = encodeURIComponent(intSplUrl(getHref()))
    localStorage.setItem('redirectWeChat:code', 'aassssssssss')
    window.location.href =
      `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${locaAppid}&redirect_uri=${redirectFunctionUrl}&response_type=code&scope=snsapi_privateinfo&agentid=${locaAgentid}&state=STATE#wechat_redirect`
  })
}
// 获取code并且登录
export function redirectWeChat() {
  return new Promise((resolve, result) => {
    if (getParameter() && localStorage.getItem('redirectWeChat:code') == 'aassssssssss') {
      EnterpriseWeChatLoginAdmin({
        code: getParameter(),
        days: 30
      }).then(res => {
        const { token } = res.data
        setToken(token)
        localStorage.rabbitMQ = res.data.rabbitMQ
        localStorage.setItem('redirectWeChat:code', '')
        resolve(res.data)
      })
    } else {
      // getCode()
    }
  })
}

