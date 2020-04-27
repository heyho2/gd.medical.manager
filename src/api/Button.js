import request from '@/utils/request'
import cache from '@/utils/cache'

//按钮列表
export function GetButtonListAsync(menuGuid) {
    return request({
        url: 'System/Button/GetButtonListAsync',
        method: 'get',
        isLoading: true,
        loadingTime: 200,
        loadingText: "按钮请求中...",
        params: { menuGuid }
    })
}
//添加按钮
export function AddButtonAsync(data) {
    return request({
        url: 'System/Button/AddButtonAsync',
        method: 'post',
        data: data
    })
}

//修改按钮
export function UpdateButtonAsync(data) {
    return request({
        url: 'System/Button/UpdateButtonAsync',
        method: 'post',
        data: data
    })
}

//删除按钮
export function DeleteButtonAsync(data) {
    return request({
        url: 'System/Button/DeleteButtonAsync',
        method: 'post',
        data: data
    })
}
