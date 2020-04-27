import request from '@/utils/request'

const api = 'health/Health/'

// 会员列表
export function GetConsumersPageList(data) {
  return request({
    url: api + 'GetConsumersPageList',
    method: 'get',
    isLoading: false,
    params: data
  })
}

// 会员问卷列表
export function GetConsumerQuestionnairesPageList(data) {
  return request({
    url: api + 'GetConsumerQuestionnairesPageList',
    method: 'post',
    isLoading: false,
    data: data
  })
}

// 会员检验报告列表
export function GetConsumerHealthReportPageList(data) {
  return request({
    url: api + 'GetConsumerHealthReportPageList',
    method: 'get',
    isLoading: false,
    params: data
  })
}

// 获取会员指定报告详情
export function GetConsumerHealthReport(data) {
  return request({
    url: api + 'GetConsumerHealthReport',
    method: 'get',
    isLoading: false,
    params: data
  })
}

// 上传检验报告
export function UploadHealthReport(data) {
  return request({
    url: api + 'UploadHealthReport',
    method: 'post',
    isLoading: false,
    data: data
  })
}

// 删除会员指定报告
export function DeleteConsumerHealthReport(data) {
  return request({
    url: api + 'DeleteConsumerHealthReport',
    method: 'post',
    isLoading: false,
    params: data
  })
}

// 编辑检验报告
export function UpdateHealthReport(data) {
  return request({
    url: api + 'UpdateHealthReport',
    method: 'post',
    isLoading: false,
    data: data
  })
}

// 获取用户问卷结果
export function GetConumserQuestionnaireResultAsync(data) {
  return request({
    url: 'questionnairebase/Questionnaire/GetConumserQuestionnaireResultAsync',
    method: 'get',
    isLoading: false,
    params: data
  })
}

// 评价用户填写的问卷
export function CommentConsumerQuestionnaireAsync(data) {
  return request({
    url: 'questionnairebase/Questionnaire/CommentConsumerQuestionnaireAsync',
    method: 'post',
    isLoading: false,
    data: data
  })
}

// 注册会员
export function CreateConsumerHealthInfo(data) {
  return request({
    url: api + 'CreateConsumerHealthInfo',
    method: 'post',
    isLoading: true,
    data
  })
}
