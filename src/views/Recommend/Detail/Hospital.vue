<template>
  <div>
    <el-table
      ref="multipleTable"
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
      <el-table-column align="left" label="医院名称">
        <template slot-scope="scope">{{ scope.row.hosName }}</template>
      </el-table-column>
    </el-table>
    <pagination
      :total="grid.total"
      :page.sync="query.pageIndex"
      :limit.sync="query.pageSize"
      @pagination="handleFilter"
      :autoScroll="false"
    />
  </div>
</template>

<script>
import { GetRecommendHospitalListAsync } from "@/api/Recommend";
import Pagination from "@/components/Pagination";
export default {
  components: { Pagination },
  props: {
    recommendGuid: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      query: { recommendGuid: this.recommendGuid, pageIndex: 1, pageSize: 10 },
      grid: {
        listLoading: false,
        total: 0,
        list: []
      }
    };
  },
  watch: {},
  computed: {},
  created() {
    this.handleFilter();
  },
  methods: {
    handleFilter() {
      var t = this;
      t.grid.listLoading = true;
      GetRecommendHospitalListAsync(t.query).then(
        response => {
          t.grid.list = response.data.currentPage;
          t.grid.total = response.data.total;
          setTimeout(() => {
            t.grid.listLoading = false;
          }, 200);
        },
        error => {
          t.grid.listLoading = false;
        }
      );
    }
  }
};
</script>


      
  
