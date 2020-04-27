import request from '@/utils/request'

//  日常健康指标控制器
const api = 'health/HealthInformation/'

//  获取会员基础信息
export function GetHealthInformationAsync(data) {
  return request({
    url: api + 'GetHealthInformationAsync',
    method: 'get',
    isLoading: false,
    params: data
  })
}

//  健康基础数据更新
export function UpdateHealthInformationAsync(data) {
  return request({
    url: api + 'UpdateHealthInformationAsync',
    method: 'post',
    isLoading: false,
    data: data
  })
}

// 保存健康基础信息配置项数据
export function SaveHealthInformationAsync(data) {
  return request({
    url: api + 'SaveHealthInformationAsync',
    method: 'post',
    isLoading: true,
    data
  })
}
// 保存健康基础信息配置项数据
export function GetHealthInfoBasicDataAsync() {
  return request({
    url: api + 'GetHealthInfoBasicDataAsync',
    method: 'get',
    isLoading: true
  })
}

