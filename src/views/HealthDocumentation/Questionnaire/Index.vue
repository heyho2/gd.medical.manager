<template>
  <div class="app-container">
    <el-form :inline="true" :model="query">
      <el-form-item>
        <el-input v-model="query.name" clearable placeholder="问卷名称" style="width:300px" />
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          v-permission="'handle_add'"
          class="filter-item"
          type
          icon="el-icon-circle-plus"
          @click="handleAdd"
        >添加问卷</el-button>
      </el-form-item>
    </el-form>
    <el-table
      element-loading-text="Loading"
      :data="grid.list"
      :border="false"
      fit
      :row-class-name="tableRowClassName"
      highlight-current-row
    >
      <el-table-column type="expand">
        <template slot-scope="scope">
          <Member :guid="scope.row.questionnaireGuid" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="序列" type="index" width="55" />
      <el-table-column label="问卷名称" min-width="140" align="left">
        <template slot-scope="scope">{{ scope.row.questionnaireName }}</template>
      </el-table-column>
      <el-table-column label="创建人" width="140" align="left">
        <template slot-scope="scope">
          <span class="beyond-hiding">{{ scope.row.creator }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="180" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.creationDate? parseTime(scope.row.creationDate):'-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发放时间" width="180" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.issuingDate? parseTime(scope.row.issuingDate):'-' }}</span>
        </template>
      </el-table-column>

      <el-table-column label="是否显示" width="80" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.display"
            size="mini"
            :disabled="!$checkPermission('handle_update')"
            @change="handleDisplay(scope.row)"
          />
        </template>
      </el-table-column>

      <el-table-column label="操作" width="250" align="center">
        <template slot-scope="scope">
          <el-button
            v-show="scope.row.issuingStatus"
            type="primary"
            size="mini"
            :disabled="!$checkPermission('handle_view')"
            @click="handleView(scope.row)"
          >查看</el-button>
          <el-button
            v-show="!scope.row.issuingStatus"
            size="mini"
            :disabled="!$checkPermission('handle_update')"
            @click="handleUpdate(scope.row)"
          >编辑</el-button>
          <el-button
            v-show="!scope.row.issuingStatus&&scope.row.display"
            type="warning"
            size="mini"
            @click="handleGrant(scope.row)"
          >发放</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total="grid.total"
      :page.sync="query.pageIndex"
      :limit.sync="query.pageSize"
      :border="false"
      @pagination="handleFilter"
    />
    <Edit
      :dialog-title="edit.dialogTitle"
      :dialog-visible.sync="edit.dialogVisible"
      :guid.sync="edit.guid"
      @onSuccess="handleFilter"
    />
    <ViewInfo
      :dialog-title="view.dialogTitle"
      :dialog-visible.sync="view.dialogVisible"
      :guid.sync="view.guid"
    />
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'

import {
  GetQuestionnairePageListAsync,
  DeleteQuestionnaireAsync,
  IssueQuestionnaireAsync,
  ChangerQuestionnaireDisplayAsync
} from '@/api/Questionnaire'

import { parseTime } from '@/utils/index'
import Edit from './Components/Edit'
import ViewInfo from './Components/View'
import Member from './Components/Member/Index'
export default {
  components: { Pagination, Edit, ViewInfo, Member },
  data: () => ({
    query: {
      pageIndex: 1,
      pageSize: 10,
      name: null
    },
    grid: {
      total: 0,
      list: [],
      listLoading: false
    },
    edit: {
      dialogTitle: null,
      dialogVisible: false,
      guid: null
    },
    view: {
      dialogTitle: null,
      dialogVisible: false,
      guid: null
    }
  }),
  created() {
    this.handleFilter()
  },
  methods: {
    handleFilter() {
      GetQuestionnairePageListAsync(this.query).then(response => {
        this.grid.list = response.data.currentPage
        this.grid.total = response.data.total
      })
    },
    handleSearch() {
      this.query.pageIndex = 1
      this.handleFilter()
    },
    handleAdd() {
      this.edit.dialogTitle = '新建问卷'
      this.edit.dialogVisible = true
      this.edit.guid = null
    },
    handleUpdate(row) {
      this.edit.dialogTitle = '问卷编辑'
      this.edit.dialogVisible = true
      this.edit.guid = row.questionnaireGuid
    },
    handleView(row) {
      this.view.dialogTitle = '查看问卷'
      this.view.dialogVisible = true
      this.view.guid = row.questionnaireGuid
    },
    handleDelete(row) {
      var t = this
      t.$confirm('此操作将永久删除该数据, 是否继续?', '确认删除', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DeleteQuestionnaireAsync({
          questionnaireGuid: row.questionnaireGuid
        }).then(response => {
          this.handleFilter()
          this.$notify({
            title: '成功',
            message: '成功',
            type: 'success',
            duration: 2000
          })
        })
      })
    },
    handleGrant(row) {
      var t = this
      t.$confirm('是否确认发放问卷?', '确认发放', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        IssueQuestionnaireAsync({
          questionnaireGuid: row.questionnaireGuid
        }).then(response => {
          this.handleFilter()
          this.$notify({
            title: '成功',
            message: '成功',
            type: 'success',
            duration: 2000
          })
        })
      })
    },
    parseTime,
    handleDisplay(row) {
      ChangerQuestionnaireDisplayAsync({
        questionnaireGuid: row.questionnaireGuid,
        Display: row.display
      }).then(response => {
        this.$notify({
          title: '成功',
          message: '成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    tableRowClassName({ row, rowIndex }) {
      if (!row.display) {
        return 'disable-row'
      }
      return ''
    },
    handleRecommend(row) {
      UpdateRecommend({ productGuid: row.productGuid }).then(response => {
        this.$notify({
          title: '成功',
          message: '成功',
          type: 'success',
          duration: 2000
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
