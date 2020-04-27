import request from '@/utils/request'
///审核列表
export function GetReviewMerchantPageAsync(data) {
    
    return request({
        url: 'System/ReviewRecord/GetReviewRecordPageAsync',
        method: 'post',
        isLoading: false,
        data: data
    })
}