import request from '@/utils/request'

//账号列表
export function GetBannerPageAsync(data) {

    return request({
        url: 'System/Banner/GetBannerPageAsync',
        isLoading: false,
        method: 'post',
        data: data
    })
}
//获取智慧云医banner类型
export function GetBannerType1(data) {
    return request({
        url: 'System/Banner/GetBannerType1',
        method: 'post',
        data: data
    })
}
//获取双美banner类型
export function GetBannerType2(data) {
    return request({
        url: 'System/Banner/GetBannerType2',
        method: 'post',
        data: data
    })
}
//修改banner
export function AddBannerAsync(data) {
    return request({
        url: 'System/Banner/AddBannerAsync',
        method: 'post',
        data: data
    })
}
//添加账号
export function UpdateBannerAsync(data) {
    return request({
        url: 'System/Banner/UpdateBannerAsync',
        method: 'post',
        data: data
    })
}
//禁用banner
export function DisableEnableBannerAsync(data) {
    return request({
        url: 'System/Banner/DisableEnableBannerAsync',
        method: 'post',
        data: data
    })
}