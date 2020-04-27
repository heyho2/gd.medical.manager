import request from '@/utils/request'
import cache from '@/utils/cache'

//菜单列表
export function GetMenuTreeAsync(data) {
    return request({
        url: 'System/Menu/GetMenuTreeAsync',
        isLoading: true,
        loadingTime:200,
        loadingText: "菜单请求中...",
        method: 'post',
        data: data
    })
}
//菜单列表
export function GetMenuTreeCacheAsync(data) {
    return request({
        url: 'System/Menu/GetMenuTree2Async',
        isLoading: true,
        loadingText: "菜单请求中...",
        loadingTime:200,
        adapter: cache({
            local: false // 是否永久保留在本地，默认为false
        }),
        method: 'post',
        data: data
    })
}
//修改菜单
export function UpdateMenuAsync(data) {
    return request({
        url: 'System/Menu/UpdateMenuAsync',
        method: 'post',
        data: data
    })
}
//添加菜单
export function AddMenuAsync(data) {
    return request({
        url: 'System/Menu/AddMenuAsync',
        method: 'post',
        data: data
    })
}
//禁用启用菜单
export function DisableEnableMenuAsync(data) {
    return request({
        url: 'System/Menu/DisableEnableMenuAsync',
        method: 'post',
        data: data
    })
}
//删除菜单
export function DeleteMenuAsync(data) {
    return request({
        url: 'System/Menu/DeleteMenuAsync',
        method: 'post',
        data: data
    })
}
//保存权限
export function SaveRoleMenuAsync(data) {
    return request({
        url: 'System/Menu/SaveRoleMenuAsync',
        method: 'post',
        data: data
    })
}
//获取权限
export function GetRoleMenuAsync(data) {
    return request({
        url: 'System/Menu/GetRoleMenuAsync',
        method: 'post',
        data: data
    })
}