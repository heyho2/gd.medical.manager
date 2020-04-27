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
      <el-table-column type="expand">
        <template slot-scope="scope">
          <order-detail-list :guid="scope.row.orderGuid" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="序列" width="65">
        <template slot-scope="scope">{{ scope.$index+1 }}</template>
      </el-table-column>
      <el-table-column label="订单编号" align="center" width="230">
        <template slot-scope="scope">{{ scope.row.orderNo }}</template>
      </el-table-column>
      <el-table-column label="商户名称" align="left" min-width="120">
        <template slot-scope="scope">
          <span class="beyond-hiding" :title="scope.row.merchantName">{{ scope.row.merchantName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收货地址" align="left" min-width="120">
        <template slot-scope="scope">
          <span class="beyond-hiding" :title="scope.row.orderAddress">{{ scope.row.orderAddress }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" align="center" width="130">
        <template
          slot-scope="scope"
        >{{ (orderStatuss.first(a=>a.code == scope.row.orderStatus) ||{}).name}}</template>
      </el-table-column>
      <el-table-column label="支付方式" align="center" width="130">
        <template slot-scope="scope">{{ getTypeName(scope.row.payType) }}</template>
      </el-table-column>
      <el-table-column label="下单时间" width="160" align="center">
        <template slot-scope="scope">{{formatterDate(scope.row.creationDate) }}</template>
      </el-table-column>
      <el-table-column label="付款日期" width="160" align="center">
        <template
          slot-scope="scope"
        >{{scope.row.paymentDate?formatterDate( scope.row.paymentDate):"-" }}</template>
      </el-table-column>
      <el-table-column label="订单实付金额" width="110" align="right">
        <template slot-scope="scope">{{ formatterMoney(scope.row.paidAmount) }}</template>
      </el-table-column>
      <el-table-column label="尾款" width="110" align="right">
        <template slot-scope="scope">{{formatterMoney(scope.row.debt) }}</template>
      </el-table-column>
      <el-table-column label="使用优惠券？" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.debt||"否" }}</template>
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
import { GetMemberOrderPageAsync } from "@/api/Member";
import { formatCurrency, parseTime } from "@/utils/index";
import CountTo from "vue-count-to";
import OrderDetailList from "./OrderDetailList";
import Pagination from "@/components/Pagination";
import "@/utils/linq";

export default {
  components: { CountTo, Pagination, OrderDetailList },
  props: {
    guid: { type: String }
  },

  watch: {
    guid(val) {
      this.query.userGuid = val;
      this.handleFilter();
    }
  },
  data() {
    return {
      query: {
        userGuid: this.guid,
        pageIndex: 1,
        pageSize: 10
      },
      grid: {
        listLoading: false,
        list: [],
        total: 0
      },
      payTypes: [
        { code: "Card", name: "刷卡" },
        { code: "Cash", name: "现金" },
        { code: "Apple", name: "苹果支付" },
        { code: "Score", name: "积分" },
        { code: "Wechat", name: "微信" },
        { code: "Alipay", name: "支付宝" },
        { code: "OffLinePay", name: "线下" }
      ],
      orderStatuss: [
        { code: "Obligation", name: "待付款" },
        { code: "Shipped", name: "待发货" },
        { code: "Received", name: "待收货" },
        { code: "Completed", name: "已完成" },
        { code: "Canceled", name: "已取消" }
      ]
    };
  },
  created() {
    if (this.guid) {
      this.handleFilter();
    }
  },
  methods: {
    ///查询
    handleFilter() {
      this.dialogLoading = true;
      GetMemberOrderPageAsync(this.query).then(
        response => {
          this.grid.list = response.data.currentPage;
          this.grid.total = response.data.total;
          setTimeout(() => {
            this.dialogLoading = false;
          }, 200);
        },
        err => {
          this.dialogLoading = false;
        }
      );
    },
    getTypeName(code) {
      let name;
      this.payTypes.forEach(element => {
        if (element.code.toUpperCase() == code.toUpperCase())
          name = element.name;
      });
      return name;
    },
    formatterDate(val, f) {
      return parseTime(new Date(val), f);
    },
    formatterMoney(val) {
      return formatCurrency(val);
    }
  }
};
</script>
<style>
</style>


      
  
