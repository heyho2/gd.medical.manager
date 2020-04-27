<template>
  <div class="app-container">
    <el-form :inline="true" :model="query">
      <el-form-item>
        <el-input
          v-model="query.name"
          placeholder="组织架构名称"
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
        >添加组织结构</el-button>
      </el-form-item>
    </el-form>
    <tree-table
      v-loading="listLoading"
      :data="tree.list"
      element-loading-text="Loading"
      :expand-all="tree.expandAll"
      border
      :columns="tree.columns"
    >
      <el-table-column label="排序" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.sort }}</template>
      </el-table-column>
      <el-table-column label="创建时间" width="180" align="center">
        <template slot-scope="scope">{{ toDateString(scope.row.creationDate) }}</template>
      </el-table-column>
      <el-table-column label="是否有效?" width="110" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enable"
            :disabled="!$checkPermission('handle_update')"
            @change="handleDisable(scope.row)"
          />
        </template>
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
    </tree-table>
    <el-dialog
      :title="form.dialogEditTitle"
      :visible.sync="form.dialogEditVisible"
      :close-on-click-modal="false"
      append-to-body
    >
      <el-form
        ref="dataForm"
        :rules="form.rules"
        :model="form.info"
        label-position="left"
        label-width="100px"
        width="90%"
      >
        <el-form-item label="上级部门" prop="parentGuid">
          <select-tree
            v-model="form.info.parentGuid"
            :options="cascaderList"
            :props="{value: 'orgGuid',label: 'orgName',parent: 'parentGuid',children: 'children'}"
          />
        </el-form-item>
        <el-form-item label="部门名称" prop="orgName">
          <el-input v-model="form.info.orgName" type="text" placeholder="部门名称" />
        </el-form-item>
        <el-form-item label="是否有效" prop="enable">
          <el-switch v-model="form.info.enable" active-color="#13ce66" inactive-color="#ff4949" />
        </el-form-item>
        <el-form-item label="显示顺序" prop="sort">
          <el-input-number v-model="form.info.sort" :min="1" :max="1000" label="显示顺序" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" icon="iconfont icon-save" @click="handleSave">保存</el-button>
        <el-button icon="el-icon-close" @click="form.dialogEditVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  GetOrganizationTreeAsync,
  AddOrganizationAsync,
  UpdateOrganizationAsync,
  DisableEnableOrganizationAsync,
  DeleteOrganizationAsync
} from '@/api/User'
import { parseTime } from '@/utils/index'
import treeTable from '@/components/TreeTable'
import SelectTree from '@/components/SelectTree'

export default {
  components: { treeTable, SelectTree },
  data() {
    return {
      query: { name: null, SortField: 'sort', IsAscending: false },
      tree: {
        columns: [
          {
            text: '部门',
            value: 'orgName'
          }
        ],
        data: [],
        expandAll: true,
        list: []
      },
      cascaderList: [],
      listLoading: true,
      form: {
        dialogEditVisible: false,
        dialogEditTitle: '添加',
        dialogEditStatus: 'add',
        // 表单数据
        info: {
          orgGuid: null,
          orgName: null,
          sort: 0,
          enable: true,
          parentGuid: null
        },
        // 表单验证
        rules: {
          orgName: [
            { required: true, message: '名称必填', trigger: 'change' },
            { max: 10, message: '字符长度不能超过10', trigger: 'change' }
          ]
        }
      }
    }
  },
  created() {
    var t = this
    t.handleFilter()
    t.handleCascader()
  },
  methods: {
    __getCascaderList(list) {
      var t = this
      var list2 = []
      list.forEach(item => {
        var entity = Object.assign({}, item)
        entity.enable = !item.enable
        entity.children =
          item.children.length == 0 ? null : t.__getCascaderList(item.children)
        list2.push(entity)
      })
      return list2
    },
    handleCascader() {
      var t = this
      GetOrganizationTreeAsync({
        name: null,
        SortField: 'sort',
        IsAscending: false,
        enable: true
      }).then(response => {
        t.cascaderList = t.__getCascaderList(response.data)
      })
    },
    handleFilter(rob) {
      var t = this
      t.listLoading = true
      GetOrganizationTreeAsync(t.query).then(
        response => {
          t.tree.list = response.data
          setTimeout(() => {
            t.listLoading = false
          }, 200)
        },
        error => {
          this.listLoading = false
        }
      )
    },
    handleAdd() {
      this.form.info = { enable: true, sort: 1 }
      this.form.dialogEditVisible = true
      this.form.dialogEditStatus = 'add'
      this.form.dialogEditTitle = '添加'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 修改
    handleUpdate(row) {
      var t = this
      t.form.info = {
        orgGuid: row.orgGuid,
        parentGuid: row.parentGuid,
        orgName: row.orgName,
        sort: row.sort,
        enable: row.enable
      }

      t.form.dialogEditVisible = true
      t.form.dialogEditStatus = 'update'
      t.form.dialogEditTitle = '修改'
    },
    handleSearch() {
      this.handleFilter()
    },
    handleSave() {
      var t = this
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (t.form.dialogEditStatus == 'add') {
            AddOrganizationAsync(t.form.info).then(response => {
              t.$notify({
                title: '成功',
                message: '添加成功',
                type: 'success',
                duration: 2000
              })
              t.form.dialogEditVisible = false
              t.handleFilter()
              t.handleCascader()
            })
          } else {
            UpdateOrganizationAsync(t.form.info).then(response => {
              t.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
              t.form.dialogEditVisible = false
              t.handleFilter()
            })
          }
        }
      })
    },
    // 禁用/启用
    handleDisable(row) {
      var t = this
      DisableEnableOrganizationAsync({
        orgGuid: row.orgGuid,
        enable: row.enable
      }).then(response => {
        t.$notify({
          title: '成功',
          message: '修改成功',
          type: 'success',
          duration: 2000
        })
        t.handleFilter()
        t.handleCascader()
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
    // 禁用/启用
    handleDelete(row) {
      var t = this
      t.$confirm('此操作将永久删除该数据, 是否继续?', '确认删除', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          DeleteOrganizationAsync({
            orgGuid: row.orgGuid
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
    }
  }
}
</script>
