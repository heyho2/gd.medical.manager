<template>
  <div>
    <el-table
      v-loading="grid.listLoading"
      :data="grid.list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column type="expand" />
      <el-table-column align="center" label="序列" width="65">
        <template slot-scope="scope">{{ scope.$index+1 }}</template>
      </el-table-column>
      <el-table-column label="发送者" align="center" width="230">
        <template slot-scope="scope">{{ scope.row.fromName }}</template>
      </el-table-column>
      <el-table-column label="接收者" align="center" width="230">
        <template slot-scope="scope">{{ scope.row.toName }}</template>
      </el-table-column>
      <el-table-column label="时间" width="160" align="center">
        <template slot-scope="scope">{{ formatterDate(scope.row.creationDate) }}</template>
      </el-table-column>
      <el-table-column label="消息" align="left">
        <template slot-scope="scope">
          <div v-html="scope.row.context" />
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total="grid.total"
      :page.sync="query.pageIndex"
      :limit.sync="query.pageSize"
      @pagination="handleFilter"
    />
  </div>
</template>
<script>
import { TopicMessageAsync } from '@/api/Doctor'
import { formatCurrency, parseTime } from '@/utils/index'
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  props: {
    guid: { type: String }
  },
  data() {
    return {
      query: {
        topicGuid: this.guid,
        pageIndex: 1,
        pageSize: 10
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
      this.query.topicGuid = val
      this.handleFilter()
    }
  },
  created() {
    if (this.guid) {
      this.handleFilter()
    }
  },
  methods: {
    // /查询
    handleFilter() {
      this.grid.listLoading = true
      TopicMessageAsync(this.query).then(
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

