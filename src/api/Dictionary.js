import request from '@/utils/request'
// 字典列表
export function GetDictionaryPageAsync(data) {
  return request({
    url: 'System/Dictionary/GetDictionaryPageAsync',
    isLoading: false,
    method: 'post',
    data: data
  })
}

// 添加Dictionary
export function AddDictionaryAsync(data) {
  return request({
    url: 'System/Dictionary/AddDictionaryAsync',
    method: 'post',
    data: data
  })
}

// 修改Dictionary
export function UpdateDictionaryAsync(data) {
  return request({
    url: 'System/Dictionary/UpdateDictionaryAsync',
    method: 'post',
    data: data
  })
}

// 禁用Dictionary
export function DisableEnableDictionaryAsync(data) {
  return request({
    url: 'System/Dictionary/DisableEnableDictionaryAsync',
    method: 'post',
    data: data
  })
}

// 字典树
export function GetDictionaryTreeAsync(data) {
  return request({
    url: 'System/Dictionary/GetDictionaryTreeAsync',
    method: 'post',
    data: data
  })
}

// 元数据
export function GetDictionaryMatedata(data) {
  return request({
    url: 'System/Dictionary/GetDictionaryMatedata',
    method: 'post',
    data: data
  })
}

// 删除
export function DeleteDictionaryAsync(data) {
  return request({
    url: 'System/Dictionary/DeleteDictionaryAsync',
    method: 'post',
    data: data
  })
}

// 获取商户证书
export function GetMerchantDictionaryAsync() {
  return request({
    url: 'System/Dictionary/GetMerchantDictionaryAsync',
    method: 'get'
  })
}
export function GetBusinessScopePageAsync(data) {
  return request({
    url: 'System/Dictionary/GetBusinessScopePageAsync',
    method: 'post',
    data
  })
}
export function UpdateBusinessScopeAsync(data) {
  return request({
    url: 'System/Dictionary/UpdateBusinessScopeAsync',
    method: 'post',
    data
  })
}
export function AddBusinessScopeAsync(data) {
  return request({
    url: 'System/Dictionary/AddBusinessScopeAsync',
    method: 'post',
    data
  })
}
// /经营范围类型
export function GetBusinessScopeType() {
  return request({
    url: 'System/Dictionary/GetBusinessScopeType',
    method: 'get'
  })
}

export function GetBusinessScopeTypeAsync() {
  return request({
    url: 'System/Dictionary/GetBusinessScopeTypeAsync',
    method: 'get'
  })
}
export function GetDictionaryTreeTypeAsync() {
  return request({
    url: 'System/Dictionary/GetDictionaryTreeTypeAsync',
    method: 'get'
  })
}
export function GetFaqsSettingTypeAsync() {
  return request({
    url: 'System/Dictionary/GetFaqsSettingTypeAsync',
    method: 'get'
  })
}
export function SaveFaqsSettingAsync(data) {
  return request({
    url: 'System/Dictionary/SaveFaqsSettingAsync',
    method: 'post',
    data
  })
}

