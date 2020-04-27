import request from '@/utils/request'

//  康管理师
const api = 'health/HealthManager/'

//  添加健康管理师
export function CreateHealthManager(data) {
  return request({
    url: `${api}Create`,
    method: 'post',
    isLoading: false,
    data
  })
}

// 获取指定健康管理师信息
export function GetHealthManager(params) {
  return request({
    url: `${api}Get`,
    method: 'get',
    isLoading: false,
    params
  })
}

// 更新健康管理师
export function UpdateHealthManager(data) {
  return request({
    url: `${api}Update`,
    method: 'post',
    data: data
  })
}

// 查询健康管理师分页列表
export function GetHealthManagers(params) {
  return request({
    url: `${api}GetHealthManagers`,
    isLoading: false,
    method: 'get',
    params
  })
}

// 启用或禁用指定健康管理师
export function UpdateStatus(params) {
  return request({
    url: `${api}UpdateStatus`,
    method: 'post',
    params
  })
}

// 查询指定健康管理师已绑定会员分页列表
export function GetHealthManagerConsumers(params) {
  return request({
    url: `${api}GetHealthManagerConsumers`,
    method: 'get',
    isLoading: false,
    params
  })
}

// 解除会员绑定健康管理师
export function CancelBindHealthManager(params) {
  return request({
    url: `${api}CancelBindHealthManager`,
    method: 'post',
    isLoading: false,
    params
  })
}
// 解除会员绑定健康管理师
export function GetChangeHealthManagers(params) {
  return request({
    url: `${api}GetChangeHealthManagers`,
    method: 'get',
    isLoading: false,
    params
  })
}
// 会员绑定健康管理师
export function BindHealthManager(data) {
  return request({
    url: `${api}BindHealthManager`,
    method: 'post',
    isLoading: false,
    data
  })
}
// 批量会员绑定健康管理师
export function BatchBindHealthManager(data) {
  return request({
    url: `${api}BatchBindHealthManager`,
    method: 'post',
    isLoading: true,
    data
  })
}
// 批量会员绑定健康管理师
export function GetHealthManagerFllowupRecords(params) {
  return request({
    url: `${api}GetHealthManagerFllowupRecords`,
    method: 'get',
    isLoading: false,
    params
  })
}
// 获取未被禁用健康管理员简单列表信息
export function GetSimpleHealthManagers(params) {
  return request({
    url: `${api}GetSimpleHealthManagers`,
    method: 'get',
    isLoading: false,
    params
  })
}
