import request from '@/utils/request'
// 头条列表
export function GetHeadlinePageAsync(data) {
  return request({
    url: 'System/Headline/GetHeadlinePageAsync',
    method: 'post',
    data: data
  })
}
// 添加头条
export function AddHeadlineAsync(data) {
  return request({
    url: 'System/Headline/AddHeadlineAsync',
    method: 'post',
    data: data
  })
}
// 修改头条
export function UpdateHeadlineAsync(data) {
  return request({
    url: 'System/Headline/UpdateHeadlineAsync',
    method: 'post',
    data: data
  })
}
// 修改头条
export function DisableEnableHeadlineAsync(data) {
  return request({
    url: 'System/Headline/DisableEnableHeadlineAsync',
    method: 'post',
    data: data
  })
}
// 修改头条
export function DeleteHeadlineAsync(data) {
  return request({
    url: 'System/Headline/DeleteHeadlineAsync',
    method: 'post',
    data: data
  })
}
