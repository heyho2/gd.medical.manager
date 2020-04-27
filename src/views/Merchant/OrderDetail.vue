<template>
  <div>
    <el-form :inline="true" :model="query">
      <el-form-item>
        <el-date-picker
          v-model="date"
          type="daterange"
          range-separator="-"
          start-placeholder="注册时间"
          end-placeholder="至"
          class="filter-item"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-radio-group v-model="days">
          <el-radio-button label="1">近一天</el-radio-button>
          <el-radio-button label="3">近三天</el-radio-button>
          <el-radio-button label="7">近七天</el-radio-button>
          <el-radio-button label="30">近一个月</el-radio-button>
        </el-radio-group>
      </el-form-item>
    </el-form>
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
          <el-tabs tab-position="top">
            <el-tab-pane label="订单信息">
              <order-info
                :orderGuid="scope.row.orderGuid"
                :productGuid="scope.row.productGuid"
                :userGuid="scope.row.userGuid"
              />
            </el-tab-pane>
            <el-tab-pane label="订单详细">
              <order-detail-list :guid="scope.row.orderGuid"/>
            </el-tab-pane>
            <el-tab-pane label="用户订单记录">
              <order-list :guid="scope.row.userGuid"/>
            </el-tab-pane>
          </el-tabs>
        </template>
      </el-table-column>
      <el-table-column align="center" label="序列" width="65">
        <template slot-scope="scope">{{ scope.$index+1 }}</template>
      </el-table-column>
      <el-table-column label="订单号" align="center" width="230">
        <template slot-scope="scope">
          <span class>{{ scope.row.orderNo||'暂无' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户" align="left" width="130">
        <template slot-scope="scope">
          <span class="ssss">{{ scope.row.userName||'匿名' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品类别" align="left" width="130">
        <template slot-scope="scope">
          <span class="ssss">{{ scope.row.categoryName||'暂无分类' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品名称" align="left" min-width="130">
        <template slot-scope="scope">
          <span class="ssss">{{ scope.row.productName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="价格" align="right" width="100">
        <count-to
          slot-scope="scope"
          :start-val="0"
          :end-val="(scope.row.productPrice||0)"
          :decimals="2"
          separator=","
          prefix="￥"
          style="color: #F6416C;"
        />
      </el-table-column>
      <el-table-column label="数量" align="right" width="100">
        <template slot-scope="scope">{{ scope.row.productCount }}</template>
      </el-table-column>
      <el-table-column label="订单时间" width="160" align="center">
        <template slot-scope="scope">{{formatterDate(scope.row.orderDate) }}</template>
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
import { GetMerchantOrderDetailPageAsync } from "@/api/Merchant";
import { formatCurrency, parseTime } from "@/utils/index";
import Pagination from "@/components/Pagination";
import CountTo from "vue-count-to";
import OrderInfo from "./OrderInfo";
import OrderDetailList from "@/views/Member/MemberList/OrderDetailList";
import OrderList from "@/views/Member/MemberList/OrderList";

export default {
  components: { Pagination, CountTo, OrderInfo, OrderDetailList, OrderList },
  props: {
    guid: { type: String }
  },

  watch: {
    guid(val) {
      this.query.merchantGuid = val;
      this.handleFilter();
    },
    date(val) {
      let t = this;
      if (val && val.length > 0) {
        t.query.beginDate = parseTime(val[0], "{y}-{m}-{d}");
        t.query.endDate = parseTime(val[1], "{y}-{m}-{d}");
      } else {
        t.query.beginDate = null;
        t.query.endDate = null;
      }
    },
    days(val) {
      let t = this;
      var date = [];
      var startdate = new Date();
      switch (val) {
        case "1":
          startdate.setDate(startdate.getDate() - 1);
          break;
        case "3":
          startdate.setDate(startdate.getDate() - 3);
          break;
        case "7":
          startdate.setDate(startdate.getDate() - 7);
          break;
        case "30":
          startdate.setMonth(startdate.getMonth() - 1);
          break;
      }
      date.push(startdate);
      date.push(new Date());
      this.date = date;
    }
  },
  data() {
    return {
      days: null,
      date: null,
      query: {
        merchantGuid: this.guid,
        pageIndex: 1,
        pageSize: 10,
        beginDate: null,
        endDate: null
      },
      grid: {
        listLoading: false,
        list: [],
        total: 0
      }
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
      this.grid.listLoading = true;
      GetMerchantOrderDetailPageAsync(this.query).then(
        response => {
          this.grid.list = response.data.currentPage;
          this.grid.total = response.data.total;
          setTimeout(() => {
            this.grid.listLoading = false;
          }, 200);
        },
        err => {
          this.grid.listLoading = false;
        }
      );
    },
    handleSearch() {
      this.query.pageIndex = 1;
      this.handleFilter();
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
<style scoped>
.ssss {
  overflow: hidden;
  display: -webkit-box;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
</style>


      
  
