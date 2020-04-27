import request from '@/utils/request'
// /搜索文章
export function SearchProductAsync(data) {
  return request({
    url: 'mall/Product/SearchProductAsync',
    isLoading: false,
    method: 'post',
    data: data
  })
}
// /商品中心
export function ProductCenterAsync(params) {
  return request({
    url: 'mall/Product/ProductCenterAsync',
    method: 'get',
    params
  })
}
// /修改是上下架
export function UpdateOnlieCategory(params) {
  return request({
    url: 'mall/Product/UpdateOnlieCategory',
    isLoading: true,
    method: 'post',
    params
  })
}
// /修改推荐排序
export function UpdateRecommendSort(data) {
  return request({
    url: 'mall/Product/UpdateRecommendSort',
    isLoading: true,
    method: 'post',
    data: data
  })
}

// /修改推荐到首页
export function UpdateRecommend(params) {
  return request({
    url: 'mall/Product/UpdateRecommend',
    isLoading: true,
    method: 'post',
    params
  })
}
