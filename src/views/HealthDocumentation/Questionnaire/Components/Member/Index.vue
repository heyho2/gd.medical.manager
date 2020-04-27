<template>
  <div>
    <el-table
      v-show="list&&list.length>0"
      :data="list"
      border
      fit
      highlight-current-row
      :header-cell-style="{'background-color':'#f5f7fa'}"
    >
      <el-table-column align="center" type="index" label="序列" width="65" />
      <el-table-column label="会员名" width="160" align="center">
        <template slot-scope="scope">{{ scope.row.userName }}</template>
      </el-table-column>
      <el-table-column label="手机号" mix-width="110" align="left">
        <template slot-scope="scope">{{ scope.row.phone||"暂无" }}</template>
      </el-table-column>
      <el-table-column label="年龄" width="110" align="right">
        <template slot-scope="scope">{{ scope.row.age }}</template>
      </el-table-column>
      <el-table-column label="状态" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.fillStatus?'已提交':'未提交' }}</template>
      </el-table-column>
      <el-table-column label="是否已评" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.commented?'是':'否' }}</template>
      </el-table-column>
      <el-table-column label="操作" width="110" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleView(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-if="Math.ceil(total/query.pageSize)>1"
      :total="total"
      :page.sync="query.pageIndex"
      :limit.sync="query.pageSize"
      @pagination="handleFilter"
    />
    <ResultInfo
      :dialog-title="view.dialogTitle"
      :dialog-visible.sync="view.dialogVisible"
      :guid.sync="view.guid"
    />
  </div>
</template>

<script>
import { GetConsumerQuestionnairesPageLisAsync } from '@/api/Questionnaire'

import Pagination from '@/components/Pagination'
import ResultInfo from './Result'

export default {
  components: { Pagination, ResultInfo },
  props: {
    guid: { type: String }
  },
  data() {
    return {
      query: {
        QuestionnaireGuid: this.guid,
        FillStatus: null,
        Commented: null,
        pageIndex: 1,
        pageSize: 20
      },
      total: 0,
      list: [],
      view: {
        dialogTitle: null,
        dialogVisible: false,
        guid: null
      }
    }
  },
  watch: {
    guid(val) {
      this.query.userGuid = val
      this.handleFilter()
    }
  },
  created() {
    if (this.guid) {
      this.handleFilter()
    }
  },
  methods: {
    // 加载表格数据
    handleFilter() {
      GetConsumerQuestionnairesPageLisAsync(this.query).then(response => {
        this.list = response.data.currentPage
        this.total = response.data.total
      })
    },
    handleView(row) {
      this.view.dialogTitle = '查看用户问卷'
      this.view.dialogVisible = true
      this.view.guid = row.resultGuid
    }
  }
}
</script>
