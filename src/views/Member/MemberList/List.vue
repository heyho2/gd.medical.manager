<template>
  <div class="app-container">
    <el-form :inline="true" :model="query">
      <el-form-item>
        <el-input v-model="query.phone" placeholder="手机" style="width: 200px;" class="filter-item" />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="query.name"
          placeholder="姓名/昵称"
          style="width: 200px;"
          class="filter-item"
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
      <!-- <el-form-item>
        <el-select
          placeholder="会员等级"
          v-model="query.Keyword"
          style="width: 200px;"
          class="filter-item"
        >
          <el-option key="高级会员" value="高级会员"/>
          <el-option key="普通会员" value="普通会员"/>
        </el-select>
      </el-form-item>-->
      <el-form-item>
        <el-button
          class="filter-item"
          :loading="listLoading"
          type="primary"
          icon="el-icon-search"
          @click="handleSearch"
        >搜索</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" :border="false" fit highlight-current-row>
      <el-table-column align="center" label="序列" width="65">
        <template slot-scope="scope">{{ scope.$index+1 }}</template>
      </el-table-column>
      <el-table-column label="会员名" min-width="110" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.nickName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>

      <el-table-column label="性别" width="60" align="center">
        <template slot-scope="scope">{{ scope.row.gender=="M"?"男":"女" }}</template>
      </el-table-column>
      <el-table-column label="生日" width="110" align="center">
        <template slot-scope="scope">{{ formatterDate(scope.row.birthday,'{y}-{m}-{d}') }}</template>
      </el-table-column>
      <!-- <el-table-column label="会员等级">
        <template slot-scope="scope">{{ scope.row.pageviews }}</template>
      </el-table-column>-->
      <el-table-column label="消费金额" width="150" align="right">
        <template slot-scope="scope">
          <count-to
            :start-val="0"
            :end-val="scope.row.orderTotalAmount"
            :duration="2000"
            :decimals="2"
            separator=","
            prefix="￥"
            style="color: #F6416C;"
          />
        </template>
      </el-table-column>
      <el-table-column label="订单均价" width="150" align="right">
        <template slot-scope="scope">
          <count-to
            :start-val="0"
            :end-val="scope.row.orderAverage"
            :duration="2000"
            :decimals="2"
            separator=","
            prefix="￥"
            style="color: #F6416C;"
          />
        </template>
      </el-table-column>
      <el-table-column label="消费次数" width="80" align="right">
        <template slot-scope="scope">{{ scope.row.orderQty }}</template>
      </el-table-column>
      <el-table-column label="积分" width="80" align="right">
        <template slot-scope="scope">{{ scope.row.variation }}</template>
      </el-table-column>

      <el-table-column label="最近购买时间" width="160" align="center">
        <template
          slot-scope="scope"
        >{{ scope.row.lastBuyDate? formatterDate(scope.row.lastBuyDate) :"-" }}</template>
      </el-table-column>
      <el-table-column label="操作" width="110" align="center">
        <template slot-scope="scope">
          <el-button
            :disabled="!$checkPermission('handle_view')"
            type="primary"
            size="mini"
            @click="handleView(scope.row)"
          >查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total="total"
      :border="false"
      :page.sync="query.pageIndex"
      :limit.sync="query.pageSize"
      @pagination="handleFilter"
    />
    <ViewMember
      :dialog-visible.sync="form.dialogEditVisible"
      :dialog-title="form.dialogEditTitle"
      :guid="form.guid"
      :variation="form.variation"
    />
  </div>
</template>

<script>
import { GetMemberPageAsync } from '@/api/Member'
import { formatCurrency, parseTime } from '@/utils/index'
import Pagination from '@/components/Pagination'
import ViewMember from './ViewMember'
import CountTo from 'vue-count-to'
export default {
  components: { Pagination, ViewMember, CountTo },
  data() {
    return {
      date: null,
      query: {
        pageIndex: 1,
        pageSize: 20,
        name: null,
        endDate: null,
        beginDate: null
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
    handleFilter() {
      this.listLoading = true
      GetMemberPageAsync(this.query).then(
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
    handleSearch() {
      const t = this
      t.query.pageIndex = 1
      t.handleFilter()
    },
    // 查看
    handleView(row) {
      this.form.dialogEditVisible = true
      this.form.dialogEditTitle = '查看'
      this.form.guid = row.userGuid
      this.form.variation = row.variation
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

