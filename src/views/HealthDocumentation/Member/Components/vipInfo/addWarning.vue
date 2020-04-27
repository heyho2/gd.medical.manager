<template>
  <el-dialog
    title="预警值设置"
    :modal="false"
    :visible.sync="c_dialogVisible"
    :before-close="handleClose"
  >
    <el-form
      ref="ruleForm"
      v-loading="loading"
      class="form"
      :model="form.info"
      :rules="form.rules"
      label-width="280px"
      label-suffix="："
    >
      <!-- <el-form-item :label="`是否启用`" :prop="`turnOnWarning`">
        <el-switch v-model="form.info.turnOnWarning" />
      </el-form-item> -->
      <el-form-item
        v-for="(item,index) of form.info.limits"
        :key="index"
        :label="`${item.optionName}`"
      >
        <el-input-number
          v-model="item.minValue"
          size="mini"
          style="width:200px"
          :controls="false"
          :min="0"
          :max="999999"
        />
        <span>~</span>
        <el-input-number
          v-model="item.maxValue"
          size="mini"
          style="width:200px"
          :controls="false"
          :min="0"
          :max="999999"
        />
        <span>{{ item.optionUnit }}</span>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="form.info.turnOnWarning">当数值不在以上范围时，则触发预警</el-checkbox>
        <!-- <span style="color:red;">*</span> -->
      </el-form-item>
    </el-form>

    <div class="foot-btn">
      <el-button type="primary" :loading="loading" @click="handleAdd">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  GetIndicatorWarningLimit,
  SaveIndicatorWarningLimit
} from '@/api/HealthDocumentation/HealthIndicator'
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    userGuid: {
      type: String
    },
    indicatorGuid: {
      type: String
    }
  },
  data() {
    return {
      title: '新增当日指标数据',
      loading: false,
      form: {
        info: {
          consumerGuid: this.userGuid,
          turnOnWarning: true,
          limits: []
        },
        rules: {}
      }
    }
  },
  computed: {
    c_dialogVisible: {
      get() {
        return this.dialogVisible
      },
      set(val) {
        this.$emit('update:dialogVisible', val)
      }
    }
  },
  watch: {
    c_dialogVisible(v) {
      if (v) {
        this.getData()
        this.form.info.consumerGuid = this.userGuid
      }
    }
  },
  methods: {
    getData() {
      this.loading = true
      GetIndicatorWarningLimit({
        ConsumerGuid: this.userGuid,
        indicatorGuid: this.indicatorGuid
      })
        .then(res => {
          Object.assign(this.form.info, res.data)
          setTimeout(() => {
            this.loading = false
          }, 222)
        })
        .catch(() => {
          this.loading = false
        })
    },

    handleAdd() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.loading = true
          const temp = Object.assign({}, this.form.info)
          SaveIndicatorWarningLimit(temp)
            .then(res => {
              this.$success('设置成功。')
              this.$emit('newIndicators')
              this.c_dialogVisible = false
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    handleClose() {
      this.c_dialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.form {
  overflow-y: auto;
  max-height: 300px;
}

.foot-btn {
  margin-top: 10px;
  text-align: center;
}

/deep/ .el-drawer__header > :first-child {
  font-size: 22px;
}
</style>
