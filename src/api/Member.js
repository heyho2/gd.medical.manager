import request from '@/utils/request'

// 会员列表
export function GetMemberPageAsync(data) {
  return request({
    url: 'Mall/Member/GetMemberPageAsync',
    method: 'post',
    data: data
  })
}

// 会员信息
export function GetMemberInfoAsync(params) {
  return request({
    url: 'Mall/Member/GetMemberInfoAsync',
    isLoading: false,
    method: 'get',
    params
  })
}

// 会员订单列表
export function GetMemberOrderPageAsync(data) {
  return request({
    url: 'Mall/Member/GetMemberOrderPageAsync',
    isLoading: false,
    method: 'post',
    data: data
  })
}

// 会员订单详细列表
export function GetOrderDetailPageAsync(data) {
  return request({
    url: 'Mall/Member/GetOrderDetailPageAsync',
    isLoading: false,
    method: 'post',
    data: data
  })
}
// 订单信息（详细信息）
export function GetOrderInfoAsync(orderGuid) {
  return request({
    url: 'Mall/Member/GetOrderInfoAsync',
    isLoading: false,
    method: 'get',
    params: { orderGuid }
  })
}
