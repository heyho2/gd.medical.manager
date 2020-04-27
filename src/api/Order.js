import request from '@/utils/request'

// 订单详细列表
export function GetOrderDetailPageAsync(data) {
  return request({
    url: 'Mall/Order/GetOrderDetailPageAsync',
    isLoading: false,
    method: 'post',
    data: data
  })
}

// 订单列表
export function GetOrderPageAsync(data) {
  return request({
    url: 'Mall/Order/GetOrderPageAsync',
    isLoading: false,
    method: 'post',
    data: data
  })
}
// 订单信息（详细信息）
export function GetOrderInfoAsync(orderGuid) {
  return request({
    url: 'Mall/Order/GetOrderInfoAsync',
    isLoading: false,
    method: 'get',
    params: { orderGuid }
  })
}
// /查询商户订单分页列表
export function GetMerchantOrderPageListAsync(params) {
  return request({
    url: 'Mall/Order/GetMerchantOrderPageListAsync',
    isLoading: false,
    method: 'get',
    params
  })
}
