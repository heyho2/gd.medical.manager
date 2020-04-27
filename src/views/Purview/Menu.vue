<template>
  <div class="app-container">
    <el-form :inline="true" :model="query">
      <el-form-item>
        <el-input
          v-model="query.name"
          placeholder="菜单名称"
          style="width: 200px;"
          class="filter-item"
        />
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
          v-permission="`handle_update`"
          type
          icon="el-icon-circle-plus"
          @click="handleAdd"
        >添加菜单</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="tree.list"
      element-loading-text="请求数据"
      row-key="menuGuid"
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      :row-class-name="tableRowClassName"
    >
      <el-table-column label="序列" type="index" align="center" width="60" />
      <el-table-column label="菜单名称" width="200" align="left">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.menuClass||'系统'" />
          <span>{{ scope.row.menuName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="编号" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.menuCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="路径" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.menuUrl }}</span>
        </template>
      </el-table-column>
      <el-table-column label="图标" width="60" align="center">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.menuClass||'系统'" />
        </template>
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

      <el-table-column label="操作" width="320" align="left">
        <template slot-scope="scope">
          <el-button
            type="primary"
            :disabled="!$checkPermission('handle_add')"
            size="mini"
            @click="handleAdd(scope.row)"
          >新增</el-button>
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
          <el-button
            v-if="(!scope.row.children)||(scope.row.children.length)==0"
            size="mini"
            :disabled="!$checkPermission('handle_button')"
            @click="handleButton(scope.row)"
          >编辑按钮</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="form.dialogEditTitle"
      :visible.sync="form.dialogEditVisible"
      :close-on-click-modal="false"
      width="65%"
      top="20px"
    >
      <el-form
        ref="dataForm"
        :rules="form.rules"
        :model="form.info"
        label-position="right"
        label-suffix="："
        label-width="100px"
        :style="{width:85+'%'}"
      >
        <el-form-item label="上级菜单" prop="parentGuid" placeholder="上级菜单">
          <select-tree v-model="form.info.parentGuid" :options="selectTree" :props="TreeProp" />
          <!-- <el-input v-model="form.info.parentGuid" placeholder="上级菜单"/> -->
        </el-form-item>
        <el-form-item label="菜单编号" prop="menuCode">
          <el-input v-model="form.info.menuCode" placeholder="请输入菜单编号" />
        </el-form-item>
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="form.info.menuName" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="url" prop="menuUrl">
          <el-input v-model="form.info.menuUrl" placeholder="请输入菜单url" />
        </el-form-item>
        <el-form-item label="排序" :rules="[{ required: true}]">
          <el-input-number v-model="form.info.sort" placeholder="排序" />
        </el-form-item>
        <el-form-item label="图标" :rules="[{ required: true}]">
          <svg-icon :icon-class="form.info.menuClass||'系统'" style="width: 60px;height: 60px;" />
          <el-button size="mini" @click="handleIcons()">选择图标</el-button>
        </el-form-item>
        <el-form-item label="是否启用 " :rules="[{ required: true}]">
          <el-switch v-model="form.info.enable" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button icon="el-icon-close" @click="form.dialogEditVisible = false">关闭</el-button>
        <el-button type="primary" icon="iconfont icon-save" @click="handleSave">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog
      top="20px"
      :visible.sync="form.dialogEditTitle2"
      :title="'图标选择'"
      :close-on-click-modal="false"
      width="65%"
    >
      <Icons :select-icon="handleSelectIcon" />
    </el-dialog>
    <el-dialog
      top="20px"
      :visible.sync="button.dialogEditVisible"
      :title="button.dialogEditTitle"
      :close-on-click-modal="false"
      width="50%"
    >
      <MenuButton :menu-guid="button.menuGuid" />
    </el-dialog>
  </div>
</template>

