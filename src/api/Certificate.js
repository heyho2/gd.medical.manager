import store from '../store'
import request from '@/utils/request'
///证书列表
export function GetCertificateListAsync(data) {
    return request({
        url: 'System/Certificate/GetCertificateListAsync',
        method: 'post',
        data: data
    })
}