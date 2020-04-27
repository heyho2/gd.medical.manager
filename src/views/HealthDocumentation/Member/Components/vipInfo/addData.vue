<template>
  <el-dialog
    title="新增数据"
    :modal="false"
    :visible.sync="c_dialogVisible"
    :before-close="handleClose"
  >
    <el-form
      ref="ruleForm"
      v-loading="loading"
      class="form"
      :model="ruleForm"
      :rules="rules"
      label-width="280px"
      label-suffix="："
    >
      <template v-for="(item,n) of ruleForm.res">
        <el-form-item
          :key="n"
          :label="`${item.optionName}`"
          :prop="`res.${n}.resultVale`"
          :rules="{required: item.required, message: '必填', trigger: 'blur'}"
        >
          <el-input-number
            v-model="item.resultVale"
            size="mini"
            style="width:200px"
            :controls="false"
            :min="0"
            :max="999999"
          />
          <span>{{ item.optionUnit }}</span>
        </el-form-item>
      </template>
    </el-form>
    <div class="foot-btn">
      <el-button type="primary" :loading="loading" @click="handleAdd">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  GetHealthIndicatorOptions,
  CreateConsumerHealthIndicatorOptions
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
      ruleForm: {
        res: []
      },
      rules: {}
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
      if (v) this.getData()
    }
  },
  methods: {
    getData() {
      this.loading = true
      GetHealthIndicatorOptions({
        userGuid: this.userGuid,
        indicatorGuid: this.indicatorGuid
      })
        .then(res => {
          this.ruleForm.res = res.data
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
          const params = {
            userGuid: this.userGuid,
            indicatorGuid: this.indicatorGuid,
            options: this.ruleForm.res.map(i => {
              return {
                optionGuid: i.optionGuid,
                indicatorValue: i.resultVale
              }
            })
          }
          CreateConsumerHealthIndicatorOptions(params)
            .then(res => {
              this.loading = true
              this.$success('新增成功。')
              this.$emit('onSuccess')
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
