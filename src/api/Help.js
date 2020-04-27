import request from '@/utils/request'
//常见问题
export function GetHelpPageAsync(data) {
    
    return request({
        url: 'Utility/Help/GetHelpPageAsync',
        method: 'post',
        isLoading: false,
        data: data
    })
}

//常见问题
export function AddHelpAsync(data) {
    return request({
        url: 'Utility/Help/AddHelpAsync',
        method: 'post',
        data: data
    })
}

//常见问题
export function UpdateHelpAsync(data) {
    return request({
        url: 'Utility/Help/UpdateHelpAsync',
        method: 'post',
        data: data
    })
}

//常见问题
export function DisableEnableHelpAsync(data) {
    return request({
        url: 'Utility/Help/DisableEnableHelpAsync',
        method: 'post',
        data: data
    })
}