<template>
  <div class="app-container">
    <el-form :inline="true" :model="query">
      <el-form-item>
        <el-input
          v-model="query.name"
          placeholder="页面名称"
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
          type
          icon="el-icon-circle-plus"
          @click="handleAdd"
        >添加</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="tree.list"
      element-loading-text="Loading"
      row-key="officeName"
      :default-expand-all="true"
      :border="false"
      :row-class-name="tableRowClassName"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column label="序列" type="index" align="center" width="60" />
      <el-table-column label="页面名称" min-width="110" align="left">
        <template slot-scope="scope">{{ scope.row.officeName }}</template>
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
      <el-table-column label="操作" width="260" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            :disabled="!$checkPermission('handle_add')"
            @click="handleAdd(scope.row)"
          >新增</el-button>
          <el-button
            size="mini"
            :disabled="!$checkPermission('handle_update')"
            @click="handleUpdate(scope.row)"
          >编辑</el-button>
          <el-button size="mini" type="success" @click="handleCopy(scope.row,$event)">复制</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Drawer :title="form.dialogTitle" :dialog-visible.sync="form.dialogVisible" width="600px" style>
      <el-form
        ref="dataForm"
        :rules="form.rules"
        :model="form.info"
        label-suffix="："
        label-position="right"
        label-width="100px"
        :style="{width:95+'%'}"
      >
        <el-form-item label="上级页面" prop="parentName">
          <select-tree
            v-model="form.info.parentName"
            :options="tree.list"
            :props="{value: 'officeName',label: 'officeName',parent: 'parentName',children: 'children'}"
          />
        </el-form-item>
        <el-form-item label="页面名称" prop="newOfficeName">
          <el-input v-model="form.info.newOfficeName" type="text" placeholder="请输入页面名称" />
        </el-form-item>
        <el-form-item label="页面地址" prop="sort">
          <el-input v-model="form.info.pageAddress" type="text" placeholder="请输入页面地址url" />
        </el-form-item>
        <el-form-item label="是否启用" prop="enable">
          <el-switch v-model="form.info.enable" active-color="#13ce66" inactive-color="#ff4949" />
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <el-button icon="el-icon-close" @click="form.dialogVisible = false">关闭</el-button>
        <el-button type="primary" icon="iconfont icon-save" @click="handleSave()">保存</el-button>
      </template>
    </Drawer>
  </div>
</template>

<script>
import {
  GetOfficeListAsync,
  AddOfficeAsync,
  UpdataOfficeAsync,
  GetFirstOfficeListAsync,
  DisableEnableOfficeAsync
} from '@/api/Hospital'
import { parseTime } from '@/utils/index'
import SelectTree from '@/components/SelectTree'
import clip from '@/utils/clipboard' // use clipboard directly
import Drawer from '@/components/Drawer/Index'

export default {
  components: { SelectTree, Drawer },
  data() {
    return {
      query: { name: null, SortField: 'sort', IsAscending: false },
      tree: {
        list: []
      },
      cascaderList: [],
      listLoading: true,
      form: {
        dialogVisible: false,
        dialogTitle: '编辑页面',
        // 表单数据
        info: {
          officeName: null,
          newOfficeName: null,
          parentName: null,
          enable: true,
          sort: 1,
          pictureGuid: null
        },
        // 表单验证
        rules: {
          newOfficeName: [
            { max: 10, message: `字符串长度不能超过${10}`, trigger: 'change' },
            { required: true, message: '必填', trigger: 'change' }
          ],
          pictureGuid: [{ required: true, message: '必填', trigger: 'change' }]
        }
      }
    }
  },
  created() {
    var t = this
    t.handleFilter()
    // t.handleCascader();
    t.handleCascader2()
  },
  methods: {
    handleCascader() {
      var t = this
      GetOfficeListAsync({
        name: null,
        SortField: 'sort',
        IsAscending: false,
        enable: true
      }).then(response => {
        t.cascaderList = response.data
      })
    },
    handleCascader2() {
      var t = this
      GetFirstOfficeListAsync().then(response => {
        t.cascaderList = response.data
      })
    },
    handleFilter(rob) {
      var t = this
      t.listLoading = true
      GetOfficeListAsync(t.query).then(
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
      this.form.dialogVisible = true
      this.form.dialogTitle = '添加页面'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 修改
    handleUpdate(row) {
      var t = this
      t.form.info = {
        officeName: row.officeName,
        parentGuid: row.parentGuid,
        parentName: row.parentName,
        newOfficeName: row.newOfficeName,
        sort: row.sort,
        enable: row.enable
      }
      t.form.dialogVisible = true
      t.form.dialogTitle = '修改c页面'
    },
    handleSearch() {
      this.handleFilter()
    },
    handleSave() {
      const t = this
      const tempData = Object.assign({}, t.form.info)
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (t.form.dialogEditStatus == 'add') {
            tempData.officeName = tempData.newOfficeName
            AddOfficeAsync(tempData).then(response => {
              t.$notify({
                title: '成功',
                message: '添加成功',
                type: 'success',
                duration: 2000
              })
              t.form.dialogEditVisible = false
              t.handleFilter()
              t.handleCascader2()
              // t.handleCascader();
            })
          } else {
            UpdataOfficeAsync(tempData).then(response => {
              t.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
              t.form.dialogEditVisible = false
              t.handleFilter()
              t.handleCascader2()
              // t.handleCascader();
            })
          }
        }
      })
    },
    // 禁用/启用
    handleDisable(row) {
      var t = this
      DisableEnableOfficeAsync({
        officeName: row.officeName,
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
    handleCopy(row) {
      clip(`/Report/${row.themeGuid}`, event)
    },
    handleOrderBy(a) {
      this.query.SortField = a.prop
      this.query.IsAscending = a.order == 'ascending'
      this.handleFilter()
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.enable === false) {
        return 'disable-row'
      }
      return ''
    }
  }
}
</script>
