<template>
  <div class="app-container">
    <el-form :inline="true" :model="query">
      <el-form-item>
        <el-input
          v-model="query.account"
          placeholder="账号"
          style="width: 200px;"
          class="filter-item"
        />
      </el-form-item>
      <el-form-item>
        <el-input v-model="query.phone" placeholder="手机" style="width: 200px;" class="filter-item" />
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
        >添加账号</el-button>
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
      <el-table-column label="姓名" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账号（工号）" min-width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.account }}</span>
        </template>
      </el-table-column>

      <el-table-column label="手机号" min-width="110" align="center">
        <template slot-scope="scope">{{ scope.row.phone }}</template>
      </el-table-column>
      <el-table-column label="邮箱" min-width="150" align="left">
        <template slot-scope="scope">{{ scope.row.email }}</template>
      </el-table-column>
      <el-table-column label="性别" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.gender=="M"?"男":"女" }}</template>
      </el-table-column>
      <el-table-column label="部门" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.organizationName }}</template>
      </el-table-column>
      <el-table-column label="创建时间" width="160" align="center">
        <template slot-scope="scope">{{ toDateString(scope.row.creationDate) }}</template>
      </el-table-column>
      <el-table-column label="允许登录?" width="110" align="center">
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
          <!-- <el-button @click="handleView(scope.row)" type="text" size="small">查看</el-button> -->
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
      width="90%"
      append-to-body
      top="20px"
    >
      <el-form
        ref="dataForm"
        :rules="form.rules"
        :model="form.info"
        label-position="right"
        label-suffix="："
        label-width="120px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="账号（工号）" prop="account">
              <el-input v-model="form.info.account" placeholder="请输入账号（工号）" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密码" prop="password">
              <el-input v-model="form.info.password" type="password" placeholder="密码最小6为最大18" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="角色" prop="roles" style="width:100%">
              <el-select
                v-model="form.info.roles"
                multiple
                placeholder="请选择角色"
                prop="roles"
                style="width:100%"
              >
                <el-option
                  v-for="item in RoleList"
                  :key="item.roleGuid"
                  :label="item.roleName"
                  :value="item.roleGuid"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门" prop="organizationGuid">
              <select-tree
                v-model="form.info.organizationGuid"
                :options="OrganizationTree"
                placeholder="请选择部门"
                :props="{value: 'orgGuid',label: 'orgName',parent: 'parentGuid',children: 'children'}"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="姓名" prop="userName">
              <el-input v-model="form.info.userName" placeholder="姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别">
              <el-radio-group v-model="form.info.gender">
                <el-radio label="M">男</el-radio>
                <el-radio label="F">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="手机" prop="phone">
              <el-input v-model="form.info.phone" placeholder="手机" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生日">
              <el-date-picker
                v-model="form.info.birthday"
                type="date"
                placeholder="选择日期"
                style="width:100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="微信" placeholder="手机">
              <el-input v-model="form.info.wechatOpenid" placeholder="微信">
                <i slot="suffix" class="iconfont icon-weixin" />
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱">
              <el-input v-model="form.info.email" placeholder="邮箱" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="超级管理员">
              <el-switch
                v-model="form.info.isSuper"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="允许登录">
              <el-switch v-model="form.info.enable" active-color="#13ce66" inactive-color="#ff4949" />
            </el-form-item>
          </el-col>
        </el-row>
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
  GetAccountListAsync,
  GetAccountInfoAsync,
  AddAccountAsync,
  UpdateAccountAsync,
  DisableEnableAccountAsync,
  GetOrganizationTreeAsync,
  GetRoleListAsync
} from '@/api/User'
import { parseTime } from '@/utils/index'
import Pagination from '@/components/Pagination'
import SelectTree from '@/components/SelectTree'
import { md5 } from '@/utils/md5'
import {
  validatPhone,
  validatCardNo,
  validatRegName,
  validatPassword
} from '@/utils/validate'
export default {
  components: { Pagination, SelectTree },
  data() {
    return {
      query: {
        pageIndex: 1,
        pageSize: 20,
        account: null,
        phone: null,
        SortField: 'sort',
        IsAscending: false
      },
      password1: null,
      total: 0,
      list: [],
      listLoading: true,
      OrganizationTree: [],
      RoleList: [],
      form: {
        dialogEditVisible: false,
        dialogEditTitle: '添加',
        dialogEditStatus: 'add',
        // 表单数据
        info: {
          account: null,
          password: null,
          password1: null,
          organizationGuid: null,
          isSuper: false,
          email: null,
          wechatOpenid: null,
          nickName: null,
          userName: null,
          phone: null,
          gender: 'M',
          birthday: null,
          portraitGuid: null,
          enable: true,
          roles: null
        },
        // 表单验证
        rules: {
          account: [
            { required: true, message: '账号必填', trigger: 'change' },
            { max: 12, message: '不能超过12个字符', trigger: 'change' }
          ],
          password: [
            { required: true, message: '密码必填', trigger: 'change' },
            { max: 18, min: 6, message: '密码格式不正确', trigger: 'change' }
          ],
          organizationGuid: [
            { required: true, message: '请选择组织架构', trigger: 'change' }
          ],
          roles: [{ required: true, message: '请选角色', trigger: 'change' }],
          userName: [
            { required: true, message: '用户名必填', trigger: 'change' },
            { max: 8, message: '不能超过8个字符', trigger: 'change' }
          ],
          phone: [
            { required: true, message: '手机必填', trigger: 'change' },
            { trigger: 'blur', validator: validatPhone }
          ]
        }
      }
    }
  },
  watch: {},
  created() {
    this.handleFilter()
    this.GetOrganizationTree()
    this.GetRoleList()
  },
  methods: {
    GetOrganizationTree() {
      var t = this
      GetOrganizationTreeAsync({
        SortField: 'sort',
        IsAscending: false,
        enable: true
      }).then(response => {
        t.OrganizationTree = response.data
      })
    },
    GetRoleList() {
      var t = this
      GetRoleListAsync({
        SortField: 'sort',
        IsAscending: false,
        enable: true
      }).then(response => {
        t.RoleList = response.data
      })
    },
    GetAccountInfo(userID) {
      var t = this
      return GetAccountInfoAsync({
        userID
      }).then(response => {
        t.form.info = response.data
        this.$set(t.form.info, 'password', '-----------')
      })
    },
    // 加载表格数据
    handleFilter() {
      this.listLoading = true
      GetAccountListAsync(this.query).then(
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
      this.form.info = { gender: 'M', isSuper: false, enable: true, roles: [] }
      this.form.dialogEditVisible = true
      this.form.dialogEditStatus = 'add'
      this.form.dialogEditTitle = '添加账号'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 修改
    handleUpdate(row) {
      this.GetAccountInfo(row.userGuid).then(response => {
        this.form.dialogEditVisible = true
        this.form.dialogEditStatus = 'update'
        this.form.dialogEditTitle = '修改账号'
      })
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
            tempData.password = md5(tempData.password).toUpperCase()
            AddAccountAsync(tempData).then(response => {
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
            if (tempData.password == '-----------') {
              tempData.password = null
            } else {
              tempData.password = md5(tempData.password).toUpperCase()
            }

            UpdateAccountAsync(tempData).then(response => {
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
      DisableEnableAccountAsync({
        userGuid: row.userGuid,
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

