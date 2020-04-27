import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const WeChatMobileConfigKey = 'Admin-WeChatMobileConfig'
const WeChatCodeKey = 'Admin-WeChatCode'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getWeChatMobileConfig() {
  var data = Cookies.get(WeChatMobileConfigKey)
  return data ? JSON.parse(data) : {}
}
export function setWeChatMobileConfig(data) {
  return Cookies.remove(WeChatMobileConfigKey, JSON.stringify(data))
}
export function getWeChatCode() {
  return Cookies.get(WeChatCodeKey)
}

export function setWeChatCode(code) {
  return Cookies.set(WeChatCodeKey, code)
}
