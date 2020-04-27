<template>
  <el-dialog :visible.sync="isShow" :before-close="close">
    <vip-info v-if="ctx.is_info" />

    <question-table v-if="ctx.is_question" />

    <test-table
      v-if="ctx.is_test"
      @newReport="onNewReport"
      @editReport="oneditReport"
      @checkReport="onCheckReport"
    />

    <h2 v-if="ctx.is_check || ctx.is_upload " class="title" style="margin-top:-2rem">{{ calTitle }}</h2>

    <div v-if="ctx.is_upload">
      <handle-report @reportConfirm="reportConfirm">
        <upload-report :file-list.sync="fileList" />
      </handle-report>
    </div>

    <div v-if="ctx.is_check">
      <report-detail :info="detailInfo" />
    </div>

    <table-detail v-if="ctx.is_detail" />
    {{ ctx.dialogName }}
  </el-dialog>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import {
  UploadHealthReport,
  UpdateHealthReport
} from '@/api/HealthDocumentation/Member'
import vipInfo from './vipInfo/index'
import questionTable from './questionTable'
import testTable from './testTable'
import handleReport from './handleReport'
import uploadReport from './uploadReport'
import reportDetail from './reportDetail'
import tableDetail from './tableDetail'

export default {
  components: {
    vipInfo,
    questionTable,
    testTable,
    handleReport,
    uploadReport,
    reportDetail,
    tableDetail
  },
  computed: {
    ...mapState({
      userGuid: state => state.member.member_vip_id,
      reportGuid: state => state.member.current_table_item_id,
      isEdit: state => state.member.member_test_is_edit
    }),
    ...mapGetters({
      isShow: 'get_member_dialog',
      ctx: 'get_member_ctx',
      report: 'get_member_test_report'
    }),
    calTitle() {
      const v = this.isEdit
      return v === 0 ? '新增报告' : v === 1 ? '编辑报告' : '查看报告'
    }
  },
  data() {
    return {
      fileList: [],
      detailInfo: {}
    }
  },
  watch: {
    isShow(v) {
      if (!v) {
        // 利用v-if 清除 所有 组件 数据
        this.set_ctx()
      }
    }
  },
  methods: {
    ...mapMutations({
      setDialogShow: 'SET_MEMBER_DIALOG_SHOW', // 弹窗开关
      set_ctx: 'SET_MEMBER_CTX' // 弹窗上下文显示开关 ctx:String
    }),

    // 关闭弹窗
    close() {
      this.setDialogShow(false)
    },

    // 新增报告
    onNewReport() {
      this.fileList = []
    },

    // 编辑报告
    oneditReport(fileList) {
      this.fileList = fileList
    },

    // 查看报告
    onCheckReport(v) {
      this.detailInfo = v
    },

    // 报告提交
    reportConfirm() {
      const params = Object.assign(
        {
          userGuid: this.userGuid,
          reportGuid: this.reportGuid,
          attachments: this.fileList
        },
        this.report
      )

      if (this.isEdit) {
        // ("编辑");
        UpdateHealthReport(params).then(res => {
          this.succLog('编辑报告成功。')

          this.set_ctx('test')
        })
      } else {
        // ("新增");
        UploadHealthReport(params).then(res => {
          this.succLog('新增报告成功。')

          this.set_ctx('test')
        })
      }
    },

    succLog(msg) {
      return this.$message({
        message: msg || '',
        type: 'success'
      })
    }
  }
}
</script>

<style lang="less" scoped>
.title {
  text-align: center;
}
</style>
