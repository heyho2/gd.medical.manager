<template>
  <Drawer title="绑定用户管理" :dialog-visible.sync="c_dialogVisible" width="1024px" style>
    <template>
      <div class="app-container">
        <el-form :inline="true" :model="query">
          <el-form-item><el-input v-model="query.KeyWord" placeholder="姓名/手机" style="width: 200px;" class="filter-item" /></el-form-item>
          <el-form-item>
            <el-date-picker v-model="date" type="daterange" range-separator="-" start-placeholder="绑定时间" end-placeholder="至" class="filter-item" />
          </el-form-item>
          <el-form-item><el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button></el-form-item>
        </el-form>
        <el-table :data="list" :border="false" fit highlight-current-row>
          <el-table-column align="center" label="序列" width="65">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column label="姓名" align="left">
            <template slot-scope="scope">
              <span>{{ scope.row.userName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="手机号" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.phone }}</span>
            </template>
          </el-table-column>
          <el-table-column label="性别" align="center">
            <template slot-scope="scope">
              {{ scope.row.gender == 'M' ? '男' : '女' }}
            </template>
          </el-table-column>
          <el-table-column label="年龄" align="center">
            <template slot-scope="scope">
              {{ scope.row.age }}
            </template>
          </el-table-column>
          <el-table-column label="绑定时间" align="center">
            <template slot-scope="scope">
              {{ scope.row.bindDate ? formatterDate(scope.row.bindDate) : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="110" align="center">
            <template slot-scope="scope">
              <el-button v-show="scope.row.binded" :disabled="!$checkPermission('handle_view')" type="primary" size="mini" @click="handleView(scope.row)">
                解绑
              </el-button>
              <el-button v-show="!scope.row.binded" :disabled="!$checkPermission('handle_bind')" type="primary" size="mini" @click="handleBind(scope.row)">
                未绑定
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination :total="total" :border="false" :page.sync="query.pageIndex" :limit.sync="query.pageSize" @pagination="handleFilter" />
      </div>
    </template>
  </Drawer>
</template>

<script>
import { GetHealthManagerConsumers, CancelBindHealthManager, BindHealthManager } from '@/api/HealthDocumentation/HealthManager'
import { GetMemberPageAsync } from '@/api/Member'
import { formatCurrency, parseTime } from '@/utils/index'
import Pagination from '@/components/Pagination'
import CountTo from 'vue-count-to'
import Drawer from '@/components/Drawer/Index'
export default {
  components: { Pagination, CountTo, Drawer },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    managerGuid: { type: String }
  },
  data() {
    return {
      date: null,
      query: {
        pageIndex: 1,
        pageSize: 10,
        ManagerGuid: null,
        KeyWord: null,
        BindTime: null
      },
      total: 0,
      list: [],
      listLoading: true,
      form: {
        guid: null,
        dialogEditVisible: false,
        dialogEditTitle: '添加'
      }
    }
  },
  computed: {
    c_dialogVisible: {
      get() {
        return this.dialogVisible
      },
      set(val) {
        this.$emit('update:dialogVisible', val)
      }
    }
  },
  watch: {
    date(val) {
      const t = this
      if (val && val.length > 0) {
        t.query.BindTime = parseTime(val[0], '{y}-{m}-{d}')
        t.query.EndTime = parseTime(val[1], '{y}-{m}-{d}')
      } else {
        t.query.BindTime = null
        t.query.EndTime = null
      }
    },
    dialogVisible(val) {
      if (!val) return
      var t = this
      if (t.managerGuid) {
        this.query.managerGuid = t.managerGuid
        this.handleFilter()
      }
    }
  },
  created() {
    // this.handleFilter()
  },
  methods: {
    handleFilter() {
      this.listLoading = true
      GetHealthManagerConsumers(this.query)
        .then(response => {
          response.data.currentPage.map(a => {
            return (a.binded = true)
          })
          this.list = response.data.currentPage
          // console.log(this.list)
          this.total = response.data.total
        })
        .catch()
    },
    handleSearch() {
      const t = this
      t.query.pageIndex = 1
      t.handleFilter()
    },
    // 查看
    handleView(row) {
      // consumerGuid
      CancelBindHealthManager({
        consumerGuid: row.consumerGuid
      })
        .then(res => {
          console.log(res)
          if (res.data) {
            row.binded = !row.binded
          }
        })
        .catch()
    },
    handleBind(row) {
      BindHealthManager({
        managerGuid: this.managerGuid,
        consumerGuid: row.consumerGuid
      })
        .then(res => {
          if (res.data) {
            row.binded = !row.binded
          }
        })
        .catch()
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
.filter-item {
	margin-bottom: 10px;
}
</style>
