import request from '@/utils/request'

// 文章列表
export function GetArticleListAsync(params) {
  return request({
    url: 'Utility/Article/GetArticleListAsync',
    method: 'get',
    params
  })
}
// 文章列表
export function GetArticleTypeAsync() {
  return request({
    url: 'Utility/Article/GetArticleTypeAsync',
    method: 'get'

  })
}
// 添加文章
export function AddArticleAsync(data) {
  return request({
    url: 'Utility/Article/AddArticleAsync',
    method: 'post',
    data: data
  })
}
// 修改文章
export function UpdateArticleAsync(data) {
  return request({
    url: 'Utility/Article/UpdateArticleAsync',
    method: 'post',
    data: data
  })
}
// 获取文章信息
export function GetArticleInfoAsync(data) {
  return request({
    url: 'Utility/Article/GetArticleInfoAsync',
    method: 'post',
    data: data
  })
}
// /是否可阅读是否可阅读
export function SetArticleVisibleAsync(data) {
  return request({
    url: 'Utility/Article/SetArticleVisibleAsync',
    method: 'post',
    data: data
  })
}
// /搜索文章
export function SearchArticleAsync(data) {
  return request({
    url: 'Utility/Article/SearchArticleAsync',
    isLoading: false,
    method: 'post',
    data: data
  })
}
// /删除文章
export function DeleteArticleAsync(data) {
  return request({
    url: 'Utility/Article/DeleteArticleAsync',
    method: 'post',
    data: data
  })
}
// /禁用/启用文章
export function DisableEnableArticleAsync(data) {
  return request({
    url: 'Utility/Article/DisableEnableArticleAsync',
    method: 'post',
    data: data
  })
}
