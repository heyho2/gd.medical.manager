import uploadRequest from '@/utils/uploadRequest'

export function uploadImages(data) {
    return uploadRequest({
        url: "Upload/ImagesAsync",
        method: "POST",
        data
    });
}