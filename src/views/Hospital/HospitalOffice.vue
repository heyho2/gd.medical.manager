<template>
  <div>
    <el-table
      :data="tree.list"
      v-loading="listLoading"
      element-loading-text="Loading"
      row-key="guid"
      :default-expand-all="true"
      :border="false"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column label="序列" type="index" align="center" width="60"></el-table-column>
      <el-table-column label="科室名称" align="left">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { GetHospitalOfficeSelectAsync } from "@/api/Hospital";
export default {
  props: {
    hospitalGuid: {
      type: String
    }
  },
  created() {
    var t = this;
    t.listLoading = true;
    GetHospitalOfficeSelectAsync({ hospitalGuid: t.hospitalGuid }).then(
      response => {
        t.tree.list = response.data;
        setTimeout(() => {
          t.listLoading = false;
        }, 200);
      },
      error => {
        t.listLoading = false;
      }
    );
  },
  data() {
    return {
      listLoading: false,
      query: { name: null, SortField: "sort", IsAscending: false },
      tree: {
        list: []
      }
    };
  }
};
</script>