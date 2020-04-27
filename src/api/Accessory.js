import request from '@/utils/request'

//账号列表
export function GetAcessoryUrlAsync(accessoryGuid) {
    return request({
        url: 'System/Accessory/GetAcessoryUrlAsync',
        method: 'get',
        isLoading: false,
        params: { accessoryGuid }
    })
}