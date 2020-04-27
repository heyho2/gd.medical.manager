<template>
  <el-row>
    <el-card class="card" :body-style="{ padding: '0px' }">
      <div class="image">
        <img
          v-if="c_url"
          :src="c_url"
          :style="{width: cImgWidth,height: cImgHeight}"
          :preview-text="'附件Guid：'+(c_value||'无')"
          preview="upload__9999999"
          :alt="'附件Guid：'+(c_value||'无')"
          :title="'附件Guid：'+(c_value||'无')"
        >
        <div
          v-else
          class="image-slot"
          :style="{width: `${imgWidth||imgHeight}px`,height: `${imgHeight||imgWidth}px`}"
        >
          <i class="el-icon-picture-outline" />
        </div>
      </div>
      <!-- <el-image
        class="image"
        :style="{width: cImgWidth,height: cImgHeight}"
        :src="c_url"
        preview="__9999999"
        :preview-text="'附件Guid：'+(c_value||'无')"
        :alt="'附件Guid：'+(c_value||'无')"
        :title="'附件Guid：'+(c_value||'无')"
        :lazy="lazy"
        :fit="fit"
      >
        <div slot="placeholder" class="image-slot">
          加载中
          <span class="dot">...</span>
        </div>
        <div slot="error" class="image-slot">
          <i class="el-icon-picture-outline"></i>
        </div>
      </el-image>-->
      <div style="padding: 5px;text-align: center;">
        <upload-img-button
          ref="imgbutton"
          :auto-crop-width="autoCropWidth"
          :auto-crop-height="autoCropHeight"
          :url="c_url2"
          :after-success="afterSuccess"
          :hidden="hidden"
          :size="size"
          :not-cutting="notCutting"
        />
      </div>
    </el-card>
  </el-row>
</template>
<script>
import GdImg from '@/views/Commons/GdImg'
import uploadImgButton from './Button'

export default {
  components: { GdImg, uploadImgButton },
  props: {
    value: { type: [String, Array], default: null },
    imgWidth: { type: Number, default: 0 },
    imgHeight: { type: Number, default: 0 },
    url: { type: [String, Array], default: null },
    autoCropWidth: { type: [Number, String], default: 100 },
    autoCropHeight: { type: [Number, String], default: 100 },
    hidden: { type: Boolean, default: false },
    size: { type: Number, default: 1024 }, // 图片大小
    notCutting: { type: Boolean, default: false }, // 不裁剪
    lazy: { type: Boolean, default: false },
    fit: { type: String, default: 'contain' }
  },
  data() {
    return {
      dialogVisible: false,
      c_url2: this.url
    }
  },
  computed: {
    c_value: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('update:value', val)
      }
    },
    c_url: {
      get() {
        return this.url
      },
      set(val) {
        this.$emit('update:url', val)
      }
    },
    cImgWidth: {
      get() {
        return this.imgWidth ? `${this.imgWidth}px` : `auto`
      }
    },
    cImgHeight: {
      get() {
        return this.imgHeight ? `${this.imgHeight}px` : `auto`
      }
    }
  },
  watch: {},
  methods: {
    afterSuccess(url, value) {
      this.c_value = value
      this.c_url = url
    },
    beforeClick() {
      this.$refs.imgbutton.selectFile()
    }
  }
}
</script>

<style lang="less" scoped>
.card {
  display: inline-block;
  .image {
    cursor: pointer;
    display: flex;
    min-width: 100px;
    min-height: 100px;
    overflow: hidden;
    justify-content: center;
    img {
      object-fit: cover;
      vertical-align: top;
      width: 100%;
      cursor: pointer;
    }
    .image-slot {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      background: #f5f7fa;
      color: #909399;
      font-size: 14px;
      min-width: 100px;
      min-height: 100px;
      i {
        font-size: 30px;
      }
    }
  }
}
</style>

