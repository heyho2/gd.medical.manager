import request from '@/utils/request'
//获取用户数量
export function GetUserQtyAsync() {
    return request({
        url: 'System/home/GetUserQtyAsync',
        method: 'get'
    })
}
///获取医生数量
export function GetDoctorsQtyAsync() {
    return request({
        url: 'System/home/GetDoctorsQtyAsync',
        method: 'get'
    })
}
//获取商户数量
export function GetMerchantQtyAsync() {
    return request({
        url: 'System/home/GetMerchantQtyAsync',
        method: 'get'
    })
}
//获取订单数量
export function GetOrderQtyAsync() {
    return request({
        url: 'System/home/GetOrderQtyAsync',
        method: 'get'
    })
}

