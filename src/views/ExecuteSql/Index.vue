<template>
  <div class="app-container">
    <el-input type="textarea" :rows="8" placeholder="请输入sql" v-model="query.sql"></el-input>
    <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">执行sql</el-button>
    <div class="filter-container">
      <el-checkbox-group v-model="columns">
        <el-checkbox v-for="item in columns2" :key="item" :label="item">{{item}}</el-checkbox>
      </el-checkbox-group>
    </div>

    <el-table
      :data="list"
      v-loading="listLoading"
      border
      fit
      highlight-current-row
      max-height="500"
      style="width: 100%"
      @sort-change="handleOrderBy"
    >
      <el-table-column align="center" label="序列" width="65">
        <template slot-scope="scope">{{ scope.$index+1 }}</template>
      </el-table-column>
      <el-table-column
        :min-width="'120px'"
        :sortable="'custom'"
        :prop="item"
        v-for="item in columns"
        :key="item"
        :label="item"
      >
        <template slot-scope="scope">
          <span class="assss" :title="scope.row[item]">{{ scope.row[item] }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total.sync="total"
      :page.sync="query.pageIndex"
      :limit.sync="query.pageSize"
      :pageSizes="[100,200,300,500,1000]"
      @pagination="handleSearch"
    />
  </div>
</template>

<script>
import { QueryAsync } from "@/api/ExecuteSql";
import Pagination from "@/components/Pagination";
export default {
  components: { Pagination },
  data() {
    return {
      query: {
        pageIndex: 1,
        pageSize: 1000,
        sql: null
      },
      total: 0,
      list: [],
      listLoading: false,
      columns: [],
      columns2: []
    };
  },

  methods: {
    handleSearch() {
      console.log(this.query);
      console.log(this.total);

      this.listLoading = true;
      QueryAsync(this.query).then(
        response => {
          this.list = response.data.currentPage;
          this.total = response.data.total;
          this.columns = response.data.columns;
          this.columns2 = [...response.data.columns];
          setTimeout(() => {
            this.listLoading = false;
          }, 200);
        },
        error => {
          this.listLoading = false;
        }
      );
    },
    handleOrderBy(a) {
      this.query.SortField = a.prop;
      this.query.IsAscending = a.order == "ascending";
      this.handleSearch();
    }
  }
};
</script>
<style scoped>
.assss {
  overflow: hidden;
  display: -webkit-box;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
</style>
