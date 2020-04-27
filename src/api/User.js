import request from '@/utils/request'

// 账号列表
export function GetAccountListAsync(data) {
  return request({
    url: 'System/User/GetAccountListAsync',
    method: 'post',
    isLoading: false,
    data: data
  })
}
// 获取用户信息
export function GetAccountInfoAsync(data) {
  return request({
    url: 'System/User/GetAccountInfoAsync',
    method: 'post',
    data: data
  })
}

// 添加账号
export function AddAccountAsync(data) {
  return request({
    url: 'System/User/AddAccountAsync',
    method: 'post',
    data: data
  })
}
// 修改账号
export function UpdateAccountAsync(data) {
  return request({
    url: 'System/User/UpdateAccountAsync',
    method: 'post',
    data: data
  })
}
// 禁用启用账号
export function DisableEnableAccountAsync(data) {
  return request({
    url: 'System/User/DisableEnableAccountAsync',
    method: 'post',
    data: data
  })
}
// 修改密码
export function UpdateAccountPasswordAsync(data) {
  return request({
    url: 'System/User/UpdateAccountPasswordAsync',
    method: 'post',
    data: data
  })
}
/* -----------------------组织架构------------------------- */

// 组织架构列表
export function GetOrganizationTreeAsync(data) {
  return request({
    url: 'System/User/GetOrganizationTreeAsync',
    method: 'post',
    isLoading: false,
    data: data
  })
}
// 添加组织架构
export function AddOrganizationAsync(data) {
  return request({
    url: 'System/User/AddOrganizationAsync',
    method: 'post',
    data: data
  })
}
// 修改组织架构
export function UpdateOrganizationAsync(data) {
  return request({
    url: 'System/User/UpdateOrganizationAsync',
    method: 'post',
    data: data
  })
}
// 修改组织架构
export function DeleteOrganizationAsync(data) {
  return request({
    url: 'System/User/DeleteOrganizationAsync',
    method: 'post',
    data: data
  })
}
// 禁用启用组织架构
export function DisableEnableOrganizationAsync(data) {
  return request({
    url: 'System/User/DisableEnableOrganizationAsync',
    method: 'post',
    data: data
  })
}
/* ------------------------------------------------ */
// 角色列表
export function GetRoleListAsync(data) {
  return request({
    url: 'System/User/GetRoleListAsync',
    method: 'post',
    isLoading: false,
    data: data
  })
}
// 添加角色
export function AddRoleAsync(data) {
  return request({
    url: 'System/User/AddRoleAsync',
    method: 'post',
    data: data
  })
}
// 修改角色
export function UpdateRoleAsync(data) {
  return request({
    url: 'System/User/UpdateRoleAsync',
    method: 'post',
    data: data
  })
}
// 禁用启用角色
export function DisableEnableRoleAsync(data) {
  return request({
    url: 'System/User/DisableEnableRoleAsync',
    method: 'post',
    data: data
  })
}
