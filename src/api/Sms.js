import request from '@/utils/request'
//获取用户数量
export function GetSmsUserGroupEnums() {
    return request({
        url: 'Utility/sms/GetSmsUserGroupEnums',
        method: 'get'
    })
}
//获取用户数量
export function SendMessageServiceAsync() {
    return request({
        url: 'Utility/sms/SendMessageServiceAsync',
        method: 'get'
    })
}