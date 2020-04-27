<template>
  <div class="app-container">
    <el-form :inline="true" :model="query">
      <el-form-item>
        <el-input
          v-model="query.name"
          placeholder="科室名字"
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
        >添加科室</el-button>
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
      <el-table-column label="科室名称" min-width="110" align="left">
        <template slot-scope="scope">{{ scope.row.officeName }}</template>
      </el-table-column>
      <el-table-column label="排序" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.sort }}</template>
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
      <el-table-column label="操作" width="110" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            :disabled="!$checkPermission('handle_update')"
            @click="handleUpdate(scope.row)"
          >编辑</el-button>
          <!-- <el-button @click="handleDelete(scope.row)" type="text" size="small">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>
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
        :model="form.info"
        label-suffix="："
        label-position="right"
        label-width="100px"
        :style="{width:95+'%'}"
      >
        <el-form-item label="上级科室" prop="parentName">
          <!-- <select-tree
            v-model="form.info.parentName"
            :options="cascaderList"
            :props="{value: 'officeName',label: 'officeName',parent: 'parentName',children: 'children'}"
          />-->
          <el-select
            v-model="form.info.parentName"
            clearable
            placeholder="请选上级科室"
            style="width:100%"
          >
            <el-option v-for="item in cascaderList" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="科室名称" prop="newOfficeName">
          <el-input v-model="form.info.newOfficeName" type="text" placeholder="部门名称" />
        </el-form-item>
        <el-form-item label="显示顺序" prop="sort">
          <el-input-number v-model="form.info.sort" :min="1" :max="1000" label="显示顺序" />
        </el-form-item>
        <el-form-item label="图片" prop="pictureGuid">
          <upload-img2
            :dialog-visible="true"
            :value.sync="form.info.pictureGuid"
            :url.sync="form.info.pictureUrl"
            :img-width="150"
            :auto-crop-width="200"
            :auto-crop-height="200"
          />
        </el-form-item>
        <el-form-item label="是否有效" prop="enable">
          <el-switch v-model="form.info.enable" active-color="#13ce66" inactive-color="#ff4949" />
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
  GetOfficeListAsync,
  AddOfficeAsync,
  UpdataOfficeAsync,
  GetFirstOfficeListAsync,
  DisableEnableOfficeAsync
} from '@/api/Hospital'
import { GetAcessoryUrlAsync } from '@/api/Accessory'
import { parseTime } from '@/utils/index'
import SelectTree from '@/components/SelectTree'
import UploadImg2 from '@/components/UploadImg2/Index'

export default {
  components: { SelectTree, UploadImg2 },
  data() {
    return {
      query: { name: null, SortField: 'sort', IsAscending: false },
      tree: {
        list: []
      },
      cascaderList: [],
      listLoading: true,
      form: {
        dialogEditVisible: false,
        dialogEditTitle: '添加科室',
        dialogEditStatus: 'add',
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
      this.form.dialogEditVisible = true
      this.form.dialogEditStatus = 'add'
      this.form.dialogEditTitle = '添加科室'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 修改
    handleUpdate(row) {
      var t = this
      t.form.info = {
        officeName: row.officeName,
        newOfficeName: row.officeName,
        parentName: row.parentName,
        pictureGuid: row.pictureGuid,
        sort: row.sort,
        enable: row.enable
      }
      if (row.pictureGuid) {
        GetAcessoryUrlAsync(row.pictureGuid).then(response => {
          t.form.info.pictureUrl = response.data
          t.form.dialogEditVisible = true
        })
      } else {
        t.form.dialogEditVisible = true
      }
      t.form.dialogEditStatus = 'update'
      t.form.dialogEditTitle = '修改科室'
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
    toDateString(a) {
      return parseTime(new Date(a))
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
