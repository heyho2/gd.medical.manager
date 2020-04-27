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
      <el-table-column align="center" label="序列" width="65">
        <template slot-scope="scope">{{ scope.$index+1 }}</template>
      </el-table-column>
      <el-table-column label="产品名称" align="left">
        <template slot-scope="scope">{{ scope.row.productName }}</template>
      </el-table-column>
      <el-table-column label="产品分类" align="left">
        <template slot-scope="scope">{{ scope.row.categoryName }}</template>
      </el-table-column>
      <el-table-column label="价格" width="110" align="right">
        <template slot-scope="scope">{{ formatterMoney(scope.row.productPrice) }}</template>
      </el-table-column>
      <el-table-column label="数量" width="110" align="right">
        <template slot-scope="scope">{{ scope.row.productCount }}</template>
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
import { GetOrderDetailPageAsync } from "@/api/Member";
import { formatCurrency, parseTime } from "@/utils/index";
import CountTo from "vue-count-to";
import Pagination from "@/components/Pagination";

export default {
  components: { CountTo, Pagination },
  props: {
    guid: { type: String }
  },
  watch: {
    guid(val) {
      this.handleFilter();
    }
  },
  data() {
    return {
      query: {
        orderGuid: this.guid,
        pageIndex: 1,
        pageSize: 10
      },
      grid: {
        listLoading: false,
        list: [],
        total: 0
      }
    };
  },
  created() {
    this.query.orderGuid = this.guid;
    if (this.guid) {
      this.handleFilter();
    }
  },
  methods: {
    ///查询
    handleFilter() {
      this.dialogLoading = true;
      GetOrderDetailPageAsync(this.query).then(
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


      
  
