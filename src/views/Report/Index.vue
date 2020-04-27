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
      <el-form-item>
        <el-button
          v-permission="'handle_add'"
          type
          icon="el-icon-circle-plus"
          @click="handleAdd"
        >添加报表</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" element-loading-text="Loading" :border="false" fit highlight-current-row>
      <el-table-column align="center" label="序列" width="65">
        <template slot-scope="scope">{{ scope.$index+1 }}</template>
      </el-table-column>
      <el-table-column label="名称" align="left" width="150">
        <template slot-scope="scope">
          <span class="assss">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" align="left">
        <template slot-scope="scope">{{ scope.row.demand }}</template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="120">
        <template slot-scope="scope">
          {{
            (recordStatuss.first(a=>a.code== scope.row.recordStatus)||{}).name
          }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" width="180">
        <template slot-scope="scope">{{ parseTime(scope.row.creationDate) }}</template>
      </el-table-column>
      <el-table-column label="操作" width="220" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            :disabled="!$checkPermission('handle_update')"
            type="primary"
            @click="handleUpdate(scope.row)"
          >编辑</el-button>
          <router-link :to="`/Report/${scope.row.themeGuid}`">
            <el-button size="mini">预览</el-button>
          </router-link>
          <el-button type="info" size="mini" @click="handleCopy(scope.row,$event)">复制</el-button>

          <!-- <el-button
            @click="handleDelete(scope.row)"
            type="danger"
            size="mini"
            :disabled="!$checkPermission('handle_delete')"
          >删除</el-button>-->
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
    <currentEdit
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
import currentEdit from './Components/currentEdit'
import clip from '@/utils/clipboard' // use clipboard directly

export default {
  components: { Pagination, currentEdit },
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
      this.form.title = '添加报表'
    },
    handleUpdate(row) {
      this.form.dialogVisible = true
      this.form.guid = row.themeGuid
      this.form.title = '修改报表'
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

