<template>
  <div class="app-container">
    <el-form :inline="true" :model="query">
      <el-form-item>
        <el-input v-model="query.name" placeholder="名称" clearable />
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
          class="filter-item"
          icon="el-icon-circle-plus"
          @click="handleAdd(null)"
        >添加经营范围</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tree.list"
      row-key="dicGuid"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      :row-class-name="tableRowClassName"
    >
      <el-table-column label="序列" type="index" align="center" width="60" />
      <el-table-column label="名称" align="left">
        <template slot-scope="scope">{{ scope.row.configName }}</template>
      </el-table-column>
      <el-table-column label="数据类型" width="110" align="center">
        <template slot-scope="scope">
          <el-tag
            v-if="scope.row.valueType=='decimal'"
            type="danger"
          >{{ getDataTypeName(scope.row.valueType) }}</el-tag>
          <el-tag
            v-else-if="scope.row.valueType=='string'"
          >{{ getDataTypeName(scope.row.valueType) }}</el-tag>
          <el-tag
            v-else-if="scope.row.valueType=='bool'"
            type="warning"
          >{{ getDataTypeName(scope.row.valueType) }}</el-tag>
          <el-tag
            v-else-if="scope.row.valueType=='enum'"
            type="info"
          >{{ getDataTypeName(scope.row.valueType) }}</el-tag>
        </template>
      </el-table-column>
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
            :disabled="!$checkPermission('handle_disable')"
            @change="handleDisable(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80" align="center">
        <template slot-scope="scope">
          <!-- <el-button @click="handleAdd(scope.row.configCode)" type="primary" size="mini">新增</el-button> -->
          <el-button
            :disabled="(scope.row.typeCode=='matedata'||!scope.row.parentGuid)||!$checkPermission('handle_update')"
            size="mini"
            @click="handleUpdate(scope.row)"
          >编辑</el-button>
          <!-- <el-button
            :disabled="scope.row.typeCode=='matedata'||!scope.row.parentGuid"
            @click="handleDelete(scope.row)"
            type="danger"
            size="mini"
          >删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="form.dialogEditTitle"
      :visible.sync="form.dialogEditVisible"
      :close-on-click-modal="false"
      top="20px"
      width="65%"
      append-to-body
    >
      <el-form
        ref="dataForm"
        :rules="form.rules"
        :model="form.info"
        label-position="right"
        label-width="80px"
        style="width:90%"
      >
        <el-form-item label="上级分类" prop="parentGuid">
          <select-tree
            v-model="form.info.parentGuid"
            :options="DictionaryTree"
            placeholder="请选上级字典"
            :expand-all="false"
            :props="{value: 'guid',label: 'name',parent: 'type_code',children: 'children'}"
          />
        </el-form-item>
        <!-- <el-form-item label="编号" prop="configCode">
          <el-input v-model="form.info.configCode" placeholder="编号"/>
        </el-form-item>-->

        <el-form-item label="名称" prop="configName">
          <el-input v-model="form.info.configName" placeholder="名称" />
        </el-form-item>

        <el-form-item label="分类图片" prop="extensionField">
          <UploadImg2
            :value.sync="form.info.extensionField"
            :url.sync="form.info.extensionFieldUrl"
            :img-width="200"
            :auto-crop-width="500"
            :auto-crop-height="300"
          />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.info.sort" :min="1" :max="100" label="排序" />
        </el-form-item>
        <el-form-item label="是否可用">
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
  GetDictionaryPageAsync,
  AddBusinessScopeAsync,
  UpdateBusinessScopeAsync,
  DisableEnableDictionaryAsync,
  GetBusinessScopeTypeAsync,
  GetBusinessScopePageAsync,
  DeleteDictionaryAsync
} from '@/api/Dictionary'
import { GetAcessoryUrlAsync } from '@/api/Accessory'

import UploadImg2 from '@/components/UploadImg2/Index'
import { parseTime } from '@/utils/index'
import SelectTree from '@/components/SelectTree'
import { md5 } from '@/utils/md5'
import LabelsEdit from '@/views/Commons/LabelsEdit'