<script>
import {
  GetMenuTreeAsync,
  UpdateMenuAsync,
  AddMenuAsync,
  DisableEnableMenuAsync,
  DeleteMenuAsync,
  GetRoleListAsyn
} from '@/api/Menu'
import SelectTree from '@/components/SelectTree'
import Icons from '@/views/Commons/svg-icons/index'
import MenuButton from './MenuButton'
export default {
  components: { SelectTree, Icons, MenuButton },
  data() {
    return {
      tree: {
        data: [],
        expandAll: true,
        list: []
      },
      TreeProp: {
        value: 'menuGuid',
        label: 'menuName',
        children: 'children',
        id: 'menuGuid',
        disabled(data, node) {
          return !data.enable
        }
      },
      query: {},
      listLoading: false,
      selectTree: true,
      form: {
        dialogEditVisible: false,
        dialogEditTitle: '添加',
        dialogEditStatus: 'add',
        dialogEditTitle2: false,
        // 表单数据
        info: {
          menuGuid: null,
          parentGuid: null,
          menuClass: null,
          menuName: null,
          menuUrl: null,
          menuCode: null,
          sort: 0,
          enable: true
        },
        // 表单验证
        rules: {
          // parentGuid: [{ required: true, message: "必填", trigger: "change" }],
          menuCode: [
            { required: true, message: '必填', trigger: 'change' },
            { max: 20, message: '长度不能超过20', trigger: 'change' }
          ],
          menuName: [
            { required: true, message: '必填', trigger: 'change' },
            { max: 8, message: '长度不能超过8', trigger: 'change' }
          ],
          menuUrl: [
            { required: true, message: '必填', trigger: 'change' },
            { max: 100, message: '长度不能超过100', trigger: 'change' }
          ]
        }
      },
      button: {
        dialogEditVisible: false,
        dialogEditTitle: '添加',
        menuGuid: null
      }
    }
  },
  watch: {},
  created() {
    this.handleFilter()
    // var list = this.getList(this.$router.options.routes);
    // this.getList(list);
  },
  methods: {
    getList(list) {
      var list2 = []
      var t = this
      if (list && list.length > 0) {
        list.forEach(item => {
          if (item.children && item.children.length == 1) {
            list2.push({
              path: item.children[0].path,
              code: item.children[0].name,
              name: item.children[0].meta
                ? item.children[0].meta.title
                : item.children[0].name,
              icon: item.children[0].meta ? item.children[0].meta.icon : null
            })
          } else {
            list2.push({
              path: item.path,
              code: item.name,
              name: item.meta ? item.meta.title : item.name,
              icon: item.meta ? item.meta.icon : null,
              children: t.getList(item.children)
            })
          }
          AddMenuAsync({
            // menuGuid: null,
            // parentGuid: null,
            menuClass: item.meta ? item.meta.icon : null,
            menuName: item.meta ? item.meta.title : item.name,
            menuUrl: item.path,
            menuCode: item.name,
            sort: 0,
            enable: true
          }).then(response => {
            t.$notify({
              title: '成功',
              message: '添加成功',
              type: 'success',
              duration: 2000
            })
          })
        })
      }
      return list2
    },
    handleFilter() {
      this.listLoading = true
      GetMenuTreeAsync(this.query).then(
        response => {
          console.log(response.data)
          this.tree.list = response.data
          // this.selectTree = [...response.data];
          this.selectTree = JSON.parse(JSON.stringify(response.data))

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
    handleAdd(row) {
      this.form.info = {
        sort: 999,
        enable: true,
        menuGuid: null,
        parentGuid: row.menuGuid
      }
      this.form.dialogEditVisible = true
      this.form.dialogEditStatus = 'add'
      this.form.dialogEditTitle = '添加菜单'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 修改
    handleUpdate(row) {
      this.form.info = {
        menuGuid: row.menuGuid,
        parentGuid: row.parentGuid,
        menuClass: row.menuClass,
        menuName: row.menuName,
        menuUrl: row.menuUrl,
        menuCode: row.menuCode,
        sort: row.sort,
        enable: row.enable
      } // copy obj
      this.form.dialogEditVisible = true
      this.form.dialogEditStatus = 'update'
      this.form.dialogEditTitle = '修改菜单'
    },
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
            AddMenuAsync(tempData).then(response => {
              t.$notify({
                title: '成功',
                message: '添加成功',
                type: 'success',
                duration: 2000
              })
              t.form.dialogEditVisible = false
              t.handleFilter()
            })
          } else {
            UpdateMenuAsync(tempData).then(response => {
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
      DisableEnableMenuAsync({
        guid: row.menuGuid,
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
          DeleteMenuAsync({
            guid: row.menuGuid
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
    handleIcons() {
      this.form.dialogEditTitle2 = true
    },
    handleSelectIcon(className) {
      this.form.info.menuClass = className
      this.form.dialogEditTitle2 = false
    },
    handleButton(row) {
      this.button.menuGuid = row.menuGuid
      this.button.dialogEditVisible = true
      this.button.dialogEditTitle = `【${row.menuName}】按钮管理`
    }
  }
}
</script>
<style>
</style>

