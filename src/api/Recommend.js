import request from '@/utils/request'
// 推荐列表
export function GetRecommendPageAsync(data) {
  return request({
    url: 'System/Recommend/GetRecommendPageAsync',
    method: 'post',
    data: data
  })
}
// 获取推荐类型
export function GetRecommendTypes(data) {
  return request({
    url: 'System/Recommend/GetRecommendTypes',
    method: 'post',
    data: data
  })
}
// 新增推荐
export function AddRecommendAsync(data) {
  return request({
    url: 'System/Recommend/AddRecommendAsync',
    method: 'post',
    data: data
  })
}
// 删除推荐
export function DeleteRecommendAsync(data) {
  return request({
    url: 'System/Recommend/DeleteRecommendAsync',
    method: 'post',
    data: data
  })
}
// 修改推荐
export function UpdateRecommendAsync(data) {
  return request({
    url: 'System/Recommend/UpdateRecommendAsync',
    method: 'post',
    data: data
  })
}
// 新增推荐详细
export function AddRecommendDetailAsync(data) {
  return request({
    url: 'System/Recommend/AddRecommendDetailAsync',
    method: 'post',
    data: data
  })
}
// 删除推荐详细
export function DeleteRecommendDetailAsync(data) {
  return request({
    url: 'System/Recommend/DeleteRecommendDetailAsync',
    method: 'post',
    data: data
  })
}
// 删除推荐详细
export function DeleteRecommendDetail2Async(data) {
  return request({
    url: 'System/Recommend/DeleteRecommendDetail2Async',
    method: 'post',
    data: data
  })
}

// 启用禁用
export function DisableEnableRecommendAsync(data) {
  return request({
    url: 'System/Recommend/DisableEnableRecommendAsync',
    method: 'post',
    data: data
  })
}
// /获取文章推荐列表
export function GetRecommendArticleListAsync(data) {
  return request({
    url: 'System/Recommend/GetRecommendArticleListAsync',
    isLoading: false,
    method: 'post',
    data: data
  })
}
// /获取课程推荐列表
export function GetRecommendCourseListAsync(data) {
  return request({
    url: 'System/Recommend/GetRecommendCourseListAsync',
    isLoading: false,
    method: 'post',
    data: data
  })
}
// /获取科室推荐列表
export function GetRecommendOfficeListAsync(data) {
  return request({
    url: 'System/Recommend/GetRecommendOfficeListAsync',
    isLoading: false,
    method: 'post',
    data: data
  })
}
// /获取医院推荐列表
export function GetRecommendHospitalListAsync(data) {
  return request({
    url: 'System/Recommend/GetRecommendHospitalListAsync',
    isLoading: false,
    method: 'post',
    data: data
  })
}
// /获取医生推荐列表
export function GetRecommendDoctorListAsync(data) {
  return request({
    url: 'System/Recommend/GetRecommendDoctorListAsync',
    isLoading: false,
    method: 'post',
    data: data
  })
}
// /获取商品推荐列表
export function GetRecommendProductListAsync(data) {
  return request({
    url: 'System/Recommend/GetRecommendProductListAsync',
    isLoading: false,
    method: 'post',
    data: data
  })
}
// / 获取 推荐集合
export function GetOwnerGuidsAsync(params) {
  return request({
    url: 'System/Recommend/GetOwnerGuidsAsync',
    method: 'get',
    params
  })
}

export function SaveRecommendDetailAllAsync(data) {
  return request({
    url: 'System/Recommend/SaveRecommendDetailAllAsync',
    method: 'post',
    data
  })
}
