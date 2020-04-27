<template>
  <div>
    <el-input
      placeholder="输入关键字搜索"
      style="width:300px;float: right;"
      v-model="query.keyword"
      class="input-with-select"
    >
      <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
    </el-input>
    <el-table
      ref="multipleTable"
      v-loading="grid.listLoading"
      :data="grid.list"
      element-loading-text="Loading"
      fit
      highlight-current-row
      @select="handleSelect"
      @select-all="handleSelectAll"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column align="center" label="序列" width="65">
        <template slot-scope="scope">{{ scope.$index+1 }}</template>
      </el-table-column>
      <el-table-column align="left" label="医生名称">
        <template slot-scope="scope">{{ scope.row.userName }}</template>
      </el-table-column>
      <el-table-column align="left" label="医院名称">
        <template slot-scope="scope">{{ scope.row.hospitalName }}</template>
      </el-table-column>
      <el-table-column align="left" label="科室名称">
        <template slot-scope="scope">{{ scope.row.officeName }}</template>
      </el-table-column>
    </el-table>
    <pagination
      :total="grid.total"
      :border="false"
      :page.sync="query.pageIndex"
      :limit.sync="query.pageSize"
      @pagination="handleFilter"
    />
  </div>
</template>

<script>
import { SearchDoctorAsync } from "@/api/Doctor";
import Pagination from "@/components/Pagination";
export default {
  components: { Pagination },
  props: {
    value: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      query: { keyword: null, pageIndex: 1, pageSize: 10 },
      grid: {
        listLoading: false,
        total: 0,
        list: []
      }
    };
  },
  watch: {},
  computed: {
    cValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("update:value", val);
      }
    }
  },

  created() {
    // this.$emit("beforeDataload", list => {
    //   this.cValue = list;
    //   this.handleFilter();
    // });
  },
  methods: {
    handleFilter() {
      var t = this;
      t.grid.listLoading = true;
      SearchDoctorAsync(t.query).then(
        response => {
          t.grid.list = response.data.currentPage;
          t.grid.total = response.data.total;
          setTimeout(() => {
            t.grid.listLoading = false;
          }, 200);
          this.$nextTick(function() {
            this.checked(); //每次更新了数据，触发这个函数即可。
          });
        },
        error => {
          t.grid.listLoading = false;
        }
      );
    },
    //搜索
    handleSearch() {
      this.query.pageIndex = 1;
      this.handleFilter();
    },
    handleSelect(selection, row) {
      let guid = row.doctorGuid;
      var list = this.cValue || [];
      let selected = selection.length && selection.indexOf(row) !== -1;
      if (selected) {
        list.push(guid);
      } else {
        var index = list.indexOf(guid);
        if (index > -1) {
          list.splice(index, 1);
        }
      }
      this.cValue = list;
      this.$emit("beforeSelect", guid, selected);
    },
    handleSelectAll(selection) {
      debugger;
      var list = this.cValue || [];
      let selected = selection.length;
      this.grid.list.forEach(item => {
        let guid = item.doctorGuid;
        if (selected) {
          var index = list.indexOf(guid);
          if (index == -1) {
            list.push(guid);
          }
        } else {
          var index = list.indexOf(guid);
          if (index > -1) {
            list.splice(index, 1);
          }
        }
      });
      this.$emit("beforeSelectAll", list);
    },
    checked() {
      var t = this;
      t.cValue = t.cValue || [];
      t.grid.list.forEach(item => {
        if (t.cValue.includes(item.doctorGuid)) {
          t.$refs.multipleTable.toggleRowSelection(item, true);
        }
      });
    }
  }
};
</script>


      
  
