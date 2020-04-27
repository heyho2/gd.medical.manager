<template>
  <div>
    <el-upload
      class="upload-demo"
      drag
      action=""
      :accept="accept"
      :file-list="c_fileList"
      :before-upload="beforeUpload"
      :on-success="success"
      :on-remove="remove"
    >

      <i class="el-icon-upload" />
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__text">仅支持扩展名.pdf|.jpg|.png|.jpeg文件跟图片</div>
      <!-- <div class="el-upload__text">且不超过500kb</div> -->
    </el-upload>
  </div>

</template>

<script>
import { uploadImages } from '@/api/Upload'
export default {
  props: {
    fileList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      accept: '.pdf,.jpg,.png,.jpeg'
    }
  },
  computed: {
    c_fileList: {
      get() {
        return this.fileList
      },
      set(v) {
        this.$emit('update:fileList', v)
      }
    }
  },
  methods: {
    beforeUpload(file) {
      // 验证重名
      const checkName = this.c_fileList.some(a => a.name === file.name)
      if (checkName) return false

      const formData = new FormData()
      formData.append('file', file, file.name)

      uploadImages(formData).then(res => {
        res = res.data[0]
        this.c_fileList.push({
          ReportDetailGuid: res.accessoryGuid,
          name: file.name
        })

        // console.log(this.c_fileList);
      })

      return false
    },
    success(res, file, fileList) {
      this.c_fileList = fileList
    },
    remove(file, fileList) {
      this.c_fileList = fileList
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/.el-upload-dragger,
/deep/.el-upload,
.upload-demo {
  width: 100%;
}

.el-icon-upload {
  margin: 20px 0 16px;
}
.el-upload__text {
  margin: 5px;
}
</style>
