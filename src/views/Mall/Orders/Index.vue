<template>
  <div class="app-container">
    <el-form :inline="true" :model="query">
      <el-form-item>
        <el-input
          v-model="query.keyword"
          :maxlength="11"
          placeholder="请输入手机/昵称"
          clearable
          type="text"
        />
      </el-form-item>

      <el-form-item>
        <el-input
          v-model="query.orderNo"
          :maxlength="30"
          clearable
          type="text"
          placeholder="请输入订单编号"
        />
      </el-form-item>

      <el-form-item>
        <el-select v-model="query.orderStatus" clearable placeholder="请选择">
          <el-option
            v-for="item in Object.keys(orderStatics)"
            :key="item"
            :label="orderStatics[item]"
            :value="item"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-date-picker
          v-model="date"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          value-format="yyyy-MM-dd"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item" type="info" icon="el-icon-refresh" @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="grid.listLoading"
      :data="grid.list"
      element-loading-text="Loading"
      fit
      highlight-current-row
      :border="false"
    >
      <el-table-column type="expand">
        <template slot-scope="scope">
          <OrderDropDown :row="scope.row" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="序列" width="55" type="index" />
      <el-table-column label="订单编号" align="center" width="230">
        <template slot-scope="scope">{{ scope.row.orderNo }}</template>
      </el-table-column>
      <el-table-column label="门店名称" align="left" min-width="230">
        <template slot-scope="scope">{{ scope.row.merchantName }}</template>
      </el-table-column>
      <el-table-column label="用户名" align="center" min-width="100">
        <template slot-scope="scope">{{ scope.row.nickName }}</template>
      </el-table-column>
      <el-table-column label="电话" align="center" min-width="100">
        <template slot-scope="scope">{{ scope.row.phone }}</template>
      </el-table-column>
      <el-table-column label="下单时间" width="150" align="center">
        <template slot-scope="scope">{{ formatterDate(scope.row.creationDate) }}</template>
      </el-table-column>
      <el-table-column label="订单实付金额" width="110" align="right">
        <template slot-scope="scope">{{ formatterMoney(scope.row.paidAmount) }}</template>
      </el-table-column>
      <el-table-column label="订单状态" align="center" min-width="80">
        <template slot-scope="scope">{{ orderStatics[scope.row.orderStatus] }}</template>
      </el-table-column>
      <!-- <el-table-column label="优惠券" width="260" align="left">
        <template slot-scope="scope">
          <div v-if="scope.row.orderCoupons.length==0">{{`无`}}</div>
          <div v-else v-for="item in scope.row.orderCoupons" :key="item">{{item}}</div>
        </template>
      </el-table-column>-->
    </el-table>
    <pagination
      :total="grid.total"
      :page.sync="query.pageIndex"
      :limit.sync="query.pageSize"
      :border="false"
      @pagination="handleFilter"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import {
  GetMerchantOrderPageListAsync
  // GetOrderDetailPageAsync,
  // GetOrderPageAsync,
  // GetOrderInfoAsync
} from '@/api/Order'
import { formatCurrency, parseTime } from '@/utils/index'
import OrderDropDown from './Components/OrderDropDown'
export default {
  components: { Pagination, OrderDropDown },
  data() {
    return {
      date: null,
      query: {
        keyword: null,
        orderNo: null, // 订单编号
        orderStatus: null,
        beginDate: null,
        endDate: null,
        pageIndex: 1,
        pageSize: 10
      },
      orderStatics: {
        OffLinePay: '线下付款',
        Obligation: '待付款',
        Shipped: '待发货',
        Received: '待收货',
        Completed: '已完成',
        Canceled: '已取消',
        Closed: '关闭'
      },
      grid: {
        total: 0,
        list: [],
        listLoading: false
      },
      form: {
        guid: null,
        dialogEditVisible: false,
        dialogEditTitle: '添加'
      },
      payTypes: [
        { code: 'Card', name: '刷卡' },
        { code: 'Cash', name: '现金' },
        { code: 'Apple', name: '苹果支付' },
        { code: 'Score', name: '积分' },
        { code: 'Wechat', name: '微信' },
        { code: 'Alipay', name: '支付宝' }
      ],
      merchantList: []
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
    const date = new Date()
    const date2 = new Date()
    date2.setMonth(date2.getMonth() + 1)
    this.date = [date, date2]
  },
  methods: {
    // /查询
    handleFilter() {
      this.grid.listLoading = true
      GetMerchantOrderPageListAsync(this.query).then(
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
    handleReset() {
      Object.assign(this.query, {
        keyword: null,
        orderNo: null, // 订单编号
        orderStatus: null
      })
      const date = new Date()
      const date2 = new Date()
      date2.setMonth(date2.getMonth() + 1)
      this.date = [date, date2]
    },
    handleSearch() {
      this.query.pageIndex = 1
      this.handleFilter()
    },
    getTypeName(code) {
      let name
      this.payTypes.forEach(element => {
        if (element.code.toUpperCase() == code.toUpperCase()) { name = element.name }
      })
      return name
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

