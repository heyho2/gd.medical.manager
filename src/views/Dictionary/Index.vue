<template>
  <div class="app-container">
    <el-form :inline="true" :model="query">
      <el-form-item>
        <el-input v-model="query.name" placeholder="名称" clearable />
      </el-form-item>
      <el-form-item>
        <el-select v-model="query.matedata" clearable placeholder="元数据">
          <el-option
            v-for="item in MatedataList"
            :key="item.guid"
            :label="item.name"
            :value="item.guid"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          :loading="listLoading"
          @click="handleSearch()"
        >搜索</el-button>
      </el-form-item>

      <el-form-item>
        <el-button
          v-permission="'handle_add'"
          class="filter-item"
          icon="el-icon-circle-plus"
          @click="handleAdd(null)"
        >添加字典</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tree.list"
      element-loading-text="Loading"
      row-key="dicGuid"
      :border="false"
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
            :disabled="scope.row.typeCode=='matedata'||!$checkPermission('handle_disable')"
            @change="handleDisable(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center">
        <template slot-scope="scope">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              操作菜单
              <i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                icon="el-icon-circle-plus"
                :command="{type:`add`,row:scope.row}"
                :disabled="!$checkPermission('handle_add')"
                @click="handleAdd(scope.row.dicGuid)"
              >新增</el-dropdown-item>
              <el-dropdown-item
                icon="el-icon-edit"
                :command="{type:`edit`,row:scope.row}"
                :disabled="scope.row.typeCode=='matedata'||!$checkPermission('handle_update')"
                @click="handleUpdate(scope.row)"
              >编辑</el-dropdown-item>
              <el-dropdown-item
                icon="el-icon-delete-solid"
                :command="{type:`delete`,row:scope.row}"
                :disabled="!$checkPermission('handle_delete')"
                @click="handleDelete(scope.row)"
              >删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

          <!-- <el-button
            @click="handleAdd(scope.row.dicGuid)"
            type="primary"
            size="mini"
            :disabled="!$checkPermission('handle_add')"
          >新增</el-button>
          <el-button
            :disabled="scope.row.typeCode=='matedata'||!$checkPermission('handle_update')"
            @click="handleUpdate(scope.row)"
            size="mini"
          >编辑</el-button>
          <el-button
            @click="handleDelete(scope.row)"
            type="danger"
            size="mini"
            :disabled="!$checkPermission('handle_delete')"
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
        label-width="120px"
        label-suffix="："
        style="width:90%"
      >
        <el-form-item label="上级字典" prop="parentGuid">
          <select-tree
            v-model="form.info.parentGuid"
            :options="DictionaryTree"
            placeholder="请选上级字典"
            :expand-all="true"
            :props="{value: 'guid',label: 'name',parent: 'parentGuid',children: 'children'}"
          />
        </el-form-item>
        <!-- <el-form-item label="编号" prop="configCode">
          <el-input v-model="form.info.configCode" placeholder="编号"/>
        </el-form-item>-->

        <el-form-item label="名称" prop="configName">
          <el-input v-model="form.info.configName" placeholder="名称" />
        </el-form-item>
        <el-form-item label="数据类型" prop="valueType">
          <el-select v-model="form.info.valueType" clearable placeholder="数据类型">
            <el-option
              v-for="item in dataType"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.info.valueType=='enum'" label="取值范围" prop="valueRange">
          <labels-edit :list="cValueRange" />
        </el-form-item>

        <el-form-item label="其他值" prop="extensionField">
          <el-input v-model="form.info.extensionField" type="textarea" placeholder="其他值" />
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
  AddDictionaryAsync,
  UpdateDictionaryAsync,
  DisableEnableDictionaryAsync,
  GetDictionaryMatedata,
  GetDictionaryTreeAsync,
  DeleteDictionaryAsync,
  GetDictionaryTreeTypeAsync
} from '@/api/Dictionary'
import { parseTime } from '@/utils/index'
import SelectTree from '@/components/SelectTree'
import treeTable from '@/components/TreeTable'
import { md5 } from '@/utils/md5'
import LabelsEdit from '@/views/Commons/LabelsEdit'

export default {
  components: { SelectTree, LabelsEdit },
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
          parentGuid: [{ required: true, message: '必填', trigger: 'change' }],
          configCode: [{ required: true, message: '必填', trigger: 'change' }],
          configName: [
            { required: true, message: '必填', trigger: 'change' },
            { max: 20, message: '值不能超过20', trigger: 'change' }
          ],
          valueRange: [
            { max: 2000, message: '值不能超过2000', trigger: 'change' }
          ]
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
    t.getDictionaryTreeType()
    GetDictionaryMatedata({}).then(response => {
      t.MatedataList = response.data
    })
  },
  methods: {
    getDictionaryTreeType() {
      var t = this
      GetDictionaryTreeTypeAsync().then(response => {
        t.DictionaryTree = response.data
      })
    },
    // 加载表格数据
    handleFilter() {
      this.listLoading = true
      GetDictionaryTreeAsync(this.query).then(
        response => {
          this.tree.list = response.data
          setTimeout(() => {
            this.listLoading = false
          }, 500)
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
      this.form.info = {
        dicGuid: row.dicGuid,
        parentGuid: row.parentGuid,
        configCode: row.configCode,
        configName: row.configName,
        valueType: row.valueType,
        valueRange: row.valueRange,
        sort: row.sort,
        extensionField: row.extensionField,
        enable: row.enable
      }
      if (this.form.info.valueRange === '{}' || !this.form.info.valueRange) {
        this.cValueRange = []
      } else {
        this.cValueRange = JSON.parse(this.form.info.valueRange)
      }
      console.log(row.parentGuid)

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
            AddDictionaryAsync(tempData).then(response => {
              t.$notify({
                title: '成功',
                message: '添加成功',
                type: 'success',
                duration: 2000
              })
              t.form.dialogEditVisible = false
              t.handleFilter()
              t.getDictionaryTreeType()
            })
          } else {
            UpdateDictionaryAsync(tempData).then(response => {
              t.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
              t.form.dialogEditVisible = false
              t.handleFilter()
              t.getDictionaryTreeType()
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
    },
    handleCommand(command) {
      switch (command.type) {
        case 'add':
          this.handleAdd(command.row.dicGuid)
          break
        case 'edit':
          this.handleUpdate(command.row)
          break
        case 'delete':
          this.handleDelete(command.row)
          break
      }
    }
  }
}
</script>

