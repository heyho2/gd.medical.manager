import request from '@/utils/request'
// 搜索问题
export function SearchFaqsQuestionAsync(data) {
  return request({
    url: 'Faqs/Faqs/SearchFaqsQuestionAsync',
    method: 'post',
    data: data
  })
}

// 禁用问题
export function DisableEnableFaqsQuestionAsync(data) {
  return request({
    url: 'Faqs/Faqs/DisableEnableFaqsQuestionAsync',
    method: 'post',
    data: data
  })
}

// 删除问题
export function DeleteFaqsQuestionAsync(data) {
  return request({
    url: 'Faqs/Faqs/DeleteFaqsQuestionAsync',
    method: 'post',
    data: data
  })
}
// 设置状态
export function SetFaqsSettingStatusAsync(data) {
  return request({
    url: 'Faqs/Faqs/SetFaqsSettingStatusAsync',
    method: 'post',
    data: data
  })
}
