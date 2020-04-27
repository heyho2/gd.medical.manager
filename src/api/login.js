import request from '@/utils/request'

export function login(phone, password) {
  return request({
    url: '/Account/LoginAdmin',
    method: 'post',
    isLoading: false,
    data: {
      account: phone,
      password,
      days: 1
    }
  })
}
// 获取当前登录人信息
export function GetLoginUserInfoAsync() {
  return request({
    url: 'System/User/GetLoginUserInfoAsync',
    isLoading: false,
    method: 'get'
  })
}

// 获取企业微信平台端配置信息
export function GetWeChatMobileConfig() {
  return request({
    url: '/Account/GetWeChatMobileConfig',
    isLoading: false,
    method: 'get'
  })
}
// 使用企业微信登录管理后台
export function EnterpriseWeChatLoginAdmin(data) {
  return request({
    url: '/Account/EnterpriseWeChatLoginAdmin',
    isLoading: false,
    method: 'POST',
    data
  })
}
