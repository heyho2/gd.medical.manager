<template>
  <div>
    <el-input
      v-model="text"
      placeholder="请输入经纬度，如：39.916527, 116.397128"
      class="input-with-select"
      clearable
      @change="textChange"
    >
      <el-button slot="append" icon="el-icon-more" @click="handleSelectMap" />
    </el-input>
    <el-dialog
      :visible.sync="dialogVisible"
      top="20px"
      width="85%"
      title="查找坐标"
      :close-on-click-modal="false"
      append-to-body
    >
      <el-input
        v-model="keyword"
        placeholder="请输入地区+关键字,（如：深圳大剧院）"
        style="width:380px;"
        class="input-with-select"
        clearable
      >
        <el-button slot="append" icon="el-icon-search" @click="handleSearchMap()" />
      </el-input>
      <span>您选择的坐标地址：{{ c_value }}</span>
      <tmap ref="tmap" @click="handleClickTMap" />
      <div slot="footer" class="dialog-footer">
        <el-button icon="el-icon-close" @click="dialogVisible = false">关闭</el-button>
        <el-button type="primary" icon="iconfont icon-save" @click="handleConfirm">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import tmap from './index'
export default {
  components: { tmap },
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dialogVisible: false,
      keyword: null,
      text: null,
      aaa: []
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
    }
  },
  watch: {
    value(val) {
      this.text = this.c_value.join(',')
    }
  },
  created() {
    this.text = this.c_value.join(',')
  },
  methods: {
    handleSearchMap() {
      // this.$refs["tmap"].searchMap(this.keyword);
      this.$refs.tmap.searchMap(this.keyword)
    },
    handleClickTMap(event) {
      this.c_value = [event.latLng.lat, event.latLng.lng]
    },
    handleSelectMap() {
      this.dialogVisible = true
    },
    handleConfirm() {
      this.text = this.c_value.join(',')
      this.dialogVisible = false
    },
    textChange() {
      try {
        this.c_value = this.text.split(',')
        setTimeout(() => {
          console.log(this.c_value)
        }, 200)
      } catch (a) {
        this.$message({
          type: 'info',
          message: '输出字符串格式不正确'
        })
      }
    }
  }
}
</script>
