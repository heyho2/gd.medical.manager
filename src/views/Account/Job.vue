<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 20px;">
      <el-input v-model="query.name" placeholder="职位名称" style="width: 200px;" class="filter-item" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="handleAdd">添加职位</el-button>
    </div>
    <tree-table :data="tree.list" :expand-all="tree.expandAll" border :columns="tree.columns">
      <el-table-column label="描述" align="center">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon" />
        </template>
      </el-table-column>
    </tree-table>
    <el-dialog :title="form.dialogEditTitle" :visible.sync="form.dialogEditVisible">
      <el-form
        ref="dataForm"
        :rules="form.rules"
        :model="form.info"
        label-position="left"
        label-width="100px"
        width="90%"
      >
        <el-form-item label="上级职位" prop="account">
          <el-input v-model="form.info.name" type="text" />
        </el-form-item>

        <el-form-item label="职位名称" prop="account">
          <el-input v-model="form.info.name" type="text" />
        </el-form-item>

        <el-form-item label="描述" prop="account">
          <el-input v-model="form.info.name" type="textarea" />
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
import treeTable from '@/components/TreeTable'

export default {
  components: { treeTable },
  data() {
    return {
      query: {},
      tree: {
        columns: [
          {
            text: '职位',
            value: 'name',
            width: 200
          },
          {
            text: '上级职位',
            value: 'code',
            width: 200
          }
        ],
        data: [],
        expandAll: true,
        list: []
      },
      listLoading: true,
      form: {
        dialogEditVisible: false,
        dialogEditTitle: '添加',
        dialogEditStatus: 'add',
        // 表单数据
        info: {
          account: null,
          password: null,
          enable: 1
        },
        // 表单验证
        rules: {
          account: [{ required: true, message: '账号必填', trigger: 'change' }],
          password: [{ required: true, message: '密码必填', trigger: 'change' }]
        }
      }
    }
  },
  methods: {
    handleAdd() {
      this.form.info = {}
      this.form.dialogEditVisible = true
      this.form.dialogEditStatus = 'add'
      this.form.dialogEditTitle = '添加'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleSearch() {},
    handleSave() {
      alert('保存')
    }
  }
}
</script>
