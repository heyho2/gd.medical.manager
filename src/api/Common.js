import request from '@/utils/request'

// 获取系统时间
export function SystemTime() {
    return request({
        url: 'Common/SystemTime',
        method: 'get'
    })
}



// 获取天气预报接口
export function GetWeatherForecast(ip) {
    return request({
        url: 'Weather/GetWeatherForecast',
        method: 'get',
        params: { ip }
    })
}