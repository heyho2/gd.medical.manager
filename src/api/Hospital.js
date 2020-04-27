import request from '@/utils/request'
import cache from '@/utils/cache'

// 获取云医医院公众号二维码
export function GetUserWeChatQRCodeAsync(params) {
  return request({
    url: 'System/User/GetUserWeChatQRCodeAsync',
    isLoading: false,
    method: 'get',
    params
  })
}

// 医院列表
export function GetHospitalPageAsync(data) {
  return request({
    url: 'Doctor/Hospital/GetHospitalPageAsync',
    method: 'post',
    data: data
  })
}
// 医院级别
export function GetHospitalLevel(data) {
  return request({
    url: 'Doctor/Hospital/GetHospitalLevel',
    method: 'post',
    data: data
  })
}
// 添加医院
export function AddHospitalAsync(data) {
  return request({
    url: 'Doctor/Hospital/AddHospitalAsync',
    method: 'post',
    data: data
  })
}
// 修改医院
export function UpdateHospitalAsync(data) {
  return request({
    url: 'Doctor/Hospital/UpdateHospitalAsync',
    method: 'post',
    data: data
  })
}
// 禁用医院
export function DisableEnableHospitalAsync(data) {
  return request({
    url: 'Doctor/Hospital/DisableEnableHospitalAsync',
    method: 'post',
    data: data
  })
}
// 医院列表
export function GetHospitalInfoAsync(data) {
  return request({
    url: 'Doctor/Hospital/GetHospitalInfoAsync',
    method: 'post',
    data: data
  })
}
// 医院搜索
export function SearchHospitalAsync(data) {
  return request({
    url: 'Doctor/Hospital/SearchHospitalAsync',
    method: 'post',
    data: data
  })
}
// 医院搜索
export function DeleteHospitalAsync(guid) {
  return request({
    url: 'Doctor/Hospital/DeleteHospitalAsync',
    method: 'get',
    params: { guid }
  })
}

/* -----------------------科室------------------------ */
export function GetOfficeListAsync(data) {
  return request({
    url: 'Doctor/Hospital/GetOfficeListAsync',
    method: 'post',
    data: data
  })
}

export function AddOfficeAsync(data) {
  return request({
    url: 'Doctor/Hospital/AddOfficeAsync',
    method: 'post',
    data: data
  })
}
export function UpdataOfficeAsync(data) {
  return request({
    url: 'Doctor/Hospital/UpdataOfficeAsync',
    method: 'post',
    data: data
  })
}
export function SearchOfficeAsync(data) {
  return request({
    url: 'Doctor/Hospital/SearchOfficeAsync',
    method: 'post',
    data: data
  })
}
export function GetFirstOfficeListAsync(data) {
  return request({
    url: 'Doctor/Hospital/GetFirstOfficeListAsync',
    method: 'get'
  })
}
export function DisableEnableOfficeAsync(data) {
  return request({
    url: 'Doctor/Hospital/DisableEnableOfficeAsync',
    method: 'post',
    data: data
  })
}

/* -----------------------其他------------------------ */
export function GetHospitalAllSelectAsync(params) {
  return request({
    url: 'Doctor/Hospital/GetHospitalAllSelectAsync',
    method: 'get',
    params,
    adapter: cache({
      local: false // 是否永久保留在本地，默认为false
    })
  })
}
export function GetHospitalOfficeSelectAsync(params) {
  return request({
    url: 'Doctor/Hospital/GetHospitalOfficeSelectAsync',
    method: 'get',
    params,
    adapter: cache({
      local: false // 是否永久保留在本地，默认为false
    })
  })
}
// /重置密码
export function ResetPasswordAsync(data) {
  return request({
    url: 'Doctor/Hospital/ResetPasswordAsync',
    method: 'post',
    data
  })
}
