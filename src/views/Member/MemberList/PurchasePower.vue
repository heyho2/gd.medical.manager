<template>
  <div>
    <div class="filter-container" style="margin-bottom: 10px;">
      <div>
        <span class="filter_title">最近消费:</span>
        <ul class="filter1_item">
          <li>不限</li>
          <li>3天内</li>
          <li>一周内</li>
          <li>两周内</li>
          <li>一个月内</li>
          <li>两个月内</li>
          <li>三个月内</li>
          <li>半年内</li>
          <li>自定义</li>
        </ul>
      </div>
      <div>
        <span class="filter_title">消费次数:</span>
        <ul class="filter1_item">
          <li>不限</li>
          <li>1次+</li>
          <li>2次+</li>
          <li>3次+</li>
          <li>4次+</li>
          <li>5次+</li>
          <li>10次+</li>
          <li>20次+</li>
          <li>自定义</li>
        </ul>
      </div>
      <div>
        <span class="filter_title">消费金额:</span>
        <ul class="filter1_item">
          <li>不限</li>
          <li>0-50</li>
          <li>51-100</li>
          <li>101-150</li>
          <li>151-200</li>
          <li>201-250</li>
          <li>251-300</li>
          <li>301-350</li>
          <li>自定义</li>
        </ul>
      </div>
      <div>
        <span class="filter_title">订单均价:</span>
        <ul class="filter1_item">
          <li>不限</li>
          <li>0-20</li>
          <li>21-50</li>
          <li>51-100</li>
          <li>101-150</li>
          <li>151-200</li>
          <li>201-250</li>
          <li>251-300</li>
          <li>301-350</li>
          <li>自定义</li>
        </ul>
      </div>
      <div>
        <span class="filter_title">商品类型:</span>
        <ul class="filter1_item">
          <li>不限</li>
          <li>中成药</li>
          <li>西药</li>
          <li>保健品</li>
          <li>保健品</li>
        </ul>
      </div>
      <div>
        <span class="filter_title">会员标签:</span>
        <ul class="filter1_item">
          <li>不限</li>
          <li>普通会员</li>
        </ul>
      </div>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序列" width="65">
        <template slot-scope="scope">{{ scope.$index+1 }}</template>
      </el-table-column>
      <el-table-column label="会员名" width="210" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.nickName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="会员等级">
        <template slot-scope="scope">{{ scope.row.pageviews }}</template>
      </el-table-column>
      <el-table-column label="消费金额" width="110" align="center">
        <template>
          <template slot-scope="scope">{{ scope.row.pageviews }}</template>
        </template>
      </el-table-column>
      <el-table-column label="消费次数" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.creationDate }}</template>
      </el-table-column>
      <el-table-column label="订单均价" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.creationDate }}</template>
      </el-table-column>
      <el-table-column label="最近购买时间" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.creationDate }}</template>
      </el-table-column>
      <el-table-column label="操作" width="110" align="center">
        <template slot-scope="scope">
          <el-button @click="handleView(scope.row)" type="text" size="small">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total="total"
      :page.sync="query.pageIndex"
      :limit.sync="query.pageSize"
      @pagination="handleFilter"
    />
    <ViewMember
      :dialogVisible.sync="form.dialogEditVisible"
      :dialogTitle="form.dialogEditTitle"
      :guid="form.guid"
    />
  </div>
</template>

<script>
import { GetAccountListAsync } from "@/api/User";
import Pagination from "@/components/Pagination";
import ViewMember from "./ViewMember";
export default {
  components: { Pagination, ViewMember },
  data() {
    return {
      query: {
        pageIndex: 1,
        pageSize: 20,
        name: null,
        registeredDate: null,
        registeredEndDate: null
      },
      total: 0,
      list: [],
      listLoading: true,
      form: {
        dialogEditVisible: false,
        dialogEditTitle: "添加",
        dialogEditStatus: "add",
        //表单数据
        info: {
          account: "",
          password: ""
        },
        //表单验证
        rules: {
          account: [{ required: true, message: "账号必填", trigger: "change" }],
          password: [{ required: true, message: "密码必填", trigger: "change" }]
        }
      }
    };
  },
  watch: {},
  created() {
    this.handleFilter();
  },
  methods: {
    handleFilter() {
      this.listLoading = true;
      GetAccountListAsync(this.query).then(response => {
        this.list = response.data.currentPage;
        this.total = response.data.total;
        setTimeout(() => {
          this.listLoading = false;
        }, 200);
      });
    },
    //添加
    handleAdd() {
      this.form.info = {};
      this.form.dialogEditVisible = true;
      this.form.dialogEditStatus = "add";
      this.form.dialogEditTitle = "添加";
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    //修改
    handleUpdate(row) {
      this.form.info = Object.assign({}, row); // copy obj
      this.form.dialogEditVisible = true;
      this.form.dialogEditStatus = "update";
      this.form.dialogEditTitle = "修改";
    },
    handleSearch() {
      this.query.pageIndex = 1;
      this.handleFilter();
    },
    handleSave() {
      const tempData = Object.assign({}, this.form.info);
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.$notify({
            title: "成功",
            message: JSON.stringify(tempData),
            type: "success",
            duration: 2000
          });
        }
      });
    },
    //禁用/启用
    handleDisable(row) {
      alert("禁用");
    },
    //查看
    handleView(row) {
      this.form.dialogEditVisible = true;
      this.form.dialogEditStatus = "view";
      this.form.dialogEditTitle = "查看";
    }
  }
};
</script>
<style>
.filter-item {
  margin-bottom: 10px;
}
.filter1_item {
  margin: 0px;
  display: inline-block;
  padding: 0px;
}
.filter_title,
.filter1_item li {
  display: inline-block;
  padding: 5px 10px;
}
.filter1_item li:hover {
  cursor: pointer;
  background-color: aqua;
  border: 1px solid aqua;
}
</style>

