<template>
  <div>
    <el-form :inline="true" :model="query">
      <el-form-item>
        <el-date-picker
          v-model="date"
          type="daterange"
          range-separator="-"
          start-placeholder="提交时间"
          end-placeholder="至"
          class="filter-item"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
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
      <el-table-column align="center" label="序列" width="65">
        <template slot-scope="scope">{{ scope.$index+1 }}</template>
      </el-table-column>

      <el-table-column label="联系人" width="200" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.adviser }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系电话" width="180" align="left">
        <template slot-scope="scope">{{ scope.row.adviserPhone||"无" }}</template>
      </el-table-column>
      <el-table-column label="邮箱" width="220" align="left">
        <template slot-scope="scope">{{ scope.row.adviserEmail||"无" }}</template>
      </el-table-column>
      <el-table-column label="内容" align="left">
        <template slot-scope="scope">{{ scope.row.adviseContent||"无" }}</template>
      </el-table-column>
      <el-table-column label="创建时间" width="160" align="center">
        <template slot-scope="scope">{{ toDateString(scope.row.creationDate) }}</template>
      </el-table-column>
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
import { GetAdvisePageAsync } from "@/api/Advise";
import Pagination from "@/components/Pagination";
import { parseTime } from "@/utils/index";
export default {
  components: { Pagination },
  data() {
    return {
      date: [],
      query: {
        beginDate: null,
        endDate: null,
        sortField: null,
        isAscending: true,
        pageIndex: 1,
        pageSize: 10
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
          helpGuid: null,
          question: null,
          answer: null,
          enable: true,
          sort: 1
        },
        //表单验证
        rules: {
          question: [
            { required: true, message: "必填", trigger: "change" },
            { max: 200, message: "长度不能超过200", trigger: "change" }
          ],
          answer: [
            { required: true, message: "必填", trigger: "change" },
            { max: 2000, message: "长度不能超过2000", trigger: "change" }
          ]
        }
      }
    };
  },
  watch: {
    date(val) {
      let t = this;
      if (val && val.length > 0) {
        t.query.beginDate = parseTime(val[0], "{y}-{m}-{d}");
        t.query.endDate = parseTime(val[1], "{y}-{m}-{d}");
      } else {
        t.query.beginDate = null;
        t.query.endDate = null;
      }
    }
  },
  created() {
    this.handleFilter();
  },
  methods: {
    //加载表格数据
    handleFilter() {
      this.listLoading = true;
      GetAdvisePageAsync(this.query).then(
        response => {
          this.list = response.data.currentPage;
          this.total = response.data.total;
          setTimeout(() => {
            this.listLoading = false;
          }, 200);
        },
        err => {
          this.listLoading = false;
        }
      );
    },
    //添加
    handleAdd() {
      let t = this;
      t.form.info = {
        enable: true,
        sort: 1
      };
      t.form.dialogEditVisible = true;
      t.form.dialogEditStatus = "add";
      t.form.dialogEditTitle = "添加问题";
      t.$nextTick(() => {
        t.$refs["dataForm"].clearValidate();
      });
    },
    //搜索
    handleSearch() {
      let t = this;
      t.query.pageIndex = 1;
      t.handleFilter();
    },
    toDateString(a) {
      return parseTime(new Date(a));
    }
  }
};
</script>
<style>
</style>

