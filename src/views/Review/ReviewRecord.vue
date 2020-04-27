<template>
  <div>
    <!-- <el-table
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
      <el-table-column align="left" label="状态">
        <template slot-scope="scope">{{ scope.row.status }}</template>
      </el-table-column>
      <el-table-column align="left" label="描述">
        <template slot-scope="scope">{{ scope.row.rejectReason }}</template>
      </el-table-column>
      <el-table-column align="left" label="时间">
        <template slot-scope="scope">{{ scope.row.creationDate }}</template>
      </el-table-column>
    </el-table>
    <pagination
      :total="grid.total"
      :page.sync="query.pageIndex"
      :limit.sync="query.pageSize"
      @pagination="handleFilter"
      :autoScroll="false"
    />-->
    <el-timeline :reverse="reverse">
      <el-timeline-item
        v-for="(item, index) in grid.list "
        :key="index"
        :timestamp="parseTime(new Date(item.creationDate))"
      >{{`【${getStatusName(item.status)}】${item.rejectReason}`}}</el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import { GetReviewMerchantPageAsync } from "@/api/Review";
// import Pagination from "@/components/Pagination";
import { parseTime } from "@/utils/index";
import DoctorStatus from "@/views/Commons/DoctorStatus";
export default {
  props: {
    ownerGuid: {
      type: String,
      default: null
    },
    type: { type: String },
    creationDate: { type: String }
  },
  data() {
    return {
      reverse: true,
      query: {
        OwnerGuid: this.ownerGuid,
        type: this.type,
        pageIndex: 1,
        pageSize: 500
      },
      grid: {
        listLoading: false,
        total: 0,
        list: []
      },
      typeList: [
        { label: "草案", value: "draft" },
        { label: "通过", value: "approved" },
        { label: "待审核", value: "submit" },
        { label: "驳回", value: "reject" }
      ]
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
      GetReviewMerchantPageAsync(t.query).then(
        response => {
          t.grid.list = [
            ...(response.data.currentPage.length
              ? response.data.currentPage
              : [
                  {
                    status: "approved",
                    creationDate: this.creationDate,
                    rejectReason: "系统自动审核通过"
                  }
                ]),
            ...[
              {
                status: "submit",
                creationDate: this.creationDate,
                rejectReason: "申请"
              }
            ]
          ];
          t.grid.total = response.data.total;
          setTimeout(() => {
            t.grid.listLoading = false;
          }, 200);
        },
        error => {
          t.grid.listLoading = false;
        }
      );
    },
    parseTime,
    getStatusName(code) {
      let aaa;
      this.typeList.forEach(item => {
        if (item.value.toLowerCase() == code.toLowerCase()) {
          aaa = item.label;
        }
      });
      return aaa;
    }
  }
};
</script>


      
  
