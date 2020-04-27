<template>
  <div>
    <h4 class="text-center">检验报告</h4>
    <el-form :inline="true">
      <el-form-item>
        <el-input
          v-model="query.name"
          size="small"
          placeholder="请输入报告名称"
          clearable
        />
      </el-form-item>

      <el-form-item>
        <el-button
          size="small"
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="handleSearch"
        >搜索</el-button>
      </el-form-item>

      <!--上传报告 -->
      <el-form-item>
        <el-button
          icon="el-icon-upload"
          size="small"
          @click="newReport"
        >上传报告</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="list.listLoading"
      :data="list.currentPage"
      element-loading-text="Loading"
      :border="false"
      fit
      highlight-current-row
    >
      <el-table-column
        align="center"
        label="报告名称"
      >
        <template slot-scope="scope">
          <div class="table-name">
            <!-- @click="handleTableItemClick(scope.row.reportGuid)" -->
            {{ scope.row.name }}
          </div>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="上传时间"
      >
        <template slot-scope="scope">
          {{ scope.row.uploadedDate? parseTime(scope.row.uploadedDate): '-' }}
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="最后更新时间"
      >
        <template slot-scope="scope">
          {{ scope.row.lastUpdatedDate? parseTime(scope.row.lastUpdatedDate): '-' }}
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="操作"
        width="250"
      >
        <template slot-scope="scope">

          <el-button
            size="small"
            type="primary"
            @click="checkReport(scope.row.reportGuid)"
          >查看</el-button>

          <el-button
            size="small"
            @click="editReport(scope.row.reportGuid)"
          >编辑</el-button>

          <el-button
            size="small"
            type="danger"
            @click="delReport(scope.row.reportGuid)"
          >删除</el-button>

        </template>
      </el-table-column>

    </el-table>

    <pagination
      :total="list.total"
      :page.sync="query.pageIndex"
      :limit.sync="query.pageSize"
      :border="false"
      @pagination="search"
    />
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex'
import {
  GetConsumerHealthReportPageList,
  GetConsumerHealthReport,
  DeleteConsumerHealthReport
} from '@/api/HealthDocumentation/Member'

import { parseTime } from '@/utils'
export default {
  data() {
    return {
      list: {
        currentPage: [],
        listLoading: false,
        total: 0
      },
      query: {
        name: '',
        pageIndex: 1,
        pageSize: 5
      }
    }
  },

  computed: {
    ...mapGetters({
      isShow: 'get_member_dialog'
    }),
    ...mapState({
      userGuid: state => state.member.member_vip_id
    })
  },

  created() {
    this.search()
  },

  methods: {
    ...mapMutations({
      set_ctx: 'SET_MEMBER_CTX', // 弹窗上下文显示开关

      setIsEdit: 'SET_MEMBER_TEXT_IS_EDIT', // 设置检验报告状态 0:新增 1：编辑 2：查看

      setReport: 'SET_MEMBER_TEXT_REPORT', // 存储检验报告文体

      setCurrentId: 'SET_MEMBER_TABLE_CURRENT_ID' // 储存操作后选中表格的ID
    }),

    // 搜索
    search() {
      this.list.listLoading = true
      this.query.userGuid = this.userGuid

      GetConsumerHealthReportPageList(this.query)
        .then(res => {
          Object.assign(this.list, res.data)
          this.list.listLoading = false
        })
        .catch(() => {
          this.list.listLoading = false
        })
    },

    // 查看
    checkReport(id) {
      // 获取当前数据接口

      GetConsumerHealthReport({ reportGuid: id }).then(res => {
        this.setIsEdit(3)

        this.$emit('checkReport', res.data)

        this.set_ctx('check')
      })

      // setTimeout(() => {
      //   const reportDetail = {
      //     nickName: "东东1",
      //     phone: "1237123123",
      //     reportName: "没救",
      //     advice: "多吃屎",
      //     fileList: []
      //   };

      //   this.setIsEdit(3);

      //   this.$emit("checkReport", reportDetail);

      //   this.set_ctx("check");
      // }, 500);
    },

    // 新增
    newReport() {
      this.setIsEdit(0)

      this.setReport()

      this.set_ctx('upload')

      this.$emit('newReport')
    },

    // 编辑
    editReport(id) {
      this.setIsEdit(1)

      GetConsumerHealthReport({ reportGuid: id }).then(res => {
        res = res.data
        this.setReport({
          reportName: res.reportName,
          suggestion: res.suggestion
        })

        this.setCurrentId(id)

        this.$emit('editReport', res.attachments)

        this.set_ctx('upload')
      })

      // 获取当前数据接口
      // setTimeout(() => {
      //   this.setReport({
      //     name: "我真他妈帅",
      //     desc: "需要毛个形式"
      //   });

      //   const fileList = [
      //     {
      //       name: "food.jpeg",
      //       url:
      //         "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
      //     }
      //   ];

      //   this.$emit("editReport", fileList);

      //   this.set_ctx("upload");
      // }, 500);
    },

    // 删除
    delReport(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DeleteConsumerHealthReport({ reportGuid: id }).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })

          this.query.pageIndex = 1
          this.search()
        })
      })
    },

    handleTableItemClick(id) {
      this.setCurrentId(id)
      this.set_ctx('detail')
    },

    handleSearch() {
      this.query.pageIndex = 1
      this.search()
    },

    parseTime
  }
}
</script>

<style lang="less" scoped>
.table-name {
  // cursor: pointer;
  // color: #2d8cf0;

  // &:hover {
  //   text-decoration: underline;
  // }
}
.text-center {
  margin-top: -2.3rem;
  text-align: center;
}
</style>
