import request from '@/utils/request'
// /搜索医生
export function SearchDoctorAsync(data) {
  return request({
    url: 'Doctor/Doctor/SearchDoctorAsync',
    isLoading: false,
    method: 'post',
    data: data
  })
}
// /审核医生列表
export function GetReviewDoctorPageAsync(data) {
  return request({
    url: 'Doctor/Doctor/GetReviewDoctorPageAsync',
    isLoading: false,
    method: 'post',
    data: data
  })
}
// /审核驳回
export function ReviewRejectDoctorAsync(data) {
  return request({
    url: 'Doctor/Doctor/ReviewRejectDoctorAsync',
    method: 'post',
    data: data
  })
}
// /审核通过
export function ReviewApprovedDoctorAsync(data) {
  return request({
    url: 'Doctor/Doctor/ReviewApprovedDoctorAsync',
    method: 'post',
    data: data
  })
}

// /医生列表
export function GetDoctorPageAsync(data) {
  return request({
    url: 'Doctor/Doctor/GetDoctorPageAsync',
    loadingTime: 300,
    method: 'post',
    data
  })
}
// /医生列表
export function DisableEnableDoctorAsync(data) {
  return request({
    url: 'Doctor/Doctor/DisableEnableDoctorAsync',
    method: 'post',
    data
  })
}

// /医生会话列表
export function GetDoctorTopicAsync(data) {
  return request({
    url: 'Doctor/Doctor/GetDoctorTopicAsync',
    isLoading: false,
    method: 'post',
    data
  })
}

// /会话消息列表
export function TopicMessageAsync(data) {
  return request({
    url: 'Doctor/Doctor/TopicMessageAsync',
    isLoading: false,
    method: 'post',
    data
  })
}

// 获取医生详细信息
export function GetDoctorInfoAsync(data) {
  return request({
    url: 'Doctor/Doctor/GetDoctorInfoAsync',
    method: 'post',
    data: data
  })
}
// 获取职称
export function GetDoctorJobTitlesAsync() {
  return request({
    url: 'Doctor/Doctor/GetDoctorJobTitlesAsync',
    method: 'get'
  })
}
// 获取职称
export function UpdateDoctorInfoAsync(data) {
  return request({
    url: 'Doctor/Doctor/UpdateDoctorInfoAsync',
    method: 'post',
    data: data
  })
}
// 获取职称
export function GetDoctorCertificateDetailAsync(doctorGuid) {
  return request({
    url: 'Doctor/Doctor/GetDoctorCertificateDetailAsync',
    method: 'get',
    params: { doctorGuid }
  })
}
export function SaveDoctorCertificateDetailAsync(data) {
  return request({
    url: 'Doctor/Doctor/SaveDoctorCertificateDetailAsync',
    method: 'post',
    data
  })
}
// /医生积分列表
export function GetDoctorIntegralPageAsync(data) {
  return request({
    url: 'Doctor/Doctor/GetDoctorIntegralPageAsync',
    isLoading: false,
    method: 'post',
    data
  })
}
// /积分详细
export function GetIntegralInfoPageAsync(data) {
  return request({
    url: 'Doctor/Doctor/GetIntegralInfoPageAsync',
    method: 'post',
    data
  })
}
// /导出医生积分列表elecl数据
export function ExportDoctorIntegralAsync(data) {
  return request({
    url: 'Doctor/Doctor/ExportDoctorIntegralAsync',
    method: 'post',
    data
  })
}

// /导出积分详细列表elecl数据
export function ExportIntegralInfoAsync(data) {
  return request({
    url: 'Doctor/Doctor/ExportIntegralInfoAsync',
    method: 'post',
    data
  })
}
// /添加医生
export function AddDoctorInfoAsync(data) {
  return request({
    url: 'Doctor/Doctor/AddDoctorInfoAsync',
    method: 'post',
    data
  })
}
// /添加医生
export function RecommendDoctorAsync(data) {
  return request({
    url: 'Doctor/Doctor/RecommendDoctorAsync',
    method: 'post',
    data
  })
}
// /重置密码
export function ResetPasswordAsync(data) {
  return request({
    url: 'Doctor/Doctor/ResetPasswordAsync',
    method: 'post',
    data
  })
}

