import request from '@/utils/request'
import cache from '@/utils/cache'

// adapter: cache({
//     local: false // 是否永久保留在本地，默认为false
// })

var url = 'questionnairebase/Questionnaire/'
// 获取健康问卷分页列表
export function GetQuestionnairePageListAsync(params) {
  return request({
    url: `${url}GetQuestionnairePageListAsync`,
    method: 'get',
    loadingTime: 300,
    params
  })
}
// 查看问卷基础数据详情
export function GetQuestionnaireInfoAsync(params) {
  return request({
    url: `${url}GetQuestionnaireInfoAsync`,
    isLoading: true,
    method: 'get',
    params

  })
}
// 获取某一个问卷下消费者答题结果分页列表
export function GetConsumerQuestionnairesPageLisAsync(params) {
  return request({
    url: `${url}GetConsumerQuestionnairesPageLisAsync`,
    isLoading: true,
    method: 'get',
    params
  })
}
// 获取用户问卷结果
export function GetConumserQuestionnaireResultAsync(params) {
  return request({
    url: `${url}GetConumserQuestionnaireResultAsync`,
    isLoading: true,
    method: 'get',
    params
  })
}

// 发布问卷
export function IssueQuestionnaireAsync(params) {
  return request({
    url: `${url}IssueQuestionnaireAsync`,
    isLoading: true,
    method: 'post',
    params
  })
}

// 创建问卷前的初始化工作
export function InitQuestionnaireForCreateQuestionnaireAsync() {
  return request({
    url: `${url}InitQuestionnaireForCreateQuestionnaireAsync`,
    isLoading: true,
    method: 'post'

  })
}

// 暂存问卷问题
export function CreateQuestionnaireQuestionAsync(data) {
  return request({
    url: `${url}CreateQuestionnaireQuestionAsync`,
    isLoading: true,
    method: 'post',
    data
  })
}
// 保存问卷
export function SaveQuestionnaireAsync(data) {
  return request({
    url: `${url}SaveQuestionnaireAsync`,
    isLoading: true,
    method: 'post',
    data
  })
}
// 移除问卷问题
export function RemoveQuestionnaireQuestionAsync(params) {
  return request({
    url: `${url}RemoveQuestionnaireQuestionAsync`,
    isLoading: true,
    method: 'post',
    params
  })
}
// 删除问卷
export function DeleteQuestionnaireAsync(params) {
  return request({
    url: `${url}DeleteQuestionnaireAsync`,
    isLoading: true,
    method: 'post',
    params
  })
}
// 切换问卷显示状态
export function ChangerQuestionnaireDisplayAsync(data) {
  return request({
    url: `${url}ChangerQuestionnaireDisplayAsync`,
    isLoading: true,
    method: 'post',
    data
  })
}
// 改变问题序号
export function ChangeQuestionSortAsync(data) {
  return request({
    url: `${url}ChangeQuestionSortAsync`,
    isLoading: true,
    method: 'post',
    data
  })
}
// /评价用户填写的问卷
export function CommentConsumerQuestionnaireAsync(data) {
  return request({
    url: `${url}CommentConsumerQuestionnaireAsync`,
    isLoading: true,
    method: 'post',
    data
  })
}
