<template>
  <div class="app-container">
    <el-form :inline="true" :model="query">
      <el-form-item>
        <el-input
          v-model="query.name"
          placeholder="医生名字"
          style="width: 200px;"
          class="filter-item"
          @keyup.enter.native="handleSearch"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="query.phone"
          placeholder="手机号码"
          style="width: 200px;"
          class="filter-item"
          @keyup.enter.native="handleSearch"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="date"
          type="daterange"
          range-separator="-"
          start-placeholder="注册时间"
          end-placeholder="至"
          class="filter-item"
        />
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      </el-form-item>
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
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-tabs tab-position="top">
            <el-tab-pane label="积分详细信息">
              <IntegralInfo :guid="scope.row.doctorGuid" />
            </el-tab-pane>
          </el-tabs>
        </template>
      </el-table-column>
      <el-table-column align="center" label="序列" width="65">
        <template slot-scope="scope">{{ scope.$index+1 }}</template>
      </el-table-column>
      <el-table-column label="医生名字" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机" width="120" align="center">
        <template slot-scope="scope">{{ scope.row.phone }}</template>
      </el-table-column>
      <el-table-column label="医院" mix-width="110" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.hospitalName||"暂无" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所在科室" mix-width="110" align="left">
        <template slot-scope="scope">{{ scope.row.officeName||"暂无" }}</template>
      </el-table-column>

      <el-table-column label="总积分" width="110" align="right">
        <template slot-scope="scope">{{ scope.row.totalPoints }}</template>
      </el-table-column>
      <el-table-column label="积分收入" width="110" align="right">
        <template slot-scope="scope">{{ scope.row.earnPoints }}</template>
      </el-table-column>
      <el-table-column label="积分支出" width="110" align="right">
        <template slot-scope="scope">{{ scope.row.usePoints }}</template>
      </el-table-column>
      <el-table-column label="注册时间" width="160" align="center">
        <template slot-scope="scope">{{ toDateString( scope.row.creationDate) }}</template>
      </el-table-column>
      <!-- <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope"></template>
      </el-table-column>-->
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
  GetDoctorIntegralPageAsync,
  ExportDoctorIntegralAsync
} from '@/api/Doctor'

import { parseTime } from '@/utils/index'
import Pagination from '@/components/Pagination'
import IntegralInfo from './Components/IntegralInfo'
export default {
  components: { Pagination, IntegralInfo },
  data() {
    return {
      date: [],
      query: {
        name: null,
        phone: null,
        beginDate: null,
        endDate: null,
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
      listLoading: true
    }
  },
  watch: {
    date(val) {
      const t = this
      if (val && val.length > 0) {
        t.query.beginDate = parseTime(val[0], '{y}-{m}-{d}')
        t.query.endDate = parseTime(val[1], '{y}-{m}-{d}')
      } else {
        t.query.beginDate = null
        t.query.endDate = null
      }
    }
  },
  created() {
    this.handleFilter()
  },
  methods: {
    // 加载表格数据
    handleFilter() {
      this.listLoading = true
      GetDoctorIntegralPageAsync(this.query).then(
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
    // 搜索
    handleSearch() {
      this.query.pageIndex = 1
      this.handleFilter()
    },
    toDateString(a, f) {
      return parseTime(new Date(a), f)
    },
    handleDownload() {
      ExportDoctorIntegralAsync(this.query).then(response => {
        if (response.data.items.length == 0) {
          return this.$message({
            type: 'info',
            message: '没有数据导出'
          })
        }
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = [
            '医生名字',
            '手机',
            '医院',
            '所在科室',
            '总积分',
            '积分收入',
            '积分支出',
            '注册时间'
          ]
          const filterVal = [
            'userName',
            'phone',
            'hospitalName',
            'officeName',
            'totalPoints',
            'earnPoints',
            'usePoints',
            'creationDate'
          ]
          const data = this.formatJson(filterVal, response.data.items)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '医生积分',
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
          } else {
            return v[j]
          }
        })
      )
    }
  }
}
</script>
