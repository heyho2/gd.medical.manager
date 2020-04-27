import request from '@/utils/request'
//获取用户数量
export function QueryAsync(data) {
    return request({
        url: 'Utility/ExecuteSql/QueryAsync',
        method: 'post',
        data
    })
}