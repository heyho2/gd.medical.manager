import request from '@/utils/request'
///搜索课程
export function SearchCourseAsync(data) {
    
    return request({
        url: 'Utility/Course/SearchCourseAsync',
        method: 'post',
        isLoading: false,
        data: data
    })
}

///获取课程列表
export function GetCourseListAsync(data) {
    
    return request({
        url: 'Utility/Course/GetCourseListAsync',
        method: 'post',
        isLoading: false,
        data: data
    })
}

///添加课程
export function AddCourseAsync(data) {
    return request({
        url: 'Utility/Course/AddCourseAsync',
        method: 'post',
        data: data
    })
}

///修改课程
export function UpdateCourseAsync(data) {
    return request({
        url: 'Utility/Course/UpdateCourseAsync',
        method: 'post',
        data: data
    })
}

///获取课程信息
export function GetCourseInfoAsync(data) {
    return request({
        url: 'Utility/Course/GetCourseInfoAsync',
        method: 'post',
        data: data
    })
}

///是否可阅读
export function SetCourseVisibleAsync(data) {
    return request({
        url: 'Utility/Course/SetCourseVisibleAsync',
        method: 'post',
        data: data
    })
}
///是否禁用
export function DisableEnableCourseAsync(data) {
    return request({
        url: 'Utility/Course/DisableEnableCourseAsync',
        method: 'post',
        data: data
    })
}

export function DeleteCourseAsync(guid) {
    return request({
        url: 'Utility/Course/DeleteCourseAsync',
        method: 'get',
        params: { guid }
    })
}



