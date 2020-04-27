<template>
  <div class="app-container">
    <el-form :inline="true" :model="query">
      <el-form-item>
        <el-input v-model="query.name" placeholder="名称" style="width: 200px;" class="filter-item" />
      </el-form-item>
      <el-form-item>
        <el-button
          class="filter-item"
          :loading="listLoading"
          type="primary"
          icon="el-icon-search"
          @click="handleSearch"
        >搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          v-permission="'handle_add'"
          class="filter-item"
          icon="el-icon-circle-plus"
          @click="handleAdd"
        >添加头条</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" fit highlight-current-row>
      <el-table-column align="center" label="序列" width="65">
        <template slot-scope="scope">{{ scope.$index+1 }}</template>
      </el-table-column>
      <el-table-column label="头条名称" min-width="110" align="left">
        <template slot-scope="scope">
          <span class="assss" :title="scope.row.headlineName">{{ scope.row.headlineName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="简介" min-width="110" align="left">
        <template slot-scope="scope">
          <span class="assss" :title="scope.row.headlineAbstract">{{ scope.row.headlineAbstract }}</span>
        </template>
      </el-table-column>
      <el-table-column label="点击响应目标" min-width="110" align="left">
        <template slot-scope="scope">{{ scope.row.target }}</template>
      </el-table-column>
      <el-table-column label="排序" width="80" align="right">
        <template slot-scope="scope">{{ scope.row.sort }}</template>
      </el-table-column>
      <el-table-column label="是否启用？" width="110" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enable"
            :disabled="!$checkPermission('handle_update')"
            @change="handleDisable(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="180" align="center">
        <template slot-scope="scope">{{ toDateString(scope.row.creationDate) }}</template>
      </el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            :disabled="!$checkPermission('handle_update')"
            @click="handleUpdate(scope.row)"
          >编辑</el-button>
          <el-button
            type="danger"
            size="mini"
            :disabled="!$checkPermission('handle_delete')"
            @click="handleDelete(scope.row)"
          >删除</el-button>
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

    <el-dialog
      :title="form.dialogEditTitle"
      :visible.sync="form.dialogEditVisible"
      :close-on-click-modal="false"
      width="90%"
      top="20px"
    >
      <el-form
        ref="dataForm"
        :rules="form.rules"
        style="width:95%"
        :model="form.info"
        label-position="right"
        label-width="100px"
        label-suffix="："
      >
        <el-form-item label="头条名称" prop="headlineName">
          <el-input v-model="form.info.headlineName" placeholder="头条名称" />
        </el-form-item>
        <el-form-item label="头条简介" prop="headlineAbstract">
          <el-input v-model="form.info.headlineAbstract" type="textarea" placeholder="头条简介" />
        </el-form-item>
        <el-form-item label="响应目标" prop="target">
          <el-input v-model="form.info.target" placeholder="点击响应目标" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.info.sort" :min="1" :max="80" label="排序" />
        </el-form-item>
        <el-form-item label="启用？">
          <el-switch v-model="form.info.enable" active-color="#13ce66" inactive-color="#ff4949" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button icon="el-icon-close" @click="form.dialogEditVisible = false">关闭</el-button>
        <el-button type="primary" icon="iconfont icon-save" @click="handleSave">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  GetHeadlinePageAsync,
  AddHeadlineAsync,
  UpdateHeadlineAsync,
  DisableEnableHeadlineAsync,
  DeleteHeadlineAsync
} from '@/api/Headline'
import { parseTime } from '@/utils/index'
import Pagination from '@/components/Pagination'
import SelectTree from '@/components/SelectTree'

export default {
  components: { Pagination, SelectTree },
  data() {
    return {
      query: {
        pageIndex: 1,
        pageSize: 20,
        name: null,
        SortField: 'sort',
        IsAscending: false
      },
      total: 0,
      list: [],
      listLoading: true,
      form: {
        dialogEditVisible: false,
        dialogEditTitle: '添加',
        dialogEditStatus: 'add',
        // 表单数据
        info: {
          headlineGuid: null,
          sort: 0,
          enable: true,
          headlineName: null,
          headlineAbstract: null,
          target: null
        },
        // 表单验证
        rules: {
          headlineName: [
            { required: true, message: '必填', trigger: 'change' },
            { max: 30, message: '长度不能超过30', trigger: 'change' }
          ],
          headlineAbstract: [
            { required: true, message: '必填', trigger: 'change' },
            { max: 160, message: '长度不能超过160', trigger: 'change' }
          ],
          target: [{ required: true, message: '必填', trigger: 'change' }]
        }
      }
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
      GetHeadlinePageAsync(this.query).then(
        response => {
          this.list = response.data.currentPage
          this.total = response.data.total
          setTimeout(() => {
            this.listLoading = false
          }, 200)
        },
        error => {
          this.listLoading = false
        }
      )
    },
    // 添加
    handleAdd() {
      this.form.info = { sort: 0, enable: true }
      this.form.dialogEditVisible = true
      this.form.dialogEditStatus = 'add'
      this.form.dialogEditTitle = '添加头条'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 修改
    handleUpdate(row) {
      const t = this
      t.form.info = Object.assign({}, row)
      t.form.dialogEditVisible = true
      t.form.dialogEditStatus = 'update'
      t.form.dialogEditTitle = '修改头条'
    },
    // 搜索
    handleSearch() {
      this.query.pageIndex = 1
      this.handleFilter()
    },
    handleSave() {
      const t = this
      const tempData = Object.assign({}, t.form.info)
      t.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (t.form.dialogEditStatus == 'add') {
            AddHeadlineAsync(tempData).then(response => {
              if (response.code === 0) {
                t.$notify({
                  title: '成功',
                  message: '添加成功',
                  type: 'success',
                  duration: 2000
                })
                t.form.dialogEditVisible = false
                t.handleFilter()
              }
            })
          } else {
            UpdateHeadlineAsync(tempData).then(response => {
              if (response.code === 0) {
                t.$notify({
                  title: '成功',
                  message: '修改成功',
                  type: 'success',
                  duration: 2000
                })
                t.form.dialogEditVisible = false
                t.handleFilter()
              }
            })
          }
        }
      })
    },
    // 禁用/启用
    handleDisable(row) {
      var t = this
      DisableEnableHeadlineAsync({
        guid: row.headlineGuid,
        enable: row.enable
      }).then(response => {
        if (response.code === 0) {
          t.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success',
            duration: 2000
          })
        }
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
          DeleteHeadlineAsync({
            guid: row.headlineGuid
          }).then(response => {
            t.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            t.handleFilter()
            t.handleCascader()
          })
        })
        .catch(() => {
          t.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    toDateString(a) {
      return parseTime(new Date(a))
    }
  }
}
</script>
<style>
.assss {
  overflow: hidden;
  display: -webkit-box;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
</style>

