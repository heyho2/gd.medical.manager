<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 20px;">
      <el-form :inline="true" :model="query">
        <el-form-item>
          <el-input
            v-model="query.name"
            placeholder="角色名称"
            style="width: 200px;"
            class="filter-item"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="handleSearch"
          >搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            v-permission="'handle_add'"
            class="filter-item"
            type="primary"
            icon="el-icon-plus"
            @click="handleAdd"
          >添加角色</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      @sort-change="handleOrderBy"
    >
      <el-table-column align="center" label="序列" width="65">
        <template slot-scope="scope">{{ scope.$index+1 }}</template>
      </el-table-column>
      <el-table-column label="角色名称" width="110" align="center" rules="roleName">
        <template slot-scope="scope">
          <span>{{ scope.row.roleName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" align="left" rules="description">
        <template slot-scope="scope">{{ scope.row.description||'无' }}</template>
      </el-table-column>
      <el-table-column label="排序" width="110" align="center" :sortable="'custom'" prop="sort">
        <template slot-scope="scope">{{ scope.row.sort }}</template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        width="180"
        align="center"
        :sortable="'custom'"
        prop="creation_Date"
      >
        <template slot-scope="scope">{{ toDateString(scope.row.creationDate) }}</template>
      </el-table-column>
      <el-table-column label="是否有效?" width="110" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enable"
            :disabled="!$checkPermission('handle_disable')"
            @change="handleDisable(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            :disabled="!$checkPermission('handle_update')"
            @click="handleUpdate(scope.row)"
          >编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="form.dialogEditTitle"
      :visible.sync="form.dialogEditVisible"
      :close-on-click-modal="false"
    >
      <el-form
        ref="dataForm"
        :rules="form.rules"
        :model="form.info"
        label-position="left"
        label-width="80px"
        style="margin-left:50px;"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.info.roleName" placeholder="角色名称" />
        </el-form-item>
        <el-form-item label="显示顺序" prop="sort">
          <el-input-number v-model="form.info.sort" :min="1" :max="1000" label="显示顺序" />
        </el-form-item>
        <el-form-item label="是否有效" prop="enable">
          <el-switch v-model="form.info.enable" active-color="#13ce66" inactive-color="#ff4949" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.info.description" type="textarea" placeholder="描述一下" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button icon="el-icon-close" @click="form.dialogEditVisible = false">关闭</el-button>
        <el-button type="primary" icon="iconfont icon-save" @click="handleSave">保存</el-button>
      </div>
    </el-dialog>
    <AssignMenu :dialog-visible.sync="assignMenu.dialogVisible" :role-guid="assignMenu.roleGuid" />
  </div>
</template>

<script>
import {
  GetRoleListAsync,
  AddRoleAsync,
  UpdateRoleAsync,
  DisableEnableRoleAsync
} from '@/api/User'
import AssignMenu from './AssignMenu'
import { parseTime } from '@/utils/index'
export default {
  components: { AssignMenu },
  data() {
    return {
      query: {
        name: null,
        SortField: 'sort',
        IsAscending: false
      },
      list: [],
      listLoading: true,
      form: {
        dialogEditVisible: false,
        dialogEditTitle: '添加角色',
        dialogEditStatus: 'add',
        // 表单数据
        info: {
          roleGuid: null,
          roleName: null,
          description: null,
          sort: 0,
          enable: true,
          createdBy: null,
          creationDate: null,
          lastUpdatedBy: null,
          lastUpdatedDate: null
        },
        // 表单验证
        rules: {
          roleName: [
            { required: true, message: '名称必填', trigger: 'change' },
            { max: 10, message: '最大长度10' }
          ],
          sort: [{ required: true, message: '排序必填', trigger: 'change' }],
          description: [{ max: 100, message: '最大长度100' }]
        }
      },
      assignMenu: { dialogVisible: false, roleGuid: null }
    }
  },
  watch: {},
  created() {
    this.handleFilter()
  },
  methods: {
    handleFilter() {
      var t = this
      t.listLoading = true
      GetRoleListAsync(t.query).then(
        response => {
          t.list = response.data
          setTimeout(() => {
            t.listLoading = false
          }, 200)
        },
        error => {
          this.listLoading = false
        }
      )
    },
    // 添加
    handleAdd() {
      this.form.info = { enable: true }
      this.form.dialogEditVisible = true
      this.form.dialogEditStatus = 'add'
      this.form.dialogEditTitle = '添加角色'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 修改
    handleUpdate(row) {
      this.form.info = Object.assign({}, row) // copy obj
      this.form.dialogEditVisible = true
      this.form.dialogEditStatus = 'update'
      this.form.dialogEditTitle = '修改角色'
    },
    handleSearch() {
      this.handleFilter()
    },
    handleSave() {
      var t = this
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (t.form.dialogEditStatus == 'add') {
            AddRoleAsync(t.form.info).then(response => {
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
            UpdateRoleAsync(t.form.info).then(response => {
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
      DisableEnableRoleAsync(row).then(response => {
        t.$notify({
          title: '成功',
          message: '修改成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    toDateString(a) {
      return parseTime(new Date(a))
    },
    handleOrderBy(a) {
      this.query.SortField = a.prop
      this.query.IsAscending = a.order == 'ascending'
      this.handleFilter()
    },
    handleAssignMenu(row) {
      this.assignMenu.dialogVisible = true
      this.assignMenu.roleGuid = row.roleGuid
    }
  }
}
</script>
<style>
</style>

