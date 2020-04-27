<template>
  <div>
    <el-form :inline="true" :model="query">
      <el-form-item>
        <el-input
          v-model="query.question"
          placeholder="问题"
          style="width: 200px;"
          class="filter-item"
        />
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          v-permission="'handle_add'"
          class="filter-item"
          type="primary"
          icon="el-icon-plus"
          @click="handleAdd"
        >添加常见问题</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序列" width="65">
        <template slot-scope="scope">{{ scope.$index+1 }}</template>
      </el-table-column>

      <el-table-column label="问题" width="200" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.question }}</span>
        </template>
      </el-table-column>
      <el-table-column label="回答" align="left">
        <template slot-scope="scope">{{ scope.row.answer }}</template>
      </el-table-column>
      <el-table-column label="排序" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.sort }}</template>
      </el-table-column>
      <el-table-column label="创建时间" width="160" align="center">
        <template slot-scope="scope">{{ toDateString(scope.row.creationDate) }}</template>
      </el-table-column>
      <el-table-column label="是否启用?" width="110" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enable"
            :disabled="!$checkPermission('handle_update')"
            @change="handleDisable(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="110" align="center">
        <template slot-scope="scope">
          <!-- <el-button @click="handleDelete(scope.row)" type="text" size="small">删除</el-button> -->
          <el-button
            size="mini"
            :disabled="!$checkPermission('handle_update')"
            @click="handleUpdate(scope.row)"
          >编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total="total"
      :page.sync="query.pageIndex"
      :limit.sync="query.pageSize"
      @pagination="handleFilter"
    />

    <el-dialog
      :title="form.dialogEditTitle"
      :visible.sync="form.dialogEditVisible"
      :close-on-click-modal="false"
      width="45%"
      append-to-body
    >
      <el-form
        ref="dataForm"
        :rules="form.rules"
        :model="form.info"
        label-position="left"
        label-width="80px"
      >
        <el-form-item label="问题" prop="question">
          <el-input v-model="form.info.question" placeholder="问题" />
        </el-form-item>

        <el-form-item label="回答" prop="answer">
          <el-input v-model="form.info.answer" type="textarea" placeholder="回答" />
        </el-form-item>

        <el-form-item label="排序">
          <el-input-number v-model="form.info.sort" :min="1" :max="100" label="排序" />
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
  GetHelpPageAsync,
  AddHelpAsync,
  UpdateHelpAsync,
  DisableEnableHelpAsync
} from '@/api/Help'
import Pagination from '@/components/Pagination'
import { parseTime } from '@/utils/index'
export default {
  components: { Pagination },
  data() {
    return {
      query: {
        question: null,
        sortField: null,
        isAscending: true,
        pageIndex: 1,
        pageSize: 10
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
          helpGuid: null,
          question: null,
          answer: null,
          enable: true,
          sort: 1
        },
        // 表单验证
        rules: {
          question: [
            { required: true, message: '必填', trigger: 'change' },
            { max: 200, message: '长度不能超过200', trigger: 'change' }
          ],
          answer: [
            { required: true, message: '必填', trigger: 'change' },
            { max: 2000, message: '长度不能超过2000', trigger: 'change' }
          ]
        }
      }
    }
  },
  created() {
    this.handleFilter()
  },
  methods: {
    // 加载表格数据
    handleFilter() {
      this.listLoading = true
      GetHelpPageAsync(this.query).then(
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
    // 添加
    handleAdd() {
      const t = this
      t.form.info = {
        enable: true,
        sort: 1
      }
      t.form.dialogEditVisible = true
      t.form.dialogEditStatus = 'add'
      t.form.dialogEditTitle = '添加问题'
      t.$nextTick(() => {
        t.$refs['dataForm'].clearValidate()
      })
    },
    // 修改
    handleUpdate(row) {
      this.form.info = Object.assign({}, row) // copy obj
      this.form.dialogEditVisible = true
      this.form.dialogEditStatus = 'update'
      this.form.dialogEditTitle = '修改问题'
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
            AddHelpAsync(tempData).then(response => {
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
            UpdateHelpAsync(tempData).then(response => {
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
      DisableEnableHelpAsync({
        Guid: row.helpGuid,
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
    toDateString(a) {
      return parseTime(new Date(a))
    }
  }
}
</script>
<style>
</style>