export default {
  components: { SelectTree, LabelsEdit, UploadImg2 },
  data() {
    return {
      query: {
        name: null,
        matedata: null
      },
      tree: {
        columns: [
          {
            text: '名称',
            value: 'configName'
          }
        ],
        data: [],
        expandAll: false,
        list: []
      },
      listLoading: true,
      MatedataList: [],
      DictionaryTree: [],
      dataType: [
        { code: 'enum', name: '枚举' },
        { code: 'bool', name: '布尔' },
        { code: 'string', name: '字符串' },
        { code: 'decimal', name: '数值' }
      ],
      form: {
        dialogEditVisible: false,
        dialogEditTitle: '添加',
        dialogEditStatus: 'add',
        // 表单数据
        info: {
          dicGuid: null,
          parentGuid: null,
          configCode: null,
          configName: null,
          valueType: null,
          valueRange: null,
          sort: 1,
          extensionField: null,
          enable: true
        },
        // 表单验证
        rules: {
          configCode: [{ required: true, message: '必填', trigger: 'change' }],
          extensionField: [
            { required: true, message: '必填', trigger: 'change' }
          ],
          configName: [
            { required: true, message: '必填', trigger: 'change' },
            { max: 20, message: '值不能超过20', trigger: 'change' }
          ],
          valueRange: [{ max: 50, message: '值不能超过20', trigger: 'change' }]
        }
      },
      cValueRange: []
    }
  },
  computed: {},
  watch: {},
  created() {
    var t = this
    t.handleFilter()
    // GetBusinessScopeType({}).then(response => {
    //   t.MatedataList = response.data;
    // });
    t.GetDictionaryTree()
  },
  methods: {
    GetDictionaryTree() {
      var t = this
      GetBusinessScopeTypeAsync({}).then(response => {
        t.DictionaryTree = response.data
      })
    },
    // 加载表格数据
    handleFilter() {
      this.listLoading = true
      GetBusinessScopePageAsync(this.query).then(
        response => {
          this.tree.list = response.data
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
    handleAdd(parentGuid) {
      this.form.info = {
        parentGuid: parentGuid,
        valueType: 'string',
        enable: true,
        sort: 1
      }
      this.form.dialogEditVisible = true
      this.form.dialogEditStatus = 'add'
      this.form.dialogEditTitle = '添加字典'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 修改
    handleUpdate(row) {
      debugger
      this.form.info = {
        dicGuid: row.dicGuid,
        parentGuid: row.parentGuid,
        configCode: row.configCode,
        configName: row.configName,
        valueType: row.valueType,
        valueRange: row.valueRange,
        sort: row.sort,
        extensionField: row.extensionField,
        extensionFieldUrl: null,
        enable: row.enable
      }
      if (row.extensionField) {
        GetAcessoryUrlAsync(row.extensionField).then(response => {
          this.form.info.extensionFieldUrl = response.data
        })
      }
      if (this.form.info.valueRange === '{}' || !this.form.info.valueRange) {
        this.cValueRange = []
      } else {
        this.cValueRange = JSON.parse(this.form.info.valueRange)
      }
      this.form.dialogEditVisible = true
      this.form.dialogEditStatus = 'update'
      this.form.dialogEditTitle = '修改字典'
    },
    // 搜索
    handleSearch() {
      this.query.pageIndex = 1
      this.handleFilter()
    },
    handleSave() {
      const t = this
      const tempData = Object.assign({}, t.form.info)
      tempData.valueRange = JSON.stringify(t.cValueRange)
      t.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (t.form.dialogEditStatus == 'add') {
            AddBusinessScopeAsync(tempData).then(response => {
              t.$notify({
                title: '成功',
                message: '添加成功',
                type: 'success',
                duration: 2000
              })
              t.form.dialogEditVisible = false
              t.handleFilter()

              t.GetDictionaryTree()
            })
          } else {
            UpdateBusinessScopeAsync(tempData).then(response => {
              if (response.code === 0) {
                t.$notify({
                  title: '成功',
                  message: '修改成功',
                  type: 'success',
                  duration: 2000
                })
                t.form.dialogEditVisible = false
                t.handleFilter()
                t.GetDictionaryTree()
              }
            })
          }
        }
      })
    },
    // 禁用/启用
    handleDisable(row) {
      var t = this
      DisableEnableDictionaryAsync({
        Guid: row.dicGuid,
        enable: row.enable
      }).then(response => {
        t.$notify({
          title: '成功',
          message: '修改成功',
          type: 'success',
          duration: 2000
        })
        t.handleFilter()
        t.GetDictionaryTree()
      })
    },
    handleDelete(row) {
      var t = this
      t.$confirm('此操作将永久删除该数据, 是否继续?', '确认删除', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          DeleteDictionaryAsync({
            Guid: row.dicGuid
          }).then(response => {
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
    toDateString(a) {
      return parseTime(new Date(a))
    },
    getDataTypeName(code) {
      let name
      this.dataType.forEach(element => {
        if (element.code == code) name = element.name
      })
      return name
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

