<template>
  <el-row>
    <div
      v-for="(item,i) in cValues"
      :key="i"
      :style="{'position':'relative','display': 'inline-block'}"
    >
      <el-button
        icon="el-icon-close"
        size="mini"
        circle
        style="position: absolute;right: 5px;top: 0px;"
        @click="close(i)"
      />
      <el-card :body-style="{ padding: '0px' }" class="card">
        <gd-img
          class="image"
          :src="item.url"
          :title="'附件Guid：'+(item.value||'无')"
          preview="__9999999"
          :style="{width: c_imgWidth,height: c_imgHeight}"
        />
        <div style="padding: 5px;text-align: center;">
          <upload-img-button
            :auto-crop-width="autoCropWidth"
            :auto-crop-height="autoCropHeight"
            :url.sync="item.url"
            :value.sync="item.value"
            :size="size"
            :not-cutting="notCutting"
            :buttontext="buttonText"
          />
        </div>
      </el-card>
    </div>
    <el-card :body-style="{ padding: '0px' }" :style="{display: 'inline-block'}">
      <gd-img
        :src="null"
        :title="'附件Guid：'+(null||'无')"
        :style="{width: imgWidth?imgWidth+'px':'auto',height: imgHeight?imgHeight+'px':'auto','display': 'block'}"
      />
      <div style="padding: 5px;text-align: center;">
        <upload-img-button
          :auto-crop-width="autoCropWidth"
          :auto-crop-height="autoCropHeight"
          :buttontext="addButtonText||'新增图片'"
          :after-success="afterSuccess"
          :size="size"
          :not-cutting="notCutting"
        />
      </div>
    </el-card>
  </el-row>
</template>
<script>
import uploadImgButton from './Button'
import GdImg from '@/views/Commons/GdImg'
export default {
  name: 'UploadImg2More',
  components: { uploadImgButton, GdImg },
  props: {
    values: {
      type: Array,
      default: () => {
        return []
      }
    },
    imgWidth: { type: Number, default: 0 },
    imgHeight: { type: Number, default: 0 },
    autoCropWidth: { type: [Number, String], default: 100 },
    autoCropHeight: { type: [Number, String], default: 100 },
    size: { type: Number, default: 1024 }, // 图片大小
    notCutting: { type: Boolean, default: false }, // 不裁剪
    lazy: { type: Boolean, default: false },
    fit: { type: String, default: 'cover' },
    addButtonText: { type: String, default: '新增图片' },
    buttonText: { type: String, default: '选择图片' }

  },
  data() {
    return {
      valIndex: 0,
      curl2: '',
      dialogVisible: false
    }
  },
  computed: {
    cValues: {
      get() {
        return this.values
      },
      set(val) {
        this.$emit('update:values', val)
      }
    },
    c_imgWidth() {
      return this.imgWidth ? `${this.imgWidth}px` : `auto`
    },
    c_imgHeight() {
      return this.imgHeight ? `${this.imgHeight}px` : `auto`
    }
  },
  watch: {
    valIndex(val) {
      var t = this
      t.curl2 = t.cValues[t.valIndex - 1].url
    }
  },
  created() {},
  methods: {
    afterSuccess(url, value) {
      var t = this
      t.cValues.push({
        value: value,
        url: url
      })
    },
    close(index) {
      var t = this
      t.cValues.splice(index, 1)
    }
  }
}
</script>

<style lang="less" scoped>
.card {
  display: inline-block;
  margin-right: 12px;
  margin-top: 12px;
  .image {
    display: block;
    cursor: pointer;
    min-width: 100px;
    min-height: 100px;
  }
}
</style>
