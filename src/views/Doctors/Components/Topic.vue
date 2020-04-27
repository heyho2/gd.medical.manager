<template>
  <div>
    <el-form :inline="true" :model="query">
      <el-form-item>
        <el-radio-group v-model="days" @change="handleSearch">
          <el-radio-button :label="1">近一天</el-radio-button>
          <el-radio-button :label="3">近三天</el-radio-button>
          <el-radio-button :label="7">近七天</el-radio-button>
          <el-radio-button :label="30">近一个月</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="date"
          type="daterange"
          range-separator="-"
          start-placeholder="注册时间"
          end-placeholder="至"
          @change="handleSearch"
        />
      </el-form-item>
    </el-form>
    <el-table v-loading="grid.listLoading" :data="grid.list" border fit highlight-current-row>
      <el-table-column type="expand">
        <template slot-scope="scope">
          <message :guid="scope.row.topicGuid" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="序列" type="index" width="65" />
      <el-table-column label="咨询者" align="center" width="230">
        <template slot-scope="scope">{{ scope.row.consultants }}</template>
      </el-table-column>
      <el-table-column label="咨询时间" width="160" align="center">
        <template slot-scope="scope">{{ formatterDate(scope.row.creationDate) }}</template>
      </el-table-column>
      <el-table-column label="咨询问题" align="left">
        <template slot-scope="scope">
          <div v-html="scope.row.lastMessage" />
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-if="grid.total>0"
      :total="grid.total"
      :page.sync="query.pageIndex"
      :limit.sync="query.pageSize"
      @pagination="handleFilter"
    />
  </div>
</template>
<script>
import { GetDoctorTopicAsync } from '@/api/Doctor'
import { formatCurrency, parseTime } from '@/utils/index'
import Pagination from '@/components/Pagination'
import Message from './Message'

export default {
  components: { Pagination, Message },
  props: {
    guid: { type: String }
  },
  data() {
    return {
      days: 30,
      date: [],
      query: {
        doctorGuid: this.guid,
        pageIndex: 1,
        pageSize: 10,
        beginDate: null,
        endDate: null,
        days: null
      },
      grid: {
        listLoading: false,
        list: [],
        total: 0
      }
    }
  },
  watch: {
    guid(val) {
      if (!val) return
      this.query.doctorGuid = val
      this.handleFilter()
    },
    date(val) {
      const t = this
      if (val && val.length > 0) {
        t.query.beginDate = parseTime(val[0], '{y}-{m}-{d}')
        t.query.endDate = parseTime(val[1], '{y}-{m}-{d}')
      } else {
        t.query.beginDate = null
        t.query.endDate = null
      }
    },
    days(val) {
      var startdate = new Date()
      startdate.setDate(startdate.getDate() - val)
      this.date = [startdate, new Date()]
      console.log(this.date)
    }
  },
  created() {
    if (!this.guid) return
    var startdate = new Date()
    startdate.setDate(startdate.getDate() - this.days)
    this.date = [startdate, new Date()]
    this.handleFilter()
  },
  methods: {
    // /查询
    handleFilter() {
      this.grid.listLoading = true
      GetDoctorTopicAsync(this.query).then(
        response => {
          this.grid.list = response.data.currentPage
          this.grid.total = response.data.total
          setTimeout(() => {
            this.grid.listLoading = false
          }, 200)
        },
        err => {
          this.grid.listLoading = false
        }
      )
    },
    handleSearch() {
      this.query.pageIndex = 1
      this.handleFilter()
    },
    formatterDate(val, f) {
      return parseTime(new Date(val), f)
    },
    formatterMoney(val) {
      return formatCurrency(val)
    }
  }
}
</script>
<style>
</style>

