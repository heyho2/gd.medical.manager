import request from '@/utils/request'

//账号列表
export function GetAdvisePageAsync(data) {
    return request({
        url: 'consumer/Advise/GetAdvisePageAsync',
        isLoading: false,
        method: 'post',
        data: data
    })
}