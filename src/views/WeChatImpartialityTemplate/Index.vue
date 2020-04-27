<template>
  <div class="app-container">
    <el-form :inline="true" :model="query">
      <el-form-item>
        <el-input v-model="query.keyWord" placeholder="请输入关键字" clearable />
      </el-form-item>
      <el-form-item>
        <el-button
          :loading="listLoading"
          type="primary"
          icon="el-icon-search"
          @click="handleSearch"
        >搜索</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" element-loading-text="Loading" :border="false" fit highlight-current-row>
      <el-table-column align="center" label="序列" width="65">
        <template slot-scope="scope">{{ scope.$index+1 }}</template>
      </el-table-column>
      <el-table-column label="模板副标题" align="left" min-width="150">
        <template slot-scope="scope">
          <span class="assss">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" width="180">
        <template slot-scope="scope">{{ parseTime(scope.row.creationDate) }}</template>
      </el-table-column>
      <el-table-column label="操作人" align="center" width="120">
        <template slot-scope="scope">{{ scope.row.recordStatus }}</template>
      </el-table-column>
      <el-table-column label="操作" width="90" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            :disabled="!$checkPermission('handle_update')"
            type="primary"
            @click="handleUpdate(scope.row)"
          >编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total="total"
      :page.sync="query.pageIndex"
      :limit.sync="query.pageSize"
      :border="false"
      @pagination="handleFilter"
    />
    <TemplateEdit
      :dialog-visible.sync="form.dialogVisible"
      :guid="form.guid"
      :dialog-title="form.title"
      @onSaveSuccess="onSaveSuccess"
    />
  </div>
</template>

<script>
import { GetReportListAsync } from '@/api/Report'
import Pagination from '@/components/Pagination'
import { parseTime } from '@/utils/index'
import '@/utils/linq'
import TemplateEdit from './Components/TemplateEdit'
import clip from '@/utils/clipboard' // use clipboard directly

export default {
  components: { Pagination, TemplateEdit },
  data() {
    return {
      query: {
        pageIndex: 1,
        pageSize: 20,
        keyWord: null,
        SourceType: 1
      },
      total: 0,
      list: [],
      listLoading: true,
      form: {
        dialogVisible: false,
        title: '添加报表',
        dialogStatus: 'add'
      },
      recordStatuss: [
        { code: 0, name: `保存` },
        { code: 1, name: `发布` },
        { code: 2, name: `下架` }
      ]
    }
  },
  watch: {},
  created() {
    this.handleFilter()
  },
  methods: {
    // 加载表格数据
    handleFilter() {
      this.listLoading = true
      GetReportListAsync(this.query).then(
        response => {
          this.list = response.data.currentPage
          this.total = response.data.total
          setTimeout(() => {
            this.listLoading = false
          }, 200)
        },
        err => {
          this.listLoading = false
        }
      )
    },
    handleAdd() {
      this.form.dialogVisible = true
      this.form.guid = null
      this.form.title = '添加新模板'
    },
    handleUpdate(row) {
      this.form.dialogVisible = true
      this.form.guid = row.themeGuid
      this.form.title = '修改模板'
    },
    // 搜索
    handleSearch() {
      this.query.pageIndex = 1
      this.handleFilter()
    },

    // 禁用/启用
    handleDisable(row) {
      var t = this
      DisableEnableArticleAsync({
        Guid: row.articleGuid,
        enable: row.enable
      }).then(response => {
        t.$notify({
          title: '成功',
          message: '修改成功',
          type: 'success',
          duration: 2000
        })
        t.handleFilter()
      })
    },
    // 删除
    handleDelete(row) {
      var t = this
      t.$confirm('此操作将永久删除该数据, 是否继续?', '确认删除', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          DeleteArticleAsync({ Guid: row.articleGuid }).then(response => {
            t.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            t.handleFilter()
          })
        })
        .catch(() => {
          t.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    parseTime,
    onSaveSuccess() {
      this.handleFilter()
    },
    handleCopy(row) {
      clip(`/Report/${row.themeGuid}`, event)
    }
  }
}
</script>

