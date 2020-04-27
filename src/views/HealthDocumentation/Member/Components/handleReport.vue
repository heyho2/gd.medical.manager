<template>
  <div style="margin:20px">
    <div class="flex">
      <div>
        <span>用户昵称：</span><span>{{ info.nickName }}</span>
      </div>
      <div>
        <span>手机号：</span><span>{{ info.phone }}</span>
      </div>
    </div>
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item
        label="报告名称:"
        prop="reportName"
      >
        <el-input
          v-model="ruleForm.reportName"
          size="small"
          :maxlength="20"
        />
      </el-form-item>
      <el-form-item
        label="报告建议:"
        prop="suggestion"
      >
        <el-input
          v-model="ruleForm.suggestion"
          type="textarea"
          size="small"
          :maxlength="500"
        />
      </el-form-item>
    </el-form>

    <slot />

    <div class="foot-btn">
      <el-button
        type="danger"
        @click="cancel('ruleForm')"
      >取 消</el-button>
      <el-button
        type="primary"
        @click="reportConfirm('ruleForm')"
      >确 定</el-button>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
export default {
  computed: {
    ...mapState({
      info: state => state.member.member_vip_info
    }),
    ...mapGetters({
      report: 'get_member_test_report'
    })
  },

  data() {
    return {
      ruleForm: {
        reportName: '',
        suggestion: ''
      },

      rules: {
        reportName: [
          { required: true, message: '必填', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在1 到 20个字符', trigger: 'blur' }
        ],
        suggestion: [
          { min: 0, max: 500, message: '长度在1 到 500个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.ruleForm = this.report
  },
  methods: {
    ...mapMutations({
      set_ctx: 'SET_MEMBER_CTX', // 弹窗上下文显示开关
      setReport: 'SET_MEMBER_TEXT_REPORT'
    }),

    // 提交
    reportConfirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 存储文体
          this.setReport(this.ruleForm)

          this.$emit('reportConfirm')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    // 取消 清数据
    cancel(formName) {
      this.$refs[formName].resetFields()

      this.setReport(this.ruleForm)

      this.set_ctx('test')
    }
  }
}
</script>

<style lang="less" scoped>
.flex {
  display: flex;

  div {
    width: 50%;
    margin-bottom: 20px;
    padding-left: 28px;
    font-weight: bold;
  }
}

.foot-btn {
  margin-top: 20px;
  text-align: center;
}
</style>
