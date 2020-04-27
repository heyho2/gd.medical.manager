import request from '@/utils/request'
import cache from '@/utils/cache'

// /审核列表
export function GetReviewMerchantPageAsync(data) {
  return request({
    url: 'merchantbase/Merchant/GetReviewMerchantPageAsync',
    isLoading: false,
    method: 'post',
    data: data
  })
}
// /审核驳回
export function ReviewRejectMerchantAsync(data) {
  return request({
    url: 'merchantbase/Merchant/ReviewRejectMerchantAsync',
    method: 'post',
    data: data
  })
}
// /审核通过
export function ReviewApprovedMerchantAsync(data) {
  return request({
    url: 'merchantbase/Merchant/ReviewApprovedMerchantAsync',
    method: 'post',
    data: data
  })
}

// /商户列表（b端管理）
export function GetMerchantPageAsync(data) {
  return request({
    url: 'merchantbase/Merchant/GetMerchantPageAsync',
    method: 'post',
    data: data
  })
}
// /启用禁用
export function DisableEnableMerchantAsync(data) {
  return request({
    url: 'merchantbase/Merchant/DisableEnableMerchantAsync',
    method: 'post',
    data: data
  })
}
// /获取经范围
export function GetBusinessScopeListAsync() {
  return request({
    url: 'merchantbase/Merchant/GetBusinessScopeListAsync',
    method: 'get'
  })
}
export function GetMerchantOrderDetailPageAsync(data) {
  return request({
    url: 'merchantbase/Merchant/GetMerchantOrderDetailPageAsync',
    method: 'post',
    data
  })
}
// /获取用户商品购买次数
export function GetUserShopCountAsync(productGuid, userGuid) {
  return request({
    url: 'merchantbase/Merchant/GetUserShopCountAsync',
    method: 'get',
    params: { productGuid, userGuid }
  })
}
// /获取经营范围许可证
export function GetBusinessScopeLicenseListAsync(merchantGuid) {
  return request({
    url: 'merchantbase/Merchant/GetBusinessScopeLicenseListAsync',
    method: 'get',
    params: { merchantGuid }
  })
}
// /注册商户
export function RegisterMerchantAsync(data) {
  return request({
    url: 'merchantbase/Merchant/RegisterMerchantAsync',
    method: 'post',
    data
  })
}
// 修改商户
export function UpdateMerchantAsync(data) {
  return request({
    url: 'merchantbase/Merchant/UpdateMerchantAsync',
    method: 'post',
    data
  })
}
// 获取商户信息
export function GetMerchantInfoAsync(data) {
  return request({
    url: 'merchantbase/Merchant/GetMerchantInfoAsync',
    method: 'post',
    data
  })
}

// 医院列表
export function GetHospitalSelectAsync() {
  return request({
    url: 'merchantbase/Merchant/GetHospitalSelectAsync',
    method: 'get',
    adapter: cache({
      local: false
    })
  })
}
// 获取商户信息
export function GetMerchantCertificateAsync(merchantGuid) {
  return request({
    url: 'merchantbase/Merchant/GetMerchantCertificateAsync',
    method: 'get',
    params: { merchantGuid }
  })
}
// 删除经营范围
export function DeleteBusinessScopeAsync(scopeGuid) {
  return request({
    url: 'merchantbase/Merchant/DeleteBusinessScopeAsync',
    method: 'post',
    params: { scopeGuid }
  })
}

// /修改是上下架
export function GetMerchantSelectAsync(params) {
  return request({
    url: 'merchantbase/Merchant/GetMerchantSelectAsync',
    method: 'get',
    params
  })
}
