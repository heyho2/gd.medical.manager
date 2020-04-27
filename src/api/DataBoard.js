import request from '@/utils/request'

// 获取当天营收总金额
export function GetTodayTotalAsync(data) {
  return request({
    url: 'DataBoard/DataBoard/GetTodayTotalAsync',
    method: 'get',
    isLoading: false,
    params: data
  })
}
// 微信扫码收款情况
export function GetWeChatDetailAsync(data) {
  return request({
    url: 'DataBoard/DataBoard/GetWeChatDetailAsync',
    method: 'get',
    isLoading: false,
    params: data
  })
}
// 今日微信扫码收款情况
export function GetDayWeChatDetailAsync(data) {
  return request({
    url: 'DataBoard/DataBoard/GetDayWeChatDetailAsync',
    method: 'get',
    isLoading: false,
    params: data
  })
}
// 单日医院业绩占比
export function GetDayWeChatScaleAsync(data) {
  return request({
    url: 'DataBoard/DataBoard/GetDayWeChatScaleAsync',
    method: 'get',
    isLoading: false,
    params: data
  })
}
// 医院业绩日报(元)
export function GetDayAchievementAsync(data) {
  return request({
    url: 'DataBoard/DataBoard/GetDayAchievementAsync',
    method: 'get',
    isLoading: false,
    params: data
  })
}
// 昨日医院支付笔数占比
export function GetLastDayWeChatPayCountAsync(data) {
  return request({
    url: 'DataBoard/DataBoard/GetLastDayWeChatPayCountAsync',
    method: 'get',
    isLoading: false,
    params: data
  })
}
// 医院本月累计已完成
export function GetMonthDetailAsync(data) {
  return request({
    url: 'DataBoard/DataBoard/GetMonthDetailAsync',
    method: 'get',
    isLoading: false,
    params: data
  })
}
// 医院业绩趋势统计
export function GetTrendAsync(data) {
  return request({
    url: 'DataBoard/DataBoard/GetTrendAsync',
    method: 'get',
    isLoading: false,
    params: data
  })
}
