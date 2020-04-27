import request from '@/utils/request'
var base_url = 'report/CommonReport/'
// /审核列表
export function CreateReport(data) {
  return request({
    url: `${base_url}CreateReport`,
    method: 'post',
    isLoading: true,
    data: data
  })
}

export function GetReportListAsync(data) {
  return request({
    url: `${base_url}GetReportListAsync`,
    method: 'post',
    data: data
  })
}
export function GetOneReport(data) {
  return request({
    url: `${base_url}GetOneReport`,
    method: 'post',
    isLoading: true,
    data: data
  })
}
export function UpdateOneReport(data) {
  return request({
    url: `${base_url}UpdateOneReport`,
    method: 'post',
    isLoading: true,
    data: data
  })
}
export function GetConditionListAsync(data) {
  return request({
    url: `${base_url}GetConditionListAsync`,
    method: 'post',
    isLoading: true,
    data: data
  })
}

export function PreviewResultInSqlAsync(data) {
  return request({
    url: `${base_url}PreviewResultInSqlAsync`,
    method: 'post',
    data: data
  })
}
