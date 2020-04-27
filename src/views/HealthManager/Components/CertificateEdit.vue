<template>
  <div>
    <el-card
      v-for="(item,index) in c_values"
      :key="index"
      class="card"
      :body-style="{ padding: '0px' }"
    >
      <div class="card-cont">
        <div class="head">
          <span>{{ item.configName }}</span>
        </div>
        <el-image
          class="image"
          :src="item.certificateUrl"
          preview="__4444"
          :preview-text="item.accessoryGuid"
          :alt="item.accessoryGuid"
          :title="`${item.accessoryGuid}`"
          fit="contain"
        >
          <div slot="placeholder" class="image-slot">
            加载中
            <span class="dot">...</span>
          </div>
          <div slot="error" class="image-slot">
            <i class="el-icon-picture-outline" />
          </div>
        </el-image>
        <!--        <UploadImgButton
          :ref="'UploadImg'+index"
          :value.sync="item.accessoryGuid"
          :url.sync="item.certificateUrl"
          :hidden="true"
          :size="500"
          :not-cutting="true"
        /> -->
        <upload-img2-more
          :values.sync="item"
          :img-height="150"
          :auto-crop-width="725"
          :auto-crop-height="320"
        />
        <!-- <div class="button">
          <el-button
            type="small"
            icon="el-icon-upload"
            title="请选择图片"
            @click="selectFile('UploadImg'+index)"
          >请选择图片</el-button>
        </div> -->
      </div>
      <!-- <div style="padding: 0px; text-align: center;"></div> -->
    </el-card>
  </div>
</template>
<script>
import UploadImgButton from '@/components/UploadImg2/Button'
import UploadImg2More from '@/components/UploadImg2/More'
import '@/utils/linq'
export default {
  components: { UploadImgButton, UploadImg2More },
  props: {
    values: { type: Array }
  },
  data() {
    return {}
  },
  computed: {
    c_values: {
      get() {
        return this.values
      },
      set(val) {
        this.$emit('update:values', val)
      }
    }
  },
  created() {},
  methods: {
    selectFile(refname) {
      var sss = this.$refs[refname][0]
      sss.selectFile()
    }
  }
}
</script>

<style lang="less" scoped>
.card {
  display: inline-block;
  width: 200px;
  margin-right: 10px;
  position: relative;
  .card-cont {
    height: 250px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .head {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .image {
      width: 100%;
      flex: 1;
    }
    .button {
      text-align: center;
    }
  }
}
</style>
