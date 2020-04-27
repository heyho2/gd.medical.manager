<template>
  <div>
    <el-form :inline="true" :model="query">
      <el-form-item>
        <el-button
          v-permission="'handle_export'"
          class="filter-item"
          type
          icon="el-icon-printer"
          @click="handleDownload"
        >导出</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" border fit highlight-current-row>
      <el-table-column align="center" label="序列" width="65">
        <template slot-scope="scope">{{ scope.$index+1 }}</template>
      </el-table-column>
      <el-table-column label="日期" width="160" align="center">
        <template slot-scope="scope">{{ toDateString( scope.row.creationDate) }}</template>
      </el-table-column>
      <el-table-column label="积分来源" mix-width="110" align="left">
        <template slot-scope="scope">{{ scope.row.reason||"暂无" }}</template>
      </el-table-column>
      <el-table-column label="积分收入" width="110" align="right">
        <template slot-scope="scope">{{ scope.row.variation>0?scope.row.variation:0 }}</template>
      </el-table-column>
      <el-table-column label="积分支出" width="110" align="right">
        <template slot-scope="scope">{{ (0>scope.row.variation)?scope.row.variation:0 }}</template>
      </el-table-column>
      <el-table-column label="积分状态" width="110" align="center">
        <template slot-scope="scope">{{ scope.index>=0? '已到账':"已到账" }}</template>
      </el-table-column>
    </el-table>
    <pagination
      :total="total"
      :page.sync="query.pageIndex"
      :limit.sync="query.pageSize"
      @pagination="handleFilter"
    />
  </div>
</template>

<script>
import {
  GetIntegralInfoPageAsync,
  ExportIntegralInfoAsync
} from '@/api/Doctor'

import { parseTime } from '@/utils/index'
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  props: {
    guid: { type: String }
  },
  data() {
    return {
      query: {
        userGuid: this.guid,
        sortField: null,
        isAscending: true,
        pageIndex: 1,
        pageSize: 20
      },
      hospitalGuid: null,
      hospitalList: [],
      officeList: [],
      total: 0,
      list: [],
      listLoading: false
    }
  },
  watch: {
    guid(val) {
      this.query.userGuid = val
      this.handleFilter()
    }
  },
  created() {
    if (this.guid) {
      this.handleFilter()
    }
  },
  methods: {
    // 加载表格数据
    handleFilter() {
      GetIntegralInfoPageAsync(this.query).then(response => {
        this.list = response.data.currentPage
        this.total = response.data.total
      })
    },
    // 搜索
    handleSearch() {
      this.query.pageIndex = 1
      this.handleFilter()
    },
    toDateString(a, f) {
      return parseTime(new Date(a), f)
    },
    handleDownload() {
      ExportIntegralInfoAsync(this.query).then(response => {
        if (response.data.items.length == 0) {
          return this.$message({
            type: 'info',
            message: '没有数据导出'
          })
        }
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = [
            '日期',
            '积分来源',
            '积分收入',
            '积分支出',
            '积分状态'
          ]
          const filterVal = [
            'creationDate',
            'reason',
            'variation',
            'variation1',
            'ssss'
          ]
          const data = this.formatJson(filterVal, response.data.items)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '积分详细',
            autoWidth: true,
            bookType: 'xlsx'
          })
          this.downloadLoading = false
        })
      })
    },
    formatJson(filterVal, jsonData) {
      var t = this
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === 'creationDate') {
            return t.toDateString(v[j])
          }
          if (j === 'variation') {
            return v[j] > 0 ? v[j] : 0
          }
          if (j === 'variation') {
            return v[j] < 0 ? v[j] : 0
          }
          if (j === 'ssss') {
            return '已到账'
          } else {
            return v[j]
          }
        })
      )
    }
  }
}
</script>
