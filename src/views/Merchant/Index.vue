<template>
  <div class="app-container">
    <el-form :inline="true" :model="query">
      <el-form-item>
        <el-input
          v-model="query.name"
          placeholder="商户名称"
          style="width: 200px;"
          class="filter-item"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-select v-model="query.scope" clearable placeholder="请选择经营范围">
          <el-option
            v-for="item in scopeList"
            :key="item.guid"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="date"
          type="daterange"
          range-separator="-"
          start-placeholder="注册时间"
          end-placeholder="至"
          class="filter-item"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button
          class="filter-item"
          type="primary"
          :loading="listLoading"
          icon="el-icon-search"
          @click="handleSearch"
        >搜索</el-button>
        <!-- v-permission="'handle_add'" -->
      </el-form-item>
      <el-form-item>
        <el-button
          v-permission="'handle_add'"
          class="filter-item"
          type
          icon="el-icon-circle-plus"
          @click="handleAdd"
        >添加商户</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="list"
      fit
      highlight-current-row
      :row-class-name="tableRowClassName"
    >
      <el-table-column label="序列" type="index" width="60" align="center" />
      <el-table-column label="商户名字" width="180" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.merchantName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系电话" width="120" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.telephone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账号" width="120" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.account }}</span>
        </template>
      </el-table-column>
      <el-table-column label="医院名称" width="180" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.hosName||`暂不关联` }}</span>
        </template>
      </el-table-column>
      <el-table-column label="经营范围" min-width="380" align="left">
        <template slot-scope="scope">
          <labels :list="getScopes(scope.row.scope)" />
        </template>
      </el-table-column>

      <el-table-column label="注册时间" width="160" align="center">
        <template slot-scope="scope">{{ toDateString( scope.row.creationDate) }}</template>
      </el-table-column>
      <el-table-column label="是否上线" align="center" width="80">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enable"
            :disabled="!$checkPermission('handle_update')"
            @change="handleDisable(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160" align="center">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            :disabled="!$checkPermission('handle_view')"
            @click="handleView(scope.row)"
          >查看</el-button>
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
      :border="false"
      @pagination="handleFilter"
    />
    <merchant-view :dialog-visible.sync="form.dialogEditVisible" :info="form.info" />
    <MerchantEdit
      :dialog-visible.sync="edit.dialogEditVisible"
      :merchant-guid="edit.merchantGuid"
      :dialog-title="edit.title"
      :on-success="onSuccessEdit"
    />
  </div>
</template>

<script>
import {
  GetMerchantPageAsync,
  GetBusinessScopeListAsync,
  DisableEnableMerchantAsync
} from '@/api/Merchant'
import Pagination from '@/components/Pagination'
import MerchantView from './MerchantView'
import { parseTime } from '@/utils/index'
import Labels from '@/views/Commons/Labels'
import CountTo from 'vue-count-to'
import MerchantEdit from './MerchantEdit'
export default {
  components: {
    Pagination,
    MerchantView,
    Labels,
    CountTo,
    MerchantEdit
  },
  data() {
    return {
      query: {
        pageIndex: 1,
        pageSize: 10,
        beginDate: null,
        beginDate: null,
        name: null,
        scope: null
      },
      date: [],
      scopeList: [],
      total: 0,
      list: [],
      listLoading: true,
      type: null,
      form: {
        dialogEditVisible: false,
        // 表单数据
        info: {
          enable: 1
        }
      },
      edit: {
        dialogEditVisible: false,
        merchantGuid: null,
        title: null
      }
    }
  },
  watch: {
    date(val) {
      const t = this
      if (t.date && t.date.length > 0) {
        t.query.beginDate = parseTime(t.date[0], '{y}-{m}-{d}')
        t.query.endDate = parseTime(t.date[1], '{y}-{m}-{d}')
      } else {
        t.query.beginDate = null
        t.query.endDate = null
      }
    }
  },
  created() {
    this.handleFilter()
    GetBusinessScopeListAsync(null).then(response => {
      this.scopeList = response.data
    })
  },
  methods: {
    // 加载表格数据
    handleFilter() {
      this.listLoading = true
      GetMerchantPageAsync(this.query).then(
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
    // 查看
    handleView(row) {
      this.form.info = Object.assign({}, row) // copy obj
      this.form.dialogEditVisible = true
    },
    handleAdd() {
      this.edit.dialogEditVisible = true
      this.edit.merchantGuid = null
      this.edit.title = '添加商户'
    },
    handleUpdate(row) {
      this.edit.dialogEditVisible = true
      this.edit.merchantGuid = row.merchantGuid
      this.edit.title = '修改商户'
    },
    // 搜索
    handleSearch() {
      this.query.pageIndex = 1
      this.handleFilter()
    },
    // 禁用/启用
    handleDisable(row) {
      var t = this
      DisableEnableMerchantAsync({
        guid: row.merchantGuid,
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
    toDateString(a, f) {
      return parseTime(new Date(a), f)
    },
    getScopes(scope) {
      let scopes = []
      if (scope) {
        scopes = scope.split(',')
      }
      return scopes
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.enable === false) {
        return 'disable-row'
      }
      return ''
    },
    onSuccessEdit() {
      this.handleFilter()
    }
  }
}
</script>
<style>
