import request from '@/utils/request'
import cache from '@/utils/cache'
// 获取装修记录分页列表
export function GetDecorationPageListAsync(params) {
  return request({
    url: 'decoration/Decoration/GetDecorationPageListAsync',
    method: 'get',
    params
  })
}
// 根据类别获取装修规则设置
export function GetRuleConfigAsync(params) {
  return request({
    url: 'decoration/Decoration/GetRuleConfigAsync',
    isLoading: true,
    method: 'get',
    params,
    adapter: cache({
      local: false // 是否永久保留在本地，默认为false
    })
  })
}
// 创建/修改装修记录
export function CreateDecorationRecordAsync(data) {
  return request({
    url: 'decoration/Decoration/CreateDecorationRecordAsync',
    isLoading: true,
    method: 'post',
    data
  })
}
// 获取装修记录详情
export function GetDecorationDetailsAsync(params) {
  return request({
    url: 'decoration/Decoration/GetDecorationDetailsAsync',
    isLoading: true,
    method: 'get',
    params
  })
}
// 获取装修记录分类列表
export function GetDecorationClassificationAsync() {
  return request({
    url: 'decoration/Decoration/GetDecorationClassificationAsync',
    isLoading: true,
    method: 'get',
    adapter: cache({
      local: false // 是否永久保留在本地，默认为false
    })
  })
}
// 获取装修记录分类列表
export function DisableEnableDecorationAsync(data) {
  return request({
    url: 'decoration/Decoration/DisableEnableDecorationAsync',
    isLoading: true,
    method: 'post',
    data
  })
}

