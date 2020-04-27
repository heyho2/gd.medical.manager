import request from '@/utils/request'

//  日常健康指标控制器
const api = 'HealthIndicator/'

//  获取用户日常指标列表
export function GetHealthIndicatorList(data) {
  return request({
    url: api + 'GetHealthIndicatorList',
    method: 'get',
    isLoading: false,
    params: data
  })
}

// 获取健康指标项数据
export function GetHealthIndicatorOptions(data) {
  return request({
    url: api + 'GetHealthIndicatorOptions',
    method: 'get',
    isLoading: false,
    params: data
  })
}

// 更新医生建议
export function UpdateConsumerHealthIndicatorSuggestion(data) {
  return request({
    url: api + 'UpdateConsumerHealthIndicatorSuggestion',
    method: 'post',
    isLoading: false,
    data: data
  })
}

// 添加会员健康指标
export function CreateConsumerHealthIndicatorOptions(data) {
  return request({
    url: api + 'CreateConsumerHealthIndicatorOptions',
    method: 'post',
    isLoading: false,
    data: data
  })
}

// 获取健康指标列表
export function GetHealthIndicators(data) {
  return request({
    url: api + 'GetHealthIndicators',
    method: 'get',
    isLoading: false,
    params: data
  })
}

// 保存日常指标设置
export function SaveHealthIndicators(data) {
  return request({
    url: api + 'SaveHealthIndicators',
    method: 'post',
    isLoading: false,
    data: data
  })
}

// 获取健康指标项详情数据
export function GetHealthIndicatorDetails(data) {
  return request({
    url: api + 'GetHealthIndicatorDetails',
    method: 'get',
    isLoading: false,
    params: data
  })
}
// 获取健康指标项详情数据
export function SaveIndicatorWarningLimit(data) {
  return request({
    url: api + 'SaveIndicatorWarningLimit',
    method: 'post',
    isLoading: false,
    data
  })
}
// 获取健康指标项详情数据
export function GetIndicatorWarningLimit(params) {
  return request({
    url: api + 'GetIndicatorWarningLimit',
    method: 'get',
    isLoading: false,
    params
  })
}
